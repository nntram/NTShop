import React, { useState, useRef, useEffect } from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container, Label, FormGroup, Col, Button } from 'reactstrap'
import UploadImage from '../components/UploadImage'
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import productApi from '../../api/ProductApi'
import brandApi from '../../api/BrandApi'
import categoryApi from '../../api/CategoryApi'
import { useMutation, useQueries, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import Loading from '../../components/loading/Loading'
import { useNavigate, Link, useParams } from 'react-router-dom'
import CustomCKEditor from '../components/CustomCKEditor'
import resourceApi from '../../api/ResourceApi'

const EditProduct = () => {
  const [myFiles, setMyFiles] = useState([])
  const navigate = useNavigate()
  const { productId } = useParams()
  const priceRef = useRef(null)
  const salePriceRef = useRef(null)
  const [describer, setdDescriber] = useState('')

  const fetchProudctById = async (id) => {
    try {
      const response = await productApi.getById(id)

      return (response);
    } catch (error) {
      console.log('Failed to fetch product: ', error);
    }
  }

  const fetchImages = async (name) => {
    try {
      const response = await resourceApi.getImage(`/products/${name}`)
      return (response);
    } catch (error) {
      console.log('Failed to fetch product image: ', error);
    }
  }

  const postEditProduct = async (data) => {
    try {
      const response = await productApi.update(data)
      return response;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, { autoClose: false })
      }
      console.log("Failed to update product: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => postEditProduct(data),
  });

  const submit = async (e, values) => {
    e.preventDefault();

    const data = new FormData()
    for (var key in values) {
      data.append(key, values[key]);
    }
    myFiles.forEach((file) => {
      data.append('ProductImageFiles', file)
    })
    data.append('Productid', productId)
    data.append('Productdescribe', describer)
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
      { queryKey: ['categories', productId], queryFn: fetchCategoryList },
      { queryKey: ['brands', productId], queryFn: fetchBrandList },
      {
        queryKey: ['dbproduct', productId],
        queryFn: ({ id = productId }) => fetchProudctById(id),
        cacheTime: 1000
      }
    ])
  let product = queryResults[2].data

  const queryImage = useQueries(
    product?.productimages?.map((item) =>
    ({
      queryKey: ['productimage', item.productimageid],
      queryFn: () => fetchImages(item.productimageurl),
      enabled: queryResults[2].data != null
    }),
    ) ?? []
  )
  const fetchImageFiles = async (data, index) => {
    try {
      const url = `data:image/png;base64,${data}`
      const res = await fetch(url)
      const blob = await res.blob()
      const file = new File([blob], queryResults[2].data.productimages[index].productimageurl)
      return file
    } catch (error) {
      console.log('Failed to fetch product image file: ', error);
    }
  }
  const queryImageFile = useQueries(
    queryImage?.map((item, index) =>
    ({
      queryKey: ['productimagefile', item],
      queryFn: () => fetchImageFiles(item.data, index),
      enabled: queryResults[2].data != null && Boolean(queryImage[0].data)
    }),
    ) ?? []
  )

  const isSuccess = queryResults.every(query => query.isSuccess)
    && queryImage.every(query => query.isSuccess)
    && queryImageFile.every(query => query.isSuccess)

  let categoryOptions
  let brandOptions
  let defaultValues
  let defaultImages = []
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
      let images = []
      queryImageFile?.map((item) => {
        images = [...images, item.data]
      })
      if (images) {
        defaultImages = images
      }
    }
    defaultValues = {
      Productname: queryResults[2].data.productname,
      Productquantity: (Number)(queryResults[2].data.productquantity),
      Productprice: (Number)(queryResults[2].data.productprice),
      Productsaleprice: (Number)(queryResults[2].data.productsaleprice),
      Categoryid: queryResults[2].data.categoryid,
      Brandid: queryResults[2].data.brandid,
      Productisactive: queryResults[2].data.productisactive,
      Productishot: queryResults[2].data.productishot,
    }

  }

  const handlePriceChange = (e) => {
    priceRef.current.innerText = `Thành tiền: ${(Number)(e.target.value).toLocaleString()} VNĐ`
  }
  const handleSalePriceChange = (e) => {
    salePriceRef.current.innerText = `Thành tiền: ${(Number)(e.target.value).toLocaleString()} VNĐ`
  }

  useEffect(() => {
    if (defaultImages) {
      setMyFiles([...defaultImages.map(file => Object.assign(file, { preview: URL.createObjectURL(file), path: file.name }))])
    }
  }, [defaultImages.length])


  return (
    <Helmet title='Chỉnh sửa sản phẩm'>
      <CommonSection title='Chỉnh sửa sản phẩm' />
      {
        !isSuccess ? <Loading /> :
          <Container className='my-5 d-flex justify-content-center'>
            <Col md='6'>
              <AvForm className="auth__form"
                model={defaultValues}
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
                  <AvField type="select" name="Categoryid" required>
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
                  <AvField type="select" name="Brandid" required>
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
                    onChange={handlePriceChange}
                    placeholder="Giá niêm yết"
                    validate={{
                      pattern: { value: '^[1-9][0-9]*$', errorMessage: 'Chỉ chấp nhận giá trị nguyên dương.' },
                      required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                    }} />
                  <p className="text-dark mx-2" ref={priceRef}>Thành tiền: {queryResults[2].data.productprice.toLocaleString()} VNĐ </p>
                </AvGroup>

                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Giá bán <span className="text-danger">*</span>
                  </Label>
                  <AvField name="Productsaleprice" type="number"
                    onChange={handleSalePriceChange}
                    placeholder="Giá bán"
                    validate={{
                      pattern: { value: '^[1-9][0-9]*$', errorMessage: 'Chỉ chấp nhận giá trị nguyên dương.' },
                      required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                    }} />
                  <p className="text-dark mx-2" ref={salePriceRef}>Thành tiền: {queryResults[2].data.productsaleprice.toLocaleString()} VNĐ </p>
                </AvGroup>

                <AvGroup>
                  <Label className="text-right text-white mx-2">
                    Số lượng <span className="text-danger">*</span>
                  </Label>
                  <AvField name="Productquantity" type="number"
                    placeholder="Số lượng"
                    validate={{
                      pattern: { value: '^[1-9][0-9]*$', errorMessage: 'Chỉ chấp nhận giá trị nguyên dương.' },
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
                      <AvInput type="checkbox" name="Productisactive" /> Sản phẩm đang kinh doanh
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
                  <CustomCKEditor title={queryResults[2].data.productdescribe} value={describer} setValue={setdDescriber} />
                </FormGroup>



                {
                  mutation.isLoading ? <Loading /> :
                    <FormGroup className="text-center">
                      <button className="buy__btn auth__btn" type="submit">
                        Lưu thay đổi
                      </button>
                    </FormGroup>
                }

              </AvForm>


            </Col>
          </Container>
      }

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

export default EditProduct