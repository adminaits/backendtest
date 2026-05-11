export function chunkText(text, options = {}) {
  const chunkSize = options.chunkSize || 1000;
  const overlap = options.overlap || 150;

  const cleanText = text
    .replace(/\r/g, " ")
    .replace(/\n+/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  if (cleanText.length <= chunkSize) {
    return [cleanText];
  }

  const chunks = [];
  let start = 0;

  while (start < cleanText.length) {
    const end = Math.min(start + chunkSize, cleanText.length);
    const chunk = cleanText.slice(start, end).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    start += chunkSize - overlap;
  }

  return chunks;
}
