package model

data class Message(
    val userName: String,
    val text: String,
    val type: MessageType = MessageType.CLIENT
)

enum class MessageType {
    SERVER,
    CLIENT
}
