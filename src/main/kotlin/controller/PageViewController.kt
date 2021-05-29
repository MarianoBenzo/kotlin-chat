package controller

import spark.ModelAndView
import spark.Request
import spark.Response
import spark.TemplateEngine
import spark.template.velocity.VelocityTemplateEngine
import kotlin.collections.HashMap

class PageViewController {

    fun index() =
        { request: Request, _: Response ->
            ClientRequest(request).let {
                val model: HashMap<String, Any?> = hashMapOf(
                    "title" to "Kotlin Chat App"
                )

                render("index.vm", model)
            }
        }

    companion object {
        private val renderEngine: TemplateEngine
            get() = VelocityTemplateEngine()

        private fun render(templateName: String, model: Map<String, Any?> = emptyMap()) =
            renderEngine.render(ModelAndView(model, "public/$templateName"))
    }
}
