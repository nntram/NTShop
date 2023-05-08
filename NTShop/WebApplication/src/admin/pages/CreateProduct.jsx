import React, { useState } from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container, Label, FormGroup, Col } from 'reactstrap'
import UploadImage from '../components/UploadImage'
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import productApi from '../../api/ProductApi'
import brandApi from '../../api/BrandApi'
import categoryApi from '../../api/CategoryApi'
import { useMutation, useQueries } from 'react-query'
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


  const fetchCategoryList = async () => {
    try {
      const response = await categoryApi.getAll();
      return (response.map((item) => ({
        id: item.categoryid,
        name: item.categoryname,
        image: item.categoryimage,
        type: "categories"
      })));
    } catch (error) {
      console.log('Failed to fetch category list: ', error);
    }
  }

  const fetchBrandList = async () => {
    try {
      const response = await brandApi.getAll();
      return (response.map((item) => ({
        id: item.brandid,
        name: item.brandname,
        image: item.brandimage,
        type: "brands"
      })));
    } catch (error) {
      console.log('Failed to fetch brand list: ', error);
    }
  }


  const queryResults = useQueries(
    [
      { queryKey: 'categories', queryFn: fetchCategoryList },
      { queryKey: 'brands', queryFn: fetchBrandList },
    ])

  const isSuccess = queryResults.every(query => query.isSuccess)

  let categoryOptions
  let brandOptions

  if (isSuccess) {
    if (queryResults[0] && queryResults[0].data) {
      categoryOptions = [...queryResults[0].data.map((item) => (
        {
          value: item.id, label: item.name
        }
      ))]
    }

    if (queryResults[1] && queryResults[1].data) {
      brandOptions = [...queryResults[1].data.map((item) => (
        {
          value: item.id, label: item.name

        }
      ))]
    }
  }


  const handleCategorySelect = () => {

  }
  const handleBrandSelect = () => {

  }

  const defaultValues = {
    Productisactive: true
  }

  return (
    <Helmet title='Tạo mới sản phẩm'>
      <CommonSection title='Tạo mới sản phẩm' />

      <Container className='my-5 d-flex justify-content-center'>
        <Col md='6'>
          <AvForm className="auth__form"
            model = {defaultValues}
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
                Loại sản phẩm <span className="text-danger">*</span>
              </Label>
              <AvField type="select" name="Categoryid" required
                onChange={(e) => handleCategorySelect(e.target.value)}>
                <option value="" hidden>Chọn loại sản phẩm</option>
                {
                  categoryOptions && categoryOptions.map((item) => (
                    <option value={item.value} key={item.value}>
                      {item.label}
                    </option>
                  ))
                }
              </AvField>
            </AvGroup>

            <AvGroup>
              <Label className="text-right text-white mx-2">
                Thương hiệu <span className="text-danger">*</span>
              </Label>
              <AvField type="select" name="Brandid" required
                onChange={(e) => handleBrandSelect(e.target.value)}>
                <option value="" hidden>Chọn thương hiệu</option>
                {
                  brandOptions && brandOptions.map((item) => (
                    <option value={item.value} key={item.value}>
                      {item.label}
                    </option>
                  ))
                }
              </AvField>
            </AvGroup>

            <AvGroup>
              <Label className="text-right text-white mx-2">
                Giá niêm yết <span className="text-danger">*</span>
              </Label>
              <AvField name="Productprice" type="number"
                placeholder="Giá niêm yết"
                validate={{
                  pattern: { value: '^[^0][0-9]+$', errorMessage: 'Chỉ chấp nhận giá trị nguyên dương.' },
                  required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                }} />
            </AvGroup>

            <AvGroup>
              <Label className="text-right text-white mx-2">
                Giá bán <span className="text-danger">*</span>
              </Label>
              <AvField name="Productsaleprice" type="number"
                placeholder="Giá bán"
                validate={{
                  pattern: { value: '^[^0][0-9]+$', errorMessage: 'Chỉ chấp nhận giá trị nguyên dương.' },
                  required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                }} />
            </AvGroup>

            <AvGroup>
              <Label className="text-right text-white mx-2">
                Số lượng <span className="text-danger">*</span>
              </Label>
              <AvField name="Productquantity" type="number"
                placeholder="Số lượng"
                validate={{
                  pattern: { value: '^[^0][0-9]+$', errorMessage: 'Chỉ chấp nhận giá trị nguyên dương.' },
                  required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                }} />
            </AvGroup>

            <div className='border p-3 my-3 d-flex gap-5'>
              <AvGroup check inline>
                <Label check>
                  <AvInput type="checkbox" name="Productishot" /> Sản phẩm nổi bật
                </Label>
              </AvGroup>
              <AvGroup check inline>
                <Label check>
                  <AvInput type="checkbox" name="Productisactive"/> Sản phẩm đang kinh doanh
                </Label>
              </AvGroup>
            </div>
            <AvGroup>
              <Label className="text-right text-white mx-2">
                Hình ảnh <span className="text-danger">*</span>
              </Label>
              <AvField name="img" type="text" value={myFiles} className='d-none' validate={{
                required: { value: true, errorMessage: 'Vui lòng chọn tối thiểu 1 ảnh.' },
              }} />
              <UploadImage myFiles={myFiles} setMyFiles={setMyFiles} maxFiles={10} />
            </AvGroup>

            <FormGroup>
              <Label className="text-right text-white mx-2">Mô tả sản phẩm </Label>
              <CustomCKEditor title={"Mô tả sản phẩm"} />
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