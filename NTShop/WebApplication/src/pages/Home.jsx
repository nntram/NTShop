import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Container } from 'reactstrap'

import Helmet from '../components/helmet/Helmet'
import '../styles/home.css'
import { Link } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'

import products from '../assets/data/products'
import counterImg from '../assets/images/counter-timer-img.png'

import Services from '../components/services/Services'
import ProductList2 from '../components/UI/ProductList2'
import ProductList from '../components/UI/ProductList'
import Clock from '../components/UI/Clock'

import ProductApi from '../api/ProductApi'
import {useQueries } from 'react-query'
import ScrollList from '../components/UI/ScrollList'
import CategoryApi from '../api/CategoryApi'
import BrandApi from '../api/BrandApi'

import { HeroSection } from '../components/hero/HeroSection'
import Loading from '../components/loading/Loading'

const Home = () => {

  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);

  const fetchProductList = async () => {
    try {
      const response = await ProductApi.getAllCard({
        params: {
          Productishot: true
        }
      });
      setProductList(response.items);
      
    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
  }

  const fetchCategoryList = async () => {
    try {
      const response = await CategoryApi.getAll();
      setCategoryList(response.map((item) => ({
        id: item.categoryid,
        name: item.categoryname,
        image: item.categoryimage,
        type: "categories"
      })));
      
    } catch (error) {
      console.log('Failed to fetch category list: ', error);
    }
  }

  const fetchBrandList = async () => {
    try {
      const response = await BrandApi.getAll();
      setBrandList(response.map((item) => ({
        id: item.brandid,
        name: item.brandname,
        image: item.brandimage,
        type: "brands"
      })));
      
    } catch (error) {
      console.log('Failed to fetch brand list: ', error);
    }
  }
  const [trendingProduct, setTrendingProduct] = useState([])

  const scrollRef = useRef(null)
  const { } = useScroll({
    container: scrollRef
  })

  const queryResults = useQueries([
    { queryKey: 'products', queryFn: fetchProductList },
    { queryKey: 'categories', queryFn: fetchCategoryList },
    { queryKey: 'brands', queryFn: fetchBrandList },
  ])
  
  const isLoading = queryResults.some(query => query.isLoading)
  const isError = queryResults.some(query => query.isError)
  
  useEffect(() => {
    const filteredTrendingProduct = productList.filter((item) => item.productishot === true).slice(0, 8)
    setTrendingProduct(filteredTrendingProduct)
  }, [productList])


  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <span>Error: {isError.message}</span>
  }


  return (
    <Helmet title={"Home"}>

      <HeroSection />

      <Services />

      <section className="brands">
        <Container>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='section__title'>Thương hiệu</h2>
            </Col>
            <div ref={scrollRef} className='ulScroll'>
              <ScrollList data={brandList} />
            </div>
          </Row>
        </Container>
      </section>

      <section className="categories">
        <Container>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='section__title'>Loại sản phẩm</h2>
            </Col>
            <div ref={scrollRef} className='ulScroll'>
              <ScrollList data={categoryList} />
            </div>
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

      <section className="trending__Products">
        <Container>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='section__title'>Sản phẩm nổi bật</h2>
            </Col>
            <ProductList2 data={trendingProduct} />
          </Row>
        </Container>
      </section>
      <section className="popular__Products">
        <Container>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='section__title'> Popular In Category</h2>
            </Col>
            <ProductList data={products} />
          </Row>
        </Container>
      </section>



    </Helmet>
  )
}

export default Home