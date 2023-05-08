import React, { useState } from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container, Label, FormGroup, Col } from 'reactstrap'
import UploadImage from '../components/UploadImage'
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import categoryApi from '../../api/CategoryApi'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import Loading from '../../components/loading/Loading'
import { useNavigate, Link } from 'react-router-dom'

const CreateCategory = () => {
  const [myFiles, setMyFiles] = useState([])
  const navigate = useNavigate()

  const postCategory = async (data) => {
    try {
      const response = await categoryApi.create(data)
      return response;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, { autoClose: false })
      }
      console.log("Failed to create category: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => postCategory(data),
  });

  const submit = async (e, values) => {
    e.preventDefault();

    const data = new FormData()
    data.append("Categoryname", values["Categoryname"])
    data.append("CategoryImageFile", myFiles[0])

    const result = await mutation.mutateAsync(data);
    if (result) {
      toast.success(result, { autoClose: false })
      navigate('/dashboard/all-categories')  
    }
  }

  return (
    <Helmet title='Tạo mới loại sản phẩm'>
      <CommonSection title='Tạo mới loại sản phẩm' />

      <Container className='my-5 d-flex justify-content-center'>
        <Col md='6'>
          <AvForm className="auth__form"
            encType="multipart/form-data"
            onValidSubmit={submit}>
            <AvGroup>
              <Label className="text-right text-white mx-2">
                Tên loại sản phẩm <span className="text-danger">*</span>
              </Label>
              <AvField name="Categoryname" type="text"
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
          <Link to='/dashboard/all-categories' >
            <i className='ri-arrow-go-back-line'></i> Trở về
          </Link>
        </div>
      </section>

    </Helmet>
  )
}

export default CreateCategory