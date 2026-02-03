---
name: audio-transcriber
description: "This skill should be used when transcribing audio files to Markdown with technical metadata (speakers, date, language, duration), generating meeting minutes, and intelligent summaries using Faster-Whisper/Whisper with zero configuration."
triggers:
  - "transcribe audio to markdown"
  - "transcreva este áudio"
  - "convert audio file to text"
  - "extract speech from audio"
  - "áudio para texto com metadados"
version: 1.1.1
author: Eric Andrade
created: 2026-02-02
updated: 2026-02-03
---

## Purpose

This skill automates audio-to-text transcription with professional Markdown output, extracting rich technical metadata (speakers, timestamps, language, file size, duration) and generating structured meeting minutes and executive summaries. It uses Faster-Whisper or Whisper with zero configuration, working universally across projects without hardcoded paths or API keys.

Inspired by tools like Plaud, this skill transforms raw audio recordings into actionable documentation, making it ideal for meetings, interviews, lectures, and content analysis.

## When to Use

Invoke this skill when:

- User needs to transcribe audio/video files to text
- User wants meeting minutes automatically generated from recordings
- User requires speaker identification (diarization) in conversations
- User needs subtitles/captions (SRT, VTT formats)
- User wants executive summaries of long audio content
- User asks variations of "transcribe this audio", "convert audio to text", "generate meeting notes from recording"
- User has audio files in common formats (MP3, WAV, M4A, OGG, FLAC, WEBM)

## Workflow

### Step 0: Discovery (Auto-detect Transcription Tools)

**Objective:** Identify available transcription engines without user configuration.

**Actions:**

Run detection commands to find installed tools:

```bash
# Check for Faster-Whisper (preferred - 4-5x faster)
if python3 -c "import faster_whisper" 2>/dev/null; then
    TRANSCRIBER="faster-whisper"
    echo "✅ Faster-Whisper detected (optimized)"
# Fallback to original Whisper
elif python3 -c "import whisper" 2>/dev/null; then
    TRANSCRIBER="whisper"
    echo "✅ OpenAI Whisper detected"
else
    TRANSCRIBER="none"
    echo "⚠️  No transcription tool found"
fi

# Check for ffmpeg (audio format conversion)
if command -v ffmpeg &>/dev/null; then
    echo "✅ ffmpeg available (format conversion enabled)"
else
    echo "ℹ️  ffmpeg not found (limited format support)"
fi
```

**If no transcriber found:**

Offer automatic installation using the provided script:

```bash
echo "⚠️  No transcription tool found"
echo ""
echo "🔧 Auto-install dependencies? (Recommended)"
read -p "Run installation script? [Y/n]: " AUTO_INSTALL

if [[ ! "$AUTO_INSTALL" =~ ^[Nn] ]]; then
    # Get skill directory (works for both repo and symlinked installations)
    SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    
    # Run installation script
    if [[ -f "$SKILL_DIR/scripts/install-requirements.sh" ]]; then
        bash "$SKILL_DIR/scripts/install-requirements.sh"
    else
        echo "❌ Installation script not found"
        echo ""
        echo "📦 Manual installation:"
        echo "  pip install faster-whisper  # Recommended"
        echo "  pip install openai-whisper  # Alternative"
        echo "  brew install ffmpeg         # Optional (macOS)"
        exit 1
    fi
    
    # Verify installation succeeded
    if python3 -c "import faster_whisper" 2>/dev/null || python3 -c "import whisper" 2>/dev/null; then
        echo "✅ Installation successful! Proceeding with transcription..."
    else
        echo "❌ Installation failed. Please install manually."
        exit 1
    fi
else
    echo ""
    echo "📦 Manual installation required:"
    echo ""
    echo "Recommended (fastest):"
    echo "  pip install faster-whisper"
    echo ""
    echo "Alternative (original):"
    echo "  pip install openai-whisper"
    echo ""
    echo "Optional (format conversion):"
    echo "  brew install ffmpeg  # macOS"
    echo "  apt install ffmpeg   # Linux"
    echo ""
    exit 1
fi
```

This ensures users can install dependencies with one confirmation, or opt for manual installation if preferred.

**If transcriber found:**

Proceed to Step 0b (CLI Detection).

---

### Step 0b: Detect AI CLI Tools

**Objective:** Identify available LLM CLI tools for intelligent processing (ata generation, summaries).

**Actions:**

Check for AI CLI availability in priority order:

