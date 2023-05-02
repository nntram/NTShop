import React from 'react'
import Helmet from '../helmet/Helmet'


const NotFound = () => {
  const bgImg = "../../assets/images/404.jpg"
  
  return (
    <Helmet title='404'>
        <img src={bgImg} className='w-100'/>
    </Helmet>
  )
}

export default NotFound