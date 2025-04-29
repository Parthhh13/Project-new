import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
import joblib
import os

class SalesForecastLSTM:
    def __init__(self, sequence_length=7):
        self.sequence_length = sequence_length
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.model = None
        
    def create_model(self, input_shape):
        model = Sequential([
            LSTM(50, activation='relu', input_shape=input_shape, return_sequences=True),
            Dropout(0.2),
            LSTM(50, activation='relu', return_sequences=False),
            Dropout(0.2),
            Dense(25, activation='relu'),
            Dense(1)
        ])
        model.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
        return model
    
    def prepare_data(self, data):
        """
        Prepare time series data for LSTM model
        data: pandas Series with daily sales data
        """
        # Scale the data
        scaled_data = self.scaler.fit_transform(data.values.reshape(-1, 1))
        
        X, y = [], []
        for i in range(len(scaled_data) - self.sequence_length):
            X.append(scaled_data[i:(i + self.sequence_length)])
            y.append(scaled_data[i + self.sequence_length])
            
        return np.array(X), np.array(y)
    
    def train(self, data, epochs=50, batch_size=32):
        """
        Train the LSTM model
        data: pandas Series with daily sales data
        """
        # Prepare data
        X, y = self.prepare_data(data)
        
        # Create and train model
        self.model = self.create_model((self.sequence_length, 1))
        history = self.model.fit(
            X, y,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=0.2,
            verbose=1
        )
        return history
    
    def predict_next_n_days(self, data, n_days=7):
        """
        Predict sales for the next n days
        data: pandas Series with daily sales data
        n_days: number of days to forecast
        """
        # Scale the data
        scaled_data = self.scaler.transform(data.values.reshape(-1, 1))
        
        # Get the last sequence
        last_sequence = scaled_data[-self.sequence_length:]
        
        predictions = []
        current_sequence = last_sequence.copy()
        
        # Predict n days ahead
        for _ in range(n_days):
            # Reshape for model input
            current_input = current_sequence.reshape(1, self.sequence_length, 1)
            # Get prediction
            next_pred = self.model.predict(current_input, verbose=0)
            predictions.append(next_pred[0])
            # Update sequence
            current_sequence = np.roll(current_sequence, -1)
            current_sequence[-1] = next_pred
            
        # Inverse transform predictions
        predictions = np.array(predictions).reshape(-1, 1)
        predictions = self.scaler.inverse_transform(predictions)
        
        return predictions.flatten()
    
    def save_model(self, model_path='model', scaler_path='scaler.pkl'):
        """Save the model and scaler"""
        if not os.path.exists(model_path):
            os.makedirs(model_path)
        self.model.save(model_path)
        joblib.dump(self.scaler, os.path.join(model_path, scaler_path))
    
    def load_model(self, model_path='model', scaler_path='scaler.pkl'):
        """Load the model and scaler"""
        from tensorflow.keras.models import load_model
        self.model = load_model(model_path)
        self.scaler = joblib.load(os.path.join(model_path, scaler_path))

# Example usage
if __name__ == "__main__":
    # Sample data generation
    dates = pd.date_range(start='2023-01-01', end='2023-12-31')
    # Generate synthetic sales data with trend and seasonality
    base = 100
    trend = np.linspace(0, 50, len(dates))
    seasonality = 20 * np.sin(2 * np.pi * np.arange(len(dates))/30)
    noise = np.random.normal(0, 5, len(dates))
    sales = base + trend + seasonality + noise
    
    # Create sample DataFrame
    df = pd.DataFrame({
        'date': dates,
        'sales': sales
    })
    df.set_index('date', inplace=True)
    
    # Initialize and train model
    model = SalesForecastLSTM(sequence_length=30)
    history = model.train(df['sales'], epochs=50)
    
    # Make predictions
    future_predictions = model.predict_next_n_days(df['sales'], n_days=7)
    print("\nPredicted sales for next 7 days:")
    for i, pred in enumerate(future_predictions):
        print(f"Day {i+1}: {pred:.2f}")
    
    # Save model
    model.save_model('sales_forecast_model') 