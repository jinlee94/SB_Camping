// src/admin/components/notice/AddComponent.js

import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // 현재 로그인 한 사용자의 권한 검증을 위해
import {createNotice} from "../../api/NoticeApi"; // API 모듈에서 함수 가져오기 -공지사항 생성 함수

const AddComponent = () => {
    // Redux 스토어에서 loginSlice 접근
    const loginState = useSelector((state) => state.loginSlice);
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    // 상태 관리: 공지사항 제목과 내용
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 공지글 작성시 실패문구를 저장
    const [error, setError] = useState('');

    useEffect(() => {
        // 사용자가 인증되지 않았거나 || 현재 로그인한.유저의?.권한이 !== 관리자
        // 경우 '/'(기본 메인)경로로
        if (loginState.member?.memberRole !== 'ROLE_ADMIN') {
            navigate('/'); // 기본경로로 이동시킴
        }
    }, [loginState, navigate]);

// 공지사항을 추가하는 함수
const addNotice = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // 서버에 POST 요청을 보내는 함수 호출
    createNotice({ nboardTitle: title, nboardContent: content })
        .then(result => {
            console.log("서버 응답:", result); // 서버 응답을 콘솔에 출력
            navigate('/admin/notices/list'); // 공지사항 추가 완료 후 목록 페이지로 이동
        })
        .catch(e => {
            console.error("API 호출 오류:", e);
            setError('공지글을 작성하는데 실패했습니다. 다시 시도해 주세요.'); // 오류 메시지 설정하여 사용자에게 알림
        });
};



    // 목록으로 버튼 클릭 핸들러
    const handleBackToList = () => {
        navigate('/admin/notices/list');
    };
    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md border-2 border-gray-400 mb-40">
            <h2 className="text-2xl font-bold mb-4">공지사항 추가</h2>
            <form onSubmit={addNotice} className="space-y-4">
                <div>
                    <label className="block text-gray-700">공지 제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="공지사항 제목을 입력하세요"
                        required
                        maxLength={50}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">공지 내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="5"
                        placeholder="공지사항 내용을 입력하세요"
                        required
                        maxLength={1000}
                    />
                </div>
                <div className="text-right space-x-2">
                    <button
                        type="button"
                        onClick={handleBackToList}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
                        목록으로
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddComponent;
