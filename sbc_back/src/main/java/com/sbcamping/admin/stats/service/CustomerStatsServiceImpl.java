package com.sbcamping.admin.stats.service;

import com.sbcamping.admin.stats.dto.CustomerStatsResponseDTO;
import com.sbcamping.admin.stats.dto.ReviewStatsDTO; // 추가된 DTO
import com.sbcamping.admin.stats.repository.ReviewStatsRepository; // 리뷰 통계 레포지토리
import com.sbcamping.admin.stats.repository.StatsRepository; // 예약 통계 레포지토리
import com.sbcamping.domain.Member;
import com.sbcamping.domain.Reservation;
import com.sbcamping.domain.Review;
import com.sbcamping.user.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class CustomerStatsServiceImpl implements CustomerStatsService {

    @Autowired
    private StatsRepository statsRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReviewStatsRepository reviewStatsRepository;

    // 해당 기간의 예약 데이터 불러오기
    private List<Reservation> getReservations(String dateType, LocalDate startDate, LocalDate endDate, Long siteId) {
        List<Reservation> reservations = (siteId == null)
                ? statsRepository.findByDateBetween(startDate, endDate)
                : statsRepository.findByDateBetweenAndSiteId(startDate, endDate, siteId);

        log.info("Fetched reservations: {}", reservations.size());
        for (Reservation reservation : reservations) {
            log.info("Reservation ID: {}, Member: {}", reservation.getResId(), reservation.getMember()); // ID 추가
        }

        return reservations;
    }

    // 고객 통계 : 성별, 연령별, 지역별
    @Override
    public CustomerStatsResponseDTO getAllCustomerStats(String dateType, LocalDate startDate, LocalDate endDate, Long siteId) {
        log.info("Fetching stats for dateType={}, startDate={}, endDate={}, siteId={}", dateType, startDate, endDate, siteId);

        List<CustomerStatsResponseDTO.CustomerStat> genderStats = getGenderStats(dateType, startDate, endDate, siteId);
        log.info("Gender Stats: {}", genderStats);

        List<CustomerStatsResponseDTO.CustomerStat> ageStats = getAgeStats(dateType, startDate, endDate, siteId);
        log.info("Age Stats: {}", ageStats);

        List<CustomerStatsResponseDTO.CustomerStat> localStats = getLocalStats(dateType, startDate, endDate, siteId);
        log.info("Local Stats: {}", localStats);

        long totalCustomers = reservationRepository.count();
        log.info("Total Customers: {}", totalCustomers);

        // overallStats를 합치는 로직
        List<CustomerStatsResponseDTO.CustomerStat> overallStats = new ArrayList<>();
        overallStats.addAll(genderStats);
        overallStats.addAll(ageStats.stream()
                .map(stat -> new CustomerStatsResponseDTO.CustomerStat(stat.getGender(), stat.getAgeGroup(), "", stat.getCount()))
                .collect(Collectors.toList()));

        log.info("Overall Stats: {}", overallStats); // overallStats 로그 추가

        // 재예약 비율 및 최다 예약/취소 고객 계산
        double rebookingRate = getRebookingRate(dateType, startDate, endDate, siteId);
        Map<String, Object> mostFrequentReservationCustomer = getMostFrequentReservationCustomer(dateType, startDate, endDate, siteId);
        Map<String, Object> mostFrequentCancellationCustomer = getMostFrequentCancellationCustomer(dateType, startDate, endDate, siteId);

        // 특정 연령대 및 성별의 예약 비율 계산
        Map<String, Long> genderAgeCounts = genderStats.stream()
                .collect(Collectors.groupingBy(stat -> stat.getAgeGroup() + "_" + stat.getGender(), Collectors.counting()));

        Map<String, Long> totalCountsByGender = genderStats.stream()
                .collect(Collectors.groupingBy(stat -> stat.getGender(), Collectors.counting()));

        Map<String, Double> reservationRatios = new HashMap<>();

        for (String key : genderAgeCounts.keySet()) {
            String[] parts = key.split("_");
            String ageGroup = parts[0];
            String gender = parts[1];

            Long countForGroup = genderAgeCounts.get(key);
            Long totalForGender = totalCountsByGender.get(gender);

            double ratio = (totalForGender > 0) ? (double) countForGroup / totalForGender * 100 : 0;
            reservationRatios.put(key, ratio);
        }

        // DTO에 값 설정
        CustomerStatsResponseDTO statsDTO = new CustomerStatsResponseDTO();
        statsDTO.setOverallStats(overallStats);
        statsDTO.setLocalStats(localStats);
        statsDTO.setTotalCustomers(totalCustomers);
        statsDTO.setSiteId(siteId);
        statsDTO.setDate(LocalDate.now());
        statsDTO.setRebookingRate(rebookingRate);

        // 최다 예약 고객 정보 설정
        statsDTO.setMostFrequentReservationCustomerId((Long) mostFrequentReservationCustomer.get("customerId"));
        statsDTO.setMostFrequentReservationCustomerName((String) mostFrequentReservationCustomer.get("customerName"));
        statsDTO.setMostFrequentReservationCustomerEmail((String) mostFrequentReservationCustomer.get("customerEmail"));
        statsDTO.setMostFrequentReservationCount((Long) mostFrequentReservationCustomer.get("reservationCount")); // 예약 횟수 추가

        // 최다 취소 고객 정보 설정
        statsDTO.setMostFrequentCancellationCustomerId((Long) mostFrequentCancellationCustomer.get("customerId"));
        statsDTO.setMostFrequentCancellationCustomerName((String) mostFrequentCancellationCustomer.get("customerName"));
        statsDTO.setMostFrequentCancellationCustomerEmail((String) mostFrequentCancellationCustomer.get("customerEmail"));
        statsDTO.setMostFrequentCancellationCount((Long) mostFrequentCancellationCustomer.get("cancellationCount")); // 취소 횟수 추가

        // 연령대_성별 예약비율 설정
        statsDTO.setReservationRatios(reservationRatios);
        return statsDTO;
    }

    // 성별 통계
    public List<CustomerStatsResponseDTO.CustomerStat> getGenderStats(String dateType, LocalDate startDate, LocalDate endDate, Long siteId) {
        List<Reservation> reservations = getReservations(dateType, startDate, endDate, siteId);
        log.info("Reservations for Gender Stats: {}", reservations.size());

        if (reservations.isEmpty()) return Collections.emptyList();

        return reservations.stream()
                .filter(r -> r.getMember() != null) // null 체크
                .map(r -> {
                    char gender = r.getMember().getMemberGender();
                    String ageGroup = calculateAgeGroup(r.getMember().getMemberBirth());
                    String region = r.getMember().getMemberLocal(); // 지역 정보 추가
                    log.info("Creating Gender Stat: gender={}, ageGroup={}, region={}", gender, ageGroup, region); // 로그 추가
                    return new CustomerStatsResponseDTO.CustomerStat(
                            String.valueOf(gender),
                            ageGroup,
                            region,
                            1
                    );
                })
                .collect(Collectors.toList());
    }

    // 연령대 통계
    public List<CustomerStatsResponseDTO.CustomerStat> getAgeStats(String dateType, LocalDate startDate, LocalDate endDate, Long siteId) {
        List<Reservation> reservations = getReservations(dateType, startDate, endDate, siteId);
        log.info("Reservations for Age Stats: {}", reservations.size());

        if (reservations.isEmpty()) return Collections.emptyList();

        return reservations.stream()
                .filter(r -> r.getMember() != null) // null 체크
                .map(r -> {
                    char gender = r.getMember().getMemberGender();
                    String ageGroup = calculateAgeGroup(r.getMember().getMemberBirth());
                    log.info("Creating Age Stat: gender={}, ageGroup={}", gender, ageGroup); // 로그 추가
                    return new CustomerStatsResponseDTO.CustomerStat(
                            String.valueOf(gender),
                            ageGroup,
                            "", // 지역은 여기서 공백으로 설정
                            1 // 카운트
                    );
                })
                .collect(Collectors.groupingBy(stat -> stat.getAgeGroup(), Collectors.counting()))
                .entrySet().stream()
                .map(entry -> new CustomerStatsResponseDTO.CustomerStat("", entry.getKey(), "", entry.getValue().intValue()))
                .collect(Collectors.toList());
    }

    // 지역 통계
    public List<CustomerStatsResponseDTO.CustomerStat> getLocalStats(String dateType, LocalDate startDate, LocalDate endDate, Long siteId) {
        List<Reservation> reservations = getReservations(dateType, startDate, endDate, siteId);
        log.info("Reservations for Local Stats: {}", reservations.size());

        if (reservations.isEmpty()) return Collections.emptyList();

        return reservations.stream()
                .filter(r -> r.getMember() != null) // null 체크
                .map(r -> {
                    char gender = r.getMember().getMemberGender();
                    String region = r.getMember().getMemberLocal();
                    log.info("Creating Local Stat: gender={}, region={}", gender, region); // 로그 추가
                    return new CustomerStatsResponseDTO.CustomerStat(
                            String.valueOf(gender),
                            "", // 연령대는 해당 메소드에서 사용하지 않으므로 공백으로 설정
                            region,
                            1 // 카운트
                    );
                })
                .collect(Collectors.groupingBy(CustomerStatsResponseDTO.CustomerStat::getRegion, Collectors.counting()))
                .entrySet().stream()
                .map(entry -> new CustomerStatsResponseDTO.CustomerStat("", "", entry.getKey(), entry.getValue().intValue())) // 연령대는 0으로 설정
                .collect(Collectors.toList());
    }

    // 총 예약 통계
    public Map<String, Object> getTotalAndAverageReservationStats(String dateType, LocalDate startDate, LocalDate endDate, Long siteId) {
        List<Reservation> reservations = getReservations(dateType, startDate, endDate, siteId);
        log.info("Total Reservations for Stats: {}", reservations.size()); // 로그 추가

        if (reservations.isEmpty()) return new HashMap<>();

        long totalReservations = reservations.size();
        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        double averageReservations = totalReservations / (double) daysBetween;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReservations", totalReservations);
        stats.put("averageReservationsPerDay", averageReservations);
        return stats;
    }

    // 재예약 고객 비율
    public double getRebookingRate(String dateType, LocalDate startDate, LocalDate endDate, Long siteId) {
        List<Reservation> reservations = getReservations(dateType, startDate, endDate, siteId);
        if (reservations.isEmpty()) return 0.0;

        Set<Long> uniqueCustomers = new HashSet<>();
        Set<Long> rebookedCustomers = new HashSet<>();

        for (Reservation reservation : reservations) {
            Long customerId = reservation.getMember().getMemberID();
            if (uniqueCustomers.contains(customerId)) {
                rebookedCustomers.add(customerId);
            } else {
                uniqueCustomers.add(customerId);
            }
        }

        return (rebookedCustomers.size() / (double) uniqueCustomers.size()) * 100;
    }

    // 최다 예약 고객
    public Map<String, Object> getMostFrequentReservationCustomer(String dateType, LocalDate startDate, LocalDate endDate, Long siteId) {
        List<Reservation> reservations = getReservations(dateType, startDate, endDate, siteId);
        if (reservations.isEmpty()) return new HashMap<>();

        return reservations.stream()
                .collect(Collectors.groupingBy(r -> r.getMember().getMemberID(), Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(entry -> {
                    Long customerId = entry.getKey();
                    Long reservationCount = entry.getValue();

                    // 회원 정보를 가져오기
                    Member member = reservations.stream()
                            .filter(r -> r.getMember().getMemberID().equals(customerId))
                            .findFirst()
                            .map(Reservation::getMember)
                            .orElse(null);

                    Map<String, Object> result = new HashMap<>();
                    if (member != null) {
                        result.put("customerId", customerId);
                        result.put("customerName", member.getMemberName()); // 이름
                        result.put("customerEmail", member.getMemberEmail()); // 이메일
                    }
                    result.put("reservationCount", reservationCount);
                    return result;
                })
                .orElse(new HashMap<>());
    }


    // 최다 취소 고객
    public Map<String, Object> getMostFrequentCancellationCustomer(String dateType, LocalDate startDate, LocalDate endDate, Long siteId) {
        List<Reservation> reservations = getReservations(dateType, startDate, endDate, siteId);
        if (reservations.isEmpty()) return new HashMap<>();

        return reservations.stream()
                .filter(r -> r.getResStatus().equals("예약취소"))
                .collect(Collectors.groupingBy(r -> r.getMember().getMemberID(), Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(entry -> {
                    Long customerId = entry.getKey();
                    Long cancellationCount = entry.getValue();

                    // 회원 정보를 가져오기
                    Member member = reservations.stream()
                            .filter(r -> r.getMember().getMemberID().equals(customerId))
                            .findFirst()
                            .map(Reservation::getMember)
                            .orElse(null);

                    Map<String, Object> result = new HashMap<>();
                    if (member != null) {
                        result.put("customerId", customerId);
                        result.put("customerName", member.getMemberName()); // 이름
                        result.put("customerEmail", member.getMemberEmail()); // 이메일
                    }
                    result.put("cancellationCount", cancellationCount);
                    return result;
                })
                .orElse(new HashMap<>());
    }


    // 나이 그룹 계산
    private String calculateAgeGroup(String birthDate) {
        if (birthDate == null || birthDate.isEmpty()) return "Unknown";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

        // 올바른 형식인지 체크
        if (!birthDate.matches("\\d{8}")) {
            log.warn("Invalid birth date format: {}", birthDate);
            return "Unknown";
        }

        try {
            LocalDate birth = LocalDate.parse(birthDate, formatter);
            int age = Period.between(birth, LocalDate.now()).getYears();
            if (age < 20) return "10대";
            if (age < 30) return "20대";
            if (age < 40) return "30대";
            if (age < 50) return "40대";
            if (age < 60) return "50대";
            if (age < 70) return "60대";
            return "70대 이상";
        } catch (DateTimeParseException e) {
            log.warn("Error parsing birth date: {}", birthDate, e);
            return "Unknown";
        }
    }

    // 고객 리뷰 통계
    @Override
    public List<ReviewStatsDTO> reviews(String dateType, LocalDate startDate, LocalDate endDate, Long siteId) {
        try {
            if (endDate == null) {
                endDate = determineEndDate(startDate, dateType);
            }

            // 리뷰 데이터 조회
            List<Review> reviewsList = (siteId == null)
                    ? reviewStatsRepository.findByDateBetween(startDate, endDate)
                    : reviewStatsRepository.findReviewsByDateRangeAndSiteId(startDate, endDate, siteId);

            // 예약 데이터 조회
            List<Reservation> reservations = getReservations(dateType, startDate, endDate, siteId);

            // 사이트별 예약 수와 리뷰 수를 저장할 Map
            Map<Long, Integer> reservationsBySite = new HashMap<>();
            Map<Long, Integer> reviewsBySite = new HashMap<>();

            // 예약 데이터 집계
            for (Reservation reservation : reservations) {
                Long siteid = reservation.getSite().getSiteId();
                reservationsBySite.merge(siteid, 1, Integer::sum);
            }

            // 리뷰 데이터 집계
            for (Review review : reviewsList) {
                Long siteid = review.getReservation().getSite().getSiteId();
                reviewsBySite.merge(siteid, 1, Integer::sum);
            }

            // 날짜별 + 사이트별 통계를 저장할 맵
            Map<String, Map<Long, ReviewStatsDTO>> dateAndSiteStats = new TreeMap<>();
            Map<String, ReviewStatsDTO> dateTotalStats = new TreeMap<>();

            // 리뷰 데이터 처리
            for (Review review : reviewsList) {
                if (review.getReviewDate() == null) continue;

                LocalDate reviewLocalDate = new java.sql.Date(review.getReviewDate().getTime()).toLocalDate();
                String dateKey = reviewLocalDate.toString();
                Long reviewSiteId = review.getSiteId();

                // 날짜별 + 사이트별 통계 처리
                dateAndSiteStats.computeIfAbsent(dateKey, k -> new HashMap<>());
                ReviewStatsDTO siteStats = dateAndSiteStats.get(dateKey)
                        .computeIfAbsent(reviewSiteId, k -> {
                            ReviewStatsDTO dto = createNewStatsDTO(reviewLocalDate, reviewSiteId);
                            // 해당 사이트의 예약 수와 리뷰 수 설정
                            dto.setTotalReservations(reservationsBySite.getOrDefault(reviewSiteId, 0));
                            return dto;
                        });
                updateStats(siteStats, review);

                // 날짜별 전체 통계 처리
                ReviewStatsDTO totalStats = dateTotalStats.computeIfAbsent(dateKey, k -> {
                    ReviewStatsDTO dto = createNewStatsDTO(reviewLocalDate, 0L);
                    // 전체 예약 수 설정
                    dto.setTotalReservations(reservations.size());
                    return dto;
                });
                updateStats(totalStats, review);
            }

            // 결과 리스트 생성
            List<ReviewStatsDTO> result = new ArrayList<>();

            // 날짜별 전체 통계 추가 (전체 예약 수 포함)
            dateTotalStats.values().forEach(dto -> {
                dto.setTotalReservations(reservations.size());
                dto.setTotalReviews(reviewsList.size());
                result.add(dto);
            });

            // 사이트별 통계 추가
            if (siteId != null) {
                dateAndSiteStats.values().forEach(siteMap -> {
                    ReviewStatsDTO siteStats = siteMap.get(siteId);
                    if (siteStats != null) {
                        // 특정 사이트의 예약 수와 리뷰 수 설정
                        siteStats.setTotalReservations(reservationsBySite.getOrDefault(siteId, 0));
                        siteStats.setTotalReviews(reviewsBySite.getOrDefault(siteId, 0));
                        result.add(siteStats);
                    }
                });
            } else {
                dateAndSiteStats.values().forEach(siteMap ->
                        siteMap.forEach((siteid, dto) -> {
                            // 각 사이트별 예약 수와 리뷰 수 설정
                            dto.setTotalReservations(reservationsBySite.getOrDefault(siteid, 0));
                            dto.setTotalReviews(reviewsBySite.getOrDefault(siteid, 0));
                            result.add(dto);
                        }));
            }

            return result;

        } catch (Exception e) {
            log.error("Error processing reviews: ", e);
            throw new RuntimeException("리뷰 통계 처리 중 오류가 발생했습니다.", e);
        }
    }

    private ReviewStatsDTO createNewStatsDTO(LocalDate date, Long siteId) {
        ReviewStatsDTO dto = new ReviewStatsDTO();
        dto.setReviewDate(java.sql.Date.valueOf(date));
        dto.setSiteId(siteId);
        return dto;
    }

    private void updateStats(ReviewStatsDTO dto, Review review) {
        dto.incrementTotalReviews();
        incrementTagCounts(dto, review);
    }


    private LocalDate incrementDate(LocalDate date, String dateType) {
        switch (dateType.toLowerCase()) {
            case "daily":
                return date.plusDays(1);
            case "weekly":
                return date.plusWeeks(1);
            case "monthly":
                return date.plusMonths(1);
            default:
                return date.plusDays(1);
        }
    }

    private LocalDate determineEndDate(LocalDate startDate, String dateType) {
        switch (dateType.toLowerCase()) {
            case "day":
                return startDate;
            case "month":
                return YearMonth.from(startDate).atEndOfMonth();
            case "year":
                return startDate.withMonth(12).withDayOfMonth(31);
            default:
                throw new IllegalArgumentException("Invalid date type: " + dateType);
        }
    }

    private void initializeDateMap(LocalDate startDate, LocalDate endDate, String dateType, Map<String, ReviewStatsDTO> resultMap) {
        switch (dateType.toLowerCase()) {
            case "day":
                for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                    resultMap.put(date.toString(), new ReviewStatsDTO(date, 0, 0, 0, 0, 0, 0, 0, 0));
                }
                break;
            case "month":
                for (YearMonth ym = YearMonth.from(startDate); !ym.isAfter(YearMonth.from(endDate)); ym = ym.plusMonths(1)) {
                    resultMap.put(ym.toString(), new ReviewStatsDTO(ym.atDay(1), 0, 0, 0, 0, 0, 0, 0, 0));
                }
                break;
            case "year":
                for (int year = startDate.getYear(); year <= endDate.getYear(); year++) {
                    resultMap.put(String.valueOf(year), new ReviewStatsDTO(LocalDate.of(year, 1, 1), 0, 0, 0, 0, 0, 0, 0, 0));
                }
                break;
            default:
                throw new IllegalArgumentException("Invalid date type: " + dateType);
        }
    }

    private void incrementTagCounts(ReviewStatsDTO dto, Review review) {
        if (review.getRtag_Clean() == 'Y') dto.incrementCleanCount();
        if (review.getRtag_Price() == 'Y') dto.incrementPriceCount();
        if (review.getRtag_Facility() == 'Y') dto.incrementFacilityCount();
        if (review.getRtag_Photo() == 'Y') dto.incrementPhotoCount();
        if (review.getRtag_Silence() == 'Y') dto.incrementSilenceCount();
        if (review.getRtag_Kind() == 'Y') dto.incrementKindCount();
        if (review.getRtag_View() == 'Y') dto.incrementViewCount();
    }

    private String getKey(LocalDate date, String dateType) {
        switch (dateType) {
            case "day":
                return date.toString();
            case "month":
                return YearMonth.from(date).toString();
            case "year":
                return String.valueOf(date.getYear());
            default:
                throw new IllegalArgumentException("Invalid date type: " + dateType);
        }
    }
}