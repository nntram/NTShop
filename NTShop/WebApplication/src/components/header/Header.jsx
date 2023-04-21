import React, { useRef, useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "./header.css";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo5.png";
import userIcon from "../../assets/images/user-icon.png";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useGetQuantity from "../../custom-hooks/useGetQuantity";
import { useQueryClient } from "react-query";
import { customerActions } from "../../redux/slices/customerSlice";
import { cartActions } from "../../redux/slices/cartSlice";

const nav__links = [
  {
    path: "home",
    display: "Trang chủ",
  },
  {
    path: "shop",
    display: "Sản phẩm",
  },
  {
    path: "contact",
    display: "Liên hệ",
  },
];

const Header = () => {
  const navigate = useNavigate();
  const navigateToCart = () => {
    navigate("/cart");
  };
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const closeRef = useRef(null);
  const totalQuantity = useSelector(state => state.cart.totalQuantity)
  const currentUser = useSelector(state => state.customer.currentUser)
  const currentTotalQuantity = useGetQuantity()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()


  const logout = () => {
    sessionStorage.removeItem("userAuth");
    sessionStorage.removeItem("currentUser");

    localStorage.removeItem("remember");
    localStorage.removeItem("userAuth");
    localStorage.removeItem("currentUser");

    dispatch(customerActions.setCurrentUser(null))
    toast.success("Đã đăng xuất khỏi tài khoản.");
    queryClient.clear();
    navigate("/home");
  };


  const menuToggle = () => {
    menuRef.current.classList.toggle("active__menu");
    closeRef.current.classList.toggle("active__menu");
  };

  useEffect(() => {
      dispatch(cartActions.setTotalQuatity(currentTotalQuantity)) 
  }, [currentTotalQuantity])


  return (
    <header className="header sticky__header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logo">
              <img src={logo} alt="logo" />
              <div>
                <h1>Nari Shop</h1>
              </div>
            </div>
            <div className="navigation" ref={menuRef}>
              <ul className="menu">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "nav__active" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}

                <li className="close__nav" ref={closeRef}>
                  <span onClick={menuToggle}>
                    <i className="ri-close-line"></i>
                  </span>
                </li>
              </ul>
            </div>

            <div className="nav__icons">
              <span className="fav__icon">
                <i className="ri-heart-line"></i>
              </span>
              <span className="cart__icon" onClick={navigateToCart}>
                <i className="ri-shopping-cart-2-line"></i>
                <span className="badge">{totalQuantity}</span>
              </span>
              <div className="profile dropdown">
                <div className='d-flex gap-2 align-items-center'>

                  {currentUser ?
                    <>
                      <motion.img whileTap={{ scale: 1.2 }}
                        src={currentUser.Avatar ? require('../../assets/image_data/avatar/' + currentUser.Avatar) : userIcon} />
                      <p className='username'>{currentUser.DisplayName}</p>
                    </>
                    : <motion.img whileTap={{ scale: 1.2 }} src={userIcon} />}
                </div>
                <div className="dropdown-content">
                  {currentUser ? (
                    <>
                      <a href="#" onClick={logout} className="d-flex gap-3" >
                        <i className="ri-logout-box-line"></i>
                        <span>Đăng xuất</span>
                      </a>
                      <Link to="/dashboard" className="d-flex gap-3">
                        <i className="ri-dashboard-line"></i>
                        <span>Dashboard</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="d-flex gap-3">
                        <i className="ri-login-box-line"></i>
                        <span>Đăng nhập</span>
                      </Link>
                      <Link to="/signup" className="d-flex gap-3">
                        <i className="ri-account-circle-line"></i>
                        <span>Đăng ký</span>
                      </Link>
                      <Link to="/dashboard" className="d-flex gap-3">
                        <i className="ri-dashboard-line"></i>
                        <span>Dashboard</span>
                      </Link>
                    </>
                  )}
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
  );
};

export default Header;
