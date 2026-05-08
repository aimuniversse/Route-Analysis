from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Q
from collections import deque
import json
import re
from django.conf import settings

from .models import (
    ParcelService, SuggestedRoute, RouteAnalysisCache, PopularSearch
)
from .ai_fallback import generate_route_analysis
from django.utils import timezone
from datetime import timedelta

def extract_number(text, default=10):
    """Extracts a single number from a string (e.g., '20-50' -> 35, '20' -> 20)."""
    if not text:
        return default
    if isinstance(text, (int, float)):
        return int(text)
    
    # Find all numbers in the string
    nums = [int(n) for n in re.findall(r'\d+', str(text))]
    if len(nums) == 1:
        return nums[0]
    elif len(nums) >= 2:
        return sum(nums) // len(nums)  # Average of range
    return default

# Relational DB fetcher removed to prioritize real-time AI generation.


def get_route_analysis_data(source_name, dest_name, via_name):
    """
    ALWAYS fetches fresh data from NVIDIA API. 
    No database caching or fallback logic is used.
    """
    if not source_name or not dest_name:
        return None, "Source and destination cities are required."

    # Directly call the AI generation function
    ai_data, ai_error = generate_route_analysis(source_name, dest_name, via_name)
    
    if ai_data and not ai_error:
        # Success: Return in the specific 'data_source': 'nvidia_api' format
        return {
            "status": "success",
            "data_source": "nvidia_api",
            "data": ai_data
        }, None

    # Error: API failed or returned invalid data
    return None, ai_error or "Unable to fetch route analysis"


def index(request):
    source_name = request.GET.get("source", "").strip()
    dest_name = request.GET.get("destination", "").strip()
    via_name = request.GET.get("via", "").strip()

    context = {
        "source_input": source_name,
        "dest_input": dest_name,
        "via_input": via_name
    }

    if source_name and dest_name:
        try:
            data, error = get_route_analysis_data(source_name, dest_name, via_name)
            if error:
                context["error"] = error
            else:
                # Unpack the 'data' part for template rendering compatibility
                context.update(data["data"])
                context["data_source"] = data["data_source"]
                context["has_data"] = True
                context["raw_json"] = json.dumps(data, indent=2)
        except Exception as e:
            import traceback
            traceback.print_exc()
            context["error"] = "An internal server error occurred while analyzing the route."

    return render(request, 'index.html', context)


@api_view(['POST', 'GET'])
@permission_classes([permissions.AllowAny])
def analyze_route_api(request):
    """
    Django REST Framework API endpoint for React frontend.
    POST /api/route-analysis/
    """
    try:
        if request.method == "POST":
            # DRF's request.data handles both JSON and Form data automatically
            source_name = request.data.get("source", "").strip()
            dest_name = request.data.get("destination", "").strip()
            via_name = request.data.get("via", "").strip()
        else:
            # Handle GET for testing in browser
            source_name = request.query_params.get("source", "").strip()
            dest_name = request.query_params.get("destination", "").strip()
            via_name = request.query_params.get("via", "").strip()

        # Record the search (Safely)
        if source_name and dest_name:
            try:
                route_text = f"{source_name} -> {dest_name}"
                popular, created = PopularSearch.objects.get_or_create(route_text=route_text)
                if not created:
                    popular.search_count += 1
                    popular.save()
            except Exception as db_err:
                print(f"Database logging error (ignored): {db_err}")

        # Validation
        if not source_name or not dest_name:
            return Response({
                "status": "error",
                "message": "Source and destination are required"
            }, status=status.HTTP_400_BAD_REQUEST)

        response_data, error = get_route_analysis_data(source_name, dest_name, via_name)
        if error:
            print(f"AI API failed ({error}), returning mock fallback data.")
            # Mock Fallback Data to prevent 500 error
            mock_data = {
                "status": "success",
                "data_source": "mock_fallback",
                "data": {
                    "route_summary": { "path": f"{source_name} -> {dest_name}", "total_distance": 505, "estimated_time": 8.5 },
                    "population_data": { 
                        "source": { "name": source_name, "count": 8000000, "coordinates": { "lat": 13.0827, "lng": 80.2707 } },
                        "destination": { "name": dest_name, "count": 2000000, "coordinates": { "lat": 11.0026, "lng": 76.9969 } }
                    },
                    "area_segmentation": {
                        "job_business_areas": ["Manufacturing", "IT Services", "Textiles"],
                        "student_areas": ["Anna University", "PSG Tech", "NIT"],
                        "tourist_areas": ["Marina Beach", "Western Ghats"]
                    },
                    "visitor_data": [ { "place_name": "Major Landmark", "yearly": 1000000, "daily": 2700 } ],
                    "demand_distribution": [ { "state": "Tamil Nadu", "percentage": 100, "cities": [ { "name": source_name, "percentage": 60 }, { "name": dest_name, "percentage": 40 } ] } ],
                    "distance_details": [ { "segment": f"{source_name} -> {dest_name}", "distance_km": 505 } ],
                    "transport_distribution": { "bus": 40, "train": 30, "car": 20, "taxi": 5, "flight": 5 },
                    "logistics_services": { "parcel_movement": { "bus": 50, "train": 30, "courier": 20, "taxi": 0 }, "modes_used": ["Bus", "Train"] },
                    "transport_schedule": [ { "from": dest_name, "to": source_name, "bus_trips": 12, "train_trips": 4 } ],
                    "suggested_routes": [ { "option": 1, "path": "NH 544", "distance": 505, "time": 8.5 } ],
                    "dashboard_data": {
                        "traffic_trends": [ { "time": "8 AM", "value": 80 }, { "time": "12 PM", "value": 60 }, { "time": "6 PM", "value": 90 } ],
                        "travel_time_by_hour": [ { "hour": "8 AM", "minutes": 510 }, { "hour": "12 PM", "minutes": 480 } ],
                        "live_updates": [ { "incident": "Heavy Traffic", "severity": "Medium", "time": "Just now" } ],
                        "weather": { "impact": "Low", "details": "Clear skies" },
                        "area_potential": [ { "district": source_name, "population": 8000000, "potential_score": 95, "business_potential": "High", "growth_rate": 5.2, "sectors": [ { "name": "IT", "score": 90 } ] } ],
                        "corridor_potential": { "business": 85, "student": 70, "tourist": 60 }
                    }
                }
            }
            return Response(mock_data)
        
        return Response(response_data)

    except Exception as e:
        import traceback
<<<<<<< HEAD
        error_trace = traceback.format_exc()
        print(f"CRITICAL API ERROR:\n{error_trace}")
=======
        traceback.print_exc()
>>>>>>> 771eebd139687fb38169f080d4a74e9dff8f7394
        return Response({
            "status": "error",
            "message": f"Internal server error: {str(e)}",
            "debug_trace": error_trace if settings.DEBUG else None
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_popular_searches(request):
    """
    Returns the top 5 most searched routes.
    """
    popular = PopularSearch.objects.all()[:5]
    data = [p.route_text for p in popular]
    
    # Fallback if no searches recorded yet
    if not data:
        data = [
            "Bangalore -> Chennai",
            "Hyderabad -> Vijayawada",
            "Pune -> Mumbai",
            "Delhi -> Manali",
            "Ahmedabad -> Surat"
        ]
        
    return Response({
        "status": "success",
        "popular_searches": data
    })
