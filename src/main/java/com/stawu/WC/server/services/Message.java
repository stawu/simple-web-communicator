package com.stawu.WC.server.services;

import lombok.Data;

import java.time.Instant;

@Data
public class Message {
    private final String senderName;
    private final String recipientName;
    private final Instant instant;
    private final String content;
}
