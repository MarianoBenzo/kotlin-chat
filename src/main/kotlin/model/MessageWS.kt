package model

class MessageWS(type: MessageWSType, val data: Any?) {
    val type = type.name
}

enum class MessageWSType {
    USERS,
    ADD_USER,
    REMOVE_USER,
    NEW_USER,
    ADD_MESSAGE,
    NEW_MESSAGE,
    USERS_WRITING,
    ADD_WRITING,
    REMOVE_WRITING
}
