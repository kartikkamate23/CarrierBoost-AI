// Browser-side PDF text extraction using pdfjs-dist.
// Runs in the client because the Cloudflare Worker SSR env can't load the worker bundle.
import * as pdfjs from "pdfjs-dist";
// @ts-expect-error - vite worker URL import
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export async function extractPdfText(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buf }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? (item as { str: string }).str : ""))
      .join(" ");
    parts.push(text);
  }
  return parts.join("\n\n").replace(/\s+/g, " ").trim();
}
