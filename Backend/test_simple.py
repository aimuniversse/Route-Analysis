import os
import requests
from dotenv import load_dotenv

load_dotenv()

def test_simple_api():
    api_key = os.getenv("NVIDIA_API_KEY")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "meta/llama-3.1-8b-instruct", # Try smaller model
        "messages": [{"role": "user", "content": "Hello, respond with JSON: {'status': 'ok'}"}],
        "temperature": 0.1,
        "max_tokens": 50
    }
    try:
        response = requests.post(
            "https://integrate.api.nvidia.com/v1/chat/completions", 
            headers=headers, 
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        print(response.json()['choices'][0]['message']['content'])
    except Exception as e:
        print(f"Simple API Test Failed: {e}")

if __name__ == "__main__":
    test_simple_api()
