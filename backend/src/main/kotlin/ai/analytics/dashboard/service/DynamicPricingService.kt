package ai.analytics.dashboard.service

import ai.analytics.dashboard.dto.DynamicPricingAccountSummaryResponse
import ai.analytics.dashboard.dto.DynamicPricingRewardsResponse
import ai.analytics.dashboard.dto.OngoingIncentiveEntry
import ai.analytics.dashboard.dto.RewardsBreakdown
import ai.analytics.dashboard.exception.CustomerNotFoundException
import ai.analytics.dashboard.exception.UtilityNotFoundException
import ai.analytics.dashboard.repository.CustomerRepository
import ai.analytics.dashboard.repository.ScheduleRepository
import ai.analytics.dashboard.repository.UtilityRepository
import org.springframework.stereotype.Service
import java.time.OffsetDateTime

@Service
class DynamicPricingService(
    private val customerRepository: CustomerRepository,
    private val scheduleRepository: ScheduleRepository,
    private val utilityRepository: UtilityRepository
) {

    fun getAccountSummary(
        customerId: Long,
        startDate: OffsetDateTime,
        endDate: OffsetDateTime
    ): DynamicPricingAccountSummaryResponse {

        customerRepository.findById(customerId)
            .orElseThrow { CustomerNotFoundException(customerId) }

        val schedules = scheduleRepository.findByCustomerIdAndDateRange(customerId, startDate, endDate)

        val numberOfPlugSessions = schedules.size
        val schedulesFollowed = schedules.count { !it.scheduleOverridden }
        val schedulesOverridden = schedules.count { it.scheduleOverridden }
        val dollarsSaved = schedules.sumOf { it.actualSavings }
        val missedSavings = schedules.sumOf { it.potentialSavings - it.actualSavings }
        val kwhShifted = schedules.sumOf { it.kwhShifted }

        return DynamicPricingAccountSummaryResponse(
            numberOfPlugSessions = numberOfPlugSessions,
            schedulesFollowed = schedulesFollowed,
            dollarsSaved = dollarsSaved,
            schedulesOverridden = schedulesOverridden,
            missedSavings = missedSavings,
            kwhShifted = kwhShifted
        )
    }

    fun getRewards(
        customerId: Long,
        startDate: OffsetDateTime,
        endDate: OffsetDateTime
    ): DynamicPricingRewardsResponse {

        val customer = customerRepository.findById(customerId)
            .orElseThrow { CustomerNotFoundException(customerId) }

        val utilityId = customer.utilityId
            ?: throw UtilityNotFoundException(customerId)

        val utility = utilityRepository.findById(utilityId)
            .orElseThrow { UtilityNotFoundException(customerId) }

        val signUpIncentive = utility.signUpIncentive?.toInt() ?: 0
        val incentivePerKwh = utility.ongoingIncentive ?: 0.0

        val schedules = scheduleRepository.findByCustomerIdAndDateRange(customerId, startDate, endDate)

        val ongoingIncentiveEntries = schedules.map { schedule ->
            val sessionRewardsEarned = schedule.kwhShifted * incentivePerKwh
            OngoingIncentiveEntry(
                kwhShifted = schedule.kwhShifted,
                incentivePerKwh = incentivePerKwh,
                sessionRewardsEarned = sessionRewardsEarned,
                dateOfSession = schedule.scheduleDate.toLocalDate()
            )
        }

        val totalOngoingRewards = ongoingIncentiveEntries.sumOf { it.sessionRewardsEarned }
        val totalRewards = signUpIncentive + totalOngoingRewards

        return DynamicPricingRewardsResponse(
            totalRewards = totalRewards,
            rewardsBreakdown = RewardsBreakdown(
                signUpIncentive = signUpIncentive,
                ongoingIncentive = ongoingIncentiveEntries
            )
        )
    }
}

