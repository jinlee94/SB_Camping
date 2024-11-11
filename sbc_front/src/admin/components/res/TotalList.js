// src/components/TotalList.js

import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { getAllRes } from '../../api/ResApi';   // API 임포트
import Search from './Search'; // Search 컴포넌트 임포트
import { getPagination } from "item-pagination"; // 페이지네이션 함수 임포트

const TotalList = () => {
    // 예약 데이터를 저장하는 변수
    const [reservations, setReservations] = useState([]);

    // 에러 문구 세팅 변수
    const [error, setError] = useState('');

    // 검색어 상태 변수
    const [searchTerm, setSearchTerm] = useState('');

    // 선택된 컬럼 상태 변수, 셀렉트 값의 기본은 예약번호
    const [selectedColumn, setSelectedColumn] = useState('resId');

    // 현재 페이지 설정 상태 변수
    const [currentPage, setCurrentPage] = useState(1); // 페이지 상태를 1로 초기화
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
            // 변수 data에 getAllRes의 Response.data를 할당
            const data = await getAllRes();
            //상태설정
            setReservations(data);
        } catch (err) {
            console.error('예약 데이터를 불러오는데 실패했습니다 TotalList 파일 settingReservation 함수:', err);
            setError('사이트 데이터를 불러오는데 실패했습니다.');
        }
    };

    // useEffect를 사용하여 컴포넌트 마운트 시 데이터 불러오기
    useEffect(() => {
        settingReservation();
    }, []);


const filteredReservations = reservations.filter((reservation) => {
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

    if (sortColumn === 'memberName') { // 선택된 컬럼이 회원명인 경우
        valueA = a.member?.memberName || 'N/A';  // Null-safe 접근
        valueB = b.member?.memberName || 'N/A';  // Null-safe 접근
    }

    if (sortColumn === 'siteName') {
        valueA = a.site?.siteName || 'N/A';  // Null-safe 접근
        valueB = b.site?.siteName || 'N/A';  // Null-safe 접근
    }

    if (valueA === null && valueB === null) return 0; // 둘 다 null이면 그대로 유지
    if (valueA === null) return 1; // valueA가 null이면 valueB보다 뒤로
    if (valueB === null) return -1; // valueB가 null이면 valueA보다 뒤로

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


    // 전체 페이지 수 계산을 필터된 데이터 기준으로 변경
    const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);

    // 페이지 변경 함수
    const handlePageClick = (pageNumber) => {
        // 페이지 번호가 유효한지 확인
        if (pageNumber < 1) pageNumber = 1;
        else if (pageNumber > totalPages) pageNumber = totalPages;

        setCurrentPage(pageNumber);
    };

    // 페이지네이션된 데이터 가져오기
    const paginatedReservations = getPagination(sortedReservations, itemsPerPage, currentPage);

    // 검색어나 선택된 컬럼이 변경될 때 현재 페이지를 1로 리셋
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedColumn]);//검색어나 설정 컬럼이 바뀔 경우



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
                <tr className="bg-blue-200">
                    <th onClick={() => handleSort('resId')} style={{cursor: 'pointer'}}>예약 번호{renderSortIcon('resId')}</th>
                    <th onClick={() => handleSort('resUserName')} style={{cursor: 'pointer'}}>예약자 이름{renderSortIcon('resUserName')}</th>
                    <th onClick={() => handleSort('resUserPhone')} style={{cursor: 'pointer'}}>예약자 전화번호{renderSortIcon('resUserPhone')}</th>
                    <th onClick={() => handleSort('resPeople')} style={{cursor: 'pointer'}}>인원수{renderSortIcon('resPeople')}</th>
                    <th onClick={() => handleSort('checkinDate')} style={{cursor: 'pointer'}}>입실 날짜{renderSortIcon('checkinDate')}</th>
                    <th onClick={() => handleSort('checkoutDate')} style={{cursor: 'pointer'}}>퇴실 날짜{renderSortIcon('checkoutDate')}</th>
                    <th onClick={() => handleSort('resDate')} style={{cursor: 'pointer'}}>예약 날짜{renderSortIcon('resDate')}</th>
                    <th onClick={() => handleSort('resTotalPay')} style={{cursor: 'pointer'}}>총 결제 금액{renderSortIcon('resTotalPay')}</th>
                    <th onClick={() => handleSort('resCancelDate')} style={{cursor: 'pointer'}}>취소 날짜{renderSortIcon('resCancelDate')}</th>
                    <th onClick={() => handleSort('resCancelReason')} style={{cursor: 'pointer'}}>취소 사유{renderSortIcon('resCancelReason')}</th>
                    <th onClick={() => handleSort('memberName')} style={{cursor: 'pointer'}}>회원 이름{renderSortIcon('memberName')}</th>
                    <th onClick={() => handleSort('siteName')} style={{cursor: 'pointer'}}>구역 이름{renderSortIcon('siteName')}</th>

                </tr>
                </thead>

                <tbody>
                {paginatedReservations.length > 0 ? (//필터된 값을 출력, searchTerm이 ""이면 전체출력
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
                            <td>{reservation.resCancelDate || 'N/A'}</td>
                            <td>{reservation.resCancelReason || 'N/A'}</td>
                            <td>{reservation.member.memberName}</td>
                            <td>{reservation.site.siteName}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="14" className="text-center">예약 데이터가 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </Table>

            {/* 페이지네이션 */}
            <div className="mt-4 text-center">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    &lt;
                </button>

                {[...Array(totalPages).keys()].map((page) => (
                    <button
                        key={page + 1}
                        onClick={() => handlePageClick(page + 1)}
                        className={`px-4 py-2 mx-1 ${currentPage === page + 1 ? 'bg-blue-700' : 'bg-blue-500'} text-white rounded hover:bg-blue-700`}
                    >
                        {page + 1}
                    </button>
                ))}

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

// 컴포넌트 내보내기
export default TotalList;
