import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import Loading from '../../components/loading/Loading'
import { Link } from 'react-router-dom'
import { ToDateTimeString } from '../../utils/Helpers'
import { Container, Row, Col } from 'reactstrap'
import Helmet from '../../components/helmet/Helmet'
import { toast } from 'react-toastify'
import staffApi from '../../api/StaffApi'
import { motion } from 'framer-motion'
import CommonSection from '../../components/UI/CommonSection'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useRef } from 'react'
import useDebounce from '../../custom-hooks/useDebounce'
import ReactPaginate from 'react-paginate';

const AllStaffs = () => {


  const fetchStaffs = async () => {
    try {
      const response = await staffApi.getAll()
      return (response);
    } catch (error) {
      console.log('Failed to fetch staffs: ', error)
    }
  }
  const queryResult = useQuery(
    {
      queryKey: ['db-staffs'],
      queryFn: fetchStaffs
    },
  )

  return (
    <Helmet title='Nhân viên'>
      <CommonSection title='Quản lý thông tin nhân viên' />
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
                        <th>Tên nhân viên</th>
                        <th>Tên tài khoản</th>
                        <th>Email</th>
                        <th>Ngày tạo</th>
                        <th className='text-center'>Xem chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        queryResult.data && queryResult.data.map((item, index) =>
                          <tr key={item.staffid}>
                            <td>{index + 1}</td>
                            <td>{item.staffname}</td>
                            <td>{item.staffloginname}</td>
                            <td>{item.staffemail}</td>
                            <td>{ToDateTimeString(item.staffcreateddate)}</td>
                            <td className='align-middle text-center text-info'><Link to={`/dashboard/all-staffs/${item.staffid}`}>Chi tiết</Link></td>
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



export default AllStaffs

