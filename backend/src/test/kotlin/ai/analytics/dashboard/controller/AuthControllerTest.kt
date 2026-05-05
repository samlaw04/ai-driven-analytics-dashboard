package ai.analytics.dashboard.controller

import ai.analytics.dashboard.dto.AuthRequest
import ai.analytics.dashboard.dto.AuthResponse
import ai.analytics.dashboard.exception.GlobalExceptionHandler
import ai.analytics.dashboard.exception.InvalidCredentialsException
import ai.analytics.dashboard.service.AuthService
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.setup.MockMvcBuilders

@ExtendWith(MockitoExtension::class)
class AuthControllerTest {

    lateinit var mockMvc: MockMvc

    val objectMapper: ObjectMapper = ObjectMapper()

    @Mock
    lateinit var authService: AuthService

    @InjectMocks
    lateinit var authController: AuthController

    @BeforeEach
    fun setup() {
        mockMvc = MockMvcBuilders
            .standaloneSetup(authController)
            .setControllerAdvice(GlobalExceptionHandler())
            .build()
    }

    @Test
    fun `login returns 200 with customerId on valid credentials`() {
        val request = AuthRequest(email = "s.jenkins@example.com", password = "abc123")
        whenever(authService.authenticate(request)).thenReturn(AuthResponse(customerId = 1L))

        mockMvc.post("/api/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isOk() }
            jsonPath("$.customerId") { value(1) }
        }
    }

    @Test
    fun `login returns 401 on invalid credentials`() {
        val request = AuthRequest(email = "s.jenkins@example.com", password = "wrongpassword")
        whenever(authService.authenticate(request)).thenThrow(InvalidCredentialsException())

        mockMvc.post("/api/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isUnauthorized() }
            jsonPath("$.status") { value(401) }
            jsonPath("$.error") { value("Unauthorized") }
        }
    }

    @Test
    fun `login returns 400 when email is blank`() {
        val request = mapOf("email" to "", "password" to "abc123")

        mockMvc.post("/api/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isBadRequest() }
            jsonPath("$.status") { value(400) }
        }
    }

    @Test
    fun `login returns 400 when email is invalid`() {
        val request = mapOf("email" to "not-an-email", "password" to "abc123")

        mockMvc.post("/api/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isBadRequest() }
            jsonPath("$.status") { value(400) }
        }
    }
}

