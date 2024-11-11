package com.sbcamping.admin.stats.dto;

import com.sbcamping.domain.Reservation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesStatsResponseDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private Long siteId;
    private String dateType;

    private List<ResSalesResultDTO> statsList;
    private Map<String, Object> totalStats;
    private Map<Long, SiteSalesInfo> siteTotals;

    public <E> SalesStatsResponseDTO(ArrayList<E> es, Map<String, Object> totalStats, Map<Long, SiteSalesInfo> siteTotals) {
    }

    public SalesStatsResponseDTO(List<ResSalesResultDTO> statsList, Map<String, Object> totalStats, Map<Long, SiteSalesInfo> siteTotals) {
    }

    @Override
    public String toString() {
        return "SalesStatsResponseDTO{" +
                "startDate=" + startDate +
                ", endDate=" + endDate +
                ", siteId=" + siteId +
                ", dateType='" + dateType + '\'' +
                ", stats.size=" + (statsList != null ? statsList.size() : 0) +
                ", totalStats=" + totalStats +
                ", siteTotals.size=" + (siteTotals != null ? siteTotals.size() : 0) +
                '}';
    }
}