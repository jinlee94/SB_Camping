package com.sbcamping.user.member.dto;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.*;
import java.util.stream.Collectors;

@Getter
@ToString
public class MemberDTO extends User {

    // Spring Security User 클래스를 상속받는 memberDTO

    private String memberEmail; // 회원 이메일 (수정불가)
    private String memberPw;
    private String memberName;
    private String memberPhone;
    private char memberGender;
    private String memberBirth;
    private String memberLocal;
    private String memberRole;
    private Long memberId;
    private String memberStatus;

    // 생성자
    public MemberDTO(String email, String memberPw, String memberName, String memberPhone, char memberGender, String memberBirth, String memberLocal, String memberRole, Long memberId, String memberStatus) {
        super(email, memberPw, convertRoleToCollection(memberRole));
        this.memberEmail = email;
        this.memberPw = memberPw;
        this.memberName = memberName;
        this.memberPhone = memberPhone;
        this.memberGender = memberGender;
        this.memberBirth = memberBirth;
        this.memberLocal = memberLocal;
        this.memberRole = memberRole;
        this.memberId = memberId;
        this.memberStatus = memberStatus;
    }

    // 문자열을 Collection 으로 변환하는 메서드
    // 멤버 권한을 1개씩만 사용하여 별도 테이블을 만들지 않기 때문에 String 을 List 로 변환할 때 사용함 (Security 에서 List 를 권장)
    private static Collection<? extends GrantedAuthority> convertRoleToCollection(String memberRole) {
        return Arrays.stream(memberRole.split(","))
                .map(role -> (GrantedAuthority) () -> role) // 각 역할을 GrantedAuthority 로 변환
                .collect(Collectors.toList());
    }


}
