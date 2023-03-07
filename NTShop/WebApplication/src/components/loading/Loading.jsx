import React from 'react'
import loadingImage from '../../assets/images/Infinity-1s-200px.gif'
import './loading.css'

const Loading = () => {
  return (
    <div className='text-center'>
        <img className='loading' src={loadingImage} />
    </div>
  )
}

export default Loading