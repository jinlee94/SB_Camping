package com.sbcamping.admin.site.controller;

import com.sbcamping.admin.site.dto.SiteDTO;
import com.sbcamping.admin.site.service.SiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.Console;
import java.util.List;

@RestController
@RequestMapping("/admin/site") // 기본 URL 경로 설정
@RequiredArgsConstructor // 의존성 주입을 위한 생성자 자동 생성
@CrossOrigin(origins = "http://localhost:*") //왜갑자기 안됨
@PreAuthorize("hasRole('ADMIN')")//권한검증 -관리자
public class SiteController {

    // 불변 인스턴스변수 선언
    private final SiteService siteService;


    @GetMapping // 전체 사이트 목록을 가져오는 GET 요청을 처리합니다.
    public ResponseEntity<List<SiteDTO>> getAllSites() {
        // 서비스의 getAllSites 메서드를 호출하여 모든 사이트 정보를 가져옵니다.
        List<SiteDTO> sites = siteService.getAllSites();

        // 상태 코드 200 (OK)와 함께 사이트 목록을 응답 본문으로 반환하는 코드 아마 요청이 문제없이 처리 됐다고 알리는 코드인듯
        return new ResponseEntity<>(sites, HttpStatus.OK);
    }



    @PutMapping("/{id}") // HTTP PUT 요청을 처리하며, URL 경로의 {id} 부분을 변수로 받습니다.
    public ResponseEntity<Void> updateSite(
            //PathVariable = url에서 매개변수를 매핑명으로 사용 할 때 ~를 매개변수로 지정하겠다 라고 지정해주는 아노테이션
            @PathVariable("id") Long siteId, // URL에서 전달되는 사이트 ID를 변수로 받습니다.
            @RequestBody @Validated SiteDTO siteDTO) { // 요청 본문에서 JSON 데이터를 SiteDTO 객체로 변환하며, 유효성 검사를 수행합니다.

        // 서비스의 updateSite 메서드를 호출하여, 사이트 ID와 수정할 정보가 담긴 SiteDTO를 전달합니다.
        siteService.updateSite(siteId, siteDTO);

        // 상태 코드 204 (NO_CONTENT)를 반환하여 요청이 성공적으로 처리되었지만, 응답 본문에 내용이 없음을 나타냅니다.
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
