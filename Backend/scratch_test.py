import os
import sys
from pathlib import Path

# Add the project root to sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Load environment variables
from dotenv import load_dotenv
load_dotenv(os.path.join(BASE_DIR, '.env'))

from functions.ai_fallback import generate_route_analysis

def test_api():
    print("Testing NVIDIA API connection...")
    source = "Chennai"
    destination = "Coimbatore"
    data, error = generate_route_analysis(source, destination)
    
    if error:
        print(f"FAILED: {error}")
    else:
        print("SUCCESS!")
        print(f"Data keys: {data.keys()}")
        if 'dashboard_data' in data:
            print("dashboard_data found!")
        else:
            print("WARNING: dashboard_data NOT found in response.")

if __name__ == "__main__":
    test_api()
