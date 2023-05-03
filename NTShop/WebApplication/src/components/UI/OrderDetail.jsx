import React from 'react'
import { Link } from 'react-router-dom'

const OrderDetail = ({item}) => {
  
    return (
        <tr>
            <td> <img
                src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/products/${item.product.productimages[0].productimageurl}`} alt="" />
            </td>
            <td><Link to={`/shop/${item.product.productid}`}>{item.product.productname}</Link> </td>
            <td className='text-center'>{item.orderdetailprice.toLocaleString()} VNĐ</td>
            <td className='text-center'>{item.orderdetailquantity}</td>
        </tr>
    )
}

export default OrderDetail