package ai.analytics.dashboard.service

import ai.analytics.dashboard.dto.UtilityProgramDetailsResponse
import ai.analytics.dashboard.exception.UtilityNotFoundException
import ai.analytics.dashboard.repository.UtilityRepository
import org.springframework.stereotype.Service

@Service
class UtilityService(private val utilityRepository: UtilityRepository) {

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
}

