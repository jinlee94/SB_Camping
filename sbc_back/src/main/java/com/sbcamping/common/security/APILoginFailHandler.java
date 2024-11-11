package com.sbcamping.common.security;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import java.io.IOException;
import java.util.Map;

@Slf4j
public class APILoginFailHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException authenticationException) throws IOException, ServletException {
        log.info("----------------로그인 실패 : {}", String.valueOf(authenticationException));
        Gson gson = new Gson();
        String gsonStr = gson.toJson(Map.of("error", "LOGIN_ERROR"));

        response.setContentType("application/json");
        response.getWriter().println(gsonStr);
    }
}
