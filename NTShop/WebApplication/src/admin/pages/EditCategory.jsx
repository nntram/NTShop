import React, { useState } from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container, Label, FormGroup, Col, Input } from 'reactstrap'
import UploadImage from '../components/UploadImage'
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import categoryApi from '../../api/CategoryApi'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import Loading from '../../components/loading/Loading'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ToDateTimeString } from '../../utils/Helpers'

const EditCategory = () => {

  const {categoryId} = useParams()
  const [myFiles, setMyFiles] = useState([])
  const navigate = useNavigate()

  const postEditCategory = async (data) => {
    try {
      const response = await categoryApi.update(data)
      return response;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, { autoClose: false })
      }
      console.log("Failed to update category: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => postEditCategory(data)
  });

  const submit = async (e, values) => {
    e.preventDefault();

    const data = new FormData()
    data.append("Categoryid",  categoryId)
    data.append("Categoryname", values["Categoryname"])
    if (myFiles[0]) {
      data.append("CategoryImageFile", myFiles[0])
    }

    const result = await mutation.mutateAsync(data);
    if (result) {
      toast.success(result, { autoClose: false })
      navigate('/dashboard/all-categories')
    }
  }

  const fetchCategoryById = async (id) => {
    try {
      const response = await categoryApi.getById(id)
      return (response);
    } catch (error) {
      console.log('Failed to fetch category: ', error);
    }
  }
  const queryCategory = useQuery(
    {
      queryKey: ['category'],
      queryFn: ({ id = categoryId }) => fetchCategoryById(id),
      cacheTime: 1000
    }
  )

  let defaultValues;
  if (queryCategory.isSuccess) {
    defaultValues = {
      Categoryname: queryCategory.data.categoryname,
    }

  }

  return (
    <Helmet title='Chỉnh sửa loại sản phẩm'>
      <CommonSection title='Chỉnh sửa loại sản phẩm' />

      <Container className='my-5 d-flex justify-content-center'>
        <Col md='6'>
          {!queryCategory.isSuccess ? <Loading /> :
            <AvForm className="auth__form"
              model={defaultValues}
              encType="multipart/form-data"
              onValidSubmit={submit}>
              <AvGroup>
                <Label className="text-right text-white mx-2">
                  Tên loại sản phẩm <span className="text-danger">*</span>
                </Label>
                <AvField name="Categoryname" type="text"
                  placeholder="Tên loại sản phẩm"
                  validate={{
                    required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                    maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                  }} />
              </AvGroup>
              <FormGroup>
                <Label className="text-right text-white mx-2">
                  Ngày tạo:
                </Label>
                <Input type='text' readOnly value={ToDateTimeString(queryCategory.data.categorycreateddate)} />               
              </FormGroup>
              <FormGroup>
                <Label className="text-right text-white mx-2">
                  Hình ảnh
                </Label>
                <div className='text-center'>
                  <img src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/categories/${queryCategory.data.categoryimage}`}
                    className='w-50' alt="" />
                </div>
              </FormGroup>
              <AvGroup>
                <Label className="text-right text-white mx-2">
                  Chọn ảnh khác
                </Label>

                <UploadImage myFiles={myFiles} setMyFiles={setMyFiles} maxFiles={1} />
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
          }

        </Col>
      </Container>

      <section className='p-3'>
        <div className='mt-3 text-info'>
          <Link to='/dashboard/all-categorys' >
            <i className='ri-arrow-go-back-line'></i> Trở về
          </Link>
        </div>
      </section>

    </Helmet>
  )
}

export default EditCategory