// src/admin/components/notice/ReadComponent.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
// 공지사항 전체 조회 API 함수 가져오기
import { getOneNotice,deleteNotice } from '../../api/NoticeApi';
import {useSelector} from "react-redux";    //로그인정보 가져오기



const ReadComponent = () => {
    const { nid } = useParams(); // URL에서 공지사항 ID를 가져옴
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    // 상태 관리: 공지사항 제목, 내용, 작성 시간, 조회수
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [createdAt, setCreatedAt] = useState(null); // 작성 시간
    const [views, setViews] = useState(0); // 조회수
    const [error, setError] = useState(''); // 오류 메시지 상태 관리

    //현재 로그인중인 사용자의 정보를 받아오는 변수
    const loginState = useSelector((state) => state.loginSlice)

    // 날짜형식 변환 함수  이걸로 날짜를 감싸주면 형변환 됨
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}년 ${mm}월 ${dd}일`;
    };

// 공지사항 데이터를 가져오는 함수
    const getNotice = async (id) => {
        try {
            // 특정 ID의 공지사항 데이터를 가져오기
            const notice = await getOneNotice(id);
            if (notice) {
                setTitle(notice.nboardTitle);
                setContent(notice.nboardContent);
                setCreatedAt(notice.nboardDate);
                setViews(notice.nboardViews);
            } else {
                setError('해당 공지글을 찾을 수 없습니다.');
            }
        } catch (e) {
            console.error('공지글을 불러오는데 실패했습니다:', e);
            setError('공지글을 불러오는데 실패했습니다. 다시 시도해 주세요.');
        }
    };


    // 컴포넌트가 마운트될 때 공지사항 데이터를 가져옴
    useEffect(() => {
        if (nid) {
            getNotice(nid);
        }
    }, [nid]);

    // 수정하기 버튼 클릭 시 호출되는 함수
    const handleUpdateClick = () => {
        navigate(`/admin/notices/update/${nid}`); // 수정 페이지로 이동
    };

    //pk로 로우를 삭제하는 함수
    const handleDeleteClick = async (nid) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {   //삭제전에 창을 띄워 오클릭을 방지함
            try {
                //비동기식으로 삭제로직 처리
                await deleteNotice(nid);
                //삭제처리 디버깅
                console.log(`${nid}번 공지사항이 삭제되었습니다.`);
                //삭제 후 공지글 목록으로 돌아가게
                navigate('/admin/notices/list');
            } catch (error) {
                console.error(`공지사항 삭제 중 오류 발생 ReadComponent-handelDeleteClick함수: ${error}`);
            }
        }
    };


    // 목록으로 돌아가기 버튼 클릭 시 호출되는 함수
    const handleBackToListClick = () => {
        //권한을 검증하여 권한에 따라 다른경로로 라우팅
         if (loginState.member?.memberRole === "ROLE_ADMIN") {
            navigate('/admin/notices/list');
        } else {
            navigate('/notices/list');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md border-2 border-gray-400 mb-40">
            {error && <p className="text-red-500 mb-4">{error}</p>} {/* 오류 메시지 출력 */}
            {/* 제목 및 작성 시간 */}
            <div className="flex justify-between items-center mb-8"> {/* 간격을 더 주기 위해 mb-8 적용 */}
                <h2 className="text-2xl font-bold">#{nid} 공지사항</h2> {/* 글 번호 표시 */}
                <div>
                    <p className="text-gray-500 mb-1">작성 시간: {formatDate(createdAt)}</p>
                    <p className="text-gray-500">조회수: {views}</p> {/* 조회수 표시 */}
                </div>
            </div>

            {/* 공지사항 제목 영역 */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">제목</h2> {/* '제목' 텍스트 추가 */}
                <hr/>
                <p className="text-xl font-bold">{title}</p>
                <hr/>
            </div>

            {/* 공지사항 내용 표시 영역 */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">공지 내용</h2> {/* '공지 내용' 텍스트 추가 */}
                <p className="text-gray-700 bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">{content}</p>
            </div>

            {/* 목록으로 돌아가기, 수정하기, 삭제하기 버튼 */}
            <div className="text-right space-x-2">
                <button
                    onClick={handleBackToListClick}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
                    목록으로
                </button>

                {/* 글 수정 버튼 - 관리자 권한일 때만 표시 */}
                {loginState.member?.memberRole === 'ROLE_ADMIN' && (
                    <button
                        onClick={() => handleUpdateClick(nid)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        수정하기
                    </button>
                )}


                {/* 글 삭제 버튼 - 관리자 권한일 때만 표시 */}
                {loginState.member?.memberRole === 'ROLE_ADMIN' && (
                    <button
                        onClick={() => handleDeleteClick(nid)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                    >
                        삭제하기
                    </button>
                )}


            </div>
        </div>
    );
};

export default ReadComponent;