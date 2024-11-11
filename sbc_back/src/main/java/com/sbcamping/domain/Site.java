package com.sbcamping.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@SequenceGenerator(name = "SITE_SEQ_GEN", // 시퀀스 제너레이터 이름
        sequenceName = "SITE_SEQ", // 시퀀스 이름
        initialValue = 1, //시작값
        allocationSize = 1 // 메모리를 통해 할당할 범위 사이즈
)
@Table(name = "Site") // 실제 DB 테이블 명
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Site {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SITE_SEQ_GEN")
    @Column(name = "Site_ID", nullable = false, columnDefinition = "NUMBER(10,0)") //구역번호
    private Long siteId;

    @Column(name = "Site_Name", nullable = false, length = 10, unique = true) //구역이름
    private String siteName;

    @Column(name = "Site_Res_Limit", nullable = false, length = 1)      // 예약 제한
    private char siteResLimit = 'N';

    @Column(name = "Site_Weekend_Pay", nullable = false, columnDefinition = "NUMBER(10,0)") // 주말가격
    @Builder.Default    //값이 정해져 있기 떄문에 사용
    private Long weekendPay = 80000L;

    @Column(name = "Site_Weekday_Pay", nullable = false, columnDefinition = "NUMBER(10,0)") // 평일가격
    @Builder.Default
    private Long weekdayPay = 40000L;

    @Column(name = "Site_Min_People", nullable = false, columnDefinition = "NUMBER(1,0)") // 최소인원
    @Builder.Default
    private Long minPeople = 4L;

    @Column(name = "Site_Max_People", nullable = false, columnDefinition = "NUMBER(1,0)") // 최대인원
    @Builder.Default
    private Long maxPeople = 6L;


    public void changeSiteName(String Name) {
        this.siteName = Name;
    }

    public void changeResLimit(char ResLimit) {
        this.siteResLimit = ResLimit;
    }

    public void changeWeekendPay(Long WeekendPay) {
        this.weekendPay = WeekendPay;
    }

    public void changeWeekdayPay(Long WeekdayPay) {
        this.weekdayPay = WeekdayPay;
    }

    public void changeMinPeople(Long MinPeople) {
        this.minPeople = MinPeople;
    }

    public void changeMaxPeople(Long MaxPeople) {
        this.maxPeople = MaxPeople;
    }
    
}
