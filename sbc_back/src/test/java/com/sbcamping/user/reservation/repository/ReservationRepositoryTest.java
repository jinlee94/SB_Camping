package com.sbcamping.user.reservation.repository;

import com.sbcamping.domain.Reservation;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@SpringBootTest
@Log4j2
class ReservationRepositoryTest {

    @Autowired
    ReservationRepository reservationRepository;

    @Test
    public void getRes() {
        List<Reservation> reservation = reservationRepository.findAll();

        log.info(reservation);

    }

}