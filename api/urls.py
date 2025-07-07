from django.urls import path
from .views import  (
    get_experiences, 
    fetch_experience_data, 
    add_experience, 
    update_experience,
    delete_experience,
    get_categories,
    get_subcategories,
    get_daily_experiences,
    get_weekly_experiences,
    add_daily_experience,
    add_weekly_experience,
    get_experience_requests,
    add_experience_request,
    delete_experience_request,
    get_current_admin,
    get_admins,
    add_admin,
    update_admin,
    delete_admin,
    login_admin,
    logout_admin,
    verify_admin_password,
    get_csrf_token,
)

urlpatterns = [
    # Experience Views
    path('experiences/fetch_experiences/', get_experiences, name='get_experiences'),
    path('experiences/fetch_data/', fetch_experience_data, name='fetch_experience_data'),
    path('experiences/insert/', add_experience, name='add_experience'),
    path('experiences/update/<int:pk>/', update_experience, name='update_experience'),
    path('experiences/delete/<int:pk>/', delete_experience, name='delete_experience'),
    # Category Views
    path('categories/fetch_categories/', get_categories, name='get_categories'),
    # Subcategory Views
    path('categories/fetch_subcategories/', get_subcategories, name='get_subcategories'),
    # Daily Experience Views
    path('experiences/fetch_daily_experiences/', get_daily_experiences, name='get_daily_experiences'),
    path('experiences/insert_daily_experience/', add_daily_experience, name='add_daily_experience'),
    # Weekly Experience Views
    path('experiences/fetch_weekly_experiences/', get_weekly_experiences, name='get_weekly_experiences'),
    path('experiences/insert_weekly_experience/', add_weekly_experience, name='add_weekly_experience'),
    # Experience Request Views
    path('requests/fetch_experience_requests/', get_experience_requests, name='get_experience_requests'),
    path('requests/insert_experience_request/', add_experience_request, name='add_experience_request'),
    path('requests/delete_experience_request/<int:pk>/', delete_experience_request, name='delete_experience_request'),
    # Admin Views
    path('admins/get_current_admin/', get_current_admin, name='get_current_admin'),
    path('admins/fetch_admins/', get_admins, name='get_admins'),
    path('admins/insert_admin/', add_admin, name='add_admin'),
    path('admins/update_admin/<int:pk>/', update_admin, name='update_admin'),
    path('admins/delete_admin/<int:pk>/', delete_admin, name='delete_admin'),
    # Authentication Views
    path('auth/login/', login_admin, name='login_admin'),
    path('auth/logout/', logout_admin, name='logout_admin'),
    path('auth/verify_admin_password/<int:pk>/', verify_admin_password, name='verify_admin_password'),
    path('auth/get_csrf_token/', get_csrf_token, name='get_csrf_token'),
]