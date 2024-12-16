package worker

import esmeta.cfg.CFG
import esmeta.es.Initialize
import esmeta.web.Debugger

import io.circe.*, io.circe.syntax.*, io.circe.parser.*
import io.circe.generic.semiauto.*

import scala.scalajs.js
import scala.scalajs.js.annotation.*

@JSExportAll
class MockingInterface(var debugger: Debugger, cfg: CFG) {

  private def initDebugger(cfg: CFG, sourceText: String): Unit =
    val cachedAst = cfg.scriptParser.from(sourceText)
    debugger = Debugger(Initialize(cfg, sourceText, Some(cachedAst)))

  /** conversion for HTTP response */
  given Conversion[Debugger#StepResult, String] = _.ordinal.toString


    def state_heap(): String = {
      debugger.heapInfo.asJson.noSpaces
    }
    def state_context(cid: Int): String = {
      debugger.ctxtInfo(cid).asJson.noSpaces
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