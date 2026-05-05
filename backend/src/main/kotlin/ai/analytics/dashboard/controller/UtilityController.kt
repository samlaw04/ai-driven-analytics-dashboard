package ai.analytics.dashboard.controller

import ai.analytics.dashboard.dto.UtilityAverageStatisticsResponse
import ai.analytics.dashboard.dto.UtilityProgramDetailsResponse
import ai.analytics.dashboard.service.UtilityService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/utility")
class UtilityController(private val utilityService: UtilityService) {

    @GetMapping("/program-details")
    fun getProgramDetails(
        @RequestHeader("Utility-Id") utilityId: Long
    ): ResponseEntity<UtilityProgramDetailsResponse> {
        val response = utilityService.getProgramDetails(utilityId)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/average-statistics")
    fun getAverageStatistics(
        @RequestHeader("Utility-Id") utilityId: Long
    ): ResponseEntity<UtilityAverageStatisticsResponse> {
        val response = utilityService.getAverageStatistics(utilityId)
        return ResponseEntity.ok(response)
    }
}



