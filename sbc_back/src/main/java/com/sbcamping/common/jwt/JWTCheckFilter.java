package com.sbcamping.common.jwt;

import com.google.gson.Gson;
import com.sbcamping.user.member.dto.JwtMemberDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Map;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class JWTCheckFilter extends OncePerRequestFilter {

    // 회원의 요청이 오면 유효한 JWT 토큰인지 확인하는 필터 클래스
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException {
        log.info("------------------------JWT 유효성 체크 필터");
        String authHeaderStr = request.getHeader("Authorization");
        if (authHeaderStr == null) {log.info("-------헤더 정보에 Authorization 누락됨");}
        try {
            String accessToken = authHeaderStr.substring(7);

            Map<String, Object> claims = JWTUtil.validateToken(accessToken); // 토큰 검증
            log.info("--------JWT Claims : {}", claims);
            // 사용자 정보 추출 (member 내부의 정보)
            Map<String, Object> memberClaims = (Map<String, Object>) claims.get("member");
            Long memberId = (Long) claims.get("memberId");
            String memberEmail = (String) memberClaims.get("memberEmail");
            String memberName = (String) memberClaims.get("memberName");
            String memberStatus = (String) memberClaims.get("memberStatus");
            String memberRole = (String) memberClaims.get("memberRole");
            String isSocial = (String) memberClaims.get("isSocial");
            JwtMemberDTO jwtMemberDTO = new JwtMemberDTO(memberId,memberEmail,memberName,memberRole,memberStatus,isSocial);

            // 인증 객체 생성(사용자 정보와 권한) JWT 인증 방식에서는 비밀번호 필요 없어서 null
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(jwtMemberDTO,null, Arrays.asList(new SimpleGrantedAuthority(memberRole)));
            // 사용자의 인증 상태 저장 (인증 완료)
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.info("------------------JWT 체크 오류 : {}", e.getMessage());
            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.println(msg);
            out.close();
        }
    }

    // 토큰 필터 제외 설정
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // preflight 요청은 체크하지 않음
        // preflight 란 CORS 상황에서 보안을 확인하기 위해 브라우저가 제공하는 기능
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        // 경로 체크
        String path = request.getRequestURI();
        log.info("URL CHECK : {}", path);

        // api/auth/ 경로의 호출은 체크하지 않음 (로그인 요청할 때는 JWT 토큰이 없는 상태이기에 하는 설정)
        if (path.startsWith("/api/auth") || path.equals("/api/members/")) {
            return true;
        }

        // 캠퍼 게시판 검색, 리스트, 상세, 댓글
        if (path.equals("/api/campers/search") || path.equals("/api/campers/list") || path.matches("^/api/campers/\\d+$") || path.matches("^/api/campers/comments/\\d+$")) {
            return true;
        }

        // 리뷰 게시판 검색, 리스트, 상세, 예약리스트
        if (path.equals("/api/review/search") || path.equals("/api/review/list") || path.matches("^/api/review/read/\\d+$") || path.equals("/api/review/reviewCheck")) {
            return true;
        }

        // 예약내역 확인
        if (path.startsWith("/api/res")) {
            return true;
        }

        // 메인페이지 공지 최신글 3개
        if(path.equals("/admin/notices/main/list")){
            return true;
        }

        //공지리스트, 상세 비회원도 볼 수 있게끔
        if (path.equals("/notices/list") || path.equals("/admin/notices/list") || path.startsWith("/notices/read/") || path.startsWith("/admin/notices/read/")) {
            return true;
        }

        // 문의 게시판 검색
        if (path.equals("/admin/qnas/search") || path.equals("/admin/qnas/list") || path.matches("^/admin/qnas/\\d+$") || path.matches("^/admin/qnas/\\d+/comments/list$")) {
            return true;
        }

        // 이미지 허용
        if (path.startsWith("/api/campers/view")) {
            return true;
        }

        // 파이썬 이미지 분석
        if (path.equals("/java_service")) {
            return true;
        }

        // 분실물 게시판
        if (path.startsWith("/api/lost")){
            return true;
        }

        return false;
    }
}
