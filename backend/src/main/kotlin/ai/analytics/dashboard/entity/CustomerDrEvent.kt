package ai.analytics.dashboard.entity

import jakarta.persistence.*

@Entity
@Table(name = "customer_dr_event", schema = "dashboard")
data class CustomerDrEvent(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_dr_event_id")
    val customerDrEventId: Long = 0,

    @Column(name = "dr_event_id")
    val drEventId: Long? = null,

    @Column(name = "plug_session_id", nullable = false)
    val plugSessionId: Long = 0,

    @Column(name = "customer_vehicle_id")
    val customerVehicleId: Long? = null,

    @Column(name = "dr_event_overridden")
    val drEventOverridden: Boolean = false,

    @Column(name = "kwh_shifted")
    val kwhShifted: Double = 0.0
)