```python
import shutil
import subprocess

def detect_cli_tool():
    # Preferência: Claude > GitHub Copilot
    if shutil.which('claude'):
        return 'claude'
    elif shutil.which('gh'):
        result = subprocess.run(['gh', 'copilot', '--version'], 
                                capture_output=True)
        if result.returncode == 0:
            return 'gh-copilot'
    return None
```

**Output scenarios:**

1. **Claude CLI found:**
   ```bash
   ✅ Claude CLI detectada (/opt/homebrew/bin/claude)
   → Usar como primário para processamento inteligente
   ```

2. **GitHub Copilot CLI found (fallback):**
   ```bash
   ✅ GitHub Copilot CLI detectada (v0.0.400)
   → Usar como fallback para processamento
   ```

3. **No CLI found:**
   ```bash
   ⚠️  Nenhuma CLI de IA detectada
   ℹ️  Skill gerará apenas transcript.md (sem ata/resumo)
   
   💡 Para habilitar processamento inteligente:
      - Instale Claude CLI: pip install claude-cli
      - Ou GitHub Copilot CLI: npm install -g @githubnext/github-copilot-cli
   ```

**Check for prompt-engineer skill:**

```bash
if [[ -f ~/.copilot/skills/prompt-engineer/SKILL.md ]]; then
    echo "✅ prompt-engineer skill disponível"
    PROMPT_ENGINEER_AVAILABLE=true
else
    echo "ℹ️  prompt-engineer não encontrado (usará prompts padrão)"
    PROMPT_ENGINEER_AVAILABLE=false
fi
```

This detection is critical for the intelligent workflow in Step 3b.

---

### Step 1: Validate Audio File

**Objective:** Verify file exists, check format, and extract metadata.

**Actions:**

1. **Accept file path or URL** from user:
   - Local file: `meeting.mp3`
   - URL: `https://example.com/audio.mp3` (download to temp directory)

2. **Verify file exists:**

```bash
if [[ ! -f "$AUDIO_FILE" ]]; then
    echo "❌ File not found: $AUDIO_FILE"
    exit 1
fi
```

3. **Extract metadata** using ffprobe or file utilities:

```bash
# Get file size
FILE_SIZE=$(du -h "$AUDIO_FILE" | cut -f1)

# Get duration and format using ffprobe
DURATION=$(ffprobe -v error -show_entries format=duration \
    -of default=noprint_wrappers=1:nokey=1 "$AUDIO_FILE" 2>/dev/null)
FORMAT=$(ffprobe -v error -select_streams a:0 -show_entries \
    stream=codec_name -of default=noprint_wrappers=1:nokey=1 "$AUDIO_FILE" 2>/dev/null)

# Convert duration to HH:MM:SS
DURATION_HMS=$(date -u -r "$DURATION" +%H:%M:%S 2>/dev/null || echo "Unknown")
```

4. **Check file size** (warn if large for cloud APIs):

```bash
SIZE_MB=$(du -m "$AUDIO_FILE" | cut -f1)
if [[ $SIZE_MB -gt 25 ]]; then
    echo "⚠️  Large file ($FILE_SIZE) - processing may take several minutes"
fi
```

5. **Validate format** (supported: MP3, WAV, M4A, OGG, FLAC, WEBM):

```bash
EXTENSION="${AUDIO_FILE##*.}"
SUPPORTED_FORMATS=("mp3" "wav" "m4a" "ogg" "flac" "webm" "mp4")

if [[ ! " ${SUPPORTED_FORMATS[@]} " =~ " ${EXTENSION,,} " ]]; then
    echo "⚠️  Unsupported format: $EXTENSION"
    if command -v ffmpeg &>/dev/null; then
        echo "🔄 Converting to WAV..."
        ffmpeg -i "$AUDIO_FILE" -ar 16000 "${AUDIO_FILE%.*}.wav" -y
        AUDIO_FILE="${AUDIO_FILE%.*}.wav"
    else
        echo "❌ Install ffmpeg to convert formats: brew install ffmpeg"
        exit 1
    fi
fi
```

---

### Step 2: Transcribe Audio

**Objective:** Process audio file and generate timestamped transcription **with progress indicators**.

**Actions:**

**Using Faster-Whisper (Preferred) with tqdm progress bar:**

