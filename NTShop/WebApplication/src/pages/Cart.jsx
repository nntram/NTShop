import React, { useEffect, useState } from 'react'
import '../styles/cart.css'
import Helmet from '../components/helmet/Helmet'
import CommonSection from '../components/UI/CommonSection'
import { Col, Row, Container } from 'reactstrap'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import cartApi from '../api/CartApi'
import Loading from '../components/loading/Loading'
import CartDetail from './CartDetail'
import { useSelector, useDispatch } from 'react-redux'
import { cartActions } from '../redux/slices/cartSlice'

const Cart = () => {
  let totalAmount = 0
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentTotalQuantity = useSelector(state => state.cart.totalQuantity)

  const checkAndUpdateCart = async () => {
    try {
      const response = await cartApi.check();
      return (response);
    } catch (error) {
      console.log('Failed to check and update cart: ', error)
    }
  }
  const mutation = useMutation({
    mutationFn: checkAndUpdateCart
  });

  const fetchCart = async () => {
    try {
      const response = await cartApi.getCart();
      return (response);
    } catch (error) {
      console.log('Failed to fetch cart: ', error)
    }
  }

  const queryCart = useQuery({
    queryKey: ['cart', currentTotalQuantity, mutation],
    queryFn: fetchCart, enabled: Boolean(currentTotalQuantity >= 0)
  })


  if (!queryCart.isSuccess) {
    return <Loading />
  }

  if (queryCart.isSuccess) {
    if (queryCart.data && queryCart.data.cartdetails.length > 0) {
      let sum = 0;
      queryCart.data.cartdetails.map(item => {
        sum += item.cartdetailquantity * item.product.productsaleprice
      })
      totalAmount = sum
    }
    else {
      totalAmount = 0
    }
  }

  const checkCart = async (e) => {
    e.preventDefault();

    if (queryCart.data.cartdetails.length < 1) {
      toast.warning('Không có sản phẩm trong giỏ hàng.')
      return;
    }

    const result = await mutation.mutateAsync()
    if(result === 0){
      navigate('/checkout', {state: {totalAmount: totalAmount}})
    }
    else{
      dispatch(cartActions.setTotalQuatity(currentTotalQuantity - Number(result)))
      toast.warning('Chúng tôi đã cập nhật giỏ hàng của bạn cho phù hợp với lượng hàng trong kho. Vui lòng kiểm tra lại.',
      {autoClose: false})
    }

  }

  return (
    <Helmet title='Giỏ hàng'>
      <CommonSection title='Giỏ hàng' />
      <section>
        <Container>
          <Row>
            <Col lg='9'>
              {
                queryCart.data && queryCart.data.cartdetails.length === 0 ?
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
                        queryCart.data && queryCart.data.cartdetails.map((item, index) => (
                          <CartDetail item={item} key={item.cartdetailid} />

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
                <button className='buy__btn w-100' onClick={checkCart}>
                  Đặt hàng
                </button>
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


export default Cart