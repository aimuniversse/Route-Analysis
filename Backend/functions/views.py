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

from .models import (
    City, Route, Population, Potential, 
    Segmentation, Visitors, TopVisitors, 
    Distance, Transport, TransportDetail, 
    ParcelService, SuggestedRoute, RouteAnalysisCache
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

    # Validation
    if not source_name or not dest_name:
        return Response({
            "status": "error",
            "message": "Source and destination are required"
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        response_data, error = get_route_analysis_data(source_name, dest_name, via_name)
        if error:
            return Response({
                "status": "error",
                "message": error
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(response_data)

    except Exception as e:
        return Response({
            "status": "error",
            "message": f"Internal server error: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
