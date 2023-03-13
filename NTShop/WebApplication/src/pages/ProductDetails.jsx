import React, { useState, useRef, useEffect } from 'react'
import CommonSection from '../components/UI/CommonSection'
import Helmet from '../components/helmet/Helmet'
import { Container, Row, Col } from 'reactstrap'
import { useParams } from 'react-router-dom'
import '../styles/product-details.css'
import { motion } from 'framer-motion'
import ProductList from '../components/UI/ProductList'
import { toast } from 'react-toastify'
import ProductApi from '../api/ProductApi'
import Loading from '../components/loading/Loading'
import { useQueries } from 'react-query'

const ProductDetails = () => {
  const { productId } = useParams()
  const [tab, setTab] = useState('desc')
  const [rating, setRating] = useState(null)
  const reviewUser = useRef('')
  const reviewMsg = useRef('')


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
    // dispatch(cartActions.addItem({
    //   id: id,
    //   productName: productName,
    //   price: price,
    //   image: imgUrl
    // }))

    toast.success('Product added to cart.')
  }

  const fetchProductById = async (id) => {
    try {
      const response = await ProductApi.getById(id);

      return (response);
    } catch (error) {
      console.log('Failed to fetch product: ', error);
    }
  }

  const queryResults = useQueries([
    { queryKey: 'product', queryFn: ({ id = productId }) => fetchProductById(id) },
  ])
  const isLoading = queryResults.some(query => query.isLoading)
  const isError = queryResults.some(query => query.isLoading)

  // useEffect(() =>{
  //   window.scrollTo(0,0)
  // }, [queryResults])

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <span>Error: {isError.message}</span>
  }

  const product = queryResults[0].data



  return (
    <Helmet title={product.productname}>
      <CommonSection title={product.productname} />

      <section className='pt-0'>
        <Container>
          <Row>
            <Col lg='6'>
              <img src={require(`../assets/image_data/products/${product.productimages[0].productimageurl}`)} alt="" />
            </Col>

            <Col lg='6'>
              <div className="product__details mt-5">
                <h2>{product.productname}</h2>
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
                  (5 ratings)
                </p>
              </div>

              <div className="product__price d-flex gap-3 p-2">
                {
                  (product.productprice !== product.productsaleprice) ?
                    <del className="">
                      {product.productprice.toLocaleString()} đ
                    </del> : ""

                }
                <span className="price">
                  {product.productsaleprice.toLocaleString()} đ
                </span>
              </div>

              <motion.button className='buy__btn'
                whileTap={{ scale: 1.2 }}
                onClick={addToCart}>
                Thêm vào giỏ hàng
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
                  Mô tả sản phẩm
                </h6>
                <h6 className={`${tab === 'rev' ? 'active__tab' : ''}`} onClick={() => setTab('rev')}>
                  Đánh giá ()
                </h6>
              </div>
              <div className="tab__content mt-4">
                {tab === 'desc' ?
                  (<div dangerouslySetInnerHTML={{ __html: product.productdescribe }} className='product__desc'/> ) :
                  (<div className='product__reviews'>
                    <ul>
                      {
                        (
                          <li className='mb-4'>
                            <h6 className='mb-2'>Jonh</h6>
                            <span><i className="ri-star-fill"></i></span>
                            <span><i className="ri-star-fill"></i></span>
                            <span><i className="ri-star-fill"></i></span>
                            <span><i className="ri-star-fill"></i></span>
                            <span><i className="ri-star-line"></i></span>
                            <p>
                              Nothing hihi
                            </p>
                          </li>
                        )
                      }
                    </ul>

                    <div className="review__form">
                      <h4>Leave your experience</h4>
                      <form action="" onSubmit={submitHandler}>
                        <div className="form__group">
                          <input type="text" placeholder='Enter name' ref={reviewUser} required />
                        </div>

                        <div className="form__group d-flex align-items-center gap-5 rating__group">
                          <motion.span whileTap={{ scale: 1.2 }} onClick={() => setRating(1)}>1<i className="ri-star-fill"></i></motion.span>
                          <motion.span whileTap={{ scale: 1.2 }} onClick={() => setRating(2)}>2<i className="ri-star-fill"></i></motion.span>
                          <motion.span whileTap={{ scale: 1.2 }} onClick={() => setRating(3)}>3<i className="ri-star-fill"></i></motion.span>
                          <motion.span whileTap={{ scale: 1.2 }} onClick={() => setRating(4)}>4<i className="ri-star-fill"></i></motion.span>
                          <motion.span whileTap={{ scale: 1.2 }} onClick={() => setRating(5)} >5<i className="ri-star-fill"></i></motion.span>
                        </div>

                        <div className="form__group">
                          <textarea rows={4} type="text" placeholder='Enter you review...'
                            ref={reviewMsg} required />
                        </div>

                        <motion.button type='submit'
                          whileTap={{ scale: 1.2 }}
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

            <ProductList />
          </Row>
        </Container>
      </section>


    </Helmet >
  )
}

export default ProductDetails