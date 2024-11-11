package com.sbcamping.admin.stats.repository;

import com.sbcamping.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface StatsRepository extends JpaRepository<Reservation, String> {

    // 예약상태 : 예약완료인 리스트 기간별, 사이트별로 목록화
    @Query("SELECT r FROM Reservation r WHERE r.resDate BETWEEN :startDate AND :endDate " +
            "AND r.resStatus IN ('예약완료', '사용완료') " +
            "AND (:siteId IS NULL OR r.site.id = :siteId)")
    List<Reservation> findByDateBetweenAndSiteId(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("siteId") Long siteId
    );

    // 예약상태 : 예약완료인 리스트 기간별로 목록화 
    @Query("SELECT r FROM Reservation r WHERE r.resDate BETWEEN :startDate AND :endDate " +
            "AND r.resStatus IN ('예약완료', '사용완료') ")
    List<Reservation> findByDateBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // 예약상태 : 예약취소인 리스트 기간별, 사이트별로 목록화
    @Query("SELECT r FROM Reservation r WHERE r.resCancelDate BETWEEN :startDate AND :endDate " +
            "AND r.resStatus = '예약취소' " +
            "AND (:siteId IS NULL OR r.site.id = :siteId)")
    List<Reservation> findCancelByDateBetweenAndSiteId(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("siteId") Long siteId
    );

    // 예약상태 : 예약취소인 리스트 기간별로 목록화
    @Query("SELECT r FROM Reservation r WHERE r.resCancelDate BETWEEN :startDate AND :endDate AND r.resStatus = '예약취소'")
    List<Reservation> findCancelByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

}
