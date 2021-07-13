package com.stawu.WC.server.services;

import com.stawu.WC.server.entities.ContactEntity;
import com.stawu.WC.server.entities.UserEntity;

import java.util.Collection;
import java.util.Optional;

public interface CommunicatorService {
    void registerUserAndCreateAccount(String account_userName, String password)
            throws UserAlreadyExistsException, DisallowedUserPasswordException;
    Optional<UserEntity> getUserByAccountName(String accountName);
    Collection<ContactEntity> getAllContactsOfUser(UserEntity userEntity);
    void addContactToUser(ContactEntity contact, UserEntity user);
    void removeContactFromUser(String contactName, UserEntity user) throws ContactNotExistsException;
    Collection<Message> getMessagesBetweenUsers(String userName_01, String userName_02) throws ContactNotExistsException;
    void sendMessageToContactOfUser(UserEntity user, String contactName, String message) throws ContactNotExistsException;
    void updateContactValuesOfUser(UserEntity userEntity, String contactName, ContactEntity newContactValues) throws ContactNotExistsException;
}
