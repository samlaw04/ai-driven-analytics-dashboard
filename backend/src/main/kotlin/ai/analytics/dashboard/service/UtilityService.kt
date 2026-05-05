package ai.analytics.dashboard.service

import ai.analytics.dashboard.dto.UtilityAverageStatisticsResponse
import ai.analytics.dashboard.dto.UtilityProgramDetailsResponse
import ai.analytics.dashboard.entity.ProgramType
import ai.analytics.dashboard.exception.UtilityNotFoundException
import ai.analytics.dashboard.repository.CustomerDrEventRepository
import ai.analytics.dashboard.repository.PlugSessionRepository
import ai.analytics.dashboard.repository.ScheduleRepository
import ai.analytics.dashboard.repository.UtilityRepository
import org.springframework.stereotype.Service

@Service
class UtilityService(
    private val utilityRepository: UtilityRepository,
    private val scheduleRepository: ScheduleRepository,
    private val customerDrEventRepository: CustomerDrEventRepository,
    private val plugSessionRepository: PlugSessionRepository
) {

    fun getProgramDetails(utilityId: Long): UtilityProgramDetailsResponse {
        val utility = utilityRepository.findById(utilityId)
            .orElseThrow { UtilityNotFoundException(utilityId) }

        val details = utility.programDetails
            ?: throw UtilityNotFoundException(utilityId)

        return UtilityProgramDetailsResponse(
            title = details.title,
            description1 = details.description1,
            description2 = details.description2,
            enrollmentDesc = details.enrollmentDesc,
            chargingIncentivesDesc = details.chargingIncentivesDesc
        )
    }

    fun getAverageStatistics(utilityId: Long): UtilityAverageStatisticsResponse {
        val utility = utilityRepository.findById(utilityId)
            .orElseThrow { UtilityNotFoundException(utilityId) }

        val numberOfPlugIns = plugSessionRepository.findAveragePlugInsPerCustomerByUtility(utilityId) ?: 0.0

        return when (utility.programType) {
            ProgramType.DP -> {
                val kwhShifted = scheduleRepository.findAverageKwhShiftedPerCustomerByUtility(utilityId) ?: 0.0
                val schedulesFollowed = scheduleRepository.findAverageSchedulesFollowedPerCustomerByUtility(utilityId)
                UtilityAverageStatisticsResponse(
                    kwhShifted = kwhShifted,
                    numberOfPlugIns = numberOfPlugIns,
                    schedulesFollowed = schedulesFollowed,
                    drEventsCompleted = null
                )
            }
            ProgramType.DR -> {
                val kwhShifted = customerDrEventRepository.findAverageKwhShiftedPerCustomerByUtility(utilityId) ?: 0.0
                val drEventsCompleted = customerDrEventRepository.findAverageDrEventsCompletedPerCustomerByUtility(utilityId)
                UtilityAverageStatisticsResponse(
                    kwhShifted = kwhShifted,
                    numberOfPlugIns = numberOfPlugIns,
                    schedulesFollowed = null,
                    drEventsCompleted = drEventsCompleted
                )
            }
        }
    }
}


