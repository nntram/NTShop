import React, { useState, useCallback, useMemo } from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container } from 'reactstrap'
import UploadImage from '../components/UploadImage'
import { useRef } from 'react'
import { useEffect } from 'react'





const CreateBrand = () => {
  const [myFiles, setMyFiles] = useState([])
  console.log(myFiles)
  return (
    <Helmet title='Tạo mới thương hiệu'>
      <CommonSection title='Tạo mới thương hiệu' />

      <UploadImage myFiles = {myFiles} setMyFiles = {setMyFiles} />


    </Helmet>
  )
}

export default CreateBrand