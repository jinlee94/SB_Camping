import axios from "axios"
import jwtAxios from "../../util/jwtUtil";

// 서버 주소
export const API_SERVER_HOST = 'http://localhost:8080'

const prefix = `${API_SERVER_HOST}/admin/member`

// 전체회원리스트 불러오기 : getList
export const getFullList = async (pageParam) => {
    const {page,size} = pageParam
    const res = await jwtAxios.get(`${prefix}/totalList`, {params: {page:page, size:size}})

    console.log(res.data)

    return res.data
}

// 휴면회원리스트 불러오기 : getInactiveList
export const getInactiveList = async (pageParam) => {
    const {page, size} = pageParam
    const res = await jwtAxios.get(`${prefix}/inactiveList`, {params: {page: page, size: size}})

    console.log(res.data)

    return res.data
}

// 검색 : searchMember
export const searchMember = async (type, keyword, pageParam) => {
        const { page, size } = pageParam;

        // 검색할 파라미터 설정
        const params = {
            page: page,
            size: size,
            type: type,
            keyword: keyword
        };

        // 요청 보내기
        const res = await jwtAxios.get(`${prefix}/search`, { params });

        console.log(res.data);
        return res.data;
    }
