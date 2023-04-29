import React from 'react'
import { useQuery } from 'react-query'
import Loading from '../../components/loading/Loading'
import { Link } from 'react-router-dom'
import { ToDateTimeString } from '../../utils/Helpers'
import { Container, Row, Col } from 'reactstrap'
import Helmet from '../../components/helmet/Helmet'
import { toast } from 'react-toastify'
import categoryApi from '../../api/CategoryApi'
import { motion } from 'framer-motion'
import CommonSection from '../../components/UI/CommonSection'

const AllCategories = () => {

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
      queryKey: ['db-categories'],
      queryFn: fetchCategories
    },
  )

  return (
    <Helmet title='Loại sản phẩm'>
      <CommonSection title='Quản lý loại sản phẩm' />
      <section className='pb-0'>
        <Container>
          <Link to={'/all-categories/create'}>
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
                              src={require(`../../assets/image_data/categories/${item.categoryimage}`)} alt="" /></td>
                            <td className='align-middle'>{item.categoryname}</td>
                            <td className='align-middle'>{ToDateTimeString(item.categorycreateddate)}</td>
                            <td className='align-middle text-center text-info'><Link to={`/all-categories/${item.categoryid}`}>Chi tiết</Link></td>
                            <td className='align-middle'>
                              <motion.div className='text-danger remove__cartItem' whileTap={{ scale: 1.2 }}>
                                <i
                                  className="ri-delete-bin-line"
                                  onClick={null}>
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

export default AllCategories