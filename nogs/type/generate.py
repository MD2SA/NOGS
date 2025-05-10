import json
import random
from pathlib import Path
from django.conf import settings


def load_words_from_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return [w['englishWord'] for w in data.get('words', []) if w.get('englishWord')]
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"[load_words_from_file] Error: {e}")
        return []


word_file_path = Path(settings.BASE_DIR) / 'en.json'
DEFAULT_WORD_LIST = load_words_from_file(word_file_path)

DEFAULT_WORD_COUNT = 10
MAX_WORD_COUNT = 3500

def validate_input(value, max_value):
    try:
        if value is None:
            return None
        value = int(value)
        return value if DEFAULT_WORD_COUNT <= value <= max_value else None
    except (ValueError, TypeError):
        return None


def generate_words(count):
    if not DEFAULT_WORD_LIST:
        raise ValueError("Word list is empty or could not be loaded.")
    return ' '.join(random.choices(DEFAULT_WORD_LIST, k=count))

def generate_phrase(word_count):
    word_count = validate_input(word_count, MAX_WORD_COUNT) or DEFAULT_WORD_COUNT
    phrase = generate_words(word_count)
    return phrase