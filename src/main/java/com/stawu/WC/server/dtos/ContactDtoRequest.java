package com.stawu.WC.server.dtos;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

@Data
public class ContactDtoRequest {
    @NotBlank
    private String contactName;
}
