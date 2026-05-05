package ai.analytics.dashboard.dto

data class CurrentScheduleResponse(
    val vehicleName: String,
    val currentBatteryPercentage: Int,
    val chargeWindows: String,
    val vehicleImage: String
)

