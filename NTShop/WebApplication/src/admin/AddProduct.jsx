import React, { useState } from 'react'
import { Container, Col, Row, Form, FormGroup } from 'reactstrap'
import { toast } from 'react-toastify'

import { db, storage } from '../firebase.config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { collection, addDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'


const AddProduct = () => {
  const [enterName, setEnterName] = useState("")
  const [enterShortDesc, setEnterShortDesc] = useState("")
  const [enterDescription, setEnterDescription] = useState("")
  const [enterCategory, setEnterCategory] = useState("chair")
  const [enterPrice, setEnterPrice] = useState("")
  const [enterProductImg, setEnterProductImg] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const addProduct = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const docRef = await collection(db, 'products')
      const storageRef = ref(storage, `productsImages/${Date.now() +
        enterProductImg.name}`)

      const uploadTask = uploadBytesResumable(storageRef, enterProductImg)
      uploadTask.on(() => {
        toast.error('Images not uploaded!')
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await addDoc(docRef, {
            productName: enterName,
            shortDescription: enterShortDesc,
            description: enterDescription,
            category: enterCategory,
            price: enterPrice,
            imgUrl: downloadURL,
          })
        })
      })
      setLoading(false)
      toast.success('Product added successfully.')
      navigate('/dashboard/all-products')
    }
    catch (err) {
      setLoading(false)
      toast.error('Product not uploaded!')
    }

  }

  return (
    <section>
      <Container>
        <Row>
          <Col lg='12'>
            {
              loading ? <h4 className='py-5'> Loading ...</h4> : <>
                <h4 className='mb-4'>Add Product</h4>
                <Form onSubmit={addProduct}>
                  <FormGroup className='form__group'>
                    <span>Product Name</span>
                    <input type="text" placeholder='Double sofa'
                      value={enterName} onChange={e => setEnterName(e.target.value)}
                      required />
                  </FormGroup>

                  <FormGroup className='form__group'>
                    <span>Short Descrition</span>
                    <input type="text" placeholder='lorem...'
                      value={enterShortDesc} onChange={e => setEnterShortDesc(e.target.value)}
                      required />
                  </FormGroup>

                  <FormGroup className='form__group'>
                    <span>Descrition</span>
                    <input type="text" placeholder='Desciption'
                      value={enterDescription} onChange={e => setEnterDescription(e.target.value)}
                      required />
                  </FormGroup>

                  <div className='d-flex align-items-center justify-content-between gap-5'>
                    <FormGroup className='form__group w-50'>
                      <span>Price</span>
                      <input type="number" placeholder='100'
                        value={enterPrice} onChange={e => setEnterPrice(e.target.value)}
                        required />
                    </FormGroup>
                    <FormGroup className='form__group w-50'>
                      <span>Category</span>
                      <select className='w-100 p-2'
                        value={enterCategory} onChange={e => setEnterCategory(e.target.value)}>
                        <option value="chair">Chair</option>
                        <option value="sofa">Sofa</option>
                        <option value="mobile">Mobile</option>
                        <option value="watch">Watch</option>
                        <option value="wireless">Wireless</option>
                      </select>
                    </FormGroup>
                  </div>

                  <div>
                    <FormGroup className='form__group'>
                      <span>Image</span>
                      <input type="file" required
                        onChange={e => setEnterProductImg(e.target.files[0])} />
                    </FormGroup>
                  </div>

                  <button className='buy__btn' type='submit'>Add Product</button>
                </Form>
              </>
            }
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default AddProduct