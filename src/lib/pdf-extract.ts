// Browser-side PDF text extraction using pdfjs-dist.
// Runs in the client because the Cloudflare Worker SSR env can't load the worker bundle.
import * as pdfjs from "pdfjs-dist";

import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export async function extractPdfText(file: File): Promise<string> {
  let document: pdfjs.PDFDocumentProxy | null = null;
  try {
    const data = new Uint8Array(await file.arrayBuffer());
    const task = pdfjs.getDocument({
      data,
      useSystemFonts: true,
    });
    document = await task.promise;
    const parts: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
      parts.push(text);
      page.cleanup();
    }
    return parts.join("\n\n").replace(/\s+/g, " ").trim();
  } catch (error) {
    const detail = error instanceof Error ? error.message.toLowerCase() : "";
    if (detail.includes("password")) {
      throw new Error("This PDF is password-protected. Remove the password and try again.");
    }
    if (detail.includes("invalid") || detail.includes("corrupt")) {
      throw new Error("This PDF appears damaged or invalid. Export a fresh PDF and try again.");
    }
    throw new Error(
      "This PDF could not be read in the browser. Export it as a selectable-text PDF or paste the resume text below.",
    );
  } finally {
    await document?.destroy();
  }
}
