import controller.PageViewController
import spark.Spark.*

class Routes(
    private val pageViewController: PageViewController
) {
    fun register() {
        get("/", pageViewController.index())
    }
}
