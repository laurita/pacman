import akka.actor.{Actor, ActorLogging}
import items._
import scala.io.Source._
import scala.util.parsing.json.{JSONArray, JSONObject}
import scala.{Option, Tuple3}

sealed trait PacManMessage
case object GetPlayer extends PacManMessage
case class Move(keycode: Int, playerId: Int) extends PacManMessage
case class PlayerId(id: Int) extends PacManMessage
case class State(state: Map[String, Any]) extends PacManMessage
case object FullGame extends PacManMessage

class PacManActor extends Actor with ActorLogging {

  val board = readBoard()
  /*
  val borderTemplates: Map[String, List[List[Int]]] = Map(
    "v" -> List(List(1, 0), List(1, 1), List(1, 2)),
    "h" -> List(List(0, 1), List(1, 1), List(2, 1)),
    "tl" -> List(List(1, 1), List(1, 2), List(2, 1)),
    "tr" -> List(List(0, 1), List(1, 1), List(1, 2)),
    "br" -> List(List(1, 0), List(0, 1), List(1, 1)),
    "bl" -> List(List(1, 0), List(1, 1), List(2, 1))
  )
  */

  override def receive: Actor.Receive = initial(makeBoardMap(readBoard()))

  def initial(state: Map[String, Any]): Receive = {
    case GetPlayer =>
      log.info(s"got GetPlayer")
      // TODO:
      val pl = getPlayer(state)
      pl match {
        case None =>
          sender ! FullGame
        case Some(x) =>
          sender ! PlayerId(x.id)
          val players = x :: state.get("players").get.asInstanceOf[List[Player]]
          val jsonState = makeState(state)
          val newState = state + ("players" -> players)
          context.become(initial(newState))
          sender ! State(jsonState)
      }
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
          val loc = Map('x' -> x._2, 'y' -> x._3)
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
            var color = elem match {
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
    rec(list, Nil, Nil, Nil, Nil, None) + ("players" -> Nil) + ("board" -> board)
  }


  def getPlayer(state: Map[String, Any]): Option[Player] = {
    val players = state.get("players").get.asInstanceOf[List[Player]]

    def rec(ghosts: List[Ghost]): Option[Player] = {
      ghosts match {
        case Nil => None
        case x::xs if !players.exists(p => p.asInstanceOf[Ghost].id == x.id) =>
          Some(x.asInstanceOf[Player])
        case x::xs =>
          rec(xs)
      }
    }

    if (!players.exists(x => x.getClass.equals(Pacman.getClass))) {
      state.get("pacman").asInstanceOf[Some[Player]]
    } else if (players.length < 5) {
      rec(state.get("ghosts").asInstanceOf[List[Ghost]])
    } else None
  }
}

