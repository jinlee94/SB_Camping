// src/components/ResList.js

import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { getAllRes } from '../../api/ResApi';   // API 임포트
import Search from "./Search";   // Search 컴포넌트 임포트
import { getPagination } from "item-pagination"; // 페이지네이션 함수 임포트

const ResList = () => {
    // 예약 데이터를 저장하는 상태 변수
    const [reservations, setReservations] = useState([]);

    // 에러 메시지를 저장하는 상태 변수
    const [error, setError] = useState('');

    // 검색어를 저장하는 상태 변수
    const [searchTerm, setSearchTerm] = useState('');

    // 선택된 검색 컬럼을 저장하는 상태 변수, 기본값은 예약 번호
    const [selectedColumn, setSelectedColumn] = useState('resId');

    // 현재 페이지를 저장하는 상태 변수, 기본값은 1
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // 페이지당 항목 수

    //정렬기능 구현을 위한 상태변수
    const [sortColumn, setSortColumn] = useState(reservations.resId);
    const [sortOrder, setSortOrder] = useState('desc'); // 디폴트는 내림차순 글 번호가 디폴트라 내림차순으로 해야 최신이 위로 올라옴


    const handleSort = (column) => {
        if (sortColumn === column) {
            // 이미 선택된 컬럼이면 정렬 순서만 변경
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            // 새로운 컬럼 선택 시 오름차순으로 시작
            setSortColumn(column);
            setSortOrder('desc');
        }
    };

    // 데이터 불러오는 비동기 함수
    const settingReservation = async () => {
        try {
            // API 호출하여 예약 데이터 가져오기
            const data = await getAllRes();
            setReservations(data); // 상태에 데이터 저장
        } catch (err) {
            console.error('예약 데이터를 불러오는데 실패했습니다 ResList 파일 settingReservation 함수:', err);
            setError('사이트 데이터를 불러오는데 실패했습니다.');
        }
    };

    // 컴포넌트가 마운트될 때 예약 데이터 불러오기
    useEffect(() => {
        settingReservation();
    }, []);

    // 전체 데이터를 검색어와 선택된 컬럼에 따라 예약 데이터를 필터링
    const filteredReservations = reservations.filter((reservation) => {
        // resStatus가 "예약완료"가 아닌 경우 제외
        if (reservation.resStatus !== "예약완료") return false;

        // 검색어가 없으면 모든 데이터 표시
        if (!searchTerm) return true;

          // 필드가 중첩된 경우 객체 내부의 값을 선택
    const value = selectedColumn.includes('member')//삼항연산자
        ? reservation.member?.[selectedColumn.split('.')[1]]
        : selectedColumn.includes('site')
            ? reservation.site?.[selectedColumn.split('.')[1]]
            : reservation[selectedColumn];

    return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    const sortedReservations = [...filteredReservations].sort((a, b) => {
        if (!sortColumn) return 0; // 정렬할 컬럼이 선택되지 않은 경우 원본 데이터 유지

        let valueA = a[sortColumn];
        let valueB = b[sortColumn];

        if (sortColumn==='memberName') //선택된 컬럼이 회원명인 경우
        {
            valueA = a.member.memberName;
            valueB = b.member.memberName;
        }

         if (sortColumn==='siteName')
        {
            valueA = a.site.siteName;
            valueB = b.site.siteName;
        }


        if (typeof valueA === 'string') {
            return sortOrder === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        } else {
            return sortOrder === 'asc'
                ? valueA - valueB
                : valueB - valueA;
        }
    });



    // 데이터를 전체 페이지 수를 계산하는 변수, 필터링된 데이터 기준
    const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);

    // 페이지 번호를 클릭할 때 호출되는 함수
    const handlePageClick = (pageNumber) => {
        // 페이지 번호가 유효한지 확인
        if (pageNumber < 1) pageNumber = 1;
        else if (pageNumber > totalPages) pageNumber = totalPages;

        setCurrentPage(pageNumber);
    };

    // 정렬된 된 데이터를 전체수로나눔 페이지네이션된 데이터 가져오기
    const paginatedReservations = getPagination(sortedReservations, itemsPerPage, currentPage);

    // 검색어나 선택된 컬럼이 변경되면 현재 페이지를 1로 리셋
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedColumn]);


    // 정렬 아이콘을 렌더링하는 함수
