import React from 'react'
import { useQuery, useMutation } from 'react-query'
import Loading from '../../components/loading/Loading'
import { Link } from 'react-router-dom'
import { ToDateTimeString } from '../../utils/Helpers'
import { Container, Row, Col } from 'reactstrap'
import Helmet from '../../components/helmet/Helmet'
import { toast } from 'react-toastify'
import brandApi from '../../api/BrandApi'
import { motion } from 'framer-motion'
import CommonSection from '../../components/UI/CommonSection'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const AllBrands = () => {

  const postDeleteBrand = async (id) => {
    try {
      const response = await brandApi.delete(id)
      return response;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, { autoClose: false })
      }
      console.log("Failed to delete brand: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (id) => postDeleteBrand(id)
  });

  const handleConfirmDelete = async (id) => {
    const result = await mutation.mutateAsync(id);
    if (result) {
      toast.success(result)
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await brandApi.getAll()
      return (response);
    } catch (error) {
      console.log('Failed to fetch brands: ', error)
    }
  }
  const queryResult = useQuery(
    {
      queryKey: ['db-brands', mutation],
      queryFn: fetchBrands
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
    <Helmet title='Thương hiệu'>
      <CommonSection title='Quản lý thương hiệu' />
      <section className='pb-0'>
        <Container>
          <Link to={'/dashboard/all-brands/create'}>
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
                        <th>Tên thương hiệu</th>
                        <th>Ngày tạo</th>
                        <th className='text-center'>Xem chi tiết</th>
                        <th>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        queryResult.data && queryResult.data.map((item, index) =>
                          <tr key={item.brandid}>
                            <td>{index + 1}</td>
                            <td><img
                              src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/brands/${item.brandimage}`} alt="" /></td>
                            <td className='align-middle'>{item.brandname}</td>
                            <td className='align-middle'>{ToDateTimeString(item.brandcreateddate)}</td>
                            <td className='align-middle text-center text-info'><Link to={`/dashboard/all-brands/${item.brandid}`}>Chi tiết</Link></td>
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
          <p>{item.brandname}</p>
          <img className='w-50' src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/brands/${item.brandimage}`} alt="" />
        </div>

        <div className="d-flex justify-content-center align-items-center gap-3">
          <button label="Yes"
          className='btn btn-danger'
            onClick={() => {
              handleConfirmDelete(item.brandid);
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

export default AllBrands

