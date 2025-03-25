package com.sbcamping.common.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.SecretKey;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

@Slf4j
public class JWTUtil {

    // 암호키
    private static final String key = "231564156asdfasd48456123sf546e132sdf44354";

    // 토큰 생성
    public static String generateToken(Map<String, Object> valueMap, int min) {
        SecretKey key; // JWT 서명을 위한 키 변수 선언
        try {
            // 전역변수로 미리 선언된 key 문자열을 바이트 배열로 변환하여 키 생성 후 getBytes() HMAC-SHA 기반의 서명 키 생성 hmacShaKeyFor()
            // HMAC-SHA : 해시 함수를 이용해서 메시지 인증 코드를 구성하는 것. (HS256)
            key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));
        } catch (Exception e){
            throw new RuntimeException(e.getMessage() + " JWT 토큰 생성 중 문제 발생");
        }

        // JWT 객체를 생성하는 빌더 패턴 사용
        return Jwts.builder()
                .setHeader(Map.of("typ", "JWT")) // JWT의 헤더 부분 설정, typ이 key이며  JWT가 value이다. JWT 토큰임을 명시하는 것.
                .setClaims(valueMap) // 페이로드 추가. 사용자의 정보를 포함하는 부분. ("member", jwtMemberDTO)
                .setIssuedAt(Date.from(ZonedDateTime.now().toInstant())) // 토큰의 발급시간 설정. 현재 시간을 UTC 표준으로 변환, Date 객체로 변환하여 저장
                .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant())) // 토큰 만료시간 설정. 현재 시간에서 min분 후로 설정
                .signWith(key) // 위에서 생성한 비밀 key로 서명 추가. HS256 알고리즘 사용
                .compact(); // JWT를 문자열 형태로 변환 후 반환

    }

    // 토큰 검증
    public static Map<String, Object> validateToken(String token) {
        Map<String, Object> claim;
        try {
            // JWT 서명 검증을 위한 비밀 키 생성 (토큰을 생성할 때 사용한 것과 같은 키 필요)
            SecretKey key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));

            // JWT 파서 빌더 패턴
            claim = Jwts.parserBuilder()
                    .setSigningKey(key) // 비밀 키를 사용하여 서명 검증 수행
                    .build()
                    .parseClaimsJws(token) // 토큰을 파싱하고 서명 검증
                    .getBody(); // 토큰에 포함된 클레임(페이로드 부분) 추출
            //log.info("--------validateToken claim : {}", claim);
            // 토큰이 유효하지 않으면 예외 발생
        } catch (MalformedJwtException e) { // 전달되는 토큰의 값이 유효하지 않을 때 발생
            throw new CustomJWTException("MalFormed");
        } catch (ExpiredJwtException e) { // 유효기간 초과
            throw new CustomJWTException("Expired");
        } catch (InvalidClaimException e) { // 클레임이 유효하지 않음
            throw new CustomJWTException("Invalid");
        } catch (JwtException e){ // JWT 관련 모든 예외
            throw new CustomJWTException("JWT 예외 발생");
        } catch (Exception e) {
            throw new CustomJWTException("JWT 검증 중 ERROR 발생 & key 확인");
        }
        // 유효한 토큰이면 내부 데이터 다시 반환
        return claim;
        
    }

}
