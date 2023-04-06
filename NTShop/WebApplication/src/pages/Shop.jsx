import React, { useState, useRef} from 'react'
import CommonSection from '../components/UI/CommonSection'
import Helmet from '../components/helmet/Helmet'
import { Container, Row, Col,Button } from 'reactstrap'
import '../styles/shop.css'

import ProductList from '../components/UI/ProductList'
import ProductApi from '../api/ProductApi'
import { useQueries, useInfiniteQuery } from 'react-query'
import CategoryApi from '../api/CategoryApi'
import BrandApi from '../api/BrandApi'
import Select from 'react-select'
import Loading from '../components/loading/Loading'
import useDebounce from '../custom-hooks/useDebounce'

const Shop = () => {

  const [sortOption, setSortOption] = useState(null);
  const [categoryOption, setCategoryOption] = useState(null);
  const [brandOption, setBrandOption] = useState(null);
  const [filter, setFilter] = useState(null);
  const debouncedFilter = useDebounce(filter, 500);

  const iconRef = useRef(null)
  const searchRef = useRef(null)


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

  }

  const fetchProductList = async (pageParam) => {
    try {
      const response = await ProductApi.getAllCard(
        {
          params: {
            pageIndex: pageParam,
            pageSize: 12,
            brandid: brandOption,
            categoryid: categoryOption,
            orderBy: sortOption,
            productName: filter,
          }
        });

      return (response);
    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
  }


  const fetchCategoryList = async () => {
    try {
      const response = await CategoryApi.getAll();
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
      const response = await BrandApi.getAll();
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


  const productResults = useInfiniteQuery(
    ['products', brandOption, categoryOption, sortOption, debouncedFilter],
    ({ pageParam = 0 }) => fetchProductList(pageParam),
    {
      getNextPageParam: (lastPage) =>
        lastPage && lastPage.pageIndex < lastPage.totalPages - 1 ? lastPage.pageIndex + 1 : undefined
    },
    { enabled: Boolean(debouncedFilter) }

  )

  const queryResults = useQueries([
    { queryKey: 'categories', queryFn: fetchCategoryList },
    { queryKey: 'brands', queryFn: fetchBrandList },
  ])
  const isLoading = queryResults.some(query => query.isLoading)
  const isError = queryResults.some(query => query.isLoading) || productResults.isError

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <span>Error: {isError.message || productResults.isError.message}</span>
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

    if(queryResults[0].data){
      categoryOptions = [...categoryOptions, ...queryResults[0].data.map((item) => (
        {
          value: item.id, label: item.name
        }
      ))]
    }

    if(queryResults[1].data){
      brandOptions = [...brandOptions, ...queryResults[1].data.map((item) => (
        {
          value: item.id, label: item.name

        }
      ))]
    }

  return (
    <Helmet title='Shop'>
      <CommonSection title='Sản phẩm' />

      <section>
        <Container>
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

            <Col lg='3' md='6'>
              <div className="filter__widget">
                <Select options={brandOptions}
                  isSearchable={false}
                  placeholder="Thương hiệu"
                  onChange={(e) => setBrandOption(e.value)}
                />
              </div>
            </Col>

            <Col lg='3' md='6'>
              <div className="filter__widget">
                <Select options={categoryOptions}
                  isSearchable={false}
                  placeholder="Loại sản phẩm"
                  onChange={(e) => setCategoryOption(e.value)} />
              </div>
            </Col>
            <Col lg='2' md='6'>
              <div className="filter__widget">
                <Select options={sortOptions}
                  isSearchable={false}
                  placeholder={<SortPlaceHolder />}
                  onChange={(e) => setSortOption(e.value)} />
              </div>

            </Col>

          </Row>
        </Container>
      </section>

      <section className='pt-0'>
        <Container>
          <Row>
            {
              productResults.isSuccess &&
              productResults.data.pages.map((page, index) =>
                page && page.items.length !== 0 ?
                  <ProductList data={page.items} key={index} /> : ""
                  
              )
            }
          </Row>
          <Row className='pt-5'>
            <Button
              outline
              color='secondary'
              onClick={() => productResults.fetchNextPage()}
              disabled={!productResults.hasNextPage || productResults.isFetchingNextPage}
            >
              {productResults.isFetchingNextPage
                ? 'Đang tải thêm...'
                : productResults.hasNextPage
                  ? 'Xem thêm'
                  : 'Đã hết'}
            </Button>
            <div>{productResults.isFetching && !productResults.isFetchingNextPage ? <Loading /> : null}</div>

          </Row>

        </Container>

      </section>

    </Helmet >
  )
}
export const SortPlaceHolder = () => {
  return <span className='d-flex align-items-center gap-2'>
    <i className="ri-list-unordered"></i> Sắp xếp
  </span>
}


export default Shop

