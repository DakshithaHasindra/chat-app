package com.dakshitha.hasindra.web.to;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageTO {
    @NotNull(message = "Message is null")
    @NotEmpty(message = "Message is empty")
    private String message;
    @NotNull(message = "Email is null")
    @Email(message = "Email is invalid")
    private String email;
}
