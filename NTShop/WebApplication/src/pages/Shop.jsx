import React, { useState, useRef, useEffect } from 'react'
import CommonSection from '../components/UI/CommonSection'
import Helmet from '../components/helmet/Helmet'
import { Container, Row, Col } from 'reactstrap'
import '../styles/shop.css'

import products from '../assets/data/products'
import ProductList2 from '../components/UI/ProductList2'

import ProductApi from '../api/ProductApi'
import { useQueries } from 'react-query'
import CategoryApi from '../api/CategoryApi'
import BrandApi from '../api/BrandApi'
import Select from 'react-select'
import Loading from '../components/loading/Loading'

const Shop = () => {

  const [productsData, setProductsData] = useState(products)

  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [productCount, setProductCount] = useState(0);

  const [sortOption, setSortOption] = useState(null);
  const [categoryOption, setCategoryOption] = useState(null);
  const [brandOption, setBrandOption] = useState(null);




useEffect( () => {
  window.scrollTo(0, 0)
}, [productList])


  const iconRef = useRef(null)
  const searchRef = useRef(null)

  // const handleSearchIcon = () => {
  //   if (iconRef.current.className === "ri-close-line") {
  //     searchRef.current.value = ""
  //     handleSearch()
  //   }
  // }
  // const handleFilter = e => {
  //   const filterValue = e.target.value

  //   const filterProducts = products.filter(
  //     (item) => item.category === filterValue
  //   )
  //   setProductsData(filterProducts)
  // }
  // const handleSearch = () => {
  //   const searchValue = searchRef.current.value

  //   if (searchValue !== '') {
  //     iconRef.current.className = "ri-close-line"

  //   }
  //   else {
  //     iconRef.current.className = "ri-search-line"
  //   }

  //   const searchProducts = products.filter(
  //     (item) => item.productName.toLowerCase().trim().includes(searchValue.toLowerCase().trim())
  //   )
  //   setProductsData(searchProducts)
  // }

  const fetchProductList = async ({params}) => {
    try {
      const response = await ProductApi.getAllCard({params});
      setProductList(response);
    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
  }

  const fetchProductCount = async () => {
    try {
      const response = await ProductApi.getCount({
        params: {
        }
      });
      setProductCount(response);
    } catch (error) {
      console.log('Failed to fetch product quantity: ', error);
    }
  }

  const fetchCategoryList = async () => {
    try {
      const response = await CategoryApi.getAll();
      setCategoryList(response.map((item) => ({
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
      setBrandList(response.map((item) => ({
        id: item.brandid,
        name: item.brandname,
        image: item.brandimage,
        type: "brands"
      })));
    } catch (error) {
      console.log('Failed to fetch brand list: ', error);
    }
  }

  const productInitParams = {
    params: {
      pageSize: 120,
      pageIndex: 0,
    }
  }
  const queryResults = useQueries([
    { queryKey: ['products', productInitParams], queryFn: () => fetchProductList(productInitParams)},
    { queryKey: 'categories', queryFn: fetchCategoryList },
    { queryKey: 'brands', queryFn: fetchBrandList },
    { queryKey: 'productQuantity', queryFn: fetchProductCount },
  ])

  const isLoading = queryResults.some(query => query.isLoading)
  const isError = queryResults.some(query => query.isLoading)

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <span>Error: {isError.message}</span>
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

  const categoryOptions = [
    {
      value: "all", label: (<span className='d-flex align-items-center gap-2'>
        Tất cả loại sản phẩm
      </span>)
    }, ...categoryList.map((item, index) => (
      {
        value: item.id, label: (<span className='d-flex align-items-center gap-2'>
          {item.name}
        </span>)
      }
    ))]

  const brandOptions = [
    {
      value: "all", label: (<span className='d-flex align-items-center gap-2'>
        Tất cả thương hiệu
      </span>)
    }, ...brandList.map((item, index) => (
      {
        value: item.id, label: (<span className='d-flex align-items-center gap-2'>
          {item.name}
        </span>)
      }
    ))]

  return (
    <Helmet title='Shop'>
      <CommonSection title='Sản phẩm' />

      <section>
        <Container>
          <Row>
            <Col lg='4' md='6'>
              <div className="search__box">
                <input type="text" placeholder='Seacrh...'
                  ref={searchRef} />
                <span >
                  <i className="ri-search-line" ref={iconRef} ></i>
                </span>
              </div>
            </Col>

            <Col lg='3' md='6'>
              <div className="filter__widget">
                <Select options={brandOptions}
                  isSearchable={false}
                  placeholder="Thương hiệu"
                  onChange={setBrandOption} />
              </div>
            </Col>

            <Col lg='3' md='6'>
              <div className="filter__widget">
                <Select options={categoryOptions}
                  isSearchable={false}
                  placeholder="Loại sản phẩm"
                  onChange={setCategoryOption} />
              </div>
            </Col>
            <Col lg='2' md='6'>
              <div className="filter__widget">
                <Select options={sortOptions}
                  isSearchable={false}
                  placeholder=<SortPlaceHolder />
                  onChange={setSortOption} />
              </div>


            </Col>

          </Row>
        </Container>
      </section>

      <section className='pt-0'>
        <Container>
          <Row>
            {
              productList.length === 0 ?
                <h1 className='text-center fs-4'>No data are found!</h1>
                :
                <ProductList2 data={productList} />

            }
          </Row>
          <Row className='pt-5'>
            
      
          </Row>



        </Container>

      </section>

    </Helmet>
  )
}
export const SortPlaceHolder = () => {
  return <span className='d-flex align-items-center gap-2'>
    <i className="ri-list-unordered"></i> Sắp xếp
  </span>
}


export default Shop

