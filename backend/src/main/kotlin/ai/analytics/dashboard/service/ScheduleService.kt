package ai.analytics.dashboard.service

import ai.analytics.dashboard.dto.CurrentScheduleResponse
import ai.analytics.dashboard.exception.CustomerNotFoundException
import ai.analytics.dashboard.exception.NoActiveSessionException
import ai.analytics.dashboard.repository.CustomerRepository
import ai.analytics.dashboard.repository.ScheduleRepository
import org.springframework.stereotype.Service

@Service
class ScheduleService(
    private val customerRepository: CustomerRepository,
    private val scheduleRepository: ScheduleRepository
) {

    fun getCurrentSchedule(customerId: Long): CurrentScheduleResponse {
        customerRepository.findById(customerId)
            .orElseThrow { CustomerNotFoundException(customerId) }

        val projection = scheduleRepository.findCurrentScheduleByCustomerId(customerId)
            .orElseThrow { NoActiveSessionException(customerId) }

        val vehicleName = if (!projection.getNickname().isNullOrBlank()) {
            projection.getNickname()!!
        } else {
            "${projection.getModelName()} ${projection.getModelYear()}"
        }

        return CurrentScheduleResponse(
            vehicleName = vehicleName,
            currentBatteryPercentage = projection.getBatteryPercentageAtPlugIn(),
            chargeWindows = projection.getChargeWindows() ?: "[]",
            vehicleImage = projection.getEncodedPhoto() ?: ""
        )
    }
}

