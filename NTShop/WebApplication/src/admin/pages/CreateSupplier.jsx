import React, { useState } from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container, Label, FormGroup, Col } from 'reactstrap'
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import supplierApi from '../../api/SupplierApi'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import Loading from '../../components/loading/Loading'
import { useNavigate, Link } from 'react-router-dom'
import addressApi from '../../api/AddressApi';

const CreateSupplier = () => {
 
  const navigate = useNavigate()
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const postSupplier = async (data) => {
    try {
      const response = await supplierApi.create(data)
      return response;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, { autoClose: false })
      }
      console.log("Failed to create supplier: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => postSupplier(data),
  });

  const submit = async (e, values) => {
    e.preventDefault();

    const data = new FormData()
    for (var key in values) {
      data.append(key, values[key]);
    }

    const result = await mutation.mutateAsync(data);
    if (result) {
      toast.success(result, { autoClose: false })
      navigate('/dashboard/all-suppliers')  
    }
  }

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

  return (
    <Helmet title='Tạo mới nhà cung cấp'>
      <CommonSection title='Tạo mới nhà cung cấp' />

      <Container className='my-5 d-flex justify-content-center'>
        <Col md='6'>
          <AvForm className="auth__form"
            encType="multipart/form-data"
            onValidSubmit={submit}>
            <AvGroup>
              <Label className="text-right text-white mx-2">
                Tên nhà cung cấp <span className="text-danger">*</span>
              </Label>
              <AvField name="Suppliername" type="text"
                placeholder="Tên nhà cung cấp"
                validate={{
                  required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                  maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                }} />
            </AvGroup>
            
            <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Email <span className="text-danger">*</span>
                  </Label>
                  <AvField name="Supplieremail" type="email"
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
                  <AvField name="Supplierphonenumber" type="text"
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
                  <AvField name="Supplieraddress" type="text"
                    placeholder="Số nhà, tên đường..."
                    validate={{
                      required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                      maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                    }} />
                </AvGroup>

            {
              mutation.isLoading ? <Loading /> :
                <FormGroup className="text-center">
                  <button className="buy__btn auth__btn" type="submit">
                    Thêm mới
                  </button>
                </FormGroup>
            }

          </AvForm>


        </Col>
      </Container>
      <section className='p-3'>
        <div className='mt-3 text-info'>
          <Link to='/dashboard/all-suppliers' >
            <i className='ri-arrow-go-back-line'></i> Trở về
          </Link>
        </div>
      </section>

    </Helmet>
  )
}

export default CreateSupplier