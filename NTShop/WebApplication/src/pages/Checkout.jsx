import React from 'react'
import { Container, Row, Col, Form, FormGroup} from 'reactstrap'
import Helmet from '../components/helmet/Helmet'
import CommonSection from '../components/UI/CommonSection'
import '../styles/checkout.css'
import {useSelector} from 'react-redux'

const Checkout = () => {
  const totalQty = useSelector(state => state.cart.totalQuantity)
  const totalAmount = useSelector(state => state.cart.totalAmount)
  return (
   <Helmet title='Đặt hàng'>
    <CommonSection title='Đặt hàng'/>
    <section>
      <Container>
        <Row>
          <Col lg='8'>
            <h6 className='mb-4 fw-bold'>Thông tin giao hàng</h6>
            <Form className='billing__form'>
              <FormGroup className='form__group'>
                <input type="text" placeholder='Enter your name'/>
              </FormGroup>
              <FormGroup className='form__group'>
                <input type="email" placeholder='Enter your email'/>
              </FormGroup>
              <FormGroup className='form__group'>
                <input type="number" placeholder='Phone number'/>
              </FormGroup>
              <FormGroup className='form__group'>
                <input type="text" placeholder='Street address'/>
              </FormGroup>
              <FormGroup className='form__group'>
                <input type="text" placeholder='City'/>
              </FormGroup>
              <FormGroup className='form__group'>
                <input type="text" placeholder='Postal code'/>
              </FormGroup>
              <FormGroup className='form__group'>
                <input type="text" placeholder='Country'/>
              </FormGroup>              
            </Form>
          </Col>

          <Col lg='4'>
            <div className="checkout__cart">
              <h6>Số sản phẩm: <span>{totalQty} sản phẩm</span></h6>
              <h6>Số tiền: <span>{totalAmount.toLocaleString()} VNĐ</span></h6>
              <h6>Phí giao hàng:  <span>Miễn phí</span></h6>
              <h4>Thành tiền: <span>{totalAmount.toLocaleString()} VNĐ</span></h4>

            <button className='buy__btn auth__btn w-100'>Place an order</button>

            </div>
          </Col>
        </Row>
      </Container>
    </section>


   </Helmet>
  )
}

export default Checkout