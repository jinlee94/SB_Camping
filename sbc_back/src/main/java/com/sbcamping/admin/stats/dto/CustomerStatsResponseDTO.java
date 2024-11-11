package com.sbcamping.admin.stats.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStatsResponseDTO {
    private List<CustomerStat> overallStats; // 전체 통계
    private List<CustomerStat> siteStats;     // 사이트별 통계
    private long totalCustomers;               // 전체 고객 수
    private Map<String, Double> reservationRatios; // 연령대와 성별에 따른 예약 비율

    // 최다 예약 고객 정보
    private Long mostFrequentReservationCustomerId;
    private String mostFrequentReservationCustomerName;
    private String mostFrequentReservationCustomerEmail;
    private Long mostFrequentReservationCount; // 예약 횟수 추가

    // 최다 취소 고객 정보
    private Long mostFrequentCancellationCustomerId;
    private String mostFrequentCancellationCustomerName;
    private String mostFrequentCancellationCustomerEmail;
    private Long mostFrequentCancellationCount; // 취소 횟수 추가

    private Long siteId;   // 구역 번호
    private LocalDate date;

    private double rebookingRate;

    public CustomerStatsResponseDTO(List<CustomerStat> overallStats, List<CustomerStat> siteStats, long totalCustomers, Long siteId, LocalDate now) {
        this.overallStats = overallStats;
        this.siteStats = siteStats;
        this.totalCustomers = totalCustomers;
        this.siteId = siteId;
        this.date = now; // 날짜를 설정
    }

    public void setLocalStats(List<CustomerStat> localStats) {
    }

    @Data
    public static class CustomerStat {
        private String gender; // 성별
        private String ageGroup;  // 연령대
        private String region; // 지역
        private long count;    // 통계 수치
        private Map<String, Double> reservationRatios; // 연령대와 성별에 따른 예약 비율

        public CustomerStat(String gender, String ageGroup, String region, long count) {
            this.gender = gender;
            this.ageGroup = ageGroup;
            this.region = region;
            this.count = count;
        }
    }
}