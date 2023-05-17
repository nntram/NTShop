import React, { useState } from 'react'
import { useQueries } from 'react-query'
import orderApi from '../../api/OrderApi'
import Loading from '../../components/loading/Loading'
import { Link } from 'react-router-dom'
import { ToDateTimeString } from '../../utils/Helpers'
import { Container, Row, Col } from 'reactstrap'
import Helmet from '../../components/helmet/Helmet'
import Select from 'react-select'
import { toast } from 'react-toastify'
import CommonSection from '../../components/UI/CommonSection'
import ReactPaginate from 'react-paginate';

const AllOrders = () => {
  const pageSize = 5;
  const [orderStatusSelected, setOrderStatusSelected] = useState("")
  const [orderPaymentSelected, setOrderPaymentSelected] = useState(null)

  const now = new Date()

  const defaultBeginValue = `${now.getFullYear()}-01-01`
  const defaultEndValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const defaultBeginDate = new Date(defaultBeginValue).valueOf()
  const defaulEndDDate = new Date(defaultEndValue).setHours(23, 59, 59, 999).valueOf()

  const [begintDate, setBeginDate] = useState(defaultBeginDate)
  const [endDate, setEndDate] = useState(defaulEndDDate)
  const [beginValue, setBeginValue] = useState(defaultBeginValue)
  const [endValue, setEndValue] = useState(defaultEndValue)
  const [pageIndex, setPageInex] = useState(0)

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getPaged({
        params: {
          Orderstatusid: orderStatusSelected,
          Orderispaid: orderPaymentSelected,
          BeginDate: begintDate,
          EndDate: endDate,
          PageIndex: pageIndex,
          PageSize: pageSize,
        }
      })
      return (response);
    } catch (error) {
      console.log('Failed to fetch orders: ', error)
    }
  }
  const fetchOrderStatus = async () => {
    try {
      const response = await orderApi.getOrderStatus()
      return (response);
    } catch (error) {
      console.log('Failed to fetch order status: ', error)
    }
  }
  const queryOrder = useQueries([
    {
      queryKey: ['orders', orderStatusSelected, orderPaymentSelected,
        begintDate, endDate, pageIndex],
      queryFn: fetchOrders,
      keepPreviousData: true,
      staleTime: 5000,
      
    },
    {
      queryKey: ['order-status'],
      queryFn: fetchOrderStatus
    },
  ])

  const isSuccess = queryOrder.every(query => query.isSuccess)
  let orderStatus;
  let orders;
  let statusOptions = [
    {
      value: "", label:
        "Tất cả trạng thái đơn hàng"

    }]
  if (isSuccess) {

    if (queryOrder[1].data) {
      orderStatus = queryOrder[1].data
      statusOptions = [...statusOptions, ...orderStatus.map((item) => (
        {
          value: item.orderstatusid,
          label: item.orderstatusname
        }
      ))]
    }

    if (queryOrder[0].data) {
      orders = queryOrder[0].data.items
    }
  
  }
  const paymentStatusOptions = [
    {
      value: null,
      label: "Tất cả trạng thái thanh toán"
    },
    {
      value: true,
      label: "Đã thanh toán"
    },
    {
      value: false,
      label: "Thanh toán khi nhận hàng"
    },
  ]

  const changeStartDate = (e) => {
    const value = e.target.value

    if (value > endValue) {
      toast.warning('Ngày bắt đầu phải nhỏ hơn ngày kết thúc.')
      return;
    }
    setBeginValue(value)
    const data = new Date(value).setHours(0, 0, 0).valueOf();
    setBeginDate(data)
    setPageInex(0)
  }
  const changeEndDate = (e) => {
    const value = e.target.value

    if (value < beginValue) {
      toast.warning('Ngày kết thúc phải lớn hơn ngày bắt đầu.')
      return;
    }
    setEndValue(value)
    const data = new Date(value).setHours(23, 59, 59, 999).valueOf();
    setEndDate(data)
    setPageInex(0)
  }

  const handlePageClick = (event) => {
    setPageInex(event.selected)
  };


  return (
    <Helmet title='Đơn hàng'>
      <CommonSection title='Quản lý đơn hàng' />

      <section className='pb-0'>
        <Container>
          <Row>
            <Col lg='6' md='6' className='mb-3'>
              <div className='form-group d-flex align-items-center gap-2'>
                <p>Thời gian đặt hàng: </p>
                <input type="date" onChange={changeStartDate} value={beginValue}
                  className="form-control w-25" />
                <p> - </p>
                <input type="date" onChange={changeEndDate} value={endValue}
                  className="form-control w-25" />
              </div>
            </Col>
            {!queryOrder[1].isSuccess ? <Loading /> :
              <>
                <Col lg='3' md='6'>
                  <div className="filter__widget">
                    <Select
                      options={statusOptions}
                      isSearchable={false}
                      placeholder="Trạng thái"
                      onChange={(e) => {setOrderStatusSelected(e.value); setPageInex(0)}}
                    />
                  </div>
                </Col>

                <Col lg='3' md='6'>
                  <div className="filter__widget">
                    <Select
                      options={paymentStatusOptions}
                      isSearchable={false}
                      placeholder="Thanh toán"
                      onChange={(e) => {setOrderPaymentSelected(e.value); setPageInex(0)}}
                    />
                  </div>
                </Col>
              </>
            }
          </Row>
        </Container>
      </section>
      {
        !queryOrder[0].isSuccess ? <Loading /> :
          <section>
            <Container>
              <Row>
                <Col lg='12'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Mã đơn hàng</th>
                        <th>Thời gian đặt hàng</th>
                        <th>Tên khách hàng</th>
                        <th>Thanh toán</th>
                        <th>Trạng thái</th>
                        <th className='text-right-column'>Thành tiền</th>
                        <th className='text-center'>Xem chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        orders && orders.map((item, index) =>
                          <tr key={item.orderid}>
                            <td>{pageIndex*pageSize+(index + 1)}</td>
                            <td className='text-center'>{item.ordercode}</td>
                            <td>
                              {ToDateTimeString(item.ordercreateddate)}
                            </td>
                            <td>{item.ordercustomername}</td>
                            <td>
                              {item.orderispaid ? "Đã thanh toán" : "Thanh toán khi nhận hàng"}
                            </td>
                            <td className={
                                item.orderstatusid == '0' ? 'text-secondary'
                                : item.orderstatusid == '1' ? 'text-primary' 
                                : item.orderstatusid == '2' ? 'text-warning' 
                                : item.orderstatusid == '3' ? 'text-success' 
                                : item.orderstatusid == '-1' ? 'text-danger' 
                                : ''}>
                              {orderStatus.find(status => status.orderstatusid === item.orderstatusid).orderstatusname}
                            </td>
                            <td className='text-right-column'>{item.ordertotalamount.toLocaleString()} VNĐ</td>
                            <td className='text-center text-info'>
                              <Link to={`/dashboard/all-orders/order/${item.orderid}`}>Chi tiết</Link>
                            </td>
                          </tr>

                        )}
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
                    pageCount={queryOrder[0].data.totalPages}
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

export default AllOrders