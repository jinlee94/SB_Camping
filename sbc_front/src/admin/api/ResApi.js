
import jwtAxios from "../../util/jwtUtil"; //쿠키값 가진 axios객체 호출

//예약관리 모듈의 기능을 모아둔 APi

//백엔드의 경로를 상수로 할당
const backUrl= "http://localhost:8080";   //백엔드 기본경로 변수에 할당

//백엔드 경로와 매핑명을 합쳐서
export const resHost = `${backUrl}/admin/res`

//유틸에 값 할당
const transroot =()=>{
    jwtAxios.defaults.baseURL = resHost; //문자열로 재할당
    jwtAxios.defaults.timeout = 10000; //10초제한
    return jwtAxios
}



// 기본 axiosinstance에 tansroot한 jwtaxios를 할당
    const axiosInstance = transroot();

// 예약 데이터 전체를 가져오는 함수
export const getAllRes = async () => {
    try {
        // reshost/all 의 매핑으로 axitos인스턴스 get방식으로 백엔드의 컨트롤러의 getAllRes에서 가져온 List<ResDTO>의 데이터를 response변수에 할당
        const response = await axiosInstance.get('/all');//모든 res 데이터를 axiosInstace로 get방식으로 가져옴
        // 데이터 형식 바꿀거면 여기서 바꿔
        return response.data; // 리턴으로 모든 예약 데이터 반환

    } catch (error) {//함수실행 실패처리

        console.error("모든 예약 데이터를 가져오는 중 오류 발생 프론트,ResApi-getAllRes 함수:", error);
        throw error;
    }
};




