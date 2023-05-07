import React, { useState } from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container, Label, FormGroup, Col } from 'reactstrap'
import UploadImage from '../components/UploadImage'
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import productApi from '../../api/ProductApi'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import Loading from '../../components/loading/Loading'
import { useNavigate, Link } from 'react-router-dom'
import CustomCKEditor from '../components/CustomCKEditor'


const CreateProduct = () => {
  const [myFiles, setMyFiles] = useState([])
  const navigate = useNavigate()

  const postProduct = async (data) => {
    try {
      const response = await productApi.create(data)
      return response;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, { autoClose: false })
      }
      console.log("Failed to create product: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => postProduct(data),
  });

  const submit = async (e, values) => {
    e.preventDefault();

    const data = new FormData()
    data.append("Productname", values["Productname"])
    data.append("ProductImageFile", myFiles[0])

    const result = await mutation.mutateAsync(data);
    if (result) {
      toast.success(result, { autoClose: false })
      navigate('/dashboard/all-products')
    }
  }

  return (
    <Helmet title='Tạo mới sản phẩm'>
      <CommonSection title='Tạo mới sản phẩm' />

      <Container className='my-5 d-flex justify-content-center'>
        <Col md='6'>
          <AvForm className="auth__form"
            encType="multipart/form-data"
            onValidSubmit={submit}>
            <AvGroup>
              <Label className="text-right text-white mx-2">
                Tên sản phẩm <span className="text-danger">*</span>
              </Label>
              <AvField name="Productname" type="text"
                placeholder="Tên sản phẩm"
                validate={{
                  required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                  maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                }} />
            </AvGroup>
            <AvGroup>
              <Label className="text-right text-white mx-2">
                Hình ảnh <span className="text-danger">*</span>
              </Label>
              <AvField name="img" type="text" value={myFiles} className='d-none' validate={{
                required: { value: true, errorMessage: 'Vui lòng chọn một ảnh.' },
              }} />
              <UploadImage myFiles={myFiles} setMyFiles={setMyFiles} maxFiles={1} />
            </AvGroup>
            <FormGroup>
              <Label className="text-right text-white mx-2">Mô tả sản phẩm </Label>
              <CustomCKEditor title={"Mô tả sản phẩm"}/>
            </FormGroup>

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
          <Link to='/dashboard/all-products' >
            <i className='ri-arrow-go-back-line'></i> Trở về
          </Link>
        </div>
      </section>

    </Helmet>
  )
}

export default CreateProduct