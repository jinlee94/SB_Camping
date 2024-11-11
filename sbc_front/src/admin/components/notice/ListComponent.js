import React, { useState, useEffect } from 'react';
import { getAllNotices } from "../../api/NoticeApi"; // API 모듈에서 함수 가져오기
import { useNavigate } from 'react-router-dom';
import { getPagination } from "item-pagination";
import { useSelector } from "react-redux";
import Table from "react-bootstrap/Table"; // 서버 사이드 렌더링에서 사용하기 위해 권한정보를 받아오는


const ListComponent = () => {
    // useNavigate 훅을 사용하여 페이지 이동에 필요한 함수 생성
    const navigate = useNavigate();

    // 현재 로그인중인 사용자의 정보를 받아오는 변수
    const loginState = useSelector((state) => state.loginSlice);

    // 공지사항 전체 정보 목록을 저장하는 변수
    const [notices, setNotices] = useState([]);

    // 입력 검증 시 발생한 에러 메시지를 저장하는 변수
    const [error, setError] = useState('');

    // 현재 페이지 설정 상태변수
    const [currentPage, setCurrentPage] = useState(1); // 페이지 상태를 1로 초기화
    const itemsPerPage = 15; // 페이지당 항목 수
    // 전체 페이지 수 계산
    const totalPages = Math.ceil(notices.length / itemsPerPage);

    // 현재 페이지 변경 함수
    const handlePageClick = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    // 데이터 불러오는 비동기 함수
    const settingNotices = async () => {
        try {
            // 변수 data에 getAllNotices의 Response.data를 할당
            const data = await getAllNotices();
            // set 생성자(변수)
            setNotices(data);
        } catch (err) {
            console.error('Notice 데이터를 불러오는데 실패했습니다:', err);
            setError('Notice 데이터를 불러오는데 실패했습니다.');
        }
    };

    // useEffect를 사용하여 컴포넌트를 부를 때 최신 데이터를 부르는 함수
    useEffect(() => {
        settingNotices();
    }, []);

    // 날짜형식 변환 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    // '글쓰기' 버튼 클릭 시 호출되는 함수: 공지 등록 페이지로 이동
    const handleAddClick = () => {
        navigate('/admin/notices/add'); // 공지 등록 페이지 경로로 이동
    };

    // 제목 클릭 상세페이지 이동 함수
    const handleTitleClick = (id) => {
        console.log("상세 페이지로 이동할 ID:", id);
            //권한을 검증하고 권한에 따라 다른 url로 이동
          if (loginState.member?.memberRole === "ROLE_ADMIN") {
            navigate(`/admin/notices/read/${id}`);
        } else {
            navigate(`/notices/read/${id}`);
        }
    };

    return (
        <div className="container mt-5 mb-10">

            {/* 에러 메시지 표시 */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* 공지사항 목록을 보여주는 테이블 */}
            <Table bordered hover responsive className="text-sm-center">
                <thead className="">
                <tr>
                    {/* 테이블 헤더 */}
                    <th style={{width: '10%', backgroundColor: '#537f91', color: "white"}}>NO</th>
                    <th style={{width: '50%', backgroundColor: '#537f91', color: "white"}}>제목</th>
                    <th style={{width: '20%', backgroundColor: '#537f91', color: "white"}}>작성일</th>
                    <th style={{width: '20%', backgroundColor: '#537f91', color: "white"}}>조회수</th>
                </tr>
                </thead>
                <tbody>
                {getPagination(notices, itemsPerPage, currentPage).length > 0 ? (
                    getPagination(notices, itemsPerPage, currentPage).map((notice) => (
                        <tr key={notice.nboardId} className="table-row" style={{cursor: 'pointer'}}>
                            <td className="align-middle">{notice.nboardId}</td>
                            <td
                                className="d-flex align-items-center"
                                onClick={() => handleTitleClick(notice.nboardId)} // 제목 클릭 시 호출되는 함수
                            >
                                {notice.nboardTitle}
                            </td>
                            <td className="align-middle">{formatDate(notice.nboardDate)}</td>
                            <td className="align-middle">{notice.nboardViews}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center">공지사항이 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </Table>

            {/* 페이지네이션 */}
            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageClick(currentPage - 1)}
                            style={{
                                border: '1px solid #dee2e6',
                                margin: '0 1px',
                                color: '#0d6efd',
                                padding: '6px 12px',
                                borderRadius: '4px'
                            }}
                        >
                            &lt;
                        </button>
                    </li>
                    {[...Array(totalPages).keys()].map((page) => (
                        <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageClick(page + 1)}
                                style={{
                                    border: '1px solid #dee2e6',
                                    margin: '0 1px',
                                    color: currentPage === page + 1 ? 'white' : '#0d6efd',
                                    backgroundColor: currentPage === page + 1 ? '#0d6efd' : 'white',
                                    padding: '6px 12px',
                                    minWidth: '35px',
                                    borderRadius: '4px'
                                }}
                            >
                                {page + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageClick(currentPage + 1)}
                            style={{
                                border: '1px solid #dee2e6',
                                margin: '0 1px',
                                color: '#0d6efd',
                                padding: '6px 12px',
                                borderRadius: '4px'
                            }}
                        >
                            &gt;
                        </button>
                    </li>
                </ul>
            </nav>

            {/*수정페이지 이동버튼 조건부 랜더링 -관리자*/}
            {loginState.member?.memberRole === 'ROLE_ADMIN' && (
                <div className="d-flex justify-content-end mt-3 mb-20">
                    <button
                        onClick={handleAddClick}
                        className="btn btn-success"
                    >
                        공지 쓰기
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListComponent;
