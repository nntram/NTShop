import React from 'react'
import { Link } from 'react-router-dom'

const CheckoutDetail = ({item}) => {
  
    return (
        <tr>
            <td> <img
                src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/products/${item.product.productimages[0].productimageurl}`} alt="" />
            </td>
            <td><Link to={`/shop/${item.product.productid}`}>{item.product.productname}</Link> </td>
            <td className='text-center'>{item.product.productsaleprice.toLocaleString()} VNĐ</td>
            <td className='text-center'>{item.cartdetailquantity}</td>
        </tr>
    )
}

export default CheckoutDetail