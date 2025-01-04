package worker

import esmeta.cfg.CFG
import esmeta.es.Initialize
import esmeta.web.Debugger

import io.circe.*, io.circe.syntax.*, io.circe.parser.*
import io.circe.generic.semiauto.*

import scala.scalajs.js
import scala.scalajs.js.annotation.*

import esmeta.spec.util.JsonProtocol.given

@JSExportAll
class DebuggerService(cfg: CFG, irFuncToCode: Map[String, Option[String]]) {

    var _debugger: Option[Debugger] = None

    def debugger: Debugger = _debugger.get

    private def initDebugger(cfg: CFG, sourceText: String): Unit =
      val cachedAst = cfg.scriptParser.from(sourceText)
      _debugger = Some(Debugger(cfg.init.from(sourceText, cachedAst, None)))

    initDebugger(cfg, "")

  /** conversion for HTTP response */
    given Conversion[Debugger#StepResult, String] = _.ordinal.toString

    def state_heap(): String = {
      debugger.heapInfo.asJson.noSpaces
    }
    def state_context(cid: Int): String = {
      debugger.ctxtInfo(cid, Some(irFuncToCode)).asJson.noSpaces
    }
    def state_callStack(): String = {
      debugger.callStackInfo.asJson.noSpaces
    }

    def spec_func(): String = {
      cfg.fnameMap
        .map { case (name, f) => (f.id, name) }
        .toList
        .asJson
        .noSpaces
    }

    def spec_version(): String = {
      println(cfg.spec.version.asJson.noSpaces)
      cfg.spec.version.asJson.noSpaces
    }



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
    def exec_step(): String = {
      debugger.specStep
    }
    def exec_stepOver(): String = {
      debugger.specStepOver
    }
    def exec_stepOut(): String = {
      debugger.specStepOut
    }
    def exec_stepBack(): String = {
      debugger.specStepBack
    }
    def exec_stepBackOver(): String = {
      debugger.specStepBackOver
    }
    def exec_stepBackOut(): String = {
      debugger.specStepBackOut
    }
    def exec_continue(): String = {
      debugger.continue
    }

    def exec_esStep(): String = {
      debugger.esStep
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

}