package ai.analytics.dashboard.dto

import ai.analytics.dashboard.entity.EnrollmentStatus
import ai.analytics.dashboard.entity.ProgramType
import java.time.OffsetDateTime

data class UtilityDto(
    val utilityId: Long,
    val programName: String,
    val programType: ProgramType
)

data class UserProfileResponse(
    val customerId: Long,
    val utility: UtilityDto?,
    val firstName: String,
    val lastName: String,
    val email: String,
    val createdDate: OffsetDateTime?,
    val enrollmentStatus: EnrollmentStatus?
)

