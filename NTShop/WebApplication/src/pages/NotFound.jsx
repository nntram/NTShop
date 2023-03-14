import React from 'react'
import Helmet from '../components/helmet/Helmet'
import bgImg from "../assets/images/404.jpg"

const NotFound = () => {
  return (
    <Helmet title='404'>
        <img src={bgImg} className='w-100'/>
    </Helmet>
  )
}

export default NotFound