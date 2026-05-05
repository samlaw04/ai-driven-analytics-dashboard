package ai.analytics.dashboard.controller

import ai.analytics.dashboard.dto.CurrentScheduleResponse
import ai.analytics.dashboard.service.ScheduleService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/schedule")
class ScheduleController(private val scheduleService: ScheduleService) {

    @GetMapping("/current")
    fun getCurrentSchedule(
        @RequestHeader("Customer-Id") customerId: Long
    ): ResponseEntity<CurrentScheduleResponse> {
        val response = scheduleService.getCurrentSchedule(customerId)
        return ResponseEntity.ok(response)
    }
}

