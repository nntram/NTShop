import React from 'react'
import { useQuery, useMutation } from 'react-query'
import Loading from '../../components/loading/Loading'
import { Link } from 'react-router-dom'
import { ToDateTimeString } from '../../utils/Helpers'
import { Container, Row, Col } from 'reactstrap'
import Helmet from '../../components/helmet/Helmet'
import { toast } from 'react-toastify'
import warehouseReceiptApi from '../../api/WarehouseReceiptApi'
import { motion } from 'framer-motion'
import CommonSection from '../../components/UI/CommonSection'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const AllWarehouseReceipts = () => {



  const fetchWarehouseReceipts = async () => {
    try {
      const response = await warehouseReceiptApi.getAll()
      return (response);
    } catch (error) {
      console.log('Failed to fetch warehouseReceipts: ', error)
    }
  }
  const queryResult = useQuery(
    {
      queryKey: ['db-warehouseReceipts'],
      queryFn: fetchWarehouseReceipts
    },
  )



  return (
    <Helmet title='Phiếu nhập hàng'>
      <CommonSection title='Quản lý phiếu nhập hàng' />
      <section className='pb-0'>
        <Container>
          <Link to={'/dashboard/all-warehouse-receipts/create'}>
            <button className='btn btn-outline-secondary py-3 px-5 fw-bold'>
              <span className='d-flex align-items-center gap-2'>
                <i className="ri-add-line"></i>  Thêm mới
              </span>
            </button>
          </Link>
        </Container>
      </section>
      {
        !queryResult.isSuccess ? <Loading /> :
          <section>
            <Container>
              <Row>
                <Col lg='12'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Mã phiếu nhập</th>
                        <th>Tên nhà cung cấp</th>
                        <th>Nhân viên phụ trách</th>
                        <th>Ngày tạo</th>
                        <th className='text-center'>Xem chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        queryResult.data && queryResult.data.map((item, index) =>
                          <tr key={item.warehousereceiptid}>
                            <td>{index + 1}</td>
                            <td>{item.warehousereceiptcode}</td>
                            <td className='align-middle'>{item.supplier.suppliername}</td>
                            <td>{item.staff.staffname}</td>
                            <td className='align-middle'>{ToDateTimeString(item.warehousereceiptcreateddate)}</td>
                            <td className='align-middle text-center text-info'><Link to={`/dashboard/all-warehouse-receipts/${item.warehousereceiptid}`}>Chi tiết</Link></td>
        
                          </tr>
                        )

                      }
                    </tbody>
                  </table>
                </Col>
              </Row>
            </Container>
          </section>
      }
    </Helmet>
  )
}



export default AllWarehouseReceipts

