package com.sbcamping.admin.qna.controller;

import com.sbcamping.admin.common.dto.PageRequestDTO;
import com.sbcamping.admin.common.dto.PageResponseDTO;
import com.sbcamping.admin.qna.dto.QnaCommentDTO;
import com.sbcamping.admin.qna.dto.QnaCommentReqDTO;
import com.sbcamping.admin.qna.dto.QnaDTO;
import com.sbcamping.admin.qna.dto.QnaReqDTO;
import com.sbcamping.admin.qna.service.QnaService;
import com.sbcamping.common.util.CustomFileUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/admin/qnas")
public class QnaController {

    @Autowired
    private final QnaService qnaService;

    private final CustomFileUtil fileUtil;

    // 1. 목록(list)
    @GetMapping("/list")
    public PageResponseDTO<QnaDTO> list(PageRequestDTO pageRequestDTO) {
        log.info("list.............." + pageRequestDTO);
        return qnaService.getList(pageRequestDTO);
    }

    // 2. 등록 : ROLE에 따라서 게시글 또는 자주하는 질문으로 뷰에서 표시됨 -> Question_Board 공지여부 컬럼(Qboard_notice)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
    @PostMapping("/")
    public Map<String, Long> register(QnaReqDTO qnaDTO) {
        log.info("register............." + qnaDTO);
        MultipartFile file = qnaDTO.getFile();
        String uploadFileName = fileUtil.saveFile(file);
        qnaDTO.setQBoardAttachment(uploadFileName);
        log.info(uploadFileName);

        Long qbId = qnaService.register(qnaDTO);
        return Map.of("RESULT", qbId);
    }

    // 3. 상세
    @GetMapping("/{qbID}")
    public QnaDTO read(@PathVariable("qbID") Long qbID) {
        return qnaService.get(qbID); }

    // 4. 수정 (Update)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
    @PutMapping("/mod/{qbID}")
    public Map<String, String> modify(@PathVariable("qbID") Long qbID, QnaReqDTO qnaDTO) {
        QnaDTO oldQnaDTO = qnaService.get(qbID);
        if (oldQnaDTO == null) {
            throw new EntityNotFoundException("게시글을 찾을 수 없습니다.");
        }

        log.info("게시글 수정 전: " + oldQnaDTO);
        qnaDTO.setQBoardID(qbID);

        if (qnaDTO.getFile() != null) {
            MultipartFile newFile = qnaDTO.getFile();
            String newUploadedFileName = fileUtil.saveFile(newFile);
            qnaDTO.setQBoardAttachment(newUploadedFileName);

            String oldUploadedFileName = oldQnaDTO.getQBoardAttachment();
            if (oldUploadedFileName != null) {
                try {
                    fileUtil.deleteFile(oldUploadedFileName);
                    log.info("삭제완료: " + oldUploadedFileName);
                } catch (Exception e) {
                    log.error("파일 삭제 중 오류 발생: " + oldUploadedFileName, e);
                }
            }
        }
        qnaService.modify(qnaDTO);
        return Map.of("RESULT", "SUCCESS");
    }

    // 5. 삭제 (Delete)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
    @DeleteMapping("/del/{qbID}")
    @Transactional
    public Map<String, String> remove(@PathVariable("qbID") Long qbID) {
        try {
            String oldFileName = qnaService.get(qbID).getQBoardAttachment();
            List<QnaCommentDTO> commentResult = qnaService.commentlist(qbID);

            for (QnaCommentDTO commentDTO : commentResult) {
                log.info("Deleting comment ID: " + commentDTO.getQCommentID());
                qnaService.removeComment(commentDTO.getQCommentID(), commentDTO.getQBoard().getQBoardID());
            }

            qnaService.remove(qbID);
            fileUtil.deleteFile(oldFileName);

            return Map.of("RESULT", "SUCCESS");
        } catch (Exception e) {
            log.error("Error during deletion: " + e.getMessage(), e);
            throw e; // 필요에 따라 적절한 예외를 다시 던질 수 있습니다.
        }
    }

    // 6. 검색
    @GetMapping("/search")
    public PageResponseDTO<QnaDTO> searchQna(PageRequestDTO pageRequestDTO,
                                             @RequestParam(defaultValue = "title", required = false) String type,
                                             @RequestParam(required = false) String keyword) {
        log.info("search result list..... : "+pageRequestDTO);
        return qnaService.searchQboard(pageRequestDTO, type, keyword);  // 기본 정렬 : qBoardID 내림차순

    }

    // 1. 댓글 등록 : ROLE에 따라서  -> Question_Board 관리자 답변 상태 컬럼(Qboard_asked)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
    @PostMapping("/{qbID}/comments/")
    public Map<String, Long> register(@ModelAttribute QnaCommentReqDTO qnaCommentDTO, @PathVariable("qbID") Long qbID) {

        Long qbcommID = qnaService.registerComment(qnaCommentDTO, qbID);
        return Map.of("RESULT", qbcommID);
    }

    // 2. 댓글 수정
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
    @PutMapping("/{qbID}/comments/{qcommentID}")
    public Map<String, String> modify(@PathVariable("qcommentID") Long qcommentID, @PathVariable("qbID") Long qbID, QnaCommentDTO qnaCommentDTO) {
        qnaCommentDTO.setQCommentID(qcommentID);

        // 수정
        qnaService.modifyComment(qnaCommentDTO);

        return Map.of("RESULT", "SUCCESS");
    }

    // 3. 댓글 목록
    @GetMapping("/{qbID}/comments/list")
    public List<QnaCommentDTO> commentList(@PathVariable("qbID") Long qbID) {
        return qnaService.commentlist(qbID);
    }

    // 4. 댓글 삭제
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
    @DeleteMapping("/{qbID}/comments/{qcommentID}")
    @Transactional
    public Map<String, String> removeComment(@PathVariable("qcommentID") Long qcommentID,  @PathVariable("qbID") Long qbID) {

        qnaService.removeComment(qcommentID, qbID);

        return Map.of("RESULT", "SUCCESS");
    }

    // 이미지 보기
    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName) {
        return fileUtil.getFile(fileName);
    }


}
