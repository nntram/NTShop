import React, { useState, useEffect } from 'react'
import { Row, Col, Container } from 'reactstrap'

import Helmet from '../components/helmet/Helmet'
import heroImg from '../assets/images/hero-img.png'
import '../styles/home.css'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import products from '../assets/data/products'
import counterImg from '../assets/images/counter-timer-img.png'

import Services from '../components/services/Services'
import ProductList from '../components/UI/ProductList'
import Clock from '../components/UI/Clock'

import ProductApi from '../api/ProductApi'
import { useQuery } from 'react-query'

const Home = () => {

  const [productList, setProductList] = useState([]);

  const fetchProductList = async () => {
    try {
      const response = await ProductApi.getAllCard();
      setProductList(response);
    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
}

  const [trendingProduct, setTrendingProduct] = useState([])
  const [bestSaleProduct, setBestSaleProduct] = useState([])
  const [wirelessProduct, setWirelessProduct] = useState([])
  const [mobileProduct, setMobileProduct] = useState([])
  const [popularProduct, setPopularProduct] = useState([])

  useEffect(() => {
    const filteredTrendingProduct = productList.filter((item) => item.productishot === true).slice(0, 8)
    setTrendingProduct(filteredTrendingProduct)

    // const filteredBestSaleProduct = products.filter((item) => item.category === 'sofa')
    // setBestSaleProduct(filteredBestSaleProduct)
    // const filteredWirelessProduct = products.filter((item) => item.category === 'wireless')
    // setWirelessProduct(filteredWirelessProduct)
    // const filteredMobileProduct = products.filter((item) => item.category === 'mobile')
    // setMobileProduct(filteredMobileProduct)
    // const filteredPopularProduct = products.filter((item) => item.category === 'watch')
    // setPopularProduct(filteredPopularProduct)
  }, [productList])

  const { isLoading, isError, data, error } = useQuery('productList', fetchProductList)
 
  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <Helmet title={"Home"}>
      <section className='hero__section'>
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
              <img src={heroImg} alt="" />
            </Col>
          </Row>
        </Container>
      </section>

      <Services />

      <section className="trending__Products">
        <Container>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='section__title'>Sản phẩm nổi bật</h2>
            </Col>
            <ProductList data={trendingProduct} />
          </Row>
        </Container>
      </section>

      {/* <section className="best-sale__Products">
        <Container>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='section__title'> Best Sale Products</h2>
            </Col>
            <ProductList data={bestSaleProduct} />
          </Row>
        </Container>
      </section> */}

      <section className="timer__count">
        <Container>
          <Row>
            <Col lg='6' md='12' className='count__down-col'>
              <div className="clock__top-content">
                <h4 className='text-white fs-6 mb-2'>Limited Offers</h4>
                <h3 className='text-white fs-5 mb-3'>Quality Armchair</h3>
              </div>
              <Clock />
              <Link to='/shop'>
                <motion.button className="buy__btn  auth__btn" whileHover={{ scale: 1.1 }}>
                  Visit Store
                </motion.button>
              </Link>
            </Col>
            <Col lg='6' md='12' className='text-end counter__img'>
              <img src={counterImg} alt="" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* <section className="new__Arival">
        <Container>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='section__title'> New Arrivals</h2>
            </Col>
            <ProductList data={wirelessProduct} />
            <ProductList data={mobileProduct} />
          </Row>
        </Container>
      </section>

      <section className="popular__Products">
        <Container>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='section__title'> Popular In Category</h2>
            </Col>
            <ProductList data={popularProduct} />
          </Row>
        </Container>
      </section> */}
    </Helmet>
  )
}

export default Home