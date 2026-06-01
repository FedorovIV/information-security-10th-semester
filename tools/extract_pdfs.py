from __future__ import annotations

import json
import re
from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "extracted"
OUT.mkdir(exist_ok=True)


def clean_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


summary = []

for pdf_path in sorted(ROOT.glob("*.pdf")):
    doc = fitz.open(pdf_path)
    pages = []
    word_count = 0
    image_count = 0
    sparse_pages = []

    for i, page in enumerate(doc, start=1):
        text = clean_text(page.get_text("text"))
        words = re.findall(r"\w+", text, flags=re.UNICODE)
        images = len(page.get_images(full=True))
        word_count += len(words)
        image_count += images
        if len(words) < 35 and images:
            sparse_pages.append(i)

        pages.append(
            f"# Page {i}\n\n"
            f"<!-- words: {len(words)}, images: {images} -->\n\n"
            f"{text}\n"
        )

    out_path = OUT / f"{pdf_path.stem}.txt"
    out_path.write_text("\n\n---\n\n".join(pages), encoding="utf-8")
    summary.append(
        {
            "file": pdf_path.name,
            "pages": len(doc),
            "words": word_count,
            "images": image_count,
            "sparse_image_pages": sparse_pages,
        }
    )

(OUT / "_summary.json").write_text(
    json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
)

for item in summary:
    safe_name = item["file"].encode("ascii", "backslashreplace").decode("ascii")
    print(
        f"{safe_name}: {item['pages']} pages, {item['words']} words, "
        f"{item['images']} images, sparse image pages: {len(item['sparse_image_pages'])}"
    )
