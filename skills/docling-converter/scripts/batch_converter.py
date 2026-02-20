#!/usr/bin/env python3
"""
Batch Converter - Convert multiple documents to Markdown using Docling

Usage:
    python batch_converter.py <input_dir> [output_dir] [--ocr] [--tables]

Arguments:
    input_dir: Directory containing documents to convert
    output_dir: Optional output directory (default: ./converted)
    --ocr: Enable OCR for scanned documents
    --tables: Enable advanced table extraction

Example:
    python batch_converter.py ./documents ./output --ocr --tables
"""

import argparse
from pathlib import Path
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions


def convert_directory(
    input_dir: Path,
    output_dir: Path,
    enable_ocr: bool = False,
    enable_tables: bool = False
):
    """Convert all supported documents in a directory to Markdown"""
    
    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Supported file extensions
    supported_extensions = [".pdf", ".docx", ".pptx", ".xlsx", ".html", ".htm", ".md"]
    
    # Configure converter
    if enable_ocr or enable_tables:
        pipeline_options = PdfPipelineOptions()
        if enable_ocr:
            pipeline_options.do_ocr = True
        if enable_tables:
            pipeline_options.do_table_structure = True
        
        converter = DocumentConverter(
            format_options={
                "pdf": PdfFormatOption(pipeline_options=pipeline_options)
            }
        )
    else:
        converter = DocumentConverter()
    
    # Find all supported files
    input_files = []
    for ext in supported_extensions:
        input_files.extend(input_dir.glob(f"*{ext}"))
    
    if not input_files:
        print(f"No supported files found in {input_dir}")
        return
    
    print(f"Found {len(input_files)} files to convert")
    print(f"OCR: {'enabled' if enable_ocr else 'disabled'}")
    print(f"Table extraction: {'enabled' if enable_tables else 'disabled'}")
    print("-" * 60)
    
    # Convert files
    converted = 0
    failed = 0
    
    for result in converter.convert_all(input_files):
        doc_filename = result.input.file.stem
        
        try:
            # Save as Markdown
            output_path = output_dir / f"{doc_filename}.md"
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(result.document.export_to_markdown())
            
            print(f"✓ Converted: {doc_filename}")
            converted += 1
            
        except Exception as e:
            print(f"✗ Failed: {doc_filename} - {str(e)}")
            failed += 1
    
    print("-" * 60)
    print(f"Conversion complete: {converted} succeeded, {failed} failed")
    print(f"Output directory: {output_dir.absolute()}")


def main():
    parser = argparse.ArgumentParser(
        description="Batch convert documents to Markdown using Docling"
    )
    parser.add_argument(
        "input_dir",
        type=Path,
        help="Directory containing documents to convert"
    )
    parser.add_argument(
        "output_dir",
        type=Path,
        nargs="?",
        default=Path("./converted"),
        help="Output directory (default: ./converted)"
    )
    parser.add_argument(
        "--ocr",
        action="store_true",
        help="Enable OCR for scanned documents"
    )
    parser.add_argument(
        "--tables",
        action="store_true",
        help="Enable advanced table extraction"
    )
    
    args = parser.parse_args()
    
    if not args.input_dir.exists():
        print(f"Error: Input directory '{args.input_dir}' does not exist")
        return
    
    if not args.input_dir.is_dir():
        print(f"Error: '{args.input_dir}' is not a directory")
        return
    
    convert_directory(
        args.input_dir,
        args.output_dir,
        args.ocr,
        args.tables
    )


if __name__ == "__main__":
    main()
