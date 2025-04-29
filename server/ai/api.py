from flask import Flask, request, jsonify
from sales_forecast import SalesForecastLSTM
import pandas as pd
from datetime import datetime, timedelta
import numpy as np

app = Flask(__name__)

# Initialize model
model = SalesForecastLSTM(sequence_length=30)

@app.route('/api/ai/train', methods=['POST'])
def train_model():
    try:
        # Get sales data from request
        data = request.json
        dates = [datetime.strptime(item['date'], '%Y-%m-%d') for item in data]
        sales = [float(item['sales']) for item in data]
        
        # Create DataFrame
        df = pd.DataFrame({
            'date': dates,
            'sales': sales
        })
        df.set_index('date', inplace=True)
        
        # Train model
        history = model.train(df['sales'], epochs=50)
        
        # Save model
        model.save_model('sales_forecast_model')
        
        return jsonify({
            'success': True,
            'message': 'Model trained successfully',
            'training_loss': float(history.history['loss'][-1])
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ai/forecast', methods=['POST'])
def get_forecast():
    try:
        # Get historical sales data from request
        data = request.json
        dates = [datetime.strptime(item['date'], '%Y-%m-%d') for item in data['historical_data']]
        sales = [float(item['sales']) for item in data['historical_data']]
        n_days = int(data.get('forecast_days', 7))
        
        # Create DataFrame
        df = pd.DataFrame({
            'date': dates,
            'sales': sales
        })
        df.set_index('date', inplace=True)
        
        # Load model if not already loaded
        try:
            model.load_model('sales_forecast_model')
        except:
            return jsonify({
                'success': False,
                'error': 'Model not trained yet'
            }), 400
        
        # Get predictions
        predictions = model.predict_next_n_days(df['sales'], n_days=n_days)
        
        # Generate future dates
        last_date = dates[-1]
        future_dates = [(last_date + timedelta(days=i+1)).strftime('%Y-%m-%d') 
                       for i in range(n_days)]
        
        # Format response
        forecast_data = [
            {
                'date': date,
                'predicted_sales': float(sales)
            }
            for date, sales in zip(future_dates, predictions)
        ]
        
        return jsonify({
            'success': True,
            'forecast': forecast_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ai/insights', methods=['POST'])
def get_insights():
    try:
        # Get sales data from request
        data = request.json
        dates = [datetime.strptime(item['date'], '%Y-%m-%d') for item in data]
        sales = [float(item['sales']) for item in data]
        
        # Create DataFrame
        df = pd.DataFrame({
            'date': dates,
            'sales': sales
        })
        df.set_index('date', inplace=True)
        
        # Calculate insights
        insights = {
            'trend': {
                'current': float(np.mean(sales[-7:])),  # Last 7 days average
                'previous': float(np.mean(sales[-14:-7])),  # Previous 7 days average
                'change_percentage': float((np.mean(sales[-7:]) - np.mean(sales[-14:-7])) / np.mean(sales[-14:-7]) * 100)
            },
            'peak_day': {
                'date': df['sales'].idxmax().strftime('%Y-%m-%d'),
                'sales': float(df['sales'].max())
            },
            'lowest_day': {
                'date': df['sales'].idxmin().strftime('%Y-%m-%d'),
                'sales': float(df['sales'].min())
            },
            'weekly_pattern': {
                'best_day': df.groupby(df.index.dayofweek)['sales'].mean().idxmax(),
                'worst_day': df.groupby(df.index.dayofweek)['sales'].mean().idxmin()
            }
        }
        
        return jsonify({
            'success': True,
            'insights': insights
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5001) 