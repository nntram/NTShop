import React from 'react'
import CommonSection from '../../components/UI/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { Container, Label, Form, FormGroup, Col, Input, Button } from 'reactstrap'
import warehouseReceiptApi from '../../api/WarehouseReceiptApi'
import { useQuery } from 'react-query'
import Loading from '../../components/loading/Loading'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ToDateTimeString } from '../../utils/Helpers'


const EditWarehouseReceipt = () => {
  const { warehouseReceiptId } = useParams()
  const navigate = useNavigate()
  const fetchWarehouseReceiptById = async (id) => {
    try {
      const response = await warehouseReceiptApi.getById(id)
      return (response);
    } catch (error) {
      console.log('Failed to fetch warehouseReceipt: ', error);
    }
  }
  const queryWarehouseReceipt = useQuery(
    {
      queryKey: ['warehouseReceipt', warehouseReceiptId],
      queryFn: ({ id = warehouseReceiptId }) => fetchWarehouseReceiptById(id)
    }
  )
  let content
  let contentBody = ''
  let totalPrice = 0
  const isSuccess = queryWarehouseReceipt.isSuccess
  if (isSuccess) {
    queryWarehouseReceipt.data?.warehousereceiptdetails.map((item, index) => {
      totalPrice += item.wrdetailprice * item.wrdetailquatity
      contentBody += `<tr>
      <td>${index + 1}</td>
      <td>
       ${item.product.productname}
      </td>
      <td style="text-align: right;"> ${item.wrdetailprice.toLocaleString()} VNĐ</td>
      <td style="text-align: right;">${item.wrdetailquatity}</td>
    </tr>`
    })

    content = ` 
  <head>
      <title>Mã phiếu nhập: ${warehouseReceiptId}</title>
  </head>
  <body> 
      <center><h2>Thông tin phiếu nhập</h2></center>
      <Container>
      <p>Ngày nhập: ${ToDateTimeString(queryWarehouseReceipt.data.warehousereceiptcreateddate)}</p>
      <p>Nhân viên phụ trách: ${queryWarehouseReceipt.data.staff.staffname}</p>
      <p>Nhà cung cấp: ${queryWarehouseReceipt.data.supplier.suppliername}</p>
      <h3 className='b-3'> Thông tin chi tiết</h3>
      <Row className='mt-5 p-5 border border-dark'>
          <Col lg='12'>
              <table className='table bodered'>
                  <thead>
                      <tr>
                          <th>STT </th>
                          <th className='text-center'>Tên sản phẩm</th>
                          <th style="text-align: right;">Giá</th>
                          <th style="text-align: right;">Số lượng</th>
                      </tr>
                  </thead>

                  <tbody>
                      ${contentBody}
                      <tr className='text-center'>
                          <th colSpan={2}> Tổng:</th>
                          <th colSpan={2} style="text-align: right;">${totalPrice.toLocaleString()} VNĐ</th>
                      </tr>
                  </tbody>
              </table>
          </Col>
      </Row>
  </Container>
</body>`

  }
  const print = () => {
    var myWindow = window.open("", "", "width=1200,height=1400");
    myWindow.document.title = "Phiếu nhập hàng"
    myWindow.document.write(content);
    myWindow.print()
  }

  return (
    <Helmet title='Chi tiết phiếu nhập hàng'>
      <CommonSection title='Chi tiết phiếu nhập hàng' />
      {
        !isSuccess ? <Loading /> :
          <Container className='my-5 d-flex justify-content-center'>
            <Col md={12}>
              <Form className="auth__form"
                encType="multipart/form-data">
                <div className='d-flex'>
                  <FormGroup className='w-50'>
                    <Label className="text-right text-white mx-2">
                      Ngày nhập <span className="text-danger">*</span>
                    </Label>
                    <Input type="text" name='Editddate' className='w-75' disabled
                      value={ToDateTimeString(queryWarehouseReceipt.data.warehousereceiptcreateddate)} />
                  </FormGroup>

                  <FormGroup className='w-50'>
                    <Label className="text-right text-white mx-2">
                      Nhân viên thực hiện: <span className="text-danger">*</span>
                    </Label>
                    <Input name="Staffname" type="text" value={queryWarehouseReceipt.data.staff.staffname} disabled />

                  </FormGroup>
                </div>

                <FormGroup>
                  <Label className="text-right text-white mx-2">
                    Nhà cung cấp <span className="text-danger">*</span>
                  </Label>
                  <Input name="Suppliername" type="text" disabled value={queryWarehouseReceipt.data.supplier.suppliername} />
                </FormGroup>

                <table className='table'>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Sản phẩm</th>
                      <th>Giá nhập</th>
                      <th>Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      queryWarehouseReceipt.data?.warehousereceiptdetails.map((item, index) =>
                        <tr>
                          <td>{index + 1}</td>
                          <td>
                            <ProductOption name={item.product.productname}
                              image={item.product.productimages[0].productimageurl
                              } />
                          </td>
                          <td>{item.wrdetailprice.toLocaleString()} VNĐ</td>
                          <td>{item.wrdetailquatity}</td>
                        </tr>
                      )
                    }
                    <tr className='text-center'>
                      <th colSpan={2}> Tổng:</th>
                      <th colSpan={2}>{totalPrice.toLocaleString()} VNĐ</th>
                    </tr>
                  </tbody>
                </table>

              </Form>
              <div className='text-center mt-5'>
                <button className="btn btn-secondary" type="button" onClick={print}>
                  <i className='ri-printer-line'></i> In hóa đơn
                </button>
              </div>
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






const ProductOption = ({ image, name }) => {
  return (
    <div>
      <img src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/products/${image}`} alt="" />
      {name}
    </div>
  )
}

export default EditWarehouseReceipt