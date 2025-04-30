import axios from './axios';

// Login API function
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/auth/login', { email, password });
    
    // Check if response exists
    if (!response || !response.data) {
      throw new Error('No response from server');
    }

    // Check if we have the required data
    const { token, user } = response.data;
    if (!token || !user) {
      throw new Error('Invalid response format from server');
    }

    return {
      token,
      user,
      message: response.data.message || 'Login successful'
    };
  } catch (error) {
    // Handle axios error
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message || 'Invalid credentials');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Other errors
      throw new Error(error.message || 'Login failed');
    }
  }
};

// Register API function
export const registerUser = async (name, email, password, role) => {
  try {
    const response = await axios.post('/auth/register', { 
      name, 
      email, 
      password, 
      role 
    });

    if (!response || !response.data) {
      throw new Error('No response from server');
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'Registration failed');
    }
  }
};
