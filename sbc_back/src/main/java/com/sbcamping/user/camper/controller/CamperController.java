package com.sbcamping.user.camper.controller;

import com.sbcamping.common.util.CustomFileUtil;
import com.sbcamping.user.camper.dto.*;
import com.sbcamping.user.camper.service.CamperService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/campers")
public class CamperController {
    private final CamperService camperService;

    private final CustomFileUtil fileUtil;

    /**
     * 게시판 리스트 출력
     *
     * @param 페이징 정보
     */
    @GetMapping("/list")
    public PageResponseDTO<CamperBoardDTO> list(
            PageRequestDTO pageRequestDTO
    ) {
        return camperService.list(pageRequestDTO);
    }

    /**
     * 게시판 상세 페이지
     *
     * @param 게시판 id
     */
    @GetMapping("/{id}")
    public CamperBoardDTO get(
            @PathVariable Long id
    ) {
        return camperService.get(id);
    }

    /**
     * 게시판 수정
     *
     * @param 게시판 id, 수정 정보
     */
    @PutMapping("/{id}")
    public Map<String, String>  modify(
            @RequestHeader(name = "Authorization") String auth,
            @RequestHeader("X-Refresh-Token") String refreshToken,
            @PathVariable("id") Long id, CamperBoardReqDTO camperDTO
    ) {

        log.info("modify....", id);

        CamperBoardDTO oldCamperDTO = camperService.get(id);
        if (oldCamperDTO == null){
            throw  new EntityNotFoundException("게시글을 찾을 수 없습니다.");
        }

        log.info("게시글 수정 전: " + oldCamperDTO);
        camperDTO.setCBoardId(id);

        if (camperDTO.getFile() != null) {
            MultipartFile newFile = camperDTO.getFile();
            String newUploadFileName = fileUtil.saveFile(newFile);
            camperDTO.setCBoardAttachment(newUploadFileName);

            String oldUploadedFileName = oldCamperDTO.getCBoardAttachment();
            if (oldUploadedFileName != null) {
                try {
                    fileUtil.deleteFile(oldUploadedFileName);
                    log.info("삭제완료 " + oldUploadedFileName);
                } catch (Exception e){
                    log.error("파일 삭제 중 오류 발생: " + oldUploadedFileName, e);
                }
            }
        }

        camperService.modify(camperDTO);
        return Map.of("RESULT", "SUCCESS");
    }

    /**
     * 게시판 등록
     *
     * @param 게시판 내용
     */
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
    @PostMapping("/")
    public Map<String, Long> register(CamperBoardDTO camperBoardDTO) {
        log.info("register camper board: {}", camperBoardDTO);
        MultipartFile file = camperBoardDTO.getFile();
        String uploadFileName = fileUtil.saveFile(file);
        camperBoardDTO.setCBoardAttachment(uploadFileName);

        Long id = camperService.register(camperBoardDTO);
        return Map.of("RESULT", id);
    }

    /**
     * 게시판 삭제
     *
     * @param 게시판 id
     */
    @DeleteMapping("/{cBoardId}")
    @Transactional
    public Map<String, String> remove(
            @RequestHeader(name = "Authorization") String auth,
            @RequestHeader("X-Refresh-Token") String refreshToken,
            @PathVariable("cBoardId") Long cBoardId
    ) {
        if (!camperService.isBoardAuth(auth, refreshToken, cBoardId)) {
            return Map.of("res", "F", "code", "403");
        }

        log.info("게시판 삭제");
        try {
            String oldFileName = camperService.get(cBoardId).getCBoardAttachment();
            if (StringUtils.hasText(oldFileName)) {
                fileUtil.deleteFile(oldFileName);
            }

            camperService.remove(cBoardId);

            return Map.of("res", "S");
        } catch (Exception e){
            log.error("Error occurred while deleting file" + e.getMessage(), e);
            throw  e;
        }
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName) {
        return fileUtil.getFile(fileName);
    }

    /**
     * 게시판 검색
     *
     * @param 게시판 id
     */
    @GetMapping("/search")
    public PageResponseDTO<CamperBoardDTO> search(
            PageRequestDTO pageRequestDTO,
            @RequestParam(defaultValue = "title", required = false) String type,
            @RequestParam(required = false) String keyword) {
        return camperService.search(pageRequestDTO, type, keyword);
    }

    /**
     * 댓글 목록
     *
     * @param 댓글 id
     */
    @GetMapping("/comments/{boardId}")
    public List<CamperBoardCommentReqDTO> commentList(
            @PathVariable("boardId") Long boardId
    ) {
        return camperService.getCommentList(boardId);
    }

    /**
     * 댓글 등록
     *
     * @param
     */
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
    @PostMapping("/comments")
    public Map<String, Long> registerComment(
            @RequestHeader(name = "Authorization") String auth,
            @RequestHeader("X-Refresh-Token") String refreshToken,
            @RequestBody CamperBoardCommentDTO dto
    ) {
        log.info("dto : {}", dto.toString());
        Long commentId = camperService.registerComment(auth, refreshToken, dto);
        return Map.of("RESULT", commentId);
    }

    /**
     * 댓글 수정
     *
     * @param
     */
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
    @PutMapping("/comments")
    public Map<String, String> updateComment(
            @RequestHeader(name = "Authorization") String auth,
            @RequestHeader("X-Refresh-Token") String refreshToken,
            @RequestBody CamperBoardCommentDTO dto
    ) {
        if (!camperService.isCommentAuth(auth, refreshToken, dto.getCommentId())) {
            return Map.of("res", "F", "code", "403");
        }

        camperService.modifyComment(dto);
        return Map.of("res", "S");
    }

    /**
     * 댓글 삭제
     *
     * @param
     */
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
    @DeleteMapping("/{cBoardId}/comments/{cCommentId}")
    @Transactional
    public Map<String, String> removeComment(
            @RequestHeader(name = "Authorization") String auth,
            @RequestHeader("X-Refresh-Token") String refreshToken,
            @PathVariable("cCommentId") Long cCommentId,
            @PathVariable("cBoardId") Long cBoardId) {

        log.info("인증 여부 : {}", camperService.isCommentAuth(auth, refreshToken, cCommentId));

        if (!camperService.isCommentAuth(auth, refreshToken, cCommentId)) {
            return Map.of("res", "F", "code", "403");
        }

        camperService.removeComment(cCommentId, cBoardId);
        return Map.of("res", "S");

    }
}
