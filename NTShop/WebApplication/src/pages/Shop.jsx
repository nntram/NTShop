import React, { useState, useRef } from 'react'
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

const Shop = () => {

  const [productsData, setProductsData] = useState(products)

  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);

  const iconRef = useRef(null)
  const searchRef = useRef(null)

  const handleSearchIcon = () => {
    if (iconRef.current.className === "ri-close-line") {
      searchRef.current.value = ""
      handleSearch()
    }
  }
  const handleFilter = e => {
    const filterValue = e.target.value

    const filterProducts = products.filter(
      (item) => item.category === filterValue
    )
    setProductsData(filterProducts)
  }
  const handleSearch = () => {
    const searchValue = searchRef.current.value

    if (searchValue !== '') {
      iconRef.current.className = "ri-close-line"

    }
    else {
      iconRef.current.className = "ri-search-line"
    }

    const searchProducts = products.filter(
      (item) => item.productName.toLowerCase().trim().includes(searchValue.toLowerCase().trim())
    )
    setProductsData(searchProducts)
  }



  const fetchProductList = async () => {
    try {
      const response = await ProductApi.getAllCard({
        params: {
        }
      });
      setProductList(response);
    } catch (error) {
      console.log('Failed to fetch product list: ', error);
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

  const queryResults = useQueries([
    { queryKey: ['products', 1], queryFn: fetchProductList },
    { queryKey: ['categories', 2], queryFn: fetchCategoryList },
    { queryKey: ['brands', 3], queryFn: fetchBrandList },
  ])

  const isLoading = queryResults.some(query => query.isLoading)
  const isError = queryResults.some(query => query.isLoading)

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {isError.message}</span>
  }


  return (
    <Helmet title='Shop'>
      <CommonSection title='Sản phẩm' />

      <section>
        <Container>
          <Row>
            <Col lg='4' md='6'>
              <div className="search__box">
                <input type="text" placeholder='Seacrh...'
                  onChange=""
                  ref={searchRef} />
                <span onClick="">
                  <i className="ri-search-line" ref={iconRef} ></i>
                </span>
              </div>
            </Col>

            <Col lg='3' md='6'>
              <div className="filter__widget">
                <select onChange="">
                  <option>Thương hiệu</option>
                  <option value="sofa">Sofa</option>
                  <option value="mobile">Mobile</option>
                  <option value="chair">Chair</option>
                  <option value="watch">Watch</option>
                  <option value="wireless">Wireless</option>
                </select>
              </div>
            </Col>

            <Col lg='3' md='6'>
              <div className="filter__widget">
                <select onChange="">
                  <option>
                    Loại sản phẩm
                  </option>
                  <option value="sofa">Sofa</option>
                  <option value="mobile">Mobile</option>
                  <option value="chair">Chair</option>
                  <option value="watch">Watch</option>
                  <option value="wireless">Wireless</option>
                </select>
              </div>
            </Col>
            <Col lg='2' md='6'>
              <div className="filter__widget">
                
                <select>
                  <option>
                  &#x29E9;Sắp xếp
                  </option>
                  <option value="ascending">Giá tăng dần</option>
                  <option value="descending">Giá giảm dần</option>
                </select>
                
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
        </Container>
      </section>

    </Helmet>
  )
}

export default Shop