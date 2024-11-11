package com.sbcamping.common.security;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.sbcamping.common.jwt.JWTUtil;
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
        log.info("------------------■ 로그인 성공 onAuthenticationSuccess");

        MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();

        // 토큰 부여
        Map<String, Object> claims = new HashMap<>();
        claims.put("member", memberDTO);  // memberDTO 객체 자체를 claims 에 추가
        String accessToken = JWTUtil.generateToken(claims, 10); // ACCESS TOKEN : 10분 유효
        String refreshToken = JWTUtil.generateToken(claims, 60 * 12); // REFRESH TOKEN : 12시간
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
