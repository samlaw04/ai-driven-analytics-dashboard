package ai.analytics.dashboard.service

import ai.analytics.dashboard.dto.DemandResponseAccountSummaryResponse
import ai.analytics.dashboard.dto.DemandResponseRewardsBreakdown
import ai.analytics.dashboard.dto.DemandResponseRewardsResponse
import ai.analytics.dashboard.dto.DrOngoingIncentiveEntry
import ai.analytics.dashboard.dto.UpcomingDrEventResponse
import ai.analytics.dashboard.exception.CustomerNotFoundException
import ai.analytics.dashboard.exception.NoDrEventException
import ai.analytics.dashboard.exception.UtilityNotFoundException
import ai.analytics.dashboard.repository.CustomerDrEventRepository
import ai.analytics.dashboard.repository.CustomerRepository
import ai.analytics.dashboard.repository.UtilityRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZoneOffset

@Service
class DemandResponseService(
    private val customerRepository: CustomerRepository,
    private val customerDrEventRepository: CustomerDrEventRepository,
    private val utilityRepository: UtilityRepository
) {
    fun getAccountSummary(
        customerId: Long,
        startDate: OffsetDateTime,
        endDate: OffsetDateTime
    ): DemandResponseAccountSummaryResponse {
        customerRepository.findById(customerId)
            .orElseThrow { CustomerNotFoundException(customerId) }

        val drEvents = customerDrEventRepository.findByCustomerIdAndDateRange(customerId, startDate, endDate)

        val numberOfPlugSessions = drEvents.size
        val drEventsScheduled = drEvents.size
        val drEventsParticipatedIn = drEvents.count { !it.drEventOverridden }
        val drEventsOverridden = drEvents.count { it.drEventOverridden }
        val kwhShifted = drEvents.sumOf { it.kwhShifted }
        val totalTimePluggedIn = customerDrEventRepository
            .getTotalTimePluggedInSeconds(customerId, startDate, endDate)
            .toLong()

        return DemandResponseAccountSummaryResponse(
            numberOfPlugSessions = numberOfPlugSessions,
            drEventsScheduled = drEventsScheduled,
            drEventsParticipatedIn = drEventsParticipatedIn,
            drEventsOverridden = drEventsOverridden,
            kwhShifted = kwhShifted,
            totalTimePluggedIn = totalTimePluggedIn
        )
    }

    fun getRewards(
        customerId: Long,
        startDate: OffsetDateTime,
        endDate: OffsetDateTime
    ): DemandResponseRewardsResponse {

        val customer = customerRepository.findById(customerId)
            .orElseThrow { CustomerNotFoundException(customerId) }

        val utilityId = customer.utilityId
            ?: throw UtilityNotFoundException(customerId)

        val utility = utilityRepository.findById(utilityId)
            .orElseThrow { UtilityNotFoundException(customerId) }

        val signUpIncentive = utility.signUpIncentive?.toInt() ?: 0
        val incentivePerDrEvent = utility.ongoingIncentive ?: 0.0

        val drEvents = customerDrEventRepository.findByCustomerIdAndDateRangeWithDate(customerId, startDate, endDate)

        val ongoingIncentiveEntries = drEvents.map { event ->
            val sessionRewardsEarned = if (!event.drEventOverridden) incentivePerDrEvent else 0.0
            DrOngoingIncentiveEntry(
                incentivePerDrEvent = incentivePerDrEvent,
                sessionRewardsEarned = sessionRewardsEarned,
                dateOfDr = event.drEventDate
            )
        }

        val totalOngoingRewards = ongoingIncentiveEntries.sumOf { it.sessionRewardsEarned }
        val totalRewards = signUpIncentive + totalOngoingRewards

        return DemandResponseRewardsResponse(
            totalRewards = totalRewards,
            rewardsBreakdown = DemandResponseRewardsBreakdown(
                signUpIncentive = signUpIncentive,
                ongoingIncentive = ongoingIncentiveEntries
            )
        )
    }

    fun getUpcomingDrEvent(customerId: Long): UpcomingDrEventResponse? {
        try {

        customerRepository.findById(customerId)
            .orElseThrow { CustomerNotFoundException(customerId) }

        val projection = customerDrEventRepository.findUpcomingDrEventByCustomerId(customerId)
            .orElse(null) ?: return null

            return UpcomingDrEventResponse(
                drEventDate = projection.getDrEventDate().atOffset(ZoneOffset.UTC),
                drEventWindow = projection.getDrEventWindow()
            )

        } catch (e: Exception) {
            println(e)
        }
        return null
    }

}

