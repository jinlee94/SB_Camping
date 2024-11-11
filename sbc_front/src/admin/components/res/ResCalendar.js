import React, { useState, useEffect, useRef } from 'react';
import { getAllRes } from "../../api/ResApi"; // React와 필요한 훅(useState, useEffect)을 임포트
import Modal from "bootstrap/js/dist/modal"; // Bootstrap의 Modal을 임포트

const ResCalendar = () => {
    // 현재 선택된 날짜를 관리하는 상태 변수
    const [currentDate, setCurrentDate] = useState(new Date()); // 디폴트는 오늘 날짜-첫 화면은 오늘로 선택되어있다

    // 달력에 표시될 날짜들을 저장하는 상태 변수
    const [calendarDays, setCalendarDays] = useState([]); // 빈 배열로 초기화

    // getAllRes API에서 받아온 예약 데이터 전체를 할당할 빈 배열
    const [reservations, setReservations] = useState([]);

    // 배열에 요일을 할당 (일월화수목금토 순서로 문자열 배열)
    const week = ['일', '월', '화', '수', '목', '금', '토'];

    // 모달 관련 상태 및 참조
    const [modalOpen, setModalOpen] = useState(false); // 모달창 띄우는 변수 디폴트는 false
    const [selectRes, setSelectRes] = useState(null); // 클릭한 예약 정보를 담을 상태 변수
    const modalRef = useRef(null); // 모달 DOM 요소 참조

    // 컴포넌트가 처음 렌더링될 때 예약 데이터를 가져옵니다.
    useEffect(() => {
        const settingReservations = async () => { // API를 이용해서 배열에 전체 예약 데이터를 할당
            try {
                const data = await getAllRes(); // 모든 예약 데이터 가져오기
                setReservations(data); // 전체 예약 데이터 상태 변수에 저장
            } catch (error) { // 예외 처리
                console.error("예약 데이터를 가져오는 중 오류 발생 ResCalendar 파일, settingRes 함수:", error);
            }
        };
        settingReservations();
    }, []); // 빈 배열로 컴포넌트 마운트 시 한 번만 실행

    // 컴포넌트가 처음 렌더링되거나 currentDate가 변경될 때마다 createCalendar 함수를 호출
    useEffect(() => {
        createCalendar(currentDate); // 달력을 생성하는 함수 호출
    }, [currentDate]); // currentDate가 변경될 때마다 실행

    // 모달을 제어하는 useEffect
    useEffect(() => {
        const modalElement = modalRef.current;
        let modalInstance;

        if (modalOpen && modalElement) {
            modalInstance = new Modal(modalElement, {
                backdrop: 'static', // 배경 클릭 시 닫히지 않도록 설정
            });
            modalInstance.show();
        }

        // 모달이 닫힐 때 상태를 업데이트
        const handleHidden = () => {
            setModalOpen(false);
            setSelectRes(null);
        };

        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', handleHidden);
        }

        // 클린업 함수
        return () => {
            if (modalElement) {
                modalElement.removeEventListener('hidden.bs.modal', handleHidden);
            }
            if (modalInstance) {
                modalInstance.dispose();
            }
        };
    }, [modalOpen]);

    // 달력 모양, 형식 함수
    const createCalendar = (date) => {
        const year = date.getFullYear(); // 연도 추출
        const month = date.getMonth(); // 월 추출 (0부터 11까지)
        const firstDayOfMonth = new Date(year, month, 1); // 해당 월의 1일
        const lastDayOfMonth = new Date(year, month + 1, 0); // 해당 월의 마지막 날
        const dayIndex = firstDayOfMonth.getDay(); // 첫째 날의 요일 인덱스 (0: 일요일, 6: 토요일)
        const lastDate = lastDayOfMonth.getDate(); // 해당 월의 마지막 날짜
        const days = []; // 달력에 표시될 날짜들을 저장할 배열

        // 이전 달의 마지막 날짜부터 현재 달의 첫째 날까지의 날짜를 채움
        const preLast = new Date(year, month, 0).getDate(); // 이전 달의 마지막 날짜
        for (let i = dayIndex - 1; i >= 0; i--) {
            days.push({ // 배열의 뒷쪽에 채워넣는 메서드
                date: preLast - i, // 이전 달의 날짜
                isCurrentMonth: false, // 현재 달이 아님
                // 형식화된 날짜 (월.일)
                formatted: `${month === 0 ? 12 : month}.${(preLast - i).toString().padStart(2, '0')}` // 포맷:
            });
        }

        // 현재 달의 모든 날짜를 채움
        for (let i = 1; i <= lastDate; i++) {
            days.push({
                date: i, // 현재 달의 날짜
                isCurrentMonth: true // 현재 달임을 표시
            });
        }

        // 다음 달의 날짜로 달력을 채움 (총 42일로 고정: 6주)
        const nextMonthDays = 42 - days.length; // 남은 날짜 수 계산
        for (let i = 1; i <= nextMonthDays; i++) {
            days.push({
                date: i, // 다음 달의 날짜
                isCurrentMonth: false, // 현재 달이 아님
                formatted: `${month === 11 ? 1 : month + 2}.${i.toString().padStart(2, '0')}` // 형식화된 날짜 (월.일)
            });
        }
        setCalendarDays(days); // 생성된 날짜들을 상태에 저장
    };

    // 달력을 전월로 바꾸는 함수
    const handlePreMonth = () => { // 전월 함수 버튼에 onClick으로 넣을거임
        // 현재 날짜에서 월을 하나 감소시켜 use state 활용 set
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // 달력을 익월로 바꾸는 함수
    const handleNextMonth = () => { // 익월 버튼에 이벤트로 넣을거임
        // 현재 날짜에서 월을 하나 증가시켜 use state 활용 set
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // today 변수에 오늘 날짜를 할당
    const today = new Date();

    // 현재 달과 오늘의 달이 같은지 확인
    const sameMonthAsToday =
        /* 선택된 날짜의 월 === 오늘의 월 그리고 선택된 날짜의 연도 === 오늘의 연도 */
        currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

    // 오늘 날짜
    const currentDay = today.getDate();

    return (
        <div className="w-full h-full p-6 flex flex-col bg-gray-100">
            {/* 헤더: 이전 달, 현재 달/년, 다음 달 버튼 */}
            <div className="flex justify-between items-center mb-6">
                {/* 이전 달로 이동하는 버튼 */}
                <button
                    onClick={handlePreMonth}
                    className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
                    aria-label="이전 달로 이동"
                >
                    이전
                </button>

                {/* 달력에 표시될 년(선택된 날짜에서 얻어옴), 월(선택된 날짜에서 얻어옴) */}
                <h2 className="text-2xl font-semibold">{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>

                {/* 다음 달로 이동하는 버튼 */}
                <button
                    onClick={handleNextMonth}
                    className="px-3 py-1 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition duration-300"
                    aria-label="다음 달로 이동"
                >
                    다음
                </button>
            </div>

            {/* 요일 표시: 일요일부터 토요일까지 */}
            <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-700">
                {/* week 배열을 day 요소와 index를 인자로 받아 반복 작업 수행 */}
                {week.map((day, index) => (
                    <div
                        key={day}
                        className={`py-3 border-b ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : ''}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* 달력 그리드: 각 날짜를 그리드 셀로 표시 */}
            <div className="grid grid-cols-7 gap-2 mt-2">
                {/* calendarDays 배열을 day 요소와 index를 인자로 받아 반복 작업 수행 */}
                {calendarDays.map((day, index) => {
                    // 오늘인지 여부를 판단하는 변수
                    const isToday = sameMonthAsToday && day.isCurrentMonth && day.date === currentDay;
                    // 일요일과 토요일의 텍스트 색상을 설정
                    const textColor = index % 7 === 0 ? 'text-red-500' : index % 7 === 6 ? 'text-blue-500' : '';
                    // 오늘 날짜인 경우 테두리와 배경색을 강조, 그렇지 않으면 기본 스타일
                    const borderClass = isToday ? 'border-2 border-red-500' : 'border border-gray-200';
                    const bgColor = isToday ? 'bg-red-100' : 'bg-white';

                    // 해당 날짜에 맞는 예약 필터링
                    const formattedDay = day.date.toString().padStart(2, '0');
                    const formattedMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
                    const cellDate = day.isCurrentMonth
                        ? `${currentDate.getFullYear()}-${formattedMonth}-${formattedDay}`
                        : null; // 이전/다음 달 날짜는 null 처리

                    // 해당 날짜의 예약들 필터링
                    const reservationsForDay = cellDate
                        ? reservations.filter(reservation => {
                            return (
                                new Date(reservation.checkinDate) <= new Date(cellDate) &&
                                new Date(reservation.checkoutDate) > new Date(cellDate)
                            );
                        }).sort((a, b) => a.site.siteId - b.site.siteId) // siteId 기준 오름차순 정렬
                        : [];

                  return (
        <div
            key={index}
            className={`h-full p-2 rounded overflow-auto ${textColor} ${borderClass} ${bgColor}`}
        >
            {/* 날짜 표시 */}
            <div className="flex justify-between items-center mb-1">
                {/* 현재 달의 날짜는 숫자로, 이전/다음 달의 날짜는 형식화된 문자열로 표시 */}
                <span className="font-bold text-base">{day.date}</span>
                {/* 오늘 날짜인 경우 '오늘'이라는 텍스트 표시 */}
                {isToday && (
                    <span className="text-sm text-red-500">오늘</span>
                )}
            </div>

            {/* 예약 정보는 현재 달의 날짜에만 표시 */}
            {day.isCurrentMonth && (
                <div className="mt-1">
                    {reservationsForDay.length > 0 ? (
                        reservationsForDay.map((reservation, resIndex) => (
                            <div
                                key={resIndex}
                                className="text-sm text-red-600 cursor-pointer hover:bg-gray-200 p-1 rounded"
                                onClick={() => { setSelectRes(reservation); setModalOpen(true); }}
                            >
                                {/* 예약 상태가 '예약취소'가 아닌 경우에만 구역명을 출력 */}
                                {reservation.resStatus !== '예약취소' && reservation.site.siteName}
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-blue-400">예약 없음</div>
                    )}
                </div>
            )}
        </div>
    );
})}
            </div>
            {/* 예약 정보 모달 */}
            <div className="modal fade" ref={modalRef} tabIndex="-1" aria-labelledby="reservationModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="reservationModalLabel">예약 정보</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            {/* 예약 정보 표시 */}
                            {selectRes ? ( // 삼항연산자 사용해서 예약 처리
                                <div>
                                    <p><strong>예약 번호:</strong> {selectRes.resId}</p>
                                    <p><strong>예약자 이름:</strong> {selectRes.resUserName}</p>
                                    <p><strong>숙박 구역:</strong> {selectRes.site ? selectRes.site.siteName : '없음'}</p>
                                    <p><strong>전화 번호:</strong> {selectRes.resUserPhone}</p>
                                    <p><strong>입실 인원:</strong> {selectRes.resPeople}</p>
                                    <p><strong>예약 날짜:</strong> {selectRes.resDate}</p>
                                    <p><strong>입실 날짜:</strong> {selectRes.checkinDate}</p>
                                    <p><strong>퇴실 날짜:</strong> {selectRes.checkoutDate}</p>
                                    <p> {/* 숙박일수를 계산하여 출력 */}
                                        <strong>숙박 일수:</strong>
                                        <span className="text-red-600 font-bold">
                                            {Math.ceil((new Date(selectRes.checkoutDate) - new Date(selectRes.checkinDate)) / (1000 * 60 * 60 * 24))}박&nbsp;
                                            {Math.ceil((new Date(selectRes.checkoutDate) - new Date(selectRes.checkinDate)) / (1000 * 60 * 60 * 24)) + 1}일
                                        </span></p>
                                    <p><strong>예약 상태:</strong> {selectRes.resStatus}</p>
                                    <p><strong>결제 금액:</strong> {selectRes.resTotalPay}</p>
                                    <p><strong>취소 날짜:</strong> {selectRes.resCancelDate ? selectRes.resCancelDate : 'N/A'}</p>
                                    <p><strong>취소 사유:</strong> {selectRes.resCancelReason ? selectRes.resCancelReason : 'N/A'}</p>
                                    <p><strong>리뷰 작성 여부:</strong> {selectRes.resReview === 'Y' ? '작성 완료' : '미작성'}</p>
                                </div>
                            ) : ( // false일 경우 예약 정보가 없음을 표시
                                <p>예약 정보가 없습니다.</p>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResCalendar; // 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냄
