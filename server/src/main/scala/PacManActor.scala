import akka.actor.{Actor, ActorLogging}
import items._
import scala.io.Source._
import scala.util.parsing.json.{JSON, JSONArray, JSONObject}
import scala.{Option, Tuple3}

sealed trait PacManMessage
case object GetPlayer extends PacManMessage
case class Move(keycode: Int, playerId: Int) extends PacManMessage
case class PlayerId(id: Int) extends PacManMessage
case class State(state: Map[String, Any]) extends PacManMessage
case object FullGame extends PacManMessage

class PacManActor extends Actor with ActorLogging {

  val board = readBoard()

  override def receive: Actor.Receive = initial(makeBoardMap(readBoard()))

  def initial(state: Map[String, Any]): Receive = {
    case GetPlayer =>
      log.info(s"got GetPlayer")
      val pl = getPlayerId(state)
      pl match {
        case None =>
          sender ! FullGame
        case Some(x) =>
          sender ! PlayerId(x)
          val players = x :: state.get("players").get.asInstanceOf[List[Int]]
          val newState = state + ("players" -> players)
          val jsonState = makeState(newState)
          context.become(initial(newState))
          sender ! State(jsonState)
      }

    case Move(k, p) =>
      log.info(s"got Move($k, $p)")
      val newLoc = getNextCellLocation(p, state.get("board").get.asInstanceOf[Array[Array[Int]]], k)
      // get what is in next cell
      // perform event
      // TODO
      val newState = performEvent(p, newLoc, state)
      context.become(initial(newState))
      val jsonState = makeState(newState)
      sender ! State(jsonState)

  }

  ////////////////////////////////////////////////////// HELPERS ///////////////////////////////////////////////////////
  private def readBoard(): Array[Array[Int]] = {
    val source = fromFile("assets/board.txt")
    val lines = source.getLines()
    lines.map( line =>
      line.split(",").map(_.toInt)
    ).toArray
  }

  private def makeState(state: Map[String, Any]): Map[String, Any] = {
    val ba = state.get("board").get.asInstanceOf[Array[Array[Int]]]
    val jsonA = new JSONArray(ba.map(x => new JSONArray(x.toList)).toList)
    Map("board" -> jsonA)
  }


  private def makeBoardMap(board: Array[Array[Int]]): Map[String,Any] = {
    val list = board.toList.zipWithIndex.flatMap(ai => ai._1.zipWithIndex.map( aj => (aj._1, ai._2, aj._2)))

    def rec(list: List[Tuple3[Int, Int, Int]], borders: List[Border],
            pills: List[Pill], foods: List[Food], ghosts: List[Ghost],
            pacman: Option[Pacman]): Map[String, Any] = {

      list match {
        case Nil =>
          Map("borders" -> borders,
              "pills" -> pills,
              "foods" -> foods,
              "ghosts" -> ghosts,
              "pacman" -> pacman.get
          )
        case x::xs =>
          val loc = List(x._2, x._3)
          val elem = x._1
          // borders
          if (elem == 0) {
            rec(xs, borders, pills, foods, ghosts, pacman)
          }
          else if (elem >= 1 && elem <= 6) {
            rec(xs, new Border(loc, elem) :: borders, pills, foods, ghosts, pacman)
          }
          // pills
          else if (elem == 7) {
            rec(xs, borders, new Pill(loc) :: pills, foods, ghosts, pacman)
          }
          // food
          else if (elem == 8) {
            rec(xs, borders, pills, new Food(loc) :: foods, ghosts, pacman)
          }
          // ghosts
          // TODO: change color to type/name
          else if (elem >= 9 && elem <= 12) {
            val color = elem match {
              case 9 => "#d00"
              case 10 => "#6ff"
              case 11 => "#f99"
              case 12 => "#f90"
            }
            rec(xs, borders, pills, foods, new Ghost(elem, loc, 1, color) :: ghosts, pacman)
          } else if (elem == 13) {
            rec(xs, borders, pills, foods, ghosts, Some(new Pacman(elem, loc, 1)))
          } else throw new Exception(s"wrong elelment in board $elem")
      }
    }
    rec(list, Nil, Nil, Nil, Nil, None) + ("players" -> Nil) + ("board" -> board) + ("score" -> 0)
  }


