package service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import model.*
import org.eclipse.jetty.websocket.api.Session
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage
import org.eclipse.jetty.websocket.api.annotations.WebSocket
import java.util.concurrent.atomic.AtomicLong

@WebSocket
class ChatWebSocketService {

    val users = HashMap<Session, User>()
    private var uids = AtomicLong(0)

    @OnWebSocketConnect
    fun onConnected(session: Session) {
        session.idleTimeout = 0
        println("Session Connected")
    }

    @OnWebSocketMessage
    fun onMessage(session: Session, message: String) {
        val messageWS = jacksonObjectMapper().readValue<MessageWS>(message)

        when (messageWS.type) {
            ClientMessageWSType.NEW_USER.name -> {
                val id = uids.getAndIncrement()
                val name = messageWS.data?.let { it as String } ?: "Unknown-$id"
                val user = User(id, name)
                users[session] = user

                emit(session, ServerMessageWSType.USERS, users.values)
                broadcastToOthers(session, ServerMessageWSType.ADD_USER, user)
                broadcastToOthers(
                    session,
                    ServerMessageWSType.ADD_MESSAGE,
                    Message(name, "has connected", MessageType.SERVER)
                )
            }

            ClientMessageWSType.NEW_MESSAGE.name -> {
                val userName = users[session]?.name ?: "Unknown"
                val newMessage = messageWS.data as String

                emit(
                    session,
                    ServerMessageWSType.ADD_MESSAGE,
                    Message(userName, newMessage, MessageType.OWN)
                )
                broadcastToOthers(
                    session,
                    ServerMessageWSType.ADD_MESSAGE,
                    Message(userName, newMessage, MessageType.USER)
                )
            }

            ClientMessageWSType.STARTED_TYPING.name -> {
                val userWriting = users[session]
                if (userWriting != null) {
                    broadcastToOthers(session, ServerMessageWSType.ADD_USER_TYPING, userWriting)
                }
            }

            ClientMessageWSType.STOPPED_TYPING.name -> {
                val userNotWriting = users[session]
                if (userNotWriting != null) {
                    broadcastToOthers(session, ServerMessageWSType.REMOVE_USER_TYPING, userNotWriting)
                }
            }
        }
        println("Message Received - User: ${users[session]?.name} Type: ${messageWS.type} Data: ${messageWS.data}")
    }

    @OnWebSocketClose
    fun onDisconnect(session: Session, code: Int, reason: String?) {
        val user = users.remove(session)

        if (user != null) {
            broadcast(ServerMessageWSType.REMOVE_USER_TYPING, user)
            broadcast(ServerMessageWSType.REMOVE_USER, user)
            broadcast(
                ServerMessageWSType.ADD_MESSAGE,
                Message(user.name, "has disconnected", MessageType.SERVER)
            )

            println("Session Disconnected - User: ${user.name} Code: $code Reason: $reason")
        } else {
            println("Session Disconnected - Code: $code Reason: $reason")
        }
    }

    fun emit(session: Session, type: ServerMessageWSType, data: Any?) {
        val messageWS = MessageWS(type, data)
        session.remote.sendString(jacksonObjectMapper().writeValueAsString(messageWS))
    }

    fun broadcast(type: ServerMessageWSType, data: Any?) = users.forEach { emit(it.key, type, data) }

    private fun broadcastToOthers(session: Session, type: ServerMessageWSType, data: Any?) =
        users.filter { it.key != session }.forEach { emit(it.key, type, data)}
}
