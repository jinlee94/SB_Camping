package com.sbcamping.user.reservation.dto;

import com.sbcamping.domain.Member;
import com.sbcamping.domain.Site;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationDTO {

    private String resId;
    private String resUserName;
    private String resUserPhone;
    private Long resPeople;
    private LocalDate checkinDate;
    private LocalDate checkoutDate;
    private Long resTotalPay;
    private MemberDTO member;
    private SiteDTO site;

}
