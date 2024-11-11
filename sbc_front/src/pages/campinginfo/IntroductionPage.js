import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import image1 from '../../images/campingview.jpg';
import image2 from '../../images/image8.jpg';
import image3 from '../../images/brige.jpg';

const IntroductionPage = () => {
    return (
        <Container fluid>
            <div className={"mt-3"}>
                <h4>캠핑장 소개</h4>
                <hr></hr>
            </div>
            <Row className="mb-4">
                <Col>
                    <img
                        src={image1} // 임포트한 이미지 사용
                        alt="캠핑장"
                        className="img-fluid w-100"
                        style={{ maxWidth:'900px', objectFit: 'cover', margin:'20px auto 50px' }} // 크기 조정
                    />
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <div className="text-center mb-5 text-sm">
                        <h4 className="mb-3">SB캠핑장 안내</h4>
                        <p>SB캠핑장은 도덕산의 아름다운 자연 속에 자리하고 있습니다. </p>
                        <p>이곳은 도심에서 벗어나 푸르른 산과 맑은 공기를 만끽할 수 있는 최적의 장소로, </p>
                        <p>가족 및 친구들과의 특별한 시간을 위해 마련된 공간입니다. </p>
                        <p>각종 편의시설과 안전한 캠핑 환경을 제공하며, 다양한 액티비티로 방문객들의 즐거움을 더하고 있습니다. </p>
                        <p>도덕산의 자연과 함께하는 행복한 순간을 SB캠핑장에서 경험해 보세요.</p>
                    </div>
                </Col>
            </Row>
            <Row className="mb-5">
                <Col md={6} className="d-flex justify-content-center align-items-center">
                    <Card className="text-center" style={{ height: '500px', width: '100%' }}>
                        <Card.Img
                            variant="top"
                            src={image2} // 이미지 사용
                            className="rounded-circle mx-auto"
                            style={{width:'350px', height:'400px', margin:'10px',padding:'10px' }} // 이미지 크기 조정
                        />
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                            <Card.Title>도덕정</Card.Title>
                            <Card.Text className="text-sm pl-5 pr-5 mb-2">
                                도심의 아름다운 경관을 한눈에 담을 수 있는 최적의 장소입니다. 이곳은 다양한 철쭉이 만발하는 봄에 많은 방문객을 매료시키며, 도시자연공원과 등산로를 통해 편안한 휴식과 여유로운 시간을 제공합니다.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="d-flex justify-content-center align-items-center">
                    <Card className="text-center" style={{ height: '500px', width: '100%' }}>
                        <Card.Img
                            variant="top"
                            src={image3} // 두 번째 특색 이미지
                            className="rounded-circle mx-auto"
                            style={{width:'350px', height:'400px', margin:'10px', padding:'10px' }} // 이미지 크기 조정
                        />
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                            <Card.Title>도덕산 출렁다리</Card.Title>
                            <Card.Text className="text-sm pl-5 pr-5 mb-2">
                                높이 20m, 길이 82m의 Y자형 구조로, 인공폭포와 등산로를 연결하여 아름다운 경관을 감상할 수 있는 공간을 제공합니다. 다리 중앙에서는 멋진 추억을 남길 수 있어 방문객들에게 특별한 경험을 선사합니다.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default IntroductionPage;
