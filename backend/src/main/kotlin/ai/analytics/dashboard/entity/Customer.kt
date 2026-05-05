package ai.analytics.dashboard.entity

import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "customer", schema = "dashboard")
data class Customer(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    val customerId: Long = 0,

    @Column(name = "utility_id")
    val utilityId: Long? = null,

    @Column(name = "first_name", nullable = false)
    val firstName: String = "",

    @Column(name = "last_name", nullable = false)
    val lastName: String = "",

    @Column(name = "password", nullable = false)
    val password: String = "",

    @Column(name = "email", nullable = false, unique = true)
    val email: String = "",

    @Column(name = "created_date")
    val createdDate: OffsetDateTime? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "enrollment_status")
    val enrollmentStatus: EnrollmentStatus? = null
)
