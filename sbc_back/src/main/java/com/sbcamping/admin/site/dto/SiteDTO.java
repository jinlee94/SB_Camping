package com.sbcamping.admin.site.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data //Getter,Setter,equals,hashCode,toString자동 생성
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SiteDTO {
    private Long siteId;      //구역번호
    private String siteName;        //구역명
    private String siteResLimit;    //예약제한(수리,파손 등)
    private int weekendPay;         //주말가격
    private int weekdayPay;         //주중가격
    private int minPeople;          //최소인원
    private int maxPeople;          //최대인원
}
