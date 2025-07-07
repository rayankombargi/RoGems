from django.shortcuts import render
from .models import Experience, Category, SubCategory, DailyExperience, WeeklyExperience, ExperienceRequest, Admin
from .serializers import ExperienceSerializer, CategorySerializer, SubCategorySerializer, DailyExperienceSerializer, WeeklyExperienceSerializer, ExperienceRequestSerializer, AdminSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
import re
import requests

# from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
# from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.middleware.csrf import get_token
import json

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

@api_view(['PUT'])
def update_experience(request, pk):
    try:
        experience = Experience.objects.get(pk=pk)
        serializer = ExperienceSerializer(experience, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
    except Experience.DoesNotExist:
        return Response({"error": "Experience not found"}, status=404)

@api_view(['DELETE'])
def delete_experience(request, pk):
    try:
        experience = Experience.objects.get(pk=pk)
        experience.delete()
        return Response({"message": "Experience deleted successfully"}, status=204)
    except Experience.DoesNotExist:
        return Response({"error": "Experience not found"}, status=404)

# Category Table

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

# Subcategory Table

@api_view(['GET'])
def get_subcategories(request):
    subcategories = SubCategory.objects.all()
    serializer = SubCategorySerializer(subcategories, many=True)
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

# Experience Request Table

@api_view(['GET'])
def get_experience_requests(request):
    requests = ExperienceRequest.objects.all()
    serializer = ExperienceRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_experience_request(request):
    serializer = ExperienceRequestSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
def delete_experience_request(request, pk):
    try:
        request_instance = ExperienceRequest.objects.get(pk=pk)
        request_instance.delete()
        return Response({"message": "Experience request deleted successfully"}, status=204)
    except ExperienceRequest.DoesNotExist:
        return Response({"error": "Experience request not found"}, status=404)
    
# Admin Table

@api_view(['GET'])
def get_current_admin(request):
    admin_id = request.session.get('admin_id')
    if not admin_id:
        return Response({"error": "Not Autenticated"}, status=401)
    
    try:
        admin = Admin.objects.get(pk=admin_id)
        serializer = AdminSerializer(admin)
        return Response(serializer.data)
    except Admin.DoesNotExist:
        return Response({"error": "Admin not found"}, status=404)

@api_view(['GET'])
def get_admins(request):
    admins = Admin.objects.all()
    serializer = AdminSerializer(admins, many=True)
    return serializer.data

@api_view(['POST'])
def add_admin(request):
    serializer = AdminSerializer(data = request.data)
    if (serializer.is_valid):
        serializer.save
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
def update_admin(request, pk):
    try:
        admin = Admin.objects.get(pk=pk)
        newPassword = request.data.get('password')
        if newPassword:
            data = request.data.copy()
            data['password'] = make_password(newPassword)
            serializer = AdminSerializer(admin, data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            else:
                return Response(serializer.errors, status=400)
        else:
            data = request.data.copy()
            data['password'] = admin.password
            serializer = AdminSerializer(admin, data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            else:
                return Response(serializer.errors, status=400)
    except Admin.DoesNotExist:
        return Response({"error": "Admin not found"}, status=404)
    
@api_view(['DELETE'])
def delete_admin(request, pk):
    try:
        admin = Admin.objects.get(pk=pk)
        admin.delete()
        return Response({"message": "Admin deleted successfully"}, status=204)
    except Admin.DoesNotExist:
        return Response({"message":"Admin not found"}, status=404)

# Login and Logout

@api_view(['POST'])
@csrf_exempt
def login_admin(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    try:
        admin = Admin.objects.get(username=username)
        if check_password(password, admin.password):
            request.session['admin_id'] = admin.id
            return JsonResponse({"message": "Login successful", 'username': admin.username}, status=200)
        else:
            return JsonResponse({"message": "Invalid credentials"}, status=401)
    except Admin.DoesNotExist:
        return JsonResponse({"message": "Admin not found"}, status=404)

@api_view(['GET'])
@csrf_exempt
def logout_admin(request):
    request.session.flush()
    return JsonResponse({"message": "Logout successful"}, status=200)

@api_view(['POST'])
@csrf_exempt
def verify_admin_password(request, pk):
    data = json.loads(request.body)
    currPass = data.get('currPass')
    try:
        admin = Admin.objects.get(pk=pk)
        if check_password(currPass, admin.password):
            return JsonResponse({"message": "Password is correct"}, status=200)
        return JsonResponse({"message": "Incorrect password"}, status=401)
    except Admin.DoesNotExist:
        return JsonResponse({"message": "Admin not found"}, status=404)


@api_view(['GET'])
def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token}, status=200)