package com.sbcamping.user.member.service;

import com.sbcamping.domain.Member;
import com.sbcamping.user.member.dto.MemberDTO;
import com.sbcamping.user.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class CustomUserDetailService implements UserDetailsService {

    // 로그인시 실행되는 Spring Security 사용자 인증 서비스 클래스. DB에서 자용자 정보를 조회하는 역할.

    private final MemberRepository memberRepository;

    // 스프링 시큐리티가 로그인할 때 자동으로 호출하는 메서드. 요구하는 UserDetails 객체로 반환
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        log.info("=============loadUserByUsername 도착");
        log.info("=============로그인한 username(=email): {}", username);

        Member member = memberRepository.findByMemberEmail(username).orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        MemberDTO memberDTO = new MemberDTO(
                member.getMemberEmail(),
                member.getMemberPw(),
                member.getMemberName(),
                member.getMemberPhone(),
                member.getMemberGender(),
                member.getMemberBirth(),
                member.getMemberLocal(),
                member.getMemberRole(),
                member.getMemberID(),
                member.getMemberStatus(),
                member.getIsSocial()
        );

        return memberDTO;
    }

    /*
    실행 흐름
    1️⃣ UsernamePasswordAuthenticationFilter가 로그인 요청을 받음
    2️⃣ 내부적으로 AuthenticationManager가 DaoAuthenticationProvider를 호출
    3️⃣          DaoAuthenticationProvider가 CustomUserDetailService.loadUserByUsername()을 실행
    4️⃣          UserDetails(= MemberDTO)가 반환됨
    5️⃣ Security가 비밀번호를 비교하고 인증 성공 여부를 결정
     */


}
