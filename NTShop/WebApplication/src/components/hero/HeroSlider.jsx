import React from 'react'
import './hero-slider.css'
import heroImg from '../../assets/image_data/banners/hero-img-02.png'
import { Row, Col, Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const HeroSlider = () => {
    return (
        <section className='hero__section hero-slide'>
            <Container>
                <Row>
                    <Col lg='6' md='6' className='d-flex align-items-center'>
                        <div className="hero__content">
                            <p className="hero__subtitle">
                                Cửa hàng chúng tôi
                            </p>
                            <h2>Chuyên cung cấp sản phẩm chăm sóc sắc đẹp</h2>
                            <p>
                                Chúng tôi cam kết luôn mang đến sự hài lòng cho quý khách hàng. Các sản phẩm sẽ được đóng gói cẩn thận, giao hàng nhanh chóng. Đặc biệt, chúng tôi cam kết về nguồn gốc và chất lượng sản phẩm luôn được đảm bảo chính hãng. Còn chần chờ gì nữa, hãy lựa chọn sản phẩm ngay thôi nào.
                            </p>
                            <Link to='/shop'>
                                <motion.button className='buy__btn' whileHover={{ scale: 1.2 }}>
                                    <i className="ri-shopping-cart-2-line"></i> Mua sắm ngay
                                </motion.button>
                            </Link>
                        </div>
                    </Col>
                    <Col lg='6' md='6'>
                        <img src={heroImg}/>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default HeroSlider