  private def getPlayerId(state: Map[String, Any]): Option[Int] = {
    val players = state.get("players").get.asInstanceOf[List[Int]]

    def rec(ghosts: List[Ghost]): Option[Int] = {
      ghosts match {
        case Nil => None
        case x::xs if !players.exists(p => p == x.id) =>
          Some(x.id)
        case x::xs =>
          rec(xs)
      }
    }

    if (players.length < 5) {
      if (!players.exists(x => x == 13)) {
        Option(13)
      } else rec(state.get("ghosts").asInstanceOf[List[Ghost]])
    } else None
  }

  private def getNextCellLocation(pId: Int, board: Array[Array[Int]], keycode: Int): List[Int] = {
    val loc = getPlayerLoc(pId, board)
    log.info(s"old location $loc")
    val newLoc = keycode match {
      // left
      case 37 =>
        log.info("left")
        List( loc(0), loc(1) - 1)

      // up
      case 38 =>
        log.info("up")
        List( loc(0) - 1, loc(1))

      // right
      case 39 =>
        log.info("right")
        List( loc(0), loc(1) + 1)

      // down
      case 40 =>
        log.info("down")
        List( loc(0) + 1, loc(1))
      //case _ =>
      //  log.info("other")
    }
    log.info(s"next cell location for $pId: " + newLoc)
    newLoc
  }

  private def performEvent(pId: Int, newLoc: List[Int], state: Map[String, Any]): Map[String, Any] = {

    val board = state.get("board").get.asInstanceOf[Array[Array[Int]]]
    val metId = board(newLoc(0))(newLoc(1))
    (pId, metId) match {
      // pacman against something
      case (13, x) =>
        val pac = state.get("pacman").get.asInstanceOf[Pacman]
        x match {
          case 0 =>
            // move pacman to this cell, i.e. change two board array cell values
            // and update pacman state
            log.info("pacman against empty")

            board(pac.loc(0))(pac.loc(1)) = 0
            board(newLoc(0))(newLoc(1)) = pId
            log.info("pacman loc before "+ pac.loc)
            val newPac = new Pacman(pac.i, newLoc, pac.dir)
            // and update pacman in JSON
            replacePacman(state, newPac)
          case y if y >= 1 && y <= 6 =>
            log.info(s"pacman bumped into $x")
            state
          case 7 =>
            // remove pill, increase score and replace pacman
            log.info("pacman against pill")
            // move pacman to this cell, i.e. change two board array cell values
            // and update pacman state
            board(pac.loc(0))(pac.loc(1)) = 0
            board(newLoc(0))(newLoc(1)) = pId
            // and update pacman in JSON
            val newPac = new Pacman(pac.i, newLoc, pac.dir)
            replacePacman(increaseScore(removePill(newLoc, state)), newPac)
          case 8 =>
            // remove food, increase score and replace pacman
            log.info("pacman against pill")
            // move pacman to this cell, i.e. change two board array cell values
            // and update pacman state
            board(pac.loc(0))(pac.loc(1)) = 0
            board(newLoc(0))(newLoc(1)) = pId
            // and update pacman in JSON
            val newPac = new Pacman(pac.i, newLoc, pac.dir)
            replacePacman(increaseScore(removeFood(newLoc, state)), newPac)
        }
    }


  }

  private def getPlayerById(players: List[Player], id: Int): Player = {
    players.find(p => p.id == id).get
  }

  private def getPlayerLoc(pId: Int, board: Array[Array[Int]]): List[Int] = {
    val r = board.indexWhere(r => r.contains(pId))
    val c = board(r).indexOf(pId)
    List(r, c)
  }

  private def removePill(l: List[Int], state: Map[String, Any]): Map[String, Any] = {
    val newPills = state.get("pills").get.asInstanceOf[List[Pill]].filterNot(p => p.loc == l)
    state + ("pills" -> newPills)
  }

  private def removeFood(l: List[Int], state: Map[String, Any]): Map[String, Any] = {
    val newFoods = state.get("foods").get.asInstanceOf[List[Food]].filterNot(f => f.loc == l)
    state + ("foods" -> newFoods)
  }

  private def increaseScore(state: Map[String, Any]): Map[String, Any] = {
    state + ("score" -> (state.get("score").get.asInstanceOf[Int] + 1))
  }

  private def replacePacman(state: Map[String,Any], pac: Pacman): Map[String, Any] = {
    state + ("pacman" -> pac)
  }
}