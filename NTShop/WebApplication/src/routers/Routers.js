import {Navigate, Route, Routes} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Home from '../pages/Home'
import Shop from '../pages/Shop'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ProductDetails from '../pages/ProductDetails'

import AddProduct from '../admin/AddProduct'
import AllProducts from '../admin/AllProducts'
import Dashboard from '../admin/Dashboard'
import Users from '../admin/Users'
import Loading from '../components/loading/Loading'

const Routers = () => {
  return <Routes>
    <Route path='/' element={<Navigate to="home" />}/>
    <Route path='loading' element={<Loading />}/>
    <Route path='home' element={<Home/>}/>
    <Route path='shop' element={<Shop/>}/>
    <Route path='cart' element={<Cart/>}/>
    <Route path='shop/:productId' element={<ProductDetails/>}/>
    
    <Route path='/*' element={<ProtectedRoute />}>
      <Route path='checkout' element={<Checkout />} />
      <Route path='dashboard' element={<Dashboard />} />
      <Route path='dashboard/all-products' element={<AllProducts />} />
      <Route path='dashboard/add-product' element={<AddProduct />} />
      <Route path='dashboard/users' element={<Users />} />
    </Route>

    <Route path='login' element={<Login/>}/>
    <Route path='signup' element={<Signup/>}/>
  </Routes>
}

export default Routers