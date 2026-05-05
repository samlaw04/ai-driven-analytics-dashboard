package ai.analytics.dashboard.controller

import ai.analytics.dashboard.dto.UserProfileResponse
import ai.analytics.dashboard.dto.UtilityDto
import ai.analytics.dashboard.entity.EnrollmentStatus
import ai.analytics.dashboard.entity.ProgramType
import ai.analytics.dashboard.exception.CustomerNotFoundException
import ai.analytics.dashboard.exception.GlobalExceptionHandler
import ai.analytics.dashboard.service.UserService
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import java.time.OffsetDateTime

@ExtendWith(MockitoExtension::class)
class UserControllerTest {

    lateinit var mockMvc: MockMvc

    val objectMapper: ObjectMapper = ObjectMapper()
        .registerModule(JavaTimeModule())
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)

    @Mock
    lateinit var userService: UserService

    @InjectMocks
    lateinit var userController: UserController

    @BeforeEach
    fun setup() {
        mockMvc = MockMvcBuilders
            .standaloneSetup(userController)
            .setControllerAdvice(GlobalExceptionHandler())
            .build()
    }

    private val sampleProfile = UserProfileResponse(
        customerId = 1L,
        utility = UtilityDto(
            utilityId = 1L,
            programName = "Dynamic Pricing",
            programType = ProgramType.DP
        ),
        firstName = "Sarah",
        lastName = "Jenkins",
        email = "s.jenkins@example.com",
        createdDate = OffsetDateTime.parse("2026-01-02T14:23:11+00:00"),
        enrollmentStatus = EnrollmentStatus.ENROLLED
    )

    @Test
    fun `getProfile returns 200 with full profile for valid customerId`() {
        whenever(userService.getProfile(1L)).thenReturn(sampleProfile)

        mockMvc.get("/api/user/profile") {
            contentType = MediaType.APPLICATION_JSON
            header("Customer-Id", "1")
        }.andExpect {
            status { isOk() }
            jsonPath("$.customerId") { value(1) }
            jsonPath("$.firstName") { value("Sarah") }
            jsonPath("$.lastName") { value("Jenkins") }
            jsonPath("$.email") { value("s.jenkins@example.com") }
            jsonPath("$.enrollmentStatus") { value("ENROLLED") }
            jsonPath("$.utility.utilityId") { value(1) }
            jsonPath("$.utility.programName") { value("Dynamic Pricing") }
            jsonPath("$.utility.programType") { value("DP") }
        }
    }

    @Test
    fun `getProfile returns 404 when customer is not found`() {
        whenever(userService.getProfile(999L)).thenThrow(CustomerNotFoundException(999L))

        mockMvc.get("/api/user/profile") {
            contentType = MediaType.APPLICATION_JSON
            header("Customer-Id", "999")
        }.andExpect {
            status { isNotFound() }
            jsonPath("$.status") { value(404) }
            jsonPath("$.error") { value("Not Found") }
        }
    }

    @Test
    fun `getProfile returns 400 when Customer-Id header is missing`() {
        mockMvc.get("/api/user/profile") {
            contentType = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isBadRequest() }
            jsonPath("$.status") { value(400) }
            jsonPath("$.error") { value("Bad Request") }
        }
    }

    @Test
    fun `getProfile returns 400 when Customer-Id is not a valid number`() {
        mockMvc.get("/api/user/profile") {
            contentType = MediaType.APPLICATION_JSON
            header("Customer-Id", "not-a-number")
        }.andExpect {
            status { isBadRequest() }
            jsonPath("$.status") { value(400) }
            jsonPath("$.error") { value("Bad Request") }
        }
    }
}

