import React from 'react'
import ProductCart from './ProductCard'

const ProductList = ({ data }) => {
    return (
        <>
            {
                data && data.map((item, index) => (
                    <ProductCart item={item} key={index}/>
                ))
            }
        </>
    )
}

export default ProductList