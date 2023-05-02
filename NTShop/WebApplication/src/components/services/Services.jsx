import React from 'react'
import './services.css'
import serviecesData from  '../../assets/data/serviceData'
import { Col, Container, Row } from 'reactstrap'
import { motion } from 'framer-motion'

const Services = () => {
  // const serviecesData = '/assets/data/serviceData'
  return <section className='services'>
    <Container>
      <Row>
        {
          serviecesData.map((item, index) => (
            <Col lg='3' md='4' key={index} className='services__container'>
              <motion.div whileHover={{scale:1.1}} className="services__item"
                    style={{background: `${item.bg}`}}>
                <span>
                  <i className={item.icon}></i>
                </span>
                <div>
                  <h3>
                    {item.title}
                  </h3>
                  <p>
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            </Col>
          ))
        }

      </Row>

    </Container>
  </section>
}

export default Services