import React from 'react'
import CommonSection from '../components/UI/CommonSection'
import Helmet from '../components/helmet/Helmet'
import { Container, Row, Col } from 'reactstrap'
import { useQueries } from 'react-query'
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

  const getOrderStatusClass = (id) => {
    let orderStatusClass = ''
    switch (id) {
      case '0':
        orderStatusClass = 'text-secondary'
        break;
      case '1':
        orderStatusClass = 'text-secondary'
        break;
      case '2':
        orderStatusClass = 'text-secondary'
        break;
      case '3':
        orderStatusClass = 'text-secondary'
        break;
      case '-1':
        orderStatusClass = 'text-secondary'
        break;
    }
    console.log(orderStatusClass)
    return orderStatusClass;
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
                      <th>STT</th>
                      <th>Mã đơn hàng</th>
                      <th>Thời gian đặt hàng</th>
                      <th>Thanh toán</th>
                      <th>Trạng thái</th>
                      <th className='text-right-column'>Thành tiền</th>
                      <th className='text-center'>Xem chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      orders.map((item, index) =>
                        <tr key={item.orderid}>
                          <td>{index + 1}</td>
                          <td>{item.ordercode}</td>
                          <td>
                            {ToDateTimeString(item.ordercreateddate)}
                          </td>
                          <td>
                            {item.orderispaid ? "Đã thanh toán" : "Thanh toán khi nhận hàng"}
                          </td>
                          <td className={
                                item.orderstatusid === '0' ? 'text-secondary'
                                : item.orderstatusid === '1' ? 'text-primary' 
                                : item.orderstatusid === '2' ? 'text-warning' 
                                : item.orderstatusid === '3' ? 'text-success' 
                                : item.orderstatusid === '-1' ? 'text-danger' 
                                : ''}>
                            {orderStatus.find(status => status.orderstatusid === item.orderstatusid).orderstatusname}
                          </td>
                          <td className='text-right-column'>{item.ordertotalamount.toLocaleString()} VNĐ</td>
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