package ai.analytics.dashboard.dto

data class DemandResponseAccountSummaryResponse(
    val numberOfPlugSessions: Int,
    val drEventsScheduled: Int,
    val drEventsParticipatedIn: Int,
    val drEventsOverridden: Int,
    val kwhShifted: Double,
    val totalTimePluggedIn: Long
)

