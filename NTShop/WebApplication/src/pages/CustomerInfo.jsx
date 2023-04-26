import React, { useState } from "react";
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
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import authApi from "../api/AuthApi";
import { customerActions } from "../redux/slices/customerSlice";
import jwt_decode from "jwt-decode";

const CustomerInfo = () => {
    const dispatch = useDispatch()
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null)
    const navigate = useNavigate();
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
    const mutation = useMutation({
        mutationFn: (formData) => postCustomerInfor(formData),
    });
    const mutationRefreshToken = useMutation({
        mutationFn: (formData) => postRefreshToken(formData),
    })
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
        queryKey: ['full-address'],
        queryFn: ({ wardId = queryResult.data.wardid }) => fetchFullAddress(wardId),
        enabled: queryResult.data != null
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
            province: fullAddressResults.data.provinceId,
            district: fullAddressResults.data.districtId,
            Wardid: fullAddressResults.data.wardId,
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

    const submit = async (event, values) => {
        event.preventDefault();

        const formData = new FormData()
        for (var key in values) {
            formData.append(key, values[key]);
        }
        if (file) {
            formData.append("Avatar", file)
        }
        const gender = values.gender === 'male' ? true : false
        formData.append("Customergender", gender)

        await mutation.mutateAsync(formData).then(async (result) => {
            toast.success(result + "Trang sẽ tự tải lại sau 3s.", {autoClose: false})
            const accessToken = sessionStorage.getItem("userAuth");
            var refreshTokenForm = new FormData()
            refreshTokenForm.append("authorization", accessToken);

            mutationRefreshToken.mutateAsync(refreshTokenForm).then((newToken) => {                              
                sessionStorage.setItem("userAuth", newToken);
                const decode = JSON.stringify(jwt_decode(newToken));
                sessionStorage.setItem("currentUser", decode);
                
                window.setTimeout(function(){window.location.reload()},3000)
            })
        })
    }

    const validateImage = () => {
        if (file && file.size) {
            const max_size = 2000000;
            if (file.size > max_size)
                return false;
        }
        return true;
    }

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
            setFile(event.target.files[0])
        }
        else {
            setImage(null);
            setFile(null)
        }
    }
    return (
        <Helmet title="Thông tin khách hàng">
            {isLoading ? <Loading /> :
                <section className="auth__background">
                    <Container>
                        <Row>
                            <Col lg="6" className="m-auto">
                                <h3 className="fw-bold mb-4 text-center auth__title">Thông tin khách hàng</h3>

                                <AvForm className="auth__form"
                                    encType="multipart/form-data"
                                    onValidSubmit={submit}
                                    model={defaultValues}>

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
                                        <AvRadio label="Nữ"
                                            className="mx-2"
                                            value="female"
                                        />
                                    </AvRadioGroup>
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
                                    <FormGroup>
                                        <Label className="text-right text-white mx-2">
                                            Ảnh đại diện
                                        </Label>
                                        <div className="text-center">
                                            {
                                                queryResult.data.customeravatar ? <img src={require('../assets/image_data/avatar/' + queryResult.data.customeravatar)} className="w-25 m-auto" />
                                                    : "Bạn chưa chọn ảnh đại diện"
                                            }

                                        </div>
                                    </FormGroup>
                                    <AvGroup>
                                        <Label className="text-right text-white mx-2">
                                            Chọn ảnh đại diện mới
                                        </Label>
                                        <AvInput name="avatar" type="file" accept="image/*"
                                            onChange={onImageChange}
                                            validate={{ checkCapacity: validateImage }} />
                                        <AvFeedback>Dung lượng tối đa là 2 Mb.</AvFeedback>
                                        <div className="text-center mt-4">
                                            {image && <img src={image} className="w-25 m-auto" />}
                                        </div>
                                    </AvGroup>
                                    {
                                        mutation.isLoading || mutationRefreshToken.isLoading ? <Loading /> :
                                            <FormGroup className="text-center">
                                                <button className="buy__btn auth__btn" type="submit">
                                                    Lưu thay đổi
                                                </button>
                                            </FormGroup>
                                    }

                                </AvForm>

                            </Col>

                        </Row>
                    </Container>
                </section>
            }
        </Helmet>
    );
};

export default CustomerInfo;




