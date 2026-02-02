---
name: youtube-summarizer
description: This skill should be used when the user wants to extract and summarize YouTube video content by providing a video URL. Generates comprehensive, detailed summaries from video transcripts.
triggers:
  - "resume este video"
  - "resumir video do youtube"
  - "extrair transcript youtube"
  - "summarize youtube video"
version: 1.2.0
author: Eric Andrade
created: 2026-02-01
platforms: [github-copilot-cli, claude-code]
---

# youtube-summarizer

## Purpose

This skill extracts transcripts from YouTube videos and generates comprehensive, verbose summaries using the STAR + R-I-S-E framework. It validates video availability, extracts transcripts using the `youtube-transcript-api` Python library, and produces detailed documentation capturing all insights, arguments, and key points.

The skill is designed for users who need thorough content analysis and reference documentation from educational videos, lectures, tutorials, or informational content.

## When to Use This Skill

This skill should be used when:

- User provides a YouTube video URL and wants a detailed summary
- User needs to document video content for reference without rewatching
- User wants to extract insights, key points, and arguments from educational content
- User needs transcripts from YouTube videos for analysis
- User asks to "summarize", "resume", or "extract content" from YouTube videos
- User wants comprehensive documentation prioritizing completeness over brevity

## Step 0: Discovery & Setup

Before processing videos, validate the environment and dependencies:

```bash
# Check if youtube-transcript-api is installed
python3 -c "import youtube_transcript_api" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  youtube-transcript-api not found"
    # Offer to install
fi

# Check Python availability
if ! command -v python3 &>/dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi
```

**Ask the user if dependency is missing:**

```
youtube-transcript-api is required but not installed.

Would you like to install it now?
- [ ] Yes - Install with pip (pip install youtube-transcript-api)
- [ ] No - I'll install it manually
```

**If user selects "Yes":**

```bash
pip install youtube-transcript-api
```

**Verify installation:**

```bash
python3 -c "import youtube_transcript_api; print('✅ youtube-transcript-api installed successfully')"
```

## Main Workflow

### Progress Tracking Guidelines

Throughout the workflow, display a visual progress gauge before each step to keep the user informed. The gauge format is:

```bash
echo "[████░░░░░░░░░░░░░░░░] 20% - Step 1/5: Validating URL"
```

**Format specifications:**
- 20 characters wide (use █ for filled, ░ for empty)
- Percentage increments: Step 1=20%, Step 2=40%, Step 3=60%, Step 4=80%, Step 5=100%
- Step counter showing current/total (e.g., "Step 3/5")
- Brief description of current phase

**Display the initial status box before Step 1:**

```
╔══════════════════════════════════════════════════════════════╗
║     📹  YOUTUBE SUMMARIZER - Processing Video                ║
╠══════════════════════════════════════════════════════════════╣
║ → Step 1: Validating URL                 [IN PROGRESS]       ║
║ ○ Step 2: Checking Availability                              ║
║ ○ Step 3: Extracting Transcript                              ║
║ ○ Step 4: Generating Summary                                 ║
║ ○ Step 5: Formatting Output                                  ║
╠══════════════════════════════════════════════════════════════╣
║ Progress: ██████░░░░░░░░░░░░░░░░░░░░░░░░  20%               ║
╚══════════════════════════════════════════════════════════════╝
```

### Step 1: Validate YouTube URL

**Objective:** Extract video ID and validate URL format.

**Supported URL Formats:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`

**Actions:**

```bash
# Extract video ID using regex or URL parsing
URL="$USER_PROVIDED_URL"

# Pattern 1: youtube.com/watch?v=VIDEO_ID
if echo "$URL" | grep -qE 'youtube\.com/watch\?v='; then
    VIDEO_ID=$(echo "$URL" | sed -E 's/.*[?&]v=([^&]+).*/\1/')
# Pattern 2: youtu.be/VIDEO_ID  
elif echo "$URL" | grep -qE 'youtu\.be/'; then
    VIDEO_ID=$(echo "$URL" | sed -E 's/.*youtu\.be\/([^?]+).*/\1/')
else
    echo "❌ Invalid YouTube URL format"
    exit 1
fi

echo "📹 Video ID extracted: $VIDEO_ID"
```

**If URL is invalid:**

```
❌ Invalid YouTube URL

Please provide a valid YouTube URL in one of these formats:
- https://www.youtube.com/watch?v=VIDEO_ID
- https://youtu.be/VIDEO_ID

Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### Step 2: Check Video & Transcript Availability

**Progress:**
```bash
echo "[████████░░░░░░░░░░░░] 40% - Step 2/5: Checking Availability"
```

