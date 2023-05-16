import React, { useState } from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container, Label, FormGroup, Col, Button } from 'reactstrap'
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import supplierApi from '../../api/SupplierApi'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import Loading from '../../components/loading/Loading'
import { useNavigate, Link, useParams } from 'react-router-dom'
import addressApi from '../../api/AddressApi';

const EditSupplier = () => {

  const navigate = useNavigate()
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const { supplierId } = useParams()


  const fetchSupplierById = async (id) => {
    try {
      const response = await supplierApi.getById(id)
      return (response);
    } catch (error) {
      console.log('Failed to fetch supplier: ', error);
    }
  }
  const querySupplier = useQuery(
    {
      queryKey: ['supplier', supplierId],
      queryFn: ({ id = supplierId }) => fetchSupplierById(id),
      cacheTime: 1000
    }
  )

  const fetchFullAddress = async (wardId) => {
    try {
      const response = await addressApi.getFullAddress(wardId);
      return (response);
    } catch (error) {
      console.log('Failed to fetch full address: ', error)
    }
  }

  const fullAddressResults = useQuery({
    queryKey: ['full-address', querySupplier],
    queryFn: ({ wardId = querySupplier.data.wardid }) => fetchFullAddress(wardId),
    enabled: querySupplier.data != null
  })

  const postSupplier = async (data) => {
    try {
      const response = await supplierApi.update(data)
      return response;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, { autoClose: false })
      }
      console.log("Failed to update supplier: ", error);
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
    data.append('Supplierid', supplierId)
    const result = await mutation.mutateAsync(data);
    if (result) {
      toast.success(result, { autoClose: false })
      navigate('/dashboard/all-suppliers')
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
  const isLoading = querySupplier.isLoading || fullAddressResults.isLoading
  const isSuccess = querySupplier.isSuccess && fullAddressResults.isSuccess

  let provinceOptions = []
  let districtOptions = []
  let wardOptions = []
  let defaultValues
  if (isSuccess) {
    provinceOptions = [...fullAddressResults.data.provinces.map((item) => (
      {
        value: item.provinceid, label: item.provincename
      }
    ))]

    districtOptions = [...fullAddressResults.data.districts.map((item) => (
      {
        value: item.districtid, label: item.districtname
      }
    ))]
    wardOptions = [...fullAddressResults.data.wards.map((item) => (
      {
        value: item.wardid, label: item.wardname
      }
    ))]
    defaultValues = {
      Suppliername: querySupplier.data.suppliername,
      Supplierphonenumber: querySupplier.data.supplierphonenumber,
      Supplieraddress: querySupplier.data.supplieraddress,
      Supplieremail: querySupplier.data.supplieremail,
      province: fullAddressResults.data.provinceId,
      district: fullAddressResults.data.districtId,
      Wardid: fullAddressResults.data.wardId,
    }

  }

  const districtResults = useQuery(['districts', province],
    ({ provinceId = province }) => fetchDistricts(provinceId),
    {
      enabled: Boolean(province),
    })


  if (districtResults.isSuccess && districtResults.data) {
    const data = [...districtResults.data.map((item) => (
      {
        value: item.districtid, label: item.districtname
      }
    ))]
    districtOptions = [...data]
  }

  const wardResults = useQuery(['wards', district, province],
    ({ districtId = district }) => fetchWards(districtId),
    {
      enabled: Boolean(district),
      initialData: []
    })

  if (wardResults.isSuccess && wardResults.data && province) {
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


  return (
    <Helmet title='Tạo mới nhà cung cấp'>
      <CommonSection title='Tạo mới nhà cung cấp' />
      {!isSuccess ? <Loading /> :
        <Container className='my-5 d-flex justify-content-center'>
          <Col md='6'>
            <AvForm className="auth__form"
              model={defaultValues}
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
                      Lưu thay đổi
                    </button>
                  </FormGroup>
              }

            </AvForm>

          </Col>
        </Container>}

      <section className='p-3'>
        <div className='mt-3 text-info'>
          <Button type='button' onClick={() => navigate(-1)} >
            <i className='ri-arrow-go-back-line'></i> Trở về
          </Button>
        </div>
      </section>

    </Helmet>
  )
}

export default EditSupplier