package com.stawu.WC.server.entities;

import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class ContactEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private UserEntity userEntity;

    private String contactName;

    @ColumnDefault("''")
    private String alternativeName;
}
