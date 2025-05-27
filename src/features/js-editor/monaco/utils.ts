/**
 * `from` : inclusive
 * `to`   : exlcusive
 */
export function createRange(text: string, from: number, to: number) {
  const clipped = text.substring(from, to);
  const leadingWhitespace = (clipped.match(/^\s*/)?.[0] ?? "").length;
  const trailingWhitespace = (clipped.match(/\s*$/)?.[0] ?? "").length;

  return createRangeFromOpenIndices(
    text,
    from + leadingWhitespace,
    to - trailingWhitespace,
  );
}

/**
 * from : inclusive
 * to   : exclusive
 */
function createRangeFromOpenIndices(text: string, from: number, to: number) {
  const lines = text.split("\n");
  let cursor = 0;

  let startLine = 1,
    startCol = 1;
  let endLine = 1,
    endCol = 1; // note: endCol 는 open

  for (let i = 0; i < lines.length; i++) {
    const lineLen = lines[i].length; // 개행 제외

    // 시작 위치
    if (from >= cursor && from <= cursor + lineLen) {
      startLine = i + 1;
      startCol = from - cursor + 1; // 1-based
    }

    // 끝 위치 (exclusive) → to 가 line 끝이면 lineLen 과 동일
    if (to >= cursor && to <= cursor + lineLen) {
      endLine = i + 1;
      endCol = to - cursor + 1; // Monaco 는 open 그대로
      break;
    }

    cursor += lineLen + 1; // 개행(+1)
  }

  return {
    startLineNumber: startLine,
    startColumn: startCol,
    endLineNumber: endLine,
    endColumn: endCol,
  };
}
