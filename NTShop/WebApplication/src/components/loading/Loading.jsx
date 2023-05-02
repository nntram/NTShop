import React from 'react'
import './loading.css'

const Loading = () => {
  const loadingImage = '/assets/images/Infinity-1s-200px.gif'
  
  return (
    <div className='text-center'>
        <img className='loading' src={loadingImage} />
    </div>
  )
}

export default Loading