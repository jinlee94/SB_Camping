package com.sbcamping.common.util;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component("commonFileUtil")
@Slf4j
@RequiredArgsConstructor
public class CustomFileUtil {  // 파일 데이터 입출력 담당 util

    @Value("${com.sbcamping.upload.path}")
    private String uploadPath;

    /**
     * 프로젝트 실행시 무조건 실행
     */
    @PostConstruct
    public void init() throws IOException {

        Path tempFolderPath = Paths.get(uploadPath);
        // 디렉토리가 존재하지 않으면 생성하고, 이미 존재하면 아무 작업도 하지 않음
        Files.createDirectories(tempFolderPath);
        // 절대 경로로 변환
        uploadPath = tempFolderPath.toAbsolutePath().toString();

        log.info("******파일 업로드 경로:{}", uploadPath);

    }

    // 파일 업로드 작업
    public String saveFile(MultipartFile file) throws RuntimeException {
        if (file == null) {
            return null;
        }
        String savedName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path savePath = Paths.get(uploadPath, savedName);
        if(!uploadPath.isEmpty()){
            log.info("업로드 경로================================:{}", uploadPath);
            try {
                Files.copy(file.getInputStream(), savePath);
                String contentType = file.getContentType();
                // 이미지 여부 확인
                if (contentType != null && contentType.startsWith("image")) {
                    Path thumbnailPath = Paths.get(uploadPath,"s_"+savedName);  // 's_'로 시작되는 썸네일 파일 함께 생성
                    Thumbnails.of(savePath.toFile()).size(200,200).toFile(thumbnailPath.toFile());
                }
            } catch (IOException e) {
                throw new RuntimeException(e.getMessage());
            }
            return savedName;
        }
       return null;
    }

    // 업로드 파일 보여주기
    public ResponseEntity<Resource> getFile(String fileName) {
        // fileName이 null인 경우 처리
        if (fileName == null || fileName.trim().isEmpty()) {
            log.warn("파일 이름이 null이거나 비어 있습니다.");
            return ResponseEntity.badRequest().body(null);
        }

        Resource resource = new FileSystemResource(uploadPath + File.separator + fileName);
        log.info("요청된 파일 리소스: {}", resource);

        if (!resource.exists() || !resource.isReadable()) {
            log.warn("파일을 찾을 수 없거나 읽을 수 없습니다: {}", fileName);
            return ResponseEntity.notFound().build();
        }
        HttpHeaders headers = new HttpHeaders();
        try {
            // Content-Type 설정
            String contentType = Files.probeContentType(resource.getFile().toPath());
            headers.add("Content-Type", contentType != null ? contentType : "application/octet-stream");
        } catch (IOException e) {
            log.error("파일 타입 확인 중 오류 발생: {}", fileName, e);
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.ok().headers(headers).body(resource);
    }


    // 서버 내부에서 파일 삭제
    public void deleteFile(String fileName) {
        if (fileName == null) {
            return;
        }
        String thumbnailFileName = "s_" + fileName;
        Path thumbnailPath = Paths.get(uploadPath, thumbnailFileName);
        log.info(thumbnailPath.toString());
        Path filePath = Paths.get(uploadPath, fileName);
        log.info(filePath.toString());
        try {
            Files.deleteIfExists(filePath);
            log.info("원본 파일 삭제");
            Files.deleteIfExists(thumbnailPath);
            log.info("썸네일 파일 삭제");
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
