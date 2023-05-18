import React, { useState } from "react";
import Helmet from "../components/helmet/Helmet";
import "../styles/login.css";
import { toast } from "react-toastify";
import addressApi from "../api/AddressApi"
import { useQuery } from "react-query";
import Loading from "../components/loading/Loading";
import '../styles/customer-info.css'
import customerApi from "../api/CustomerApi";
import { useSelector } from "react-redux";
import authApi from "../api/AuthApi";
import { ToDateTimeString } from '../utils/Helpers'
import { useNavigate } from "react-router-dom";

const CustomerInfo = () => {
    const  userIcon = '/assets/images/user-icon.png'
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const navigate = useNavigate()
    const currentUser = useSelector(state => state.customer.currentUser)

    const postCustomerInfor = async (formData) => {
        try {
            const response = customerApi.changeInfo(formData);
            return (response);
        } catch (error) {
            console.log('Failed to post Customer Infor: ', error);
        }
    }
    const postRefreshToken = async (formData) => {
        try {
            const response = authApi.refreshToken(formData)
            return (response);
        } catch (error) {
            console.log('Failed to post refresh token: ', error);
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
            queryKey: ['customerInfo', currentUser],
            queryFn: fetchCustomerInfo
        }
    )

    const fullAddressResults = useQuery({
        queryKey: ['full-address', currentUser],
        queryFn: ({ wardId = queryResult.data.wardid }) => fetchFullAddress(wardId),
        enabled: queryResult.data != null
    })

    let provinceOptions = []
    let districtOptions = []
    let wardOptions = []


    const isLoading = queryResult.isLoading || fullAddressResults.isLoading
    const isSuccess = queryResult.isSuccess && fullAddressResults.isSuccess

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
            Customername: queryResult.data.customername,
            Customerphonenumber: queryResult.data.customerphonenumber,
            Customeraddress: queryResult.data.customeraddress,
            Customerusername: queryResult.data.customerusername,
            Customeremail: queryResult.data.customeremail,
            Customercreateddate: queryResult.data.customercreateddate,
            province: provinceOptions.find((item) => item.value === fullAddressResults.data.provinceId).label,
            district: districtOptions.find((item) => item.value === fullAddressResults.data.districtId).label,
            Wardid: wardOptions.find((item) => item.value === fullAddressResults.data.wardId).label,
            gender: queryResult.data.customergender ? 'male' : 'female'
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

    if (wardResults.isSuccess && wardResults.data && (province)) {
        const data = [...wardResults.data.map((item) => (
            {
                value: item.wardid, label: item.wardname
            }
        ))]
        wardOptions = [...data]
    }


    return (
        <Helmet title="Thông tin khách hàng">
            {isLoading ? <Loading /> :
                <section>
                    <div className="container bootstrap snippets bootdey">
                        <div className="panel-body inf-content">
                            <div className="row p-5">
                                <div className="col-md-4">
                                    <img alt="" title="" className="rounded-circle img-thumbnail isTooltip" src={currentUser.Avatar ? `${process.env.REACT_APP_API_IMAGE_BASE_URL}/avatar/` + currentUser.Avatar : userIcon} data-original-title="Usuario" />
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
                                            </tbody>
                                        </table>
                                        <div className="text-center">
                                            <button type="button" className="btn btn-primary"
                                            onClick={() => navigate('/change-customer-info')}> 
                                            <i className="ri-edit-line"></i> Thay đổi thông tin</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </Helmet>
    );
};

export default CustomerInfo;




