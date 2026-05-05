package ai.analytics.dashboard.dto

import java.time.OffsetDateTime

data class UpcomingDrEventResponse(
    val drEventDate: OffsetDateTime,
    val drEventWindow: String
)

