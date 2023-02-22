import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import {db} from '../firebase.config'
import { doc, deleteDoc } from 'firebase/firestore'
import useGetData from '../custom-hooks/useGetData'
import {toast} from 'react-toastify'

const AllProducts = () => {
  const { data: productsData, loading } = useGetData("products")
  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id))
    toast.success("Deleted")
  }
  return (
    <section>
      <Container>
        <Row>
          <Col lg='12'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ? 
                  <tr className='py-5'>
                    <td colSpan={5}>Loading...</td>
                  </tr> :
                  productsData.map(item => (
                    <tr key={item.id}>
                      <td><img src={item.imgUrl} alt="" /></td>
                      <td>{item.productName}</td>
                      <td>{item.category}</td>
                      <td>${item.price}</td>
                      <td>
                        <button className='btn btn-danger'
                        onClick={() => deleteProduct(item.id)}>
                          Delete
                          </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default AllProducts