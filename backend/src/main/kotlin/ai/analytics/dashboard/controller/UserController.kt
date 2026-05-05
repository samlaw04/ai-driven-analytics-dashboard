package ai.analytics.dashboard.controller

import ai.analytics.dashboard.dto.UserProfileResponse
import ai.analytics.dashboard.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/user")
class UserController(private val userService: UserService) {

    @GetMapping("/profile")
    fun getProfile(
        @RequestHeader("Customer-Id") customerId: Long
    ): ResponseEntity<UserProfileResponse> {
        val profile = userService.getProfile(customerId)
        return ResponseEntity.ok(profile)
    }
}

