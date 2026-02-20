#!/usr/bin/env python3
"""
Extract with OCR - Convert scanned documents with OCR enabled

Usage:
    python extract_with_ocr.py <input_file> [output_file] [--engine easyocr|tesseract]

Arguments:
    input_file: Path to the scanned document (PDF or image)
    output_file: Optional output file path (default: input_file.md)
    --engine: OCR engine to use (default: easyocr)

Example:
    python extract_with_ocr.py scanned.pdf output.md --engine easyocr
"""

import argparse
from pathlib import Path
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions


def convert_with_ocr(
    input_file: Path,
    output_file: Path,
    ocr_engine: str = "easyocr"
):
    """Convert a scanned document to Markdown with OCR"""
    
    # Configure pipeline with OCR
    pipeline_options = PdfPipelineOptions()
    pipeline_options.do_ocr = True
    pipeline_options.ocr_engine = ocr_engine
    pipeline_options.do_table_structure = True
    
    # Create converter
    converter = DocumentConverter(
        format_options={
            "pdf": PdfFormatOption(pipeline_options=pipeline_options)
        }
    )
    
    print(f"Converting: {input_file.name}")
    print(f"OCR Engine: {ocr_engine}")
    print("-" * 60)
    
    try:
        # Convert document
        result = converter.convert(str(input_file))
        
        # Export to Markdown
        markdown = result.document.export_to_markdown()
        
        # Save output
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(markdown)
        
        # Print statistics
        page_count = len(result.document.pages) if hasattr(result.document, 'pages') else 0
        print(f"✓ Conversion successful")
        print(f"  Pages processed: {page_count}")
        print(f"  Output file: {output_file.absolute()}")
        print(f"  File size: {output_file.stat().st_size:,} bytes")
        
    except Exception as e:
        print(f"✗ Conversion failed: {str(e)}")
        raise


def main():
    parser = argparse.ArgumentParser(
        description="Convert scanned documents to Markdown with OCR"
    )
    parser.add_argument(
        "input_file",
        type=Path,
        help="Path to the scanned document (PDF or image)"
    )
    parser.add_argument(
        "output_file",
        type=Path,
        nargs="?",
        help="Output file path (default: input_file.md)"
    )
    parser.add_argument(
        "--engine",
        choices=["easyocr", "tesseract"],
        default="easyocr",
        help="OCR engine to use (default: easyocr)"
    )
    
    args = parser.parse_args()
    
    if not args.input_file.exists():
        print(f"Error: Input file '{args.input_file}' does not exist")
        return
    
    # Set default output file
    if args.output_file is None:
        args.output_file = args.input_file.with_suffix(".md")
    
    convert_with_ocr(
        args.input_file,
        args.output_file,
        args.engine
    )


if __name__ == "__main__":
    main()
