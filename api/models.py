from django.db import models
from django.utils import timezone

# Create your models here.

class Experience(models.Model):
    rootPlaceId = models.BigIntegerField(unique=True, default=0)
    name = models.CharField(max_length=255)
    url = models.URLField()
    creator = models.CharField(max_length=20, default="Unknown")
    description = models.TextField(null=True, blank=True)
    genre = models.CharField(max_length=255, default="All")
    genre_l1 = models.CharField(max_length=255, null=True, blank=True)
    genre_l2 = models.CharField(max_length=255, null=True, blank=True)
    maxPlayers = models.IntegerField(default=0)
    created = models.DateTimeField(default=timezone.now)
    added = models.DateTimeField(null=True, default=timezone.now)

    icon = models.URLField()

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=255, default="All")

    def __str__(self):
        return self.name
    
class SubCategory(models.Model):
    name = models.CharField(max_length=255, default="All")
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    

class DailyExperience(models.Model):
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE)

    def _str_(self):
        return self.experience.name
    
class WeeklyExperience(models.Model):
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE)

    def _str_(self):
        return self.experience.name
    
class ExperienceRequest(models.Model):
    experience_url = models.URLField(unique=True, null=False, blank=False, default="")
    username = models.CharField(max_length=255, blank=True, default="Anonymous")
    created_at = models.DateTimeField(null=True, default=timezone.now)

class Admin(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.username