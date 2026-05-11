import fs from "fs/promises";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function extractTextFromFile(filePath, extension) {
  if (extension === ".pdf") {
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (
    extension === ".txt" ||
    extension === ".csv" ||
    extension === ".md" ||
    extension === ".json"
  ) {
    return fs.readFile(filePath, "utf-8");
  }

  throw new Error(`Unsupported file type: ${extension}`);
}
