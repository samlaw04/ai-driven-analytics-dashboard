package ai.analytics.dashboard.controller

import ai.analytics.dashboard.dto.AuthRequest
import ai.analytics.dashboard.dto.AuthResponse
import ai.analytics.dashboard.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: AuthRequest): ResponseEntity<AuthResponse> {
        val response = authService.authenticate(request)
        return ResponseEntity.ok(response)
    }
}

