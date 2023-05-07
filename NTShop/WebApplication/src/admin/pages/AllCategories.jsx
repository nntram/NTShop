import React from 'react'
import { useQuery, useMutation } from 'react-query'
import Loading from '../../components/loading/Loading'
import { Link } from 'react-router-dom'
import { ToDateTimeString } from '../../utils/Helpers'
import { Container, Row, Col } from 'reactstrap'
import Helmet from '../../components/helmet/Helmet'
import { toast } from 'react-toastify'
import categoryApi from '../../api/CategoryApi'
import { motion } from 'framer-motion'
import CommonSection from '../../components/UI/CommonSection'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const AllCategories = () => {

  const postDeleteCategory = async (id) => {
    try {
      const response = await categoryApi.delete(id)
      return response;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, { autoClose: false })
      }
      console.log("Failed to delete category: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (id) => postDeleteCategory(id)
  });

  const handleConfirmDelete = async (id) => {
    const result = await mutation.mutateAsync(id);
    if (result) {
      toast.success(result)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll()
      return (response);
    } catch (error) {
      console.log('Failed to fetch categories: ', error)
    }
  }
  const queryResult = useQuery(
    {
      queryKey: ['db-categories', mutation],
      queryFn: fetchCategories
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
    <Helmet title='Loại sản phẩm'>
      <CommonSection title='Quản lý loại sản phẩm' />
      <section className='pb-0'>
        <Container>
          <Link to={'/dashboard/all-categories/create'}>
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
                        <th></th>
                        <th>Tên loại sản phẩm</th>
                        <th>Ngày tạo</th>
                        <th className='text-center'>Xem chi tiết</th>
                        <th>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        queryResult.data && queryResult.data.map((item, index) =>
                          <tr key={item.categoryid}>
                            <td>{index + 1}</td>
                            <td><img
                              src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/categories/${item.categoryimage}`} alt="" /></td>
                            <td className='align-middle'>{item.categoryname}</td>
                            <td className='align-middle'>{ToDateTimeString(item.categorycreateddate)}</td>
                            <td className='align-middle text-center text-info'><Link to={`/dashboard/all-categories/${item.categoryid}`}>Chi tiết</Link></td>
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
          <p>{item.categoryname}</p>
          <img className='w-50' src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/categories/${item.categoryimage}`} alt="" />
        </div>

        <div className="d-flex justify-content-center align-items-center gap-3">
          <button label="Yes"
          className='btn btn-danger'
            onClick={() => {
              handleConfirmDelete(item.categoryid);
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

export default AllCategories

