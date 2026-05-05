package ai.analytics.dashboard.repository

import ai.analytics.dashboard.entity.Schedule
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.OffsetDateTime
import java.util.Optional

@Repository
interface ScheduleRepository : JpaRepository<Schedule, Long> {

    @Query(
        value = """
            SELECT s.*
            FROM dashboard.schedule s
            JOIN dashboard.plug_session ps ON s.plug_session_id = ps.plug_session_id
            JOIN dashboard.customer_vehicle cv ON ps.customer_vehicle_id = cv.customer_vehicle_id
            WHERE cv.customer_id = :customerId
              AND s.schedule_date >= :startDate
              AND s.schedule_date <= :endDate
        """,
        nativeQuery = true
    )
    fun findByCustomerIdAndDateRange(
        @Param("customerId") customerId: Long,
        @Param("startDate") startDate: OffsetDateTime,
        @Param("endDate") endDate: OffsetDateTime
    ): List<Schedule>

    @Query(
        value = """
            SELECT
                cv.nickname                      AS nickname,
                cv.model_name                    AS modelName,
                cv.model_year                    AS modelYear,
                pi.battery_percentage_at_plug_in AS batteryPercentageAtPlugIn,
                s.charge_windows::text           AS chargeWindows,
                cv.encoded_photo                 AS encodedPhoto
            FROM dashboard.schedule s
            JOIN dashboard.plug_session ps ON s.plug_session_id = ps.plug_session_id
            JOIN dashboard.customer_vehicle cv ON ps.customer_vehicle_id = cv.customer_vehicle_id
            JOIN dashboard.plug_in pi ON ps.plug_in_id = pi.plug_in_id
            WHERE cv.customer_id = :customerId
              AND ps.is_active_session = true
            ORDER BY s.schedule_date DESC
            LIMIT 1
        """,
        nativeQuery = true
    )
    fun findCurrentScheduleByCustomerId(
        @Param("customerId") customerId: Long
    ): Optional<CurrentScheduleProjection>
}

