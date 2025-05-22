from django.urls import path
from .views import  (
    get_experiences, 
    fetch_experience_data, 
    add_experience, 
    get_categories,
    get_daily_experiences,
    get_weekly_experiences,
    add_daily_experience,
    add_weekly_experience)

urlpatterns = [
    # Experience Views
    path('experiences/fetch_experiences/', get_experiences, name='get_experiences'),
    path('experiences/fetch_data/', fetch_experience_data, name='fetch_experience_data'),
    path('experiences/insert/', add_experience, name='add_experience'),
    # Category Views
    path('categories/fetch_categories/', get_categories, name='get_categories'),
    # Daily Experience Views
    path('experiences/fetch_daily_experiences/', get_daily_experiences, name='get_daily_experiences'),
    path('experiences/insert_daily_experience/', add_daily_experience, name='add_daily_experience'),
    # Weekly Experience Views
    path('experiences/fetch_weekly_experiences/', get_weekly_experiences, name='get_weekly_experiences'),
    path('experiences/insert_weekly_experience/', add_weekly_experience, name='add_weekly_experience'),
]