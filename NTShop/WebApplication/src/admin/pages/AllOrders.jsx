import React, { useState } from 'react'
import { useQueries } from 'react-query'
import orderApi from '../../api/OrderApi'
import Loading from '../../components/loading/Loading'
import { Link } from 'react-router-dom'
import { ToDateTimeString } from '../../utils/Helpers'
import { Container, Row, Col } from 'reactstrap'
import Helmet from '../../components/helmet/Helmet'
import Select from 'react-select'

const AllOrders = () => {
  const [orderStatusSelected, setOrderStatusSelected] = useState("")
  const [orderPaymentSelected, setOrderPaymentSelected] = useState(null)
  const fetchOrder = async () => {
    try {
      const response = await orderApi.getPaged({
        params: {
          Orderstatusid: orderStatusSelected,
          Orderispaid: orderPaymentSelected
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
    { queryKey: ['orders', orderStatusSelected, orderPaymentSelected], queryFn: fetchOrder },
    { queryKey: ['order-status'], queryFn: fetchOrderStatus },
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
    if (queryOrder[1].data !== null) {
      orderStatus = queryOrder[1].data
      statusOptions = [...statusOptions, ...orderStatus.map((item) => (
        {
          value: item.orderstatusid,
          label: item.orderstatusname
        }
      ))]
    }

    if (queryOrder[0].data !== null) {
      orders = queryOrder[0].data
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
      label: "Chưa thanh toán"
    },
  ]

  return (
    <Helmet title='Đơn hàng'>
      {!queryOrder[1].isSuccess ? <Loading /> :
        <section className='pb-0'>
          <Container>
            <Row>
              <Col lg='6' md='6'>
                <div className="search__box">
                  <input type="text" placeholder='Tên khách hàng, mã khách hàng...'
                  />
                  <span >
                    <i className="ri-search-line"  ></i>
                  </span>
                </div>
              </Col>

              <Col lg='3' md='6'>
                <div className="filter__widget">
                  <Select
                    options={statusOptions}
                    isSearchable={false}
                    placeholder="Trạng thái"
                    onChange={(e) => setOrderStatusSelected(e.value)}
                  />
                </div>
              </Col>

              <Col lg='3' md='6'>
                <div className="filter__widget">
                  <Select
                    options={paymentStatusOptions}
                    isSearchable={false}
                    placeholder="Thanh toán"
                    onChange={(e) => setOrderPaymentSelected(e.value)}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      }
      {
        !queryOrder[0].isSuccess ? <Loading /> :
          <section>
            <Container>
              <Row>
                <Col lg='12'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>Thời gian đặt hàng</th>
                        <th>Tên khách hàng</th>
                        <th>Thành tiền</th>
                        <th>Trạng thái</th>
                        <th>Thanh toán</th>
                        <th className='text-center'>Xem chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        orders.map(item =>
                          <tr key={item.orderid}>
                            <td>
                              {ToDateTimeString(item.ordercreateddate)}
                            </td>
                            <td>{item.ordercustomername}</td>
                            <td>{item.ordertotalamount.toLocaleString()} VNĐ</td>
                            <td>
                              {orderStatus.find(status => status.orderstatusid === item.orderstatusid).orderstatusname}
                            </td>
                            <td>
                              {item.orderispaid ? "Đã thanh toán" : "Chưa thanh toán"}
                            </td>
                            <td className='text-center text-info'>
                              <Link to={`/dashboard/order/${item.orderid}`}>Chi tiết</Link>
                            </td>
                          </tr>

                        )}
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

export default AllOrders