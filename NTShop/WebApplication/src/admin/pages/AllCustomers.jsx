import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import Loading from '../../components/loading/Loading'
import { Link } from 'react-router-dom'
import { ToDateTimeString } from '../../utils/Helpers'
import { Container, Row, Col } from 'reactstrap'
import Helmet from '../../components/helmet/Helmet'
import { toast } from 'react-toastify'
import customerApi from '../../api/CustomerApi'
import { motion } from 'framer-motion'
import CommonSection from '../../components/UI/CommonSection'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useRef } from 'react'
import useDebounce from '../../custom-hooks/useDebounce'
import ReactPaginate from 'react-paginate';

const AllCustomers = () => {
  const pageSize = 5;
  const [pageIndex, setPageInex] = useState(0)
  const iconRef = useRef(null)
  const searchRef = useRef(null)
  const [filter, setFilter] = useState(null)
  const debouncedFilter = useDebounce(filter, 500)

  const handleSearchIcon = () => {
    if (iconRef.current.className === "ri-close-line") {
      searchRef.current.value = ""
      handleSearch()
    }
  }

  const handleSearch = () => {
    const searchValue = searchRef.current.value

    if (searchValue !== '') {
      iconRef.current.className = "ri-close-line"

    }
    else {
      iconRef.current.className = "ri-search-line"
    }
    setFilter(searchValue)
    setPageInex(0)
  }
  const handlePageClick = (event) => {
    setPageInex(event.selected)
  };
  const fetchCustomers = async () => {
    try {
      const response = await customerApi.getAll({
        params: {
          PageIndex: pageIndex,
          PageSize: pageSize,
          SearchValue: filter,
        }
      })
      return (response);
    } catch (error) {
      console.log('Failed to fetch customers: ', error)
    }
  }
  const queryResult = useQuery(
    {
      queryKey: ['db-customers', debouncedFilter, pageIndex],
      queryFn: fetchCustomers
    },
  )

  return (
    <Helmet title='Thương hiệu'>
      <CommonSection title='Quản lý thương hiệu' />
      <section className='pb-0'>
        <Container>
          <Row>
            <Col lg='4' md='6'>
              <div className="search__box">
                <input type="text" placeholder='Tên khách hàng, email, tên đăng nhập...'
                  ref={searchRef} onChange={handleSearch} />
                <span onClick={handleSearchIcon}>
                  <i className="ri-search-line" ref={iconRef} ></i>
                </span>
              </div>
            </Col>
          </Row>
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
                        <th>Tên khách hàng</th>
                        <th>Tên tài khoản</th>
                        <th>Email</th>
                        <th>Ngày tạo</th>
                        <th className='text-center'>Xem chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        queryResult.data && queryResult.data.items.map((item, index) =>
                          <tr key={item.customerid}>
                            <td>{index + 1}</td>
                            <td>{item.customername}</td>
                            <td>{item.customerusername}</td>
                            <td>{item.customeremail}</td>
                            <td>{ToDateTimeString(item.customercreateddate)}</td>
                            <td className='align-middle text-center text-info'><Link to={`/dashboard/all-customers/${item.customerid}`}>Chi tiết</Link></td>
                          </tr>
                        )

                      }
                    </tbody>
                  </table>

                  <ReactPaginate
                    containerClassName='pagination justify-content-center mt-5'
                    pageClassName='page-item'
                    pageLinkClassName='page-link'
                    previousClassName='page-item'
                    previousLinkClassName='page-link'
                    nextClassName='page-item'
                    nextLinkClassName='page-link'
                    breakClassName='page-item'
                    breakLinkClassName='page-link'
                    activeClassName='active'
                    disabledClassName='disabled'
                    breakLabel="..."
                    nextLabel="Trang sau >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={queryResult.data.totalPages}
                    previousLabel="< Trang trước"
                    renderOnZeroPageCount={null}
                    forcePage={pageIndex}
                  />
                </Col>
              </Row>
            </Container>
          </section>
      }
    </Helmet>
  )
}



export default AllCustomers

