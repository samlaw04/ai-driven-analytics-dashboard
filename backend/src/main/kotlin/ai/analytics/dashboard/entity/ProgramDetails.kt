package ai.analytics.dashboard.entity

import com.fasterxml.jackson.annotation.JsonProperty
import tools.jackson.module.kotlin.jacksonObjectMapper
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

data class ProgramDetails(
    val title: String = "",
    @JsonProperty("description_1")
    val description1: String = "",
    @JsonProperty("description_2")
    val description2: String? = null,
    @JsonProperty("enrollment_desc")
    val enrollmentDesc: String? = null,
    @JsonProperty("charging_incentives_desc")
    val chargingIncentivesDesc: String = ""
)

@Converter
class ProgramDetailsConverter : AttributeConverter<ProgramDetails, String> {

    private val objectMapper = jacksonObjectMapper()

    override fun convertToDatabaseColumn(attribute: ProgramDetails?): String? =
        attribute?.let { objectMapper.writeValueAsString(it) }

    override fun convertToEntityAttribute(dbData: String?): ProgramDetails? =
        dbData?.let { objectMapper.readValue(it, ProgramDetails::class.java) }
}

