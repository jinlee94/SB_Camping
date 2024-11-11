package com.sbcamping.admin.stats.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResCancelResultDTO {
    private LocalDate resCancelDate;
    private int cancelCount;
    private double cancelAmount;
    private Map<Long, Double> siteCancelMap = new HashMap<>(); // 사이트별 취소액
    private long siteId;

    public ResCancelResultDTO(LocalDate date) {
        this.resCancelDate = date; // 추가
    }

    public void addSiteCancel(long siteId, double amount) {
        siteCancelMap.putIfAbsent(siteId, 0.0);
        siteCancelMap.put(siteId, siteCancelMap.get(siteId) + amount);
    }
}
