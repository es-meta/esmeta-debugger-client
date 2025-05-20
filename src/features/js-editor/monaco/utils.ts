export function createRangeFromIndices(text: string, from: number, to: number) {
  const lines = text.split("\n"); // Split the text into lines

  let currentPos = 0;
  let startLineNumber = 0,
    startColumn = 0;
  let endLineNumber = 0,
    endColumn = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLength = line.length + 1; // +1 for the newline character

    if (from >= currentPos && from < currentPos + lineLength) {
      startLineNumber = i + 1; // Line numbers are 1-based
      startColumn = from - currentPos + 1; // Columns are 1-based
    }

    if (to >= currentPos && to < currentPos + lineLength) {
      endLineNumber = i + 1;
      endColumn = to - currentPos + 1;
      break; // Stop when we find the end position
    }

    currentPos += lineLength;
  }

  return {
    startLineNumber,
    startColumn,
    endLineNumber,
    endColumn,
  };
}
