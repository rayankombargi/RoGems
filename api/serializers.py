from .models import Experience, Category, SubCategory, DailyExperience, WeeklyExperience
from rest_framework.serializers import ModelSerializer

class ExperienceSerializer(ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'

class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SubCategorySerializer(ModelSerializer):
    class Meta:
        model = SubCategory
        fields = '__all__'

class DailyExperienceSerializer(ModelSerializer):
    class Meta:
        model = DailyExperience
        fields = '__all__'

class WeeklyExperienceSerializer(ModelSerializer):
    class Meta:
        model = WeeklyExperience
        fields = '__all__'

