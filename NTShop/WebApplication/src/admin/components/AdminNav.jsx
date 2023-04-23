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
        display: "Dashboard",
        path: "/dashboard/home"
    },
    {
        display: "Đơn hàng",
        path: "/dashboard/orders"
    },
    {
        display: "Nhập hàng",
        path: "/dashboard/1"
    },
    {
        display: "Sản phẩm",
        path: "/dashboard/2"
    },
    {
        display: "Loại sản phẩm",
        path: "/dashboard/3"
    },
    {
        display: "Thương hiệu",
        path: "/dashboard/4"
    },
    {
        display: "Khách hàng",
        path: "/dashboard/5"
    },
    {
        display: "Nhân viên",
        path: "/dashboard/6"
    },

]


const AdminNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (      
        <div>
            <Navbar className='admin__menu' dark expand='lg' fixed="true">
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