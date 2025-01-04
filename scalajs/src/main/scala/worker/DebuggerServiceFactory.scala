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

def fetchJsonString(base : String) = {

  val specFuture = fetchDump(base, "/dump/spec.json")
  val grammarFuture = fetchDump(base, "/dump/grammar.json")
  // val algoFuture = fetchDump(base, "/dump/algorithms.json")
  val tyModelFuture = fetchDump(base, "/dump/tyModel.decls.json")
  val tablesFuture = fetchDump(base, "/dump/spec.tables.json")
  val versionFuture = fetchDump(base, "/dump/spec.version.json")
  val funcsFuture = fetchDump(base, "/dump/funcs.json")
  val irFuncToCodeFuture = fetchDump(base, "/dump/irFuncToCode.json")

  val ret = (for {
    spec <- specFuture
    grammar <- grammarFuture
    // algo <- algoFuture
    tyModel <- tyModelFuture
    tables <- tablesFuture
    version <- versionFuture
    funcs <- funcsFuture
    irFuncToCode <- irFuncToCodeFuture
  } yield (spec, grammar, "", tyModel, tables, version, funcs, irFuncToCode))

  ret
}



private def decodeWithMeasure[T](tag: String)(json: String)(using Decoder[T]): Future[T] = Future {
  val start = System.currentTimeMillis()
  val result = decode[T](json).getOrElse(throw new Exception("Failed to decode"))
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

import esmeta.ir.*
import esmeta.ir.Expr
import esmeta.ir.util.UnitWalker

@JSExportTopLevel("DebuggerServiceFactory")
object DebuggerServiceFactory {

  @JSExport
  def build(
    base : String
    ): js.Promise[DebuggerService] = {
    fetchJsonString(base: String).flatMap { 
        case (specStr, grammarStr, _, tyModelStr, tablesStr, versionStr, funcsStr, irFuncToCodeStr) => withMeasure("build") {

        val  funcsFuture = decodeWithMeasure[List[Func]]("Funcs")(funcsStr)
        val  versionFuture =  decodeWithMeasure[Spec.Version]("Version")(versionStr)
        val  grammarFuture = decodeWithMeasure[Grammar]("Grammar")(grammarStr)
        val  tablesFuture = decodeWithMeasure[Map[String, Table]]("Tables")(tablesStr)
        val  tyModelFuture = decodeWithMeasure[TyModel]("TyModel")(tyModelStr)
        val  irFuncToCodeFuture = decodeWithMeasure[Map[String, Option[String]]]("irFuncToCode")(irFuncToCodeStr)

        for {
          funcs <- funcsFuture
          algo <- Future(Nil) // algoFuture
          version <- versionFuture
          grammar <- grammarFuture
          tables <- tablesFuture
          tyModel <- tyModelFuture
          irFuncToCode <- irFuncToCodeFuture
          spec = Spec(Some(version), grammar, algo, tables, tyModel)
        } yield  {

          class IllegalFinder(f: Func) extends UnitWalker {

            override def walk(var1: Name): Unit = {
              if (var1.name == "false") {
                println(s"Illegal variable found: false in ${f.name}")
              }
            }
          }

          funcs.foreach(f => {
            val illegalFinder = IllegalFinder(f)
            illegalFinder.walk(f)
          })

          val esParser : AstFrom = benchmark {ESParser(spec.grammar).apply("Script") }{
            _ => println(s"ESParser created successfully")
          }

          val cfg = benchmark { CFGBuilder.apply(Program.apply(funcs, spec)) }{ t =>
            println(s"CFG created successfully, time taken: ${t}ms")
          }

          val service = benchmark { DebuggerService(cfg, irFuncToCode)} {
            t => println(s"Mocking Interface created successfully, Time taken: ${t} ms")
          }

          service
        }

      }
    }
  }.toJSPromise

  @JSExport
  def run(base : String): Unit = build(base)
}
