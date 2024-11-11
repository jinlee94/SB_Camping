package com.sbcamping.admin.stats.repository;

import com.sbcamping.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReviewStatsRepository extends JpaRepository<Review, Long> {
    // 기간별, 사이트별 목록화
    @Query("SELECT r FROM Review r " +
            "JOIN r.reservation res " +
            "WHERE r.reviewDate BETWEEN :startDate AND :endDate " +
            "AND (:siteId IS NULL OR res.site.siteId = :siteId)")
    List<Review> findReviewsByDateRangeAndSiteId(@Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate,
                                                 @Param("siteId") Long siteId);

    // 리스트 기간별로 목록화
    @Query("SELECT r FROM Review r WHERE r.reviewDate BETWEEN :startDate AND :endDate")
    List<Review> findByDateBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

}