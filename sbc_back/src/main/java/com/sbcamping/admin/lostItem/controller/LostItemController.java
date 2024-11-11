package com.sbcamping.admin.lostItem.controller;

import com.sbcamping.admin.common.dto.PageRequestDTO;
import com.sbcamping.admin.common.dto.PageResponseDTO;
import com.sbcamping.admin.lostItem.dto.LostItemDTO;
import com.sbcamping.admin.lostItem.service.LostItemService;
import com.sbcamping.admin.qna.dto.QnaDTO;
import com.sbcamping.common.util.CustomFileUtil;
import com.sbcamping.domain.LostItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
public class LostItemController {


    private final WebClient webClient; // src > common > config > WebClientConfig.class (파이썬 서버와 연결)

    private final LostItemService lostItemService;

    private final CustomFileUtil fileUtil;


    // 1. 파이썬 이미지 분석
    @PostMapping("/java_service")
    public String serviceRequest(MultipartFile file, String message) {
        // 멀티파트 폼 데이터 구성
        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
        bodyBuilder.part("message", message);
        bodyBuilder.part("file", file.getResource());

        // 파이썬 결과를 String 으로 반환
        return webClient.post().uri("/detect")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                .retrieve()
                .bodyToMono(String.class)// 본문을 String 타입으로 변환
                .block(); // 비동기 처리를 동기적으로 block 해서 결과 반환
    }

    // 2. 분실물 등록
    @PostMapping("/api/lost/")
    public Map<String, Long> addItem(LostItemDTO lostItemDTO) {
        log.info("------------ 분실물 등록 메소드 : {}" , lostItemDTO);
        // 파일 객체 이름으로 저장
        MultipartFile file = lostItemDTO.getFile();
        String uploadFileName = fileUtil.saveFile(file);
        lostItemDTO.setItemImage(uploadFileName);
        lostItemDTO.setState("보관중");
        // DB 저장
        Long itemId = lostItemService.addItem(lostItemDTO);
        return Map.of("itemId", itemId);
    }

    // 3. 분실물 수정
    @PutMapping("/api/lost/{itemId}")
    public Map<String, Long> updateItem(@PathVariable Long itemId, @RequestBody LostItemDTO lostItemDTO) {
        log.info("------------ 분실물 수정 메소드 : {}" + itemId + "dto : ", lostItemDTO);
        Long savedItemId = lostItemService.updateItem(itemId, lostItemDTO);
        return Map.of("itemId", savedItemId);
    }

    // 4. 전체 목록
    @GetMapping("/api/lost/list")
    public PageResponseDTO<LostItem> list(PageRequestDTO pageRequestDTO) {
        log.info("----------- 분실물 목록" + pageRequestDTO);
        return lostItemService.getList(pageRequestDTO);
    }

    // 5. 삭제
    @DeleteMapping("/api/lost/{itemId}")
    public void deleteItem(@PathVariable Long itemId) {
        log.info("--------- 삭제 메소드 {}", itemId);
        lostItemService.deleteItem(itemId);
    }

    // 6. 검색
    @GetMapping("/api/lost/search")
    public PageResponseDTO<LostItem> searchQna(PageRequestDTO pageRequestDTO,
                                             @RequestParam(defaultValue = "category", required = false) String type,
                                             @RequestParam(required = false) String keyword) {
        log.info("-----------분실물 검색 : {} , {} ", type, keyword);
        return lostItemService.search(pageRequestDTO, type, keyword);  // 기본 정렬 : qBoardID 내림차순

    }

    // 4-1. 이미지 보기
    @GetMapping("/api/lost/view/{fileName}")
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName) {
        return fileUtil.getFile(fileName);
    }



}
