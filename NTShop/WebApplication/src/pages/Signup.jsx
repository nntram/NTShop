import React, { useState } from "react";
import Helmet from "../components/helmet/Helmet";
import { Container, Row, Col, Form, FormGroup, Input, Label } from "reactstrap";
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
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const [provinceOpt, setProvinceOpt] = useState(null);
  const [districtOpt, setDistrictOpt] = useState(null);
  const [wardOpt, setWardOpt] = useState(null);

  const [address, setAdress] = useState("");
  const [gender, setGender] = useState(true);
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
        value: item.provinceid, label: (<span className='d-flex align-items-center gap-2'>
          {item.provincename}
        </span>)
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
        value: item.districtid, label: (<span className='d-flex align-items-center gap-2'>
          {item.districtname}
        </span>)
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
        value: item.wardid, label: (<span className='d-flex align-items-center gap-2'>
          {item.wardname}
        </span>)
      }
    ))]
    wardOptions = [...data]
  }
  const handleProvinceSelect = (e) => {
    setProvince(e.value)
    setProvinceOpt(e)
    setDistrict("")
    setWard("")
    setDistrictOpt(null)
    setWardOpt(null)
  }
  const handleDistrictSelect = (e) => {
    setDistrict(e.value)
    setDistrictOpt(e)
    setWard("")
    setWardOpt(null)
  }
  const handleWardSelect = (e) => {
    setWard(e.value)
    setWardOpt(e)
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    onClick={() => setGender(true)} />
                  <AvRadio label="Nữ" name="gender"
                    className="mx-2"
                    value="female"
                    onClick={() => setGender(false)} />
                </AvRadioGroup>

                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Email <span className="text-danger">*</span>
                  </Label>
                  <AvField name="email" type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Số điện thoại"
                    validate={{
                      pattern: {value: /((09|03|07|08|05)+([0-9]{8})\b)/, errorMessage: 'Vui lòng nhập đúng định dạng.' } ,
                      required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                      maxLength: { value: 10, errorMessage: 'Quá độ dài cho phép' },
                    }} />
                </AvGroup>  
                <FormGroup>
                  <label className="text-right text-white mx-2">
                    Tỉnh, thành <span className="text-danger">*</span>
                  </label>
                  <Select
                    placeholder="Chọn tỉnh, thành"
                    options={provinceOptions}
                    onChange={(e) => handleProvinceSelect(e)}
                    value={provinceOpt}

                  />
                </FormGroup>
                <FormGroup>
                  <label className="text-right text-white mx-2">
                    Quận, huyện <span className="text-danger">*</span>
                  </label>
                  <Select
                    placeholder="Chọn quận, huyện"
                    options={districtOptions}
                    onChange={(e) => handleDistrictSelect(e)}
                    value={districtOpt}
                  />
                </FormGroup>
                <FormGroup>
                  <label className="text-right text-white mx-2">
                    Xã, phường <span className="text-danger">*</span>
                  </label>
                  <Select
                    placeholder="Chọn xã, phường"
                    options={wardOptions}
                    onChange={(e) => handleWardSelect(e)}
                    value={wardOpt}
                  />
                </FormGroup>
             
                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Địa chỉ <span className="text-danger">*</span>
                  </Label>
                  <AvField name="address" type="text"
                    value={address}
                    onChange={(e) => setAdress(e.target.value)}
                    placeholder="Số nhà, tên đường..."
                    validate={{
                      required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                      maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                    }} />
                </AvGroup>    

                <h5 className="text-white mt-5 mb-3">
                  2. Thông tin tài khoản
                </h5>
                <FormGroup>
                  <label className="text-right text-white mx-2">
                    Tên đăng nhập <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <label className="text-right text-white mx-2">
                    Mật khẩu <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label className="text-right text-white mx-2">
                    Nhập lại mật khẩu <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </FormGroup>
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




