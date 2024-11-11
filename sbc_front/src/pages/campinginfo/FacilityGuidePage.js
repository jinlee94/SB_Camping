import React, {useState} from 'react';
import {Container, Row, Col, Card, Table} from 'react-bootstrap';
import {FaStore, FaShower, FaWater, FaBuilding, FaRecycle} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/campinginfo.css'

const FacilityGuidePage = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const facilities = [
        {
            title: "매점",
            icon: <FaStore/>,
            images: [require('../../images/shop.jpg'), require('../../images/campingshop.jpg')],
        },
        {
            title: "샤워실 및 화장실",
            icon: <FaShower/>,
            images: [require('../../images/shower.jpg'), require('../../images/toilet.jpg')],
        },
        {
            title: "개수대",
            icon: <FaWater/>,
            images: [require('../../images/sink.jpg')],
        },
        {
            title: "관리사무실",
            icon: <FaBuilding/>,
            images: [require('../../images/Managementoffice.jpg')],
        },
        {
            title: "분리수거장",
            icon: <FaRecycle/>,
            images: [require('../../images/recycle.jpg')],
        }
    ];

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <Container fluid>
            <div className={"mt-3"}>
                <h4>캠핑장 시설안내도</h4>
                <hr></hr>
            </div>
            <Row className="mb-4">
                <Col className="mt-3">
                    <img
                        src={require('../../images/FacilityGuide.jpg')}
                        alt="캠핑장 안내도"
                        style={{width: '900px', height: '563px', margin: 'auto'}}
                        className="img-fluid mb-4"
                    />
                    <hr/>
                </Col>
            </Row>


            <Row className={"mb-5"}>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>주요 시설</Card.Title>
                            <div className="facility-list">
                                {facilities.map((facility, index) => (
                                    <Card key={index} className="mb-3 accordianNav">
                                        <Card.Body className="dropArrow">
                                            <h3 onClick={() => handleToggle(index)}>
                                                <span style={{
                                                    fontSize: '1.2rem',
                                                    marginRight: '8px',
                                                    color: 'green'
                                                }}>{facility.icon}</span>
                                                {facility.title}
                                            </h3>
                                            <div style={{display: activeIndex === index ? 'block' : 'none'}}>
                                                <Row className="d-flex justify-content-center align-items-center">
                                                    {facility.images.length === 1 ? (
                                                        <Col
                                                            className="d-flex justify-content-center align-items-center">
                                                            <img
                                                                src={facility.images[0]}
                                                                alt={facility.title}
                                                                style={{
                                                                    width: '1200px',
                                                                    height: '550px',
                                                                    objectFit: 'contain',
                                                                    marginTop: '20px'
                                                                }}
                                                            />
                                                        </Col>
                                                    ) : (
                                                        facility.images.map((img, idx) => (
                                                            <Col key={idx} xs={12} md={6}
                                                                 className="d-flex justify-content-center align-items-center">
                                                                <img
                                                                    src={img}
                                                                    alt={facility.title}
                                                                    style={{
                                                                        width: '1200px',
                                                                        height: '550px',
                                                                        objectFit: 'cover',
                                                                        marginTop: '20px'
                                                                    }}
                                                                />
                                                            </Col>
                                                        ))
                                                    )}
                                                </Row>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col>
                    <Table bordered hover
                           style={{width: '500px', margin: 'auto', textAlign: 'center', fontSize: '14px'}}>
                        <thead>
                        <tr>
                            <th>구분</th>
                            <th>정보</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>규모</td>
                            <td>10m×10m</td>
                        </tr>
                        <tr>
                            <td>바닥재질</td>
                            <td>잔디블럭</td>
                        </tr>
                        <tr>
                            <td>전기사용</td>
                            <td>가능</td>
                        </tr>
                        <tr>
                            <td>면수</td>
                            <td>62면</td>
                        </tr>
                        <tr>
                            <td>이용방법</td>
                            <td>온라인예약</td>
                        </tr>
                        <tr>
                            <td>이용요금(1박)</td>
                            <td>예약/요금안내 참고</td>
                        </tr>
                        <tr>
                            <td>부대시설</td>
                            <td>관리동, 화장실 및 사워실, 개수대, 산책로, 매점 등</td>
                        </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default FacilityGuidePage;
