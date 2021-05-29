package controller

import spark.Request

class ClientRequest(
    private val request: Request
) {
    val body: String by lazy { request.body() }
    val params: Params by lazy { Params(request) }
}

class Params(private val request: Request) {
    val tripId: String by lazy { request.params(TRIP_ID_PARAM) }
    val partnerId: String? by lazy { request.queryParams(PARTNER_ID_QUERY_PARAM) }

    val filter: String? by lazy { request.queryParams(FILTER_QUERY_PARAM) }
    val asReferer: String? by lazy { request.queryParams(AS_REFERER_QUERY_PARAM) }
    val from: String? by lazy { request.queryParams(FROM_QUERY_PARAM) }

    val newName: String? by lazy { request.queryParams(NEW_NAME_QUERY_PARAM) }
    val citiesCodes: String? by lazy { request.queryParams(CITIES_CODES_QUERY_PARAM) }
    val cityGId: String by lazy { request.params(CITY_G_ID_PARAM) }

    companion object {
        private const val TRIP_ID_PARAM = "tripId"
        private const val CITY_G_ID_PARAM = "cityGId"

        private const val PARTNER_ID_QUERY_PARAM = "partner_id"
        private const val OFFSET_QUERY_PARAM = "offset"
        private const val LIMIT_QUERY_PARAM = "limit"
        private const val FILTER_QUERY_PARAM = "filter"
        private const val AS_REFERER_QUERY_PARAM = "as_referer"
        private const val FROM_QUERY_PARAM = "from"
        private const val NEW_NAME_QUERY_PARAM = "newName"
        private const val CITIES_CODES_QUERY_PARAM = "codes"
    }
}
