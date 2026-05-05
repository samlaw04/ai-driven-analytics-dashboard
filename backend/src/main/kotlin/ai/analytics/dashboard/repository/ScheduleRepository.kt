package ai.analytics.dashboard.repository

import ai.analytics.dashboard.entity.Schedule
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.OffsetDateTime

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
}

