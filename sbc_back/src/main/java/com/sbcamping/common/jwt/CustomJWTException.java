package com.sbcamping.common.jwt;

public class CustomJWTException extends RuntimeException {

    // JWT 예외처리
    public CustomJWTException(String msg){
        super(msg);
    }
}
