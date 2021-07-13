package com.stawu.WC.server.controllers;

import com.stawu.WC.server.dtos.ContactDtoRequest;
import com.stawu.WC.server.dtos.ContactDtoResponse;
import com.stawu.WC.server.dtos.ContactValuesChangeDtoRequest;
import com.stawu.WC.server.entities.ContactEntity;
import com.stawu.WC.server.services.CommunicatorService;
import com.stawu.WC.server.services.ContactNotExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.LinkedList;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContactsController {

    private final CommunicatorService communicatorService;

    @GetMapping("/contacts")
    public ResponseEntity<Iterable<ContactDtoResponse>> getAllContacts(Authentication authentication){
        final var userOpt = communicatorService.getUserByAccountName(authentication.getName());
        if(userOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).build();

        final var user = userOpt.get();
        final var contacts = communicatorService.getAllContactsOfUser(user);

        final List<ContactDtoResponse> contactsDtoResponse = new LinkedList<>();
        for(var contact : contacts){
            contactsDtoResponse.add(new ContactDtoResponse(contact.getContactName(), contact.getAlternativeName()));
        }

        return ResponseEntity.ok(contactsDtoResponse);
    }

    @PostMapping("/contacts")
    public ResponseEntity<Object> addContact(Authentication authentication,
                                             @RequestBody @Valid ContactDtoRequest contactDtoRequest)
    {
        final var userOpt = communicatorService.getUserByAccountName(authentication.getName());
        if(userOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).build();

        final var contactOpt = communicatorService.getUserByAccountName(contactDtoRequest.getContactName());
        if(contactOpt.isEmpty())
            return ResponseEntity.notFound().build();

        final var user = userOpt.get();
        final var contactEntity = new ContactEntity();
        contactEntity.setContactName(contactDtoRequest.getContactName());
        contactEntity.setUserEntity(contactOpt.get());

        if(user.getAccountName().equals(contactEntity.getContactName()))
            return ResponseEntity.badRequest().build();

        if(communicatorService.getAllContactsOfUser(user).stream().filter(contactEntity1 -> contactEntity1.getContactName().equals(contactEntity.getContactName())).findFirst().isPresent())
            return ResponseEntity.badRequest().build();

        communicatorService.addContactToUser(contactEntity, user);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/contacts/{contactName}")
    public ResponseEntity<Object> removeContact(Authentication authentication,
                                                @PathVariable("contactName") String contactToRemoveName) {
        final var userOpt = communicatorService.getUserByAccountName(authentication.getName());
        if(userOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).build();

        try {
            communicatorService.removeContactFromUser(contactToRemoveName, userOpt.get());
        } catch (ContactNotExistsException e) {
            ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/contacts/{contactName}")
    public ResponseEntity<Object> changeContactValues(
            Authentication authentication,
            @PathVariable("contactName") String contact,
            @RequestBody @Valid ContactValuesChangeDtoRequest contactValuesChangeDtoRequest)
    {
        final var userOpt = communicatorService.getUserByAccountName(authentication.getName());
        if(userOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).build();

        final ContactEntity newContactValues = new ContactEntity();
        newContactValues.setContactName(contact);
        newContactValues.setAlternativeName(contactValuesChangeDtoRequest.getAlternativeName());

        try {
            communicatorService.updateContactValuesOfUser(userOpt.get(), contact, newContactValues);
        } catch (ContactNotExistsException e) {
            ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }
}
