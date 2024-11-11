package com.sbcamping.admin.stats.service;

import com.sbcamping.admin.stats.dto.*;
import com.sbcamping.admin.stats.repository.StatsRepository;
import com.sbcamping.domain.Reservation;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Log4j2
public class ResSalesStatsServiceImpl implements ResSalesStatsService {

    private final StatsRepository statsRepository;

    private static final String DAY = "day";
    private static final String MONTH = "month";
    private static final String YEAR = "year";

    @Override
    public SalesStatsResponseDTO sales(String dateType, LocalDate startDate, LocalDate endDate, Long siteId) {
        log.info("Date range: {} to {}", startDate, endDate);
        log.info("Fetching sales data: dateType={}, startDate={}, endDate={}, siteId={}", dateType, startDate, endDate, siteId);

        List<Reservation> reservations = (siteId == null)
                ? statsRepository.findByDateBetween(startDate, endDate)
                : statsRepository.findByDateBetweenAndSiteId(startDate, endDate, siteId);

        log.info("Found {} reservations", reservations.size());

        Map<String, ResSalesResultDTO> salesResultMap = createDateRangeMap(startDate, endDate, dateType);
        processReservations(reservations, salesResultMap, dateType);

        Map<Long, SiteSalesInfo> siteTotals = calculateSiteTotals(salesResultMap);
        Map<String, Object> totalStats = createTotalStats(salesResultMap);

        List<ResSalesResultDTO> statsList = new ArrayList<>(salesResultMap.values());

        SalesStatsResponseDTO response = new SalesStatsResponseDTO();
        response.setStartDate(startDate);
        response.setEndDate(endDate);
        response.setSiteId(siteId);
        response.setDateType(dateType);
        response.setStatsList(statsList);
        response.setTotalStats(totalStats);
        response.setSiteTotals(siteTotals);

        log.info("Created SalesStatsResponseDTO: {}", response);

        return response;
    }

