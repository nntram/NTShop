import React, { useRef, useState } from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container, Label, FormGroup, Col, Row, Input } from 'reactstrap'
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

    console.log(rowsData)
    for(var item in rowsData){
        data.append('Warehousereceiptdetail', item)
    }
    const result = await mutation.mutateAsync(data);
    if (result) {
      toast.success(result, { autoClose: false })
      navigate('/dashboard/all-warehouseReceipts')
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
          label: <ProductOption name={item.productname} image={item.productimages} />
        }
      ))]
    }
  }

  const addTableRows = () => {

    const rowsInput = {
      id: "id" + Math.random().toString(16).slice(2)
    }
    setRowsData([...rowsData, rowsInput])
  }
  const deleteTableRows = (index) => {
    const rows = [...rowsData];
    rows.splice(index, 1);
    setRowsData(rows);
  }

  const handleChange = (index, evnt, selectName) => {
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
                <div className='d-flex'>
                  <AvGroup className='w-50'>
                    <Label className="text-right text-white mx-2">
                      Ngày nhập <span className="text-danger">*</span>
                    </Label>
                    <AvField type="datetime-local" name='Createddate' className='w-75'
                      validate={{
                        required: { value: true, errorMessage: 'Vui lòng điền đầy đủ thông tin.' },
                      }} />
                  </AvGroup>

                  <FormGroup className='w-50'>
                    <Label className="text-right text-white mx-2">
                      Nhân viên thực hiện: <span className="text-danger">*</span>
                    </Label>
                    <Input name="Staffname" type="text" value={currentStaff.DisplayName} disabled />
                    <AvField name="Staffid" type="text" value={currentStaff.Id} hidden />
                  </FormGroup>
                </div>

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

                <table className='table'>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Sản phẩm</th>
                      <th>Giá nhập</th>
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
          <Link to='/dashboard/all-warehouse-receipts' >
            <i className='ri-arrow-go-back-line'></i> Trở về
          </Link>
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

  const priceName = `price`
  const quantityName = `quantity`
  const productName = `product`
  const price = data[priceName];
  const quantity = data[quantityName];

  const priceRef = useRef()
  const [product, setProduct] = useState(data[productName])

  const productSelect = productOptions.find(x => x.value === product)
  const handlePriceChange = (e) => {
    priceRef.current.innerText = `Thành tiền: ${(Number)(e.target.value).toLocaleString()} VNĐ`
  }
  const handleProductSelect = (index, e, name) => {
    setProduct(e.value)
    handleChange(index, e, name)
  }

  return (
    <tr>
      <td>{Number(index) + 1}</td>
      <td>
        <AvGroup>
          <Select options={productOptions}
            value={productSelect}
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
            value={price}
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
          <AvField name={`quantity-${data.id}`} type="number"
            value={quantity}
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

const ProductOption = ({ image, name }) => {
  return (
    <div>
      <img src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/products/${image}`} alt="" />
      {name}
    </div>
  )
}

export default CreateWarehouseReceipt