package com.sbcamping.admin.stats.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
public class ReviewStatsDTO {
    private Date reviewDate;
    private long siteId;
    private int cleanCount; // 청결
    private int priceCount; // 가성비
    private int facilityCount; // 시설
    private int photoCount; // 사진
    private int silenceCount; // 조용
    private int kindCount; // 친절
    private int viewCount; // 풍경

    // 예약 대비 리뷰 달린 비율 구하기
    private int totalReviews;
    private int totalReviewsBySiteId;

    private int totalReservations;
    private int totalReservationsBySiteId;

    public ReviewStatsDTO(LocalDate date, int i, int i1, int i2, int i3, int i4, int i5, int i6, int i7) {
    }

    public void incrementTotalReviews() {
        this.totalReviews++;
    }

    public void incrementCleanCount() {
        this.cleanCount++;
    }

    public void incrementPriceCount() {
        this.priceCount++;
    }

    public void incrementFacilityCount() {
        this.facilityCount++;
    }

    public void incrementPhotoCount() {
        this.photoCount++;
    }

    public void incrementSilenceCount() {
        this.silenceCount++;
    }

    public void incrementKindCount() {
        this.kindCount++;
    }

    public void incrementViewCount() {
        this.viewCount++;
    }

    public ReviewStatsDTO(Date reviewDate, long siteId, int totalReviews, int cleanCount, int priceCount, int facilityCount, int photoCount, int silenceCount, int kindCount, int viewCount) {
        this.reviewDate = reviewDate;
        this.siteId = siteId;
        this.totalReviews = totalReviews;
        this.cleanCount = cleanCount;
        this.priceCount = priceCount;
        this.facilityCount = facilityCount;
        this.photoCount = photoCount;
        this.silenceCount = silenceCount;
        this.kindCount = kindCount;
        this.viewCount = viewCount;
    }

}
