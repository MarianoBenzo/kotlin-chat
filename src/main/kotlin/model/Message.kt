package model

data class Message(
    val userName: String,
    val text: String,
    val type: MessageType
)

enum class MessageType {
    OWN,
    USER,
    SERVER
}
