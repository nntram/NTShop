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
          <Col lg='4' md='3' className='mb-4'>
            <div className="logo">
             
              <div>
                <h1 className='text-white'>
                  Multimart
                </h1>
              </div>
            </div>

            <p className="footer__text mt-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis atque explicabo accusantium tenetur eum odit optio, quidem alias necessitatibus cupiditate.
            </p>
          </Col>

          <Col lg='3' md='3' className='mb-4'>
            <div className="footer__quick-links">
              <h4 className="quick-links-title">Top Categories</h4>
              <ListGroup>
                <ListGroupItem className='ps-0 border-0'>
                  <Link to='#'>Mobiles Phone</Link>
                </ListGroupItem>
                <ListGroupItem className='ps-0 border-0'>
                  <Link to='#'>Modern Sofa</Link>
                </ListGroupItem>
                <ListGroupItem className='ps-0 border-0'>
                  <Link to='#'>Arm Chair</Link>
                </ListGroupItem>
                <ListGroupItem className='ps-0 border-0'>
                  <Link to='#'>Smart Watches</Link>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>

          <Col lg='2' md='3' className='mb-4'>
            <div className="footer__quick-links">
              <h4 className="quick-links-title">Useful Links</h4>
              <ListGroup>
                <ListGroupItem className='ps-0 border-0'>
                  <Link to='/shop'>Home</Link>
                </ListGroupItem>
                <ListGroupItem className='ps-0 border-0'>
                  <Link to='/shop'>Shop</Link>
                </ListGroupItem>
                <ListGroupItem className='ps-0 border-0'>
                  <Link to='/login'>Log in</Link>
                </ListGroupItem>
                <ListGroupItem className='ps-0 border-0'>
                  <Link to='#'>Privacy Policy</Link>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>

          <Col lg='3' md='4' className='mb-4'>
            <div className="footer__quick-links">
              <h4 className="quick-links-title">Contact</h4>
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