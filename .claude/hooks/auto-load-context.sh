#!/bin/bash
# Auto-load context files when reading source files
# Loads both file-level (.ctx.yml) and folder-level (ctx.yml) contexts

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Exit if no file_path or if it's null
if [ -z "$file_path" ] || [ "$file_path" = "null" ]; then
  exit 0
fi

# Exit if file doesn't exist
if [ ! -f "$file_path" ]; then
  exit 0
fi

# Extract directory and filename info
dir_path=$(dirname "$file_path")
base_name=$(basename "$file_path")
name_without_ext="${base_name%.*}"

# 1. File-level context: {filename}.ctx.yml
file_ctx="${dir_path}/${name_without_ext}.ctx.yml"

# 2. Folder-level context: ctx.yml
folder_ctx="${dir_path}/ctx.yml"

loaded=false

# Load file-level context if exists
if [ -f "$file_ctx" ]; then
  echo ""
  echo "📋 File context loaded from: ${file_ctx#$PWD/}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  cat "$file_ctx"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  loaded=true
fi

# Load folder-level context if exists
if [ -f "$folder_ctx" ]; then
  echo ""
  echo "📁 Folder context loaded from: ${folder_ctx#$PWD/}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  cat "$folder_ctx"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  loaded=true
fi

# Silent exit if no context found
exit 0