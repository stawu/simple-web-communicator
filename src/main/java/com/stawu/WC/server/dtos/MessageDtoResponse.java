package com.stawu.WC.server.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
public class MessageDtoResponse {
    private String senderName;
    private String recipientName;
    private Instant instant;
    private String content;
}
