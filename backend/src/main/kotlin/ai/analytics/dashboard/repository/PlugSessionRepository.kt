package ai.analytics.dashboard.repository

import ai.analytics.dashboard.entity.PlugSession
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface PlugSessionRepository : JpaRepository<PlugSession, Long> {

    @Query(
        value = """
            SELECT AVG(ps_count.cnt)
            FROM (
                SELECT c.customer_id, COUNT(ps.plug_session_id) AS cnt
                FROM dashboard.customer c
                JOIN dashboard.customer_vehicle cv ON c.customer_id = cv.customer_id
                JOIN dashboard.plug_session ps ON cv.customer_vehicle_id = ps.customer_vehicle_id
                WHERE c.utility_id = :utilityId
                GROUP BY c.customer_id
            ) ps_count
        """,
        nativeQuery = true
    )
    fun findAveragePlugInsPerCustomerByUtility(
        @Param("utilityId") utilityId: Long
    ): Double?
}

