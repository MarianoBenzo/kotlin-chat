package model

class MessageWS(val type: String, val data: Any?) {
    constructor(type: ClientMessageWSType, data: Any?) : this(type.name, data)
    constructor(type: ServerMessageWSType, data: Any?) : this(type.name, data)
}

enum class ClientMessageWSType {
    PING,
    NEW_USER,
    NEW_MESSAGE,
    STARTED_TYPING,
    STOPPED_TYPING
}

enum class ServerMessageWSType {
    PONG,
    USERS,
    ADD_USER,
    REMOVE_USER,
    ADD_MESSAGE,
    ADD_USER_TYPING,
    REMOVE_USER_TYPING
}
