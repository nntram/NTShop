import React, { useRef } from 'react'
import { Row, Col, Container } from 'reactstrap'

import Helmet from '../components/helmet/Helmet'
import '../styles/home.css'
import { Link } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'

import counterImg from '../assets/images/counter-timer-img.png'

import Services from '../components/services/Services'
import ProductList from '../components/UI/ProductList'
import Clock from '../components/UI/Clock'

import ProductApi from '../api/ProductApi'
import { useQueries } from 'react-query'
import ScrollList from '../components/UI/ScrollList'
import CategoryApi from '../api/CategoryApi'
import BrandApi from '../api/BrandApi'

import Loading from '../components/loading/Loading'

import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Carousel, CarouselIndicators, CarouselItem, CarouselControl } from 'reactstrap';
import { useState } from 'react'
import HeroSlider from '../components/hero/HeroSlider'
import HeroSlider2 from '../components/hero/HeroSlider2'


const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

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


  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <span>Error: {isError.message}</span>
  }

  const heroItems = [
    {
      id: 1,
      src: <HeroSlider />
    },
    {
      id: 2,
      src: <HeroSlider2 />
    }
  ];
  const onExiting = () => {
    setAnimating(true);
  }

  const onExited = () => {
    setAnimating(false);
  }

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === heroItems.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex)
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? heroItems.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex)
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex)
  }
  const slides = heroItems.map((item) => {
    return (
      <CarouselItem
        onExiting={onExiting}
        onExited={onExited}
        key={item.id}
      >       
        {item.src}       
      </CarouselItem>
    );
  });
  return (
    <Helmet title={"Home"}>

      <section name='hero' className='p-0'>
        <Carousel
          activeIndex={activeIndex}
          next={next}
          previous={previous}
        >
          <CarouselIndicators items={heroItems} activeIndex={activeIndex} onClickHandler={goToIndex} />
          {slides}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
        </Carousel>
      </section>

      <Services />

      <section className="brands">
        <Container>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className='section__title'>Thương hiệu</h2>
            </Col>
            <div ref={scrollRef} className='ulScroll'>
              <ScrollList data={queryResults[2].data} />
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
              <ScrollList data={queryResults[1].data} />
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
            <ProductList data={queryResults[0].data} />
          </Row>
        </Container>
      </section>


    </Helmet>
  )
}

export default Home