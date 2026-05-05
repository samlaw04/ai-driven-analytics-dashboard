package ai.analytics.dashboard.dto

import java.time.LocalDate

data class DemandResponseRewardsResponse(
    val totalRewards: Double,
    val rewardsBreakdown: DemandResponseRewardsBreakdown
)

data class DemandResponseRewardsBreakdown(
    val signUpIncentive: Int,
    val ongoingIncentive: List<DrOngoingIncentiveEntry>
)

data class DrOngoingIncentiveEntry(
    val incentivePerDrEvent: Double,
    val sessionRewardsEarned: Double,
    val dateOfDr: LocalDate
)

