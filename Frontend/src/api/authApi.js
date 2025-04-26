import axios from './axios';

// Login API function
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/auth/login', { email, password });
    return response.data; // { token, user }
  } catch (error) {
    throw error.response.data.message || 'Login failed';
  }
};

// Register API (optional if needed)
export const registerUser = async (name, email, password, role) => {
  try {
    const response = await axios.post('/auth/register', { name, email, password, role });
    return response.data; // success message
  } catch (error) {
    throw error.response.data.message || 'Registration failed';
  }
};
