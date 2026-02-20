# Docling API Reference

## DocumentConverter

The main class for converting documents.

### Initialization

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter(
    format_options=None,  # Optional: dict of format-specific options
    artifacts_path=None   # Optional: path to save artifacts
)
```

### Methods

#### convert(source)

Convert a single document.

**Parameters:**
- `source` (str or Path): Path to the document file

**Returns:**
- `ConversionResult`: Object containing the converted document

**Example:**
```python
result = converter.convert("document.pdf")
doc = result.document
```

#### convert_all(sources)

Convert multiple documents (generator).

**Parameters:**
- `sources` (list): List of file paths

**Returns:**
- Generator yielding `ConversionResult` objects

**Example:**
```python
for result in converter.convert_all(["file1.pdf", "file2.docx"]):
    print(f"Converted: {result.input.file.name}")
```

## FormatOptions

Format-specific configuration classes.

### PdfFormatOption

Options for PDF processing.

```python
from docling.document_converter import PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions

pipeline_options = PdfPipelineOptions()
pdf_options = PdfFormatOption(pipeline_options=pipeline_options)

converter = DocumentConverter(
    format_options={"pdf": pdf_options}
)
```

### WordFormatOption

Options for DOCX/PPTX processing.

```python
from docling.document_converter import WordFormatOption

word_options = WordFormatOption()

converter = DocumentConverter(
    format_options={
        "docx": word_options,
        "pptx": word_options
    }
)
```

## PdfPipelineOptions

Advanced PDF processing configuration.

### OCR Options

```python
from docling.datamodel.pipeline_options import PdfPipelineOptions

pipeline_options = PdfPipelineOptions()

# Enable OCR
pipeline_options.do_ocr = True

# OCR engine: "easyocr" or "tesseract"
pipeline_options.ocr_engine = "easyocr"

# OCR language codes (ISO 639-1)
pipeline_options.ocr_lang = ["en", "pt"]  # English and Portuguese
```

### Table Extraction Options

```python
# Enable table structure detection
pipeline_options.do_table_structure = True

# Table extraction method
pipeline_options.table_structure_options = {
    "mode": "accurate"  # or "fast"
}
```

### Image Options

```python
# Generate page images
pipeline_options.generate_page_images = True

# Generate picture images (images embedded in document)
pipeline_options.generate_picture_images = True

# Image scale factor (default: 1.0)
pipeline_options.images_scale = 2.0

# Image format: "png" or "jpeg"
pipeline_options.image_format = "png"
```

### Layout Analysis Options

```python
# Enable layout analysis
pipeline_options.do_layout_analysis = True

# Layout model options
pipeline_options.layout_options = {
    "use_gpu": False
}
```

## DoclingDocument

The converted document object with rich metadata and structure.

### Properties

```python
doc = result.document

# Document metadata
doc.name           # Document name
doc.origin         # Source information
doc.num_pages      # Total pages

# Document content
doc.pages          # List of Page objects
doc.main_text      # Main body text
```

### Methods

#### export_to_markdown(image_mode="embedded")

Export document to Markdown format.

**Parameters:**
- `image_mode` (str): How to handle images
  - `"embedded"`: Base64-encode images inline
  - `"referenced"`: Use image references
  - `"placeholder"`: Use placeholder text

**Returns:**
- `str`: Markdown text

**Example:**
```python
# Default (embedded images)
markdown = doc.export_to_markdown()

# Referenced images
markdown = doc.export_to_markdown(image_mode="referenced")

# No images
markdown = doc.export_to_markdown(image_mode="placeholder")
```

#### export_to_dict()

Export document to dictionary (JSON-serializable).

**Returns:**
- `dict`: Document structure as nested dictionary

**Example:**
```python
doc_dict = doc.export_to_dict()

import json
json_str = json.dumps(doc_dict, indent=2)
```

#### export_to_html()

Export document to HTML format.

**Returns:**
- `str`: HTML representation

**Example:**
```python
html = doc.export_to_html()
```

#### iterate_items()

Iterate through document elements with hierarchy level.

**Yields:**
- Tuple of `(element, level)` where element is a document item and level is int

**Example:**
```python
for element, level in doc.iterate_items():
    indent = "  " * level
    print(f"{indent}{element.label}: {element.text[:50]}")
```

## Document Elements

Document elements have different types based on content.

### Element Types (labels)

Common element labels:
- `"title"`: Document title
- `"section_header"`: Section heading
- `"paragraph"`: Text paragraph
- `"table"`: Table
- `"list_item"`: List item
- `"picture"`: Image
- `"formula"`: Mathematical formula
- `"caption"`: Figure/table caption
- `"footnote"`: Footnote
- `"page_header"`: Page header
- `"page_footer"`: Page footer

### Common Element Properties

```python
element.label        # Element type
element.text         # Text content
element.prov         # Provenance (location info)
element.children     # Child elements
```

### Table Elements

```python
if element.label == "table":
    # Access table structure
    table_data = element.export_to_dict()
    
    # Table has nested structure
    rows = element.children  # List of row elements
    for row in rows:
        cells = row.children  # List of cell elements
