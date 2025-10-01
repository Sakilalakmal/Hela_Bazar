const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Vendor Management
export const approveVendor = async (applicationId, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/approve/vendor/${applicationId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to approve vendor' }));
      throw new Error(errorData.message || 'Failed to approve vendor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Approve vendor error:', error);
    throw error;
  }
};

export const rejectVendor = async (applicationId, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/reject/vendor/${applicationId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to reject vendor' }));
      throw new Error(errorData.message || 'Failed to reject vendor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Reject vendor error:', error);
    throw error;
  }
};

// User Management
export const getAllConsumers = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/get/consumers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch consumers' }));
      throw new Error(errorData.message || 'Failed to fetch consumers');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get consumers error:', error);
    throw error;
  }
};

export const getAllVendors = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/get/vendors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch vendors' }));
      throw new Error(errorData.message || 'Failed to fetch vendors');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get vendors error:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/update/status/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ active: status }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update user status' }));
      throw new Error(errorData.message || 'Failed to update user status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Update user status error:', error);
    throw error;
  }
};

// Order Management
export const getAllOrders = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/get/all/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch orders' }));
      throw new Error(errorData.message || 'Failed to fetch orders');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get orders error:', error);
    throw error;
  }
};

export const getOrderDetails = async (orderId, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/get/one/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch order details' }));
      throw new Error(errorData.message || 'Failed to fetch order details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get order details error:', error);
    throw error;
  }
};

// Product Management
export const getAllProducts = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/get/all/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch products' }));
      throw new Error(errorData.message || 'Failed to fetch products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get products error:', error);
    throw error;
  }
};

export const deleteProduct = async (productId, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/product/delete/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete product' }));
      throw new Error(errorData.message || 'Failed to delete product');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Delete product error:', error);
    throw error;
  }
};

// Review Management
export const getAllReviews = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/get/all/reviews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch reviews' }));
      throw new Error(errorData.message || 'Failed to fetch reviews');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get reviews error:', error);
    throw error;
  }
};

// Delete review function - you'll need to add the backend route for this
export const deleteReview = async (reviewId, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/review/delete/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete review' }));
      throw new Error(errorData.message || 'Failed to delete review');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
};

// Additional function for getting vendor applications (if you have this endpoint)
export const getVendorApplications = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/vendor/applications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch vendor applications' }));
      throw new Error(errorData.message || 'Failed to fetch vendor applications');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get vendor applications error:', error);
    throw error;
  }
};