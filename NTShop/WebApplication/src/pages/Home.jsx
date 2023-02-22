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
import ProductListItem from '../components/UI/ProductListItem'

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

  const year = new Date().getFullYear();
  const [trendingProduct, setTrendingProduct] = useState([])
  const [bestSaleProduct, setBestSaleProduct] = useState([])
  const [wirelessProduct, setWirelessProduct] = useState([])
  const [mobileProduct, setMobileProduct] = useState([])
  const [popularProduct, setPopularProduct] = useState([])

  useEffect(() => {
    const filteredTrendingProduct = products.filter((item) => item.category === 'chair')
    setTrendingProduct(filteredTrendingProduct)
    const filteredBestSaleProduct = products.filter((item) => item.category === 'sofa')
    setBestSaleProduct(filteredBestSaleProduct)
    const filteredWirelessProduct = products.filter((item) => item.category === 'wireless')
    setWirelessProduct(filteredWirelessProduct)
    const filteredMobileProduct = products.filter((item) => item.category === 'mobile')
    setMobileProduct(filteredMobileProduct)
    const filteredPopularProduct = products.filter((item) => item.category === 'watch')
    setPopularProduct(filteredPopularProduct)
  }, [])

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
            <Col lg='6' md='6'>
              <div className="hero__content">
                <p className="hero__subtitle">
                  Trending product in {year}
                </p>
                <h2>Make Your Interior More Minaimalistic & Modern</h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis magnam quae commodi rem nisi fuga repudiandae, enim itaque accusantium consequuntur, fugit cupiditate incidunt! Repudiandae, ipsam nisi animi culpa eligendi qui!
                </p>
                <Link to='/shop'>
                  <motion.button className='buy__btn' whileHover={{ scale: 1.2 }}>
                    SHOP NOW
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
              <h2 className='section__title'> Products</h2>
            </Col>
            <ProductListItem data={productList} />
          </Row>
        </Container>
      </section>


      <section className="trending__Products">
        <Container>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='section__title'> Trending Products</h2>
            </Col>
            <ProductList data={trendingProduct} />
          </Row>
        </Container>
      </section>

      <section className="best-sale__Products">
        <Container>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='section__title'> Best Sale Products</h2>
            </Col>
            <ProductList data={bestSaleProduct} />
          </Row>
        </Container>
      </section>

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

      <section className="new__Arival">
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
      </section>
    </Helmet>
  )
}

export default Home