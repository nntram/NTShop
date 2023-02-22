import React from 'react'
import '../styles/cart.css'
import Helmet from '../components/helmet/Helmet'
import CommonSection from '../components/UI/CommonSection'
import { Col, Row, Container } from 'reactstrap'
import { motion } from 'framer-motion'
import { cartActions } from '../redux/slices/cartSlice'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems)
  const totalAmount = useSelector(state => state.cart.totalAmount)
  return (
    <Helmet title='Cart'>
      <CommonSection title='Shopping Cart' />
      <section>
        <Container>
          <Row>
            <Col lg='9'>
              {
                cartItems.length === 0 ?
                  (<h2 className='fs-4 text-center'>No item added to the cart.</h2>)
                  :
                  (<table className='table bodered'>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Delete</th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        cartItems.map((item, index) => (
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
                  Subtotal
                  <span className='fs-4 fw-bold'>${totalAmount}</span>
                </h5>
              </div>
              <p className='fs-6 mt-2'>Taxes and shipping will caculate in checkout</p>
              <div>
                <Link to='/checkout'>
                  <button className='buy__btn w-100'>
                    Checkout
                  </button>
                </Link>
                <Link to='/shop'>
                  <button className='buy__btn w-100 mt-3'>
                    Continue to shopping
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
    dispatch(cartActions.deleteItem(item.id))
  }

  return (
    <tr>
      <td> <img src={item.imgUrl} alt="" /></td>
      <td>{item.productName} </td>
      <td>${item.price}</td>
      <td>{item.quantity} px</td>
      <td>
        <span >
          <i
            className="ri-delete-bin-line"
            onClick={deleteProduct}>
          </i>
        </span>
      </td>
    </tr>
  )
}
export default Cart