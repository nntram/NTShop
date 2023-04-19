import React, { useState, useRef, useEffect } from 'react'
import CommonSection from '../components/UI/CommonSection'
import Helmet from '../components/helmet/Helmet'
import { Container, Row, Col } from 'reactstrap'
import { Link, useParams } from 'react-router-dom'
import '../styles/product-details.css'
import { motion } from 'framer-motion'
import ProductList from '../components/UI/ProductList'
import { toast } from 'react-toastify'
import ProductApi from '../api/ProductApi'
import Loading from '../components/loading/Loading'
import { useQuery } from 'react-query'
import NotFound from '../components/UI/NotFound'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { useMutation } from 'react-query';
import cartApi from '../api/CartApi'
import useGetCurrentUser from '../custom-hooks/useGetCurrentUser'
import useGetQuantity from '../custom-hooks/useGetQuantity'
import { useDispatch } from 'react-redux'
import { cartActions } from '../redux/slices/cartSlice'

const ProductDetails = () => {
  const { productId } = useParams()
  const [tab, setTab] = useState('desc')
  const [rating, setRating] = useState(null)
  const reviewUser = useRef('')
  const reviewMsg = useRef('')
  const currentUser = useGetCurrentUser()
  const [quantity, setQuantity] = useState('1')
  const currentTotalQuantity = useGetQuantity()
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

  const CustomToastWithLink = () => (
    <div>
      Vui lòng
      <Link to="/login" className='text-info'> Đăng nhập </Link>
      để tiếp tục.
    </div>
  );

  const fetchProductById = async (id) => {
    try {
      const response = await ProductApi.getById(id);

      return (response);
    } catch (error) {
      console.log('Failed to fetch product: ', error);
    }
  }

  const fetchProducts = async (categoryid, brandid) => {
    try {
      const response = await ProductApi.getAllCard({
        params: {
          pageSize: 8,
          brandid: brandid,
          categoryid: categoryid
        }
      });
      return (response);
    } catch (error) {
      console.log('Failed to fetch products: ', error)
    }
  }

  const queryProduct = useQuery(
    { queryKey: 'product', queryFn: ({ id = productId }) => fetchProductById(id) },
  )
  const product = queryProduct.data

  const queryRelatedProducts = useQuery(
    {
      queryKey: 'relatedProducts',
      queryFn: ({ categoryid = product ? product.categoryid : "",
        brandid = product ? product.brandid : "" }) =>
        fetchProducts(categoryid, brandid)
    },
  )
  const relatedProducts = queryRelatedProducts.data

  const validQuantity = (value) => {
    if (value < 1 || !value) {
      setQuantity(1)
      return;
    }
    if (product && value > product.productquantity) {
      setQuantity(product.productquantity)
      toast.warning('Vượt quá số lượng sản phẩm.')
      return;
    }
    setQuantity(value)
  }

  const handleQuantity = (e) => {
    if (!e.target.validity.valid) {
      return;
    }
    validQuantity(e.target.value)
  }
  const incrementQuantity = () => {
    const newValue = parseInt(quantity) + 1
    validQuantity(newValue)
  }

  const decrementQuantity = () => {
    const newValue = parseInt(quantity) - 1
    validQuantity(newValue)
  }
  const postAddToCart = async (data) => {
    try {
      const response = await cartApi.addToCart(data)
      return response;
    } catch (error) {
      toast.error(error.response.data, { autoClose: false })
      console.log("Failed to add product to cart: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => postAddToCart(data)
  });

  const addToCart = async () => {
    if (!currentUser) {
      toast.info(CustomToastWithLink, { autoClose: false })
      return;
    }
    const  data = {
      productId,
      quantity
    }
    
    const result =  await mutation.mutateAsync(data)
    if(result)
    {
      dispatch(cartActions.setTotalQuatity(currentTotalQuantity + Number(quantity)))
      toast.success(result)
    }
   
  }


  if (queryProduct.isLoading) {
    return <Loading />
  }

  if (queryProduct.isError) {
    return <div>{queryProduct.isError.message}</div>
  }

  return (
    product ?
      <Helmet title={product.productname}>
        <CommonSection title={product.productname} />

        <section>
          <Container>
            <Row>
              <Col lg='6'>
                <Carousel>
                  {
                    product.productimages && product.productimages.map((image) =>
                      <div key={image.productimageid}>
                        <img src={require(`../assets/image_data/products/${image.productimageurl}`)} />
                      </div>
                    )
                  }
                </Carousel>
              </Col>

              <Col lg='6'>
                <div className="product__details">
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
                    <h3>{product.productsaleprice.toLocaleString()} đ </h3>
                  </span>
                </div>

                <div className="product__quantity d-flex align-items-center
                                gap-3 mt-5">
                  <span>Số lượng:</span>
                  <div className="input-group w-25">
                    <div className="input-group-prepend">
                      <motion.button className="quantity__btn" whileTap={{ opacity: 0.5 }}
                        onClick={decrementQuantity}>
                        -
                      </motion.button>
                    </div>
                    <input type="text"
                      className="form-control text-center"
                      pattern="[0-9]*"
                      value={quantity}
                      onChange={(e) => handleQuantity(e)} />
                    <div className="input-group-prepend">
                      <motion.button className="quantity__btn" whileTap={{ opacity: 0.5 }}
                        onClick={incrementQuantity}>
                        +
                      </motion.button>
                    </div>
                  </div>


                </div>
                <div className="d-flex gap-2">
                  <motion.button className='buy__btn'
                    whileTap={{ scale: 1.2 }}
                    onClick={addToCart}>
                    <i className="ri-shopping-cart-2-line"> </i>
                    Thêm vào giỏ hàng
                  </motion.button>

                  <motion.button className="buy__btn" type="button"
                    whileTap={{ scale: 1.2 }}>
                    <i className="ri-heart-line"></i> Thêm vào sản phẩm yêu thích
                  </motion.button>
                </div>

                <div className="d-flex align-items-center gap-3 mt-5">
                  Chia sẻ:
                  <a href="#" className="fa-facebook"><i className="fa ri-facebook-line"></i></a>
                  <a href="#" className="fa-twitter"><i className="fa ri-twitter-line"></i></a>
                  <a href="#" className="fa-google"><i className="fa ri-google-fill"></i></a>
                </div>

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
                    (<div dangerouslySetInnerHTML={{ __html: product.productdescribe }} className='product__desc' />) :
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

              <Col lg='12' className='mb-3'>
                <h2 className='related__title'>Sản phẩm tương tự</h2>
              </Col>

              {relatedProducts ? <ProductList data={relatedProducts.items} /> : ""}

            </Row>
          </Container>
        </section>


      </Helmet > :
      <NotFound />
  )
}

export default ProductDetails