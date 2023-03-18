import React, { useState } from 'react'
import Helmet from '../components/helmet/Helmet'
import { Container, Row, Col, Form, FormGroup } from 'reactstrap'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/login.css'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase.config'
import { toast } from 'react-toastify'
import Loading from '../components/loading/Loading'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const signIn = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      setLoading(false)
      toast.success('Successfully logged in.')
      navigate('/checkout')
    }
    catch (error) {
      setLoading(false)
      toast.error(error.messsage)
    }
  }

  return (
    <Helmet title='Login'>
      <section>
        <Container>
          <Row>
            {
              loading ?
                <Loading /> :
                <Col lg='6' className='m-auto text-center'>
                  <h3 className='fw-bold mb-4'>Đăng nhập</h3>

                  <Form className='auth__form' onSubmit={signIn}>
                    <FormGroup className='form__group'>
                      <input type="email" placeholder='Enter your email'
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    </FormGroup>
                    <FormGroup className='form__group'>
                      <input type="password" placeholder='Enter your password'
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <input type="checkbox" className="form-check-input" id="remember"/>
                        <label className="text-white mx-2" for="remember"> Ghi nhớ đăng nhập?</label>
                    </FormGroup>

                    <button className='buy__btn auth__btn' type='submit'>Đăng nhập</button>
                    <p>Bạn chưa có tài khoản? {' '}
                      <Link to='/signup'>Đăng ký tài khoản ngay</Link>
                    </p>
                    <p className='mt-2'>
                      <Link to='/signup'>Quên mật khẩu</Link>
                    </p>
                  </Form>
                </Col>
            }

          </Row>
        </Container>
      </section>
    </Helmet>
  )
}

export default Login