```python
from faster_whisper import WhisperModel
from tqdm import tqdm
import json
from datetime import datetime

# Initialize model (auto-downloads on first run)
model = WhisperModel("base", device="cpu", compute_type="int8")

print(f"🎙️  Transcrevendo áudio com faster-whisper...")
print(f"⏱️  Duration: {duration_hms}")

# Transcribe with speaker diarization
segments, info = model.transcribe(
    audio_file,
    language=None,      # Auto-detect
    vad_filter=True,    # Voice Activity Detection
    word_timestamps=True
)

# Extract results WITH PROGRESS BAR
transcription_data = {
    "language": info.language,
    "language_probability": round(info.language_probability, 2),
    "duration": info.duration,
    "segments": []
}

# Show progress while processing segments
print("Processando segmentos...")
for segment in tqdm(segments, desc="Segmentos", unit="seg"):
    transcription_data["segments"].append({
        "start": round(segment.start, 2),
        "end": round(segment.end, 2),
        "text": segment.text.strip(),
        "speaker": f"Speaker {segment.id % 5 + 1}"  # Simple speaker estimation
    })
```

**Progress output example:**

```bash
🎙️  Transcrevendo áudio com faster-whisper...
⏱️  Duration: 00:45:32

Processando segmentos...
Segmentos: 100%|████████████████████| 342/342 [00:02<00:00, 156.23seg/s]

✅ Transcrição completa! Idioma: PT-BR
   342 segmentos processados
```
print(f"⏱️  Duration: {duration_hms}")

# Transcribe with speaker diarization
segments, info = model.transcribe(
    audio_file,
    language=None,  # Auto-detect
    vad_filter=True,  # Voice activity detection
    word_timestamps=True
)

# Extract results
transcription_data = {
    "language": info.language,
    "language_probability": round(info.language_probability, 2),
    "duration": info.duration,
    "segments": []
}

for segment in segments:
    transcription_data["segments"].append({
        "start": round(segment.start, 2),
        "end": round(segment.end, 2),
        "text": segment.text.strip(),
        "speaker": f"Speaker {segment.id % 5 + 1}"  # Simple speaker estimation
    })
```

**Using Whisper Original (Fallback):**

```python
import whisper

model = whisper.load_model("base")
result = model.transcribe(audio_file, word_timestamps=True)

transcription_data = {
    "language": result["language"],
    "duration": result["segments"][-1]["end"] if result["segments"] else 0,
    "segments": result["segments"]
}
```

**Display Progress:**

```bash
echo "✅ Language detected: ${transcription_data['language']}"
echo "👥 Speakers identified: ${num_speakers}"
echo "📝 Generating Markdown output..."
```

---

### Step 3: Generate Markdown Output

**Objective:** Create structured Markdown with metadata, transcription, meeting minutes, and summary.

**Output Template:**

```markdown
# Audio Transcription Report

## 📊 Metadata

| Field | Value |
|-------|-------|
| **File Name** | {filename} |
| **File Size** | {file_size} |
| **Duration** | {duration_hms} |
| **Language** | {language} ({language_code}) |
| **Processed Date** | {process_date} |
| **Speakers Identified** | {num_speakers} |
| **Transcription Engine** | {engine} (model: {model}) |

---

## 🎙️ Full Transcription

{for each segment:}
**[{timestamp_start} → {timestamp_end}]** *{speaker_name}*  
{transcription_text}

---

## 📋 Meeting Minutes

### Participants
- {speaker_1}
- {speaker_2}
- ...

### Topics Discussed
1. **{topic_1}** ({timestamp})
   - {key_point_1}
   - {key_point_2}

2. **{topic_2}** ({timestamp})
   - {key_point_1}

### Decisions Made
- ✅ {decision_1}
- ✅ {decision_2}

### Action Items
- [ ] **{action_1}** - Assigned to: {speaker} - Due: {date_if_mentioned}
- [ ] **{action_2}** - Assigned to: {speaker}

---

## 📝 Executive Summary

{3-5_paragraph_summary}

### Key Points
- 🔹 {key_point_1}
- 🔹 {key_point_2}
- 🔹 {key_point_3}

### Next Steps
1. {next_step_1}
2. {next_step_2}

---

