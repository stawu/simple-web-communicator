package com.stawu.WC.server.repositories;

import com.stawu.WC.server.entities.ContactEntity;
import com.stawu.WC.server.entities.UserEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;
import java.util.Optional;

public interface UserRepository extends CrudRepository<UserEntity, Long> {
    Optional<UserEntity> findByAccountName(String accountName);
}
