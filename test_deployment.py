#!/usr/bin/env python3
"""
Test script to check deployment readiness
"""
import os
import sys
import django
from django.conf import settings

# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'RobloxExperienceFinder.settings')
django.setup()

def test_database_connection():
    """Test database connection"""
    try:
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_psycopg_import():
    """Test psycopg2 import"""
    try:
        import psycopg2
        print("✅ psycopg2 import successful")
        return True
    except ImportError as e:
        print(f"❌ psycopg2 import failed: {e}")
        return False

def test_environment_variables():
    """Test required environment variables"""
    required_vars = ['DATABASE_URL', 'SECRET_KEY']
    all_good = True
    
    for var in required_vars:
        if os.environ.get(var):
            print(f"✅ {var} is set")
        else:
            print(f"❌ {var} is missing")
            all_good = False
    
    return all_good

def test_static_files():
    """Test static files configuration"""
    try:
        from django.contrib.staticfiles.finders import find
        from django.conf import settings
        
        print(f"✅ STATIC_URL: {settings.STATIC_URL}")
        print(f"✅ STATIC_ROOT: {settings.STATIC_ROOT}")
        print(f"✅ STATICFILES_DIRS: {settings.STATICFILES_DIRS}")
        return True
    except Exception as e:
        print(f"❌ Static files configuration error: {e}")
        return False

def main():
    print("🔍 Testing deployment readiness...\n")
    
    tests = [
        ("Environment Variables", test_environment_variables),
        ("psycopg2 Import", test_psycopg_import),
        ("Database Connection", test_database_connection),
        ("Static Files", test_static_files),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"Testing {test_name}...")
        result = test_func()
        results.append(result)
        print()
    
    if all(results):
        print("🎉 All tests passed! Ready for deployment.")
        return True
    else:
        print("⚠️  Some tests failed. Please fix the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
