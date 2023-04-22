import React from 'react'
import CommonSection from '../components/UI/CommonSection'
import Helmet from '../components/helmet/Helmet'
import { Container, Row, Col } from 'reactstrap'
import { useQueries, useQuery } from 'react-query'
import orderApi from '../api/OrderApi'
import Loading from '../components/loading/Loading'
import { Link } from 'react-router-dom'
import { ToDateTimeString } from '../utils/Helpers'
const Orders = () => {

  const fetchOrder = async () => {
    try {
      const response = await orderApi.getOrders()
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
    { queryKey: ['orders'], queryFn: fetchOrder },
    { queryKey: ['order-status'], queryFn: fetchOrderStatus },
  ])

  const isSuccess = queryOrder.every(query => query.isSuccess)
  let orderStatus;
  let orders;
  if (isSuccess) {
    if (queryOrder[1].data !== null) {
      orderStatus = queryOrder[1].data
    }
    if (queryOrder[0].data !== null) {
      orders = queryOrder[0].data
    }

  }


  return (

    isSuccess ?
      <Helmet title='Đơn hàng'>
        <CommonSection title='Đơn hàng' />
        <section>
          <Container>
            <Row>
              <Col lg='12'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Thời gian đặt hàng</th>
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
                          <td>{item.ordertotalamount.toLocaleString()} VNĐ</td>
                          <td>
                            {orderStatus.find(status => status.orderstatusid === item.orderstatusid).orderstatusname}
                          </td>
                          <td>
                            {item.orderispaid ? "Đã thanh toán" : "Chưa thanh toán"}
                          </td>
                          <td className='text-center text-info'>
                            <Link to={`/order/${item.orderid}`}>Chi tiết</Link>
                          </td>
                        </tr>

                      )}
                  </tbody>
                </table>
              </Col>
            </Row>

          </Container>

        </section>

      </Helmet >
      : <Loading />
  )
}

export default Orders