---
name: docling-converter
description: "This skill should be used when the user needs to convert documents (PDF, Office, images, HTML, Markdown) into structured outputs such as Markdown, JSON, or DoclingDocument using Docling."
version: 1.0.0
author: Eric Andrade
created: 2026-02-20
updated: 2026-02-20
platforms: [github-copilot-cli, claude-code, codex, opencode, gemini, antigravity, cursor, adal]
category: content
tags: [docling, document-conversion, pdf, ocr, markdown, json]
risk: safe
triggers:
  - "convert this pdf to markdown"
  - "extract text from scanned document"
  - "docling conversion"
  - "convert docx pptx to markdown"
---

# Docling Document Converter

## Purpose

Docling is a powerful document conversion library that handles PDFs, Office documents (DOCX, PPTX, XLSX), images, HTML, AsciiDoc, and Markdown. It excels at preserving document structure, extracting tables, performing OCR, and providing multiple output formats including Markdown and JSON.

## When to Use

Use this skill when:
- A document must be converted to Markdown for downstream LLM workflows
- OCR is required for scanned PDFs and image-heavy documents
- Table structure and layout fidelity are important
- A batch conversion workflow is needed across multiple files

## Workflow

1. Verify input format and desired output format
2. Install Docling with required extras (OCR only when needed)
3. Run single-file conversion first to validate quality
4. Enable advanced pipeline options (OCR/table extraction/image generation) as required
5. Run batch conversion and save outputs with traceable naming
6. Validate output quality before handing off to other skills/tools

## Installation

```bash
pip install docling --break-system-packages

# For advanced features (OCR, table extraction)
pip install docling[ocr] --break-system-packages
```

## Quick Start

### Basic Conversion

```python
from docling.document_converter import DocumentConverter

# Initialize converter
converter = DocumentConverter()

# Convert a single document
result = converter.convert("document.pdf")

# Export to Markdown
markdown_text = result.document.export_to_markdown()
print(markdown_text)
```

### Batch Conversion

```python
from docling.document_converter import DocumentConverter
from pathlib import Path

converter = DocumentConverter()

# Convert multiple documents
input_files = ["file1.pdf", "file2.docx", "file3.pptx"]

for result in converter.convert_all(input_files):
    doc_filename = result.input.file.stem
    print(f"Processing: {doc_filename}")
    
    # Export to Markdown
    markdown_path = f"{doc_filename}.md"
    with open(markdown_path, "w") as f:
        f.write(result.document.export_to_markdown())
```

## Export Formats

### Markdown Export

```python
# Basic Markdown
markdown = result.document.export_to_markdown()

# Markdown with custom image mode
markdown = result.document.export_to_markdown(
    image_mode="referenced"  # Options: "embedded", "referenced", "placeholder"
)
```

### JSON Export (Doctags)

```python
# Export to structured JSON format
json_output = result.document.export_to_dict()

# Pretty print JSON
import json
print(json.dumps(json_output, indent=2))
```

### HTML Export

```python
# Export to HTML
html = result.document.export_to_html()
```

## Advanced Configuration

### PDF Pipeline Options

```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions

# Configure PDF processing
pipeline_options = PdfPipelineOptions()
pipeline_options.do_ocr = True  # Enable OCR for scanned PDFs
pipeline_options.do_table_structure = True  # Enable table extraction

converter = DocumentConverter(
    format_options={
        "pdf": PdfFormatOption(pipeline_options=pipeline_options)
    }
)

result = converter.convert("scanned_document.pdf")
```

### Image Extraction

```python
from docling.document_converter import DocumentConverter
from docling.datamodel.pipeline_options import PdfPipelineOptions

pipeline_options = PdfPipelineOptions()
pipeline_options.images_scale = 2.0  # Higher quality images
pipeline_options.generate_page_images = True  # Extract page images
pipeline_options.generate_picture_images = True  # Extract picture images

converter = DocumentConverter(
    format_options={
        "pdf": PdfFormatOption(pipeline_options=pipeline_options)
    }
)

result = converter.convert("document.pdf")

# Access extracted images
for element in result.document.iterate_items():
    if element.label == "picture":
        # Image data available in element
        pass
```

### DOCX/PPTX Options

```python
from docling.document_converter import DocumentConverter, WordFormatOption

# Configure DOCX processing
word_options = WordFormatOption()

converter = DocumentConverter(
    format_options={
        "docx": word_options,
        "pptx": word_options  # Same options for PowerPoint
    }
)
```

## Working with DoclingDocument

### Iterate Through Elements

```python
result = converter.convert("document.pdf")
doc = result.document

# Iterate through all elements
for element, level in doc.iterate_items():
    print(f"Level {level}: {element.label} - {element.text[:50]}")
```

### Access Specific Elements

