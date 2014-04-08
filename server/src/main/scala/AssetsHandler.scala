import akka.actor.{ActorLogging, Actor}
import org.mashupbots.socko.events.HttpRequestEvent

class AssetsHandler(path: String) extends Actor with ActorLogging {
  override def receive: Actor.Receive = {
    case event: HttpRequestEvent =>
      // return main page
      val htmlText = buildPage(path)
      writeHTML(event, htmlText)
      context.stop(self)

    case m =>
      log.info(s"received unknown message: $m")
      context.stop(self)
  }

  private def buildPage(path: String): String = {
    val source = scala.io.Source.fromFile("assets/javascript/"+path)
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

  def getCurrentDirectory = new java.io.File( "." ).getCanonicalPath
}
