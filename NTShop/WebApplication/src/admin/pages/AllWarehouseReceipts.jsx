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

  const postDeleteWarehouseReceipt = async (id) => {
    try {
      const response = await warehouseReceiptApi.delete(id)
      return response;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, { autoClose: false })
      }
      console.log("Failed to delete warehouseReceipt: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (id) => postDeleteWarehouseReceipt(id)
  });

  const handleConfirmDelete = async (id) => {
    const result = await mutation.mutateAsync(id);
    if (result) {
      toast.success(result)
    }
  }

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
      queryKey: ['db-warehouseReceipts', mutation],
      queryFn: fetchWarehouseReceipts
    },
  )

  const handleDelete = (item) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <DeleteMessage item={item} onClose={onClose} handleConfirmDelete={handleConfirmDelete}/>
        );
      }
    });
  }

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
                        <th>Tên nhà cung cấp</th>
                        <th>Số điện thoại</th>
                        <th>Ngày tạo</th>
                        <th className='text-center'>Xem chi tiết</th>
                        <th>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        queryResult.data && queryResult.data.map((item, index) =>
                          <tr key={item.warehouseReceiptid}>
                            <td>{index + 1}</td>
                            <td className='align-middle'>{item.warehouseReceiptname}</td>
                            <td>{item.warehouseReceiptphonenumber}</td>
                            <td className='align-middle'>{ToDateTimeString(item.warehouseReceiptcreacteddate)}</td>
                            <td className='align-middle text-center text-info'><Link to={`/dashboard/all-warehouse-receipts/${item.warehouseReceiptid}`}>Chi tiết</Link></td>
                            <td className='align-middle'>
                              <motion.div className='text-danger remove__cartItem' whileTap={{ scale: 1.2 }}>
                                <i
                                  className="ri-delete-bin-line"
                                  onClick={() => handleDelete(item)}>
                                </i>
                              </motion.div>
                            </td>
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

const DeleteMessage = ({ item, onClose, handleConfirmDelete }) => {
  return (
    <div className="react-confirm-alert">
      <div className="react-confirm-alert-body">
        <h1>Xác nhận xóa</h1>
        <p>Bạn chắc chắn muốn xóa?</p>

        <div className='text-center m-2'>
          <p>{item.warehouseReceiptname}</p>         
        </div>

        <div className="d-flex justify-content-center align-items-center gap-3">
          <button label="Yes"
          className='btn btn-danger'
            onClick={() => {
              handleConfirmDelete(item.warehouseReceiptid);
              onClose();
            }}>Xóa
          </button>
          <button label="No"
          className='btn btn-secondary'
            onClick={onClose}>Hủy
          </button>
        </div>
      </div>
    </div>

  )
}

export default AllWarehouseReceipts

