import React, { useState,  useContext, useEffect } from "react";
import Helmet from "../components/helmet/Helmet";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { toast } from "react-toastify";
import Loading from "../components/loading/Loading";
import { useMutation } from "react-query";
import authApi from "../api/AuthApi.js";
import jwt_decode from "jwt-decode"
import AuthContext from '../context/AuthProvider.js'

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser, setCurrentUser} =  useContext(AuthContext)

  
  useEffect(() => {
    if(currentUser){
      navigate('/home')
    }
  }, [currentUser])
  
  const fetchLogin = async (formData) => {
    try {
      const response = await authApi.customerLogin(formData);
      return response;
    } 
    catch (error) {
      setError(error.response.data);
      console.log("Failed to login: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (formData) => fetchLogin(formData),
  });

  const signIn = async (e) => {
    e.preventDefault();

    try {
      var formData = new FormData();
      formData.append("UserName", username);
      formData.append("Password", password);
      const user = await mutation.mutateAsync(formData);
      
      if(user){
        window.localStorage.setItem('userAuth', user)
        toast.success('Đã đăng nhập thành công.')
        setCurrentUser(jwt_decode(user))
        navigate('/checkout')
      }
      
    } catch (error) {
      console.log(error.messsage);
    }
  };

  return (
    <Helmet title="Login">
      {mutation.isLoading ? (
        <Loading />
      ) : (
        <section>
          <Container>
            <Row>
              <Col lg="6" className="m-auto text-center">
                <h3 className="fw-bold mb-4">Đăng nhập</h3>

                <Form className="auth__form" onSubmit={signIn}>
                  <FormGroup className="form__group">
                    <input
                      type="text"
                      placeholder="Tên đăng nhập"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="password"
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember"
                    />
                    <label className="text-white mx-2" htmlFor="remember">
                      {" "}
                      Ghi nhớ đăng nhập?
                    </label>
                  </FormGroup>

                  <p className="text-danger">{error}</p>
                  <button className="buy__btn auth__btn" type="submit">
                    Đăng nhập
                  </button>
                  <p>
                    Bạn chưa có tài khoản?{" "}
                    <Link to="/signup">Đăng ký tài khoản ngay</Link>
                  </p>
                  <p className="mt-2">
                    <Link to="/signup">Quên mật khẩu</Link>
                  </p>
                </Form>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </Helmet>
  );
};

export default Login;
