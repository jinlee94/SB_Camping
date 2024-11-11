package com.sbcamping.admin.notice.controller;

import com.sbcamping.admin.notice.dto.NoticeDTO;
import com.sbcamping.admin.notice.service.NoticeService;

import com.sbcamping.domain.NoticeBoard;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Not;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") //cors정책이라는데 그게 뭐임
@RestController
@RequestMapping("/admin/notices") // 기본 URL 경로 설정
@RequiredArgsConstructor // 의존성 주입을 위한 생성자 자동 생성
public class NoticeController {

    //불변 인스턴스변수 선언
    private final NoticeService noticeService;

    // 메인페이지 공지 최신글
    @GetMapping("/main/list")
    public ResponseEntity<List<NoticeBoard>> getThreeNotices() {
        List<NoticeBoard> notices = noticeService.getLatestThreeNotices();
        return new ResponseEntity<>(notices, HttpStatus.OK);
    }

    // 모든 공지글 목록을 가져오는 GET 요청 방식 처리 메서드
    @GetMapping("/list")
    public ResponseEntity<List<NoticeDTO>> getAllNotices() {
        // 서비스의 getAllSites 메서드를 호출하여 모든 사이트 정보를 가져옵니다.
        List<NoticeDTO> notices = noticeService.getAllNotices();

        // 상태 코드 200 (OK)와 함께 사이트 목록을 응답 본문으로 반환하는 코드 아마 요청이 문제없이 처리 됐다고 알리는 코드인듯
        return new ResponseEntity<>(notices, HttpStatus.OK);
    }

    //공지글 생성 post입력 방식 메서드
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")//권한검증-관리자
    public ResponseEntity<Void> createNotice(@RequestBody @Validated NoticeDTO noticeDTO) {
        noticeService.createNotice(noticeDTO.getNboardTitle(), noticeDTO.getNboardContent());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    //공지글 번호를 매개변수로 받아서 get방식으로 id에 해당하는 필드를 불러온다
    @GetMapping("read/{id}")
    public ResponseEntity<NoticeDTO> readNotice(@PathVariable("id") Long noticeId) {
        NoticeDTO noticeDTO = noticeService.readNotice(noticeId);
        return new ResponseEntity<>(noticeDTO, HttpStatus.OK);
    }

    //공지글 번호를 매개변수로 받아서 put방식으로 id에 해당하는 필드값을 수정한다
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")//권한검증-관리자
    public ResponseEntity<String> updateNotice(
            @PathVariable("id") Long noticeId,
            @RequestBody @Validated NoticeDTO noticeDTO) {
        try {
            // 공지사항 수정 로직
            noticeService.updateNotice(noticeId, noticeDTO.getNboardTitle(), noticeDTO.getNboardContent());

            // 200 OK와 성공 메시지 반환
            return ResponseEntity.ok("공지사항이 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            // 400 Bad Request와 오류 메시지 반환
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("공지사항 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }


    //공지글 번호를 매개변수로 받아서 id에 해당하는 로우를 삭제한다
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")//권한검증-관리자
    public ResponseEntity<Void> deleteNotice(@PathVariable("id") Long noticeId) {
        noticeService.deleteNotice(noticeId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
