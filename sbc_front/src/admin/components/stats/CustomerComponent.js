import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import SearchComponent from "../util/SearchComponent";
import { fetchCustomerStats } from '../../api/statsApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/customerStatsComponent.css'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AGE_COLORS = {
    '10대': '#8884d8',
    '20대': '#82ca9d',
    '30대': '#ffc658',
    '40대': '#ff8042',
    '50대': '#a4de6c',
    '60대': '#d0ed57'
};

const GENDER_COLORS = {
    '여성': '#FF69B4',
    '남성': '#4169E1',
    '기타': '#808080' // 기타 색상 추가
};

const CustomerComponent = () => {
    const [error, setError] = useState(null);
    const [genderData, setGenderData] = useState([]);
    const [ageData, setAgeData] = useState([]);
    const [localData, setLocalData] = useState([]);
    const [totalReservationStats, setTotalReservationStats] = useState({ totalReservations: 0, averageReservationsPerDay: 0 });
    const [rebookingRate, setRebookingRate] = useState(0);
    const [mostFrequentReservationCustomer, setMostFrequentReservationCustomer] = useState(null);
    const [mostFrequentCancellationCustomer, setMostFrequentCancellationCustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        dateType: 'day',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        siteId: null
    });

    // 현재 월의 시작일과 마지막일 계산
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 초기 검색 파라미터 설정
    const initialSearchParams = {
        dateType: 'month',
        startDate: firstDayOfMonth.toISOString().split('T')[0],
        endDate: lastDayOfMonth.toISOString().split('T')[0],
        siteId: null
    };

    const processData = (data) => {
        console.log('Received data:', data);

        if (data.overallStats) {
            const genderStats = { '여성': 0, '남성': 0 };
            const ageStats = {};
            const regionStats = {};

            data.overallStats.forEach(stat => {
                // 성별 집계 수정
                if (stat.gender === 'W') genderStats['여성'] += stat.count;
                else if (stat.gender === 'M') genderStats['남성'] += stat.count; // 'M'으로 수정

                // 연령대 집계
                if (stat.ageGroup) {
                    ageStats[stat.ageGroup] = (ageStats[stat.ageGroup] || 0) + stat.count;
                }

                // 지역별 집계
                if (stat.region) {
                    regionStats[stat.region] = (regionStats[stat.region] || 0) + stat.count;
                }
            });

            // 성별 데이터 설정
            const genderArray = Object.entries(genderStats)
                .filter(([_, value]) => value > 0)
                .map(([key, value]) => ({ name: key, value: value }));
            setGenderData(genderArray);

            // 연령대 데이터 설정
            const ageArray = Object.entries(ageStats)
                .filter(([key, value]) => key !== '') // 빈 문자열 필터링
                .map(([key, value]) => ({
                    name: key,
                    value: value
                }));
            setAgeData(ageArray);

            // 지역별 데이터 설정
            const localArray = Object.entries(regionStats)
                .filter(([key, value]) => key !== '' && value > 0)
                .map(([key, value]) => ({
                    name: key,
                    value: value
                }));
            setLocalData(localArray);
        } else {
            setGenderData([]);
            setAgeData([]);
            setLocalData([]);
        }

        // totalReservationStats 수정
        setTotalReservationStats({ 
            totalReservations: data.totalCustomers || 0, 
            averageReservationsPerDay: data.totalCustomers ? (data.totalCustomers / 30) : 0 
        });

        // 다른 데이터 처리는 그대로 유지
        if (data.rebookingRate !== undefined) {
            setRebookingRate(data.rebookingRate);
        }

        // 최다 예약 고객 처리
        setMostFrequentReservationCustomer(
            data.mostFrequentReservationCustomerId ? {
                customerId: data.mostFrequentReservationCustomerId,
                customerName: data.mostFrequentReservationCustomerName,
                customerEmail: data.mostFrequentReservationCustomerEmail,
                reservationCount: data.mostFrequentReservationCount // 예약 횟수 추가
            } : null
        );

        // 최다 취소 고객 처리
        setMostFrequentCancellationCustomer(
            data.mostFrequentCancellationCustomerId ? {
                customerId: data.mostFrequentCancellationCustomerId,
                customerName: data.mostFrequentCancellationCustomerName,
                customerEmail: data.mostFrequentCancellationCustomerEmail,
                cancellationCount: data.mostFrequentCancellationCount // 취소 횟수 추가
            } : null
        );
    };

    const onSearch = async (newSearchParams) => {
        setSearchParams(newSearchParams);
        setLoading(true);
        try {
            const data = await fetchCustomerStats(newSearchParams);
            processData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 초기 데이터 로드
    useEffect(() => {
        onSearch(initialSearchParams);
    }, []);

    const NoDataMessage = () => (
        <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500">
            해당 기간에 데이터가 존재하지 않습니다.
        </div>
    );

    return (
        <div className="container-fluid mt-4">
            <SearchComponent 
                onSearch={onSearch}
                initialValues={initialSearchParams} // SearchComponent에 초기값 전달
            />
        <hr/>
            <div className="row mt-4">
                {/* 누적 예약 고객 분석 */}
                <div className="col-md-6 mb-4">
                    <div className="card rounded-3 shadow h-100">
                        <div className="card-body text-center"> {/* text-center 추가 */}
                            <h4 className="card-title mb-4">누적 예약 고객 분석</h4>
                            <div className="mt-4 p-3 bg-light rounded"> {/* 배경과 패딩 추가 */}
                                <h5 className="text-primary mb-3">총 누적 예약 고객수</h5>
                                <div className="d-flex justify-content-center align-items-center">
                                    <h2 className="display-4 mb-0 text-dark">
                                        {totalReservationStats.totalReservations}
                                    </h2>
                                    <span className="ms-2 text-muted">명</span>
                                </div>
                                <p className="text-muted mt-2">
                                    일 평균 예약 고객수:
                                    <span className="fw-bold ms-2">
                        {totalReservationStats.averageReservationsPerDay
                            ? totalReservationStats.averageReservationsPerDay.toFixed(2)
                            : 'N/A'} 명
                    </span>
                                </p>
                            </div>
                            <div className="mt-4 p-3 bg-light rounded"> {/* 배경과 패딩 추가 */}
                                <h5 className="text-success mb-3">재예약 고객 비율</h5>
                                <div className="d-flex justify-content-center align-items-center">
                                    <h2 className="display-4 mb-0 text-dark">
                                        {rebookingRate ? rebookingRate.toFixed(1) : 'N/A'}
                                    </h2>
                                    <span className="ms-2 text-muted">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 최다 예약/최다 취소 고객 */}
                <div className="col-md-6 mb-4">
                    <div className="card rounded-3 shadow h-100">
                        <div className="card-body text-center">
                            <h4 className="card-title mb-4">최다 예약/최다 취소 고객</h4>

                            {/* 최다 예약 고객 */}
                            <div className="mt-4 p-3 bg-light rounded">
                                <h5 className="text-primary mb-3">최다 예약 고객</h5>
                                {mostFrequentReservationCustomer ? (
                                    <div className="customer-info">
                                        <div className="mb-2">
                                            <span className="fw-bold">이름:</span>
                                            <span className="ms-2">{mostFrequentReservationCustomer.customerName}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="fw-bold">이메일:</span>
                                            <span className="ms-2">{mostFrequentReservationCustomer.customerEmail}</span>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center mt-3">
                                            <h3 className="mb-0 text-primary">
                                                {mostFrequentReservationCustomer.reservationCount}
                                            </h3>
                                            <span className="ms-2 text-muted">회 예약</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted">데이터 없음</p>
                                )}
                            </div>

                            {/* 최다 취소 고객 */}
                            <div className="mt-4 p-3 bg-light rounded">
                                <h5 className="text-danger mb-3">최다 취소 고객</h5>
                                {mostFrequentCancellationCustomer ? (
                                    <div className="customer-info">
                                        <div className="mb-2">
                                            <span className="fw-bold">이름:</span>
                                            <span className="ms-2">{mostFrequentCancellationCustomer.customerName}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="fw-bold">이메일:</span>
                                            <span className="ms-2">{mostFrequentCancellationCustomer.customerEmail}</span>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center mt-3">
                                            <h3 className="mb-0 text-danger">
                                                {mostFrequentCancellationCustomer.cancellationCount}
                                            </h3>
                                            <span className="ms-2 text-muted">회 취소</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted">데이터 없음</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 성별 비중 */}
                <div className="col-12 mb-4">
                    <div className="card rounded-3 shadow">
                        <div className="card-body">
                            <h4 className="card-title">성별 비중</h4>
                            <div style={{ height: '400px' }}>
                                {genderData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={genderData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value">
                                                {genderData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[entry.name]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <NoDataMessage />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 연령별 비중 */}
                <div className="col-12 mb-4">
                    <div className="card rounded-3 shadow">
                        <div className="card-body">
                            <h4 className="card-title">연령별 비중</h4>
                            <div style={{ height: '400px' }}>
                                {ageData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={ageData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value">
                                                {ageData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={AGE_COLORS[entry.name] || '#8884d8'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <NoDataMessage />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 지역별 비중 */}
                <div className="col-12 mb-4">
                    <div className="card rounded-3 shadow">
                        <div className="card-body">
                            <h4 className="card-title">지역별 비중</h4>
                            <div style={{ height: '400px' }}>
                                {localData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={localData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={150}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {localData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend /> {/* 지역별 비중에만 Legend 추가 */}
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <NoDataMessage />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerComponent;
