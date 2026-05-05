package ai.analytics.dashboard.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "schedule", schema = "dashboard")
data class Schedule(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    val scheduleId: Long = 0,

    @Column(name = "plug_session_id", nullable = false)
    val plugSessionId: Long = 0,

    @Column(name = "customer_vehicle_id")
    val customerVehicleId: Long? = null,

    @Column(name = "schedule_date", nullable = false)
    val scheduleDate: LocalDateTime = LocalDateTime.now(),

    @Column(name = "schedule_overridden")
    val scheduleOverridden: Boolean = false,

    @Column(name = "actual_savings")
    val actualSavings: Double = 0.0,

    @Column(name = "potential_savings")
    val potentialSavings: Double = 0.0,

    @Column(name = "kwh_shifted")
    val kwhShifted: Double = 0.0
)

