package items

sealed trait Player {
  def id: Int
  def loc: List[Int]
  def dir: Int
}


case class Ghost(i: Int, l: List[Int], d: Int, col: String) extends Player {
  val id = i
  val color = col
  val dir = d
  val loc = l
}

case class Pacman(i: Int, l: List[Int], d: Int) extends Player {
  val id = i
  val loc = l
  val dir = d
}
