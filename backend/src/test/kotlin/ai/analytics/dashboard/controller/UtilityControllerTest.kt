package ai.analytics.dashboard.controller

import ai.analytics.dashboard.dto.UtilityProgramDetailsResponse
import ai.analytics.dashboard.exception.GlobalExceptionHandler
import ai.analytics.dashboard.exception.UtilityNotFoundException
import ai.analytics.dashboard.service.UtilityService
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.setup.MockMvcBuilders

@ExtendWith(MockitoExtension::class)
class UtilityControllerTest {

    lateinit var mockMvc: MockMvc

    val objectMapper: ObjectMapper = ObjectMapper()

    @Mock
    lateinit var utilityService: UtilityService

    @InjectMocks
    lateinit var utilityController: UtilityController

    @BeforeEach
    fun setup() {
        mockMvc = MockMvcBuilders
            .standaloneSetup(utilityController)
            .setControllerAdvice(GlobalExceptionHandler())
            .build()
    }

    @Test
    fun `getProgramDetails returns 200 with program details for valid utility ID`() {
        val response = UtilityProgramDetailsResponse(
            title = "Dynamic Pricing",
            description1 = "Your Dynamic Pricing program allows Ford to set charging schedules.",
            description2 = "Using hourly pricing data Ford will generate a smart schedule.",
            enrollmentDesc = "as well as a \$50 bonus just for signing up.",
            chargingIncentivesDesc = "\$1 per every kwh shifted just for following your schedule"
        )
        whenever(utilityService.getProgramDetails(1L)).thenReturn(response)

        mockMvc.get("/api/utility/program-details") {
            header("Utility-Id", "1")
        }.andExpect {
            status { isOk() }
            jsonPath("$.title") { value("Dynamic Pricing") }
            jsonPath("$.description_1") { value("Your Dynamic Pricing program allows Ford to set charging schedules.") }
            jsonPath("$.description_2") { value("Using hourly pricing data Ford will generate a smart schedule.") }
            jsonPath("$.enrollment_desc") { value("as well as a \$50 bonus just for signing up.") }
            jsonPath("$.charging_incentives_desc") { value("\$1 per every kwh shifted just for following your schedule") }
        }
    }

    @Test
    fun `getProgramDetails returns 200 with null optional fields for DR utility`() {
        val response = UtilityProgramDetailsResponse(
            title = "Demand Response",
            description1 = "Smith Utilities can send a request to Ford to stop all charging.",
            description2 = null,
            enrollmentDesc = null,
            chargingIncentivesDesc = "Earn \$10 per DR event you participate in"
        )
        whenever(utilityService.getProgramDetails(3L)).thenReturn(response)

        mockMvc.get("/api/utility/program-details") {
            header("Utility-Id", "3")
        }.andExpect {
            status { isOk() }
            jsonPath("$.title") { value("Demand Response") }
            jsonPath("$.description_2") { doesNotExist() }
            jsonPath("$.enrollment_desc") { doesNotExist() }
        }
    }

    @Test
    fun `getProgramDetails returns 404 when utility not found`() {
        whenever(utilityService.getProgramDetails(99L)).thenThrow(UtilityNotFoundException(99L))

        mockMvc.get("/api/utility/program-details") {
            header("Utility-Id", "99")
        }.andExpect {
            status { isNotFound() }
            jsonPath("$.status") { value(404) }
            jsonPath("$.error") { value("Not Found") }
            jsonPath("$.message") { value("No utility program found for utility ID: 99") }
        }
    }

    @Test
    fun `getProgramDetails returns 400 when Utility-Id header is missing`() {
        mockMvc.get("/api/utility/program-details")
            .andExpect {
                status { isBadRequest() }
                jsonPath("$.status") { value(400) }
                jsonPath("$.error") { value("Bad Request") }
            }
    }

    @Test
    fun `getProgramDetails returns 400 when Utility-Id header is not a valid number`() {
        mockMvc.get("/api/utility/program-details") {
            header("Utility-Id", "not-a-number")
        }.andExpect {
            status { isBadRequest() }
            jsonPath("$.status") { value(400) }
            jsonPath("$.error") { value("Bad Request") }
        }
    }
}