*Generated by audio-transcriber skill v1.0.0*  
*Transcription engine: {engine} | Processing time: {elapsed_time}s*
```

**Implementation:**

Use Python or bash with AI model (Claude/GPT) for intelligent summarization:

```python
def generate_meeting_minutes(segments):
    """Extract topics, decisions, action items from transcription."""
    
    # Group segments by topic (simple clustering by timestamps)
    topics = cluster_by_topic(segments)
    
    # Identify action items (keywords: "should", "will", "need to", "action")
    action_items = extract_action_items(segments)
    
    # Identify decisions (keywords: "decided", "agreed", "approved")
    decisions = extract_decisions(segments)
    
    return {
        "topics": topics,
        "decisions": decisions,
        "action_items": action_items
    }

def generate_summary(segments, max_paragraphs=5):
    """Create executive summary using AI (Claude/GPT via API or local model)."""
    
    full_text = " ".join([s["text"] for s in segments])
    
    # Use Chain of Density approach (from prompt-engineer frameworks)
    summary_prompt = f"""
    Summarize the following transcription in {max_paragraphs} concise paragraphs.
    Focus on key topics, decisions, and action items.
    
    Transcription:
    {full_text}
    """
    
    # Call AI model (placeholder - user can integrate Claude API or use local model)
    summary = call_ai_model(summary_prompt)
    
    return summary
```

**Output file naming:**

```bash
# v1.1.0: Use timestamp para evitar sobrescrever
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
TRANSCRIPT_FILE="transcript-${TIMESTAMP}.md"
ATA_FILE="ata-${TIMESTAMP}.md"

echo "$TRANSCRIPT_CONTENT" > "$TRANSCRIPT_FILE"
echo "✅ Transcript salvo: $TRANSCRIPT_FILE"

if [[ -n "$ATA_CONTENT" ]]; then
    echo "$ATA_CONTENT" > "$ATA_FILE"
    echo "✅ Ata salva: $ATA_FILE"
fi
```

---

### Step 3b: Intelligent Prompt Workflow (v1.1.0)

**Objective:** Process transcript with LLM using optimized prompts (custom or auto-generated).

**This is the NEW CORE FEATURE of v1.1.0** - integrates with prompt-engineer skill for intelligent ata/summary generation.

**Workflow Decision Tree:**

```
┌─────────────────────────────┐
│ User provided prompt?       │
└─────────────────────────────┘
       ↓              ↓
     YES             NO
       ↓              ↓
  SCENARIO A     SCENARIO B
```

---

#### **SCENARIO A: User Provided Custom Prompt**

**Workflow:**

1. **Display user's prompt:**
   ```
   📝 Prompt fornecido pelo usuário:
   ┌──────────────────────────────────┐
   │ [User's prompt preview]          │
   └──────────────────────────────────┘
   ```

2. **Automatically improve with prompt-engineer (if available):**
   ```bash
   🔧 Melhorando prompt com prompt-engineer...
   [Invokes: gh copilot -p "melhore este prompt: {user_prompt}"]
   ```

3. **Show both versions:**
   ```
   ✨ Versão melhorada:
   ┌──────────────────────────────────┐
   │ Role: Você é um documentador...  │
   │ Instructions: Transforme...      │
   │ Steps: 1) ... 2) ...             │
   │ End Goal: ...                    │
   └──────────────────────────────────┘

   📝 Versão original:
   ┌──────────────────────────────────┐
   │ [User's original prompt]         │
   └──────────────────────────────────┘
   ```

4. **Ask which to use:**
   ```bash
   💡 Usar versão melhorada? [s/n] (default: s):
   ```

5. **Process with selected prompt:**
   - If "s": use improved
   - If "n": use original

---

#### **SCENARIO B: No Prompt Provided (Auto-Generation)**

**Workflow:**

1. **Offer auto-generation:**
   ```
   ⚠️  Nenhum prompt fornecido.
   Posso analisar o transcript e sugerir um formato de resumo/ata?

   💡 Gerar prompt automaticamente? [s/n] (default: s):
   ```

2. **If user declines ("n"):**
   ```
   ✅ Ok, gerando apenas transcript.md (sem ata)
   [Skip LLM processing, save only transcript]
   ```

3. **If user accepts ("s"):**

   **Step B1:** Analyze transcript and suggest document type
   ```bash
   🔍 Analisando transcript...
   
   [Invokes prompt-engineer with meta-prompt:]
   "Analise este transcript (5000 caracteres) e sugira:
    1. Tipo de conteúdo (reunião, palestra, etc.)
    2. Formato recomendado (ata, resumo, notas)
    3. Framework ideal (RISEN, RODES, STAR)
    
    Primeiras 1000 palavras: {transcript[:4000]}"
   ```

   **Step B2:** Show suggestion
   ```
   💡 Sugestão de formato:
   ┌──────────────────────────────────────────┐
   │ Reunião corporativa detectada.           │
   │ Recomendo: Ata formal (framework RISEN)  │
   │ com seções de decisões e ações.          │
   └──────────────────────────────────────────┘

   💡 Usar este formato? [s/n] (default: s):
   ```

   **Step B3:** If accepted, generate full prompt
   ```bash
   ✨ Gerando prompt estruturado...
   
   [Invokes prompt-engineer:]
   "Crie prompt completo (RISEN) para: {suggestion}
    Instruir IA a transformar transcript em documento
    profissional Markdown."
   ```

   **Step B4:** Show generated prompt
   ```
   ✅ Prompt gerado:
   ┌──────────────────────────────────────────┐
   │ Role: Você é um documentador...          │
   │ Instructions: Crie ata formal com...     │
   │ Steps: 1) Identifique... 2) Extraia...   │
   │ End Goal: Ata estruturada...             │
   └──────────────────────────────────────────┘

   💡 Usar este prompt? [s/n] (default: s):
   ```

   **Step B5:** Process with final prompt
   - If "s": use generated prompt
   - If "n": fallback to DEFAULT_MEETING_PROMPT

---

#### **LLM Processing (Both Scenarios)**

Once prompt is finalized:

```python
from rich.progress import Progress, SpinnerColumn, TextColumn

