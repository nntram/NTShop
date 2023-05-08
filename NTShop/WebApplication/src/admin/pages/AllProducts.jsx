import React, { useState, useRef } from 'react'
import { useQueries, useMutation } from 'react-query'
import productApi from '../../api/ProductApi'
import Loading from '../../components/loading/Loading'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { Container, Row, Col, Nav, NavItem, NavLink } from 'reactstrap'
import Helmet from '../../components/helmet/Helmet'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import CommonSection from '../../components/UI/CommonSection'
import ReactPaginate from 'react-paginate';
import categoryApi from '../../api/CategoryApi'
import brandApi from '../../api/BrandApi'
import useDebounce from '../../custom-hooks/useDebounce'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const AllProducts = () => {
  const pageSize = 5;

  const [pageIndex, setPageInex] = useState(0)
  const [sortOption, setSortOption] = useState(null);
  const [categoryOption, setCategoryOption] = useState(null);
  const [brandOption, setBrandOption] = useState(null);

  const [isHot, setIsHot] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isSmallQuantity, setIsSmallQuantity] = useState(false);

  const [filter, setFilter] = useState(null);
  const debouncedFilter = useDebounce(filter, 500);
  const [activeTab, setActiveTab] = useState('1')

  const iconRef = useRef(null)
  const searchRef = useRef(null)

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAllCard({
        params: {
          PageIndex: pageIndex,
          PageSize: pageSize,
          brandid: brandOption,
          categoryid: categoryOption,
          orderBy: sortOption,
          productName: filter,
          Productsmallquantity: isSmallQuantity,
          Productishot: isHot,
          Productisacitve: isActive
        }
      })
      return (response);
    } catch (error) {
      console.log('Failed to fetch products: ', error)
    }
  }

  const fetchCategoryList = async () => {
    try {
      const response = await categoryApi.getAll();
      return (response.map((item) => ({
        id: item.categoryid,
        name: item.categoryname,
        image: item.categoryimage,
        type: "categories"
      })));
    } catch (error) {
      console.log('Failed to fetch category list: ', error);
    }
  }

  const fetchBrandList = async () => {
    try {
      const response = await brandApi.getAll();
      return (response.map((item) => ({
        id: item.brandid,
        name: item.brandname,
        image: item.brandimage,
        type: "brands"
      })));
    } catch (error) {
      console.log('Failed to fetch brand list: ', error);
    }
  }


  const queryProduct = useQueries(
    [
      {
        queryKey: ['products', pageIndex, brandOption, categoryOption,
          sortOption, debouncedFilter, activeTab, isHot, isActive, isSmallQuantity],
        queryFn: fetchProducts,
        keepPreviousData: true,
        staleTime: 5000,
      },
      { queryKey: 'categories', queryFn: fetchCategoryList },
      { queryKey: 'brands', queryFn: fetchBrandList },
    ])

  const isSuccess = queryProduct.every(query => query.isSuccess)
  let products;

  if (isSuccess) {
    if (queryProduct[0].data) {
      products = queryProduct[0].data.items
    }

  }
  const postDeleteProduct = async (id) => {
    try {
      const response = await productApi.delete(id)
      return response;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, { autoClose: false })
      }
      console.log("Failed to delete product: ", error);
    }
  };

  const mutation = useMutation({
    mutationFn: (id) => postDeleteProduct(id)
  });

  const handleConfirmDelete = async (id) => {
    const result = await mutation.mutateAsync(id);
    if (result) {
      toast.success(result)
    }
  }


  const handlePageClick = (event) => {
    setPageInex(event.selected)
  };


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

  const sortOptions = [
    {
      value: 'lastest', label: (<span className='d-flex align-items-center gap-2'>
        <i className="ri-calendar-line"></i> Mới nhất
      </span>)
    },

    {
      value: 'ascending', label: (<span className='d-flex align-items-center gap-2'>
        <i className="ri-sort-asc"></i> Giá tăng dần
      </span>),
    },

    {
      value: 'descending', label: (<span className='d-flex align-items-center gap-2'>
        <i className="ri-sort-desc"></i> Giá giảm dần
      </span>)
    },
  ]

  let categoryOptions = [
    {
      value: "", label:
        "Tất cả loại sản phẩm"

    }]

  let brandOptions = [
    {
      value: "", label:
        "Tất cả thương hiệu"
    }]

  if (queryProduct[1].data) {
    categoryOptions = [...categoryOptions, ...queryProduct[1].data.map((item) => (
      {
        value: item.id, label: item.name
      }
    ))]
  }

  if (queryProduct[2].data) {
    brandOptions = [...brandOptions, ...queryProduct[2].data.map((item) => (
      {
        value: item.id, label: item.name

      }
    ))]
  }
  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }

    switch (tab) {
      case '1':
        setIsActive(true)
        setIsHot(false)
        setIsSmallQuantity(false)
        break;
      case '2':
        setIsActive(true)
        setIsHot(false)
        setIsSmallQuantity(true)
        break;
      case '3':
        setIsActive(true)
        setIsHot(true)
        setIsSmallQuantity(false)
        break;
      case '4':
        setIsActive(false)
        setIsHot(false)
        setIsSmallQuantity(false)
        break;
    }
  }

  const handleDelete = (item) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <DeleteMessage item={item} onClose={onClose} handleConfirmDelete={handleConfirmDelete}/>
        );
      }
    });
  }

  return (
    <Helmet title='Sản phẩm'>
      <CommonSection title='Quản lý sản phẩm' />

      <section className='pb-0'>
        <Container>
          <Link to={'/dashboard/all-products/create'}>
            <button className='btn btn-outline-secondary py-3 px-5 fw-bold'>
              <span className='d-flex align-items-center gap-2'>
                <i className="ri-add-line"></i>  Thêm mới
              </span>
            </button>
          </Link>
        </Container>

        <Container className='mt-5'>
          <Nav tabs>
            <NavItem>
              <NavLink
                role="button"
                className={activeTab === '1' ? 'active' : ''}
                onClick={() => toggle('1')} >
                Sản phẩm đang kinh doanh
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                role="button"
                className={activeTab === '2' ? 'active' : ''}
                onClick={() => toggle('2')} >
                Sản phẩm cần nhập thêm
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                role="button"
                className={activeTab === '3' ? 'active' : ''}
                onClick={() => toggle('3')} >
                Sản phẩm nổi bật
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                role="button"
                className={activeTab === '4' ? 'active' : ''}
                onClick={() => toggle('4')} >
                Sản phẩm ngừng kinh doanh
              </NavLink>
            </NavItem>
          </Nav>
        </Container>

        <Container className='mt-5'>
          <Row>
            <Col lg='4' md='6'>
              <div className="search__box">
                <input type="text" placeholder='Tên sản phẩm...'
                  ref={searchRef} onChange={handleSearch} />
                <span onClick={handleSearchIcon}>
                  <i className="ri-search-line" ref={iconRef} ></i>
                </span>
              </div>
            </Col>
            {
              !queryProduct[2].isSuccess ? <h5> ... </h5> :
                <Col lg='3' md='6'>
                  <div className="filter__widget">
                    <Select options={brandOptions}
                      isSearchable={false}
                      placeholder="Thương hiệu"
                      onChange={(e) => { setBrandOption(e.value); setPageInex(0) }}
                    />
                  </div>
                </Col>
            }

            {
              !queryProduct[1].isSuccess ? <h5> ... </h5> :
                <Col lg='3' md='6'>
                  <div className="filter__widget">
                    <Select options={categoryOptions}
                      isSearchable={false}
                      placeholder="Loại sản phẩm"
                      onChange={(e) => { setCategoryOption(e.value); setPageInex(0) }} />
                  </div>
                </Col>
            }

            <Col lg='2' md='6'>
              <div className="filter__widget">
                <Select options={sortOptions}
                  isSearchable={false}
                  placeholder={<SortPlaceHolder />}
                  onChange={(e) => { setSortOption(e.value); setPageInex(0) }} />
              </div>

            </Col>

          </Row>
        </Container>
      </section>
      {
        !queryProduct[0].isSuccess ? <Loading /> :
          <section>
            <Container>
              <Row>
                <Col lg='12'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th></th>
                        <th>Tên sản phẩm</th>
                        <th>Giá niêm yết</th>
                        <th>Giá bán</th>
                        <th>Số lượng</th>
                        <th className='text-center'>Xem chi tiết</th>
                        <th>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        products && products.map((item, index) =>
                          <tr key={item.productid}>
                            <td>{pageIndex * pageSize + (index + 1)}</td>
                            <td><img
                              src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/products/${item.productimages}`} alt="" /></td>
                            <td>{item.productname}</td>
                            <td>
                              {item.productprice.toLocaleString()} VNĐ
                            </td>
                            <td>
                              {item.productsaleprice.toLocaleString()} VNĐ
                            </td>
                            <td>{item.productquantity}</td>
                            <td className='text-center text-info'>
                              <Link to={`/dashboard/all-products/${item.productid}`}>Chi tiết</Link>
                            </td>
                            <td>
                              <motion.div className='text-danger remove__cartItem' whileTap={{ scale: 1.2 }}>
                                <i
                                  className="ri-delete-bin-line"
                                  onClick={() => handleDelete(item)}>
                                </i>
                              </motion.div>
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
                    pageCount={queryProduct[0].data.totalPages}
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
export const SortPlaceHolder = () => {
  return <span className='d-flex align-items-center gap-2'>
    <i className="ri-list-unordered"></i> Sắp xếp
  </span>
}

const DeleteMessage = ({ item, onClose, handleConfirmDelete }) => {
  return (
    <div className="react-confirm-alert">
      <div className="react-confirm-alert-body">
        <h1>Xác nhận xóa</h1>
        <p>Bạn chắc chắn muốn xóa?</p>

        <div className='text-center m-2'>
          <p>{item.productname}</p>
          <img className='w-50' src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/products/${item.productimages}`} alt="" />
        </div>

        <div className="d-flex justify-content-center align-items-center gap-3">
          <button label="Yes"
          className='btn btn-danger'
            onClick={() => {
              handleConfirmDelete(item.productid);
              onClose();
            }}>Xóa
          </button>
          <button label="No"
          className='btn btn-secondary'
            onClick={onClose}>Hủy
          </button>
        </div>
      </div>
    </div>

  )
}

export default AllProducts