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

    private val users = HashMap<Session, User>()
    private var ids = AtomicLong(0)

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
                val id = ids.getAndIncrement()
                val name = messageWS.data?.let { it as String } ?: "Unknown"

                var nameUnique = name
                var i = 2
                while (users.values.any { user -> user.name == nameUnique }) {
                    nameUnique = "$name $i"
                   ++i
                }

                val user = User(id, nameUnique)
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
                users[session]?.let {
                    val newMessage = messageWS.data as String

                    broadcastToOthers(
                        session,
                        ServerMessageWSType.REMOVE_USER_TYPING,
                        it
                    )
                    emit(
                        session,
                        ServerMessageWSType.ADD_MESSAGE,
                        Message(it.name, newMessage, MessageType.OWN)
                    )
                    broadcastToOthers(
                        session,
                        ServerMessageWSType.ADD_MESSAGE,
                        Message(it.name, newMessage, MessageType.USER)
                    )
                }
            }

            ClientMessageWSType.STARTED_TYPING.name -> {
                users[session]?.let {
                    broadcastToOthers(session, ServerMessageWSType.ADD_USER_TYPING, it)
                }
            }

            ClientMessageWSType.STOPPED_TYPING.name -> {
                users[session]?.let{
                    broadcastToOthers(session, ServerMessageWSType.REMOVE_USER_TYPING, it)
                }
            }
        }
        println("Message Received - User: ${users[session]?.name} Type: ${messageWS.type} Data: ${messageWS.data}")
    }

    @OnWebSocketClose
    fun onDisconnect(session: Session, code: Int, reason: String?) {
        users.remove(session)?.let {
            broadcast(ServerMessageWSType.REMOVE_USER_TYPING, it)
            broadcast(ServerMessageWSType.REMOVE_USER, it)
            broadcast(
                ServerMessageWSType.ADD_MESSAGE,
                Message(it.name, "has disconnected", MessageType.SERVER)
            )

            println("Session Disconnected - User: ${it.name} Code: $code Reason: $reason")
        } ?: run {
            println("Session Disconnected - Code: $code Reason: $reason")
        }
    }

    private fun emit(session: Session, type: ServerMessageWSType, data: Any?) {
        val messageWS = MessageWS(type, data)
        session.remote.sendString(jacksonObjectMapper().writeValueAsString(messageWS))
    }

    private fun broadcast(type: ServerMessageWSType, data: Any?) = users.forEach { emit(it.key, type, data) }

    private fun broadcastToOthers(session: Session, type: ServerMessageWSType, data: Any?) =
        users.filter { it.key != session }.forEach { emit(it.key, type, data)}
}
