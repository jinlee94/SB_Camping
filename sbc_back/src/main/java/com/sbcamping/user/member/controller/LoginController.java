package com.sbcamping.user.member.controller;

import com.sbcamping.domain.Member;
import com.sbcamping.user.member.service.LoginService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;

    // 1. 회원가입
    @PostMapping("/")
    public void join(@RequestBody Member member){
        loginService.addMember(member);
    }

    // 2. 이메일 중복체크
    @GetMapping("/email")
    public Map<String,String> emailCheck(@RequestParam String email){
        log.info("-----------------이메일 중복 체크 메소드");
        String msg = loginService.emailCheck(email);
        Map<String,String> map = new HashMap<>();
        map.put("msg",msg);
        return map;
    }

    // 3. 핸드폰번호 중복체크
    @GetMapping("/phone")
    public Map<String, Object> phoneCheck(@RequestParam String phone){
        log.info("-------------- 핸드폰번호 중복 체크 메소드{}", phone);
        int result = loginService.phoneCheck(phone);
        Map<String, Object> map = new HashMap<>();
        log.info("핸드폰 중복체크 : " + result);
        map.put("msg", result);
        return map;
    }

    // 4. 이메일 찾기 (회원명 + 회원 핸드폰번호)
    @PostMapping("/email/retrieve")
    public Map<String,String> findEmailByNameAndPhone(@RequestBody Member member){
        log.info("-----------------이메일 찾기 메소드");
        String email = loginService.findEmail(member.getMemberName(), member.getMemberPhone());
        Map<String,String> map = new HashMap<>();
        map.put("memberEmail",email);
        return map;
    }

    // 5. 비밀번호 찾기 - 회원 확인 (회원명 + 회원이메일)
    @PostMapping("/password/retrieve")
    public ResponseEntity<Member> findMemberByNameAndEmail(@RequestBody Member member){
        log.info("--------------비밀번호 찾기 - 회원명 + 이메일로 회원 찾기 메소드");
        Member memResult = loginService.findMemberByNameAndEmail(member);
        return ResponseEntity.ok(memResult);
    }

    // 6. 비밀번호 찾기 - 이메일 보내기
    @GetMapping("/password/sendmail")
    public Map<String, String> sendEmail(@RequestParam String email){
        log.info("----------- 이메일 전송 메소드");
        String code;
         try {
            code = loginService.sendEmail(email);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        Map<String, String> map = new HashMap<>();
        map.put("msg", "전송");
        map.put("code", code);
        return map;
    }

    // 7. 비밀번호 변경
    @PostMapping("/password/update")
    public Map<String, String> modifyPw(@RequestBody Member member){
        log.info("--------------비밀번호 변경 메소드");
        String msg = loginService.updatePw(member);
        HashMap<String,String> map = new HashMap<>();
        map.put("msg",msg);
        return map;
    }
}
