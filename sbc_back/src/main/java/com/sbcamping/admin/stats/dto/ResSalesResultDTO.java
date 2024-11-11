package com.sbcamping.admin.stats.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Log4j2
public class ResSalesResultDTO {

    private String resDate;             // 예약 날짜
    private LocalDate checkinDate;
    private double scheduledAmount;
    private int scheduledCount;
    private double completedAmount;
    private int completedCount;
    private Long siteID;

    private Map<Long, SiteSalesInfo> siteSalesMap = new HashMap<>();

    public void addScheduledSale(long siteId, double amount) {
        log.info("Adding scheduled sale: siteId={}, amount={}", siteId, amount);
        scheduledCount++;
        scheduledAmount += amount;
        siteSalesMap.computeIfAbsent(siteId, k -> new SiteSalesInfo()).addSales(amount);
        log.info("After adding scheduled sale: scheduledCount={}, scheduledAmount={}", scheduledCount, scheduledAmount);
    }

    public void addCompletedSale(long siteId, double amount) {
        log.info("Adding completed sale: siteId={}, amount={}", siteId, amount);
        completedCount++;
        completedAmount += amount;
        siteSalesMap.computeIfAbsent(siteId, k -> new SiteSalesInfo()).addSales(amount);
        log.info("After adding completed sale: completedCount={}, completedAmount={}", completedCount, completedAmount);
    }

    public void addSiteSale(Long siteId, double amount, boolean isScheduled) {
        SiteSalesInfo siteSalesInfo = siteSalesMap.getOrDefault(siteId, new SiteSalesInfo());
        siteSalesInfo.addSales(amount);
        siteSalesMap.put(siteId, siteSalesInfo);
    }

    public ResSalesResultDTO(LocalDate date) {
        this.resDate = date.toString();
    }
}
