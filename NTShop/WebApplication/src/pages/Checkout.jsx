import React, { useState } from 'react'
import { Container, Row, Col, Label, FormGroup } from 'reactstrap'
import Helmet from '../components/helmet/Helmet'
import CommonSection from '../components/UI/CommonSection'
import '../styles/checkout.css'
import { useSelector, useDispatch } from 'react-redux'
import { cartActions } from '../redux/slices/cartSlice'
import { useQuery, useMutation, useQueries } from 'react-query'
import cartApi from '../api/CartApi'
import Loading from '../components/loading/Loading'
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import addressApi from '../api/AddressApi'
import OrderDetail from './OrderDetail'
import customerApi from '../api/CustomerApi'

const Checkout = () => {
  const currentTotalQuantity = useSelector(state => state.cart.totalQuantity)
  const currentUser = useSelector(state => state.customer.currentUser)
  let totalAmount = 0
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");


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

  const fetchCustomerInfo = async () => {
    try {
      const response = await customerApi.getById(currentUser.Id)
      return (response);
    } catch (error) {
      console.log('Failed to fetch cart: ', error)
    }
  }

  const fetchCart = async () => {
    try {
      const response = await cartApi.getCart();
      return (response);
    } catch (error) {
      console.log('Failed to fetch cart: ', error)
    }
  }

  const fetchFullAddress = async (wardId) => {
    try {
      const response = await addressApi.getFullAddress(wardId);
      return (response);
    } catch (error) {
      console.log('Failed to fetch cart: ', error)
    }
  }

  const queryResults = useQueries([
    {
      queryKey: ['cart', currentTotalQuantity],
      queryFn: fetchCart, enabled: Boolean(currentTotalQuantity >= 0)
    },
    {
      queryKey: ['customerInfo', currentUser],
      queryFn: fetchCustomerInfo
    }
  ])


  const fullAddressResults = useQuery({
    queryKey: ['full-address'],
    queryFn: ({ wardId = queryResults[1].data.wardid }) => fetchFullAddress(wardId),
    enabled: queryResults[1].data != null
  })

  let provinceOptions = []
  let districtOptions = []
  let wardOptions = []

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

  const isLoading = queryResults.some(query => query.isLoading) || fullAddressResults.isLoading
  const isSucess = queryResults.every(query => query.isSuccess) && fullAddressResults.isSuccess

  let queryCart
  let defaultValues
  if (isSucess) {
    queryCart = queryResults[0]
    if (queryCart.data && queryCart.data.cartdetails.length > 0) {
      let sum = 0;
      queryCart.data.cartdetails.map(item => {
        sum += item.cartdetailquantity * item.product.productsaleprice
      })
      totalAmount = sum
    }
    else {
      totalAmount = 0
    }

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
      Customername: queryResults[1].data.customername,
      Customerphonenumber: queryResults[1].data.customerphonenumber,
      Customeraddress: queryResults[1].data.customeraddress,
      province: fullAddressResults.data.provinceId,
      district: fullAddressResults.data.districtId,
      Wardid: fullAddressResults.data.wardId
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

  const wardResults = useQuery(['wards', district],
    ({ districtId = district }) => fetchWards(districtId),
    {
      enabled: Boolean(district),
    })

  if (wardResults.isSuccess && wardResults.data) {
    const data = [...wardResults.data.map((item) => (
      {
        value: item.wardid, label: item.wardname
      }
    ))]
    wardOptions = [...data]
  }

  return (
    <Helmet title='Đặt hàng'>
      <CommonSection title='Đặt hàng' />
      <section>
        {
          isLoading ? <Loading /> :
            <Container>
              <AvForm className="auth__form bg-white"
                encType="multipart/form-data"
                onValidSubmit={null}
                model={defaultValues}>
                <Row>
                  <Col lg='8'>
                    <h5 className="mb-3"> Thông tin giao hàng</h5>
                    <AvGroup>
                      <Label className="text-right mx-2">
                        Họ và tên <span className="text-danger">*</span>
                      </Label>
                      <AvField name="Customername" type="text"
                        placeholder="Họ và tên"
                        validate={{
                          required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                          maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                        }} />
                    </AvGroup>
                    <AvGroup>
                      <Label className="text-right mx-2">
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
                      <Label className="text-right mx-2">
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
                      <Label className="text-right mx-2">
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
                      <Label className="text-right mx-2">
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
                        <option value="myval">Hello</option>
                      </AvField>
                    </AvGroup>

                    <AvGroup>
                      <Label className="text-right mx-2">
                        Địa chỉ <span className="text-danger">*</span>
                      </Label>
                      <AvField name="Customeraddress" type="text"
                        placeholder="Số nhà, tên đường..."
                        validate={{
                          required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                          maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                        }} />
                    </AvGroup>
                  </Col>

                  <Col lg='4 m-auto'>

                    <div className="checkout__cart">
                      <h5 className="mb-4 text-center"> Thông tin đơn hàng</h5>
                      <h6>Số sản phẩm: <span>{currentTotalQuantity} sản phẩm</span></h6>
                      <h6>Số tiền: <span>{totalAmount.toLocaleString()} VNĐ</span></h6>
                      <h6>Phí giao hàng:  <span>Miễn phí</span></h6>
                      <h4>Thành tiền: <span>{totalAmount.toLocaleString()} VNĐ</span></h4>

                      <button className='buy__btn auth__btn w-100'>Xác nhận đặt hàng</button>

                    </div>
                  </Col>
                </Row>
              </AvForm>

              <Row className='mt-5 p-5 border border-dark'>
                <h5 className="mb-3"> Chi tiết đơn hàng</h5>
                <Col lg='12'>
                  {
                    queryCart.data && queryCart.data.cartdetails.length === 0 ?
                      (<h2 className='fs-4 text-center'>Bạn chưa thêm sản phẩm vào giỏ hàng.</h2>)
                      :
                      (<table className='table bodered'>
                        <thead>
                          <tr>
                            <th></th>
                            <th className='text-center'>Tên sản phẩm</th>
                            <th className='text-center'>Giá</th>
                            <th className='text-center'>Số lượng</th>
                          </tr>
                        </thead>

                        <tbody>
                          {
                            queryCart.data && queryCart.data.cartdetails.map((item, index) => (
                              <OrderDetail item={item} key={item.cartdetailid} />

                            ))
                          }
                        </tbody>
                      </table>)
                  }

                </Col>
              </Row>
            </Container>
        }

      </section>


    </Helmet >
  )
}

export default Checkout