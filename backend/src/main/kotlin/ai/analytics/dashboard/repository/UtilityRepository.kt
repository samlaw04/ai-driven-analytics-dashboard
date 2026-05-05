package ai.analytics.dashboard.repository

import ai.analytics.dashboard.entity.Utility
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UtilityRepository : JpaRepository<Utility, Long>

