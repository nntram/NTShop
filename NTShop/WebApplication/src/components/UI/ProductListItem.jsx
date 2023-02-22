import React from 'react'
import ProductItem from './ProductItem'

const ProductListItem = ({ data }) => {
    return (
        <>
            {
                data.map((item, index) => (
                    <ProductItem item={item} key={index}/>
                ))
            }
        </>
    )
}

export default ProductListItem