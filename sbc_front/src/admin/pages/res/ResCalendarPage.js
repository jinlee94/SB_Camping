
import React, { useState,useEffect } from 'react'; // React는 리액트 기본 라이브러리이며, useState는 상태 관리를 위한 메서드,uesEffect 상태변화감지
import ResCalendar from '../../components/res/ResCalendar'; // ResCalendar 컴포넌트를 임포트합니다. 경로에 오타가 없도록 확인하세요.
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate는 경로 이동을, useLocation은 현재 경로 정보를 얻기 위한 훅입니다.
import { useSelector } from 'react-redux'; // 현재 로그인 한 사용자의 권한 검증을 위해

const ResCalendarPage = () => {
    // Redux 스토어에서 loginSlice 접근
    const loginState = useSelector((state) => state.loginSlice);
    const navigate = useNavigate(); // 경로 이동 훅
    const location = useLocation(); // 현재 경로정보를 얻기훅 =>네비게이션 백그라운드 색상때문에

    useEffect(() => {
        // 현재 로그인한.유저의?.권한이 !== 관리자
        // 경우 '/'(기본 메인)경로로
        console.log('isAuthenticated 상태:', loginState.isAuthenticated);
        console.log('로그인 상태:', loginState);

        if (loginState.member?.memberRole !== 'ROLE_ADMIN') {
            navigate('/'); // 이동 할 경로
        }
    }, [loginState, navigate]);


    // 디버깅 확인용 로그
    console.log("ResCalendarPage 로드 됐다!!!!");

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* 페이지 중앙 정렬컨테이너 */}
            <div style={{ width: '100%' }}>
                <h1>날짜/구역별 예약 리스트</h1> {/* 페이지 제목 */}
                <hr />

                {/* 예약 상태 안내문구 우정렬*/}
                <div className="mb-4 text-right">
                    <span className="text-red-500 font-bold">빨간색</span> - 예약 완료
                    <br/>
                    <span className="text-blue-500">파란색</span> - 예약 없음
                </div>

                {/* 예약달력컴포넌트 렌더링 */}
                <ResCalendar />
            </div>
        </div>
    );
};

export default ResCalendarPage;
