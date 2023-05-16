import React, { useState } from 'react'
import { useQueries } from 'react-query'
import orderApi from '../../api/OrderApi'
import Loading from '../../components/loading/Loading'
import { Link, useParams } from 'react-router-dom'
import { ToDateTimeString } from '../../utils/Helpers'
import { Container, Row, Col } from 'reactstrap'
import Helmet from '../../components/helmet/Helmet'
import {Button} from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import CommonSection from '../../components/UI/CommonSection'
import ReactPaginate from 'react-paginate';

const CusstomerOrders = () => {
    const pageSize = 5;
    const { customerId } = useParams()
    const navigate = useNavigate()
    const [pageIndex, setPageInex] = useState(0)

    const fetchOrders = async () => {
        try {
            const response = await orderApi.getPaged({
                params: {
                    Customerid: customerId,
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
            queryKey: ['orders', pageIndex],
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

    if (isSuccess) {

        if (queryOrder[1].data) {
            orderStatus = queryOrder[1].data

            if (queryOrder[0].data) {
                orders = queryOrder[0].data.items
            }

        }
    }
    const handlePageClick = (event) => {
        setPageInex(event.selected)
    };


    return (
        <Helmet title='Đơn hàng'>
            <CommonSection title='Quản lý đơn hàng' />

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
                                                        <td>{pageIndex * pageSize + (index + 1)}</td>
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

            <section className='p-3'>
                <div className='mt-3 text-info'>
                    <Button type='button' onClick={() => navigate(-1)} >
                        <i className='ri-arrow-go-back-line'></i> Trở về
                    </Button>
                </div>
            </section>
        </Helmet>
    )
}
export default CusstomerOrders