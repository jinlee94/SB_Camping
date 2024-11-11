import axios from "axios";
import jwtAxios from "../../util/jwtUtil";


/* 공지사항 관리 모듈의 API */


// 백엔드의 기본 경로를 상수로 할당
const backUrl = "http://localhost:8080"; // 백엔드 기본경로 변수에 할당

// 백엔드 경로와 매핑명을 합쳐서
export const noticeHost = `${backUrl}/admin/notices`;

// axiosGuest 인스턴스를 생성하는 올바른 방식
const axiosGuest = axios.create({
    baseURL: noticeHost,
    timeout: 10000
});


//유틸에 값 할당
const transroot =()=>{
    jwtAxios.defaults.baseURL = noticeHost; //문자열로 재할당
    jwtAxios.defaults.timeout = 10000; //10초제한
    return jwtAxios
}

//방문자용

// 기본 axiosinstance에 tansroot한 jwtaxios를 할당
const axiosInstance = transroot();

// 모든 공지사항 데이터를 가져오는 함수
    export const getAllNotices = async () => {
    try {
        const response = await axiosGuest.get('/list'); // 모든 공지사항 데이터를 GET 방식으로 요청해 가져옴
        console.log(response.data);  //디버깅용임 데이터가 왜 안넘어와
        // 필요한 경우 데이터 가공이나 필터링을 여기서 수행
        return response.data; // 모든 공지사항 데이터 반환
    } catch (error) {
        console.error("모든 공지사항 데이터를 가져오는 중 오류 발생, getAllNotices 함수:", error);
        throw error; // 오류를 호출한 쪽으로 전달
    }
};

// 특정 ID의 공지사항 데이터를 가져오는 함수
export const getOneNotice = async (id) => {
    try {
        //axios에서 제공하는 axiosInstance를 이용하여 get방식으로 ${id}로 받아온 정보를 response의 데이터에 할당
        const response = await axiosGuest.get(`/read/${id}`); // 특정 ID의 공지사항 데이터를 GET 방식으로 요청
        const {
            nboardId,
            nboardTitle,
            nboardContent,
            nboardDate,
            nboardViews,
        } = response.data;

        return {
            nboardId,
            nboardTitle,
            nboardContent,
            nboardDate,
            nboardViews,
        };
    } catch (error) {
        console.error("공지사항 데이터를 가져오는 중 오류 발생, getNoticeById 함수:", error);
        throw error; // 오류를 호출한 쪽으로 전달
    }
};


// 공지사항 데이터를 생성하는 함수
export const createNotice = async (noticeData) => {
    try {
        await axiosInstance.post('/add', noticeData); // 공지사항 데이터를 axiosInstance를 이용해 POST 방식으로 생성
        console.log("공지사항 생성 성공:", noticeData);
    } catch (error) {
        console.error("공지사항 생성 중 오류 발생, createNotice 함수:", error);
        throw error; // 오류를 호출한 쪽으로 전달
    }
};

// 특정 ID의 공지사항 데이터를 업데이트하는 함수
export const updateNotice = async (id, updateData) => {
    try {
        await axiosInstance.put(`/update/${id}`, updateData); // 특정 ID의 공지사항 데이터를 axiosInstance를 이용해 PUT 방식으로 업데이트
        console.log(`공지사항 ID ${id} 업데이트 성공:`, updateData);
    } catch (error) {
        console.error(`공지사항 업데이트 중 오류 발생, updateNotice 함수 (ID: ${id}):`, error);
        throw error; // 오류를 호출한 쪽으로 전달
    }
};

// 특정 ID의 공지사항 데이터를 삭제하는 함수
export const deleteNotice = async (id) => {
    try {
        await axiosInstance.delete(`/delete/${id}`); // 특정 ID의 공지사항 데이터를 axiosInstance를 이용해 DELETE 방식으로 삭제
        console.log(`공지사항 ID ${id} 삭제 성공`);
    } catch (error) {
        console.error(`공지사항 삭제 중 오류 발생, deleteNotice 함수 (ID: ${id}):`, error);
        throw error; // 오류를 호출한 쪽으로 전달
    }
};
