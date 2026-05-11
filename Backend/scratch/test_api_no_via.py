import requests
import json

url = "http://localhost:8000/api/route-analysis/"
data = {
    "source": "Chennai",
    "destination": "Coimbatore",
    "via": ""
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
