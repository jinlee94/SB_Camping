package com.sbcamping.user.member.service;

import com.sbcamping.domain.Member;
import com.sbcamping.user.member.dto.MemberDTO;
import com.sbcamping.user.member.repository.MemberRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@AllArgsConstructor
public class LoginServiceImpl implements LoginService {

    private final MemberRepository memberRepository;

    private final PasswordEncoder passwordEncoder;

    // 이메일 보내기
    private final JavaMailSender mailSender;

    // 카카오 로그인 호출
    @Override
    public Member getKakaoMember(String accessToken) {
        // 사용자정의 메소드
        String email = getEmailFromKakaoAccessToken(accessToken);
        log.info("카카오 로그인 : {}", email);
        Optional<Member> result = memberRepository.findByMemberEmail(email);
        if(result.isPresent()){
            log.info("카카오 로그인, 등록된 회원");
            return result.get();
        }
        Member socialMember = makeSocialMember(email);
        memberRepository.save(socialMember);
        log.info("카카오 로그인, 신규 회원");
        Member member = socialMember;

        return member;
    }

    // 카카오 회원 등록
    private Member makeSocialMember(String email) {
        String tempPassword = passwordEncoder.encode(makeTmepPassword());
        Member member = Member.builder().memberEmail(email).memberPw(tempPassword).memberName("소셜회원").memberRole("ROLE_USER").isSocial("Y").build();
        return member;
    }

    // 카카오 회원가입시 임시비밀번호 생성
    private String makeTmepPassword() {
        StringBuffer buffer = new StringBuffer();
        for(int i = 0; i < 10; i ++){
            // 65부터 119까지의 ASCII 값을 무작위로 생성
            buffer.append((char) ((int) (Math.random() * 55) +65));
        }
        return buffer.toString();
    }

    // 카카오 사용자 정보 요청
    private String getEmailFromKakaoAccessToken(String accessToken) {
        String kakaoGutUserURL = "https://kapi.kakao.com/v2/user/me";
        if(accessToken == null){
            throw new RuntimeException("Access Token is null");
        }
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGutUserURL).build();

        ResponseEntity<LinkedHashMap> response = restTemplate.exchange(uriBuilder.toString(), HttpMethod.GET, entity, LinkedHashMap.class);

        log.info("response : {}", response);

        LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();
        log.info("bodyMap : {}", bodyMap);

        LinkedHashMap<String, String> kakaoAccount = bodyMap.get("kakao_account");
        log.info("kakaoAccount : " + kakaoAccount);

        return kakaoAccount.get("email");

    }


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
