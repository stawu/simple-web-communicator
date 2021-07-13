package com.stawu.WC.server.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;

@Entity
@Data
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(unique = true)
    private String accountName;

    @OneToMany(mappedBy = "sender")
    private Collection<MessageEntity> sentMessages;
}
