package com.sbcamping.admin.stats.service;


import com.sbcamping.admin.stats.dto.CancelStatsResponseDTO;
import com.sbcamping.admin.stats.dto.SalesStatsResponseDTO;
import com.sbcamping.domain.Reservation;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;


public interface ResSalesStatsService {

    // 1-1 매출 현황 : 금액 가져오기, 예약 건수
    public SalesStatsResponseDTO sales(String dateType, LocalDate startDate, LocalDate endDate, Long siteId);

    // 1-2 예약 취소 현황 : 예약 상태, (취소 건수, 취소 금액)
    public CancelStatsResponseDTO cancel(String dateType, LocalDate startDate, LocalDate endDate, Long siteId);

    // 1-3 단순 전체 예약 내역 불러오기
    public List<Reservation> getReservations(String dateType, LocalDate startDate, LocalDate endDate);
}
