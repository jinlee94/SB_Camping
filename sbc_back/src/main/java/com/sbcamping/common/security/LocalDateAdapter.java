package com.sbcamping.common.security;

import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;


public class LocalDateAdapter extends TypeAdapter<LocalDate> {

    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;

    // Gson 라이브러리 LocalDate 객체 처리를 위한 클래스

    @Override
    public void write(JsonWriter out, LocalDate value) throws IOException {
        if(value == null){
            out.nullValue();
        } else {
            out.value(value.format(formatter)); // ISO-8601 형식으로 직렬화
        }
    }

    @Override
    public LocalDate read(JsonReader in) throws IOException {
        if(in.peek() == com.google.gson.stream.JsonToken.NULL){
            in.nextNull();
            return null;
        }
        return LocalDate.parse(in.nextString(), formatter);
    }
}
