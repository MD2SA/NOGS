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
MAX_WPM = 350
MAX_TIME_SECONDS = 600
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

def generate_phrase(mode=None,time_seconds=None,word_count=None):
    from type.models import Game # evitar loop de import
    time_seconds = validate_input(time_seconds, MAX_TIME_SECONDS)
    word_count = validate_input(word_count, MAX_WORD_COUNT) or DEFAULT_WORD_COUNT
    if mode == Game.MODE_WORDS or time_seconds is None:
        phrase = generate_words(word_count)
    else:
        estimated_words = int((time_seconds / 60) * MAX_WPM)
        phrase = generate_words(estimated_words)
    return phrase