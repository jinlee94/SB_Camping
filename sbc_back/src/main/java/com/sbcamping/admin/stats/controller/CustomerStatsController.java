package com.sbcamping.admin.stats.controller;

import com.sbcamping.admin.stats.dto.CustomerStatsResponseDTO;
import com.sbcamping.admin.stats.dto.ReviewStatsDTO;
import com.sbcamping.admin.stats.service.CustomerStatsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequestMapping("/admin/stats/customer")
public class CustomerStatsController {

    @Autowired
    private CustomerStatsService service;

    // 고객 통계 : 기간별 조회 - 성별 /gender, 연령별 /age, 지역별 /local
    @GetMapping("/all")
    public ResponseEntity<CustomerStatsResponseDTO> getAllCustomerStats(
            @RequestParam String dateType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long siteId
    ) {
        try {
            // 서비스에서 통계 조회
            CustomerStatsResponseDTO allStats = service.getAllCustomerStats(dateType, startDate, endDate, siteId);

            // DTO로 변환 (service에서 DTO를 생성하므로, 추가 매핑 필요 없음)
            return ResponseEntity.ok(allStats);

        } catch (Exception e) {
            log.error("Error processing customer stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    // 2-2 고객 리뷰 현황
    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewStatsDTO>> getReviewStats(
            @RequestParam String dateType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long siteId
    ) {
        try {
            log.info("Received request for review stats - dateType: {}, startDate: {}, endDate: {}, siteId: {}",
                    dateType, startDate, endDate, siteId);

            List<ReviewStatsDTO> result = service.reviews(dateType, startDate, endDate, siteId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error processing review stats", e);
            return ResponseEntity.internalServerError().build();
        }
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

}