**Objective:** Verify video exists and transcript is accessible.

**Actions:**

```python
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import sys

video_id = sys.argv[1]

try:
    # Get list of available transcripts
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
    
    print(f"✅ Video accessible: {video_id}")
    print("📝 Available transcripts:")
    
    for transcript in transcript_list:
        print(f"  - {transcript.language} ({transcript.language_code})")
        if transcript.is_generated:
            print("    [Auto-generated]")
    
except TranscriptsDisabled:
    print(f"❌ Transcripts are disabled for video {video_id}")
    sys.exit(1)
    
except NoTranscriptFound:
    print(f"❌ No transcript found for video {video_id}")
    sys.exit(1)
    
except Exception as e:
    print(f"❌ Error accessing video: {e}")
    sys.exit(1)
```

**Error Handling:**

| Error | Message | Action |
|-------|---------|--------|
| Video not found | "❌ Video does not exist or is private" | Ask user to verify URL |
| Transcripts disabled | "❌ Transcripts are disabled for this video" | Cannot proceed |
| No transcript available | "❌ No transcript found (not auto-generated or manually added)" | Cannot proceed |
| Private/restricted video | "❌ Video is private or restricted" | Ask for public video |

### Step 3: Extract Transcript

**Progress:**
```bash
echo "[████████████░░░░░░░░] 60% - Step 3/5: Extracting Transcript"
```

**Objective:** Retrieve transcript in preferred language.

**Actions:**

```python
from youtube_transcript_api import YouTubeTranscriptApi

video_id = "VIDEO_ID"

try:
    # Try to get transcript in user's preferred language first
    # Fall back to English if not available
    transcript = YouTubeTranscriptApi.get_transcript(
        video_id, 
        languages=['pt', 'en']  # Prefer Portuguese, fallback to English
    )
    
    # Combine transcript segments into full text
    full_text = " ".join([entry['text'] for entry in transcript])
    
    # Get video metadata
    from youtube_transcript_api import YouTubeTranscriptApi
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
    
    print("✅ Transcript extracted successfully")
    print(f"📊 Transcript length: {len(full_text)} characters")
    
    # Save to temporary file for processing
    with open(f"/tmp/transcript_{video_id}.txt", "w") as f:
        f.write(full_text)
    
except Exception as e:
    print(f"❌ Error extracting transcript: {e}")
    exit(1)
```

**Transcript Processing:**

- Combine all transcript segments into coherent text
- Preserve punctuation and formatting where available
- Remove duplicate or overlapping segments (if auto-generated artifacts)
- Store in temporary file for analysis

### Step 4: Generate Comprehensive Summary

**Progress:**
```bash
echo "[████████████████░░░░] 80% - Step 4/5: Generating Summary"
```

**Objective:** Apply enhanced STAR + R-I-S-E prompt to create detailed summary.

**Prompt Applied:**

Use the enhanced prompt from Phase 2 (STAR + R-I-S-E framework) with the extracted transcript as input.

**Actions:**

1. Load the full transcript text
2. Apply the comprehensive summarization prompt
3. Use AI model (Claude/GPT) to generate structured summary
4. Ensure output follows the defined structure:
   - Header with video metadata
   - Executive synthesis
   - Detailed section-by-section breakdown
   - Key insights and conclusions
   - Concepts and terminology
   - Resources and references

**Implementation:**

```bash
# Use the transcript file as input to the AI prompt
TRANSCRIPT_FILE="/tmp/transcript_${VIDEO_ID}.txt"

# The AI agent will:
# 1. Read the transcript
# 2. Apply the STAR + R-I-S-E summarization framework
# 3. Generate comprehensive Markdown output
# 4. Structure with headers, lists, and highlights

view "$TRANSCRIPT_FILE"  # Read transcript into context
```

Then apply the full summarization prompt (from enhanced version in Phase 2).

### Step 5: Format and Present Output

**Progress:**
```bash
echo "[████████████████████] 100% - Step 5/5: Formatting Output"
```

**Objective:** Deliver the summary in clean, well-structured Markdown.

**Output Structure:**

