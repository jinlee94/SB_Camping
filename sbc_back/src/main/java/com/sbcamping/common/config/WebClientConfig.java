package com.sbcamping.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    // 인공지능 (이미지 분석) 관련 Web 설정, 파이썬 서버와 연결
    // 메모리에 버퍼링 할 수 있는 최대 크기를 무제한으로 설정 maxInMemorySize(-1)
    @Bean
    WebClient webClient() {
        return WebClient.builder()
                .exchangeStrategies(ExchangeStrategies.builder().codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(-1)).build())
                .baseUrl("http://localhost:8000")
                .build();
    }
}
