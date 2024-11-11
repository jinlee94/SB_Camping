import axios from "axios"
import jwtAxios from "../../util/jwtUtil";

// 서버 주소
export const API_SERVER_HOST = 'http://localhost:8080'

const prefix = `${API_SERVER_HOST}/admin/stats`

// 예약 매출 통계 : 금액 가져오기, 예약 건수
export const fetchSalesStats = async (startDate, endDate, dateType, siteId) => {
    try {
        console.log('Received dates:', { startDate, endDate });

        const params = {
            startDate,
            endDate,
            dateType,
            siteId: siteId || undefined
        };

        console.log('Request params:', params);

        const response = await jwtAxios.get(`${prefix}/reservation-sales/sales`, { params });

        console.log('Raw API response:', response.data);

        if (response.data && Array.isArray(response.data.statsList)) {
            return response.data;
        } else {
            console.error('Unexpected response structure:', response.data);
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};


// 예약 취소 통계 : 취소 건수, 취소 금액
export const fetchCancelStats = async (params) => {
    console.log('Fetching cancel stats with params:', params);
    try {
        const response = await jwtAxios.get(`${prefix}/reservation-sales/cancel`, { params });
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API request error:', error.response?.data || error.message);
        throw error;
    }
}

// 고객 리뷰 통계 : 태그별 리뷰 건수
export const fetchReviewStats = async (params) => {
    try {
        const response = await jwtAxios.get(`${prefix}/customer/reviews`, { params });
        return response.data;
    } catch (error) {
        console.error('API request error:', error.response?.data || error.message);
        throw error;
    }
}

// 고객 특정 통계 : 성별, 연령대, 지역별 통계
export const fetchCustomerStats = async (params) => {
    try {
        console.log('Sending request with params:', params.toString()); // 디버깅용 로그
        const response = await jwtAxios.get(`${prefix}/customer/all`, {params});
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching customer stats:', error);
        throw error;
    }
}

// 단순 특정기간 예약 리스트 불러오기
export const getStatsReservations = async (params) => {
      try {
        const response = await  jwtAxios.get(`${prefix}/reservation-sales/`, {params})
    console.log('API Response:', response.data);
    return response.data; } catch (error) {
          console.error('Error fetching customer stats:', error);
          throw error;
      }

};
