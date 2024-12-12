package com.sbcamping.user.member.service;

import com.sbcamping.domain.Member;
import com.sbcamping.user.member.repository.MemberRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

@Service
@Transactional
@Slf4j
@AllArgsConstructor
public class LoginServiceImpl implements LoginService {

    private final MemberRepository memberRepository;

    private final PasswordEncoder passwordEncoder;

    // 이메일 보내기
    private final JavaMailSender mailSender;

    // 회원명 + 이메일로 회원 찾기 (비밀번호 찾기 1)
    @Override
    public Member findMemberByNameAndEmail(Member member) {
        Member memResult = memberRepository.findByMemberNameAndMemberEmail(member.getMemberName(), member.getMemberEmail());
        return memResult;
    }

    // 회원 비밀번호 변경 (비밀번호 찾기 2)
    @Override
    public String updatePw(Member mem) {
        // ID로 member 조회
        Member member = memberRepository.findById(mem.getMemberID()).orElse(null);
        String msg = null;
        if(member.getMemberPw() != null && member.getMemberEmail() != null){
            // 비밀번호 변경
            member.changePw(passwordEncoder.encode(mem.getMemberPw()));
            memberRepository.save(member);
            msg = "success";
        } else{
            msg = "fail";
        }
        return msg;
    }

    // 이메일 찾기 (회원명 + 회원 핸드폰번호)
    @Override
    public String findEmail(String memberName, String memberPhone) {
        Member member = memberRepository.findByMemberNameAndMemberPhone(memberName, memberPhone);
        log.info("이메일찾기 : " + member.toString());
        String email;
        if(member == null) {
            email = "이메일을 찾을 수 없습니다.";
        } else{
            email = member.getMemberEmail();
        }
        return email;
    }

    // 회원가입시 이메일 중복 체크
    @Override
    public String emailCheck(String memberEmail) {
        Integer count = memberRepository.countByMemberEmail(memberEmail);
        String msg = "";
        if(count == 0){
            msg = "enable";
        } else{
            msg = "disable";
        }
        return msg;
    }

    // 핸드본 중복 체크
    @Override
    public int phoneCheck(String phone) {
        return memberRepository.countByMemberPhone(phone);
    }

    // 회원 가입
    @Override
    public void addMember(Member member) {
        String pw = passwordEncoder.encode(member.getMemberPw());
        member.changePw(pw);
        memberRepository.save(member);
    }

    // 이메일 보내기 (인증코드)
    @Override
    public String sendEmail(String email) throws NoSuchAlgorithmException, MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);

        // 난수 생성
        StringBuilder code = new StringBuilder();
        String alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        do{
            for(int i = 0; i < 10; i++ ){
                // 0 ~ 35 사이의 난수
                int randomIndex = SecureRandom.getInstanceStrong().nextInt(alphabet.length() + 10);
                // 0~9 숫자인 경우 숫자 그대로 난수에 추가
                if(randomIndex < 10 ){
                    code.append(randomIndex);
                }else{ // 알파벳인 경우 
                    code.append(alphabet.charAt(randomIndex - 10));
                }
            }
        } while (code.length() != 10);


        // 메일 설정 후 전송
        helper.setTo(email);
        helper.setSubject("SB Camping 이메일 인증");
        helper.setText("SB Camping에서 발송한 인증용 메일입니다. \n인증번호 : " + code);
        mailSender.send(mimeMessage);

        return code.toString();
    }
}
