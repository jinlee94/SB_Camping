package com.sbcamping.user.member.service;

import com.sbcamping.domain.Member;
import com.sbcamping.user.member.dto.MemberDTO;
import jakarta.mail.MessagingException;

import java.security.NoSuchAlgorithmException;

public interface LoginService {
    int phoneCheck(String phone);
    String emailCheck(String memberEmail);
    String findEmail(String memberName, String memberPhone);
    Member findMemberByNameAndEmail(Member member);
    String sendEmail(String email) throws NoSuchAlgorithmException, MessagingException;
    String updatePw(Member mem);
    void addMember(Member member);
    Member getKakaoMember(String accessToekn);
}