```python
# Get all tables
tables = [item for item in doc.iterate_items() if item.label == "table"]

# Get all headings
headings = [item for item in doc.iterate_items() if item.label in ["title", "section_header"]]

# Get page information
for page in doc.pages:
    print(f"Page {page.page_no}: {page.size}")
```

### Extract Tables

```python
from docling.document_converter import DocumentConverter
import pandas as pd

converter = DocumentConverter()
result = converter.convert("document.pdf")

# Extract tables to pandas DataFrames
for element, _ in result.document.iterate_items():
    if element.label == "table":
        # Table data structure
        table_data = element.export_to_dict()
        
        # Convert to DataFrame if needed
        if hasattr(element, 'data') and element.data:
            df = pd.DataFrame(element.data)
            print(df)
```

## Common Use Cases

### PDF to Markdown

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
result = converter.convert("input.pdf")

with open("output.md", "w", encoding="utf-8") as f:
    f.write(result.document.export_to_markdown())
```

### Scanned PDF with OCR

```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions

pipeline_options = PdfPipelineOptions()
pipeline_options.do_ocr = True
pipeline_options.ocr_engine = "easyocr"  # or "tesseract"

converter = DocumentConverter(
    format_options={
        "pdf": PdfFormatOption(pipeline_options=pipeline_options)
    }
)

result = converter.convert("scanned.pdf")
markdown = result.document.export_to_markdown()
```

### Batch Convert Directory

```python
from docling.document_converter import DocumentConverter
from pathlib import Path

converter = DocumentConverter()
input_dir = Path("./documents")
output_dir = Path("./converted")
output_dir.mkdir(exist_ok=True)

# Get all supported files
supported_extensions = [".pdf", ".docx", ".pptx", ".xlsx", ".html", ".md"]
input_files = [f for f in input_dir.iterdir() if f.suffix in supported_extensions]

for result in converter.convert_all(input_files):
    doc_filename = result.input.file.stem
    
    # Save as Markdown
    output_path = output_dir / f"{doc_filename}.md"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(result.document.export_to_markdown())
    
    print(f"Converted: {doc_filename}")
```

### Extract Images and Save Separately

```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions
import base64
from pathlib import Path

pipeline_options = PdfPipelineOptions()
pipeline_options.generate_picture_images = True

converter = DocumentConverter(
    format_options={
        "pdf": PdfFormatOption(pipeline_options=pipeline_options)
    }
)

result = converter.convert("document.pdf")

# Save images
image_dir = Path("./images")
image_dir.mkdir(exist_ok=True)

image_count = 0
for element, _ in result.document.iterate_items():
    if element.label == "picture" and hasattr(element, 'image'):
        image_path = image_dir / f"image_{image_count}.png"
        # Save image data
        with open(image_path, "wb") as f:
            f.write(base64.b64decode(element.image))
        image_count += 1

print(f"Extracted {image_count} images")
```

## Supported Input Formats

- **PDF**: `.pdf` (including scanned PDFs with OCR)
- **Microsoft Office**: `.docx`, `.pptx`, `.xlsx`
- **Images**: `.jpg`, `.jpeg`, `.png`, `.tiff`, `.bmp`
- **Web**: `.html`, `.htm`
- **Markup**: `.md` (Markdown), `.asciidoc`

## Output Formats

- **Markdown**: `.md` - Clean, readable text format
- **JSON (Doctags)**: Structured JSON with document hierarchy
- **HTML**: HTML representation
- **DoclingDocument**: Native Python object for programmatic access

## Performance Tips

1. **Batch Processing**: Use `convert_all()` for multiple files
2. **OCR**: Only enable when needed (scanned documents)
3. **Images**: Adjust `images_scale` based on quality needs
4. **Memory**: Process large PDFs in batches if memory is limited

## Troubleshooting

### OCR Not Working
Ensure OCR dependencies are installed:
```bash
pip install docling[ocr] --break-system-packages
```

### Table Extraction Issues
Enable table structure detection:
```python
pipeline_options.do_table_structure = True
```

### Image Quality Issues
Increase image scale:
```python
pipeline_options.images_scale = 2.0  # or higher
```

## Resources

For additional utilities and reference materials:

- **scripts/batch_converter.py**: Utility for batch converting directories
- **scripts/extract_with_ocr.py**: Script for OCR-enabled conversion
- **references/api_reference.md**: Detailed API documentation

## Critical Rules

- Do not enable OCR by default for all files; use OCR only for scanned/low-text inputs.
- Validate conversion quality on one representative file before batch runs.
- Preserve source-to-output filename mapping for auditability.
- Prefer UTF-8 output and explicit file encoding when writing text artifacts.

## Example Usage

1. Convert a scanned PDF with OCR into Markdown for knowledge-base ingestion.
2. Convert a directory of DOCX and PPTX files into Markdown for RAG indexing.
3. Extract tables from a PDF and export JSON for structured downstream analysis.
