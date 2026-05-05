package ai.analytics.dashboard.dto

data class UtilityAverageStatisticsResponse(
    val kwhShifted: Double,
    val numberOfPlugIns: Double,
    val schedulesFollowed: Double?,
    val drEventsCompleted: Double?
)

