import React from 'react'
import { motion } from 'framer-motion'
import '../../styles/product-card.css'
import { Col } from 'reactstrap'
import { Link, useNavigate } from 'react-router-dom'

const ProductCard2 = ({ item }) => {
    return (
        <Col lg='3' md='4' className='my-2'>
            <div className='product__item border'>
                <div className="product__img">
                    <motion.img whileHover={{ scale: 0.9 }} alt=""
                        src={require("../../assets/image_data/products/" + item.productimages)} />
                </div>

                <div className="p-2 product__info">
                    <h3 className='product__name'>
                        <Link to={`/shop/${item.productid}`} 
                            data-toggle="tooltip" title={item.productname}>
                                {item.productname}
                        </Link>
                    </h3>
                    <span>{item.categoryname}</span>
                </div>
                <div className="product__card-bottom d-flex 
                        align-items-center justify-content-center gap-3 p-2">
                    {
                        (item.productprice !== item.productsaleprice) ?
                            <del className="">
                                {item.productprice.toLocaleString()} đ
                            </del> : ""

                    }
                    <span className="price">
                        {item.productsaleprice.toLocaleString()} đ
                    </span>
                </div>
                <div className="product__card-bottom d-flex 
                        align-items-center justify-content-center gap-3 p-2">
                    <motion.span whileHover={{ scale: 1.2 }} >
                        <i className="ri-shopping-cart-2-line"></i>
                    </motion.span>
                    <motion.span whileHover={{ scale: 1.2 }} >
                        <i className="ri-heart-line"></i>
                    </motion.span>
                </div>
            </div>
        </Col>
    )
}

export default ProductCard2