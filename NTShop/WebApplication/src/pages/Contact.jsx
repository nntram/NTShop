import React from 'react'
import Helmet from '../components/helmet/Helmet'
import CommonSection from '../components/UI/CommonSection'
import '../styles/contact.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import makerIcon from 'leaflet/dist/images/marker-icon.png'
import L from 'leaflet';

const Contact = () => {

    const position = [10.03018724676069, 105.77070112600119]
    const icon = L.icon({ 
        iconRetinaUrl: makerIcon,  
    });

    return (
        <Helmet title='Liên hệ'>
            <CommonSection title='Liên hệ' />
            <section className="contact spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-6 text-center">
                            <div className="contact__widget">
                                <span className="icon_phone"></span>
                                <h4>Điện thoại</h4>
                                <p>0868 235 000</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 text-center">
                            <div className="contact__widget">
                                <span className="icon_pin_alt"></span>
                                <h4>
                                    Địa chỉ
                                </h4>
                                <p>
                                    Đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ, Việt Nam
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 text-center">
                            <div className="contact__widget">
                                <span className="icon_clock_alt"></span>
                                <h4>Thời gian mở cửa</h4>
                                <p>6:00 am đến 23:00 pm</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 text-center">
                            <div className="contact__widget">
                                <span className="icon_mail_alt"></span>
                                <h4>Email</h4>
                                <p>tramb1809531@student.ctu.edu.vn</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='pt-0 px-5'>
                <MapContainer className='map' 
                    center={position} zoom={15} >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} icon={icon}>
                        <Popup>
                            Trường Đại học Cần Thơ <br /> Khu 2
                        </Popup>
                    </Marker>
                </MapContainer>
            </section>
        </Helmet>
    )
}

export default Contact