import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import customerApi from '../../api/CustomerApi'
import addressApi from '../../api/AddressApi'
import { useQuery, useMutation } from 'react-query'
import { toast } from 'react-toastify'
import Loading from '../../components/loading/Loading'
import { Container, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap'
import Helmet from '../../components/helmet/Helmet'
import CommonSection from '../../components/UI/CommonSection'
import { ToDateTimeString } from '../../utils/Helpers'

const EditCustomer = () => {
    const { customerId } = useParams()
    const navigate = useNavigate()
    const postEdit = async (data) => {
        try {
          const response = await customerApi.changeStatus(data)
          return response;
        } catch (error) {
          if (error.response) {
            toast.error(error.response.data, { autoClose: false })
          }
          console.log("Failed to update status: ", error);
        }
      };
    
      const mutation = useMutation({
        mutationFn: (data) => postEdit(data),
      });
    const fetchCustomerInfo = async () => {
        try {
            const response = await customerApi.getById(customerId)
            return (response);
        } catch (error) {
            console.log('Failed to fetch customer infor: ', error)
        }
    }

    const fetchFullAddress = async (wardId) => {
        try {
            const response = await addressApi.getFullAddress(wardId);
            return (response);
        } catch (error) {
            toast.error(error.response.data)
            console.log('Failed to fetch cart: ', error)
        }
    }

    const queryResult = useQuery(
        {
            queryKey: ['customerInfo', customerId, mutation],
            queryFn: fetchCustomerInfo
        },

    )
    const queryFullAdress = useQuery(
        {
            queryKey: ['full-address', customerId],
            queryFn: ({ wardId = queryResult.data.wardid }) => fetchFullAddress(wardId),
            enabled: queryResult.data != null
        }
    )


    
      const submit = async (value) => {
        let data = new FormData()
        data.append('Customerid', customerId)
        data.append('Status', value)
        const result = await mutation.mutateAsync(data);
        if (result) {
          toast.success(result, { autoClose: false })
        }
      }

    const isSuccess = queryFullAdress.isSuccess && queryResult.isSuccess

    return (
        <Helmet title='Khách hàng'>
            <CommonSection title='Thông tin khách hàng' />
            <section className='pb-0'>
                <Container className='d-flex justify-content-center'>

                    {!isSuccess ? <Loading /> :
                        <Col md={6} className='auth__form mb-5'>
                            <FormGroup>
                                <Label className='text-white'>Họ và tên:</Label>
                                <Input value={queryResult.data.customername} />
                            </FormGroup>
                            <FormGroup>
                                <Label className='text-white'>Email:</Label>
                                <Input value={queryResult.data.customeremail} />
                            </FormGroup>
                            <FormGroup>
                                <Label className='text-white'>Số điện thoại:</Label>
                                <Input value={queryResult.data.customerphonenumber} />
                            </FormGroup>
                            <FormGroup>
                                <Label className='text-white'>Tỉnh, thành:</Label>
                                <Input value={queryFullAdress.data.provinces.find(item => item.provinceid === queryFullAdress.data.provinceId).provincename} />
                            </FormGroup>
                            <FormGroup>
                                <Label className='text-white'>Quận, huyện:</Label>
                                <Input value={queryFullAdress.data.districts.find(item => item.districtid === queryFullAdress.data.districtId).districtname} />
                            </FormGroup>
                            <FormGroup>
                                <Label className='text-white'>Xã phường:</Label>
                                <Input value={queryFullAdress.data.wards.find(item => item.wardid === queryFullAdress.data.wardId).wardname} />
                            </FormGroup>
                            <FormGroup>
                                <Label className='text-white'>Địa chỉ:</Label>
                                <Input value={queryResult.data.customeraddress} />
                            </FormGroup>
                            <FormGroup>
                                <Label className='text-white'>Tên đăng nhập:</Label>
                                <Input value={queryResult.data.customerusername} />
                            </FormGroup>
                            <FormGroup>
                                <Label className='text-white'>Ngày đăng ký:</Label>
                                <Input value={ToDateTimeString(queryResult.data.customercreateddate)} />
                            </FormGroup>
                            <FormGroup>
                                <Label className='text-white'>Trạng thái tài khoản:</Label>
                                <Input value={queryResult.data.customerisactive ? "Đang hoạt động" : "Chưa kích hoạt/Đã vô hiệu"} />
                            </FormGroup>
                            <div className='d-flex justify-content-center align-items-center gap-3'>
                                <Button type='button' onClick={()=>submit(!queryResult.data.customerisactive)}>Vô hiệu / kích hoạt tài khoản</Button>
                                <Link to={`/dasshboard/all-customers/orders/${customerId}`}></Link>
                                <button type='button' className='btn btn-primary' onClick={() => navigate(`orders`)} >
                                    <i className="ri-file-list-line"></i> Xem lịch sử đặt hàng
                                </button>
                            </div>
                        </Col>
                    }

                </Container>
            </section>

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

export default EditCustomer