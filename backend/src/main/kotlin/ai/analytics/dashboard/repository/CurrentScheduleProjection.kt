package ai.analytics.dashboard.repository

interface CurrentScheduleProjection {
    fun getNickname(): String?
    fun getModelName(): String
    fun getModelYear(): Int
    fun getBatteryPercentageAtPlugIn(): Int
    fun getChargeWindows(): String?
    fun getEncodedPhoto(): String?
}

