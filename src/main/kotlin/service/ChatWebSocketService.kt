package service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import model.Message
import model.MessageType
import model.MessageWS
import model.User
import org.eclipse.jetty.websocket.api.Session
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage
import org.eclipse.jetty.websocket.api.annotations.WebSocket
import java.util.concurrent.atomic.AtomicLong

@WebSocket
class ChatWebSocketService {

    val users = HashMap<Session, User>()
    val messages = mutableListOf<Message>()
    var uids = AtomicLong(0)

    @OnWebSocketConnect
    fun onConnected(session: Session) {
        session.idleTimeout = 0
        println("Session Connected")
    }

    @OnWebSocketMessage
    fun onMessage(session: Session, message: String) {
        val messageWS = jacksonObjectMapper().readValue<MessageWS>(message)

        when (messageWS.type) {
            "join" -> {
                val id = uids.getAndIncrement()
                val name = messageWS.data?.let { it as String } ?: "Unknown-$id"
                val user = User(id, name)
                users[session] = user
                messages.add(Message(name, "has connected", MessageType.SERVER))

                broadcast(MessageWS("users", users.values))
                broadcast(MessageWS("messages", messages))

                println("Join - User: ${user.name}")
            }
            "say" -> {
                val userName = users[session]?.name ?: "Unknown"
                val newMessage = Message(userName, messageWS.data as String)
                messages.add(newMessage)

                broadcast(MessageWS("messages", messages))

                println("Say - Message: $newMessage")
            }
        }
    }

    @OnWebSocketClose
    fun onDisconnect(session: Session, code: Int, reason: String?) {
        // remove the user from our list
        val user = users.remove(session)
        // notify all other users this user has disconnected
        if (user != null) {
            messages.add(Message(user.name, "has disconnected", MessageType.SERVER))

            broadcast(MessageWS("users", users.values))
            broadcast(MessageWS("messages", messages))

            println("Session Disconnected - User: ${user.name}")
        } else {
            println("Session Disconnected")
        }
    }

    fun emit(session: Session, messageWS: MessageWS) =
        session.remote.sendString(jacksonObjectMapper().writeValueAsString(messageWS))

    fun broadcast(messageWS: MessageWS) = users.forEach { emit(it.key, messageWS) }

    private fun broadcastToOthers(session: Session, messageWS: MessageWS) =
        users.filter { it.key != session }.forEach { emit(it.key, messageWS)}
}
