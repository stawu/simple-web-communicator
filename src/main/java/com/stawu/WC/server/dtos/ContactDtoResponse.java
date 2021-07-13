package com.stawu.WC.server.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ContactDtoResponse {
    private String contactName;
    private String alternativeName;
}
