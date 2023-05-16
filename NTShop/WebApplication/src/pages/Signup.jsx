import React, { useState, useRef, useEffect, useCallback } from "react";
import Helmet from "../components/helmet/Helmet";
import { Container, Row, Col, FormGroup, Label } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/login.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import addressApi from "../api/AddressApi"
import { useQuery, useMutation } from "react-query";
import Loading from "../components/loading/Loading";
import { AvForm, AvField, AvGroup, AvRadioGroup, AvRadio, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import customerApi from "../api/CustomerApi";
import useDebounce from "../custom-hooks/useDebounce";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const Signup = () => {
  const eyeRef1 = useRef(null);
  const eyeRef2 = useRef(null);
  const passwordRef1 = useRef(null);
  const passwordRef2 = useRef(null);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [file, setFile] = useState(null);

  const [username, setUsername] = useState(null);
  const debouncedUsername = useDebounce(username, 500);

  const navigate = useNavigate();
  const postSignup = async (formData) => {
    try {
      const response = await customerApi.create(formData);
      return response;
    } catch (e) {
      toast.error(e.response.data, { autoClose: false })
      console.log("Failed to sign up: ", e);
    }
  };
  const { executeRecaptcha } = useGoogleReCaptcha();
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }
    const token = await executeRecaptcha('signup');
    return token
  }, [executeRecaptcha]);

  const mutation = useMutation({
    mutationFn: (formData) => postSignup(formData),
  });

  const signup = async (event, values) => {
    handleReCaptchaVerify().then(async (token) => {
      const formData = new FormData()
      for (var key in values) {
        formData.append(key, values[key]);
      }
      if (file) {
        formData.append("Avatar", file)
      }
      const gender = values.gender === 'male' ? true : false
      formData.append("Customergender", gender)
      formData.append("Token", token)

      const result = await mutation.mutateAsync(formData);
      if (result) {
        toast.success(result, { autoClose: false })
        navigate('/login')
      }
    });

  };
  const isUsernameExist = async () => {
    try {
      const response = await customerApi.isUsernameExist(username)
      return (response);
    } catch (error) {
      console.log('Failed to fetch: ', error);
    }
  }
  const checkUsernameExist = useQuery(['username', debouncedUsername],
    isUsernameExist,
    {
      enabled: Boolean(debouncedUsername),
    })
  const fetchProvinces = async () => {
    try {
      const response = await addressApi.getProvince();
      return (response);
    } catch (error) {
      console.log('Failed to fetch provinces: ', error);
    }
  }
  const fetchDistricts = async (prodvinceId) => {
    try {
      const response = await addressApi.getDistrict(prodvinceId);
      return (response);
    } catch (error) {
      console.log('Failed to fetch districts: ', error);
    }
  }
  const fetchWards = async (districtId) => {
    try {
      const response = await addressApi.getWard(districtId);
      return (response);
    } catch (error) {
      console.log('Failed to fetch wards: ', error);
    }
  }
  const provinceResults = useQuery('provinces', fetchProvinces)
  let provinceOptions = []
  if (provinceResults.isSuccess && provinceResults.data) {
    const data = [...provinceResults.data.map((item) => (
      {
        value: item.provinceid, label: item.provincename
      }
    ))]
    provinceOptions = [...data]
  }

  const districtResults = useQuery(['districts', province],
    ({ provinceId = province }) => fetchDistricts(provinceId),
    {
      enabled: Boolean(province),
    })

  let districtOptions = []
  if (districtResults.isSuccess && districtResults.data) {
    const data = [...districtResults.data.map((item) => (
      {
        value: item.districtid, label: item.districtname
      }
    ))]
    districtOptions = [...data]
  }

  const wardResults = useQuery(['wards', district],
    ({ districtId = district }) => fetchWards(districtId),
    {
      enabled: Boolean(district),
    })

  let wardOptions = []
  if (wardResults.isSuccess && wardResults.data) {
    const data = [...wardResults.data.map((item) => (
      {
        value: item.wardid, label: item.wardname
      }
    ))]
    wardOptions = [...data]
  }
  const handleProvinceSelect = (value) => {
    setProvince(value)

    setDistrict("")
    setWard("")
  }
  const handleDistrictSelect = (value) => {
    setDistrict(value)
    setWard("")

  }
  const handleWardSelect = (value) => {
    setWard(value)
  }


  if (provinceResults.isLoading) {
    return <Loading />
  }

  if (provinceResults.isError) {
    console.log('fetch error')
    return <h6>Đã xảy ra lỗi.</h6>
  }

  const defaultValues = {
    gender: 'male',
  };

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

  const validateImage = () => {
    if (file && file.size) {
      const max_size = 2000000;
      if (file.size > max_size)
        return false;
    }
    return true;
  }


  const validateUsername = () => {
    if (checkUsernameExist.data) {
      return "Tên đăng nhập đã tồn tại."
    }
    return true;
  }


  return (
    <Helmet title="Đăng ký">

      <section className="auth__background">
        <Container>
          <Row>
            <Col lg="6" className="m-auto">
              <h3 className="fw-bold mb-4 text-center auth__title">Đăng ký tài khoản</h3>

              <AvForm className="auth__form"
                encType="multipart/form-data"
                onValidSubmit={signup}
                model={defaultValues}>
                <h5 className="text-white mb-3">1. Thông tin khách hàng</h5>
                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Họ và tên <span className="text-danger">*</span>
                  </Label>
                  <AvField name="Customername" type="text"
                    placeholder="Họ và tên"
                    validate={{
                      required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                      maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                    }} />
                </AvGroup>

                <AvRadioGroup className='radio__group' inline name="gender" required>
                  <Label className="text-white mx-2">
                    Giới tính <span className="text-danger">*</span>
                  </Label>
                  <AvRadio label="Nam"
                    className="mx-2"
                    value="male"
                  />
                  <AvRadio label="Nữ" name="Customergender"
                    className="mx-2"
                    value="female"
                  />
                </AvRadioGroup>

                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Email <span className="text-danger">*</span>
                  </Label>
                  <AvField name="Customeremail" type="email"
                    placeholder="email@gmail.com"
                    validate={{
                      required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                      maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                    }} />
                </AvGroup>
                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Số điện thoại <span className="text-danger">*</span>
                  </Label>
                  <AvField name="Customerphonenumber" type="text"
                    placeholder="Số điện thoại"
                    validate={{
                      pattern: { value: /((09|03|07|08|05)+([0-9]{8})\b)/, errorMessage: 'Vui lòng nhập đúng định dạng.' },
                      required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                      maxLength: { value: 10, errorMessage: 'Quá độ dài cho phép' },
                    }} />
                </AvGroup>
                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Tỉnh, thành <span className="text-danger">*</span>
                  </Label>
                  <AvField type="select" name="province" required
                    onChange={(e) => handleProvinceSelect(e.target.value)}>
                    <option value="" hidden>Chọn tỉnh, thành</option>
                    {
                      provinceOptions && provinceOptions.map((item) => (
                        <option value={item.value} key={item.value}>
                          {item.label}
                        </option>
                      ))
                    }
                  </AvField>
                </AvGroup>

                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Quận, huyện <span className="text-danger">*</span>
                  </Label>
                  <AvField type="select" name="district" required
                    onChange={(e) => handleDistrictSelect(e.target.value)}>
                    <option value="" hidden>Chọn quận, huyện</option>
                    {
                      districtOptions && districtOptions.map((item) => (
                        <option value={item.value} key={item.value}>
                          {item.label}
                        </option>
                      ))
                    }
                  </AvField>
                </AvGroup>

                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Xã, phường <span className="text-danger">*</span>
                  </Label>
                  <AvField type="select" name="Wardid" required
                    onChange={(e) => handleWardSelect(e.target.value)}>
                    <option value="" hidden>Chọn xã, phường</option>
                    {
                      wardOptions && wardOptions.map((item) => (
                        <option value={item.value} key={item.value}>
                          {item.label}
                        </option>
                      ))
                    }
                  </AvField>
                </AvGroup>

                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Địa chỉ <span className="text-danger">*</span>
                  </Label>
                  <AvField name="Customeraddress" type="text"
                    placeholder="Số nhà, tên đường..."
                    validate={{
                      required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                      maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                    }} />
                </AvGroup>

                <h5 className="text-white mt-5 mb-3">
                  2. Thông tin tài khoản
                </h5>

                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Tên đăng nhập <span className="text-danger">*</span>
                  </Label>
                  <AvField name="Customerusername" type="text"
                    placeholder="Tên đăng nhập"
                    onChange={(e) => setUsername(e.target.value)}
                    validate={{
                      checkExist: validateUsername,
                      required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                      maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                    }} />
                </AvGroup>

                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Mật khẩu <span className="text-danger">*</span>
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
                    Nhập lại mật khẩu <span className="text-danger">*</span>
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

                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Ảnh đại diện
                  </Label>
                  <AvInput name="avatar" type="file" accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    validate={{ checkCapacity: validateImage }} />
                  <AvFeedback>Dung lượng tối đa là 2 Mb.</AvFeedback>
                </AvGroup>
                {
                  mutation.isLoading ? <Loading />:
                    <FormGroup className="text-center">
                      <button className="buy__btn auth__btn" type="submit">
                        Tạo tài khoản
                      </button>
                      <p className="text-white mt-3">
                        Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                      </p>
                    </FormGroup>
                }

              </AvForm>

            </Col>

          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Signup;




