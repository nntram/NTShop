import React, { useState } from 'react'
import { Container, Row, Col, Form, FormGroup, Input } from 'reactstrap'
import Helmet from '../../components/helmet/Helmet'
import CommonSection from '../../components/UI/CommonSection'
import Loading from '../../components/loading/Loading'
import { Link, useParams } from 'react-router-dom'
import { useQueries, useMutation } from 'react-query'
import orderApi from '../../api/OrderApi'
import OrderDetail from '../../components/UI/OrderDetail'
import { ToDateTimeString } from '../../utils/Helpers'
import { toast } from 'react-toastify'

const DbOrder = () => {
    const [orderStatusSelected, setOrderStatusSelected] = useState()
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
    const postUpdateOrderStatus = async (data) => {
        try {
            const response = await orderApi.updateOrderStatus(data)
            return response;
        } catch (error) {
            toast.error(error.response.data, { autoClose: false })
            console.log("Failed to add product to cart: ", error);
        }
    };

    const mutation = useMutation({
        mutationFn: (data) => postUpdateOrderStatus(data)
    });
    const queryOrders = useQueries([
        { queryKey: ['order', orderId, mutation], queryFn: ({ id = orderId }) => fetchOrderById(id) },
        { queryKey: ['order-status'], queryFn: fetchOrderStatus },
    ])

    const isSuccess = queryOrders.every(query => query.isSuccess);
    let orderStatus;
    let queryOrder;
    let orderContent;
    let orderContentBody;
    if (isSuccess) {
        if (queryOrders[0].data && queryOrders[1].data) {
            queryOrder = queryOrders[0].data
            orderStatus = queryOrders[1].data
        }
        orderContentBody = queryOrder.orderdetails && queryOrder.orderdetails.reduce((total, item) => (
            total += `<tr>
                <td>${item.product.productname}</td>
                <td style="text-align: right;">${item.orderdetailprice.toLocaleString()} VNĐ</td>
                <td style="text-align: right;">${item.orderdetailquantity}</td>
            </tr>`

        ), '')
        orderContent = ` 
        <head>
            <title>Mã đơn hàng: ${queryOrder.orderid}</title>
        </head>
        <body> 
            <center><h2>Thông tin đơn hàng</h2></center>
            <Container>
            <Row>
                <h3 lg='12' className='mb-3'> Thông tin chung</h3>
                <Col lg='6' md='6' className='mb-3'>
                    <p>Người nhận hàng: ${queryOrder.ordercustomername}</p>
                    <p>Địa chỉ: ${queryOrder.orderadress}</p>
                    <p>Số điện thoại: ${queryOrder.orderphonenumber}</p>
                </Col>
                <Col lg='6' md='6' className='mb-3'>
                    <p>Thời gian đặt hàng:
                        <b> ${' ' + ToDateTimeString(queryOrder.ordercreateddate)}
                        </b>
                    </p>
                    <p>Thanh toán: <b> ${queryOrder.orderispaid ? "Đã thanh toán" : "Thanh toán khi nhận hàng"}</b> </p>             
                    </p>
                </Col>
            </Row>
            <h3 className='b-3'> Thông tin chi tiết</h3>
            <Row className='mt-5 p-5 border border-dark'>
                <Col lg='12'>
                    <table className='table bodered'>
                        <thead>
                            <tr>
                                <th className='text-center'>Tên sản phẩm</th>
                                <th style="text-align: right;">Giá</th>
                                <th style="text-align: right;">Số lượng</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${orderContentBody}
                            <tr className='text-center'>
                                <th colSpan={2}> Tổng:</th>
                                <th colSpan={2} style="text-align: right;">${queryOrder.ordertotalamount.toLocaleString()} VNĐ</th>
                            </tr>
                        </tbody>
                    </table>
                </Col>
            </Row>
            <h5 style="text-align: center;"> <i> Nari Shop xin chân thành cảm ơn quý khách hàng đã ủng hộ! </i> </h5>
        </Container>
    </body>`

    }


    const submit = async (e) => {
        e.preventDefault()

        const data = {
            OrderId: queryOrder.orderid,
            OrderStatusId: orderStatusSelected ?? queryOrder.orderstatusid
        }

        const result = await mutation.mutateAsync(data)
        console.log(result)
        if (result) {
            toast.success(result)
        }

    }

    const printOrder = () => {
        var myWindow = window.open("", "", "width=1200,height=1400");
        myWindow.document.title = "Đơn hàng"
        myWindow.document.write(orderContent);
        myWindow.print()
    }

    return (
        <Helmet title='Đặt hàng'>
            <CommonSection title='Chi tiết đơn hàng' />
            <section>
                {
                    !isSuccess ? <Loading /> :
                        <Container>
                            <Row>
                                <h5 lg='12' className='mb-3'> Thông tin chung</h5>
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
                                    <p>Thanh toán: <b> {queryOrder.orderispaid ? "Đã thanh toán" : "Thanh toán khi nhận hàng"}</b> </p>
                                    <p>Trạng thái: <b> {orderStatus.find(status => status.orderstatusid === queryOrder.orderstatusid).orderstatusname}</b>
                                    </p>
                                </Col>
                            </Row>
                            <h5 className='mb-3'> Thông tin chi tiết</h5>
                            <Row className='p-5 border border-dark'>
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
                                                queryOrder.orderdetails && queryOrder.orderdetails.map((item, index) => (
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
                            {(queryOrder.orderstatusid !== '-1' && queryOrder.orderstatusid !== '3') ? <Form className='mt-5 p-5 border border-dark' onSubmit={submit}>
                                <FormGroup>
                                    <h5 className='mb-3'>Cập nhật trạng thái đơn hàng:</h5>
                                    <Input type="select" name="orderstatus" onChange={(e) => setOrderStatusSelected(e.target.value)}>
                                        {
                                            orderStatus.map((item) => (
                                                <option value={item.orderstatusid}
                                                    key={item.orderstatusid}
                                                    selected={queryOrder.orderstatusid === item.orderstatusid}
                                                >
                                                    {item.orderstatusname}

                                                </option>
                                            ))
                                        }
                                    </Input>
                                </FormGroup>
                                <FormGroup className='text-center'>
                                    <button className='btn btn-primary' type="submit">
                                        Cập nhật thay đổi
                                    </button>
                                </FormGroup>
                            </Form> : ""}


                            <div className='text-center mt-3'>
                                <button className="btn btn-secondary" type="button" onClick={printOrder}>
                                    <i className='ri-printer-line'></i> In đơn hàng
                                </button>
                            </div>
                            <div className='mt-3 text-info'>
                                <Link to='/dashboard/all-orders' >
                                    <i className='ri-arrow-go-back-line'></i> Trở về
                                </Link>
                            </div>
                        </Container>
                }

            </section>


        </Helmet >
    )
}

export default DbOrder