import React, { useEffect, useState } from "react";
import { getCommentList, postCommentAdd, updateComment, deleteComment, getCookieMemberId } from "../../api/camperApi";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ConfirmModal from "../../admin/components/util/ConfirmModal";
import {useSelector} from "react-redux";

function CommentComponent() {
    const [serverData, setServerData] = useState([]); // 댓글 목록 상태
    const [commentContent, setCommentContent] = useState(""); // 댓글 입력 상태
    const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
    const [editingCommentContent, setEditingCommentContent] = useState(""); // 수정할 댓글 내용
    const { cBoardId } = useParams(); // URL에서 cBoardId 가져오기

    const loginState = useSelector((state) => state.loginSlice)

    // 댓글 목록 가져오기
    const fetchComments = async () => {
        const data = await getCommentList(cBoardId);
        console.log("가져온 댓글 데이터:", data);
        setServerData(data);
    };

    useEffect(() => {
        fetchComments(); // 컴포넌트가 마운트될 때 댓글 목록 가져오기
    }, [cBoardId]);

    const handleChange = (e) => {
        setCommentContent(e.target.value); // 댓글 내용 상태 업데이트
    };

    // 댓글 등록
    const handleClickAdd = async (e) => {
        e.preventDefault(); // 기본 동작 방지

        const req = {
            boardId: cBoardId,
            cCommentContent: commentContent,
        };

        try {
            const response = await postCommentAdd(req);
            if (response && response.RESULT) {
                console.log("댓글 등록 성공");
                setCommentContent(""); // 입력 필드 초기화
                fetchComments(); // 댓글 목록 갱신
            } else {
                console.error("댓글 등록 실패:", response);
            }
        } catch (error) {
            console.error("오류 발생:", error);
        }
    };

    // 댓글 수정 내용 업데이트
    const handleEditChange = (e) => {
        setEditingCommentContent(e.target.value); // 수정할 댓글 내용 상태 업데이트
    };

    // 댓글 수정 버튼 클릭 시 해당 댓글을 수정 상태로 전환
    const handleClickEdit = (commentId, content) => {
        console.log("--------------수정 데이터 ---------------: ", commentId, content)
        setEditingCommentId(commentId); // 수정할 댓글 ID 설정
        setEditingCommentContent(content); // 수정할 댓글 내용 설정
    };

    // 댓글 수정 제출
    const handleSubmitEdit = async (e, commentId) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("cCommentContent", editingCommentContent);

            const response = await updateComment(commentId, editingCommentContent, cBoardId);
            if (response && response.res == "S") {
                setEditingCommentId(null); // 수정 모드 종료
                setEditingCommentContent("");
                fetchComments(); // 댓글 목록 갱신
            } else {
                if (response.res == "F" && response.code == "403") {
                    alert("작성자만 수정할 수 있습니다.");
                }
            }
        } catch (error) {
            console.error("오류 발생:", error);
        }
    };

    // 삭제하기 버튼 클릭 시 호출되는 함수
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentID, setCurrentID] = useState(null);

    const handleClickDelete = async (commentId) => {
        console.log("-----------------------------", commentId)
        setCurrentID(commentId);
        setModalOpen(true);
    };

    const confirmDelete = async () => {
        if (currentID === null || currentID === undefined) {
            alert("삭제할 댓글 ID가 유효하지 않습니다."); // 오류 메시지
            return;
        }
        try {
            const response = await deleteComment(currentID, cBoardId);
            if (response.res == "F" && response.code == "403") {
                alert("작성자만 수정할 수 있습니다.");
            }
            fetchComments();
        } catch (error) {
            console.log("------------댓글 아이디-------------: " , currentID, cBoardId)
            alert("삭제 실패: " + error.message);
            console.error("삭제 중 오류 발생:", error);
        } finally {
            setModalOpen(false); // 작업 후 모달 닫기
        }
    };

    return (
        <div>
            {/* 댓글 목록 렌더링 */}
            <div>
                {serverData.length > 0 ? (
                    serverData.map((comment) => (
                        <div key={comment.cCommentID} className="text-gray-700 py-2 relative">
                            <div className="flex items-center mb-0.5">
                                {comment.member.memberRole === "ROLE_ADMIN" ? (
                                    <div className="flex items-center space-x-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"/>
                                        </svg>
                                        <span className="font-bold text-lg">관리자</span>
                                    </div>
                                ) : (
                                    <p className="font-bold text-lg">{comment.member.memberName}</p>
                                )}
                            </div>

                            {editingCommentId === comment.cCommentID ? (
                                <form onSubmit={(e) => handleSubmitEdit(e, comment.cCommentID)}>
                                    <input
                                        type="text"
                                        value={editingCommentContent}
                                        onChange={handleEditChange}
                                        className="w-full p-1.5 border rounded text-base"
                                    />
                                    <div className="flex justify-end mt-1 space-x-2">
                                        <button type="submit"
                                                className="px-2 py-0.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-700">
                                            수정 완료
                                        </button>
                                        <button type="button"
                                                className="px-2 py-0.5 bg-red-500 text-white rounded text-sm hover:bg-red-700"
                                                onClick={() => setEditingCommentId(null)}>
                                            취소
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <p className="text-base mb-1">{comment.cCommentContent}</p>
                                    <div className="flex items-center">
                                    <span className="text-sm text-gray-500">
                                        {new Date(comment.cCommentDate).toLocaleString('ko-KR', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        })}
                                    </span>
                                        <div className="ml-auto space-x-2">
                                            {(
                                                loginState.member.memberRole === "ROLE_ADMIN" ||
                                                (loginState.member.memberId === comment.member.memberID) // 관리자인 경우 자신이 쓴 댓글
                                            ) && (
                                                <>
                                                    <button
                                                        onClick={() => handleClickEdit(comment.cCommentID, comment.cCommentContent)}
                                                        className="px-2 py-0.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-700">
                                                        수정
                                                    </button>
                                                </>
                                            )}
                                            {(
                                                loginState.member.memberRole === "ROLE_ADMIN" || // 관리자인 경우
                                                loginState.member.memberId === comment.member.memberID // 또는 댓글 작성자일 경우
                                            ) && (
                                                <button
                                                    onClick={() => handleClickDelete(comment.cCommentID)}
                                                    className="px-2 py-0.5 bg-red-500 text-white rounded text-sm hover:bg-red-700">
                                                    삭제
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            <hr className="mt-2 mb-1"/>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-base">댓글이 없습니다.</p>
                )}
            </div>

            {/* 댓글 입력 폼 */}
            <div className="border rounded-lg bg-white p-3 mt-4">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={commentContent}
                            onChange={handleChange}
                            placeholder="댓글을 남겨보세요"
                            className="w-full outline-none text-base placeholder-gray-400"
                            required
                        />
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Button
                            onClick={handleClickAdd}
                            className="ml-2 px-4 py-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            댓글 등록
                        </Button>
                    </div>
                </div>
            </div>

            {/* 모달 */}
            <ConfirmModal
                isOpen={isModalOpen}
                onRequestClose={() => setModalOpen(false)}
                onConfirm={confirmDelete}
                title="삭제 확인"
                message="정말 삭제하시겠습니까?"
            />
        </div>
    );
}

export default CommentComponent;
