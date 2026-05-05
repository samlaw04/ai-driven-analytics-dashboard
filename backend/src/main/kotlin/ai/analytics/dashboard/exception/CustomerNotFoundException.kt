package ai.analytics.dashboard.exception

class CustomerNotFoundException(customerId: Long) :
    RuntimeException("Customer not found with ID: $customerId")

