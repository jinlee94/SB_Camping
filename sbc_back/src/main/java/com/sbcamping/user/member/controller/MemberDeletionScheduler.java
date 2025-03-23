package com.sbcamping.user.member.controller;

import com.sbcamping.domain.Member;
import com.sbcamping.user.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class MemberDeletionScheduler {

    private final MemberRepository memberRepository;

    // 탈퇴한지 30일 지나면 이메일 정보 삭제
    @Scheduled(cron = "0 */1 * * * *") // 매일 자정 실행
    public void deleteMembers(){
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30); // 30일전 날짜 계산
        List<Member> memberToEmailDelete = memberRepository.findByMemberStatusAndMemberLeaveDateBefore("OFF", thirtyDaysAgo);
        for(Member member : memberToEmailDelete){
            member.changeEmail("탈퇴한회원" + member.getMemberID());
        }
        memberRepository.saveAll(memberToEmailDelete);
        log.info("30일 지난 탈퇴 회원 이메일 삭제 : {}명", memberToEmailDelete.size());
    }
}
