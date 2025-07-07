from .models import Experience, Category, SubCategory, DailyExperience, WeeklyExperience, ExperienceRequest, Admin
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

class ExperienceRequestSerializer(ModelSerializer):
    class Meta:
        model = ExperienceRequest
        fields = ('__all__')

class AdminSerializer(ModelSerializer):
    class Meta:
        model = Admin
        fields = ('__all__')