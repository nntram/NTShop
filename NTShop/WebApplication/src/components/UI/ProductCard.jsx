import React, {useState} from 'react'
import { motion } from 'framer-motion'
import '../../styles/product-card.css'
import { Col } from 'reactstrap'
import { Link} from 'react-router-dom'
import { cartActions } from '../../redux/slices/cartSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useMutation } from 'react-query'
import cartApi from '../../api/CartApi'
import { toast } from 'react-toastify'

const ProductCard = ({ item }) => {
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(item.cartdetailquantity)
    const currentTotalQuantity = useSelector(state => state.cart.totalQuantity)

    const postAddToCart = async (data) => {
        try {
            const response = await cartApi.addToCart(data)
            return response;
        } catch (error) {
            toast.error(error.response.data, { autoClose: false })
            console.log("Failed to add product to cart: ", error);
        }
    };

    const mutationAdd = useMutation({
        mutationFn: (data) => postAddToCart(data)
    });

    const addToCart = async (e, value) => {
        e.preventDefault()

        if (quantity + value > item.productquantity || quantity + value < 1) {
            return;
        }

        const data = {
            productid: item.productid,
            quantity: value
        }

        const result = await mutationAdd.mutateAsync(data)
        if (result) {
            dispatch(cartActions.setTotalQuatity(currentTotalQuantity + Number(value)))
            toast.success(result, { autoClose: 1000 })
        }

    }

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
                    <motion.span whileHover={{ scale: 1.2 }} 
                    onClick={(e) => addToCart(e, 1)}>
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

export default ProductCard