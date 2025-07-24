"""
URL configuration for RobloxExperienceFinder project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.http import FileResponse
import os

def favicon_view(request):
    """favicon from React build directory"""
    favicon_path = os.path.join(settings.BASE_DIR, 'frontend/build/favicon.ico')
    if os.path.exists(favicon_path):
        return FileResponse(open(favicon_path, 'rb'), content_type='image/x-icon')
    png_path = os.path.join(settings.BASE_DIR, 'frontend/build/RoGems.png')
    return FileResponse(open(png_path, 'rb'), content_type='image/png')

def serve_image(request, image_name):
    """Serve images from build/images directory"""
    image_path = os.path.join(settings.BASE_DIR, 'frontend/build/images', image_name)
    if os.path.exists(image_path):
        # Determine content type based on file extension
        if image_name.endswith('.webp'):
            content_type = 'image/webp'
        elif image_name.endswith('.png'):
            content_type = 'image/png'
        elif image_name.endswith('.jpg') or image_name.endswith('.jpeg'):
            content_type = 'image/jpeg'
        else:
            content_type = 'application/octet-stream'
        
        return FileResponse(open(image_path, 'rb'), content_type=content_type)
    else:
        from django.http import Http404
        raise Http404("Image not found")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('favicon.ico', favicon_view, name='favicon'),
    path('images/<str:image_name>', serve_image, name='serve_image'),
    re_path(r'^(?!static/).*$', TemplateView.as_view(template_name='index.html')),
]
