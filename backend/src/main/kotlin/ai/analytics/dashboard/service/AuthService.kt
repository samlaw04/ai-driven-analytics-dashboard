package ai.analytics.dashboard.service

import ai.analytics.dashboard.dto.AuthRequest
import ai.analytics.dashboard.dto.AuthResponse
import ai.analytics.dashboard.dto.UpdatePasswordRequest
import ai.analytics.dashboard.exception.InvalidCredentialsException
import ai.analytics.dashboard.repository.CustomerRepository
import org.springframework.stereotype.Service
import java.security.MessageDigest

@Service
class AuthService(private val customerRepository: CustomerRepository) {

    fun authenticate(request: AuthRequest): AuthResponse {
        val hashedPassword = sha256(request.password)

        val customer = customerRepository
            .findByEmailAndPassword(request.email, hashedPassword)
            .orElseThrow { InvalidCredentialsException() }

        return AuthResponse(customerId = customer.customerId)
    }

    fun updatePassword(request: UpdatePasswordRequest) {
        val customer = customerRepository
            .findByEmail(request.email)
            .orElseThrow { InvalidCredentialsException() }

        if (customer.password != sha256(request.password)) {
            throw InvalidCredentialsException()
        }

        customerRepository.save(customer.copy(password = sha256(request.newPassword)))
    }

    private fun sha256(input: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val hashBytes = digest.digest(input.toByteArray(Charsets.UTF_8))
        return hashBytes.joinToString("") { "%02x".format(it) }
    }
}

