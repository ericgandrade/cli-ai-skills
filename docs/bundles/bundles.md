# 📦 Curated Skill Bundles

Choose the perfect bundle for your workflow and goals.

---

## What Are Bundles?

Bundles are **curated collections** of skills grouped by use case. Instead of installing everything, you can choose exactly what you need. Each bundle is optimized for a specific type of user or workflow.

---

## 🎯 Essential Bundle

**Perfect for:** Getting started with AI skills

**Includes:**
- **skill-creator** - Create custom skills
- **prompt-engineer** - Optimize your prompts

**Installation:**
```bash
npx claude-superskills --bundle essential -y
```

**Use Cases:**
- 🎓 Learning how AI skills work
- 🛠️ Creating your first custom skill
- 📝 Writing better AI prompts
- 🚀 Getting started quickly

**Word Count:** ~3000 words of functionality

**Perfect For:**
- Beginners
- Solo developers
- Skill learners
- Teams getting started

---

## 🎬 Content Creation Bundle

**Perfect for:** Processing video and audio

**Includes:**
- **youtube-summarizer** - Summarize YouTube videos
- **audio-transcriber** - Transcribe audio to Markdown

**Installation:**
```bash
npx claude-superskills --bundle content -y
```

**Use Cases:**
- 🎥 Summarizing educational YouTube videos
- 🎙️ Transcribing podcasts and recordings
- 📋 Creating meeting notes automatically
- 📊 Extracting key insights from videos
- 🌍 Multi-language support (99+ languages)

**Word Count:** ~4000 words of functionality

**Perfect For:**
- Content creators
- Researchers
- Podcast producers
- Meeting attendees
- Students

---

## 🛠️ Developer Bundle

**Perfect for:** Creating and extending skills

**Includes:**
- **skill-creator** - Build new AI skills from scratch

**Installation:**
```bash
npx claude-superskills --bundle developer -y
```

**Use Cases:**
- 🎯 Building custom domain-specific skills
- 🔧 Extending CLI capabilities
- 👥 Creating team-specific tools
- 🏢 Enterprise skill development
- 📚 Sharing skills across teams

**Word Count:** ~2000 words of functionality

**Perfect For:**
- Skill developers
- Power users
- Technical teams
- Enterprise users

---

## 🚀 All Skills Bundle

**Perfect for:** Complete functionality

**Includes:**
- **skill-creator** - Create custom skills
- **prompt-engineer** - Optimize prompts
- **youtube-summarizer** - Summarize videos
- **audio-transcriber** - Transcribe audio

**Installation:**
```bash
npx claude-superskills --bundle all -y
```

**Use Cases:**
- 🎓 Complete learning experience
- 🔄 All content types (prompts, video, audio)
- 🛠️ Full development capability
- 💼 Enterprise comprehensive suite
- 🌟 Maximum AI assistance

**Word Count:** ~9000 words of functionality

**Perfect For:**
- Power users
- Teams wanting everything
- Comprehensive setups
- Enterprise deployments

---

## 📊 Bundle Comparison

| Feature | Essential | Content | Developer | All |
|---------|-----------|---------|-----------|-----|
| Prompt Optimization | ✅ | ❌ | ❌ | ✅ |
| Skill Creation | ✅ | ❌ | ✅ | ✅ |
| Video Summarization | ❌ | ✅ | ❌ | ✅ |
| Audio Transcription | ❌ | ✅ | ❌ | ✅ |
| Skills Count | 2 | 2 | 1 | 4 |
| Size | Small | Medium | Small | Large |
| Beginner Friendly | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Content Focus | No | Yes | No | Yes |

---

## 🎯 How to Choose a Bundle

### Use this flowchart to pick the right bundle:

```
Start
  │
  ├─ Do you create/extend skills?
  │  ├─ YES → Do you also work with content?
  │  │        ├─ YES → All Bundle ✅
  │  │        └─ NO  → Depends:
  │  │                 ├─ Just learn? → Essential ✅
  │  │                 └─ Full dev?   → Developer + Essential?
  │  │
  │  └─ NO → Do you work with videos/audio?
  │         ├─ YES → Content Bundle ✅
  │         └─ NO  → Essential Bundle ✅
  │
  └─ Want everything?
     └─ All Bundle ✅
```

### Common Scenarios:

**"I'm new and want to learn"**  
→ **Essential Bundle** - Get the basics right

**"I make YouTube videos and need summaries"**  
→ **Content Bundle** - Perfect for creators

**"I want to build custom skills for my team"**  
→ **Developer Bundle** or **Essential Bundle** first

**"I want everything!"**  
→ **All Bundle** - No compromises

**"I want to learn and create"**  
→ **Essential Bundle** first, then add **Content** later

---

## 🔄 Switching Bundles

You can always change bundles:

```bash
# Install additional skills from another bundle
npx claude-superskills install youtube-summarizer -y

# Or install another bundle
npx claude-superskills --bundle content -y
```

Bundles can be mixed and matched - there's no lock-in.

---

## 📥 Manual Bundle Installation

If you prefer to install individual skills:

```bash
# Install single skill
npx claude-superskills install skill-creator

# Install multiple skills
npx claude-superskills install skill-creator prompt-engineer youtube-summarizer

# Install with flags
npx claude-superskills i skill-creator -a -y -q
```

---

## 🔍 View Available Bundles

See all bundles anytime:

```bash
npx claude-superskills --list-bundles
```

---

## 💡 Bundle Tips

### Keep It Light
- Start with **Essential** and add as needed
- Bundles are additive - you can install more later
- Each skill is independent

### Save Storage
- Content Bundle is larger (requires Python deps)
- Essential Bundle is very lightweight
- Developer Bundle is medium-sized

### Team Recommendations
- **Startups:** Essential + Content = ~4MB
- **Agencies:** All Bundle = ~8MB
- **Enterprises:** All + Custom Skills

---

## 🔗 Related Documentation

- **[Getting Started](../guides/getting-started.md)** - First steps with skills
- **[Complete Skills Catalog](../../CATALOG.md)** - All skills listed
- **[Skill Anatomy](../guides/skill-anatomy.md)** - How skills work internally
- **[Main README](../../README.md)** - Project overview

---

**Ready to get started? Choose your bundle above! 🚀**
