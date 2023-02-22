import React, { useState, useRef, useEffect } from 'react'
import CommonSection from '../components/UI/CommonSection'
import Helmet from '../components/helmet/Helmet'
import { Container, Row, Col } from 'reactstrap'
import { useParams } from 'react-router-dom'
import products from '../assets/data/products'
import '../styles/product-details.css'
import { motion } from 'framer-motion'
import ProductList from '../components/UI/ProductList'
import { useDispatch } from 'react-redux'
import { cartActions } from '../redux/slices/cartSlice'
import { toast } from 'react-toastify'

const ProductDetails = () => {
  const { id } = useParams()
  const product = products.find(item => item.id === id)

  const { imgUrl, productName, price, avgRating, reviews, description, shortDesc, category } = product
  const [tab, setTab] = useState('desc')
  const [rating, setRating] = useState(null)
  const reviewUser = useRef('')
  const reviewMsg = useRef('')
  const relatedProducts = products.filter(item => item.category === category)
  const dispatch = useDispatch()
  
  const submitHandler = (e) => {
    e.preventDefault()

    const reviewUserName = reviewUser.current.value
    const reviewUserMsg = reviewMsg.current.value

   const reviewObj = {
    userName: reviewUserName,
    text: reviewUserMsg,
    rating: rating
   }
 
   toast.success('Review submited.')
  }

  const addToCart = () => {
    dispatch(cartActions.addItem({
      id: id,
      productName: productName,
      price: price,
      image: imgUrl
    }))

    toast.success('Product added to cart.')
  }

  useEffect(() =>{
    window.scrollTo(0,0)
  }, [product])
  
  return (
    <Helmet title={productName}>
      <CommonSection title={productName} />

      <section className='pt-0'>
        <Container>
          <Row>
            <Col lg='6'>
              <img src={imgUrl} alt="" />
            </Col>

            <Col lg='6'>
              <div className="product__details mt-5">
                <h2>{productName}</h2>
                <h5 className='mb-3'>Category: {category}</h5>
              </div>
              <div className="product__rating d-flex align-items-center gap-5 mb-3">
                <div>
                  <span><i className="ri-star-fill"></i></span>
                  <span><i className="ri-star-fill"></i></span>
                  <span><i className="ri-star-fill"></i></span>
                  <span><i className="ri-star-fill"></i></span>
                  <span><i className="ri-star-half-fill"></i></span>
                </div>

                <p>
                  ({avgRating} ratings)
                </p>
              </div>
              <span className='product__price'>${price}</span>
              <p className='mt-3'>{shortDesc}</p>

              <motion.button className='buy__btn'
                whileTap={{ scale: 1.2 }}
                onClick={addToCart}>
                Add to cart
              </motion.button>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col lg='12'>
              <div className="tap__wrapper d-flex align-items-center gap-5">
                <h6 className={`${tab === 'desc' ? 'active__tab' : ''}`} onClick={() => setTab('desc')}>
                  Description
                </h6>
                <h6 className={`${tab === 'rev' ? 'active__tab' : ''}`} onClick={() => setTab('rev')}>
                  Review ({reviews.length})
                </h6>
              </div>
              <div className="tab__content mt-4">
                {tab === 'desc' ?
                  (<p>{description}</p>) :
                  (<div className='product__reviews'>
                    <ul>
                      {
                        reviews?.map((item, index) => (
                          <li key={index} className='mb-4'>
                            <h6 className='mb-2'>Jonh</h6>
                            <span><i className="ri-star-fill"></i></span>
                            <span><i className="ri-star-fill"></i></span>
                            <span><i className="ri-star-fill"></i></span>
                            <span><i className="ri-star-fill"></i></span>
                            <span><i className="ri-star-line"></i></span>
                            <p>
                              {item.text}
                            </p>
                          </li>
                        ))
                      }
                    </ul>

                    <div className="review__form">
                      <h4>Leave your experience</h4>
                      <form action="" onSubmit={submitHandler}>
                        <div className="form__group">
                          <input type="text" placeholder='Enter name' ref={reviewUser} required/>
                        </div>

                        <div className="form__group d-flex align-items-center gap-5 rating__group">
                          <motion.span whileTap={{scale:1.2}} onClick={() => setRating(1)}>1<i className="ri-star-fill"></i></motion.span>
                          <motion.span whileTap={{scale:1.2}} onClick={() => setRating(2)}>2<i className="ri-star-fill"></i></motion.span>
                          <motion.span whileTap={{scale:1.2}} onClick={() => setRating(3)}>3<i className="ri-star-fill"></i></motion.span>
                          <motion.span whileTap={{scale:1.2}} onClick={() => setRating(4)}>4<i className="ri-star-fill"></i></motion.span>
                          <motion.span whileTap={{scale:1.2}} onClick={() => setRating(5)} >5<i className="ri-star-fill"></i></motion.span>
                        </div>

                        <div className="form__group">
                          <textarea rows={4} type="text" placeholder='Enter you review...' 
                                    ref={reviewMsg} required/>
                        </div>

                        <motion.button type='submit' 
                          whileTap={{scale: 1.2}}
                          className='buy__btn'>
                          Submit
                        </motion.button>
                      </form>
                    </div>
                  </div>)
                }

              </div>
            </Col>

            <Col lg='12' className='mt-5'>
              <h2 className='related__title'>You might also like</h2>
            </Col>

            <ProductList data={relatedProducts} />
          </Row>
        </Container>
      </section>


    </Helmet >
  )
}

export default ProductDetails