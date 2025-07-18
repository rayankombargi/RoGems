#!/usr/bin/env python3
"""
Simple health check script for deployment debugging
"""
import os
import sys
import time
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_environment():
    """Check critical environment variables"""
    logger.info("Checking environment variables...")
    
    required_vars = ['DATABASE_URL', 'SECRET_KEY']
    for var in required_vars:
        if os.environ.get(var):
            logger.info(f"✅ {var} is set")
        else:
            logger.error(f"❌ {var} is missing")
            return False
    
    logger.info(f"DEBUG: {os.environ.get('DEBUG', 'True')}")
    logger.info(f"PORT: {os.environ.get('PORT', '8000')}")
    return True

def check_django_setup():
    """Check Django setup"""
    logger.info("Setting up Django...")
    
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'RobloxExperienceFinder.settings')
        import django
        django.setup()
        logger.info("✅ Django setup successful")
        return True
    except Exception as e:
        logger.error(f"❌ Django setup failed: {e}")
        return False

def check_database():
    """Check database connection"""
    logger.info("Checking database connection...")
    
    try:
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        logger.info("✅ Database connection successful")
        return True
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        return False

def check_memory():
    """Check memory usage"""
    logger.info("Checking memory usage...")
    
    try:
        import psutil
        process = psutil.Process(os.getpid())
        memory_info = process.memory_info()
        logger.info(f"Memory usage: {memory_info.rss / 1024 / 1024:.2f} MB")
        return True
    except ImportError:
        logger.info("psutil not available, skipping memory check")
        return True
    except Exception as e:
        logger.error(f"Memory check failed: {e}")
        return False

def main():
    """Run all health checks"""
    logger.info("🔍 Starting health check...")
    
    checks = [
        ("Environment", check_environment),
        ("Django Setup", check_django_setup),
        ("Database", check_database),
        ("Memory", check_memory),
    ]
    
    results = []
    for name, check_func in checks:
        logger.info(f"Running {name} check...")
        start_time = time.time()
        result = check_func()
        end_time = time.time()
        logger.info(f"{name} check completed in {end_time - start_time:.2f}s")
        results.append(result)
    
    if all(results):
        logger.info("🎉 All health checks passed!")
        return True
    else:
        logger.error("⚠️ Some health checks failed!")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
