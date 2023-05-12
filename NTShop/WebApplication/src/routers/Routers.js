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
import AllProducts from '../admin/pages/AllProducts'
import Dashboard from '../admin/pages/Dashboard'
import Users from '../admin/pages/Users'
import Loading from '../components/loading/Loading'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Response from '../pages/Response'
import Orders from '../pages/Orders'
import Order from '../pages/Order'
import AdLogin from '../admin/pages/AdLogin'
import AllOrders from '../admin/pages/AllOrders'
import AdminRoute from './AdminRoute'
import DbOrder from '../admin/pages/DbOrder'
import ChangePassword from '../pages/ChangePassword.jsx'
import CustomerInfo from '../pages/CustomerInfo'
import AllCategories from '../admin/pages/AllCategories'
import AllBrands from '../admin/pages/AllBrands'
import AllSuppliers from '../admin/pages/AllSuppliers'
import AllWarehouseReceipts from '../admin/pages/AllWarehouseReceipts'
import CreateProduct from '../admin/pages/CreateProduct'
import CreateBrand from '../admin/pages/CreateBrand'
import CreateCategory from '../admin/pages/CreateCategory'
import CreateSupplier from '../admin/pages/CreateSupplier'
import CreateWarehouseReceipt from '../admin/pages/CreateWarehouseReceipt'
import EditProduct from '../admin/pages/EditProduct'
import EditBrand from '../admin/pages/EditBrand'
import EditCategory from '../admin/pages/EditCategory'
import EditSupplier from '../admin/pages/EditSupplier'
import EditWarehouseReceipt from '../admin/pages/EditWarehouseReceipts'

const Routers = () => {
  return <Routes>   
    <Route path='loading' element={<Loading />} />
    <Route path='home' element={<Home />} />
    <Route path='shop' element={<Shop />} />
    <Route path='shop/:productId' element={<ProductDetails key={window.location.pathname} />} />

    <Route path='login' element={<Login />} />
    <Route path='forgot-password' element={<ForgotPassword />} />
    <Route path='reset-password/:accessToken' element={<ResetPassword />} />
    <Route path='signup' element={<Signup />} />
    <Route path='response/:result' element={<Response />} />

    <Route path='admin-login' element={<AdLogin/>} />

    <Route element={<ProtectedRoute />}>
      <Route path='cart' element={<Cart />} />
      <Route path='orders' element={<Orders/>} />
      <Route path='order/:orderId' element={<Order/>} />
      <Route path='change-password' element={<ChangePassword />} />
      <Route path='customer-infor' element={<CustomerInfo />} />
      <Route path='checkout' element={<Checkout />} />
    </Route>

    <Route element={<AdminRoute />} >
      <Route path='dashboard/home' element={<Dashboard />} />
      <Route path='dashboard/all-orders' element={<AllOrders />} />
      <Route path='dashboard/all-orders/order/:orderId' element={<DbOrder />} />
      <Route path='dashboard/all-products' element={<AllProducts />} />
      <Route path='dashboard/all-categories' element={<AllCategories />} />
      <Route path='dashboard/all-brands' element={<AllBrands/>} />
      <Route path='dashboard/all-suppliers' element={<AllSuppliers/>} />
      <Route path='dashboard/all-warehouse-receipts' element={<AllWarehouseReceipts/>} />

      <Route path='dashboard/all-products/create' element={<CreateProduct />} />
      <Route path='dashboard/all-categories/create' element={<CreateCategory />} />
      <Route path='dashboard/all-brands/create' element={<CreateBrand />} />
      <Route path='dashboard/all-suppliers/create' element={<CreateSupplier />} />
      <Route path='dashboard/all-warehouse-receipts/create' element={<CreateWarehouseReceipt />} />

      <Route path='dashboard/all-products/:productId' element={<EditProduct />} />
      <Route path='dashboard/all-categories/:categoryId' element={<EditCategory />} />
      <Route path='dashboard/all-brands/:brandId' element={<EditBrand />} />
      <Route path='dashboard/all-suppliers/:supplierId' element={<EditSupplier />} />
      <Route path='dashboard/all-warehouse-receipts/:warehouseReceiptId' element={<EditWarehouseReceipt />} />

      <Route path='dashboard/users' element={<Users />} />
    </Route>

    <Route path='/*' element={<Navigate to="home" />} />

  </Routes>
}

export default Routers