```

### Picture Elements

```python
if element.label == "picture":
    # Image metadata
    image_prov = element.prov
    
    # Image data (if generated)
    if hasattr(element, 'image'):
        image_bytes = base64.b64decode(element.image)
```

## Page Objects

Each page contains layout and content information.

```python
for page in doc.pages:
    page.page_no       # Page number (1-indexed)
    page.size          # Page dimensions (width, height)
    page.elements      # Elements on this page
```

## ConversionResult

Object returned from conversion operations.

### Properties

```python
result.input           # Input file information
result.document        # DoclingDocument object
result.status          # Conversion status
result.errors          # List of errors (if any)
```

### Input Information

```python
result.input.file      # Path object
result.input.format    # Document format (e.g., "pdf", "docx")
```

## Advanced Usage Patterns

### Custom Pipeline Configuration

```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions

# Create custom pipeline
pipeline_options = PdfPipelineOptions()
pipeline_options.do_ocr = True
pipeline_options.do_table_structure = True
pipeline_options.generate_picture_images = True
pipeline_options.images_scale = 2.0

# Configure converter
converter = DocumentConverter(
    format_options={
        "pdf": PdfFormatOption(pipeline_options=pipeline_options)
    }
)
```

### Processing Specific Page Ranges

```python
# Note: Docling processes entire documents
# To extract specific pages, filter after conversion

result = converter.convert("document.pdf")

# Get specific pages
pages_1_to_5 = [p for p in result.document.pages if 1 <= p.page_no <= 5]
```

### Extracting Specific Content Types

```python
result = converter.convert("document.pdf")
doc = result.document

# Extract all tables
tables = []
for element, level in doc.iterate_items():
    if element.label == "table":
        tables.append(element)

# Extract all images
images = []
for element, level in doc.iterate_items():
    if element.label == "picture":
        images.append(element)

# Extract headings
headings = []
for element, level in doc.iterate_items():
    if element.label in ["title", "section_header"]:
        headings.append((level, element.text))
```

### Error Handling

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()

try:
    result = converter.convert("document.pdf")
    
    # Check conversion status
    if result.status == "success":
        markdown = result.document.export_to_markdown()
    else:
        print(f"Conversion had issues: {result.errors}")
        
except Exception as e:
    print(f"Conversion failed: {e}")
```

### Memory-Efficient Batch Processing

```python
from docling.document_converter import DocumentConverter
from pathlib import Path

converter = DocumentConverter()
input_files = list(Path("documents").glob("*.pdf"))

# Process in batches
batch_size = 10
for i in range(0, len(input_files), batch_size):
    batch = input_files[i:i + batch_size]
    
    for result in converter.convert_all(batch):
        # Process and save
        output_path = f"output/{result.input.file.stem}.md"
        with open(output_path, "w") as f:
            f.write(result.document.export_to_markdown())
        
        # Clear memory if needed
        del result
```

## Supported Formats

### Input Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| PDF | .pdf | Supports both text and scanned PDFs |
| Word | .docx | Microsoft Word documents |
| PowerPoint | .pptx | Microsoft PowerPoint presentations |
| Excel | .xlsx | Microsoft Excel spreadsheets |
| HTML | .html, .htm | Web pages |
| Markdown | .md | Markdown documents |
| AsciiDoc | .asciidoc, .adoc | AsciiDoc documents |
| Images | .jpg, .jpeg, .png, .tiff, .bmp | Requires OCR for text extraction |

### Output Formats

| Format | Method | Description |
|--------|--------|-------------|
| Markdown | `export_to_markdown()` | Clean, readable text format |
| JSON | `export_to_dict()` | Structured document hierarchy |
| HTML | `export_to_html()` | HTML representation |
| DoclingDocument | Native object | Full programmatic access |

## Performance Considerations

### OCR Performance

- OCR is computationally expensive
- Enable only for scanned documents
- EasyOCR generally faster than Tesseract
- GPU acceleration available for layout analysis

### Memory Usage

- Large PDFs consume significant memory
- Use `convert_all()` generator for batch processing
- Process in smaller batches if memory is limited
- Clear result objects after processing

### Processing Speed

- Text PDFs: Very fast (seconds)
- Scanned PDFs with OCR: Slower (minutes for long documents)
- Table extraction: Adds processing time
- Image generation: Adds processing time

## Common Issues and Solutions

### Issue: OCR not working

**Solution:** Install OCR dependencies
```bash
pip install docling[ocr] --break-system-packages
```

### Issue: Tables not extracted properly

**Solution:** Enable table structure detection
```python
pipeline_options.do_table_structure = True
```

### Issue: Poor image quality

**Solution:** Increase image scale
```python
pipeline_options.images_scale = 2.0  # or higher
```

### Issue: Out of memory

**Solution:** Process in smaller batches
```python
# Instead of processing 100 files at once
for result in converter.convert_all(all_files[:10]):
    # Process and clear
    pass
```
