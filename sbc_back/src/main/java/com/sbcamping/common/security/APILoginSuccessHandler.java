package com.sbcamping.common.security;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.sbcamping.common.jwt.JWTUtil;
import com.sbcamping.user.member.dto.JwtMemberDTO;
import com.sbcamping.user.member.dto.MemberDTO;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class APILoginSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("회원 인증 완료, JWT 토큰 저장 중");

        MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();
        JwtMemberDTO jwtMemberDTO = new JwtMemberDTO(memberDTO.getMemberId(),
                memberDTO.getMemberEmail(),
                memberDTO.getMemberName(),
                memberDTO.getMemberRole(),
                memberDTO.getMemberStatus(),
                memberDTO.getIsSocial());

        // 토큰 부여
        Map<String, Object> claims = new HashMap<>();
        claims.put("member", jwtMemberDTO);  // memberDTO 객체 자체를 claims 에 추가
        String accessToken = JWTUtil.generateToken(claims, 10); // ACCESS TOKEN : 10분 유효
        String refreshToken = JWTUtil.generateToken(claims, 60 * 24); // REFRESH TOKEN : 24시간
        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);

        // 멤버정보 JSON 으로 반환
        Gson gson = new GsonBuilder().registerTypeAdapter(LocalDate.class, new LocalDateAdapter()).create();
        String jsonStr = gson.toJson(claims);
        response.setContentType("application/json; charset=utf-8");
        PrintWriter out = response.getWriter();
        out.println(jsonStr);
        out.close();

    }
}
