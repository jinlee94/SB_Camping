import axios from "axios";
import jwtAxios from "../util/jwtUtil";

export const API_SERVER_HOST = "http://localhost:8080"

const prefix = `${API_SERVER_HOST}/api/review`

// list
export const getList = async (pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}/list`, {params: {page:page, size:size}})
    return res.data
}

// 검색
export const search = async (type, keyword, pageParam) => {
    const {page, size} = pageParam;

    // 검색할 파라미터 설정
    const params = {
        page: page,
        size: size,
        type: type,
        keyword: keyword
    };

    const res = await axios.get(`${prefix}/search`, {params});

    return res.data
}

// 나의 예약 내역 확인
export const reviewCheck = async (memberId) => {
    const header = {
        headers: {'Content-Type': 'application/json'}
    }
    const res = await axios.post(`${prefix}/reviewCheck`, JSON.stringify(memberId), header);
    return res.data

}

// 게시글 등록
export const postAdd = async (review) => {
    try {
        const res = await jwtAxios.post(`${prefix}/`, review, {
            headers: {
                'Content-Type': 'multipart/form-data' // 파일 업로드 헤더 설정
            }
        });
        console.log(res.data);
        return res.data
    } catch (error) {
        console.log("Error posting")
        throw error;
    }
}

// 게시글 상세
export const getOne = async (reviewId) => {
    const res = await axios.get(`${prefix}/read/${reviewId}`)
    console.log(res.data);
    return res.data
}

// 게시글 삭제
export const deleteOne = async (reviewId) => {
    const res = await jwtAxios.delete(`${prefix}/delete/${reviewId}`)
    return res.data
}

// 게시글 수정
export const PutOne = async (reviewID, review) => {
    const header = {headers: {"Content-Type" : "multipart/form-data"}};
    const res = await jwtAxios.put(`${prefix}/modify/${reviewID}`, review, header)
    return res.data
}
