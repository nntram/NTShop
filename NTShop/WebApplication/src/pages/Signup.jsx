import React, { useState, useRef } from "react";
import Helmet from "../components/helmet/Helmet";
import { Container, Row, Col, FormGroup, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/login.css";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import AddressApi from "../api/AddressApi"
import { useQuery } from "react-query";
import Loading from "../components/loading/Loading";
import { AvForm, AvField, AvGroup, AvInput, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';



const Signup = () => {

  const eyeRef = useRef(null);
  const eyeRef2 = useRef(null);
  const passwordRef = useRef(null);
  const passwordRef2 = useRef(null);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();


  };

  const fetchProvinces = async () => {
    try {
      const response = await AddressApi.getProvince();
      return (response);
    } catch (error) {
      console.log('Failed to fetch provinces: ', error);
    }
  }
  const fetchDistricts = async (prodvinceId) => {
    try {
      const response = await AddressApi.getDistrict(prodvinceId);
      return (response);
    } catch (error) {
      console.log('Failed to fetch districts: ', error);
    }
  }
  const fetchWards = async (districtId) => {
    try {
      const response = await AddressApi.getWard(districtId);
      return (response);
    } catch (error) {
      console.log('Failed to fetch wards: ', error);
    }
  }
  const provinceResults = useQuery('provinces', fetchProvinces)
  let provinceOptions = []
  if (provinceResults.isSuccess) {
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
  if (districtResults.isSuccess) {
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
  if (wardResults.isSuccess) {
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


    console.log(value)
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

  const eyeToggle = (eye, pass) => {
    eye.current.classList.toggle("ri-eye-close-line");
    eye.current.classList.toggle("ri-eye-line");

    if (eye.current.classList.contains("ri-eye-close-line")) {
      pass.current.type = 'password'
    }
    else {
      pass.current.type = 'text'
    }
  };


  return (
    <Helmet title="Signup">
      <section className="auth__background">
        <Container>
          <Row>
            <Col lg="6" className="m-auto">
              <h3 className="fw-bold mb-4 text-center">Đăng ký tài khoản</h3>

              <AvForm className="auth__form" onSubmit={signup} model={defaultValues}>
                <h5 className="text-white mb-3">1. Thông tin khách hàng</h5>
                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Họ và tên <span className="text-danger">*</span>
                  </Label>
                  <AvField name="name" type="text"
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
                  <AvRadio label="Nữ" name="gender"
                    className="mx-2"
                    value="female"
                  />
                </AvRadioGroup>

                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Email <span className="text-danger">*</span>
                  </Label>
                  <AvField name="email" type="email"

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
                  <AvField name="phonenumber" type="text"

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
                  <AvField type="select" name="ward" required
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
                  <AvField name="address" type="text"
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
                  <AvField name="username" type="text"

                    placeholder="Tên đăng nhập"
                    validate={{
                      required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                      maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                    }} />
                </AvGroup>

                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Mật khẩu <span className="text-danger">*</span>
                  </Label>
                  <div className="position-relative">
                    <AvField name="password" type="password"
                      innerRef = {passwordRef}
                      placeholder="Nhập mật khẩu"
                      validate={{
                        required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                        maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                      }} />
                    <i className="ri-eye-close-line signup__eye__button"
                      ref={eyeRef} onClick={() => eyeToggle(eyeRef, passwordRef)}></i>
                  </div>
                </AvGroup>
                <AvGroup >
                  <Label className="text-right text-white mx-2">
                    Nhập lại mật khẩu <span className="text-danger">*</span>
                  </Label>
                  <div className="position-relative">
                    <AvField name="password2" type="password"
                      innerRef = {passwordRef2}
                      placeholder="Nhập lại mật khẩu"
                      validate={{
                        match: { value: 'password', errorMessage: 'Mật khẩu không trùng khớp' },
                        required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin' },
                        maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                      }}
                    />
                    <i className="ri-eye-close-line signup__eye__button"
                      ref={eyeRef2} onClick={() => eyeToggle(eyeRef2, passwordRef2)}></i>
                  </div>
                </AvGroup>
                <FormGroup>
                  <label className="text-right text-white mx-2">
                    Ảnh đại diện
                  </label>
                  <Input
                    id="avatar"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </FormGroup>
                <FormGroup className="text-center">
                  <button className="buy__btn auth__btn" type="submit">
                    Tạo tài khoản
                  </button>
                  <p>
                    Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                  </p>
                </FormGroup>
              </AvForm>

            </Col>

          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Signup;




