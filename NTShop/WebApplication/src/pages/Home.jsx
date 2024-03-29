import React from 'react'
import { Row, Col, Container } from 'reactstrap'

import Helmet from '../components/helmet/Helmet'
import '../styles/home.css'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import Services from '../components/services/Services'
import ProductList from '../components/UI/ProductList'
import Clock from '../components/UI/Clock'

import ProductApi from '../api/ProductApi'
import { useQueries } from 'react-query'
import CategoryApi from '../api/CategoryApi'
import BrandApi from '../api/BrandApi'

import Loading from '../components/loading/Loading'
import HeroSection from '../components/hero/HeroSection'
import Carouse4 from '../components/carousel/Carouse4'


const Home = () => {
  const counterImg = '/assets/images/counter-timer-img.png'

  const fetchProductList = async () => {
    try {
      const response = await ProductApi.getAllCard({
        params: {
          Productishot: true,
          Pagesize: 8
        }
      });

      return response.items
    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
  }

  const fetchCategoryList = async () => {
    try {
      const response = await CategoryApi.getAll();

      return response.map((item) => ({
        id: item.categoryid,
        name: item.categoryname,
        image: item.categoryimage,
        type: "categories"
      }))

    } catch (error) {
      console.log('Failed to fetch category list: ', error);
    }
  }

  const fetchBrandList = async () => {
    try {
      const response = await BrandApi.getAll();

      return response.map((item) => ({
        id: item.brandid,
        name: item.brandname,
        image: item.brandimage,
        type: "brands"
      }))

    } catch (error) {
      console.log('Failed to fetch brand list: ', error);
    }
  }

  const queryResults = useQueries([
    { queryKey: 'hotproducts', queryFn: fetchProductList },
    { queryKey: 'categories', queryFn: fetchCategoryList },
    { queryKey: 'brands', queryFn: fetchBrandList },
  ])

  const isSuccess = queryResults.every(query => query.isSuccess)
  const isError = queryResults.some(query => query.isError)

  if (isError) {
    return <span>Error: {isError.message}</span>
  }

  return (
    <Helmet title="Trang chủ">

      <HeroSection />

      <Services />

      {!isSuccess ? <Loading /> :
        <>
          <section className="brands">
            <Container>
              <Row>
                <Col lg='12' className='text-center'>
                  <h2 className='section__title'>Thương hiệu</h2>
                </Col>

                <Carouse4 data={queryResults[2].data} />

              </Row>
            </Container>
          </section>

          <section className="categories">
            <Container>
              <Row>
                <Col lg='12' className='text-center'>
                  <h2 className='section__title'>Loại sản phẩm</h2>
                </Col>

                <Carouse4 data={queryResults[1].data} />

              </Row>
            </Container>
          </section>
        </>
      }
      <section className="timer__count">
        <Container>
          <Row>
            <Col lg='6' md='12' className='count__down-col text-center mt-5 vert-move'>
              <h3 className='timer__text text-white'>
                Xem thêm nhiều sản phẩm hơn <i className="ri-arrow-down-s-line"></i>
              </h3>
              <Link to='/shop'>
                <motion.button className="buy__btn  auth__btn" whileHover={{ scale: 1.1 }}>
                  Tất cả sản phẩm
                </motion.button>
              </Link>
            </Col>
            <Col lg='6' md='12' className='text-end counter__img'>
              <img src={counterImg} alt="" />
            </Col>
          </Row>
        </Container>
      </section>
      {!isSuccess ? <Loading /> :
        <section className="trending__Products">
          <Container>
            <Row>
              <Col lg='12' className='text-center'>
                <h2 className='section__title'>Sản phẩm nổi bật</h2>
              </Col>
              <ProductList data={queryResults[0].data} />
            </Row>
          </Container>
        </section>
      }


    </Helmet>
  )
}

export default Home