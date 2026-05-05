package ai.analytics.dashboard.service

import ai.analytics.dashboard.dto.DemandResponseAccountSummaryResponse
import ai.analytics.dashboard.exception.CustomerNotFoundException
import ai.analytics.dashboard.repository.CustomerDrEventRepository
import ai.analytics.dashboard.repository.CustomerRepository
import org.springframework.stereotype.Service
import java.time.OffsetDateTime

@Service
class DemandResponseService(
    private val customerRepository: CustomerRepository,
    private val customerDrEventRepository: CustomerDrEventRepository
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
}

