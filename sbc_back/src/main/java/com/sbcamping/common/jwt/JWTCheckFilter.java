package com.sbcamping.common.jwt;

import com.google.gson.Gson;
import com.sbcamping.user.member.dto.MemberDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

@Slf4j
public class JWTCheckFilter extends OncePerRequestFilter {

    // front 에서 API 서버로 요청시 JWT 토큰 체크
    // 유효한 JWT 토큰인지 확인하는 필터 클래스
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException {
        log.info("------------------------JWT 체크 필터");
        String authHeaderStr = request.getHeader("Authorization");
        if (authHeaderStr == null) {
            log.info("-------요청이 jwtAxios 인지 확인해보세요");
        }
        try {
            String accessToken = authHeaderStr.substring(7);
            Map<String, Object> claims = JWTUtil.validateToken(accessToken); // 토큰 검증
            log.info("--------JWT Claims : {}", claims);

            // 사용자 정보 추출 (member 내부의 정보)
            Map<String, Object> memberClaims = (Map<String, Object>) claims.get("member");
            String memberEmail = (String) memberClaims.get("memberEmail");
            String memberPw = (String) memberClaims.get("memberPw");
            String memberName = (String) memberClaims.get("memberName");
            String memberPhone = (String) memberClaims.get("memberPhone");
            char memberGender = memberClaims.get("memberGender").toString().charAt(0);
            String memberBirth = (String) memberClaims.get("memberBirth");
            String memberLocal = (String) memberClaims.get("memberLocal");
            // authorities 필드가 List<Map<String, Object>> 형태인 경우 처리
            String memberRole;
            List<Map<String, Object>> authorities = (List<Map<String, Object>>) memberClaims.get("authorities");
            String role = (String) memberClaims.get("memberRole");
            if (authorities != null && !authorities.isEmpty()) {
                // 첫 번째 권한의 authority 값 추출
                memberRole = (String) authorities.get(0).get("authority");
            } else if (role != null) {
                memberRole = role;
            } else {
                throw new RuntimeException("권한 정보가 없습니다.");
            }
            Long memberId = (Long) claims.get("memberId");
            String memberStatus = (String) claims.get("memberStatus");

            MemberDTO memberDTO = new MemberDTO(memberEmail, memberPw, memberName, memberPhone, memberGender, memberBirth, memberLocal, memberRole, memberId, memberStatus);

            log.info("memberDTO.GetAuthorities() : {}", memberDTO.getAuthorities());

            // 인증 객체 생성(사용자 정보와 권한)
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(memberDTO, memberPw, memberDTO.getAuthorities());
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

    // 토큰 체크 예외 설정
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
        if (path.startsWith("/api/auth")) {
            return true;
        }

        // 회원가입 요청 경로 예외
        if (path.equals("/api/members/")) {
            return true;
        }

        // 캠퍼 검색
        if (path.equals("/api/campers/search")) {
            return true;
        }

        // 캠퍼리스트
        if (path.equals("/api/campers/list")) {
            return true;
        }

        // 캠퍼리스트 상세
        if (path.matches("^/api/campers/\\d+$")) {
            return true;
        }

        // 캠퍼리스트 댓글 목록
        if (path.matches("^/api/campers/comments/\\d+$")) {
            return true;
        }

        // 리뷰 게시판 검색
        if (path.equals("/api/review/search")) {
            return true;
        }

        // 리뷰 게시판 리스트
        if (path.equals("/api/review/list")) {
            return true;
        }

        // 나의 예약 내역 확인하기
        if (path.equals("/api/review/reviewCheck")) {
            return true;
        }

        // 리뷰 게시판 상세
        if (path.matches("^/api/review/read/\\d+$")) {
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

        //공지리스트 비회원도 볼 수 있게끔
        if (path.equals("/notices/list")) {
            return true;
        }
        //공지리스트 비회원도 볼 수 있게끔
        if (path.equals("/admin/notices/list")) {
            return true;
        }

        //공지 내용 비회원도 볼 수 있게끔
        if (path.startsWith("/notices/read/")) {
            return true;
        }

        //공지 내용 비회원도 볼 수 있게끔
        if (path.startsWith("/admin/notices/read/")) {
            return true;
        }

        // 문의 게시판 검색
        if (path.equals("/admin/qnas/search")) {
            return true;
        }

        // qna list
        if (path.equals("/admin/qnas/list")) {
            return true;
        }

        // qna read
        if (path.matches("^/admin/qnas/\\d+$")) {
            return true;
        }

        // qna read comments
        if (path.matches("^/admin/qnas/\\d+/comments/list$")) {
            return true;
        }

        // 사진 보여주는거 허용
        if (path.startsWith("/api/campers/view")) {
            return true;
        }

        // 파이썬 이미지 분석
        if (path.equals("/java_service")) {
            return true;
        }

        // 분실물
        if (path.startsWith("/api/lost")){
            return true;
        }

        return false;
    }
}
