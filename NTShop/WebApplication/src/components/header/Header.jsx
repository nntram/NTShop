import React, { useRef, useEffect } from 'react'
import { Container, Row } from 'reactstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import './header.css'
import { motion } from 'framer-motion'

import logo from '../../assets/images/logo5.png'
import userIcon from '../../assets/images/user-icon.png'
import { useSelector } from 'react-redux'

import useAuth from '../../custom-hooks/useAuth'
import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase.config'
import { toast } from 'react-toastify'

const nav__links = [
  {
    path: 'home',
    display: 'Trang chủ'
  },
  {
    path: 'shop',
    display: 'Sản phẩm'
  },
  {
    path: 'contact',
    display: 'Liên hệ'
  },

]

const Header = () => {
  const navigate = useNavigate()
  const navigateToCart = () => {
    navigate('/cart')
  }
  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const closeRef = useRef(null)
  const profileActionRef = useRef(null)
  const totalQuantity = useSelector(state => state.cart.totalQuantity)

  const { currentUser } = useAuth()

  const stickyHeaderFunc = () => {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky__header')
      }
      else {
        headerRef.current.classList.remove('sticky__header')
      }
    })
  }

  const logout = () => {
    signOut(auth).then(() => {
      toast.success('Logged out.')
      navigate('/home')
    }).catch(err => {
      toast.error(err.message)
    })
  }

  useEffect(() => {
    stickyHeaderFunc()

    return () => window.removeEventListener('scroll', stickyHeaderFunc)
  })

  const menuToggle = () => {
    menuRef.current.classList.toggle('active__menu')
    closeRef.current.classList.toggle('active__menu')
  }

  const profileActionsToggle = () => profileActionRef.current.classList.toggle('show__profile')

  return (
    <header className='header' ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logo">
              <img src={logo} alt='logo' />
              <div>
                <h1>
                 Nari Shop
                </h1>

              </div>
            </div>
            <div className="navigation" ref={menuRef}>
              <ul className="menu">
                {
                  nav__links.map((item, index) => (
                    <li className="nav__item" key={index} >
                      <NavLink
                        to={item.path}
                        className={(navClass) => navClass.isActive ? 'nav__active' : ''}>
                        {item.display}
                      </NavLink>
                    </li>
                  ))
                }

                <li className='close__nav' ref={closeRef}>
                  <span onClick={menuToggle}>
                    <i className="ri-close-line"></i>
                  </span>
                </li>
              </ul>
            </div>

            <div className="nav__icons">
              <span className="fav__icon">
                <i className="ri-heart-line"></i>
                <span className="badge">1</span>
              </span>
              <span className="cart__icon" onClick={navigateToCart}>
                <i className="ri-shopping-cart-2-line"></i>
                <span className="badge">{totalQuantity}</span>
              </span>
              <div className='profile'>
                <motion.img whileTap={{ scale: 1.2 }}
                  src={currentUser ? currentUser.photoURL : userIcon} alt=""
                  onClick={profileActionsToggle} />

                <div className="profile__actions"
                  ref={profileActionRef}
                  onClick={profileActionsToggle} >
                  {
                    currentUser ?
                      <div className='d-flex justify-content-center align-items-center flex-column'>
                        <span onClick={logout}>Logout</span>
                        <Link to='/dashboard'>Dashboard</Link>
                      </div> :
                      <div className='d-flex justify-content-center align-items-center flex-column'>
                        <Link to='/signup'>Đăng ký</Link>
                        <Link to='/login'>Đăng nhập</Link>
                        <Link to='/dashboard'>Dashboard</Link>
                      </div>
                  }

                </div>

              </div>

              <div className="mobile__menu">
                <span onClick={menuToggle}>
                  <i className="ri-menu-line"></i>
                </span>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  )
}

export default Header