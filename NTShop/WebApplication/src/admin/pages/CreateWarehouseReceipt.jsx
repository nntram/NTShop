import React, { useState } from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container, Label, FormGroup, Col, Row, Input } from 'reactstrap'
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import warehouseReceiptApi from '../../api/WarehouseReceiptApi'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import Loading from '../../components/loading/Loading'
import { useNavigate, Link } from 'react-router-dom'
import addressApi from '../../api/AddressApi';
import { useSelector } from 'react-redux';
const CreateWarehouseReceipt = () => {

  const navigate = useNavigate()
  const currentStaff = useSelector(state => state.staff.currentStaff)

  const postWarehouseReceipt = async (data) => {
    try {
      const response = await warehouseReceiptApi.create(data)
      return response;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, { autoClose: false })
      }
      console.log("Failed to create warehouseReceipt: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => postWarehouseReceipt(data),
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
      navigate('/dashboard/all-warehouseReceipts')
    }
  }


  return (
    <Helmet title='Tạo mới phiếu nhập hàng'>
      <CommonSection title='Tạo mới phiếu nhập hàng' />

      <Container className='my-5 d-flex justify-content-center'>
        <Col md={10}>
          <AvForm className="auth__form"
            encType="multipart/form-data"
            onValidSubmit={submit}>
            <div className='d-flex'>
              <FormGroup className='w-50'>
                <Label className="text-right text-white mx-2">
                  Ngày nhập <span className="text-danger">*</span>
                </Label>
                <Input type="date"  className='w-75'/>
              </FormGroup>
           
              <FormGroup className='w-50'>
                <Label className="text-right text-white mx-2">
                  Nhân viên thực hiện: <span className="text-danger">*</span>
                </Label>
                <Input name="Staffname" type="text" value={currentStaff.DisplayName} disabled />
                <Input name="Staffid" type="text" value={currentStaff.Id} hidden />
              </FormGroup>
            </div>

            <AvGroup>
              <Label className="text-right text-white mx-2">
                Nhà cung cấp <span className="text-danger">*</span>
              </Label>
              <AvField type="select" name="Wardid" required >
                <option value="" hidden>Chọn nhà cung cấp</option>
                {
                  // wardOptions && wardOptions.map((item) => (
                  //   <option value={item.value} key={item.value}>
                  //     {item.label}
                  //   </option>
                  // ))
                }
              </AvField>
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
          <Link to='/dashboard/all-warehouse-receipts' >
            <i className='ri-arrow-go-back-line'></i> Trở về
          </Link>
        </div>
      </section>

    </Helmet>
  )
}

export default CreateWarehouseReceipt