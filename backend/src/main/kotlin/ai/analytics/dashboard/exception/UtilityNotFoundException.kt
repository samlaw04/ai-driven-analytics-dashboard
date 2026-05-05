package ai.analytics.dashboard.exception

class UtilityNotFoundException(utilityId: Long) :
    RuntimeException("No utility program found for utility ID: $utilityId")

