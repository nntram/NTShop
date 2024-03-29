import { Container } from 'reactstrap'
import '../../styles/admin-nav.css'
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AdminNav from "./AdminNav";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { staffActions } from '../../redux/slices/staffSlice'
import {toast} from 'react-toastify'

const AdminHeader = () => {
  const  userIcon = '/assets/images/user-icon.png'
  const logo = "/assets/images/logo5.png"

  const currentStaff = useSelector(state => state.staff.currentStaff)

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logout = () => {
    sessionStorage.removeItem("userAuth");
    sessionStorage.removeItem("currentUser");

    localStorage.removeItem("remember");
    localStorage.removeItem("userAuth");
    localStorage.removeItem("currentUser");

    dispatch(staffActions.setCurrentStaff(null))
    toast.success("Đã đăng xuất khỏi tài khoản.");
    queryClient.clear();
    navigate("/admin-login");
  };

  return (
    <>
      <header className='admin__header'>
        <div className='admin__nav-top'>
          <Container>
            <div className="admin__nav-wrapper-top">
              <div className="logo">
                <img src={logo} alt="logo" />
                <div>
                  <Link to='/home'><h1 className="text-white">Nari Shop</h1></Link>
                </div>
              </div>

              <div className="admin__nav-top-right">
                <span><i className="ri-notification-line"></i></span>
                <span><i className="ri-settings-2-line"></i></span>
                <div className="profile dropdown">
                  <div className='d-flex gap-2 align-items-center'>
                    <motion.img whileTap={{ scale: 1.2 }} src={userIcon} />
                    {currentStaff ? <p className='username'>{currentStaff.DisplayName}</p> : ""}
                  </div>
                  <div className="dropdown-content">
                    {currentStaff ? (
                      <>
                        <Link to="/change-password" className="d-flex gap-3">
                          <i className="ri-key-fill"></i>
                          <span>Đổi mật khẩu</span>
                        </Link>
                        <Link to="/account" className="d-flex gap-3">
                          <i className="ri-user-line"></i>
                          <span>Tài khoản</span>
                        </Link>
                        <a href="#" className="d-flex gap-3" onClick={logout} >
                          <i className="ri-logout-box-line"></i>
                          <span>Đăng xuất</span>
                        </a>

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
              </div>
            </div>


          </Container>
        </div>
      </header>
      <AdminNav />
    </>
  )
}

export default AdminHeader