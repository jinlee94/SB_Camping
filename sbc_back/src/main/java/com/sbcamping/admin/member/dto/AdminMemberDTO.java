package com.sbcamping.admin.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminMemberDTO {

    private Long memberID; // 회원 번호

    private String memberEmail; // 회원 이메일

    private String memberName; // 회원 명

    private String memberPhone; // 회원 핸드폰번호

    private char memberGender; // 회원 성별

    private String memberBirth; // 회원 생년월일

    private String memberLocal; // 회원 지역

    private LocalDate memberRegDate; // 회원 등록일

    private String memberStatus; // 회원 상태 (휴면 off)

    private String memberRole; // 회원 권한 (ROLE_MEMBER, ROLE_ADMIN)

}