const renderSortIcon = (column) => {
    if (sortColumn !== column) return null; // 현재 정렬 컬럼이 아닐 경우 아이콘 표시 안함
    if (sortOrder === 'asc') {
        return <i className="bi bi-arrow-up ms-2"></i>; // 오름차순 아이콘
    } else {
        return <i className="bi bi-arrow-down ms-2"></i>; // 내림차순 아이콘
    }
};

    return (
        <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* 페이지 제목 */}
            <h2 className="text-2xl font-bold mb-4">예약 정보 목록</h2>

            {/* 서치 컴포넌트 (자식) */}
            <Search
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedColumn={selectedColumn}
                setSelectedColumn={setSelectedColumn}
            />

            {/* 에러 메시지 표시 */}
            {error && <div className="text-danger mb-4">{error}</div>}

            {/* 예약 정보 테이블 */}
            <Table bordered hover responsive className="text-sm">
                <thead>
                <tr className="bg-blue-200"> {/*표 머리에 클릭시 정렬기능 달아줌 추후에 시각적 표시도 할거임*/}
                    <th onClick={() => handleSort('resId')} style={{cursor: 'pointer'}}>예약 번호{renderSortIcon('resId')}</th>
                    <th onClick={() => handleSort('resUserName')} style={{cursor: 'pointer'}}>예약자 이름{renderSortIcon('resUserName')}</th>
                    <th onClick={() => handleSort('resUserPhone')} style={{cursor: 'pointer'}}>예약자 전화번호{renderSortIcon('resUserPhone')}</th>
                    <th onClick={() => handleSort('resPeople')} style={{cursor: 'pointer'}}>인원수{renderSortIcon('resPeople')}</th>
                    <th onClick={() => handleSort('checkinDate')} style={{cursor: 'pointer'}}>입실 날짜{renderSortIcon('checkinDate')}</th>
                    <th onClick={() => handleSort('checkoutDate')} style={{cursor: 'pointer'}}>퇴실 날짜{renderSortIcon('checkoutDate')}</th>
                    <th onClick={() => handleSort('resDate')} style={{cursor: 'pointer'}}>예약 날짜{renderSortIcon('resDate')}</th>
                    <th onClick={() => handleSort('resTotalPay')} style={{cursor: 'pointer'}}>총 결제 금액{renderSortIcon('resTotalPay')}</th>
                    <th onClick={() => handleSort('memberName')} style={{cursor: 'pointer'}}>회원 이름{renderSortIcon('memberName')}</th>
                    <th onClick={() => handleSort('siteName')} style={{cursor: 'pointer'}}>구역 이름{renderSortIcon('siteName')}</th>
                </tr>
                </thead>

                <tbody>
                {paginatedReservations.length > 0 ? ( // 필터링,페이지네이션 데이터를 map함수로 순환출력
                    paginatedReservations.map(reservation => (
                        <tr key={reservation.resId}>
                            <td>{reservation.resId}</td>
                            <td>{reservation.resUserName}</td>
                            <td>{reservation.resUserPhone}</td>
                            <td>{reservation.resPeople}</td>
                            <td>{reservation.checkinDate}</td>
                            <td>{reservation.checkoutDate}</td>
                            <td>{reservation.resDate}</td>
                            <td>{reservation.resTotalPay} 원</td>
                            <td>{reservation.member.memberName}</td>
                            <td>{reservation.site.siteName}</td>
                        </tr>
                    ))
                ) : (
                    // 데이터가 없을 경우 메시지 표시, colSpan을 정확하게 설정
                    <tr>
                        <td colSpan="10" className="text-center">예약 데이터가 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </Table>

            {/* 페이지네이션 */}
            <div className="mt-4 text-center">
                {/* 이전 페이지 버튼 */}
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    &lt;
                </button>

                {/* 페이지 번호 버튼 */}
                {[...Array(totalPages).keys()].map((page) => (
                    <button
                        key={page + 1}
                        onClick={() => handlePageClick(page + 1)}
                        className={`px-4 py-2 mx-1 ${currentPage === page + 1 ? 'bg-blue-700' : 'bg-blue-500'} text-white rounded hover:bg-blue-700`}
                    >
                        {page + 1}
                    </button>
                ))}

                {/* 다음 페이지 버튼 */}
                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

// **컴포넌트 내보내기**
export default ResList;
