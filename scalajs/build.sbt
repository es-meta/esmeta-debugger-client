ThisBuild / organization := "esmeta"
ThisBuild / version      := "0.1.0-SNAPSHOT"
ThisBuild / scalaVersion := "3.3.3"

lazy val esmeta = (project in file("esmeta"))
  .enablePlugins(ScalaJSPlugin)
  .settings(
    // other settings
  )


// lazy val rootroot = (project in file("."))
//   .aggregate(worker, root)

// lazy val worker = (project in file("worker"))
//   .settings(
//     // other settings
//   ).dependsOn(root)

import org.scalajs.linker.interface.ModuleInitializer
import org.scalajs.linker.interface.ModuleSplitStyle
import org.scalajs.linker.interface.ModuleKind
import org.scalajs.linker.interface.OutputPatterns

lazy val worker = (project in file("."))
  .enablePlugins(ScalaJSPlugin)
  .dependsOn(esmeta)
  .aggregate(esmeta)
  .settings(
    name := "esmeta-worker",
      scalaVersion := "3.3.3",
      scalacOptions ++= Seq("-encoding", "utf-8", "-deprecation", "-feature",
      // disable import suggestions related bug: https://github.com/scala/scala3/issues/12876
       "-Ximport-suggestion-timeout",
       "0",
       ),

      // if  we are creating a library, false
      scalaJSUseMainModuleInitializer := false,

      scalaJSLinkerConfig ~= {
      
        _.withModuleKind(ModuleKind.ESModule)
          .withOutputPatterns(OutputPatterns.fromJSFile("%s.mjs"))
          // .withESVersion(ESVersion.ES2015)

      },
      // scalaJSMainModuleInitializer := Some(ModuleInitializer.mainMethod("worker.Main", "main")),
      // webpackBundlingMode := BundlingMode.LibraryAndApplication(),
      

      libraryDependencies ++= Seq(
        // not accessing DOM
        "org.scala-js" %%% "scalajs-dom" % "2.4.0",
        ("org.scala-lang.modules" %%% "scala-parser-combinators" % "1.1.2")
          .cross(CrossVersion.for3Use2_13),
        "org.typelevel" %% "cats-effect" % "3.5.7",
        "org.typelevel" %% "cats-core" % "2.12.0", // to derive recursive codecs
        "io.circe" %%% "circe-core" % "0.14.1",
        "io.circe" %%% "circe-generic" % "0.14.1",
        "io.circe" %%% "circe-parser" % "0.14.1",
      )


  )

dependsOn(esmeta)
