import React, { useState, useEffect } from "react";
import {getOne, prefix, putOne} from "../../api/camperApi";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const ModifyComponent = ({ cBoardId }) => {
    const initState = {
        cBoardId: '',
        member: {
            memberID: '',
        },
        cBoardCategory: '',
        cBoardTitle: '',
        cBoardContent: '',
        cBoardViews: 0,
        cBoardAttachment: '', // 단일 첨부파일로 수정
        file: null
    };

    const [cboard, setCboard] = useState({...initState});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [imageLoadError, setImageLoadError] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(true);
    //현재 로그인중인 사용자의 정보를 받아오는 변수 매핑으로 치고 들어왔을 때 권한을 검증하여 관리자가 아닌경우 메인페이지로 리다이랙트 하기위해


    useEffect(() => {
        getOne(cBoardId).then((data) => {
            if (data) {
                // 여기서 반환된 데이터의 구조에 맞게 상태를 설정
                setCboard({
                    ...initState,
                    cBoardId: data.cboardID, // cboardId 추가
                    member: data.member, // 작성자 정보
                    cBoardCategory: data.cboardCategory,
                    cBoardTitle: data.cboardTitle,
                    cBoardContent: data.cboardContent,
                    cBoardViews: data.cboardViews,
                    cBoardAttachment: data.cboardAttachment, // 단일 첨부파일
                    file: null
                });
                console.log('-------------------------', data);
            } else {
                console.log("데이터가 없습니다.");
            }
        });
    }, [cBoardId]);

    const handleClickModify = async () => {
        try {
            const formData = new FormData();
            formData.append("cBoardID", cboard.cBoardId);
            formData.append("member", cboard.member.memberID);
            formData.append("cBoardCategory", cboard.cBoardCategory);
            formData.append("cBoardTitle", cboard.cBoardTitle);
            formData.append("cBoardContent", cboard.cBoardContent);
            formData.append("cBoardViews", cboard.cBoardViews);

            // 파일 처리
            if (cboard.file) {
                formData.append("file", cboard.file)
            } else {
                if (cboard.cBoardAttachment === null || cboard.cBoardAttachment === '' || cboard.file === null) {
                    formData.append("cBoardAttachment", null)
                } else {
                    formData.append("cBoardAttachment", cboard.cBoardAttachment)
                }
            }

            // 수정데이터 확인
            console.log('cboardId:', formData.get('cBoardId'), 'memberId:', formData.get("member"), 'views:', formData.get("cBoardViews"));

            // API 요청
            const response = await putOne(cBoardId, formData);
            if (response.res == "F" && response.code == "403") {
                alert("작성자만 수정할 수 있습니다.");
                return;
            }

            console.log('수정 성공:', response);
            navigate(-1);
        } catch (error) {
            // 오류 처리 개선
            if (error.response) {
                console.error('수정 중 오류 발생:', error.response.data);
                setError(`수정 중 오류가 발생했습니다: ${error.response.data.message}`);
            } else {
                console.error('수정 중 오류 발생:', error.message);
                setError('수정 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    const handleClickCancel = () => {
        navigate(`/campers/read/${cBoardId}`);
    };

    const handleChangeCboard = (e) => {
        const { name, value } = e.target;
        setCboard((prevCboard) => ({ ...prevCboard, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // 첫 번째 파일만 가져옴
        setCboard((prevCboard) => ({ ...prevCboard, file: file })); // 단일 파일 업데이트
    };

    const deleteOldImage = () => {
        setCboard((prevCboard) => ({ ...prevCboard, file: null }));
        setShowDeleteButton(false)
        console.log("deleteOldImage");
        console.log(cboard.cBoardAttachment)
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md border-2 border-gray-400 space-y-4 mb-40y">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="space-y-4">

                <div className="mb-8 flex items-center">
                    <h3 className="text-lg font-semibold mr-5" style={{marginBottom: 0}}>카테고리</h3>
                    <div>
                        <select
                            className="form-select"
                            name="cBoardCategory"
                            value={cboard.cBoardCategory}
                            onChange={handleChangeCboard}
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

                {/* 제목 */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">제목</h3>
                    <input
                        name="cBoardTitle"
                        type="text"
                        value={cboard.cBoardTitle}
                        onChange={handleChangeCboard}
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
                        onChange={handleChangeCboard}
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

                {cboard.cBoardAttachment && cboard.cBoardAttachment.trim() !== "" && !imageLoadError ? (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">첨부 이미지</h3>
                        {showDeleteButton && (
                            <div>
                                <button type="button" onClick={deleteOldImage}>X</button>
                                <img
                                    src={`${prefix}/view/s_${cboard.cBoardAttachment}`}
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
                ) : null}

            <div className="text-right space-x-2">
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={handleClickModify}
                >
                    수정
                </button>
                <button
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                    onClick={handleClickCancel}
                >
                    취소
                </button>
            </div>
        </div>
        </div>
    );
};

export default ModifyComponent;