import os
import json
import requests
from django.utils import timezone

def generate_route_analysis(source, destination, via=None):
    """
    Calls the NVIDIA API to generate a HIGH-ACCURACY, REALISTIC, and STRICTLY STRUCTURED 
    Route Analysis JSON response as a Senior Transportation Data Engineer.
    """
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        return None, "NVIDIA_API_KEY is not set in the environment variables."

    # Prompt definition based on Senior Transportation Data Engineer requirements
    prompt = f"""
You are a Senior Transportation Data Engineer and AI Data Validator.
Generate a HIGH-ACCURACY, REALISTIC, and STRICTLY STRUCTURED Route Analysis for: {source} to {destination}{f' via {via}' if via else ''}.

CORE OBJECTIVE:
Transform this request into a production-grade transport analytics dataset with realistic Indian geography-based models.

HARD RULES:
1. ALL percentages MUST sum exactly to 100.
2. NO fake small populations. Use realistic metro values (e.g., Chennai ~8M-12M, Coimbatore ~2M-4M, Tier-2 cities scaled realistically).
3. Demand Distribution MUST include TOP 3 STATES only, with exactly 5 cities per state. Balanced weighting.
4. Transport Distribution MUST reflect real-world usage (Bus: 40-65%, Train: 20-35%, others minimal). MUST sum to 100.
5. Logistics MUST be percentage-based only (NO company names). MUST sum to 100.
6. Distance MUST show ONLY SOURCE → DESTINATION total distance (No segment breakdowns).
7. Transport Schedule MUST show ONLY DIRECT SOURCE → DESTINATION trips. Realistic frequency: Bus 80-300/day, Train 10-40/day.
8. Area Segmentation: Max 5 meaningful entries per category. Format: "Entity Name (City Name)".
9. RETURN ONLY CLEAN JSON. NO explanation, NO markdown, NO comments.

OUTPUT STRUCTURE:
{{
"status": "success",
"data_source": "ai_generated",
"data": {{
"route_summary": {{
  "path": ["string"],
  "total_distance_km": number,
  "estimated_time_hours": number
}},
"population_data": {{
  "source": {{ "name": "string", "population": number }},
  "destination": {{ "name": "string", "population": number }},
  "via": {{ "name": "string", "population": number }}
}},
"area_segmentation": {{
  "starting_point": "string",
  "final_destination": "string",
  "important_stops": ["string"],
  "job_business_areas": ["string"],
  "student_areas": ["string"],
  "tourist_places": ["string"]
}},
"visitor_data": {{
  "source": {{ "yearly_total": number, "daily_normal": number, "daily_peak": number }},
  "destination": {{ "yearly_total": number, "daily_normal": number, "daily_peak": number }}
}},
"demand_distribution": [
  {{
    "state": "string",
    "percentage": number,
    "top_cities": [
      {{ "name": "string", "percentage": number, "visitor_count": number }},
      {{ "name": "string", "percentage": number, "visitor_count": number }},
      {{ "name": "string", "percentage": number, "visitor_count": number }},
      {{ "name": "string", "percentage": number, "visitor_count": number }},
      {{ "name": "string", "percentage": number, "visitor_count": number }}
    ]
  }}
],
"distance_details": {{
  "from": "string",
  "to": "string",
  "distance_km": number
}},
"transport_distribution": {{
  "bus": number,
  "train": number,
  "car": number,
  "taxi": number,
  "flight": number
}},
"logistics_services": {{
  "bus": number,
  "train": number,
  "courier": number,
  "taxi": number
}},
"transport_schedule": [
  {{ "from": "string", "to": "string", "type": "bus | train", "trips_per_day": number }}
]
}}
}}
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
        "max_tokens": 4096
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
        
        # Extract JSON from potential conversational filler
        start_index = content.find('{')
        end_index = content.rfind('}')
        
        if start_index != -1 and end_index != -1:
            json_content = content[start_index:end_index+1]
            try:
                parsed_json = json.loads(json_content)
                return parsed_json, None
            except json.JSONDecodeError:
                # If extraction failed, fall back to stripping markdown
                pass

        # Original cleanup logic as fallback
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
            
        if content.endswith("```"):
            content = content[:-3]
            
        parsed_json = json.loads(content.strip())
        return parsed_json, None

    except requests.exceptions.Timeout:
        print("API Error: Request timed out")
        return None, "Unable to fetch route analysis at the moment (request timed out)"
    except requests.exceptions.RequestException as e:
        error_msg = "Unable to fetch route analysis at the moment"
        print(f"API Error: {str(e)}") 
        if hasattr(e, 'response') and e.response is not None:
            print(f"API Response Body: {e.response.text}")
        return None, error_msg
    except json.JSONDecodeError as e:
        import traceback
        with open('django_error.log', 'a', encoding='utf-8') as f:
            f.write(f"\n--- JSON DECODE ERROR AT {timezone.now()} ---\n")
            f.write(f"Error: {str(e)}\n")
            f.write(f"Raw Content: {content}\n")
            f.write("------------------------------\n")
        return None, "Unable to fetch route analysis at the moment (invalid response format)"
    except Exception as e:
        import traceback
        print(f"Unexpected Error: {str(e)}")
        traceback.print_exc()
        return None, "Unable to fetch route analysis at the moment"
