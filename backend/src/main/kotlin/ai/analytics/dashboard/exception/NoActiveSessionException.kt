package ai.analytics.dashboard.exception

class NoActiveSessionException(customerId: Long) :
    RuntimeException("No active charging session found for customer ID: $customerId")

