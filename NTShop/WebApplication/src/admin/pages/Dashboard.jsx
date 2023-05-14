import React, { useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import '../../styles/dashboard.css'
import Helmet from '../../components/helmet/Helmet'
import { useQueries } from 'react-query'
import statisticsApi from '../../api/StatisticsApi'
import Loading from '../../components/loading/Loading'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

const Dashboard = () => {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê doanh thu',
      },
    },
    scales: {
      y: {
        position: 'right'
      }
    }
  };


  const now = new Date()
  const defaultBeginValue = `${now.getFullYear()}-01-01`
  const defaultEndValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const defaultBeginDate = new Date(defaultBeginValue).valueOf()
  const defaulEndDDate = new Date(defaultEndValue).setHours(23, 59, 59, 999).valueOf()

  const [begintDateProduct, setBeginDateProduct] = useState(defaultBeginDate)
  const [endDateProduct, setEndDateProduct] = useState(defaulEndDDate)
  const [beginValueProduct, setBeginValueProduct] = useState(defaultBeginValue)
  const [endValueProduct, setEndValueProduct] = useState(defaultEndValue)

  const [begintDateInvoice, setBeginDateInvoice] = useState(defaultBeginDate)
  const [endDateInvoice, setEndDateInvoice] = useState(defaulEndDDate)
  const [beginValueInvoice, setBeginValueInvoice] = useState(defaultBeginValue)
  const [endValueInvoice, setEndValueInvoice] = useState(defaultEndValue)
  const [type, setType] = useState(0);

  const changeStartDateProduct = (e) => {
    const value = e.target.value

    if (value > endValueProduct) {
      toast.warning('Ngày bắt đầu phải nhỏ hơn ngày kết thúc.')
      return;
    }
    setBeginValueProduct(value)
    const data = new Date(value).setHours(0, 0, 0).valueOf();
    setBeginDateProduct(data)
  }
  const changeEndDateProduct = (e) => {
    const value = e.target.value

    if (value < beginValueProduct) {
      toast.warning('Ngày kết thúc phải lớn hơn ngày bắt đầu.')
      return;
    }
    setEndValueProduct(value)
    const data = new Date(value).setHours(23, 59, 59, 999).valueOf();
    setEndDateProduct(data)
  }

  const changeStartDateInvoice = (e) => {
    const value = e.target.value

    if (value > endValueInvoice) {
      toast.warning('Ngày bắt đầu phải nhỏ hơn ngày kết thúc.')
      return;
    }
    setBeginValueInvoice(value)
    const data = new Date(value).setHours(0, 0, 0).valueOf();
    setBeginDateInvoice(data)
  }
  const changeEndDateInvoice = (e) => {
    const value = e.target.value

    if (value < beginValueInvoice) {
      toast.warning('Ngày kết thúc phải lớn hơn ngày bắt đầu.')
      return;
    }
    setEndValueInvoice(value)
    const data = new Date(value).setHours(23, 59, 59, 999).valueOf();
    setEndDateInvoice(data)
  }

  const fetchOrderCount = async () => {
    try {
      const response = await statisticsApi.getOrderCount()
      return (response);
    } catch (error) {
      console.log('Failed to fetch Order Count: ', error)
    }
  }
  const fetchProductCount = async () => {
    try {
      const response = await statisticsApi.getProductCount()
      return (response);
    } catch (error) {
      console.log('Failed to fetch Product Count: ', error)
    }
  }
  const fetchCustomerCount = async () => {
    try {
      const response = await statisticsApi.getCustomerCount()
      return (response);
    } catch (error) {
      console.log('Failed to fetch Customer Count: ', error)
    }
  }
  const fetchStaffCount = async () => {
    try {
      const response = await statisticsApi.getStaffCount()
      return (response);
    } catch (error) {
      console.log('Failed to fetch Staff Count: ', error)
    }
  }

  const fetchBestSellingProudcts = async () => {
    try {
      const response = await statisticsApi.getBestSellingProudcts({
        params: {
          BeginDate: begintDateProduct,
          EndDate: endDateProduct,
        }
      })
      return (response);
    } catch (error) {
      console.log('Failed to fetch Best Selling Proudcts : ', error)
    }
  }

  const fetchInvoiceStatistics = async () => {
    try {
      const response = await statisticsApi.getInvoiceStatistics({
        params: {
          BeginDate: begintDateInvoice,
          EndDate: endDateInvoice,
          type: type
        }
      })
      return (response);
    } catch (error) {
      console.log('Failed to fetch Best Selling Proudcts : ', error)
    }
  }

  const queryResults = useQueries([
    { queryKey: ['productCount'], queryFn: fetchProductCount },
    { queryKey: ['customerCount'], queryFn: fetchCustomerCount },
    { queryKey: ['orderCount'], queryFn: fetchOrderCount },
    { queryKey: ['staffCount'], queryFn: fetchStaffCount },
    { queryKey: ['bestSellingProudcts', begintDateProduct, endDateProduct], queryFn: fetchBestSellingProudcts },
    { queryKey: ['invoiceStatistics', begintDateInvoice, endDateInvoice, type], queryFn: fetchInvoiceStatistics },

  ])

  const isSuccess1 = queryResults[0].isSuccess && queryResults[1].isSuccess
    && queryResults[2].isSuccess && queryResults[3].isSuccess
  const isSuccess2 = queryResults[4].isSuccess
  const isSuccess3 = queryResults[5].isSuccess

  let data, labels
  if (isSuccess3 && queryResults[5].data) {
    labels = queryResults[5].data.map((item) => item.createdDate)

    data = {
      labels,
      datasets: [
        {
          label: 'Số đơn thành công',
          data: queryResults[5].data.map((item) => item.totalInvoice),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y'
        },
        {
          label: 'Doanh thu',
          data: queryResults[5].data.map((item) => item.totalAmount),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          yAxisID: 'y2'
        },
      ],
    };
  }


  return (
    <Helmet title='Thống kê'>
      <Container>
        {
          !isSuccess1 ? <Loading /> :
            <section>
              <Row>
                <Col className="lg-3">
                  <div className="orders__box">
                    <h5>Tổng số đơn hàng</h5>
                    <span>{queryResults[2].data}</span>
                  </div>
                </Col>
                <Col className="lg-3">
                  <div className="products__box">
                    <h5>Tổng số sản phẩm</h5>
                    <span>{queryResults[0].data}</span>
                  </div>
                </Col>
                <Col className="lg-3">
                  <div className="users__box">
                    <h5>Tổng số khách hàng</h5>
                    <span>{queryResults[1].data}</span>
                  </div>
                </Col>
                <Col className="lg-3">
                  <div className="revenue__box">
                    <h5>Tổng số nhân viên</h5>
                    <span>{queryResults[3].data}</span>
                  </div>
                </Col>
              </Row>
            </section>
        }
        {
          !isSuccess2 ? <Loading /> :
            <section>
              <h4 className='section__title'>Sản phẩm bán chạy</h4>
              <Row>
                <Col lg='6' md='6' className='mb-3'>
                  <div className='form-group d-flex align-items-center gap-2'>
                    <p>Thời gian: </p>
                    <input type="date" value={beginValueProduct} onChange={changeStartDateProduct}
                      className="form-control w-25" />
                    <p> - </p>
                    <input type="date" value={endValueProduct} onChange={changeEndDateProduct}
                      className="form-control w-25" />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg='12'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th></th>
                        <th>Tên sản phẩm</th>
                        <th>Đã bán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        queryResults[4].data && queryResults[4].data.map((item, index) =>
                          <tr key={item.productId}>
                            <td>{(index + 1)}</td>
                            <td>
                              <img
                                src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/products/${item.productImageUrl}`} alt="" />
                            </td>
                            <td>
                              <Link to={`/dashboard/all-products/${item.productId}`}>
                                {item.productName}
                              </Link>
                            </td>
                            <td>
                              {item.quantity}
                            </td>
                          </tr>

                        )}
                    </tbody>
                  </table>
                </Col>
              </Row>
            </section>
        }
        {
          !isSuccess3 ? <Loading /> :
            <section>
              <h4 className='section__title'>Thống kê</h4>
              <Row>
                <Col lg='6' md='6' className='mb-3'>
                  <div className='form-group d-flex align-items-center gap-2'>
                    <p>Thời gian: </p>
                    <input type="date" value={beginValueInvoice} onChange={changeStartDateInvoice}
                      className="form-control w-25" />
                    <p> - </p>
                    <input type="date" value={endValueInvoice} onChange={changeEndDateInvoice}
                      className="form-control w-25" />
                  </div>
                </Col>
                <Col lg='3' md='3' className='mb-3'>
                  <div className='form-group d-flex align-items-center gap-2'>
                    <p>Loại: </p>
                    <select className='form-select' onChange={(e) => setType(e.target.value)}>
                      <option value="0" >Theo tháng</option>
                      <option value="1" >Theo ngày</option>
                    </select>
                  </div>
                </Col>
              </Row>

              <Bar options={options} data={data} />

            </section>
        }

      </Container>
    </Helmet >
  )
}

export default Dashboard