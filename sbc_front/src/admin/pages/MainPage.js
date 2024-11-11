import BasicLayout from '../layouts/BasicLayout';
import '../css/mainPage.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import ResCalendar from "../components/res/ResCalendar";
import useCustomLogin from "../../hooks/useCustomLogin";
import Carousel from "react-bootstrap/Carousel";
import {getStatsReservations} from "../api/statsApi";

const MainPage = () => {
    const loginState = useSelector((state) => state.loginSlice);
    const { isLogin } = useCustomLogin();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState('');
    const [totalReservationStats, setTotalReservationStats] = useState({ totalReservations: 0, averageReservationsPerDay: 0 });
    const [totalSales, setTotalSales] = useState(0);

    const [searchParams, setSearchParams] = useState({
        dateType: 'month', // 기본값을 'month'로 설정
        startDate: '', // 초기값 비워두기
        endDate: '',
    });
    const [loading, setLoading] = useState(false);

    const processData = (data) => {
        console.log('Received data:', data);

        if (data.length > 0) {
            // 총 매출 계산
            const totalSales = data.reduce((acc, reservation) => acc + reservation.resTotalPay, 0);

            // 총 예약 통계 수정
            setTotalReservationStats({
                totalReservations: data.length, // 예약 수
                averageReservationsPerDay: data.length ? (data.length / 30) : 0 // 일 평균 예약 수
            });

            // 총 매출 상태 업데이트
            setTotalSales(totalSales); // state에 총 매출 저장
        }
    };


    useEffect(() => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const newSearchParams = {
            dateType: 'month',
            startDate: formatDate(firstDayOfMonth),
            endDate: formatDate(lastDayOfMonth),
        };

        setSearchParams(newSearchParams);

        // setSearchParams 후에 onSearch 호출
        onSearch(newSearchParams);
    }, []);

// onSearch 함수 수정
    const onSearch = async (searchParams) => {
        setLoading(true);
        try {
            console.log('Searching with params:', searchParams); // 디버깅용
            const data = await getStatsReservations(searchParams);

            processData(data);
        } catch {
            console.error(); // 디버깅용
        } finally {
            setLoading(false);
        }
    };

    // 로그인 상태에 따른 페이지 렌더링 관련
    useEffect(() => {
        console.log("Current login state:", loginState);
        console.log("Is logged in:", isLogin);

        if (isLogin) {
            if (loginState.member?.memberRole === "ROLE_ADMIN") {
                setIsLoading(false);
                console.log("Admin access granted");
            } else {
                console.log("Redirecting to home: Not an admin");
                navigate('/');
            }
        } else {
            console.log("Not logged in, redirecting to login page");
            const timer = setTimeout(() => {
                navigate('/login');
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [isLogin, loginState, navigate]);

    // 실시간 보이기
    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleString());
        };
        updateCurrentTime(); // 처음 렌더링 시 바로 시간 업데이트
        const intervalId = setInterval(updateCurrentTime, 1000); // 1초마다 업데이트
        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 interval 해제
    }, []);

    // 로딩 중이거나 관리자 권한이 없는 경우 메시지 출력
    if (isLoading) {
        return (
            <Container className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ fontSize: '1.5rem', height: '100vh' }}>
                <Spinner animation="border" role="status" className="mb-3" />
                <div>관리자 권한 확인 중...</div>
            </Container>
        );
    }

    return (
        <>
        <BasicLayout>
            <Carousel>
                <Carousel.Item>
                    <div id='slider1'>
                        <div className='slider1_text'>
                            <h2>관리자 페이지입니다</h2>
                            <h5>현재 시간 : {currentTime}</h5>
                        </div>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div id='slider2'>
                        <div className='slider1_text'>
                            <h2>S B C A M P I N G</h2>
                            <h5>오늘도 좋은 하루 되세요</h5>
                        </div>
                    </div>
                </Carousel.Item>
            </Carousel>
            <hr/>
            <div id='communitywrap' className='border-0'>
                <div id='calendarwrap' className='border-4 round-1 shadow-sky-700'
                     onClick={() => navigate('/admin/res/datesite')}>
                    <ResCalendar/>
                </div>
                <div id='guidewrap'>
                    <div className="d-flex">
                        {/* 총 매출 카드 */}
                        <div className="card-container" onClick={()=>navigate("/admin/stats/reservation-sales")}>
                            <div className="card rounded-3 shadow">
                                <div className="card-body text-center">
                                    <h4 className="card-title mb-3">당월 총 매출</h4>
                                    <div className="mt-3 p-3 bg-light rounded">
                                        <div className="stats-number">
                                            <span className="number">{totalSales.toLocaleString() || '0'}</span>
                                            <span className="unit">원</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 누적 예약 고객 분석 카드 */}
                        <div className="card-container" onClick={()=>navigate("/admin/stats/customer")}>
                            <div className="card rounded-3 shadow">
                                <div className="card-body text-center">
                                    <h4 className="card-title mb-4">당월 누적 예약 고객</h4>
                                    <div className="mt-4 p-3 bg-light rounded">
                                        <h5 className="text-primary mb-3">총 누적 예약 고객수</h5>
                                        <div className="stats-number">
                                            <span className="number">{totalReservationStats.totalReservations}</span>
                                            <span className="unit">명</span>
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
                                </div>
                            </div>
                        </div>

                        {/* 분실물 등록 카드 */}
                        <div className="card-container">
                            <div className="card rounded-3 shadow">
                                <div className="card-body text-center">
                                    <h4 className="card-title mb-3">현재 등록 분실물</h4>
                                    <div className="mt-3 p-3 bg-light rounded">
                                        <div className="stats-number">
                                            {/* 분실물 갯수 API 호출 넣어야함 2024-10-30 */}
                                            <span className="number">10</span>
                                            <span className="unit">개</span>
                                        </div>
                                    </div>
                                </div>
                                <a href="/admin/lost/add"> <p className="text-l card-title mb-3 text-center"> 분실물 등록 바로가기 ▶</p></a>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </BasicLayout>
        </>
    );
};

export default MainPage;
