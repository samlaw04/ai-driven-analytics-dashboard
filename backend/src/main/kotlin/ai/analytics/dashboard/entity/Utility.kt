package ai.analytics.dashboard.entity

import jakarta.persistence.*

@Entity
@Table(name = "utility", schema = "dashboard")
data class Utility(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "utility_id")
    val utilityId: Long = 0,

    @Column(name = "program_name", nullable = false)
    val programName: String = "",

    @Enumerated(EnumType.STRING)
    @Column(name = "program_type", nullable = false)
    val programType: ProgramType = ProgramType.DP
)

