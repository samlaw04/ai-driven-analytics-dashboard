package ai.analytics.dashboard.controller

import ai.analytics.dashboard.dto.DemandResponseAccountSummaryResponse
import ai.analytics.dashboard.service.DemandResponseService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.OffsetDateTime

@RestController
@RequestMapping("/api/demand-response")
class DemandResponseController(private val demandResponseService: DemandResponseService) {

    @GetMapping("/account-summary")
    fun getAccountSummary(
        @RequestHeader("Customer-Id") customerId: Long,
        @RequestHeader("Start-Date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) startDate: OffsetDateTime,
        @RequestHeader("End-Date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) endDate: OffsetDateTime
    ): ResponseEntity<DemandResponseAccountSummaryResponse> {
        val summary = demandResponseService.getAccountSummary(customerId, startDate, endDate)
        return ResponseEntity.ok(summary)
    }
}

