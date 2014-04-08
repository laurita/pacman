import akka.actor.{ActorLogging, Actor}
import org.mashupbots.socko.events.WebSocketFrameEvent
import scala.util.parsing.json.JSON

class WebSocketRequestHandler(webSocketId: String) extends Actor with ActorLogging {
  override def receive: Actor.Receive = {
    case event: WebSocketFrameEvent =>
      log.info(s"got WebSocketFrame in loggedIn mode")
      // parse JSON from data sent
      val json = JSON.parseFull(event.readText()).get.asInstanceOf[Map[String,Any]]
      //get keycode
      val keycode = json.get("keycode")
  }

  ///////////////////////////////////////////////////////////////////////

}
