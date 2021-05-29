package injection

import com.google.inject.AbstractModule
import com.google.inject.Provides
import com.google.inject.Singleton
import controller.PageViewController

class ControllerModule : AbstractModule() {

    @Provides
    @Singleton
    fun pageViewController(): PageViewController = PageViewController()
}