```markdown
# [Video Title]

**Channel:** [Channel Name]  
**Duration:** [Duration]  
**URL:** [https://youtube.com/watch?v=VIDEO_ID]  
**Publication Date:** [Date if available]

---

## 📊 Executive Summary

[2-3 paragraph overview of the content, main themes, and target audience]

---

## 📝 Detailed Summary

### [Topic 1]

[Comprehensive explanation with examples, data, quotes...]

#### [Subtopic 1.1]

[Detailed breakdown...]

### [Topic 2]

[Continued detailed analysis...]

---

## 💡 Key Insights

- **[Insight 1]:** [Explanation]
- **[Insight 2]:** [Explanation]
- **[Insight 3]:** [Explanation]

---

## 📚 Concepts and Terminology

- **[Term 1]:** [Definition and context]
- **[Term 2]:** [Definition and context]

---

## 🔗 Mentioned Resources

- [Resource 1] - [Description]
- [Resource 2] - [Description]

---

## 📌 Conclusion

[Final synthesis and takeaways]

---

*Summary generated from video transcript using youtube-transcript-api*
```

**Presentation:**

- Display the full Markdown summary to the user
- Include video metadata in header for reference
- Use emojis and formatting for readability
- Proceed to Step 6 for save options

### Step 6: Save Options

**Objective:** Ask user about save preferences for summary and transcript.

**Actions:**

**Ask the user (single question, multiple choice):**

```
What would you like to save?
- [ ] Summary only
- [ ] Summary + raw transcript
- [ ] Raw transcript only
- [ ] Nothing (display only)
```

**Implementation by option:**

**Option 1: Summary only**
1. Generate filename: `resumo-{VIDEO_ID}-{YYYY-MM-DD}.md`
2. Save summary content (without transcript section)
3. Use `edit` tool to create file
4. Confirm: `✅ File saved: resumo-{VIDEO_ID}-{YYYY-MM-DD}.md`

**Option 2: Summary + raw transcript**
1. Generate filename: `resumo-{VIDEO_ID}-{YYYY-MM-DD}.md`
2. Append transcript section to summary:
   ```markdown
   ---
   
   ## 📄 Raw Transcript
   
   > *Original transcript extracted from video using youtube-transcript-api*
   
   {full transcript text}
   ```
3. Use `edit` tool to create file
4. Confirm: `✅ File saved: resumo-{VIDEO_ID}-{YYYY-MM-DD}.md (includes raw transcript)`

**Option 3: Raw transcript only**
1. Generate filename: `transcript-{VIDEO_ID}-{YYYY-MM-DD}.txt`
2. Create plain text file with transcript only (no Markdown formatting)
3. Include minimal header:
   ```
   YouTube Transcript
   Video ID: {VIDEO_ID}
   URL: https://youtube.com/watch?v={VIDEO_ID}
   Extracted: {YYYY-MM-DD}
   
   ---
   
   {full transcript text}
   ```
4. Use `edit` tool to create file
5. Confirm: `✅ File saved: transcript-{VIDEO_ID}-{YYYY-MM-DD}.txt`

**Option 4: Nothing (display only)**
1. Display message: `✅ Summary displayed. No files saved.`
2. Skip file creation

**Display completion gauge:**
```bash
echo "[████████████████████] 100% - ✓ Processing complete!"
```

```
╔══════════════════════════════════════════════════════════════╗
║ ✓ Step 1: URL Validated                                      ║
║ ✓ Step 2: Availability Checked                               ║
║ ✓ Step 3: Transcript Extracted                               ║
║ ✓ Step 4: Summary Generated                                  ║
║ ✓ Step 5: Output Formatted                                   ║
║ ✅ PROCESSING COMPLETE!                                      ║
╠══════════════════════════════════════════════════════════════╣
║ Progress: ██████████████████████████████  100%              ║
╚══════════════════════════════════════════════════════════════╝
```

## Error Handling

### Missing Dependency

```
⚠️  youtube-transcript-api not installed

This skill requires the Python library 'youtube-transcript-api'.

Install with: pip install youtube-transcript-api

Would you like me to install it now? [Y/n]
```

### Invalid URL

```
❌ Invalid YouTube URL format

Expected format examples:
- https://www.youtube.com/watch?v=dQw4w9WgXcQ
- https://youtu.be/dQw4w9WgXcQ

Please provide a valid YouTube video URL.
```

### Video Not Accessible

```
❌ Unable to access video

Possible reasons:
1. Video is private or unlisted
2. Video has been removed
3. Invalid video ID
4. Network connectivity issues

Please verify the URL and try again with a public video.
```

### No Transcript Available

```
❌ No transcript available for this video

This skill requires videos with:
- Auto-generated captions (enabled by creator)
- Manual subtitles/captions

Unfortunately, this video does not have transcripts enabled.
Cannot proceed with summary generation.
```

### Transcript Extraction Failed

```
❌ Error extracting transcript

Error details: [specific error message]

Possible solutions:
1. Verify video is still available
2. Check internet connection
3. Try a different video
4. Update youtube-transcript-api: pip install --upgrade youtube-transcript-api
```

