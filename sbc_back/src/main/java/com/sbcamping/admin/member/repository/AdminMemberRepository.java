package com.sbcamping.admin.member.repository;

import com.sbcamping.domain.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AdminMemberRepository extends JpaRepository<Member, Long> {

    // 휴면회원 리스트
    @Query("select m from Member m where m.memberStatus in ('OFF','X')")
    Page<Member> selectInactive(Pageable pageable);

    // 회원 검색 (1) 회원명
    Page<Member> findByMemberNameContaining(String name, Pageable pageable);

    // 회원 검색 (2) 핸드폰 뒷자리
    Page<Member> findByMemberPhoneEndingWith(String phone, Pageable pageable);

    // 회원 검색 (3) 이메일
    Page<Member> findByMemberEmailContaining(String email, Pageable pageable);

}
