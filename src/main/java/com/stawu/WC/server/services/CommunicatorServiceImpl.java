package com.stawu.WC.server.services;

import com.stawu.WC.server.entities.ContactEntity;
import com.stawu.WC.server.entities.MessageEntity;
import com.stawu.WC.server.entities.UserEntity;
import com.stawu.WC.server.repositories.ContactRepository;
import com.stawu.WC.server.repositories.MessagesRepository;
import com.stawu.WC.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.config.annotation.authentication.configurers.provisioning.UserDetailsManagerConfigurer;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CommunicatorServiceImpl implements CommunicatorService{

    private final UserDetailsManager userDetailsManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;
    private final MessagesRepository messagesRepository;

    @Override
    public void registerUserAndCreateAccount(String account_userName, String password)
            throws UserAlreadyExistsException, DisallowedUserPasswordException
    {
        if(userDetailsManager.userExists(account_userName))
            throw new UserAlreadyExistsException();

        //Minimum eight characters, at least one letter and one number:
        if(!password.matches("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$"))
            throw new DisallowedUserPasswordException();

        userDetailsManager.createUser(
                new User(account_userName,
                        passwordEncoder.encode(password),
                        List.of(new SimpleGrantedAuthority("ROLE_USER"))));

        final var userEntity = new UserEntity();
        userEntity.setAccountName(account_userName);
        userRepository.save(userEntity);
    }

    @Override
    public Optional<UserEntity> getUserByAccountName(String accountName) {
        final var entity = userRepository.findByAccountName(accountName);
        return entity;
    }

    @Override
    public Collection<ContactEntity> getAllContactsOfUser(UserEntity userEntity) {
        return contactRepository.findAllByUserEntity(userEntity);
    }

    @Override
    public void addContactToUser(ContactEntity contact, UserEntity user) {
        final var contactToSave = new ContactEntity();
        contactToSave.setUserEntity(user);
        contactToSave.setContactName(contact.getContactName());

        contactRepository.save(contactToSave);
    }

    @Override
    public void removeContactFromUser(String contactName, UserEntity user) throws ContactNotExistsException {
        final var userContacts = contactRepository.findAllByUserEntity(user);
        final var contactToRemoveOpt = userContacts.stream().filter(
                userContact -> userContact.getContactName().equals(contactName)).findFirst();
        if(contactToRemoveOpt.isEmpty())
            throw new ContactNotExistsException();

        contactRepository.delete(contactToRemoveOpt.get());
    }

    @Override
    public Collection<Message> getMessagesBetweenUsers(String userName_01, String userName_02) throws ContactNotExistsException {
        final var user_01_opt = userRepository.findByAccountName(userName_01);
        if(user_01_opt.isEmpty())
            throw new ContactNotExistsException();

        final var user_02_opt = userRepository.findByAccountName(userName_02);
        if(user_02_opt.isEmpty())
            throw new ContactNotExistsException();

        final var user_01_messages = user_01_opt.get().getSentMessages().stream().filter(messageEntity -> messageEntity.getReceiverUser().getAccountName().equals(userName_02)).toList();
        final var user_02_messages = user_02_opt.get().getSentMessages().stream().filter(messageEntity -> messageEntity.getReceiverUser().getAccountName().equals(userName_01)).toList();

        final List<MessageEntity> messagesSortedByDate = new LinkedList<>();
        messagesSortedByDate.addAll(user_01_messages);
        messagesSortedByDate.addAll(user_02_messages);

        messagesSortedByDate.sort((o1, o2) -> {
            final var instant01 = o1.getInstant();
            final var instant02 = o2.getInstant();

            if (instant01.isBefore(instant02))
                return -1;
            else if (instant01.isAfter(instant02))
                return 1;
            return 0;
        });

        return messagesSortedByDate.stream().map(messageEntity -> {
                final String senderName = messageEntity.getReceiverUser().getAccountName().equals(userName_01) ? userName_02 : userName_01;
                return new Message(senderName, messageEntity.getReceiverUser().getAccountName(),
                        messageEntity.getInstant(), messageEntity.getMessageContent());
            }).toList();
    }

    @Override
    public void sendMessageToContactOfUser(UserEntity user, String contactName, String message)
            throws ContactNotExistsException
    {
        final var userContacts = contactRepository.findAllByUserEntity(user);
        final var contactToSendOpt = userContacts.stream().filter(
                userContact -> userContact.getContactName().equals(contactName)).findFirst();
        if(contactToSendOpt.isEmpty())
            throw new ContactNotExistsException();

        final var contactAsUserOpt = userRepository.findByAccountName(contactName);
        if(contactAsUserOpt.isEmpty())
            throw new ContactNotExistsException();

        final var messageEntity = new MessageEntity();
        messageEntity.setMessageContent(message);
        messageEntity.setInstant(Instant.now());
        messageEntity.setSender(user);
        messageEntity.setReceiverUser(contactAsUserOpt.get());

        messagesRepository.save(messageEntity);
    }

    @Override
    public void updateContactValuesOfUser(UserEntity userEntity, String contactName, ContactEntity newContactValues)
            throws ContactNotExistsException
    {
        final var userContacts = contactRepository.findAllByUserEntity(userEntity);
        final var contactToChangeValueOpt = userContacts.stream().filter(
                userContact -> userContact.getContactName().equals(contactName)).findFirst();
        if(contactToChangeValueOpt.isEmpty())
            throw new ContactNotExistsException();

        final var contactToChangeValue = contactToChangeValueOpt.get();
        contactToChangeValue.setAlternativeName(newContactValues.getAlternativeName());

        contactRepository.save(contactToChangeValue);
    }
}
