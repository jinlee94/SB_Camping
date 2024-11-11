import axios from "axios"
import jwtAxios from "../../util/jwtUtil";

// 서버 주소
export const API_SERVER_HOST = 'http://localhost:8080'

const prefix = `${API_SERVER_HOST}/admin/qnas`

// getList : 페이지 처리 및 전체 게시글 목록 가져오기
export const getList = async (pageParam) => {
    const {page,size} = pageParam
    const res = await axios.get(`${prefix}/list`, {params: {page:page, size:size}})
    return res.data
}

// searchBoard : 게시글 검색
export const searchBoard = async (type, keyword, pageParam) => {
    const { page, size } = pageParam;

    // 검색할 파라미터 설정
    const params = {
        page: page,
        size: size,
        type: type,
        keyword: keyword
    };

    // 요청 보내기
    const res = await axios.get(`${prefix}/search`, { params });

    console.log(res.data);
    return res.data;
}

// getOne : 게시글 상세 페이지(read)
export const getOne = async (qbID) => {
    const res = await axios.get(`${prefix}/${qbID}`);
    console.log(res.data);
    return res.data
}

// postAdd : 게시글 등록 (Create)
export const postAdd = async (qna) => {
    try {
        const res = await jwtAxios.post(`${prefix}/`, qna, {
            headers: {
                'Content-Type': 'multipart/form-data' // 파일 업로드를 위한 헤더 설정
            }
        });

        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error("Error posting Q&A:", error);
        throw error; // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있게 합니다.
    }
}

// putOne : 게시글 수정(Modify)
export const putOne = async (qbID, qna) => {
    const header = {headers:{"Content-Type" : "multipart/form-data"}};
    const res = await jwtAxios.put(`${prefix}/mod/${qbID}`, qna, header)
    return res.data;
}

// deleteOne : 게시글 삭제
export const deleteOne = async (qbID) => {
    const res = await jwtAxios.delete(`${prefix}/del/${qbID}`);
    return res.data;
}

// postCommentAdd : 댓글 등록
export const postCommentAdd = async (qbID, qcomment) => {
    const res = await jwtAxios.post(`${prefix}/${qbID}/comments/`, qcomment);

    console.log(res.data);
    return res.data;
}
// 댓글 수정
export const updateComment = async (qcommentID, qcomment, qbID) => {
    const res = await jwtAxios.put(`${prefix}/${qbID}/comments/${qcommentID}`, qcomment);
    return res.data;
};

// 댓글 삭제
export const deleteComment = async (qcommentID, qbID) => {
    const res = await jwtAxios.delete(`${prefix}/${qbID}/comments/${qcommentID}`)
    return res.data;
}

// getCommentList : 해당 게시글의 댓글 목록 가져오기
export const getCommentList = async (qbID) => {
    try {
        const res = await axios.get(`${prefix}/${qbID}/comments/list`);
        const count = res.data ? Object.keys(res.data).length : 0; // 데이터가 있는 경우만 카운트
        return res.data;
    } catch (error) {
        console.error('댓글 리스트 가져오기 중 오류 발생:', error);
        return []; // 오류 발생 시 빈 배열 반환
    }
};