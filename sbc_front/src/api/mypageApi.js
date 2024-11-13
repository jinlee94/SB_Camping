import axios from "axios";
import jwtAxios from "../util/jwtUtil";

const API_SERVER_HOST = 'http://localhost:8080';
const host = `${API_SERVER_HOST}/api/members`

// 예약 내역 (전체) 가져오기
export const getReservations = async (memberId) => {
    const header = {
        headers:{'Content-Type': 'application/json'}
    }
    const res = await jwtAxios.post(`${host}/reslist`, JSON.stringify(memberId), header);
    return res.data;
}

// 예약 내역 (상세) 가져오기
export const getResDetail = async (resId) => {
    const res = await jwtAxios.get(`${host}/res/${resId}`);
    return res.data;
}

// 예약번호로 리뷰번호 가져오기
export const getReviewNo = async (resId) => {
    const res = await jwtAxios.get(`${host}/review/${resId}`);
    return res.data;
}

// 예약 취소 (상태를 예약완료 -> 예약취소로 변경)
export const cancelRes = async (resID, reason) => {
    //console.log('예약 취소 사유 확인 :', reason, 'id : ', resId)
    const header = {
        headers:{'Content-Type': 'application/json'}
    }
    const res = await jwtAxios.put(`${host}/cancel/${resID}`, {reason}, header);
}

// 회원정보 수정 1 - 비밀번호 인증
export const authPw = async (member) => {
    //console.log('back 보내기 전 member : ',member)
    const header = {
        headers:{'Content-Type': 'application/json'}
    }
    const res = await jwtAxios.post(`${host}/verify`, member, header);
    //console.log('pw인증 결과 : ', res);
    return res.data;
}

// 회원정보 조회
export const getMember = async (memberId) => {
    const res = await jwtAxios.get(`${host}/${memberId}`);
    //console.log(res);
    return res.data;
}

// 회원정보 수정 2 - 회원 정보 수정
export const modifyMember = async (member) => {
    //console.log('mypageApi modifyMember :', member)
    const header = {
        headers:{'Content-Type': 'application/json'}
    }
    const memberId = member.memberID;
    const res = await jwtAxios.put(`${host}/${memberId}`, JSON.stringify(member), header);
    //console.log('결과 : ', res);
    return res.data;
}

// 회원 탈퇴
export const withdraw = async (member) => {
    const header = {
        headers:{'Content-Type': 'application/json'}
    }
    const res = await jwtAxios.post(`${host}/withdraw`, member, header);
    //console.log('탈퇴 결과 : ', res);
    return res;
}