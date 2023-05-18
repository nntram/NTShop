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

    const userIcon = '/assets/images/user-icon.png'

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
    const fullAddressResults = useQuery(
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

    const isSuccess = fullAddressResults.isSuccess && queryResult.isSuccess
    let defaultValues
    let provinceOptions = []
    let districtOptions = []
    let wardOptions = []

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
            Customername: queryResult.data.customername,
            Customerphonenumber: queryResult.data.customerphonenumber,
            Customeraddress: queryResult.data.customeraddress,
            Customerusername: queryResult.data.customerusername,
            Customeremail: queryResult.data.customeremail,
            Customeravatar: queryResult.data.customeravatar,
            Customerisactive: queryResult.data.customerisactive,
            Customercreateddate: queryResult.data.customercreateddate,
            province: provinceOptions.find((item) => item.value === fullAddressResults.data.provinceId).label,
            district: districtOptions.find((item) => item.value === fullAddressResults.data.districtId).label,
            Wardid: wardOptions.find((item) => item.value === fullAddressResults.data.wardId).label,
            gender: queryResult.data.customergender ? 'male' : 'female'
        }

    }
    return (
        <Helmet title='Khách hàng'>
            <CommonSection title='Thông tin khách hàng' />
            <section className='pb-0'>
                <Container className='d-flex justify-content-center'>

                    {!isSuccess ? <Loading /> :
                        <div className="container bootstrap snippets bootdey">
                            <div className="panel-body inf-content">
                                <div className="row p-5">
                                    <div className="col-md-4">
                                        <img alt="" title="" className="rounded-circle img-thumbnail isTooltip" src={defaultValues.Customeravatar ? `${process.env.REACT_APP_API_IMAGE_BASE_URL}/avatar/` + defaultValues.Customeravatar : userIcon} data-original-title="Usuario" />
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Thông tin tài khoản</strong><br />
                                        <div className="table-responsive">
                                            <table className="table table-user-information">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <strong>
                                                                <i className="ri-user-fill"></i>
                                                                Họ tên:
                                                            </strong>
                                                        </td>
                                                        <td className="text-primary">
                                                            {defaultValues.Customername}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <strong>
                                                                Giới tính:
                                                            </strong>
                                                        </td>
                                                        <td className="text-primary">
                                                            {defaultValues.gender === true ? "Nam" : "Nữ"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <strong>
                                                                <i className="ri-star-line"></i>
                                                                Tên đăng nhập
                                                            </strong>
                                                        </td>
                                                        <td className="text-primary">
                                                            {defaultValues.Customerusername}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <strong>
                                                                <i className="ri-mail-line"></i>
                                                                Email
                                                            </strong>
                                                        </td>
                                                        <td className="text-primary">
                                                            {defaultValues.Customeremail}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <strong>
                                                                <i className="ri-phone-line"></i>
                                                                Số điện thoại
                                                            </strong>
                                                        </td>
                                                        <td className="text-primary">
                                                            {defaultValues.Customerphonenumber}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <strong>
                                                                <i className="ri-calendar-line"></i>
                                                                Ngày đăng ký
                                                            </strong>
                                                        </td>
                                                        <td className="text-primary">
                                                            {ToDateTimeString(defaultValues.Customercreateddate)}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <strong>
                                                                Tỉnh, thành:
                                                            </strong>
                                                        </td>
                                                        <td className="text-primary">
                                                            {defaultValues.province}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <strong>
                                                                Quận, huyện:
                                                            </strong>
                                                        </td>
                                                        <td className="text-primary">
                                                            {defaultValues.district}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <strong>
                                                                Phường, xã:
                                                            </strong>
                                                        </td>
                                                        <td className="text-primary">
                                                            {defaultValues.Wardid}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <strong>
                                                                Địa chỉ:
                                                            </strong>
                                                        </td>
                                                        <td className="text-primary">
                                                            {defaultValues.Customeraddress}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <strong>
                                                               Trạng thái tài khoản:
                                                            </strong>
                                                        </td>
                                                        <td className="text-primary">
                                                            {defaultValues.Customerisactive === true ? "Đã kích hoạt" : "Chưa kích hoạt / Bị vô hiệu"}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className='d-flex justify-content-center align-items-center gap-3'>
                                                <Button type='button' onClick={() => submit(!queryResult.data.customerisactive)}>Vô hiệu / kích hoạt tài khoản</Button>
                                                <Link to={`/dasshboard/all-customers/orders/${customerId}`}></Link>
                                                <button type='button' className='btn btn-primary' onClick={() => navigate(`orders`)} >
                                                    <i className="ri-file-list-line"></i> Xem lịch sử đặt hàng
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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