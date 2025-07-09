#!/bin/bash

# Configuration
EMOJI_DIR="./public/emoji"
MAX_VARIANTS=6
EXCEPTIONS=("1f557") # Clock emojis - add more exceptions here

# Skin tone modifiers to prioritize
SKIN_TONES=("1f3fb" "1f3fc" "1f3fd" "1f3fe" "1f3ff" "10160a")

# Check if dry run mode is enabled
DRY_RUN=0
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=1
  echo "Running in dry-run mode. No files will be deleted."
fi

# Function to check if a file is in the exceptions list
is_exception() {
  local filename="$1"
  for exception in "${EXCEPTIONS[@]}"; do
    if [[ "$filename" == $exception* ]]; then
      return 0 # True - it is an exception
    fi
  done
  return 1 # False - not an exception
}

# Function to check if a file contains a skin tone modifier
has_skin_tone() {
  local filename="$1"
  for tone in "${SKIN_TONES[@]}"; do
    if [[ "$filename" == *"-$tone"* || "$filename" == *"-$tone-"* ]]; then
      return 0 # True - has a skin tone
    fi
  done
  return 1 # False - no skin tone
}

# Function to extract hex value for sorting
extract_sort_key() {
  local filename="$1"
  # Remove .webp extension
  local without_ext="${filename%.webp}"
  echo "$without_ext"
}

# Make sure the emoji directory exists
if [[ ! -d "$EMOJI_DIR" ]]; then
  echo "Error: Emoji directory $EMOJI_DIR not found"
  exit 1
fi

# Track counts
kept_count=0
deleted_count=0

# Process files with dashes (emoji variants)
process_emoji_group() {
  local base_name="$1"
  local files=("$@")
  # Remove the first argument (base_name) from the array
  files=("${files[@]:1}")
  
  if [[ ${#files[@]} -le $MAX_VARIANTS ]]; then
    echo "Keeping all ${#files[@]} variants of $base_name"
    ((kept_count += ${#files[@]}))
    return
  fi
  
  # Sort the files, prioritizing skin tone variants
  declare -a skin_tone_files
  declare -a other_files
  
  # First, separate skin tone variants from others
  for file in "${files[@]}"; do
    if has_skin_tone "$file"; then
      skin_tone_files+=("$file")
    else
      other_files+=("$file")
    fi
  done
  
  # Sort skin tone files to ensure consistent order
  IFS=$'\n' sorted_skin_files=($(sort <<<"${skin_tone_files[*]}"))
  unset IFS
  
  # Sort other files
  IFS=$'\n' sorted_other_files=($(sort <<<"${other_files[*]}"))
  unset IFS
  
  # Combine with skin tones first, then others
  declare -a sorted_files=("${sorted_skin_files[@]}" "${sorted_other_files[@]}")
  
  # Keep the first MAX_VARIANTS
  to_keep=("${sorted_files[@]:0:$MAX_VARIANTS}")
  to_delete=("${sorted_files[@]:$MAX_VARIANTS}")
  
  echo "Keeping ${#to_keep[@]} variants of $base_name: ${to_keep[*]}"
  echo "Deleting ${#to_delete[@]} variants of $base_name: ${to_delete[*]}"
  
  ((kept_count += ${#to_keep[@]}))
  ((deleted_count += ${#to_delete[@]}))
  
  # Delete the excess variants
  for file in "${to_delete[@]}"; do
    if [[ $DRY_RUN -eq 1 ]]; then
      echo "Would delete: $EMOJI_DIR/$file (dry run)"
    else
      rm -f "$EMOJI_DIR/$file"
      echo "Deleted: $file"
    fi
  done
}

# Temporary file to hold grouped emojis
temp_file=$(mktemp)
trap 'rm -f "$temp_file"' EXIT

# Group the emoji files by their base name (before the first dash)
find "$EMOJI_DIR" -name "*-*.webp" | while read -r file; do
  filename=$(basename "$file")
  
  # Skip exceptions
  if is_exception "$filename"; then
    echo "Keeping exception: $filename"
    ((kept_count++))
    continue
  fi
  
  # Extract the base name (everything up to the first dash)
  base_name=$(echo "$filename" | cut -d'-' -f1)
  
  # Append to the temp file: base_name|filename
  echo "$base_name|$filename" >> "$temp_file"
done

# Process each group
if [[ -s "$temp_file" ]]; then
  # First sort by base_name to group them
  sort -t'|' -k1 "$temp_file" > "${temp_file}.sorted"
  mv "${temp_file}.sorted" "$temp_file"
  
  # Process each group
  current_base=""
  declare -a current_files
  
  while IFS='|' read -r base_name filename; do
    if [[ "$base_name" != "$current_base" && -n "$current_base" ]]; then
      # Process the previous group
      process_emoji_group "$current_base" "${current_files[@]}"
      # Start a new group
      current_files=()
    fi
    
    current_base="$base_name"
    current_files+=("$filename")
  done < "$temp_file"
  
  # Process the last group
  if [[ -n "$current_base" ]]; then
    process_emoji_group "$current_base" "${current_files[@]}"
  fi
fi

# Print summary
echo
echo "Summary:"
echo "Kept: $kept_count emoji variants"
echo "Deleted: $deleted_count emoji variants" 