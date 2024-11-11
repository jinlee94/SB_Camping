package com.sbcamping.admin.res.dto;

import com.sbcamping.admin.member.dto.AdminMemberDTO;
import com.sbcamping.admin.site.dto.SiteDTO;
import com.sbcamping.domain.Member;
import com.sbcamping.domain.Site;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data //Getter,Setter,equals,hashCode,toString자동 생성
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResDTO {   //엔티티의 타입과 일치시켜야함

    private String resId; // 예약 번호
    private String resUserName; // 예약자 명
    private String resUserPhone; // 예약자 핸드폰 번호
    private Long resPeople; // 인원수
    private LocalDate checkinDate; // 입실 날짜
    private LocalDate checkoutDate; // 퇴실 날짜
    private LocalDate resDate;// 예약 날짜
    private String resStatus = "예약완료"; // 예약 상태
    private Long resTotalPay; // 결제금액
    private LocalDate resCancelDate; // 취소날짜
    private String resCancelReason; // 취소사유
    private char resReview = 'N'; // 리뷰 작성 여부
    private Member member;  //fk
    private Site site;  //fk


}
