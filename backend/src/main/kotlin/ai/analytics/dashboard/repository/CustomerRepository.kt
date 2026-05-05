package ai.analytics.dashboard.repository

import ai.analytics.dashboard.entity.Customer
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface CustomerRepository : JpaRepository<Customer, Long> {
    fun findByEmailAndPassword(email: String, password: String): Optional<Customer>
}

