import React from 'react'
import './footer.css'

import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap'
import { Link } from 'react-router-dom'

const Footer = () => {

  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg='6' md='4' className='mb-4'>
            <div className="logo">
             
              <div>
                <h1 className='text-white'>
                 Nari Cosmetic
                </h1>
              </div>
            </div>

            <p className="footer__text mt-4">
            Chúng tôi cam kết luôn mang đến sự hài lòng cho quý khách hàng. Các sản phẩm sẽ được đóng gói cẩn thận, giao hàng nhanh chóng. Đặc biệt, chúng tôi cam kết về nguồn gốc và chất lượng sản phẩm luôn được đảm bảo chính hãng. 
            </p>
          </Col>



          <Col lg='2' md='4' className='mb-4'>
            <div className="footer__quick-links">
              <h4 className="quick-links-title">Links</h4>
              <ListGroup>
                <ListGroupItem className='ps-0 border-0'>
                  <Link to='/home'>Trang chủ</Link>
                </ListGroupItem>
                <ListGroupItem className='ps-0 border-0'>
                  <Link to='/shop'>Sản phẩm</Link>
                </ListGroupItem>
                <ListGroupItem className='ps-0 border-0'>
                  <Link to='/login'>Đăng nhập</Link>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>

          <Col lg='4' md='4' className='mb-4'>
            <div className="footer__quick-links">
              <h4 className="quick-links-title">Liên hệ</h4>
              <ListGroup className='footer__contact'>
                <ListGroupItem className='ps-0 border-0 d-flex align-item-center gap-2'>
                  <span>
                    <i className="ri-map-2-line"></i>
                  </span>
                  <p>
                    3/2, Xuan Khanh, Ninh Kieu, Can tho
                  </p>
                </ListGroupItem>
                <ListGroupItem className='ps-0 border-0 d-flex align-item-center gap-2'>
                  <span>
                    <i className="ri-phone-line"></i>
                  </span>
                  <p>
                    +84 868 235 540
                  </p>
                </ListGroupItem>
                <ListGroupItem className='ps-0 border-0 d-flex align-item-center gap-2'>
                  <span>
                  <i className="ri-mail-line"></i>
                  </span>
                  <p>
                    ngoctram9t1@gmail.com
                  </p>
                </ListGroupItem>
              
              </ListGroup>
            </div>
          </Col>

        </Row>
      </Container>
    </footer>
  )
}

export default Footer