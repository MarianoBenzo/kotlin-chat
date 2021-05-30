import com.google.inject.Guice
import com.google.inject.Injector
import injection.AppModule
import injection.ControllerModule
import service.ChatWebSocketService
import spark.Spark.*
import kotlin.system.exitProcess

private class KotlinChatApp(private val injector: Injector) {

    fun configure() = apply {
        port(9000)
        staticFiles.externalLocation("src/main/resources/public")
        webSocket("/ws/chat", ChatWebSocketService::class.java)
        injector.getInstance(Routes::class.java).register()
    }

    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            try {
                val injector = Guice.createInjector(
                    ControllerModule(),
                    AppModule()
                )
                KotlinChatApp(injector).configure()
            } catch (e: Exception) {
                println("Error starting the application")
                exitProcess(1)
            }
        }
    }
}
