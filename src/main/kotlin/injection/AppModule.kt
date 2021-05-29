package injection

import Routes
import com.google.inject.AbstractModule
import com.google.inject.Provides
import com.google.inject.Singleton
import controller.PageViewController

class AppModule : AbstractModule() {

    @Provides
    @Singleton
    fun routes(pageViewController: PageViewController) = Routes(pageViewController)
}
