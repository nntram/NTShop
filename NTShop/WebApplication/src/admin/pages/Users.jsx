import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import useGetData from '../../custom-hooks/useGetData'
import {toast} from 'react-toastify'
import {db} from '../../firebase.config'
import { doc, deleteDoc } from 'firebase/firestore'

const Users = () => {
  const { data: usersData, loading } = useGetData("users")
  const deleteUser = async (uid) => {
    await deleteDoc(doc(db, 'users', uid))
    toast.success("Deleted")
  }

    return (
        <section>
          <Container>
            <Row>
              <Col lg='12'>
                <h4 className='fw-bold'>Users</h4>
              </Col>
              <Col lg='12' className='pt-5'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                {
                  loading ? 
                  <tr className='py-5'>
                    <td colSpan={5}>Loading...</td>
                  </tr> :
                  usersData.map(item => (
                    <tr key={item.uid}>
                      <td><img src={item.photoURL} alt="" /></td>
                      <td>{item.displayName}</td>
                      <td>{item.email}</td>
                      <td>
                        <button className='btn btn-danger'
                            onClick={() => deleteUser(item.uid)} >
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

export default Users