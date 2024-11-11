package com.sbcamping.user.member.controller;

import com.sbcamping.domain.Member;
import com.sbcamping.user.member.dto.MemberDTO;
import com.sbcamping.user.member.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@SpringBootTest
class AdminMemberControllerTest {

    @Autowired
    MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("멤버 생성하기")
    public void join() {
        Member member = Member.builder()
                .memberEmail("test12@gmail.com")
                .memberName("이길동")
                .memberBirth("20001010")
                .memberGender('M')
                .memberPw(passwordEncoder.encode("1234"))
                .memberPhone("01012341234")
                .memberLocal("서울")
                .build();
        memberRepository.save(member);

        System.out.println("테스트완료");
        System.out.println(member);
    }

    @Test
    @DisplayName("회원 정보 가져오기")
    public void getMember(){
        Member member = memberRepository.findByMemberEmail("test1234@gmail.com");
        System.out.println(member);
    }

    @Test
    @DisplayName("회원 수정")
    public void modifyMember(){
        Member member = memberRepository.findById(21L).get();
        member.changeGender('W');
        memberRepository.save(member);
    }



}