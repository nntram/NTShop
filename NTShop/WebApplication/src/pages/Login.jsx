import React, { useState, useEffect, useRef, useCallback } from "react";
import Helmet from "../components/helmet/Helmet";
import { Container, Row, Col, Form, FormGroup, Input } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { toast } from "react-toastify";
import Loading from "../components/loading/Loading";
import { useMutation } from "react-query";
import authApi from "../api/AuthApi.js";
import jwt_decode from "jwt-decode";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useDispatch, useSelector } from 'react-redux'
import { customerActions } from "../redux/slices/customerSlice";

const Login = () => {
  const [token, setToken] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const eyeRef = useRef(null);
  const passwordRef = useRef(null);
  const currentUser = useSelector(state => state.customer.currentUser)
  const dispatch = useDispatch()

  const { executeRecaptcha } = useGoogleReCaptcha();
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }
    const token = await executeRecaptcha('login');
    setToken(token)
  }, [executeRecaptcha]);

  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
    handleReCaptchaVerify();
  }, [navigate, handleReCaptchaVerify, error]);

  const postLogin = async (formData) => {
    try {
      const response = await authApi.customerLogin(formData);
      return response;
    } catch (error) {
      setError(error.response.data);
      console.log("Failed to login: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (formData) => postLogin(formData),
  });

  const signIn = async (e) => {
    e.preventDefault();

    try {
      var formData = new FormData();
      formData.append("UserName", username);
      formData.append("Password", password);
      formData.append("Token", token);
      const userToken = await mutation.mutateAsync(formData);

      if (userToken) {
        try {
          const decode = JSON.stringify(jwt_decode(userToken))
          sessionStorage.setItem("currentUser", decode);
          sessionStorage.setItem("userAuth", userToken);
          localStorage.setItem("remember", remember);
          dispatch(customerActions.setCurrentUser(JSON.parse(decode)))
          if (remember) {
            localStorage.setItem("currentUser", decode);
            localStorage.setItem("userAuth", userToken);
          }

          toast.success("Đã đăng nhập thành công.");
          navigate("/cart");
        } catch {
          toast.error("Đã xảy ra lỗi.", { autoClose: false });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const eyeToggle = () => {
    eyeRef.current.classList.toggle("ri-eye-off-line");
    eyeRef.current.classList.toggle("ri-eye-line");

    if (eyeRef.current.classList.contains("ri-eye-off-line")) {
      passwordRef.current.type = 'password'
    }
    else {
      passwordRef.current.type = 'text'
    }
  };

  return (
    <Helmet title="Đăng nhập">
      <section className="auth__background">
        <Container>
          <Row>
            <Col lg="6" className="m-auto text-center">
              <h3 className="fw-bold mb-4 auth__title">
                Đăng nhập
              </h3>

              <Form className="auth__form" onSubmit={signIn}>
                <FormGroup>
                  <Input
                    required
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    required
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    innerRef={passwordRef}
                    onChange={(e) => setPassword(e.target.value)}
                    className="d-inline-block"
                  />
                  <i className="eye__button ri-eye-off-line"
                    ref={eyeRef} onClick={eyeToggle}></i>
                </FormGroup>
                <FormGroup>
                  <Input
                    type="checkbox"
                    className="form-check-Input"
                    id="remember"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                  />
                  <label className="text-white mx-2" htmlFor="remember">
                    {" "}
                    Ghi nhớ đăng nhập?
                  </label>
                </FormGroup>

                {error && <p className="text-danger">{error}</p>}
                {mutation.isLoading ? <Loading /> :
                  <>
                    <button className="buy__btn auth__btn" type="submit">
                      Đăng nhập
                    </button>
                    <p className="login-text">
                      Bạn chưa có tài khoản?{" "}
                      <Link to="/signup">Đăng ký tài khoản ngay</Link>
                    </p>
                    <p className="login-text mt-2">
                      <Link to="/forgot-password">Quên mật khẩu</Link>
                    </p>
                  </>
                }
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;
