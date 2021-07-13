package com.stawu.WC.server.dtos;

import lombok.Data;

@Data
public class AccountDtoRequest {
    private String userName;
    private String password;
}
