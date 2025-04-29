import axios from './axios'; // our axios instance

// Get all products
export const getProducts = async () => {
  const response = await axios.get('/products');
  return response.data; // returns array of products
};

// Get total product count
export const getProductCount = async () => {
  const response = await axios.get('/products/count');
  return response.data.count; // returns the count
};

// Get low stock count
export const getLowStockCount = async () => {
  const response = await axios.get('/products/low-stock/count');
  return response.data.count; // returns the count
};

// Add a product
export const addProduct = async (productData: any, token: string) => {
  const response = await axios.post('/products', productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update a product
export const updateProduct = async (id: string, productData: any, token: string) => {
  const response = await axios.put(`/products/${id}`, productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete a product
export const deleteProduct = async (id: string, token: string) => {
  const response = await axios.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get low stock products
export const getLowStockProducts = async (token: string) => {
  const response = await axios.get('/products/low-stock', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
