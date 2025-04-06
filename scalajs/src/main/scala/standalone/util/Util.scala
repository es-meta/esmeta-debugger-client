package worker

import esmeta.util.BaseUtils.debug
import esmeta.web.{Debugger}

import io.circe.*, io.circe.syntax.*, io.circe.generic.semiauto.*;
import io.circe.parser.decode

import io.circe.*, io.circe.syntax.*, io.circe.parser.*
import io.circe.generic.semiauto.*

import org.scalajs.dom

import scala.concurrent.{Future, Promise as SPromise}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.scalajs.js;
// to convert scala future to js promise
import scala.scalajs.js.JSConverters.*
import scala.scalajs.js.annotation.{JSExport, JSExportAll, JSExportTopLevel}
import scala.util.{Success, Failure}
import scala.util.ChainingOps.*

import esmeta.ir.*
import esmeta.ir.Expr
import esmeta.ir.util.UnitWalker

package object util {

  trait Input extends js.Object {
    val funcs: String
    val version: String
    val grammar: String
    val tables: String
    val tyModel: String
    val irFuncToCode: String
  }

  def fetchDump(base: String, urn: String): Future[String] = {
    dom.Fetch
      .fetch(if base == "" then urn else dom.URL(urn, base).toString())
      .toFuture
      .flatMap { response =>
        if (response.ok) {
          response.text().toFuture
        } else {
          println(s"Failed to fetch from $urn, see: ${response.statusText}")
          ???
        }
      }
  }

  def decodeWithMeasure[T](
    tag: String,
  )(json: String)(using Decoder[T]): Future[T] = Future {
    val start = System.currentTimeMillis()
    val result =
      decode[T](json).getOrElse(throw new Exception(s"Failed to decode ${tag}"))
    val end = System.currentTimeMillis()
    println(s"${tag} Decoded successfully, Time taken: ${end - start} ms")
    result
  }

  def withMeasure[T](tag: String)(f: => T): T = {
    val start = System.currentTimeMillis()
    val result = f
    val end = System.currentTimeMillis()
    println(s"${tag} done, Time taken: ${end - start} ms")
    result
  }

  inline def benchmark[T](f: => T)(log: Long => Unit): (T) = {
    val start = System.currentTimeMillis()
    val result = f
    val end = System.currentTimeMillis()
    log(end - start)
    result
  }

  def measureFutureTime[T](future: Future[T]): Future[T] = {
    val startTime = System.nanoTime()
    future.map { result =>
      val endTime = System.nanoTime()
      val duration = endTime - startTime
      println(s"Time taken for total build: ${duration / 1000000} ms")
      (result)
    }
  }

}
