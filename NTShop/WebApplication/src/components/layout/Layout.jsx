import React, {useEffect} from 'react'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import Routers from '../../routers/Routers'
import { useLocation } from 'react-router-dom'
import AdminHeader from '../../admin/components/AdminHeader'
import ScrollToTop from '../scrolltop/ScrollToTop'

const Layout = () => {
    const location = useLocation()
    useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: 'instant'
        })
      }, [location])
    return (
        <>
            {location.pathname.startsWith("/dashboard") ? <AdminHeader /> : <Header />}         
            <ScrollToTop />
            <div>
                <Routers />
            </div>
            <Footer />

        </>
    )
}

export default Layout