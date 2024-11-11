import React, { useState, useEffect } from "react";
import { postAdd } from "../../api/camperApi"; // 회원 정보를 가져오는 API 제거
import useCustomMove from "../../hooks/useCustomMove";
import {useSelector} from "react-redux";

const AddComponent = () => {
    const loginState = useSelector((state) => state.loginSlice)

    // 초기 상태 설정
    const initState = {
        member: {
            memberId: loginState.member.memberId
        },
        cBoardCategory: '',
        cBoardTitle: '',
        cBoardContent: '',
        file: null
    }

    const [cboard, setCboard] = useState({ ...initState });


    const { moveToList } = useCustomMove();

    // 파일 첨부하면 저장하는 메소드
    const handleFileChange = (e) => {
        const fileParam = e.target.files[0]; // 선택한 파일 하나만 가져옴
        if (fileParam) {
            setCboard((prev) => ({
                ...prev,
                file: fileParam // 단일 파일 업데이트
            }));
        }
    };

    // input 입력시 저장 메소드
    const handleChangeTodo = (e) => {
        const { name, value } = e.target;
        setCboard((prev) => ({ ...prev, [name]: value }));
    };

    // 등록 버튼 눌렀을 때 메소드
    const handleClickAdd = async () => {

        // 필드 검증
        if (!cboard.cBoardCategory.trim()) {
            alert("카테고리를 선택하세요.");
            return;
        }
        if (!cboard.cBoardTitle.trim()) {
            alert("제목을 입력하세요.");
            return;
        }
        if (!cboard.cBoardContent.trim()) {
            alert("내용을 입력하세요.");
            return;
        }

        const formData = new FormData();
        formData.append("cBoardTitle", cboard.cBoardTitle);
        formData.append("cBoardCategory", cboard.cBoardCategory);
        formData.append("cBoardContent", cboard.cBoardContent);
        formData.append("member", cboard.member.memberId); // 객체로 변환해서 전송
        if(cboard.file != null){
            formData.append("file", cboard.file);
        }

        console.log('보내기 전 데이터 : ', formData);

        await postAdd(formData)
            .then(result => {
                setCboard({...initState})
                console.log("등록 서버 응답:", result);
                moveToList(); // 등록 완료 후 campers/list 페이지로 이동
            })
            .catch(e => {
                console.error("API 호출 오류:", e);
            });
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md border-2 border-gray-400 space-y-4 mb-40">
            <div className="space-y-4">
                <div className="mb-8 flex items-center">
                    <h3 className="text-lg font-semibold mr-5" style={{marginBottom: 0}}>카테고리</h3>
                    <div>
                        <select
                            className="form-select"
                            name="cBoardCategory"
                            value={cboard.cBoardCategory}
                            onChange={handleChangeTodo}
                            style={{
                                width: 'auto',
                                minWidth: '160px', // 카테고리를 선택하세요 텍스트 길이에 맞춤
                                padding: '0.375rem 2.25rem 0.375rem 0.75rem' // 기본 패딩 유지
                            }}
                        >
                            <option>카테고리를 선택하세요</option>
                            <option value="잡담">잡담</option>
                            <option value="정보">정보</option>
                        </select>
                    </div>
                </div>

                {/* 제목, 첨부파일, 내용 등 추가 필드 */}
                {/* 제목 */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">제목</h3>
                    <input
                        name="cBoardTitle"
                        type="text"
                        value={cboard.cBoardTitle}
                        onChange={handleChangeTodo}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="제목을 입력하세요"
                        required
                    />
                </div>

                {/* 내용 */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">내용</h3>
                    <textarea
                        name="cBoardContent"
                        value={cboard.cBoardContent}
                        onChange={handleChangeTodo}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="5"
                        placeholder="내용을 입력하세요"
                        required
                    />
                </div>

                {/* 첨부파일 */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">이미지 업로드</h3>
                    <input
                        type="file"
                        name="cBoardAttachment"
                        onChange={handleFileChange}
                        className="form-control w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

            </div>

            <div className="text-right space-x-2">
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={handleClickAdd}
                >
                    등록
                </button>
            </div>
        </div>
    );
};

export default AddComponent;
