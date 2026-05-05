package ai.analytics.dashboard.exception

class NoDrEventException(customerId: Long) :
    RuntimeException("No upcoming demand response event found for customer ID: $customerId")