    private Map<String, ResSalesResultDTO> createDateRangeMap(LocalDate startDate, LocalDate endDate, String dateType) {
        Map<String, ResSalesResultDTO> resultMap = new TreeMap<>();

        if (dateType.equals(YEAR)) {
            // 연도별로 각 월에 대한 DTO 생성
            for (int year = startDate.getYear(); year <= endDate.getYear(); year++) {
                for (int month = 1; month <= 12; month++) {
                    String key = String.format("%04d-%02d", year, month); // "YYYY-MM" 형식으로 키 생성
                    resultMap.put(key, new ResSalesResultDTO(LocalDate.of(year, month, 1))); // 해당 월의 DTO 생성
                }
            }
        } else if (dateType.equals(MONTH)) {
            // 월별로 각 일자에 대한 DTO 생성
            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                String key = date.toString(); // "YYYY-MM-DD" 형식으로 키 생성
                resultMap.put(key, new ResSalesResultDTO(date)); // 일자별 DTO 생성
            }
        } else {
            // 일자별로 키 생성
            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                String key = getKey(date, dateType);
                resultMap.put(key, new ResSalesResultDTO(date));
            }
        }

        return resultMap;
    }

    // 특정 날짜와 날짜 유형에 따라 집계 키를 생성
    private String getKey(LocalDate date, String dateType) {
        switch (dateType) {
            case DAY:
                return date.toString();
            case MONTH:
                return date.toString().substring(0, 7); // "YYYY-MM"
            case YEAR:
                return String.valueOf(date.getYear());
            default:
                throw new IllegalArgumentException("Invalid date type: " + dateType);
        }
    }

    private void processReservations(List<Reservation> reservations, Map<String, ResSalesResultDTO> salesResultMap, String dateType) {
        LocalDate today = LocalDate.now();
        log.info("Processing {} reservations", reservations.size());

        for (Reservation reservation : reservations) {
            LocalDate resDate = reservation.getResDate();
            double amount = reservation.getResTotalPay();
            boolean isScheduled = reservation.getCheckinDate().isAfter(today);
            long siteId = reservation.getSite().getSiteId();

            log.info("Processing reservation: resDate={}, amount={}, isScheduled={}, siteId={}", resDate, amount, isScheduled, siteId);

            String key;
            if (dateType.equals(YEAR)) {
                key = String.format("%04d-%02d", resDate.getYear(), resDate.getMonthValue()); // "YYYY-MM" 형식으로 키 생성
            } else if (dateType.equals(MONTH)) {
                key = resDate.toString(); // "YYYY-MM-DD" 형식으로 키 생성
            } else {
                key = getKey(resDate, dateType);
            }

            ResSalesResultDTO dto = salesResultMap.get(key);
            if (dto == null) {
                log.warn("No DTO found for key: {}", key);
                continue;
            }

            if (isScheduled) {
                dto.addScheduledSale(siteId, amount);
                log.info("Added scheduled sale: siteId={}, amount={}", siteId, amount);
            } else {
                dto.addCompletedSale(siteId, amount);
                log.info("Added completed sale: siteId={}, amount={}", siteId, amount);
            }

            // DTO에 추가된 후의 상태 로그
            log.debug("Updated DTO for key {}: scheduledCount={}, completedCount={}, scheduledAmount={}, completedAmount={}",
                    key, dto.getScheduledCount(), dto.getCompletedCount(), dto.getScheduledAmount(), dto.getCompletedAmount());
        }

        log.info("Finished processing reservations. ResultMap size: {}", salesResultMap.size());
    }

    private Map<Long, SiteSalesInfo> calculateSiteTotals(Map<String, ResSalesResultDTO> salesResultMap) {
        Map<Long, SiteSalesInfo> siteTotals = new HashMap<>();

        for (ResSalesResultDTO dto : salesResultMap.values()) {
            for (Map.Entry<Long, SiteSalesInfo> entry : dto.getSiteSalesMap().entrySet()) {
                Long siteId = entry.getKey();
                SiteSalesInfo siteSalesInfo = entry.getValue();

                siteTotals.putIfAbsent(siteId, new SiteSalesInfo());
                siteTotals.get(siteId).addSales(siteSalesInfo.getTotalAmount());
            }
        }

        return siteTotals;
    }

    private Map<String, Object> createTotalStats(Map<String, ResSalesResultDTO> salesResultMap) {
        int totalCompletedCount = 0;
        double totalCompletedAmount = 0;
        int totalScheduledCount = 0;
        double totalScheduledAmount = 0;

        for (ResSalesResultDTO dto : salesResultMap.values()) {
            totalCompletedCount += dto.getCompletedCount();
            totalCompletedAmount += dto.getCompletedAmount();
            totalScheduledCount += dto.getScheduledCount();
            totalScheduledAmount += dto.getScheduledAmount();
        }

        return Map.of(
                "totalCompletedCount", totalCompletedCount,
                "totalCompletedAmount", totalCompletedAmount,
                "totalScheduledCount", totalScheduledCount,
                "totalScheduledAmount", totalScheduledAmount
        );
    }

    @Override
    public CancelStatsResponseDTO cancel(String dateType, LocalDate startDate, LocalDate endDate, Long siteId) {
        if (endDate == null) {
            endDate = determineEndDate(startDate, dateType);
        }

        log.info("Processed date range: startDate={}, endDate={}", startDate, endDate);

        List<Reservation> cancelledReservations = (siteId == null)
                ? statsRepository.findCancelByDateBetween(startDate, endDate)
                : statsRepository.findCancelByDateBetweenAndSiteId(startDate, endDate, siteId);

        log.info("Found {} cancelled reservations", cancelledReservations.size());

        Map<String, ResCancelResultDTO> cancelResultMap = createCancelDateRangeMap(startDate, endDate, dateType);
        processCancelledReservations(cancelledReservations, cancelResultMap, dateType);

        return new CancelStatsResponseDTO(new ArrayList<>(cancelResultMap.values()), createCancelTotalStats(cancelResultMap));
    }

    private LocalDate determineEndDate(LocalDate startDate, String dateType) {
        switch (dateType.toLowerCase()) {
            case DAY:
                return startDate;
            case MONTH:
                return YearMonth.from(startDate).atEndOfMonth();
            case YEAR:
                return startDate.withMonth(12).withDayOfMonth(31);
            default:
                throw new IllegalArgumentException("Invalid date type: " + dateType);
        }
    }

    private Map<String, ResCancelResultDTO> createCancelDateRangeMap(LocalDate startDate, LocalDate endDate, String dateType) {
        Map<String, ResCancelResultDTO> resultMap = new TreeMap<>();

        switch (dateType) {
            case DAY:
                for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                    resultMap.put(date.toString(), new ResCancelResultDTO(date));
                }
                break;
            case MONTH:
                for (LocalDate date = startDate.withDayOfMonth(1); !date.isAfter(endDate); date = date.plusMonths(1)) {
                    resultMap.put(date.toString().substring(0, 7), new ResCancelResultDTO(date)); // "YYYY-MM" 형식
                }
                break;
            case YEAR:
                for (YearMonth yearMonth = YearMonth.from(startDate); !yearMonth.isAfter(YearMonth.from(endDate)); yearMonth = yearMonth.plusMonths(1)) {
                    resultMap.put(yearMonth.toString(), new ResCancelResultDTO(yearMonth.atDay(1))); // "YYYY-MM" 형식
                }
                break;
            default:
                throw new IllegalArgumentException("Invalid date type: " + dateType);
        }

        return resultMap;
    }

    private void processCancelledReservations(List<Reservation> cancelledReservations, Map<String, ResCancelResultDTO> resultMap, String dateType) {
        for (Reservation reservation : cancelledReservations) {
            LocalDate cancelDate = reservation.getResCancelDate();
            if (cancelDate == null) {
                log.warn("Cancel date is null for reservation ID: " + reservation.getResId());
                continue; // skip if cancel date is null
            }
            double amount = reservation.getResTotalPay();
            long siteId = reservation.getSite().getSiteId(); // 사이트 ID 가져오기

            log.info("Cancel Date for reservation ID {}: {}", reservation.getResId(), reservation.getResCancelDate());

            String key;
            if (dateType.equals(YEAR)) {
                key = cancelDate.toString().substring(0, 7); // "YYYY-MM" 형식
            } else {
                key = cancelDate.toString(); // "YYYY-MM-DD" 형식
            }

            ResCancelResultDTO dto = resultMap.get(key);
            if (dto == null) {
                dto = new ResCancelResultDTO(dateType.equals(YEAR) ? YearMonth.from(cancelDate).atDay(1) : cancelDate);
                dto.setSiteId(siteId); // DTO에 사이트 ID 저장
                resultMap.put(key, dto);
            }

            // 사이트별로 집계
            dto.setCancelCount(dto.getCancelCount() + 1);
            dto.setCancelAmount(dto.getCancelAmount() + amount);
            dto.addSiteCancel(siteId, amount); // 사이트별 취소액 집계 추가
        }
    }

    private Map<String, Object> createCancelTotalStats(Map<String, ResCancelResultDTO> resultMap) {
        int totalCancelCount = 0;
        double totalCancelAmount = 0;

        for (ResCancelResultDTO dto : resultMap.values()) {
            totalCancelCount += dto.getCancelCount();
            totalCancelAmount += dto.getCancelAmount();
        }

        return Map.of(
                "totalCancelCount", totalCancelCount,
                "totalCancelAmount", totalCancelAmount
        );
    }

    // 1-3

    @Override
    public List<Reservation> getReservations(String dateType, LocalDate startDate, LocalDate endDate) {
        List<Reservation> result = statsRepository.findByDateBetween(startDate, endDate);

        return result;
    }
}
