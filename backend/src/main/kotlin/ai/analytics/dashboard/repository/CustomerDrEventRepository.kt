package ai.analytics.dashboard.repository

import ai.analytics.dashboard.entity.CustomerDrEvent
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.time.OffsetDateTime
import java.util.Optional

interface UpcomingDrEventProjection {
    fun getDrEventDate(): OffsetDateTime
    fun getDrEventWindow(): String
}

interface CustomerDrEventWithDateProjection {
    val customerDrEventId: Long
    val drEventId: Long?
    val plugSessionId: Long
    val customerVehicleId: Long?
    val drEventOverridden: Boolean
    val kwhShifted: Double
    val drEventDate: LocalDate
}

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
            SELECT cde.customer_dr_event_id  AS customerDrEventId,
                   cde.dr_event_id           AS drEventId,
                   cde.plug_session_id        AS plugSessionId,
                   cde.customer_vehicle_id    AS customerVehicleId,
                   cde.dr_event_overridden    AS drEventOverridden,
                   cde.kwh_shifted            AS kwhShifted,
                   CAST(de.dr_event_date AS DATE) AS drEventDate
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
    fun findByCustomerIdAndDateRangeWithDate(
        @Param("customerId") customerId: Long,
        @Param("startDate") startDate: OffsetDateTime,
        @Param("endDate") endDate: OffsetDateTime
    ): List<CustomerDrEventWithDateProjection>

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

    @Query(
        value = """
            SELECT de.dr_event_date  AS drEventDate,
                   de.dr_event_window::text AS drEventWindow
            FROM dashboard.dr_event de
            JOIN dashboard.utility u ON de.utility_id = u.utility_id
            JOIN dashboard.customer c ON c.utility_id = u.utility_id
            WHERE c.customer_id = :customerId
              AND de.dr_event_date > NOW()
            ORDER BY de.dr_event_date ASC
            LIMIT 1
        """,
        nativeQuery = true
    )
    fun findUpcomingDrEventByCustomerId(
        @Param("customerId") customerId: Long
    ): Optional<UpcomingDrEventProjection>
}

