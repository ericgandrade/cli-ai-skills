#!/bin/bash
# Script to verify version synchronization across platforms

echo "🔍 Verificando sincronização de versões entre plataformas..."
echo ""

get_version() {
  grep "^version:" "$1" 2>/dev/null | head -1 | sed 's/version: //' | tr -d ' '
}

ERRORS=0

for skill in skill-creator prompt-engineer youtube-summarizer audio-transcriber; do
  V_GH=$(get_version .github/skills/$skill/SKILL.md)
  V_CL=$(get_version .claude/skills/$skill/SKILL.md)
  V_CX=$(get_version .codex/skills/$skill/SKILL.md)
  
  if [ "$V_GH" = "$V_CL" ] && [ "$V_CL" = "$V_CX" ]; then
    echo "✅ $skill: $V_GH (sincronizado em .github, .claude, .codex)"
  else
    echo "❌ $skill: DESSINCRONIZADO"
    echo "   .github: $V_GH"
    echo "   .claude: $V_CL"
    echo "   .codex:  $V_CX"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✅ Todas as versões sincronizadas!"
  exit 0
else
  echo "❌ $ERRORS skill(s) com versões dessincronizadas"
  exit 1
fi
