import akka.actor.{ActorLogging, Actor}
import org.mashupbots.socko.events.WebSocketFrameEvent
import scala.util.parsing.json.{JSONObject, JSON}

class WebSocketRequestHandler(webSocketId: String) extends Actor with ActorLogging {
  override def receive: Actor.Receive = {
    case frameEvent: WebSocketFrameEvent =>
      log.info(s"got $frameEvent in loggedIn mode")
      // parse JSON from data sent
      val json = JSON.parseFull(frameEvent.readText()).get.asInstanceOf[Map[String,Any]]
      if (json.contains("event")) {
        log.info("json contains event")
        json.get("event").get match {
          case "start" =>
            log.info(s"got start")
            context.system.actorSelection(s"user/PacManActor") ! GetPlayer
            context.become(waitForPlayer)
          case "move" =>
            log.info(s"got move")
            //get keycode
            val keycode = json.get("keycode")
            // TODO: send play move to PacManActor
          case e =>
            log.info(s"unknown event $e")
        }
      } else {
        log.info("json does not contain event")
      }

  }

  def waitForPlayer: Receive = {
    case PlayerId(id) =>
      log.info(s"got PlayerId($id) in waitForPlayer state")
      context.become(waitForState(id))
    case FullGame =>
      log.info(s"got FullGame in waitForPlayer state")
      val text = new JSONObject(Map("state" -> "full")).toString()
      PacManServer.webServer.webSocketConnections.writeText(text, webSocketId)
    case m =>
      log.info(s"got unknown message $m in waitForPlayer state")
  }

  def waitForState(playerId: Int): Receive = {
    case State(state) =>
      log.info(s"got State($state) in waitForPlayer state")
      val text = new JSONObject(state + ("player" -> playerId)).toString()
      PacManServer.webServer.webSocketConnections.writeText(text, webSocketId)
    case m =>
      log.info(s"got unknown message $m in waitForState state")
  }

  ///////////////////////////////////////////////////////////////////////

}