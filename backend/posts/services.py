import requests
from django.conf import settings

HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1"
HUGGINGFACE_API_TOKEN = settings.HUGGINGFACE_API_TOKEN

def generate_image_from_title(title):
    """
    Funkcja generuje obraz na podstawie tytułu, korzystając z Hugging Face API.
    """
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"
    }
    payload = {
        "inputs": title,
    }

    response = requests.post(HUGGINGFACE_API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        return response.content  # Zwracamy binarny obraz
    else:
        raise Exception(f"Failed to generate image: {response.text}")
