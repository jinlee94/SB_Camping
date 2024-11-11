
import jwtAxios from "../../util/jwtUtil";
/*백엔드와 통신하기위해 import*/

//구역관리 모듈의 기늘을 모아둔 APi

//백엔드의 경로를 상수로 할당
const backUrl= "http://localhost:8080";   //백엔드 기본경로 변수에 할당

//백엔드 경로와 매핑명을 합쳐서
export const siteHost = `${backUrl}/admin/site`

//유틸에 값 할당
const transroot =()=>{
    jwtAxios.defaults.baseURL = siteHost; //문자열로 재할당
    jwtAxios.defaults.timeout = 10000; //10초제한
    return jwtAxios
}



// 기본 axiosinstance에 tansroot한 jwtaxios를 할당
const axiosInstance = transroot();
// 모든 사이트 데이터를 가져오는 함수
export const getAllSites = async () => {
    try {
        const response = await axiosInstance.get('');//모든 site 데이터를 axiosInstace로 get방식으로 가져옴
        // 필요한 경우 데이터 가공이나 필터링을 여기서 수행
        return response.data; // 모든 사이트 데이터 반환
    } catch (error) {

        console.error("모든 사이트 데이터를 가져오는 중 오류 발생 프론트,getAllSites 함수:", error);
        throw error;
    }
};

//id를 pk로 특정한 Site의 정보만 읽어오는 함수
export const getSiteData = async (id) => {
    try {//실행 성공시
        //axios에서 제공하는 axiosInstance를 이용하여 get방식으로 ${id}로 받아온 정보를 response의 데이터에 할당
        const response = await axiosInstance.get(`/${id}`);
        const {
            maxPeople,
            minPeople,
            siteId,
            siteIsAvailable,
            siteName,
            siteResLimit,
            weekdayPay,
            weekendPay,
        } = response.data;

        return {
            maxPeople,
            minPeople,
            siteId,
            siteIsAvailable,
            siteName,
            siteResLimit,
            weekdayPay,
            weekendPay,
        };

    } catch (error) {//실패시 예외처리
        //콘솔에 에러메세지출력
        console.error("사이트 데이터를 가져오는 중 오류 발생 프론트,getSiteData 함수:", error);
        throw error;
    }
};

//pk를 기준으로 데이터베이스의 정보를 업데이트하는 함수
//update객체를 외부 컴포넌트에서 호출해서 값을 할당해서  axiosInstace로 put방식으로 값을 변경
export const updateSiteData = async (id, updateData) => {

    try {//성공시 put방식 저장
        await axiosInstance.put(`/${id}`, updateData);
        console.log(updateData)
    } catch (error) {//실패시 예외처리
        console.error(`사이트 데이터를 업데이트하는 중 오류 발생 프론트, updateSiteData 함수:`, error);
        throw error;
    }
};



