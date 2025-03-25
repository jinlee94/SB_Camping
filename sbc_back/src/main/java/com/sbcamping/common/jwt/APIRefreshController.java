package com.sbcamping.common.jwt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class APIRefreshController {

    // 토큰 유효성 검증 후 만료됐으면 리프레쉬 토큰 검증후 액세스토큰 발급하는 메소드
    @GetMapping("/api/auth/refresh")
    public Map<String, Object> refresh(@RequestHeader("Authorization") String authHeader,
                                       @RequestHeader("X-Refresh-Token") String refreshToken) {

        if(refreshToken == null){
            throw new CustomJWTException("NULL_REFRESH_TOKEN");
        }
        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new CustomJWTException("INVALID_REFRESH_TOKEN");
        }

        String accessToken = authHeader.substring(7);

        // Access 토큰이 만료되지 않았다면 PASS, 기존 값 반환하고 메소드 종료
        if(!checkExpiredToken(accessToken)){
            return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
        }

        // 토큰이 만료됐다면 Refresh 토큰 검증 후 새로운 토큰 발급
        Map<String, Object> claims = JWTUtil.validateToken(refreshToken);
        log.info("----------------refresh 토큰 발급 claims : {}", claims);
        String newAccessToken = JWTUtil.generateToken(claims, 10);
        String newRefreshToken = checkTime((Integer) claims.get("exp")) ?
                JWTUtil.generateToken(claims, 60 * 12) : refreshToken; // 리프레쉬 토큰 유효시간이 1시간 미만이면 새로 발급
        return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken);
    }

    // 리프레쉬 토큰 남은 유효 시간 확인하는 메소드 (1시간 미만인지)
    private boolean checkTime(Integer exp){
        Date expDate = new Date(exp * 1000); // 밀리초로 변환
        long gap = expDate.getTime() - System.currentTimeMillis(); // 만료시간 - 현재시간
        long leftMin = gap / (1000 * 60); // 분 단위로 변환
        return leftMin < 60;
    }

    // 토큰 만료되었는지 검증하는 메소드 
    // (만료되었으면 true, 아직 시간남았으면 false)
    private boolean checkExpiredToken(String accessToken) {
        log.info("token 검증");
        try {
            JWTUtil.validateToken(accessToken);
            return false; // 사용할 수 있는 토큰이면 false 반환
        } catch (CustomJWTException e) {
            if (e.getMessage().equals("Expired")){ // 만료되었으면 true 반환
                return true;
            } else{
                log.info(e.getMessage());
                throw e;
            }
        }
    }
}
