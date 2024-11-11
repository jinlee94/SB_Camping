package com.sbcamping.admin.stats.controller;

import com.sbcamping.admin.stats.dto.CancelStatsResponseDTO;
import com.sbcamping.admin.stats.dto.SalesStatsResponseDTO;
import com.sbcamping.admin.stats.service.ResSalesStatsService;
import com.sbcamping.domain.Reservation;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequestMapping("/admin/stats/reservation-sales")
public class ResSalesStatsController {


    private final ResSalesStatsService service;


    @GetMapping("/sales")
    public ResponseEntity<SalesStatsResponseDTO> getSalesStats(
            @RequestParam String dateType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long siteId
    ) {
        log.info("Fetching sales stats: dateType={}, startDate={}, endDate={}, siteId={}", dateType, startDate, endDate, siteId);

        LocalDate end = determineEndDate(dateType, startDate, endDate);
        if (end == null) {
            return ResponseEntity.badRequest().body(null); // Bad request 처리
        }

        SalesStatsResponseDTO response = service.sales(dateType, startDate, end, siteId);
        log.info("Fetched sales stats: response={}", response);
        return ResponseEntity.ok(response); // DTO 사용
    }

    @GetMapping("/cancel")
    public ResponseEntity<CancelStatsResponseDTO> getCancelledSalesStats(
            @RequestParam String dateType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long siteId
    ) {
        log.info("Fetching sales stats: dateType={}, startDate={}, endDate={}, siteId={}", dateType, startDate, endDate, siteId);

        LocalDate end = determineEndDate(dateType, startDate, endDate);
        if (end == null) {
            return ResponseEntity.badRequest().body(null); // Bad request 처리
        }
        CancelStatsResponseDTO response = service.cancel(dateType, startDate, end, siteId); // 서비스 호출
        return ResponseEntity.ok(response); // DTO 사용
    }

    private LocalDate determineEndDate(String dateType, LocalDate startDate, LocalDate endDate) {
        switch (dateType) {
            case "day":
                return endDate != null ? endDate : startDate;
            case "month":
                return YearMonth.from(startDate).atEndOfMonth();
            case "year":
                return startDate.withMonth(12).withDayOfMonth(31);
            default:
                return null;
        }
    }

    // 메인 페이지 예약내역 단순 호출
    @GetMapping("/")
    public ResponseEntity<List<Reservation>> getAllReservations(
            @RequestParam String dateType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        log.info("Fetching all reservations");

        LocalDate end = determineEndDate(dateType, startDate, endDate);
        if (end == null) {
            return ResponseEntity.badRequest().body(null); // Bad request 처리
        }

        List<Reservation> response = service.getReservations(dateType, startDate, end);
        log.info("Fetched sales stats: response={}", response);
        return ResponseEntity.ok(response); // DTO 사용
    }
}
