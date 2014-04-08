import akka.actor.{ActorLogging, Actor}
import org.mashupbots.socko.events.HttpRequestEvent

class HTTPRequestHandler extends Actor with ActorLogging {
  override def receive: Actor.Receive = {
    case event: HttpRequestEvent =>
      // return main page
      val htmlText = buildLoginPage()
      writeHTML(event, htmlText)
      context.stop(self)

    case m =>
      log.info(s"received unknown message: $m")
      context.stop(self)
  }

  private def buildLoginPage(): String = {
    val source = scala.io.Source.fromFile("assets/javascript/main.html")
    val lines = source.mkString
    source.close()
    lines
  }

  private def writeHTML(ctx: HttpRequestEvent, htmlText: String) {
    // send 100 continue if required
    if (ctx.request.is100ContinueExpected) {
      ctx.response.write100Continue()
    }
    ctx.response.write(htmlText, "text/html; charset=UTF-8")
  }
}