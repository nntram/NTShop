import React, { useState } from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container, Label, FormGroup, Col } from 'reactstrap'
import UploadImage from '../components/UploadImage'
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import brandApi from '../../api/BrandApi'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import Loading from '../../components/loading/Loading'
import { useNavigate, Link } from 'react-router-dom'

const CreateBrand = () => {
  const [myFiles, setMyFiles] = useState([])
  const navigate = useNavigate()

  const postBrand = async (data) => {
    try {
      const response = await brandApi.create(data)
      return response;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, { autoClose: false })
      }
      console.log("Failed to create brand: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => postBrand(data)
  });

  const submit = async (e, values) => {
    e.preventDefault();

    const data = new FormData()
    data.append("Brandname", values["Brandname"])
    data.append("BrandImageFile", myFiles[0])

    const result = await mutation.mutateAsync(data);
    if (result) {
      navigate('/dashboard/all-brands')
      toast.success(result, { autoClose: false })
    }
  }

  return (
    <Helmet title='Tạo mới thương hiệu'>
      <CommonSection title='Tạo mới thương hiệu' />

      <Container className='my-5 d-flex justify-content-center'>
        <Col md='6'>
          <AvForm className="auth__form"
            encType="multipart/form-data"
            onValidSubmit={submit}>
            <AvGroup>
              <Label className="text-right text-white mx-2">
                Tên thương hiệu <span className="text-danger">*</span>
              </Label>
              <AvField name="Brandname" type="text"
                placeholder="Tên thương hiệu"
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
          <Link to='/dashboard/all-brands' >
            <i className='ri-arrow-go-back-line'></i> Trở về
          </Link>
        </div>
      </section>

    </Helmet>
  )
}

export default CreateBrand