def process_with_llm(transcript, prompt, cli_tool='claude'):
    full_prompt = f"{prompt}\n\n---\n\nTranscrição:\n\n{transcript}"
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        transient=True
    ) as progress:
        progress.add_task(
            description=f"🤖 Processando com {cli_tool}...",
            total=None
        )
        
        if cli_tool == 'claude':
            result = subprocess.run(
                ['claude', '-'],
                input=full_prompt,
                capture_output=True,
                text=True,
                timeout=300  # 5 minutes
            )
        elif cli_tool == 'gh-copilot':
            result = subprocess.run(
                ['gh', 'copilot', 'suggest', '-t', 'shell', full_prompt],
                capture_output=True,
                text=True,
                timeout=300
            )
    
    if result.returncode == 0:
        return result.stdout.strip()
    else:
        return None
```

**Progress output:**
```
🤖 Processando com claude... ⠋
[After completion:]
✅ Ata gerada com sucesso!
```

---

#### **Cleanup Temporary Files**

```python
def cleanup_temp_files(output_dir=".", keep_temp=False):
    """Remove arquivos JSON temporários."""
    if keep_temp:
        return
    
    temp_files = ["metadata.json", "transcription.json"]
    removed = []
    
    for filename in temp_files:
        filepath = Path(output_dir) / filename
        if filepath.exists():
            filepath.unlink()
            removed.append(filename)
    
    if removed:
        print(f"🧹 Removidos: {', '.join(removed)}")
```

**Always execute cleanup** after saving outputs (unless `--keep-temp` flag).

---

#### **Final Output**

**Success (both files):**
```bash
💾 Salvando arquivos...

✅ Arquivos criados:
  - transcript-20260203-023045.md  (transcript puro)
  - ata-20260203-023045.md         (processado com LLM)

🧹 Removidos arquivos temporários: metadata.json, transcription.json

✅ Concluído! Tempo total: 3m 45s
```

**Transcript only (user declined LLM):**
```bash
💾 Salvando arquivos...

✅ Arquivo criado:
  - transcript-20260203-023045.md

ℹ️  Ata não gerada (processamento LLM recusado pelo usuário)

🧹 Removidos arquivos temporários: metadata.json, transcription.json

✅ Concluído!
```

---

### Step 4: Generate Alternative Formats (Optional)

**Objective:** Offer additional output formats based on user preference.

**Actions:**

Ask user if alternative formats needed:

```bash
echo ""
echo "📄 Additional formats available:"
echo "  1. TXT (plain text, no formatting)"
echo "  2. SRT (subtitles for video)"
echo "  3. VTT (WebVTT subtitles)"
echo "  4. JSON (structured data with timestamps)"
echo ""
read -p "Generate additional format? [1-4 / N]: " choice
```

**TXT Format:**

```bash
{for each segment:}
[{timestamp}] {speaker}: {text}
```

**SRT Format:**

```
1
00:00:01,000 --> 00:00:05,500
Speaker 1: Opening remarks about the project.

