package com.sbcamping.admin.stats.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CancelStatsResponseDTO {
    private List<ResCancelResultDTO> stats;
    private Map<String, Object> totalStats;
}
