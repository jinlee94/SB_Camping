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

    // Spring Security 유저 인증

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        log.info("=============loadUserByUsername 도착");
        log.info("=============username: " + username);

        Member member = memberRepository.findByMemberEmail(username).get();

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


}
