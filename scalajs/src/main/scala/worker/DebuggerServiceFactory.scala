package worker

import esmeta.cfg.CFG
import esmeta.cfgBuilder.CFGBuilder
import esmeta.es.{Syntactic, Lexical, Initialize}
import esmeta.ir.*
import esmeta.ir.util.JsonProtocol.given


import esmeta.parser.{AstFrom, ESParser}
import esmeta.spec.*
import esmeta.spec.util.JsonProtocol.given



import esmeta.lang.Type
import esmeta.lang.util.JsonProtocol.given

import esmeta.ty.*

import esmeta.util.BaseUtils.debug
import esmeta.web.{Debugger}

import io.circe.*, io.circe.syntax.*, io.circe.generic.semiauto.*;
import io.circe.parser.decode

import org.scalajs.dom

import scala.concurrent.{Future, Promise as SPromise}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.scalajs.js;
// to convert scala future to js promise
import scala.scalajs.js.JSConverters.*
import scala.scalajs.js.annotation.{JSExport, JSExportAll, JSExportTopLevel}
import scala.util.{Success, Failure}
import scala.util.ChainingOps.*

private def fetchDump(base : String, urn: String): Future[String] = {
  dom.Fetch.fetch(if base == "" then urn else dom.URL(urn, base).toString()).toFuture.flatMap { response =>
    if (response.ok) {
      response.text().toFuture
    } else {
      println(s"Failed to fetch from $urn, see: ${response.statusText}")
      ???
    }
  }
}

private def decodeWithMeasure[T](tag: String)(json: String)(using Decoder[T]): Future[T] = Future {
  val start = System.currentTimeMillis()
  val result = decode[T](json).getOrElse(throw new Exception(s"Failed to decode ${tag}"))
  val end = System.currentTimeMillis()
  println(s"${tag} Decoded successfully, Time taken: ${end - start} ms")
  result
}


private def withMeasure[T](tag: String)(f: => T): T = {
  val start = System.currentTimeMillis()
  val result = f
  val end = System.currentTimeMillis()
  println(s"${tag} done, Time taken: ${end - start} ms")
  result
}

inline def benchmark[T](f : => T)(log: Long => Unit): (T) = {
  val start = System.currentTimeMillis()
  val result = f
  val end = System.currentTimeMillis()
  log(end - start)
  result
}


private def measureFutureTime[T](future: Future[T]): Future[T] = {
  val startTime = System.nanoTime()
  future.map { result =>
    val endTime = System.nanoTime()
    val duration = endTime - startTime
    println(s"Time taken for total build: ${duration / 1000000} ms")
    (result)
  }
}

import esmeta.ir.*
import esmeta.ir.Expr
import esmeta.ir.util.UnitWalker

// @ScalaJSDefined
trait Input extends js.Object {
  val funcs: String
  val version: String
  val grammar: String
  val tables: String
  val tyModel: String
  val irFuncToCode: String
}

@JSExportTopLevel("DebuggerServiceFactory")
object DebuggerServiceFactory {

  @JSExport
  def buildFromGiven(
    input: Input
  ): js.Promise[DebuggerService] = 
    measureFutureTime { withMeasure("build") {

            val  funcsFuture = (decodeWithMeasure[List[Func]]("Funcs")(input.funcs))
            val  versionFuture =  (decodeWithMeasure[Spec.Version]("Version")(input.version))
            val  grammarFuture = (decodeWithMeasure[Grammar]("Grammar")(input.grammar))
            val  tablesFuture = (decodeWithMeasure[Map[String, Table]]("Tables")(input.tables))
            val  tyModelFuture = (decodeWithMeasure[TyModel]("TyModel")(input.tyModel))
            val  irFuncToCodeFuture = (decodeWithMeasure[Map[String, Option[String]]]("irFuncToCode")(input.irFuncToCode))
            val algoFuture = Future(Nil) // not needed for now

            for {
              funcs <- funcsFuture
              algo <- algoFuture
              version <- versionFuture
              grammar <- grammarFuture
              tables <- tablesFuture
              tyModel <- tyModelFuture
              irFuncToCode <- irFuncToCodeFuture
              spec = Spec(Some(version), grammar, algo, tables, tyModel)
            } yield  {

              // TODO : fix parser
              // class IllegalFinder(f: Func) extends UnitWalker {
              //   override def walk(var1: Name): Unit = {
              //     if (var1.name == "false") {
              //       println(s"Illegal variable found: false in ${f.name}")
              //     }
              //   }
              // }

              // funcs.foreach(f => {
              //   val illegalFinder = IllegalFinder(f)
              //   illegalFinder.walk(f)
              // })

              val cfg = benchmark { CFGBuilder.apply(Program.apply(funcs, spec)) }{ t =>
                println(s"CFG created successfully, time taken: ${t}ms")
              }

              val service = benchmark { DebuggerService(cfg, irFuncToCode)} {
                t => println(s"Mocking Interface created successfully, Time taken: ${t} ms")
              }

              service
            }

          }
      }.toJSPromise

  @JSExport
  def build(
    base : String
    ): js.Promise[DebuggerService] = measureFutureTime { withMeasure("build") {

        val  funcsFuture = fetchDump(base, "/dump/funcs.json").flatMap(decodeWithMeasure[List[Func]]("Funcs")(_))
        val  versionFuture =  fetchDump(base, "/dump/spec.version.json").flatMap(decodeWithMeasure[Spec.Version]("Version")(_))
        val  grammarFuture = fetchDump(base, "/dump/grammar.json").flatMap(decodeWithMeasure[Grammar]("Grammar")(_))
        val  tablesFuture = fetchDump(base, "/dump/spec.tables.json").flatMap(decodeWithMeasure[Map[String, Table]]("Tables")(_))
        val  tyModelFuture = fetchDump(base, "/dump/tyModel.decls.json").flatMap(decodeWithMeasure[TyModel]("TyModel")(_))
        val  irFuncToCodeFuture = fetchDump(base, "/dump/irFuncToCode.json").flatMap(decodeWithMeasure[Map[String, Option[String]]]("irFuncToCode")(_))
        val algoFuture = Future(Nil) // not needed for now

        for {
          funcs <- funcsFuture
          algo <- algoFuture
          version <- versionFuture
          grammar <- grammarFuture
          tables <- tablesFuture
          tyModel <- tyModelFuture
          irFuncToCode <- irFuncToCodeFuture
          spec = Spec(Some(version), grammar, algo, tables, tyModel)
        } yield  {

          // TODO : fix parser
          // class IllegalFinder(f: Func) extends UnitWalker {
          //   override def walk(var1: Name): Unit = {
          //     if (var1.name == "false") {
          //       println(s"Illegal variable found: false in ${f.name}")
          //     }
          //   }
          // }

          // funcs.foreach(f => {
          //   val illegalFinder = IllegalFinder(f)
          //   illegalFinder.walk(f)
          // })

          val cfg = benchmark { CFGBuilder.apply(Program.apply(funcs, spec)) }{ t =>
            println(s"CFG created successfully, time taken: ${t}ms")
          }

          val service = benchmark { DebuggerService(cfg, irFuncToCode)} {
            t => println(s"Mocking Interface created successfully, Time taken: ${t} ms")
          }

          service
        }

      }
  }.toJSPromise



  @JSExport
  def run(base : String): Unit = build(base)
}
