import {useState, useEffect} from 'react'
import { Container, Row} from 'reactstrap'
import '../styles/admin-nav.css'
import { NavLink } from 'react-router-dom'
import userIcon from '../assets/images/user-icon.png'
const admin__nav = [
  {
    display: "Dashboard",
    path: "/dashboard"
  },
  {
    display: "All products",
    path: "/dashboard/all-products"
  },
  {
    display: "Add product",
    path: "/dashboard/add-product"
  },
  {
    display: "Orders",
    path: "/dashboard/orders"
  },
  {
    display: "Users",
    path: "/dashboard/users"
  },
  
]
const AdminNav = () => {
  const [currentUser, setCurrentUser] = useState()
  useEffect(() => {
    const parseCurrentUser = () => {
      const user = sessionStorage.getItem("currentUser");
      
      try {
        if(user !== JSON.stringify(currentUser)){
          setCurrentUser(JSON.parse(user))
        }
      } catch (error) {
        setCurrentUser(null)
      }
    }
    parseCurrentUser()
  })
  return (
    <>
      <header className='admin__header'>
        <div className='admin__nav-top'>
          <Container>
            <div className="admin__nav-wrapper-top">
              <div className="logo">
                <h2>Multimart</h2>
              </div>

              <div className="search__box">
                <input type="text" placeholder='Search...' />
                <span><i className="ri-search-line"></i></span>
              </div>

              <div className="admin__nav-top-right">
                <span><i className="ri-notification-line"></i></span>
                <span><i className="ri-settings-2-line"></i></span>
                <img src={userIcon} alt="" />
              </div>
            </div>
          </Container>
        </div>
      </header>

      <section className="admin__menu p-0">
        <Container>
          <Row>
            <div className="admin__navigation">
              <ul className="admin__menu-list">
              {
                admin__nav.map( (item, index) => (
                  <li className="admin__menu-item" key={index}>
                    <NavLink 
                        to= {item.path}
                        className={navClass => navClass.isActive? 'active__admin-menu' : ''}>
                          {item.display}
                    </NavLink>
                  </li> 
                ))
              }
              </ul>
            </div>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default AdminNav