package com.sbcamping.domain;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

@Entity
@Getter
@Table
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, name = "MEMBER_ID", columnDefinition = "NUMBER(10,0)")
    private Long memberID;          // 회원 번호 (자동생성)

    @Column(length = 50, nullable = false, unique = true)
    private String memberEmail;     // 회원 이메일

    @Column(name = "Member_Password", length = 200, nullable = false)
    private String memberPw;        // 회원 비밀번호

    @Column(length = 10, nullable = false)
    private String memberName;      // 회원 명

    @Column(length = 11, nullable = false, unique = true)
    private String memberPhone;     // 회원 핸드폰번호

    @Column(nullable = false, length = 1)
    private char memberGender;      // 회원 성별

    @Column(length = 8, nullable = false)
    private String memberBirth;     // 회원 생년월일

    @Column(length = 30, nullable = false)
    private String memberLocal;     // 회원 지역

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private LocalDate memberRegDate; // 회원 등록일

    @Column(nullable = false, length = 3, columnDefinition = "CHAR(3)")
    @Builder.Default
    private String memberStatus = "ON"; // 회원 상태

    @Column(length = 10, nullable = false)
    @Builder.Default
    private String memberRole = "ROLE_USER"; // 회원 권한

    // 권한을 리스트 형태로 변환하는 메서드
    public List<String> getMemberRolesAsList(String memberRole) {
        return Arrays.asList(memberRole.split(",")); // 콤마로 구분된 문자열을 리스트로 변환
    }

    @PrePersist
    protected void onCreate() {
        if (this.memberRegDate == null) {
            this.memberRegDate = LocalDate.now();
        }
    }

    public void changePw(String newPw) { this.memberPw = newPw; }

    public void changeName(String newName) {
        this.memberName = newName;
    }

    public void changeGender(char newGender) {
        this.memberGender = newGender;
    }

    public void changeBirth(String newBirth) {
        this.memberBirth = newBirth;
    }

    public void changeLocal(String newLocal) {
        this.memberLocal = newLocal;
    }

    public void changePhone(String newPhone) {
        this.memberPhone = newPhone;
    }

    public void changeStatus(String newStatus) { this.memberStatus = newStatus; }

}