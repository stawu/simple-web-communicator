package com.stawu.WC.server.controllers;

import com.stawu.WC.server.dtos.MessageDtoRequest;
import com.stawu.WC.server.dtos.MessageDtoResponse;
import com.stawu.WC.server.services.CommunicatorService;
import com.stawu.WC.server.services.ContactNotExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collection;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MessagesController {

    private final CommunicatorService communicatorService;

    @GetMapping("/conversation/with/{otherUserName}")
    public ResponseEntity<Collection<MessageDtoResponse>> getConversationWith(
            Authentication authentication, @PathVariable("otherUserName") String otherUserName)
    {
        final var userOpt = communicatorService.getUserByAccountName(authentication.getName());
        if(userOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).build();

        try {
            final var messages = communicatorService.getMessagesBetweenUsers(userOpt.get().getAccountName(), otherUserName);
            return ResponseEntity.ok(
                    messages.stream().map(message -> new MessageDtoResponse(
                            message.getSenderName(),
                            message.getRecipientName(),
                            message.getInstant(),
                            message.getContent()
                    )).toList()
            );
        } catch (ContactNotExistsException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/conversation/with/{otherUserName}")
    public ResponseEntity<Object> sendMessageTo(Authentication authentication,
                                                @PathVariable("otherUserName") String otherUserName,
                                                @RequestBody @Valid MessageDtoRequest messageDtoRequest)
    {
        final var userOpt = communicatorService.getUserByAccountName(authentication.getName());
        if(userOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).build();

        try {
            communicatorService.sendMessageToContactOfUser(userOpt.get(), otherUserName, messageDtoRequest.getContent());
        } catch (ContactNotExistsException e) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }
}
