import { NavLink } from 'react-router-dom'
import React, { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
} from 'reactstrap';

import '../../styles/admin-nav.css'


const admin__nav = [
    {
        display: "Thống kê",
        path: "/dashboard/home"
    },
    {
        display: "Đơn hàng",
        path: "/dashboard/all-orders"
    },
    {
        display: "Nhập hàng",
        path: "/dashboard/all-warehouse-receipts"
    },
    {
        display: "Sản phẩm",
        path: "/dashboard/all-products"
    },
    {
        display: "Loại sản phẩm",
        path: "/dashboard/all-categories"
    },
    {
        display: "Thương hiệu",
        path: "/dashboard/all-brands"
    },
    {
        display: "Khách hàng",
        path: "/dashboard/all-customers"
    },
    {
        display: "Nhân viên",
        path: "/dashboard/all-staffs"
    },
    {
        display: "Nhà cung cấp",
        path: "/dashboard/all-suppliers"
    },

]


const AdminNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (      
        <div className='sticky-top'>
            <Navbar className='admin__menu' dark expand='lg'>
                <NavbarToggler onClick={toggle}  className="nav__toogle"/>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="admin__menu-list" navbar>
                        {
                            admin__nav.map((item, index) => (
                                <li className="admin__menu-item" key={index}>
                                    <NavLink to={item.path} className={navClass => navClass.isActive? 'active__admin-menu' : ''}>
                                        {item.display}
                                    </NavLink>
                                </li>
                            ))
                        }
                    </Nav>
                </Collapse>  
            </Navbar>
        </div>

    )
}

export default AdminNav