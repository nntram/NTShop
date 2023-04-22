import React, { useState } from 'react'
import { Container, Row, Col, Label } from 'reactstrap'
import Helmet from '../components/helmet/Helmet'
import CommonSection from '../components/UI/CommonSection'
import Loading from '../components/loading/Loading'
import { Link, useParams } from 'react-router-dom'
import { useQueries } from 'react-query'
import orderApi from '../api/OrderApi'
import OrderDetail from '../components/UI/OrderDetail'
import { ToDateTimeString } from '../utils/Helpers'

const Order = () => {
    const { orderId } = useParams()
    const fetchOrderById = async (id) => {
        try {
            const response = await orderApi.getOrder(id)
            return (response);
        } catch (error) {
            console.log('Failed to fetch order: ', error);
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
    const queryOrders = useQueries([
        { queryKey: ['order', orderId], queryFn: ({ id = orderId }) => fetchOrderById(id) },
        { queryKey: ['order-status'], queryFn: fetchOrderStatus },
    ])

    const isSuccess = queryOrders.every(query => query.isSuccess);
    let orderStatus;
    let queryOrder;
    if (isSuccess) {
        if (queryOrders[1].data !== null) {
            orderStatus = queryOrders[1].data
        }
        if (queryOrders[0].data !== null) {
            queryOrder = queryOrders[0].data
        }

    }
    return (
        <Helmet title='Đặt hàng'>
            <CommonSection title='Chi tiết đơn hàng' />
            <section>
                {
                    !isSuccess ? <Loading /> :
                        <Container>
                            <Row>
                                <h5 lg='12' className="mb-3"> Thông tin chung</h5>
                                <Col lg='6' md='6' className='mb-3'>
                                    <p>Người nhận hàng: {queryOrder.ordercustomername}</p>
                                    <p>Địa chỉ: {queryOrder.orderadress}</p>
                                    <p>Số điện thoại: {queryOrder.orderphonenumber}</p>
                                </Col>
                                <Col lg='6' md='6' className='mb-3'>
                                    <p>Thời gian đặt hàng:
                                        <b> {' ' + ToDateTimeString(queryOrder.ordercreateddate)}
                                        </b>
                                    </p>
                                    <p>Thanh toán: <b> {queryOrder.orderispaid ? "Đã thanh toán" : "Chưa thanh toán"}</b> </p>
                                    <p>Trạng thái: <b> {orderStatus.find(status => status.orderstatusid === queryOrder.orderstatusid).orderstatusname}</b>
                                    </p>
                                </Col>
                            </Row>
                            <h5 className="mb-3"> Thông tin chi tiết</h5>
                            <Row className='mt-5 p-5 border border-dark'>
                                <Col lg='12'>
                                    <table className='table bodered'>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th className='text-center'>Tên sản phẩm</th>
                                                <th className='text-center'>Giá</th>
                                                <th className='text-center'>Số lượng</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                queryOrder && queryOrder.orderdetails.map((item, index) => (
                                                    <OrderDetail item={item} key={item.orderdetailid} />

                                                ))
                                            }
                                            <tr className='text-center'>
                                                <th colSpan={2}> Tổng:</th>
                                                <th colSpan={2}>{queryOrder.ordertotalamount.toLocaleString()} VNĐ</th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                            <div className='mt-3 text-info'>
                                <Link to='/orders' >
                                    <i className="ri-arrow-go-back-line"></i> Trở về
                                </Link>
                            </div>

                        </Container>
                }

            </section>


        </Helmet >
    )
}

export default Order