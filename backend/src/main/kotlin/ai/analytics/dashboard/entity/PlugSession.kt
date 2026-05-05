package ai.analytics.dashboard.entity

import jakarta.persistence.*

@Entity
@Table(name = "plug_session", schema = "dashboard")
data class PlugSession(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plug_session_id")
    val plugSessionId: Long = 0,

    @Column(name = "customer_vehicle_id", nullable = false)
    val customerVehicleId: Long = 0,

    @Column(name = "plug_in_id", nullable = false)
    val plugInId: Long = 0,

    @Column(name = "plug_out_id")
    val plugOutId: Long? = null,

    @Column(name = "is_active_session")
    val isActiveSession: Boolean = true
)

