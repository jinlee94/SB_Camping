import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOneNotice, updateNotice } from '../../api/NoticeApi';
import {useSelector} from "react-redux"; // 공지사항 조회 및 업데이트 API 함수 가져오기

const UpdateComponent = () => {
    const { nid } = useParams(); // URL에서 공지사항 ID(nid)를 가져옴
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    // 상태 관리: 공지사항 제목,내용  , 에러메세지
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(''); // 오류 메시지 상태 관리`


    //현재 로그인중인 사용자의 정보를 받아오는 변수 매핑으로 치고 들어왔을 때 권한을 검증하여 관리자가 아닌경우 메인페이지로 리다이랙트 하기위해
    const loginState = useSelector((state) => state.loginSlice)


    useEffect(() => {
        // 현재 로그인한.유저의?.권한이 !== 관리자
        // 경우 '/'(기본 메인)경로로
        console.log('isAuthenticated 상태:', loginState.isAuthenticated);
        console.log('로그인 상태:', loginState);

        if (loginState.member?.memberRole !== 'ROLE_ADMIN') {
            navigate('/'); // 이동 할 경로
        }
    }, [loginState, navigate]);

    useEffect(() => {
        const fetchNoticeData = async () => {
            try {
                // API 호출을 통해 nid에 해당하는 공지사항 데이터를 가져옴
                const noticeData = await getOneNotice(nid);
                setTitle(noticeData.nboardTitle);
                setContent(noticeData.nboardContent);
            } catch (error) {
                console.error('공지사항 데이터를 불러오는데 실패했습니다:', error);
            }
        };
        // 호출을 누락하지 말고 여기에 추가해야 함
        if (nid) {
            fetchNoticeData();
        }
    }, [nid]);


    // 폼 제출 핸들러
    const handleNoticeUpdate = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        try {
            //수정된 데이터 처리로직
            console.log(`공지사항 업데이트 시작 (ID: ${nid})`);
            //새 입력값
            const updateData = {
                nboardTitle: title,
                nboardContent: content,};
            console.log("전송 데이터:", updateData);
            await updateNotice(nid, updateData); // 업데이트 API 호출
            console.log('수정된 공지사항:', { nid, title, content });
            // 수정 완료 후 공지사항 목록 페이지로 이동
            navigate('/admin/notices/list');
        } catch (error) {
            console.error('공지사항 수정 중 오류가 발생했습니다 UpdateComponent-handleNoticeUpdate:', error);
            setError('공지사항 수정 중 오류가 발생했습니다.');
        }
    };


    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md border-2 border-gray-400 mb-40">
            <h2 className="text-2xl font-bold mb-4">공지사항 수정</h2>
            <form onSubmit={handleNoticeUpdate} className="space-y-4">
                <div>
                    <label className="block text-gray-700">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={title}
                        required
                        maxLength={50}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="5"
                        placeholder={content}
                        required
                        maxLength={1000}
                    />
                </div>
                <div className="text-right">
                    <button
                        type="submit"/*submit으로 함수처리*/
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                        수정 완료
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateComponent;
