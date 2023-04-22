import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cartActions } from '../../redux/slices/cartSlice'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useMutation } from 'react-query'
import cartApi from '../../api/CartApi'
import { toast } from 'react-toastify'


const CartDetail = ({ item }) => {
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(item.cartdetailquantity)
    const currentTotalQuantity = useSelector(state => state.cart.totalQuantity)

    const validQuantity = (value) => {
        if (value < 1 || !value) {
            return;
        }
        if (item.product && value > item.product.productquantity) {
            toast.warning('Vượt quá số lượng sản phẩm.')
            return;
        }
        setQuantity(value)
    }

    const handleQuantity = (e) => {
        if (!e.target.validity.valid) {
            return;
        }
        setQuantity(e.target.value)
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

    const mutationAdd = useMutation({
        mutationFn: (data) => postAddToCart(data)
    });

    const addToCart = async (e, value) => {
        e.preventDefault()

        if (value > 0) {
            incrementQuantity()
        }
        else {
            decrementQuantity()
        }

        if (quantity + value > item.product.productquantity || quantity + value < 1) {
            return;
        }

        const data = {
            productid: item.product.productid,
            quantity: value
        }

        const result = await mutationAdd.mutateAsync(data)
        if (result) {
            const totalQuantity = currentTotalQuantity + Number(value)
            dispatch(cartActions.setTotalQuatity(totalQuantity))
            toast.success(result, { autoClose: 1000 })
        }

    }


    const postRemoveFromCart = async (data) => {
        try {
            const response = await cartApi.removeFromCart(data)
            return response;
        } catch (error) {
            toast.error(error.response.data, { autoClose: false })
            console.log("Failed to remove: ", error);
        }
    };

    const mutationRemove = useMutation({
        mutationFn: (data) => postRemoveFromCart(data)
    });

    const removeFromCart = async (e, id) => {
        e.preventDefault()

        const data = {
            CartDetailId: id,
        }

        const result = await mutationRemove.mutateAsync(data)
        if (result) {
            const totalQuantity = currentTotalQuantity - Number(quantity)
            dispatch(cartActions.setTotalQuatity(totalQuantity))
            toast.success(result, { autoClose: 1000 })
        }
    }

    return (
        <tr>
            <td> <img
                src={require(`../../assets/image_data/products/${item.product.productimages[0].productimageurl}`)} alt="" />
            </td>
            <td><Link to={`/shop/${item.product.productid}`}>{item.product.productname}</Link> </td>
            <td className='text-center'>{item.product.productsaleprice.toLocaleString()} VNĐ</td>
            
            <td>
                <div className='w-25 m-auto'>
                    <motion.button whileTap={{ opacity: 0.5 }} className='w-100 cart__btn'
                        onClick={(e) => addToCart(e, 1)}
                    >
                        <i className="ri-arrow-up-s-fill"></i>
                    </motion.button>

                    <input type="text"
                        readOnly
                        pattern="[0-9]*"
                        className="w-100 text-center"
                        value={quantity}
                        onChange={(e) => handleQuantity(e)}
                    />

                    <motion.button whileTap={{ opacity: 0.5 }} className='w-100 cart__btn'
                        onClick={(e) => addToCart(e, -1)}
                    >
                        <i className="ri-arrow-down-s-fill"></i>
                    </motion.button>
                </div>

            </td>
            <td className='text-center td__remove'>
                <motion.div className='text-danger remove__cartItem' whileTap={{ scale: 1.2 }}>
                    <i
                        className="ri-delete-bin-line"
                        onClick={(e) => removeFromCart(e, item.cartdetailid)}>
                    </i>
                </motion.div>
            </td>
        </tr>
    )
}

export default CartDetail