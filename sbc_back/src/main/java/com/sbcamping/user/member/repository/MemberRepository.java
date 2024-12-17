package com.sbcamping.user.member.repository;

import com.sbcamping.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    // 이메일로 회원 찾기
    Optional<Member> findByMemberEmail(String email);

    // 이메일 중복체크 (회원가입)
    Integer countByMemberEmail(String memberEmail);

    // 핸드폰 번호 중복체크 (회원가입)
    Integer countByMemberPhone(String phone);

    // 이름 & 핸드폰 번호로 회원 확인 (이메일 찾기)
    Member findByMemberNameAndMemberPhone(String memberName, String memberPhone);

    // 이름 & 이메일로 회원 확인 (비밀번호 찾기)
    Member findByMemberNameAndMemberEmail (String memberName, String memberEmail);


}
