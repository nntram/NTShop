import React, { useRef } from 'react'
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import Helmet from "../components/helmet/Helmet";
import { Container, Row, Col, Label, FormGroup } from "reactstrap";
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../api/AuthApi';
import { useMutation } from 'react-query';
import { toast } from "react-toastify";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { accessToken } = useParams()
    const eyeRef1 = useRef(null);
    const eyeRef2 = useRef(null);
    const passwordRef1 = useRef(null);
    const passwordRef2 = useRef(null);

    const eyeToggle = (eyeRef, passRef) => {
        eyeRef.current.classList.toggle("ri-eye-close-line");
        eyeRef.current.classList.toggle("ri-eye-line");

        if (eyeRef.current.classList.contains("ri-eye-close-line")) {
            passRef.current.type = 'password'
        }
        else {
            passRef.current.type = 'text'
        }
    };

    const postResetPassword = async (data, token) => {
        try {
            const response = await authApi.resetPassword(data, token)
            return response;
        } catch (error) {
            toast.error(error.message, { autoClose: false })
            console.log("Failed to reset password: ", error);
        }
    };

    const mutation = useMutation({
        mutationFn: (data) => postResetPassword(data, accessToken)
    });

    const submit = async (e, values) => {
        e.preventDefault();
        const password = values["Customerpassword"]
        const result = await mutation.mutateAsync(password);
        if (result) {
            navigate('/login')
            toast.success(result, { autoClose: false })
        }
    }

    return (
        <Helmet title="Đặt lại mật khẩu">
            <section className="auth__background">
                <Container>
                    <Row>
                        <Col lg="6" className="m-auto">
                            <h3 className="fw-bold mb-4 text-center auth__title">Đặt lại mật khẩu</h3>

                            <AvForm className="auth__form" onValidSubmit={submit}>
                                <AvGroup>
                                    <Label className="text-right text-white mx-2">
                                        Mật khẩu mới <span className="text-danger">*</span>
                                    </Label>
                                    <div className="position-relative">
                                        <AvField name="Customerpassword" type="password"
                                            innerRef={passwordRef1}
                                            placeholder="Nhập mật khẩu"
                                            validate={{
                                                required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                                                maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                                            }} />
                                        <i className="ri-eye-close-line signup__eye__button"
                                            ref={eyeRef1} onClick={() => eyeToggle(eyeRef1, passwordRef1)}></i>
                                    </div>
                                </AvGroup>
                                <AvGroup >
                                    <Label className="text-right text-white mx-2">
                                        Nhập lại mật khẩu mới <span className="text-danger">*</span>
                                    </Label>
                                    <div className="position-relative">
                                        <AvField name="password2" type="password"
                                            innerRef={passwordRef2}
                                            placeholder="Nhập lại mật khẩu"
                                            validate={{
                                                match: { value: 'Customerpassword', errorMessage: 'Mật khẩu không trùng khớp' },
                                                required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin' },
                                                maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                                            }}
                                        />
                                        <i className="ri-eye-close-line signup__eye__button"
                                            ref={eyeRef2} onClick={() => eyeToggle(eyeRef2, passwordRef2)}></i>
                                    </div>
                                </AvGroup>
                                <FormGroup className="text-center">
                                    <button className="buy__btn auth__btn" type="submit">
                                        Đặt lại mật khẩu
                                    </button>
                                </FormGroup>
                            </AvForm>
                        </Col>

                    </Row>
                </Container>
            </section>
        </Helmet>
    )
}

export default ResetPassword