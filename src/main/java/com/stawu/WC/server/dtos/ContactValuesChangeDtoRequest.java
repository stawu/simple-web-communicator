package com.stawu.WC.server.dtos;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ContactValuesChangeDtoRequest {
    private String alternativeName;
}
