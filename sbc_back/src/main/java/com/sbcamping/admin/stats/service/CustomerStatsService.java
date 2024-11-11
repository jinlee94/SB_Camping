package com.sbcamping.admin.stats.service;

import com.sbcamping.admin.stats.dto.CustomerStatsResponseDTO;
import com.sbcamping.admin.stats.dto.ReviewStatsDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;


public interface CustomerStatsService {

    // 2-5 고객 리뷰 통계
    List<ReviewStatsDTO> reviews(String dateType, LocalDate startDate, LocalDate endDate, Long siteID);

    // 고객 통계 : 성별 통계
    List<CustomerStatsResponseDTO.CustomerStat> getGenderStats(String dateType, LocalDate startDate, LocalDate endDate, Long siteID);

    // 고객 통계 : 연령대 통계
    List<CustomerStatsResponseDTO.CustomerStat> getAgeStats(String dateType, LocalDate startDate, LocalDate endDate, Long siteID);

    // 고객 통계 : 지역 통계
    List<CustomerStatsResponseDTO.CustomerStat> getLocalStats(String dateType, LocalDate startDate, LocalDate endDate, Long siteID);

    // 모든 고객 통계 : 성별, 연령대, 지역 통계 포함
    public CustomerStatsResponseDTO getAllCustomerStats(String dateType, LocalDate startDate, LocalDate endDate, Long siteID);
}



