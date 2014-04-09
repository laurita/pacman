package items

sealed trait Player {
  def id: Int
  def loc: Map[Char, Int]
}


case class Ghost(i: Int, loc: Map[Char, Int], dir: Int, col: String) extends Player {
  val id = i
  val color = col
  val direction = dir
}

case class Pacman(i: Int, loc: Map[Char, Int], dir: Int) extends Player {
  val id = i
}
