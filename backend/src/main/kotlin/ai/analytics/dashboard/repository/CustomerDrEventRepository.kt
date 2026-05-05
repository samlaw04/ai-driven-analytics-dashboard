package ai.analytics.dashboard.repository

import ai.analytics.dashboard.entity.CustomerDrEvent
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.OffsetDateTime

@Repository
interface CustomerDrEventRepository : JpaRepository<CustomerDrEvent, Long> {

    @Query(
        value = """
            SELECT cde.*
            FROM dashboard.customer_dr_event cde
            JOIN dashboard.plug_session ps ON cde.plug_session_id = ps.plug_session_id
            JOIN dashboard.customer_vehicle cv ON ps.customer_vehicle_id = cv.customer_vehicle_id
            JOIN dashboard.dr_event de ON cde.dr_event_id = de.dr_event_id
            WHERE cv.customer_id = :customerId
              AND de.dr_event_date >= :startDate
              AND de.dr_event_date <= :endDate
        """,
        nativeQuery = true
    )
    fun findByCustomerIdAndDateRange(
        @Param("customerId") customerId: Long,
        @Param("startDate") startDate: OffsetDateTime,
        @Param("endDate") endDate: OffsetDateTime
    ): List<CustomerDrEvent>

    @Query(
        value = """
            SELECT COALESCE(
                SUM(EXTRACT(EPOCH FROM (po.plug_out_time - pi.plug_in_time))),
                0
            )
            FROM dashboard.customer_dr_event cde
            JOIN dashboard.plug_session ps ON cde.plug_session_id = ps.plug_session_id
            JOIN dashboard.customer_vehicle cv ON ps.customer_vehicle_id = cv.customer_vehicle_id
            JOIN dashboard.dr_event de ON cde.dr_event_id = de.dr_event_id
            JOIN dashboard.plug_in pi ON ps.plug_in_id = pi.plug_in_id
            JOIN dashboard.plug_out po ON ps.plug_out_id = po.plug_out_id
            WHERE cv.customer_id = :customerId
              AND de.dr_event_date >= :startDate
              AND de.dr_event_date <= :endDate
        """,
        nativeQuery = true
    )
    fun getTotalTimePluggedInSeconds(
        @Param("customerId") customerId: Long,
        @Param("startDate") startDate: OffsetDateTime,
        @Param("endDate") endDate: OffsetDateTime
    ): Double
}

