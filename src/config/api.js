// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/api/products/`,
  PRODUCT_DETAIL: (id) => `${API_BASE_URL}/api/products/${id}`,
  USERS: `${API_BASE_URL}/api/users/`,
  ORDERS: `${API_BASE_URL}/api/orders/`,
  CARTS: `${API_BASE_URL}/api/carts/`,
}

export default API_BASE_URL