## Critical Rules

### **NEVER:**

- ❌ Proceed without validating video URL format
- ❌ Skip transcript availability check (always validate before extraction)
- ❌ Generate summaries without actual transcript data
- ❌ Ignore error messages from youtube-transcript-api
- ❌ Assume dependency is installed (always check first)
- ❌ Process private or restricted videos (respect access controls)
- ❌ Truncate summaries for brevity (prioritize completeness)
- ❌ Omit video metadata from output
- ❌ Skip the progress gauge during processing
- ❌ Save files without asking the user first (Step 6)
- ❌ Save transcript without asking user preference (Step 6 is mandatory)

### **ALWAYS:**

- ✅ Validate YouTube URL format before proceeding
- ✅ Check if youtube-transcript-api is installed (Step 0)
- ✅ Verify video and transcript availability before extraction
- ✅ Handle all error cases with clear, actionable messages
- ✅ Extract full transcript (not partial)
- ✅ Apply STAR + R-I-S-E framework for comprehensive analysis
- ✅ Structure output with Markdown headers and formatting
- ✅ Include video metadata (title, channel, URL, duration)
- ✅ Prioritize detail and completeness over conciseness
- ✅ Provide source attribution in output
- ✅ Display progress gauge before each processing step
- ✅ Ask user about save options after summary generation (Step 6)
- ✅ Offer all 4 save options to user (summary, summary+transcript, transcript only, nothing)
- ✅ Use descriptive filenames for transcript-only files (transcript-{VIDEO_ID}-{DATE}.txt)

## Example Usage

### **Example 1: Successful Summary Generation**

**User Input:**
```
copilot> summarize this video: https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Skill Process:**

```
[████░░░░░░░░░░░░░░░░] 20% - Step 1/5: Validating URL
📹 Video ID extracted: dQw4w9WgXcQ
[████████░░░░░░░░░░░░] 40% - Step 2/5: Checking Availability
✅ Video accessible
📝 Available transcripts: English (en) [Auto-generated]
[████████████░░░░░░░░] 60% - Step 3/5: Extracting Transcript
✅ Transcript extracted successfully
📊 Transcript length: 4,523 characters
[████████████████░░░░] 80% - Step 4/5: Generating Summary
🤖 Generating comprehensive summary...
[████████████████████] 100% - Step 5/5: Formatting Output
```

**Output:**

```markdown
# Rick Astley - Never Gonna Give You Up (Official Video)

**Channel:** Rick Astley  
**Duration:** 3:33  
**URL:** https://www.youtube.com/watch?v=dQw4w9WgXcQ

[... full detailed summary following the structured template ...]
```

**Save Options:**

```
What would you like to save?
→ Summary only

✅ File saved: resumo-dQw4w9WgXcQ-2026-02-01.md
[████████████████████] 100% - ✓ Processing complete!
```

---

### **Example 2: Missing Dependency**

**User Input:**
```
copilot> summarize this youtube video https://youtu.be/abc123
```

**Skill Response:**

```
⚠️  youtube-transcript-api not installed

This skill requires the Python library 'youtube-transcript-api'.

Would you like me to install it now?
- [ ] Yes - Install with pip
- [ ] No - I'll install manually
```

**User selects "Yes":**

```bash
$ pip install youtube-transcript-api
Successfully installed youtube-transcript-api-0.6.1

✅ Installation complete! Proceeding with video summary...
```

---

### **Example 3: No Transcript Available**

**User Input:**
```
copilot> extract youtube transcript https://youtube.com/watch?v=xyz789
```

**Skill Response:**

```
📹 Video ID extracted: xyz789
✅ Checking video availability...
❌ No transcript available for this video

This skill requires videos with auto-generated captions or manual subtitles.
Unfortunately, transcripts are not enabled for this video.

Cannot proceed with summary generation.
```

---

### **Example 4: Invalid URL**

**User Input:**
```
copilot> summarize youtube video www.youtube.com/some-video
```

**Skill Response:**

```
❌ Invalid YouTube URL format

Expected format examples:
- https://www.youtube.com/watch?v=VIDEO_ID
- https://youtu.be/VIDEO_ID

