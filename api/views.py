from django.shortcuts import render
from .models import Experience, Category,  DailyExperience, WeeklyExperience
from .serializers import ExperienceSerializer, CategorySerializer, DailyExperienceSerializer, WeeklyExperienceSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
import re
import requests

# Create your views here.

# Experience Table

@api_view(['GET'])
def get_experiences(request):
    experiences = Experience.objects.all()
    serializer = ExperienceSerializer(experiences, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def fetch_experience_data(request):
    game_url = request.GET.get('url')
    if not game_url:
        return Response({"error": "URL parameter is required"}, status=400)
    
    match = re.search(r'/games/(\d+)', game_url)
    if not match:
        return Response({"error": "Invalid Roblox URL"}, status=404)
    
    place_id = match.group(1)

    try :
        universe_res = requests.get(f"https://apis.roblox.com/universes/v1/places/{place_id}/universe")
        universe_res.raise_for_status()
        universe_id = universe_res.json().get("universeId")

        game_info_res = requests.get(f"https://games.roblox.com/v1/games?universeIds={universe_id}")
        game_info_res.raise_for_status()
        game_data = game_info_res.json()["data"][0]

        icon_res = requests.get(f"https://thumbnails.roblox.com/v1/games/icons?universeIds={universe_id}&size=512x512&format=Png&isCircular=false")
        icon_res.raise_for_status()
        icon_data = icon_res.json()["data"][0]["imageUrl"]

        return Response({"game_data": game_data, "icon": icon_data}, status=200)
        
    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=500)
    except (KeyError, IndexError) as e:
        return Response({"error": f"Missing data: {e}"}, status=500)
    
@api_view(['POST'])
def add_experience(request):
    serializer = ExperienceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# Category Table

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

# Daily Experience Table

@api_view(['GET'])
def get_daily_experiences(request):
    daily_experiences = DailyExperience.objects.all()
    serializer = DailyExperienceSerializer(daily_experiences, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_daily_experience(request):
    serializer = DailyExperienceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# Weekly Experience Table

@api_view(['GET'])
def get_weekly_experiences(request):
    weekly_experiences = WeeklyExperience.objects.all()
    serializer = WeeklyExperienceSerializer(weekly_experiences, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_weekly_experience(request):
    serializer = WeeklyExperienceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)