package com.sbcamping.user.review.repository;

import com.sbcamping.domain.Member;
import com.sbcamping.domain.Review;
import com.sbcamping.user.member.repository.MemberRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
class ReviewRepositoryTest {

    @Autowired
    ReviewRepository reviewRepository;

    @Autowired
    MemberRepository memberRepository;


    @Test
    public void insert() {
        Long memberid = 7L;

        Member member = memberRepository.findById(memberid).orElseThrow(() -> new RuntimeException("Member"));

        Date date = new Date();

        for (int i = 0; i < 50; i++) {
            Review review = Review.builder()
                    .reviewTitle("제목" + i)
                    .reviewContent("내용" + i)
                    .reviewDate(date)
                    .member(member)
                    .reviewAttachment("")
                    .build();

            reviewRepository.save(review);
        }
    }
}