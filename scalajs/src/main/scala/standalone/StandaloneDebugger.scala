package worker

import esmeta.cfg.CFG
import esmeta.es.{Ast, Initialize}
import esmeta.web.Debugger

import io.circe.*, io.circe.syntax.*, io.circe.parser.*
import io.circe.generic.semiauto.*
import scala.scalajs.js
import scala.scalajs.js.annotation.*
import worker.util.*
import esmeta.spec.util.JsonProtocol.given

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

import esmeta.ir.util.UnitWalker

@JSExportAll
class StandaloneDebugger(cfg: CFG, irFuncToCode: Map[String, Option[String]]) {

  var _debugger: Option[Debugger] = None
  var _lastParsed: Option[(String, Ast)] = None

  def debugger: Debugger = _debugger.get

  private def initDebugger(cfg: CFG, sourceText: String): Unit =
    val ast = _lastParsed match
      case Some(oldText, ast) if oldText == sourceText =>
        ast
      case _ =>
        val ast = cfg.scriptParser.from(sourceText)
        _lastParsed = Some((sourceText, ast))
        ast
    _debugger = Some(Debugger(cfg.init.from(sourceText, ast, None)))
  end initDebugger

  initDebugger(cfg, "");

  /** conversion for HTTP response */
  given Conversion[Debugger#StepResult, String] = _.ordinal.toString

  def state_heap(): String = debugger.heapInfo.asJson.noSpaces
  def state_context(cid: Int): String =
    debugger.ctxtInfo(cid, Some(irFuncToCode)).asJson.noSpaces
  def state_callStack(): String = debugger.callStackInfo.asJson.noSpaces

  def spec_func(): String =
    cfg.fnameMap
      .map { case (name, f) => (f.id, name) }
      .toList
      .asJson
      .noSpaces
  end spec_func

  def spec_version(): String =
    println(cfg.spec.version.asJson.noSpaces)
    cfg.spec.version.asJson.noSpaces
  end spec_version

  def exec_run(raw: String) = {
    decode[(String, List[(Boolean, Int, List[Int], Boolean)])](
      raw,
    ) match
      case Left(err) => ??? // TODO handle error
      case Right((sourceText, bpDatas)) =>
        initDebugger(cfg, sourceText)
        for { data <- bpDatas } debugger.addBreak(data)
        "null"
  }

  def exec_step(noBreak: Boolean): String = { debugger.specStep(noBreak) }

  def exec_stepOver(noBreak: Boolean): String = {
    debugger.specStepOver(noBreak)
  }

  def exec_stepOut(noBreak: Boolean): String = {
    debugger.specStepOut(noBreak)
  }

  def exec_stepBack(noBreak: Boolean): String = {
    debugger.specStepBack(noBreak)
  }

  def exec_stepBackOver(noBreak: Boolean): String = {
    debugger.specStepBackOver(noBreak)
  }

  def exec_stepBackOut(noBreak: Boolean): String = {
    debugger.specStepBackOut(noBreak)
  }

  def exec_continue(): String = {
    debugger.continue
  }

  def exec_esStep(): String = {
    debugger.esStatementStep
  }

  def exec_esStepOver(): String = {
    debugger.esStepOver
  }

  def exec_esStepOut(): String = {
    debugger.esStepOut
  }

  def breakpoint_add(raw: String): String = {
    decode[(Boolean, Int, List[Int], Boolean)](raw) match
      case Left(err) => ??? // TODO handle error
      case Right(data) =>
        debugger.addBreak(data)
        "null"
  }
  def breakpoint_remove(raw: String): String = {
    decode[Int](raw) match
      case Right(idx)              => debugger.rmBreak(idx)
      case Left(_) if raw == "all" => debugger.rmBreakAll
      case Left(err)               => ??? // TODO handle error
    "null"
  }
  def breakpoint_toggle(raw: String): String = {
    decode[Int](raw) match
      case Right(idx)              => debugger.toggleBreak(idx)
      case Left(_) if raw == "all" => debugger.toggleBreakAll
      case _                       => ??? // TODO handle error
    "null"
  }

  def meta_version(): String = s"${esmeta.VERSION}-js".asJson.noSpaces
  def meta_iter(): String = debugger.ITER_CYCLE.asJson.noSpaces

}

@JSExportTopLevel("StandaloneDebugger")
object StandaloneDebugger {

  @JSExport
  def buildFrom(
    input: Input,
  ): js.Promise[StandaloneDebugger] =
    measureFutureTime {
      withMeasure("build") {

        val funcsFuture = (decodeWithMeasure[List[Func]]("Funcs")(input.funcs))
        val versionFuture =
          (decodeWithMeasure[Spec.Version]("Version")(input.version))
        val grammarFuture =
          (decodeWithMeasure[Grammar]("Grammar")(input.grammar))
        val tablesFuture =
          (decodeWithMeasure[Map[String, Table]]("Tables")(input.tables))
        val tyModelFuture =
          (decodeWithMeasure[TyModel]("TyModel")(input.tyModel))
        val irFuncToCodeFuture =
          (decodeWithMeasure[Map[String, Option[String]]]("irFuncToCode")(
            input.irFuncToCode,
          ))
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
        } yield {

          val cfg = benchmark { CFGBuilder.apply(Program.apply(funcs, spec)) } {
            time =>
              println(s"CFG created successfully, time taken: ${time}ms")
          }

          val service = benchmark { StandaloneDebugger(cfg, irFuncToCode) } {
            time =>
              println(
                s"Mocking Interface created successfully, Time taken: ${time} ms",
              )
          }

          service
        }

      }
    }.toJSPromise
}
