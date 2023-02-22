import React, {useState, useRef} from 'react'
import CommonSection from '../components/UI/CommonSection'
import Helmet from '../components/helmet/Helmet'
import { Container, Row, Col } from 'reactstrap'
import '../styles/shop.css'

import products from '../assets/data/products'
import ProductList from '../components/UI/ProductList'

const Shop = () => {

  const [productsData, setProductsData] = useState(products)
  const iconRef = useRef(null)
  const searchRef = useRef(null)

  const handleSearchIcon = () => {
    if(iconRef.current.className === "ri-close-line"){
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

    if(searchValue !== ''){
      iconRef.current.className = "ri-close-line"
      
    }
    else
    {
      iconRef.current.className = "ri-search-line"
    }
    
    const searchProducts = products.filter(
      (item) => item.productName.toLowerCase().trim().includes(searchValue.toLowerCase().trim())
    )
    setProductsData(searchProducts)
  }

  return (
   <Helmet title='Shop'>
    <CommonSection title='Products'/>

    <section>
     <Container>
      <Row>
      <Col lg='6' md='12'>
          <div className="search__box">
            <input type="text" placeholder='Seacrh...' 
                  onChange={handleSearch}
                  ref={searchRef}/>
            <span onClick={handleSearchIcon}>
              <i className="ri-search-line" ref={iconRef} ></i>
            </span>
          </div>
        </Col>
        
        <Col lg='3' md='6'>
          <div className="filter__widget">
            <select onChange={handleFilter}>
              <option>Filter By Category</option>
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
            <select>
              <option>Sort By</option>
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
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
            productsData.length === 0? 
            <h1 className='text-center fs-4'>No data are found!</h1>
            :
            <ProductList data={productsData}/>

          }
        </Row>
      </Container>
    </section>


   </Helmet>
  )
}

export default Shop