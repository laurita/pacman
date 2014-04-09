import akka.actor.{PoisonPill, Props, ActorSystem}
import org.mashupbots.socko.events.HttpResponseStatus
import org.mashupbots.socko.infrastructure.Logger
import org.mashupbots.socko.routes._
import org.mashupbots.socko.webserver.{WebServer, WebServerConfig}

object PacManServer extends Logger {

  // create actor system
  val system = ActorSystem("PacManActorSystem")

  // create PacManActor
  system.actorOf(Props[PacManActor], name="PacManActor")

  // create routes
  val routes = Routes({

    case HttpRequest(httpRequest) => httpRequest match {
      case GET(Path("/")) =>
        // return HTML page to establish web socket
        system.actorOf(Props[HTTPRequestHandler]) ! httpRequest

      case GET(Path(path)) => path match {
        case p if p.endsWith(".js") || p.endsWith(".css") =>
          // return HTML page to establish web socket
          system.actorOf(Props(new AssetsHandler(p))) ! httpRequest
      }

      case _ =>
        // otherwise return 404
        log.info("unknown http request")
        httpRequest.response.write(HttpResponseStatus.NOT_FOUND)
    }

    case WebSocketHandshake(wsHandshake) => wsHandshake match {
      case Path("/websocket/") =>
        log.info("handshake")
        wsHandshake.authorize(
          onComplete = Some(onWebSocketHandshakeComplete),
          onClose = Some(onWebSocketClose)
        )
    }

    case WebSocketFrame(wsFrame) =>
      log.info(s"got frame $wsFrame")
      val webSocketId = wsFrame.webSocketId
      val wsrh = system.actorSelection(s"user/socketRequestHandler$webSocketId")
      wsrh ! wsFrame
  })

  // create web server
  val webServer = new WebServer(WebServerConfig(), routes, system)

  def main(args: Array[String]) {
    Runtime.getRuntime.addShutdownHook(new Thread {
      override def run() { webServer.stop() }
    })
    webServer.start()
    println("Open a few browsers and navigate to http://localhost:8888/. Start playing!")
  }

  def onWebSocketHandshakeComplete(webSocketId: String) {
    // create WebSocketRequestHandler
    system.actorOf(Props(new WebSocketRequestHandler(webSocketId)), name=s"socketRequestHandler$webSocketId")
  }

  def onWebSocketClose(webSocketId: String) {
    system.actorSelection(s"user/socketRequestHandler$webSocketId") ! PoisonPill
    println(s"Web socket $webSocketId closed")
  }
}