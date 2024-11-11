package com.sbcamping.admin.lostItem.service;

import com.sbcamping.admin.common.dto.PageRequestDTO;
import com.sbcamping.admin.common.dto.PageResponseDTO;
import com.sbcamping.admin.lostItem.dto.LostItemDTO;
import com.sbcamping.admin.lostItem.repository.LostItemRepository;
import com.sbcamping.domain.LostItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class LostItemServiceImpl implements LostItemService {

    private final LostItemRepository lostItemRepository;

    private final ModelMapper modelMapper;

    // 검색
    @Override
    public PageResponseDTO<LostItem> search(PageRequestDTO requestDTO, String type, String keyword) {
        Pageable pageable;
        Page<LostItem> searchItem = null;

        if (keyword != null) {
            pageable = PageRequest.of(requestDTO.getPage() - 1, requestDTO.getSize(), Sort.by("regDate").descending());
            searchItem = switch (type) {
                case "category" -> lostItemRepository.searchByCategoryContainsOrderByRegDate(keyword, pageable);
                case "foundLocation" ->
                        lostItemRepository.searchByFoundLocationContainsOrderByRegDate(keyword, pageable);
                default -> null;
            };


        } else {
            pageable = PageRequest.of(requestDTO.getPage() - 1, requestDTO.getSize(), Sort.by("regDate").descending());
            searchItem = lostItemRepository.getList(pageable);
        }

        long totalCount = searchItem.getTotalElements();

        List<LostItem> dtoList = searchItem.getContent().stream().collect(Collectors.toList());

        return PageResponseDTO.<LostItem>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(requestDTO)
                .build();

    }

    // 전체 목록
    @Override
    public PageResponseDTO<LostItem> getList(PageRequestDTO requestDTO) {
        log.info("---------------------getList");

        Pageable pageable = PageRequest.of(requestDTO.getPage() - 1, requestDTO.getSize());
        Page<LostItem> items = lostItemRepository.getList(pageable);

        long totalCount = items.getTotalElements();
        log.info("------totalCount : {}", totalCount);

        List<LostItem> dtoList = items.stream().collect(Collectors.toList());

        return PageResponseDTO.<LostItem>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(requestDTO)
                .build();
    }

    // 등록
    @Override
    public Long addItem(LostItemDTO lostItemDTO) {
        log.info("category : {}", lostItemDTO.getCategory());
        // 마지막 쉼표 제거 후, 쉼표로 구분하여 배열로 변환
        String[] categories = lostItemDTO.getCategory().replaceAll(",$", "").split(",");
        // 중복 제거 및 쉼표로 구분된 문자열로 다시 결합
        String uniqueCategory = Arrays.stream(categories)
                .distinct() // 중복 제거
                .collect(Collectors.joining(","));
        System.out.println(uniqueCategory);  // 출력: 사람, 가방
        lostItemDTO.setCategory(uniqueCategory);

        LostItem lostItem = modelMapper.map(lostItemDTO, LostItem.class);
        LostItem savedlostItem = lostItemRepository.save(lostItem);
        return savedlostItem.getItemId();
    }

    // 수정
    @Override
    public Long updateItem(Long itemId, LostItemDTO lostItemDTO) {
        LostItem lostItem = lostItemRepository.findById(itemId).orElse(null);
        if (lostItemDTO.getCategory() != null) {
            lostItem.changeCategory(lostItemDTO.getCategory());
        }
        if (lostItemDTO.getDescription() != null) {
            lostItem.changeDescription(lostItemDTO.getDescription());
        }
        if (lostItemDTO.getFoundLocation() != null) {
            lostItem.changeFoundLocation(lostItemDTO.getFoundLocation());
        }
        if (lostItemDTO.getState() != null) {
            lostItem.changeState(lostItemDTO.getState());
        }
        lostItemRepository.save(lostItem);

        return lostItem.getItemId();
    }

    @Override
    public void deleteItem(Long itemId) {
        lostItemRepository.deleteById(itemId);
    }
}
