package com.sbcamping.user.review.controller;

import com.sbcamping.admin.common.dto.PageRequestDTO;
import com.sbcamping.admin.common.dto.PageResponseDTO;
import com.sbcamping.common.util.CustomFileUtil;
import com.sbcamping.domain.Reservation;
import com.sbcamping.user.review.dto.ReviewDTO;
import com.sbcamping.user.review.dto.ReviewReqDTO;
import com.sbcamping.user.review.service.ReviewService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController("userReviewController")    //사용자 리뷰 게시판
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private final ReviewService service;

    private final CustomFileUtil fileUtil;

    // 1. 목록(list)
    @GetMapping("/list")
    public PageResponseDTO<ReviewDTO> list(PageRequestDTO requestDTO) {
        log.info("list...........", requestDTO);
        return service.getList(requestDTO);
    }
    
    // 2. 검색(search)
    @GetMapping("/search")
    public PageResponseDTO<ReviewDTO> search(PageRequestDTO requestDTO, 
                                             @RequestParam(defaultValue = "title", required = false) String type,
                                             @RequestParam(required = false) String keyword) {
        log.info("search result list..... : ", requestDTO);
        return service.searchReview(requestDTO, type, keyword); // 기본 정렬 : reviewId 내림차순
    }

    // 3. 나의 예약 페이지 조회
    @PostMapping("/reviewCheck")
    public List<Reservation> reviewCheck(@RequestBody Long memberId) {
        List<Reservation> resData = service.reviewCheck(memberId);

        return resData;
    }

    // 4. 등록
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
    @PostMapping("/")
    public Map<String, Long> register(ReviewReqDTO reviewDTO) {
        log.info("register...........{}", reviewDTO);
        MultipartFile file = reviewDTO.getFile();
        String uploadFileName = fileUtil.saveFile(file);
        reviewDTO.setReviewAttachment(uploadFileName);
        log.info(uploadFileName);

        Long reviewId = service.register(reviewDTO);
        return Map.of("Result", reviewId);
    }

    // 5. 상세
    @GetMapping("/read/{reviewId}")
    public ReviewDTO read(@PathVariable Long reviewId) {
        log.info("read...........", reviewId);

        return service.get(reviewId);
    }

    // 6. 삭제
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
    @DeleteMapping("delete/{reviewId}")
    @Transactional
    public Map<String, String> remove(@PathVariable Long reviewId) {
        try {
            String oldFileName = service.get(reviewId).getReviewAttachment();

            service.remove(reviewId);
            fileUtil.deleteFile(oldFileName);

            return Map.of("RESULT", "SUCCESS");
        } catch (Exception e) {
            log.error("Error during deletion", e.getMessage(), e);
            throw e;
        }
    }

    // 7. 수정
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
    @PutMapping("/modify/{reviewId}")
    public Map<String, String> modify(@PathVariable Long reviewId, ReviewReqDTO reviewDTO) {
        log.info("modify...........", reviewId);

        ReviewDTO oldReviewDTO = service.get(reviewId);
        if (oldReviewDTO == null) {
            throw new EntityNotFoundException("게시글을 찾을수가 없엉");
        }

        log.info("게시글 수정 전:", oldReviewDTO);
        reviewDTO.setReviewID(reviewId);

        if (reviewDTO.getFile() != null) {
            MultipartFile file = reviewDTO.getFile();
            String newUploadedFileName = fileUtil.saveFile(file);
            reviewDTO.setReviewAttachment(newUploadedFileName);

            String oldUploadedFileName = oldReviewDTO.getReviewAttachment();
            if (oldUploadedFileName != null) {
                try {
                    fileUtil.deleteFile(oldUploadedFileName);
                    log.info("삭제완료", oldUploadedFileName);
                } catch (Exception e) {
                    log.error("파일 삭제 중 오류 발생:", oldUploadedFileName, e);
                }
            }
        }

        service.modify(reviewDTO);
        return Map.of("RESULT", "SUCCESS");
    }
}
