package ai.analytics.dashboard.service

import ai.analytics.dashboard.dto.DynamicPricingAccountSummaryResponse
import ai.analytics.dashboard.exception.CustomerNotFoundException
import ai.analytics.dashboard.repository.CustomerRepository
import ai.analytics.dashboard.repository.ScheduleRepository
import org.springframework.stereotype.Service
import java.time.OffsetDateTime

@Service
class DynamicPricingService(
    private val customerRepository: CustomerRepository,
    private val scheduleRepository: ScheduleRepository
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
}

