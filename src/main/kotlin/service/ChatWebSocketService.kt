package service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import model.Message
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
    val messages = mutableListOf<String>()
    var uids = AtomicLong(0)

    @OnWebSocketConnect
    fun onConnected(session: Session) {
        session.idleTimeout = 0
        println("Session Connected")
    }

    @OnWebSocketMessage
    fun onMessage(session: Session, message: String) {
        val message2 = jacksonObjectMapper().readValue<Message>(message)

        when (message2.type) {
            "join" -> {
                val id = uids.getAndIncrement()
                val name = message2.data?.let { it as String } ?: "Unknown-$id"
                val user = User(id, name)
                users[session] = user

                broadcast(Message("users", users.values))
                emit(session, Message("messages", messages))

                println("Join - User: ${user.name}")
            }
            "say" -> {
                messages.add(message2.data as String)
                broadcast(Message("messages", messages))

                println("Say - Message: ${message2.data}")
            }
        }
    }

    @OnWebSocketClose
    fun onDisconnect(session: Session, code: Int, reason: String?) {
        // remove the user from our list
        val user = users.remove(session)
        // notify all other users this user has disconnected
        if (user != null) {
            broadcast(Message("users", users.values))
            println("Session Disconnected - User: ${user.name}")
        } else {
            println("Session Disconnected")
        }
    }

    fun emit(session: Session, message: Message) =
        session.remote.sendString(jacksonObjectMapper().writeValueAsString(message))

    fun broadcast(message: Message) = users.forEach { emit(it.key, message) }

    private fun broadcastToOthers(session: Session, message: Message) =
        users.filter { it.key != session }.forEach { emit(it.key, message)}
}
