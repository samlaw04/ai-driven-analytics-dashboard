package ai.analytics.dashboard.dto

data class DynamicPricingAccountSummaryResponse(
    val numberOfPlugSessions: Int,
    val schedulesFollowed: Int,
    val dollarsSaved: Double,
    val schedulesOverridden: Int,
    val missedSavings: Double,
    val kwhShifted: Double
)

