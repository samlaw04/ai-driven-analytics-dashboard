package ai.analytics.dashboard.service

import ai.analytics.dashboard.dto.UserProfileResponse
import ai.analytics.dashboard.dto.UtilityDto
import ai.analytics.dashboard.exception.CustomerNotFoundException
import ai.analytics.dashboard.repository.CustomerRepository
import ai.analytics.dashboard.repository.UtilityRepository
import org.springframework.stereotype.Service

@Service
class UserService(
    private val customerRepository: CustomerRepository,
    private val utilityRepository: UtilityRepository
) {

    fun getProfile(customerId: Long): UserProfileResponse {
        val customer = customerRepository.findById(customerId)
            .orElseThrow { CustomerNotFoundException(customerId) }

        val utilityDto = customer.utilityId?.let { uid ->
            utilityRepository.findById(uid).orElse(null)?.let {
                UtilityDto(
                    utilityId = it.utilityId,
                    programName = it.programName,
                    programType = it.programType
                )
            }
        }

        return UserProfileResponse(
            customerId = customer.customerId,
            utility = utilityDto,
            firstName = customer.firstName,
            lastName = customer.lastName,
            email = customer.email,
            createdDate = customer.createdDate,
            enrollmentStatus = customer.enrollmentStatus
        )
    }
}

