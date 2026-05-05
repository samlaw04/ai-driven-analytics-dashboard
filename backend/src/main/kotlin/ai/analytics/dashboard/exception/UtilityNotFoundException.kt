package ai.analytics.dashboard.exception

class UtilityNotFoundException(customerId: Long) :
    RuntimeException("No utility program found for customer ID: $customerId")

