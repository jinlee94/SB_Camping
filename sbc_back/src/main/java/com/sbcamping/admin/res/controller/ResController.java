package com.sbcamping.admin.res.controller;


import com.sbcamping.admin.res.dto.ResDTO;
import com.sbcamping.admin.res.service.ResService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("adminResController")   //관리자 예약컨트롤러
@RequestMapping("/admin/res") // 기본 URL 경로 설정
@RequiredArgsConstructor // 의존성 주입을 위한 생성자 자동 생성
@PreAuthorize("hasRole('ADMIN')")//권한검증-관리자
public class ResController {

    private final ResService resService;


    @GetMapping("/all") // 전체 예약 목록을 가져오는 GET 요청을 처리
    public ResponseEntity<List<ResDTO>> getAllRes() {
        // 서비스의 getAllRes 메서드를 호출하여 모든 사이트 정보를 가져옵니다.
        List<ResDTO> res = resService.getAllRes();

        // 상태 코드 200 (OK)와 함께 사이트 목록을 응답 본문으로 반환하는 코드 아마 요청이 문제없이 처리 됐다고 알리는 코드인듯
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
