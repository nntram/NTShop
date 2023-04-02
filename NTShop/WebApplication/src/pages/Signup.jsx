import React, { useState } from "react";
import Helmet from "../components/helmet/Helmet";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/login.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { auth } from "../firebase.config";
import { storage, db } from "../firebase.config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import AddressApi from "../api/AddressApi"
import { useQuery } from "react-query";
import Loading from "../components/loading/Loading";


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

  return (
    <Helmet title="Signup">
      <section className="auth__background">
        <Container>
          <Row>
            <Col lg="6" className="m-auto">
              <h3 className="fw-bold mb-4 text-center">Đăng ký tài khoản</h3>

              <Form className="auth__form" onSubmit={signup}>
                <h5 className="text-white mb-3">1. Thông tin khách hàng</h5>
                <FormGroup className="form__group">
                  <label className="text-right text-white mx-2">
                    Họ và tên:
                  </label>
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <div className="d-flex gap-5 my-3">
                    <label className="text-right text-white mx-2">
                      Giới tính:
                    </label>

                    <div className="d-flex gap-1">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        checked={gender}
                        onClick={() => setGender(true)}
                        onChange={e => { }}
                      />
                      <label htmlFor="male" className="text-white">
                        Nam
                      </label>
                    </div>
                    <div className="d-flex gap-1">
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        checked={!gender}
                        onClick={() => setGender(false)}
                        onChange={e => { }}
                      />
                      <label htmlFor="female" className="text-white">
                        Nữ
                      </label>
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className="form__group">
                  <label className="text-right text-white mx-2">Email:</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <label className="text-right text-white mx-2">
                    Số điện thoại:
                  </label>
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <label className="text-right text-white mx-2">
                    Tỉnh, thành:
                  </label>
                  <Select
                    placeholder="Chọn tỉnh, thành"
                    options={provinceOptions}
                    onChange={(e) => handleProvinceSelect(e)}
                    value={provinceOpt}

                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <label className="text-right text-white mx-2">
                    Quận, huyện:
                  </label>
                  <Select
                    placeholder="Chọn quận, huyện"
                    options={districtOptions}
                    onChange={(e) => handleDistrictSelect(e)}
                    value = {districtOpt}
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <label className="text-right text-white mx-2">
                    Xã, phường:
                  </label>
                  <Select
                    placeholder="Chọn xã, phường"
                    options={wardOptions}
                    onChange={(e) => handleWardSelect(e)}
                    value={wardOpt}
                  />
                </FormGroup>

                <FormGroup className="form__group">
                  <label className="text-right text-white mx-2">
                    Địa chỉ:
                  </label>
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường..."
                    value={address}
                    onChange={(e) => setAdress(e.target.value)}
                  />
                </FormGroup>

                <h5 className="text-white mt-5 mb-3">
                  2. Thông tin tài khoản
                </h5>
                <FormGroup className="form__group">
                  <label className="text-right text-white mx-2">
                    Tên đăng nhập:
                  </label>
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormGroup>

                <FormGroup className="form__group">
                  <label className="text-right text-white mx-2">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <label className="text-right text-white mx-2">
                    Nhập lại mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <label className="text-right text-white mx-2">
                    Ảnh đại diện
                  </label>
                  <input
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
              </Form>
            </Col>
            
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Signup;