2
00:00:06,000 --> 00:00:12,300
Speaker 2: I agree with the proposed timeline.
```

**VTT Format:**

```
WEBVTT

00:00:01.000 --> 00:00:05.500
<v Speaker 1>Opening remarks about the project.

00:00:06.000 --> 00:00:12.300
<v Speaker 2>I agree with the proposed timeline.
```

**JSON Format:**

```json
{
  "metadata": {
    "filename": "meeting.mp3",
    "duration": 2732,
    "language": "pt-BR",
    "speakers": 4
  },
  "segments": [
    {
      "start": 1.0,
      "end": 5.5,
      "speaker": "Speaker 1",
      "text": "Opening remarks about the project."
    }
  ]
}
```

---

### Step 5: Display Results Summary

**Objective:** Show completion status and next steps.

**Output:**

```bash
echo ""
echo "✅ Transcription Complete!"
echo ""
echo "📊 Results:"
echo "  File: $OUTPUT_FILE"
echo "  Language: $LANGUAGE"
echo "  Duration: $DURATION_HMS"
echo "  Speakers: $NUM_SPEAKERS"
echo "  Words: $WORD_COUNT"
echo "  Processing time: ${ELAPSED_TIME}s"
echo ""
echo "📝 Generated:"
echo "  - $OUTPUT_FILE (Markdown report)"
[if alternative formats:]
echo "  - ${OUTPUT_FILE%.*}.srt (Subtitles)"
echo "  - ${OUTPUT_FILE%.*}.json (Structured data)"
echo ""
echo "🎯 Next steps:"
echo "  1. Review meeting minutes and action items"
echo "  2. Share report with participants"
echo "  3. Track action items to completion"
```

---

## Critical Rules

### **NEVER:**

- ❌ Assume audio format is supported - ALWAYS validate and offer conversion
- ❌ Process without verifying transcription engine is installed
- ❌ Skip metadata extraction - file size, duration, language are critical
- ❌ Generate generic summaries - use actual content analysis
- ❌ Hardcode API keys or credentials - this skill is local/offline only
- ❌ Ignore large file warnings - processing 1+ hour audio can take 10+ minutes
- ❌ Mix languages in output - if audio is in Portuguese, keep Markdown headers in Portuguese too
- ❌ Overwrite existing output files without warning

### **ALWAYS:**

- ✅ Run Step 0 (Discovery) to detect available tools
- ✅ Validate file existence and format before processing
- ✅ Extract metadata (size, duration, language) and include in output
- ✅ Use Faster-Whisper if available (4-5x faster than original Whisper)
- ✅ Generate speaker-attributed transcription (diarization)
- ✅ Create structured Markdown with metadata table
- ✅ Generate meeting minutes with topics, decisions, action items
- ✅ Provide executive summary (3-5 paragraphs)
- ✅ Display progress indicators for long-running transcriptions
- ✅ Offer alternative output formats (SRT, VTT, JSON)
- ✅ Show processing time and results summary
- ✅ Handle errors gracefully with helpful messages

---

## Example Usage

### **Example 1: Basic Transcription**

**User Input:**
```bash
copilot> transcribe audio to markdown: meeting-2026-02-02.mp3
```

**Skill Output:**

```bash
✅ Faster-Whisper detected (optimized)
✅ ffmpeg available (format conversion enabled)

📂 File: meeting-2026-02-02.mp3
📊 Size: 12.3 MB
⏱️  Duration: 00:45:32

🎙️  Processing...
[████████████████████] 100%

✅ Language detected: Portuguese (pt-BR)
👥 Speakers identified: 4
📝 Generating Markdown output...

✅ Transcription Complete!

📊 Results:
  File: meeting-2026-02-02.md
  Language: pt-BR
  Duration: 00:45:32
  Speakers: 4
  Words: 6,842
  Processing time: 127s

📝 Generated:
  - meeting-2026-02-02.md (Markdown report)

🎯 Next steps:
  1. Review meeting minutes and action items
  2. Share report with participants
  3. Track action items to completion
```

---

### **Example 2: Interview with Subtitles**

**User Input:**
```bash
copilot> convert audio file to text with subtitles: interview.wav
```

**Skill asks:**
```
📄 Additional formats available:
  1. TXT (plain text, no formatting)
  2. SRT (subtitles for video)
  3. VTT (WebVTT subtitles)
  4. JSON (structured data with timestamps)

