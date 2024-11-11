import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from 'react-bootstrap';
import { getAllSites } from '../../api/SiteApi';

const SearchComponent = ({ onSearch }) => {
    const [dateType, setDateType] = useState('month');
    const [startDate, setStartDate] = useState(() => {
        const currentDate = new Date();
        return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    });
    const [endDate, setEndDate] = useState('');
    const [siteId, setSiteId] = useState('');
    const [sites, setSites] = useState([]);

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const data = await getAllSites();
                setSites(data);
            } catch (err) {
                console.error('사이트 데이터를 불러오는데 실패했습니다:', err);
            }
        };

        fetchSites();
    }, []);

    const handleDateTypeChange = (event) => {
        setDateType(event.target.value);
        setStartDate('');
        setEndDate('');
    };

    const handleSearch = () => {
        let searchParams = { dateType, startDate, siteId };

        // 날짜 타입에 따른 파라미터 설정
        if (dateType === 'day') {
            searchParams.endDate = endDate;
        } else if (dateType === 'month') {
            const [year, month] = startDate.split('-');
            searchParams.startDate = `${year}-${month}-01`;
            searchParams.endDate = new Date(year, month, 0).toISOString().split('T')[0];
        } else if (dateType === 'year') {
            searchParams.startDate = `${startDate}-01-01`;
            searchParams.endDate = `${startDate}-12-31`;
        }

        console.log('Search Params:', searchParams); // 추가: 생성된 파라미터 확인
        onSearch(searchParams);
    };

    return (
        <Form>
            <Row className="align-items-center mb-3">
                <Col xs={12} md={8}>
                    <Row className="align-items-center">
                        <Col xs="auto">
                            <Form.Select value={dateType} onChange={handleDateTypeChange}>
                                <option value="day">일간</option>
                                <option value="month">월간</option>
                                <option value="year">연간</option>
                            </Form.Select>
                        </Col>
                        <Col xs="auto">
                            {dateType === 'day' && (
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            )}
                            {dateType === 'month' && (
                                <Form.Control
                                    type="month"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            )}
                            {dateType === 'year' && (
                                <Form.Control
                                    type="number"
                                    placeholder="YYYY"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().getFullYear() - 2}
                                    max={new Date().getFullYear()}
                                />
                            )}
                        </Col>
                        {dateType === 'day' && (
                            <>
                                <Col xs="auto">~</Col>
                                <Col xs="auto">
                                    <Form.Control
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate}
                                    />
                                </Col>
                            </>
                        )}
                    </Row>
                </Col>
                <Col xs={12} md={4} className="mt-3 mt-md-0">
                    <Row className="align-items-center justify-content-md-end">
                        <Col xs="auto">
                            <Form.Select value={siteId} onChange={(e) => setSiteId(e.target.value)}>
                                <option value="">전체</option>
                                {sites.map(site => (
                                    <option key={site.siteId} value={site.siteId}>{site.siteName}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col xs="auto">
                            <Button onClick={handleSearch}>조회</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Form>
    );
};

export default SearchComponent;
