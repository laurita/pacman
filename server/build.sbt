name := "PacMan"

version := "1.0"

scalaVersion := "2.10.2"

resolvers ++= Seq("Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/"
                )

libraryDependencies ++= Seq("org.mashupbots.socko" %% "socko-webserver" % "0.4.1"
                          )