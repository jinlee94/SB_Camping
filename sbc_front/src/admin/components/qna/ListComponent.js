import React, { useEffect, useState } from 'react';
import { getCommentList, getList, searchBoard } from '../../api/qnaApi';
import BootstrapPagination from "../util/BootstrapPagination";
import BoardSearchComponent from "../util/BoardSearchComponent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useCustomMove from '../../../hooks/useCustomMove';
import fileImage from "../../../images/fileAttatchment.png";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import useCustomLogin from "../../../hooks/useCustomLogin";

const initState = {
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0
};

function ListComponent(props) {
    const { page, size } = useCustomMove();
    const [currentPage, setCurrentPage] = useState(page); // 현재 페이지 상태
    const [serverData, setServerData] = useState(initState);
    const [commentCounts, setCommentCounts] = useState({});
    const [searchParams, setSearchParams] = useState({ type: 'name', keyword: '' });
    const navigate = useNavigate();
    const loginState = useSelector((state) => state.loginSlice);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // 로그인 여부 확인
    const {isLogin, moveToLoginReturn} = useCustomLogin()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = searchParams.keyword
                    ? await searchBoard(searchParams.type, searchParams.keyword, { page: currentPage, size })
                    : await getList({ page: currentPage, size });

                setServerData(data);

                const commentCounts = await Promise.all(
                    data.dtoList.map(async (qb) => {
                        const commentsData = await getCommentList(qb.qboardID);
                        return { qbID: qb.qboardID, count: commentsData.length || 0 };
                    })
                );

                const countsMap = commentCounts.reduce((acc, { qbID, count }) => {
                    acc[qbID] = count;
                    return acc;
                }, {});
                setCommentCounts(countsMap);
            } catch (error) {
                console.error('API 호출 중 오류 발생:', error);
                setError('데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentPage, size, searchParams]); // currentPage를 의존성으로 추가

    const totalPages = serverData.totalPage;

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage); // 현재 페이지를 업데이트
    };

    const handleSearch = (type, keyword) => {
        setSearchParams({ type, keyword });
        setCurrentPage(1); // 검색 시 페이지를 1로 초기화
    };

    const handleAddClick = () => {
        if (!isLogin) {
            alert("로그인을 하시고 이용해주세요")
            navigate("/login")
            return;
        }

        if (loginState.member?.memberRole === "ROLE_ADMIN") {
            navigate('/admin/qnas/add');
        } else {
            navigate("/qna/add");
        }
    };

    const handleReadClick = (qbID) => {
        if (loginState.member?.memberRole === "ROLE_ADMIN") {
            navigate(`/admin/qnas/read/${qbID}`);
        } else {
            navigate(`/qna/read/${qbID}`);
        }
    };

    const formatDate = (date) => {
        if (!date) return "";
        const yyyy = date.getFullYear();
        const MM = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${MM}-${dd}`;
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">

            {/* 에러 메시지 표시 */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* 검색 컴포넌트 */}
            <div className="d-flex align-items-center">
                <BoardSearchComponent onSearch={handleSearch} />
            </div>

            {/* Q&A 목록을 보여주는 테이블 */}
            <Table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        {/* "번호" 열 중앙 정렬 */}
                        <th scope="col" className="text-center" style={{ width: '10%', backgroundColor:'#537f91', color:"white" }}>NO</th>
                        {/* "제목" 열 왼쪽 정렬 */}
                        <th scope="col" className="text-center" style={{ width: '40%', backgroundColor:'#537f91', color:"white" }}>제목</th>
                        {/* 나머지 열 중앙 정렬 */}
                        <th scope="col" className="text-center" style={{ width: '15%', backgroundColor:'#537f91', color:"white" }}>작성자</th>
                        <th scope="col" className="text-center" style={{ width: '15%', backgroundColor:'#537f91', color:"white" }}>작성일</th>
                        <th scope="col" className="text-center" style={{ width: '10%', backgroundColor:'#537f91', color:"white" }}>조회수</th>
                        <th scope="col" className="text-center" style={{ width: '10%', backgroundColor:'#537f91', color:"white"  }}>답변상태</th>
                    </tr>
                </thead>
                <tbody>
                    {serverData.dtoList && serverData.dtoList.length > 0 ? (
                        serverData.dtoList.map(qb => (
                            <tr key={qb.qboardID} className="table-row" style={{ cursor: 'pointer' }}>
                                {/* "번호" 열 중앙 정렬 또는 공지 배지 */}
                                {qb.member.memberRole === "ROLE_ADMIN" ? (
                                    <td className="align-middle text-center">
                                        <span className="badge me-2"
                                              style={{
                                                  display: "inline-block",
                                                  backgroundColor: "orangered",
                                                  color: "white"
                                              }}>공지</span>
                                    </td>
                                ) : (
                                    <td className="align-middle text-center">{qb.qboardID}</td>
                                )}
                                {/* "제목" 열 왼쪽 정렬 */}
                                <td
                                    onClick={() => handleReadClick(qb.qboardID)}
                                    style={{ color: 'inherit' }}// 제목 클릭 시 호출되는 함수
                                >
                                    <div className="d-flex align-items-center">
                                        {qb.qboardTitle}
                                        {qb.qboardAttachment && qb.qboardAttachment !== 'null' ? (
                                            <img
                                                src={fileImage}
                                                alt="첨부 이미지"
                                                className="ms-2"
                                                style={{
                                                    width: '1em', // 글자 크기에 맞춰 조정
                                                    height: '1em', // 글자 크기에 맞춰 조정
                                                }}
                                            />
                                        ): null}
                                        {commentCounts[qb.qboardID] > 0 && (
                                            <span className="text-red-500 ms-2">
                                                [{commentCounts[qb.qboardID]}]
                                            </span>
                                        )}
                                    </div>
                                </td>
                                {/* 나머지 열 중앙 정렬 */}
                                <td className="align-middle text-center">{qb.member.memberName}</td>
                                <td className="align-middle text-center">{formatDate(new Date(qb.qboardDate))}</td>
                                <td className="align-middle text-center">{qb.qboardViews}</td>
                                <td className="align-middle text-center">
                                    {qb.member.memberRole === "ROLE_ADMIN" ? '' :
                                        qb.qboardAsked.trim().toUpperCase() === "Y" ? "답변 완료" : "미답변"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">Q&A 게시물이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* 페이지네이션을 중앙 정렬하기 위해 div로 감싸기 */}
            <div className="d-flex justify-content-center my-4"> {/* my-4로 상하 여백 추가 */}
                <BootstrapPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* 글쓰기 버튼 */}
            <div className="d-flex justify-content-end mt-3 mb-5"> {/* mb-4 유지 */}
                <Button
                    onClick={handleAddClick}
                    className="btn btn-success"
                >
                    글쓰기
                </Button>
            </div>
        </div>
    );
}

export default ListComponent;
