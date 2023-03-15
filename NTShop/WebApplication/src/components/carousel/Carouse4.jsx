import React, { useState } from 'react'
import CarouselCard from './CarouselCard'
import Carousel from 'react-grid-carousel'

const Carouse4 = ({ data }) => {

    return (
        <Carousel cols={4} rows={1} gap={10} loop showDots
            responsiveLayout={[
                {
                    breakpoint: 1200,
                    cols: 3
                },
                {
                    breakpoint: 990,
                    cols: 2
                }
            ]}
            mobileBreakpoint={670} >
            {
                data && data.map((item, index) =>
                    < Carousel.Item key={index}>
                        <CarouselCard item={item} />
                    </Carousel.Item>
                )

            }
        </Carousel >
    )
}

export default Carouse4