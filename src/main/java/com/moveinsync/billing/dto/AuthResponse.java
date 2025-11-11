package com.moveinsync.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private String username;
    private String role;
    private Long userId;
    private String email;

    public AuthResponse(String token, String tokenType) {
        this.token = token;
        this.tokenType = tokenType;
    }
}
