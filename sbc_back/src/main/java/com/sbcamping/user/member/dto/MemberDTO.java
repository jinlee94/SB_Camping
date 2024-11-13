package com.sbcamping.user.member.dto;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
        super(email, memberPw, Arrays.asList(new SimpleGrantedAuthority(memberRole)));
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

}
