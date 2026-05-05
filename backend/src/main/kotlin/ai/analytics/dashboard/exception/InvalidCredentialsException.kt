package ai.analytics.dashboard.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.UNAUTHORIZED)
class InvalidCredentialsException(message: String = "Invalid email or password") : RuntimeException(message)