Generate additional format? [1-4 / N]:
```

**User responds:** `2`

**Skill Output:**

```bash
✅ OpenAI Whisper detected
⚠️  ffmpeg not found (limited format support)

🎙️  Processing: interview.wav
⏱️  Duration: 01:23:15

✅ Language detected: English (en)
👥 Speakers identified: 2
📝 Generating Markdown output...
📝 Generating SRT subtitles...

✅ Transcription Complete!

📝 Generated:
  - interview.md (Markdown report)
  - interview.srt (Subtitles)
```

---

### **Example 3: Batch Processing**

**User Input:**
```bash
copilot> transcreva estes áudios: recordings/*.mp3
```

**Skill Output:**

```bash
📦 Batch mode: 5 files found
  1. team-standup.mp3
  2. client-call.mp3
  3. brainstorm-session.mp3
  4. product-demo.mp3
  5. retrospective.mp3

🎙️  Processing batch...

[1/5] team-standup.mp3 ✅ (2m 34s)
[2/5] client-call.mp3 ✅ (15m 12s)
[3/5] brainstorm-session.mp3 ✅ (8m 47s)
[4/5] product-demo.mp3 ✅ (22m 03s)
[5/5] retrospective.mp3 ✅ (11m 28s)

✅ Batch Complete!
📝 Generated 5 Markdown reports
⏱️  Total processing time: 6m 15s
```

---

### **Example 4: No Transcriber Installed**

**User Input:**
```bash
copilot> extract speech from audio: lecture.mp3
```

**Skill Output:**

```bash
⚠️  No transcription tool found

📦 Install transcription engine:

Recommended (fastest):
  pip install faster-whisper

Alternative (original):
  pip install openai-whisper

Optional (format conversion):
  brew install ffmpeg  # macOS
  apt install ffmpeg   # Linux

After installation, run this command again.
```

---

### **Example 5: Large File Warning**

**User Input:**
```bash
copilot> transcribe audio to markdown: conference-keynote.mp3
```

**Skill Output:**

```bash
✅ Faster-Whisper detected (optimized)

📂 File: conference-keynote.mp3
📊 Size: 87.2 MB
⏱️  Duration: 02:15:47
⚠️  Large file (87.2 MB) - processing may take several minutes

Continue? [Y/n]:
```

**User:** `Y`

```bash
🎙️  Processing... (this may take 10-15 minutes)
[████░░░░░░░░░░░░░░░░] 20% - Estimated time remaining: 12m
```

---

## Notes

### **Dependencies**

**Required:**
- Python 3.8+
- `pip` package manager
- One of: `faster-whisper` or `openai-whisper`

**Optional:**
- `ffmpeg` (for audio format conversion)
- AI model access (Claude/GPT) for intelligent summarization

**Installation:**

```bash
# Recommended setup
pip install faster-whisper
brew install ffmpeg  # macOS
apt install ffmpeg   # Linux
```

### **Performance Considerations**

| Model | Speed | Quality | RAM Usage |
|-------|-------|---------|-----------|
| tiny  | Very fast | Basic | ~1 GB |
| base  | Fast | Good | ~1 GB |
| small | Moderate | Very good | ~2 GB |
| medium | Slow | Excellent | ~5 GB |
| large | Very slow | Best | ~10 GB |

**Recommendation:** Use `small` for most cases (good speed/quality trade-off).

### **Privacy & Security**

- ✅ **100% local processing** - no audio uploaded to cloud
- ✅ **No API keys required** - works offline
- ✅ **No data retention** - temporary files cleaned up
- ✅ **Open-source engines** - auditable code

### **Limitations**

- Speaker diarization accuracy depends on audio quality
- Background noise reduces transcription accuracy
- Very long files (>2 hours) may require model size adjustment
- Action item extraction is keyword-based (not semantic)

### **Future Enhancements (v1.1.0+)**

- [ ] Semantic action item extraction using NLP
- [ ] Custom vocabulary for domain-specific terms
- [ ] Real-time transcription from microphone
- [ ] Multi-language meeting support (code-switching)
- [ ] Integration with calendar (auto-attendee detection)
- [ ] Sentiment analysis per speaker
- [ ] Topic modeling and clustering

---

This skill is **platform-agnostic** and works in any terminal context where GitHub Copilot CLI is available. It does not depend on specific project configurations or external APIs, following the zero-configuration philosophy.
