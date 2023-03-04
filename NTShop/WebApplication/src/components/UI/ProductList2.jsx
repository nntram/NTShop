import React from 'react'
import ProductCart2 from './ProductCard2'

const ProductList = ({ data }) => {
    return (
        <>
            {
                data && data.map((item, index) => (
                    <ProductCart2 item={item} key={index}/>
                ))
            }
        </>
    )
}

export default ProductList