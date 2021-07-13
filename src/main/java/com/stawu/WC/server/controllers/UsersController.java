package com.stawu.WC.server.controllers;

import com.stawu.WC.server.dtos.AccountDtoRequest;
import com.stawu.WC.server.dtos.ContactDtoResponse;
import com.stawu.WC.server.services.CommunicatorService;
import com.stawu.WC.server.services.DisallowedUserPasswordException;
import com.stawu.WC.server.services.UserAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UsersController {

    private final CommunicatorService communicatorService;

    @PostMapping("/register")
    public void registerUser(@RequestBody @Valid AccountDtoRequest accountDtoRequest)
            throws DisallowedUserPasswordException, UserAlreadyExistsException
    {
        communicatorService.registerUserAndCreateAccount(accountDtoRequest.getUserName(), accountDtoRequest.getPassword());
    }

    @GetMapping("/me")
    public ResponseEntity<ContactDtoResponse> getUserInformation(Authentication authentication){
        final var userOpt = communicatorService.getUserByAccountName(authentication.getName());
        if(userOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.CONFLICT).build();

        final var user = userOpt.get();

        return ResponseEntity.ok(new ContactDtoResponse(user.getAccountName(), ""));
    }
}
