import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequestOtp from "./pages/requestOtp";
import VendorApplicationForm from "./pages/VendorApplicationForm";
import Profile from "./pages/Profile";
import AddProductForm from "./components/AddProductForm";
import MyProducts from "./components/MyProducts";
import EditProduct from "./pages/EditProduct";
import VendorOrders from "./pages/VendorOrders";
import { useAuth } from "./context/AuthContext";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders"; // Fixed import
import AdminReviews from "./pages/admin/AdminReviews";

// Create a wrapper component for protected admin routes
const ProtectedAdminRoute = ({ children }) => {
  const { isAdmin, user } = useAuth();
  
  console.log("User:", user);
  console.log("Is Admin:", isAdmin());
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#5D866C] mb-4">Access Denied</h1>
          <p className="text-[#C2A68C]">Please login to access this page.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#5D866C] mb-4">Access Denied</h1>
          <p className="text-[#C2A68C]">You don't have admin privileges.</p>
          <p className="text-sm text-[#C2A68C] mt-2">Current role: {user?.role || 'none'}</p>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  const { isAdmin, isLoggedIn, user } = useAuth();
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes - Always register these routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/vendors"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <AdminVendors />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <AdminReviews />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="orders" element={<Orders />} />
          <Route path="login" element={<RequestOtp />} />
          <Route path="register" element={<Register />} />
          <Route path="become-vendor" element={<VendorApplicationForm />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/vendor/add-product" element={<AddProductForm />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/edit-product/:productId" element={<EditProduct />} />
          <Route path="/vendor-orders" element={<VendorOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;