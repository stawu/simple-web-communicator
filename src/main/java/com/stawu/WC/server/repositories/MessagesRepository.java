package com.stawu.WC.server.repositories;

import com.stawu.WC.server.entities.MessageEntity;
import org.springframework.data.repository.CrudRepository;

public interface MessagesRepository extends CrudRepository<MessageEntity, Long> {
}
