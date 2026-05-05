package ai.analytics.dashboard.dto

import java.time.LocalDate

data class DynamicPricingRewardsResponse(
    val totalRewards: Double,
    val rewardsBreakdown: RewardsBreakdown
)

data class RewardsBreakdown(
    val signUpIncentive: Int,
    val ongoingIncentive: List<OngoingIncentiveEntry>
)

data class OngoingIncentiveEntry(
    val kwhShifted: Double,
    val incentivePerKwh: Double,
    val sessionRewardsEarned: Double,
    val dateOfSession: LocalDate
)

