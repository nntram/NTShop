import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Home from '../pages/Home'
import Shop from '../pages/Shop'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ProductDetails from '../pages/ProductDetails'
import NotFound from '../components/UI/NotFound'
import AddProduct from '../admin/AddProduct'
import AllProducts from '../admin/AllProducts'
import Dashboard from '../admin/Dashboard'
import Users from '../admin/Users'
import Loading from '../components/loading/Loading'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Response from '../pages/Response'
import Orders from '../pages/Orders'
import Order from '../pages/Order'
import AdLogin from '../admin/AdLogin'

const Routers = () => {
  return <Routes>
    <Route path='/' element={<Navigate to="home" />} />
    <Route path='loading' element={<Loading />} />
    <Route path='home' element={<Home />} />
    <Route path='shop' element={<Shop />} />
    <Route path='shop/:productId' element={<ProductDetails key={window.location.pathname} />} />

    <Route path='login' element={<Login />} />
    <Route path='forgot-password' element={<ForgotPassword />} />
    <Route path='reset-password/:accessToken' element={<ResetPassword />} />
    <Route path='signup' element={<Signup />} />
    <Route path='response/:result' element={<Response />} />

    <Route path='ad-login' element={<AdLogin/>} />


    <Route element={<ProtectedRoute />}>
      <Route path='cart' element={<Cart />} />
      <Route path='orders' element={<Orders/>} />
      <Route path='order/:orderId' element={<Order/>} />
      <Route path='reset-password' element={<ResetPassword />} />
      <Route path='checkout' element={<Checkout />} />
      <Route path='dashboard' element={<Dashboard />} />
      <Route path='dashboard/all-products' element={<AllProducts />} />
      <Route path='dashboard/add-product' element={<AddProduct />} />
      <Route path='dashboard/users' element={<Users />} />
    </Route>
    <Route path="*" element={<NotFound />} />

  </Routes>
}

export default Routers