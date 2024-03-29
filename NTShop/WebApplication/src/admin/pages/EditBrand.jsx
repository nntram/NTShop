import React, { useState } from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container, Label, FormGroup, Col, Input, Button } from 'reactstrap'
import UploadImage from '../components/UploadImage'
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import brandApi from '../../api/BrandApi'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import Loading from '../../components/loading/Loading'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ToDateTimeString } from '../../utils/Helpers'

const EditBrand = () => {

  const { brandId } = useParams()
  const [myFiles, setMyFiles] = useState([])
  const navigate = useNavigate()

  const postEditBrand = async (data) => {
    try {
      const response = await brandApi.update(data)
      return response;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, { autoClose: false })
      }
      console.log("Failed to update brand: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => postEditBrand(data)
  });

  const submit = async (e, values) => {
    e.preventDefault();

    const data = new FormData()
    data.append("Brandid", brandId)
    data.append("Brandname", values["Brandname"])
    if (myFiles[0]) {
      data.append("BrandImageFile", myFiles[0])
    }

    const result = await mutation.mutateAsync(data);
    if (result) {
      toast.success(result, { autoClose: false })
      navigate('/dashboard/all-brands')
    }
  }

  const fetchBrandById = async (id) => {
    try {
      const response = await brandApi.getById(id)
      return (response);
    } catch (error) {
      console.log('Failed to fetch brand: ', error);
    }
  }
  const queryBrand = useQuery(
    {
      queryKey: ['brand', brandId],
      queryFn: ({ id = brandId }) => fetchBrandById(id),
      cacheTime: 1000
    }
  )

  let defaultValues;
  if (queryBrand.isSuccess) {
    defaultValues = {
      Brandname: queryBrand.data.brandname,
    }

  }

  return (
    <Helmet title='Chỉnh sửa thương hiệu'>
      <CommonSection title='Chỉnh sửa thương hiệu' />

      <Container className='my-5 d-flex justify-content-center'>
        <Col md='6'>
          {!queryBrand.isSuccess ? <Loading /> :
            <AvForm className="auth__form"
              model={defaultValues}
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
              <FormGroup>
                <Label className="text-right text-white mx-2">
                  Ngày tạo:
                </Label>
                <Input type='text' readOnly value={ToDateTimeString(queryBrand.data.brandcreateddate)} />
              </FormGroup>
              <FormGroup>
                <Label className="text-right text-white mx-2">
                  Hình ảnh
                </Label>
                <div className='text-center'>
                  <img src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/brands/${queryBrand.data.brandimage}`}
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
          <Button type='button' onClick={() => navigate(-1)} >
            <i className='ri-arrow-go-back-line'></i> Trở về
          </Button>
        </div>
      </section>

    </Helmet>
  )
}

export default EditBrand