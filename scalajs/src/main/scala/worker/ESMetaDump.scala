package worker

import esmeta.ir.{Program, Func}
import esmeta.spec.Grammar

case class ESMetaDump(
  grammar: Grammar,
  program: Program,
  funcs: List[Func]
)