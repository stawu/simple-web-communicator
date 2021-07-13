package com.stawu.WC.server.entities;

import lombok.Data;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Data
public class MessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String messageContent;
    private Instant instant;

    @ManyToOne(optional = false)
    private UserEntity sender;

    @ManyToOne
    private UserEntity receiverUser;

}
