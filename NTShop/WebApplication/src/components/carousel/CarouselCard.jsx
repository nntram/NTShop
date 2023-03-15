import React from 'react'
import { motion } from 'framer-motion'
import './carousel-card.css'
import { Col } from 'reactstrap'
import { Link } from 'react-router-dom'

const CarouselCard = ({ item }) => {

    return (
        <Col className='m-2'>
            <div className='card__item border'>
                <div className="card__img">
                    <motion.img whileHover={{ scale: 0.9 }} alt=""
                        src={require("../../assets/image_data/" + item.type + "/" + item.image)} />
                </div>

                <div className="p-2 card__info text-center">
                    <h3 className='card__name'>
                        <Link to={`/shop/${item.id}`}
                            data-toggle="tooltip" title={item.name}>
                            {item.name}
                        </Link>
                    </h3>
                </div>
            </div>
        </Col>

    )
}

export default CarouselCard