Please provide a valid YouTube video URL.
```

---

### **Example 5: Portuguese Educational Video**

**User Input:**
```
copilot> summarize this youtube video: https://www.youtube.com/watch?v=exemplo123
```

**Skill Process:**

```
[████░░░░░░░░░░░░░░░░] 20% - Step 1/5: Validating URL
📹 Video ID extracted: exemplo123
[████████░░░░░░░░░░░░] 40% - Step 2/5: Checking Availability
✅ Video accessible
📝 Available transcripts: Portuguese (pt) [Manual], English (en) [Auto-generated]
✅ Using Portuguese transcript (manual)
[████████████░░░░░░░░] 60% - Step 3/5: Extracting Transcript
📊 Transcript length: 12,845 characters
[████████████████░░░░] 80% - Step 4/5: Generating Summary
🤖 Generating comprehensive summary...
[████████████████████] 100% - Step 5/5: Formatting Output
```

**Output:**

```markdown
# Introduction to Artificial Intelligence - Fundamental Concepts

**Channel:** TechEdu Brasil  
**Duration:** 45:12  
**URL:** https://www.youtube.com/watch?v=exemplo123  
**Publication Date:** 2026-01-15

---

## 📊 Executive Summary

This video provides a comprehensive introduction to the fundamental concepts of Artificial Intelligence (AI), designed for beginners and professionals who want to understand the technical foundations and practical applications of modern AI. The instructor covers everything from basic definitions to machine learning algorithms, using practical examples and visualizations to facilitate understanding.

[... continued detailed summary ...]
```

**Save Options:**

```
What would you like to save?
→ Summary + raw transcript

✅ File saved: resumo-exemplo123-2026-02-01.md (includes raw transcript)
[████████████████████] 100% - ✓ Processing complete!
```

---

### **Example 6: Save Transcript Only**

**User Input:**
```
copilot> extract transcript from https://youtube.com/watch?v=tech456
```

**Skill Process:**

```
[████░░░░░░░░░░░░░░░░] 20% - Step 1/5: Validating URL
📹 Video ID extracted: tech456
[████████░░░░░░░░░░░░] 40% - Step 2/5: Checking Availability
✅ Video accessible
📝 Available transcripts: English (en) [Auto-generated]
[████████████░░░░░░░░] 60% - Step 3/5: Extracting Transcript
✅ Transcript extracted successfully
📊 Transcript length: 8,234 characters
[████████████████░░░░] 80% - Step 4/5: Generating Summary
🤖 Generating comprehensive summary...
[████████████████████] 100% - Step 5/5: Formatting Output
```

**Output:**

```markdown
# Machine Learning Fundamentals - Complete Tutorial

**Channel:** Tech Academy  
**Duration:** 28:45  
**URL:** https://www.youtube.com/watch?v=tech456

[... full detailed summary following the structured template ...]
```

**Save Options:**

```
What would you like to save?
→ Raw transcript only

✅ File saved: transcript-tech456-2026-02-02.txt
[████████████████████] 100% - ✓ Processing complete!
```

**File Content (transcript-tech456-2026-02-02.txt):**

```
YouTube Transcript
Video ID: tech456
URL: https://youtube.com/watch?v=tech456
Extracted: 2026-02-02

---

Welcome to this comprehensive tutorial on machine learning fundamentals. In today's video, we'll explore the core concepts that power modern AI systems...
```

---

## Bundled Resources

### scripts/

**install-dependencies.sh:**

```bash
#!/usr/bin/env bash
# Install youtube-transcript-api dependency

echo "📦 Installing youtube-transcript-api..."

if command -v pip3 &>/dev/null; then
    pip3 install youtube-transcript-api
elif command -v pip &>/dev/null; then
    pip install youtube-transcript-api
else
    echo "❌ pip not found. Please install Python pip first."
    exit 1
fi

echo "✅ Installation complete!"
```

**extract-transcript.py:**

```python
#!/usr/bin/env python3
"""
Extract YouTube video transcript
Usage: ./extract-transcript.py VIDEO_ID [LANGUAGE_CODE]
"""

import sys
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

def extract_transcript(video_id, language='en'):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(
            video_id,
            languages=[language, 'en']  # Fallback to English
        )
        
        full_text = " ".join([entry['text'] for entry in transcript])
        return full_text
        
    except TranscriptsDisabled:
        print(f"❌ Transcripts disabled for video {video_id}", file=sys.stderr)
        sys.exit(1)
    except NoTranscriptFound:
        print(f"❌ No transcript found for video {video_id}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: ./extract-transcript.py VIDEO_ID [LANGUAGE_CODE]")
        sys.exit(1)
    
    video_id = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else 'en'
    
    transcript = extract_transcript(video_id, language)
    print(transcript)
```

### examples/

**example-summary.md:**

Sample output showing what a complete summary looks like (see Example 5 above for structure).

---

**Version:** 1.2.0
**Last Updated:** 2026-02-02
**Maintained By:** Eric Andrade
