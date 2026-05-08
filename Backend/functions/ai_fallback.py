import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

def generate_route_analysis(source, destination, via=None):
    """
    Calls the NVIDIA API to generate route analysis data in the expected JSON format.
    """
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        print("DEBUG: NVIDIA_API_KEY not found in environment.")
        return None, "NVIDIA_API_KEY is not set in the environment variables."

    # Prompt definition
    prompt = f"""
You are an expert transportation and logistics analyst. 
Generate a professional Route Analysis for: {source} to {destination}{f' via {via}' if via else ''}.

Return ONLY valid JSON. The JSON structure MUST follow this 10-point format exactly:

1. route_summary: {{ "path": "Source → Via → Destination", "total_distance": km_int, "estimated_time": hours_float }}
2. population_data: {{ "source": {{ "name": "Name", "count": int, "coordinates": {{ "lat": float, "lng": float }} }}, "destination": {{ "name": "Name", "count": int, "coordinates": {{ "lat": float, "lng": float }} }}, "via": {{ "name": "Name", "count": int, "coordinates": {{ "lat": float, "lng": float }} }} (optional) }}
3. area_segmentation: {{ 
      "job_business_areas": ["Top 3 diverse industries (e.g., 'City1 – IndustryA', 'City2 – IndustryB')"],
      "student_areas": ["Top 3 educational institutions representing at least 3 DIFFERENT cities"],
      "tourist_areas": ["Mix of temples, nature, and landmarks across the route"]
   }}
4. visitor_data: [ {{ "place_name": "Name", "yearly": int, "daily": int }} ]
5. demand_distribution: [ {{ 
      "state": "Name", 
      "percentage": float, 
      "cities": [ {{ "name": "Name", "percentage": float }} ] 
   }} ]
   - Ensure State percentages sum to 100% total.
   - Ensure City percentages sum to 100% within each state.
6. distance_details: [ {{ "segment": "City A → City B", "distance_km": int }} ]
7. transport_distribution: {{ "bus": float, "train": float, "car": float, "taxi": float, "flight": float }} (Total must be 100%)
8. logistics_services: {{ "parcel_movement": {{ "bus": float, "train": float, "courier": float, "taxi": float }}, "modes_used": ["List modes"] }} (Total percentage must be 100%)
9. transport_schedule: [ {{ "from": "{destination}", "to": "{source}", "bus_trips": int, "train_trips": int }} ] (Show ONLY the REVERSE route)
10. suggested_routes: [ {{ "option": int, "path": "Path String", "distance": int, "time": float }} ]
11. dashboard_data: {{
      "traffic_trends": [ {{ "time": "12 AM", "value": int }}, {{ "time": "4 AM", "value": int }}, {{ "time": "8 AM", "value": int }}, {{ "time": "12 PM", "value": int }}, {{ "time": "4 PM", "value": int }}, {{ "time": "8 PM", "value": int }} ],
      "travel_time_by_hour": [ {{ "hour": "12 AM", "minutes": int }}, {{ "hour": "6 AM", "minutes": int }}, {{ "hour": "12 PM", "minutes": int }}, {{ "hour": "6 PM", "minutes": int }} ],
      "live_updates": [ {{ "incident": "String", "severity": "Low"|"High", "time": "Just now" }} ],
      "weather": {{ "impact": "Low"|"High", "details": "Description" }},
      "area_potential": [ {{ "district": "String", "population": int, "potential_score": int, "business_potential": "High"|"Medium"|"Low", "growth_rate": float, "sectors": [ {{ "name": "String", "score": int }} ] }} ],
      "corridor_potential": {{ "business": int, "student": int, "tourist": int }}
    }}

DATA RULES:
- Use realistic, professional values.
- No leading zeros in numbers.
- No duplicate entries.
- Use proper capitalization and real-world names.
- Ensure all percentages sum correctly to 100.
- For coordinates: Use actual geographic coordinates (latitude, longitude) for Indian cities. Example: Chennai (13.0827, 80.2707), Bangalore (12.9716, 77.5946), Hyderabad (17.3850, 78.4867).
- Job/Business areas must show diversity across different cities on the route.
- Student areas must represent institutions from at least 3 different cities.
- Tourist areas must include a mix of temples, nature, and landmarks.
- Return ONLY the JSON object.
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "meta/llama-3.1-8b-instruct",
        "messages": [
            {"role": "system", "content": "You are a professional transportation data analyst. Provide consistent, deterministic JSON data."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1,
        "max_tokens": 1500
    }
    content = ""
    try:
        # Increased timeout to 90 seconds to allow for complex generations
        response = requests.post(
            "https://integrate.api.nvidia.com/v1/chat/completions", 
            headers=headers, 
            json=payload,
            timeout=180
        )
        response.raise_for_status()
        
        response_data = response.json()
        content = response_data['choices'][0]['message']['content'].strip()
        
        # Robust JSON extraction
        import re
        json_match = re.search(r'(\{.*\})', content, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            json_str = content

        try:
            parsed_json = json.loads(json_str)
            return parsed_json, None
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error. Raw content: {content}")
            return None, f"Invalid JSON format from AI: {str(e)}"

    except requests.exceptions.Timeout:
        return None, "NVIDIA API request timed out after 180 seconds."
    except requests.exceptions.RequestException as e:
        print(f"API Request Error: {str(e)}") 
        return None, f"API Connection Error: {str(e)}"
    except Exception as e:
        import traceback
        traceback.print_exc()
        return None, f"Unexpected error: {str(e)}"
