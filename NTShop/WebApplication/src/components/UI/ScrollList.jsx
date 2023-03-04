import React from 'react'
import ScrollCard from './ScrollCard'

const ScrollList = ({ data }) => {
    return (
        <>
            {
                data && data.map((item, index) => (
                    <ScrollCard item={item} key={index}/>
                ))
            }
        </>
    )
}

export default ScrollList