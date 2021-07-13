package com.stawu.WC.server.repositories;

import com.stawu.WC.server.entities.ContactEntity;
import com.stawu.WC.server.entities.UserEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;

public interface ContactRepository extends CrudRepository<ContactEntity, Long> {
    Collection<ContactEntity> findAllByUserEntity(UserEntity userEntity);
}
