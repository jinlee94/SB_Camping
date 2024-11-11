package com.sbcamping.admin.common.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Data
public class PageResponseDTO<E> {   // 다른 타입의 DTO들을 이욯할 수 있도록 제네릭 타입으로 작성
    private List<E> dtoList;
    private List<Integer> pageNumList;
    private PageRequestDTO pageRequestDTO;
    private boolean prev;
    private boolean next;
    private int totalCount;
    private int prevPage;
    private int nextPage;
    private int totalPage;
    private int current;

    // 목록 처리에 필요한 모든 데이터를 반환
    @Builder(builderMethodName = "withAll")
    public PageResponseDTO(List<E> dtoList, PageRequestDTO pageRequestDTO, long totalCount) {

        this.dtoList = dtoList;
        this.pageRequestDTO = pageRequestDTO;
        this.totalCount = (int) totalCount;

        int end = (int) (Math.ceil(pageRequestDTO.getPage() / 15.0)) * 15;
        int start = end - 14;
        int last = (int) (Math.ceil(totalCount / (double) pageRequestDTO.getSize()));

        end = end>last? last : end;

        this.prev = start > 1;
        this.next = totalCount > end * pageRequestDTO.getSize();
        this.pageNumList = IntStream.rangeClosed(start, end).boxed().collect(Collectors.toList());

        if (prev) {
            this.prevPage = start -1;
        }
        if (next) {
            this.nextPage = end + 1;
        }
        this.totalPage = this.pageNumList.size();
        this.current = pageRequestDTO.getPage();
    }

}
