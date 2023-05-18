import React, { useRef, useState } from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container, Label, FormGroup, Col, Row, Input, Button } from 'reactstrap'
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import warehouseReceiptApi from '../../api/WarehouseReceiptApi'
import { useMutation, useQueries, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import Loading from '../../components/loading/Loading'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import supplierApi from '../../api/SupplierApi';
import productApi from '../../api/ProductApi'
import Select from 'react-select';
import { motion } from 'framer-motion';

const CreateWarehouseReceipt = () => {
  const [rowsData, setRowsData] = useState([]);
  const bodyRef = useRef()

  const navigate = useNavigate()
  const currentStaff = useSelector(state => state.staff.currentStaff)

  var now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  now.setMilliseconds(null)
  now.setSeconds(null)
  const timeNow = now.toISOString().slice(0, -1)

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

    if (rowsData.length < 1) {
      toast.error("Vui lòng thêm sản phẩm.");
      return;
    }

    const data = new FormData()
    data.append('Staffid', values['Staffid'])
    data.append('Supplierid', values['Supplierid'])
    data.append('Warehousereceiptcreateddate', new Date(values['Createddate']).valueOf())
    data.append('Warehousereceiptcode', values['Warehousereceiptcode'])

    let wrDetail = []
    rowsData.forEach((item) => {
      let value = {
        Productid: '',
        Wrdetailprice: 0,
        Wrdetailquatity: 0,
        Wrdetailsaleprice: 0,
      }
      for (var key in item) {
        if (key.startsWith('product')) {
          value.Productid = item[key]
        }
        if (key.startsWith('price')) {
          value.Wrdetailprice = item[key]
        }
        if (key.startsWith('quantity')) {
          value.Wrdetailquatity = item[key]
        }
        if (key.startsWith('salePrice')) {
          value.Wrdetailsaleprice = item[key]
        }
      }
      wrDetail = [...wrDetail, value]
    })
    data.append('StrWarehousereceiptdetail', JSON.stringify(wrDetail))


    const result =""//= await mutation.mutateAsync(data);
    if (result) {
      toast.success(result, { autoClose: false })
      navigate('/dashboard/all-warehouse-receipts')
    }
  }
  const fetchProducts = async () => {
    try {
      const response = await productApi.getAllCard({
        params: {
        }
      })
      return (response);
    } catch (error) {
      console.log('Failed to fetch products: ', error)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const response = await supplierApi.getAll()
      return (response);
    } catch (error) {
      console.log('Failed to fetch suppliers: ', error)
    }
  }
  const queryResults = useQueries(
    [
      {
        queryKey: ['db-suppliers'],
        queryFn: fetchSuppliers
      },
      {
        queryKey: ['db-products'],
        queryFn: fetchProducts,
      },
    ]
  )

  const isSuccess = queryResults.every(query => query.isSuccess)
  let supplierOptions
  let productOptions

  if (isSuccess) {
    if (queryResults[0].data) {
      supplierOptions = [...queryResults[0].data.map((item) => (
        {
          value: item.supplierid, label: item.suppliername
        }
      ))]
    }
    if (queryResults[1].data) {
      productOptions = [...queryResults[1].data.items.map((item) => (
        {
          value: item.productid,
          label: item.productname,
          image: item.productimages,
          salePrice: item.productsaleprice
        }
      ))]
    }
  }

  const addTableRows = () => {

    const rowsInput = {
      id: "id" + Math.random().toString(16).slice(2),
    }
   
    setRowsData([...rowsData, rowsInput])
  }
  const deleteTableRows = (index) => {
    const rows = [...rowsData];
    rows.splice(index, 1);
    setRowsData(rows);
  }

  const handleChange = (index, evnt, selectName, salePrice) => {
    let name, value

    if (selectName) {
      name = selectName
      value = evnt.value
    }
    else {
      name = evnt.target.name
      value = evnt.target.value
    }
    const rowsInput = [...rowsData];
    rowsInput[index][name] = value;
    if(salePrice){
      rowsInput[index][`salePrice-${index}`] = salePrice
    }
    setRowsData(rowsInput);
  }


  return (
    <Helmet title='Tạo mới phiếu nhập hàng'>
      <CommonSection title='Tạo mới phiếu nhập hàng' />
      {
        !isSuccess ? <Loading /> :
          <Container className='my-5 d-flex justify-content-center'>
            <Col md={12}>
              <AvForm className="auth__form"
                encType="multipart/form-data"
                onValidSubmit={submit}>
                <Row>
                  <Col md={6}>
                    <AvGroup>
                      <Label className="text-right text-white mx-2">
                        Ngày nhập <span className="text-danger">*</span>
                      </Label>
                      <AvField type="datetime-local" name='Createddate' className='w-75'
                        value={timeNow}
                        validate={{
                          required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                        }} />
                    </AvGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className="text-right text-white mx-2">
                        Nhân viên thực hiện: <span className="text-danger">*</span>
                      </Label>
                      <Input name="Staffname" type="text" value={currentStaff.DisplayName} disabled />
                      <AvField name="Staffid" type="text" value={currentStaff.Id} hidden />
                    </FormGroup>
                  </Col>

                </Row>
                <Row>
                  <Col md={6}>
                    <AvGroup>
                      <Label className="text-right text-white mx-2">
                        Nhà cung cấp <span className="text-danger">*</span>
                      </Label>
                      <AvField type="select" name="Supplierid" required >
                        <option value="" hidden>Chọn nhà cung cấp</option>
                        {
                          supplierOptions && supplierOptions.map((item) => (
                            <option value={item.value} key={item.value}>
                              {item.label}
                            </option>
                          ))
                        }
                      </AvField>
                    </AvGroup>
                  </Col>
                  <Col md={6}>
                    <AvGroup>
                      <Label className="text-right text-white mx-2">
                        Mã phiếu nhập <span className="text-danger">*</span>
                      </Label>
                      <AvField type="text" name="Warehousereceiptcode"
                        validate={{
                          required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                          maxLength: { value: 128, errorMessage: 'Quá độ dài cho phép' },
                        }} />

                    </AvGroup>
                  </Col>
                </Row>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Sản phẩm</th>
                      <th>Giá nhập</th>
                      <th>Giá bán</th>
                      <th>Số lượng</th>
                      <th>Xóa</th>
                    </tr>
                  </thead>
                  <tbody ref={bodyRef}>

                    <TableRows rowsData={rowsData} productOptions={productOptions}
                      deleteTableRows={deleteTableRows} handleChange={handleChange} />
                  </tbody>
                </table>
                <div>
                  <button className='btn btn-secondary'
                    type='button'
                    onClick={addTableRows}
                  >
                    <i className="ri-add-line"></i> Thêm dòng mới
                  </button>
                </div>
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


const TableRows = ({ rowsData, deleteTableRows, productOptions, handleChange }) => {

  return (
    rowsData.map((data, index) => {

      return (
        <Tr key={data.id} index={index} deleteTableRows={deleteTableRows} handleChange={handleChange}
          productOptions={productOptions} data={data} />
      )
    })
  )

}

const Tr = ({ deleteTableRows, productOptions, index, data, handleChange }) => {

  const priceRef = useRef()
  const salePriceRef = useRef()

  const [product, setProduct] = useState()
  const [productSalePrice, setProductSalePrice] = useState(0)

  const productSelect = productOptions.find(x => x.value === product)
  const handlePriceChange = (e) => {
    priceRef.current.innerText = `Thành tiền: ${(Number)(e.target.value).toLocaleString()} VNĐ`
  }
  const handleSalePriceChange = (e) => {
    salePriceRef.current.innerText = `Thành tiền: ${(Number)(e.target.value).toLocaleString()} VNĐ`
  }
  const handleProductSelect = (index, e, name) => {
    setProduct(e.value)
    setProductSalePrice(e.salePrice)
    handleChange(index, e, name, e.salePrice)
  }

  return (
    <tr>
      <td>{Number(index) + 1}</td>
      <td>
        <AvGroup>
          <Select options={productOptions}
            value={productSelect}
            formatOptionLabel={product => (
              <div className="country-option">
                <img src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/products/${product.image}`} alt="" />
                <span>{product.label}</span>
              </div>
            )}
            placeholder="Chọn sản phẩm"
            onChange={(e) => handleProductSelect(index, e, `product-${index}`)}
          />
          <AvField name={`product-${data.id}`} type="text"
            value={product}
            hidden
            validate={{
              required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
            }} />
        </AvGroup>
      </td>
      <td>
        <AvGroup>
          <AvField name={`price-${data.id}`} type="number"
            onChange={(evnt) => (handleChange(index, evnt))}
            onKeyUp={handlePriceChange}
            placeholder="Đơn giá nhập"
            validate={{
              pattern: { value: '^[1-9][0-9]*$', errorMessage: 'Chỉ chấp nhận giá trị nguyên dương.' },
              required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
            }} />
          <p className="text-dark mx-2" ref={priceRef}>Thành tiền: 0 VNĐ </p>
        </AvGroup>
      </td>
      <td>
        <AvGroup>
          <AvField name={`salePrice-${data.id}`} type="number"
            onChange={(evnt) => (handleChange(index, evnt))}
            onKeyUp={handleSalePriceChange}
            placeholder="Giá bán"
            value={productSalePrice}
            validate={{
              pattern: { value: '^[1-9][0-9]*$', errorMessage: 'Chỉ chấp nhận giá trị nguyên dương.' },
              required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
            }} />
          <p className="text-dark mx-2" ref={salePriceRef}>Thành tiền: {productSalePrice.toLocaleString()} VNĐ </p>
        </AvGroup>
      </td>
      <td>
        <AvGroup>
          <AvField name={`quantity-${data.id}`} type="number"
            onChange={(evnt) => (handleChange(index, evnt))}
            placeholder="Số lượng"
            validate={{
              pattern: { value: '^[1-9][0-9]*$', errorMessage: 'Chỉ chấp nhận giá trị nguyên dương.' },
              required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
            }} />

        </AvGroup>
      </td>
      <td>
        <motion.div className='text-danger remove__cartItem' whileTap={{ scale: 1.2 }}>
          <i
            className="ri-delete-bin-line"
            onClick={() => (deleteTableRows(index))}
          >
          </i>
        </motion.div>
      </td>
    </tr>
  )
}


export default CreateWarehouseReceipt