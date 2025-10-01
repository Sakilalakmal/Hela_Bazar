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

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
