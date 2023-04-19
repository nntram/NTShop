import React from 'react'
import '../styles/cart.css'
import Helmet from '../components/helmet/Helmet'
import CommonSection from '../components/UI/CommonSection'
import { Col, Row, Container } from 'reactstrap'
import { motion } from 'framer-motion'
import { cartActions } from '../redux/slices/cartSlice'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import cartApi from '../api/CartApi'
import Loading from '../components/loading/Loading'

const Cart = () => {

  const fetchCart = async (categoryid, brandid) => {
    try {
      const response = await cartApi.getCart();
      return (response);
    } catch (error) {
      console.log('Failed to fetch cart: ', error)
    }
  }

  const queryCart = useQuery(
    { queryKey: 'cart', queryFn: fetchCart },
  )

  if (queryCart.isLoading) {
    return <Loading />
  }
  const cart = queryCart.data
  let totalAmount = 0;
  if (cart.cartdetails.length > 0) {
    cart.cartdetails.map(item => {
      totalAmount += item.product.productsaleprice
    })
  }
  return (
    <Helmet title='Giỏ hàng'>
      <CommonSection title='Giỏ hàng' />
      <section>
        <Container>
          <Row>
            <Col lg='9'>
              {
                cart.cartdetails === 0 ?
                  (<h2 className='fs-4 text-center'>Bạn chưa thêm sản phẩm vào giỏ hàng.</h2>)
                  :
                  (<table className='table bodered'>
                    <thead>
                      <tr>
                        <th></th>
                        <th className='text-center'>Tên sản phẩm</th>
                        <th className='text-center'>Giá</th>
                        <th className='text-center'>Số lượng</th>
                        <th className='text-center text-danger'>Xóa</th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        cart.cartdetails.map((item, index) => (
                          <Tr item={item} key={index} />

                        ))
                      }
                    </tbody>
                  </table>)
              }

            </Col>
            <Col lg='3'>
              <div>
                <h5 className='d-flex align-items-center justify-content-between'>
                  Tổng
                  <span className='fs-4 fw-bold'>{totalAmount.toLocaleString()} VNĐ </span>
                </h5>
              </div>
              <p className='fs-6 mt-2'>Miễn phí giao hàng</p>
              <div>
                <Link to='/checkout'>
                  <button className='buy__btn w-100'>
                    Đặt hàng
                  </button>
                </Link>
                <Link to='/shop'>
                  <button className='buy__btn w-100 mt-3'>
                    Mua sắm tiếp
                  </button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

    </Helmet>
  )
}

const Tr = ({ item }) => {
  const dispatch = useDispatch()

  const deleteProduct = () => {
    //dispatch(cartActions.deleteItem(item.id))
  }

  return (
    <tr>
      <td> <img
        src={require(`../assets/image_data/products/${item.product.productimages[0].productimageurl}`)} alt="" />
      </td>
      <td>{item.product.productname} </td>
      <td className='text-center'>{item.product.productsaleprice.toLocaleString()} VNĐ</td>
      {/* <td className='text-center'>{item.cartdetailquantity}</td> */}
      <td>
        <div className='w-25 m-auto'>
          <motion.button whileTap={{ opacity: 0.5 }} className='w-100 cart__btn'
          >
            <i className="ri-arrow-up-s-fill"></i>
          </motion.button>

          <input type="text"
            className="w-100 text-center"
            value={item.cartdetailquantity}
          />

          <motion.button whileTap={{ opacity: 0.5 }} className='w-100 cart__btn'
          >
             <i className="ri-arrow-down-s-fill"></i>
          </motion.button>
        </div>

      </td>
      <td className='text-center td__remove'>
        <motion.div className='text-danger remove__cartItem'  whileTap={{ scale: 1.2 }}>
          <i 
            className="ri-delete-bin-line"
            onClick={deleteProduct}>
          </i>
        </motion.div>
      </td>
    </tr>
  )
}
export default Cart