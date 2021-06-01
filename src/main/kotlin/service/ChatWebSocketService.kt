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
    val usersWriting = mutableListOf<User>()
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
            MessageWSType.NEW_USER.name -> {
                val id = uids.getAndIncrement()
                val name = messageWS.data?.let { it as String } ?: "Unknown-$id"
                val user = User(id, name)
                users[session] = user

                emit(session, MessageWSType.USERS, users.values)
                broadcastToOthers(session, MessageWSType.ADD_USER, user)
                broadcastToOthers(
                    session,
                    MessageWSType.ADD_MESSAGE,
                    Message(name, "has connected", MessageType.SERVER)
                )
            }

            MessageWSType.NEW_MESSAGE.name -> {
                val userName = users[session]?.name ?: "Unknown"
                val newMessage = messageWS.data as String

                emit(
                    session,
                    MessageWSType.ADD_MESSAGE,
                    Message(userName, newMessage, MessageType.OWN)
                )
                broadcastToOthers(
                    session,
                    MessageWSType.ADD_MESSAGE,
                    Message(userName, newMessage, MessageType.USER)
                )
            }

            MessageWSType.ADD_WRITING.name -> {
                val userWriting = users[session]
                if (userWriting != null) {
                    usersWriting.removeAll { it.id == userWriting.id }
                    usersWriting.add(userWriting)

                    users.forEach {
                        emit(it.key, MessageWSType.USERS_WRITING, usersWriting.filter { user -> user.id != it.value.id })
                    }
                }
            }

            MessageWSType.REMOVE_WRITING.name -> {
                val userNotWriting = users[session]
                if (userNotWriting != null) {
                    usersWriting.removeAll { it.id == userNotWriting.id }

                    users.forEach {
                        emit(it.key, MessageWSType.USERS_WRITING, usersWriting.filter { user -> user.id != it.value.id })
                    }
                }
            }
        }
        println("Received: ${messageWS.type} - ${messageWS.data}")
    }

    @OnWebSocketClose
    fun onDisconnect(session: Session, code: Int, reason: String?) {
        // remove the user from our list
        val user = users.remove(session)

        // notify all other users this user has disconnected
        if (user != null) {
            usersWriting.removeAll { it.id == user.id}

            broadcast(MessageWSType.REMOVE_USER, user)
            broadcast(
                MessageWSType.ADD_MESSAGE,
                Message(user.name, "has disconnected", MessageType.SERVER)
            )

            println("Session Disconnected - User: ${user.name}")
        } else {
            println("Session Disconnected")
        }
    }

    fun emit(session: Session, type: MessageWSType, data: Any?) {
        val messageWS = MessageWS(type, data)
        session.remote.sendString(jacksonObjectMapper().writeValueAsString(messageWS))
    }

    fun broadcast(type: MessageWSType, data: Any?) = users.forEach { emit(it.key, type, data) }

    private fun broadcastToOthers(session: Session, type: MessageWSType, data: Any?) =
        users.filter { it.key != session }.forEach { emit(it.key, type, data)}
}
