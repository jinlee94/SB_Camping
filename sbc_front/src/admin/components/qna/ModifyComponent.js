import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getOne, putOne } from "../../api/qnaApi";
import defaultImage from "../../../images/default.jpg";
import {prefix} from "../../../api/camperApi";
//현재 로그인중인 유저 정보가져오기
import {useSelector} from "react-redux";





const initState = {
    qBoardTitle: '',
    qBoardContent: '',
    file: null,
    qBoardAttachment: ''
};

function ModifyComponent(props) {
    const { qbID } = useParams();
    const navigate = useNavigate();
    const [qna, setQna] = useState(initState);
    const uploadRef = useRef();
    const [showDeleteButton, setShowDeleteButton] = useState(true); // 버튼 표시 상태
    const [imageLoadError, setImageLoadError] = useState(false);

        //현재 로그인중인 사용자의 정보를 받아오는 변수 매핑으로 치고 들어왔을 때 권한을 검증하여 관리자가 아닌경우 메인페이지로 리다이랙트 하기위해
    const loginState = useSelector((state) => state.loginSlice)


useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await getOne(qbID);
            console.log(data);

            // 데이터 구조 확인 후 상태 설정
            setQna({
                qBoardTitle: data.qboardTitle || '',
                qBoardContent: data.qboardContent || '',
                qBoardAttachment: data.qboardAttachment || null,
                file: null
            });

            // 현재 로그인 중인 유저와 글 작성자의 ID를 비교
            if (data.member?.memberId && loginState.member?.memberId) {
                if (data.member.memberId !== loginState.member.memberId) {
                    navigate('/admin/qnas/list');
                }
            }
        } catch (error) {
            console.error("Failed to fetch qna data:", error);
            navigate('/admin/qnas/list'); // 데이터 가져오기 실패 시에도 리다이렉트
        }
    };
    if (loginState && loginState.member) {
        fetchData();
    }
}, [qbID, loginState]);

    const handleChangeQna = (e) => {
        const { name, value } = e.target;
        setQna(prev => ({
            ...prev,
            [name]: value // 상태 업데이트
        }));
    };

    const handleFileChange = (e) => {
        setQna(prev => ({
            ...prev,
            file: e.target.files[0] // 파일 선택
        }));
    };

    const deleteOldImage = () => {
        setQna(prev => ({
            ...prev,
            qBoardAttachment: null // 첨부 파일 초기화
        }));
        setShowDeleteButton(false); // 버튼 숨기기
    };

    const handleClickModify = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("qBoardTitle", qna.qBoardTitle);
        formData.append("qBoardContent", qna.qBoardContent);

        console.log("사진",qna.qBoardAttachment);
        // 파일 처리
        if (qna.file) {
            formData.append("file", qna.file); // 새로운 파일이 있을 경우 추가
        } else {
            // 현재 첨부 파일 상태 처리
            if (qna.qBoardAttachment === null || qna.qBoardAttachment === '') {
                formData.append("qBoardAttachment", null); // 기존 파일 삭제 시 null로 설정
            } else {
                formData.append("qBoardAttachment", qna.qBoardAttachment); // 기존 첨부 파일 유지
            }
        }

        try {
            await putOne(qbID, formData);
            alert("게시글 수정 완료");
            navigate(`/admin/qnas/read/${qbID}`);
        } catch (error) {
            alert(error.message);
            console.error("Error uploading:", error);
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md border-2 border-gray-400 space-y-4 mb-40">
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">제목</h3>
                    <input
                        name="qBoardTitle"
                        type="text"
                        value={qna.qBoardTitle} // qna의 상태를 직접 사용
                        onChange={handleChangeQna}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">내용</h3>
                    <textarea
                        name="qBoardContent"
                        value={qna.qBoardContent} // qna의 상태를 직접 사용
                        onChange={handleChangeQna}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="5"
                    />
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">이미지 업로드</h3>
                    <input
                        type="file"
                        ref={uploadRef}
                        name="file"
                        onChange={handleFileChange} // 파일 선택 시 호출
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {qna.qBoardAttachment && qna.qBoardAttachment.trim() !== "" && !imageLoadError ? (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">첨부 이미지</h3>
                        {showDeleteButton && (
                            <div>
                                <button type="button" onClick={deleteOldImage}>X</button>
                                <img
                                    src={`${prefix}/view/s_${qna.qBoardAttachment}`}
                                    alt="게시물 첨부 이미지"
                                    className="rounded-lg"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        setImageLoadError(true); // 새로운 상태 변수를 사용하여 이미지 로드 실패를 추적
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ) : null }

                <div className="text-right space-x-2">
                    <button
                        onClick={handleClickModify}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        수정
                    </button>
                </div>
            </div>
        </>
    );
}

export default ModifyComponent;
