package ai.analytics.dashboard.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class UtilityProgramDetailsResponse(
    val title: String,
    @JsonProperty("description_1")
    val description1: String,
    @JsonProperty("description_2")
    val description2: String?,
    @JsonProperty("enrollment_desc")
    val enrollmentDesc: String?,
    @JsonProperty("charging_incentives_desc")
    val chargingIncentivesDesc: String
)

