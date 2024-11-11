package com.sbcamping.admin.stats.dto;

import lombok.Data;

@Data
public class SiteSalesInfo {
    private double totalAmount = 0;
    private int totalCount = 0;

    public void addSales(double amount) {
        this.totalAmount += amount;
        this.totalCount++;
    }

}