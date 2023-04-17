import React, { useState } from 'react'
import Helmet from "../components/helmet/Helmet";
import { Container, Row, Col, Form, FormGroup, Input } from "reactstrap";
import { useMutation } from "react-query";
import authApi from "../api/AuthApi.js";
import { toast } from "react-toastify";
import Loading from "../components/loading/Loading";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");

  const postForgotPassword = async (data) => {
    try {
      const response = await authApi.forgotPassword(data);
      return response;
    } catch (error) {
      toast.error(error.response.data, { autoClose: false })
      console.log("Failed to post: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => postForgotPassword(data),
  });

  const submit = async (e) => {
    e.preventDefault();
    const result = await mutation.mutateAsync(username);
    if (result) {
      toast.success(result, { autoClose: false })
    }
  }
  return (
    <Helmet title="Quên mật khẩu">
      <section className="auth__background">
        <Container>
          <Row>
            <Col lg="6" className="m-auto text-center">
              <h3 className="fw-bold mb-4 auth__title">Quên mật khẩu</h3>

              <Form className="auth__form" onSubmit={submit}>
                <FormGroup>
                  <Input
                    required
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormGroup>
                {
                  mutation.isLoading ? <Loading /> :

                    <button className="buy__btn auth__btn" type="submit">
                      Gửi
                    </button>
                }
              </Form>
            </Col>
          </Row>
        </Container>
      </section>

    </Helmet>
  )
}

export default ForgotPassword