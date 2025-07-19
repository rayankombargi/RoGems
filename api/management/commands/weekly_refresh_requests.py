from django.core.management.base import BaseCommand
from api.models import ExperienceRequest
from django.utils import timezone
from datetime import timedelta

class Command(BaseCommand):
    help = "Refresh weekly experience requests"

    def handle(self, *args, **options):
        current_date = timezone.now().date()
        if ExperienceRequest.objects.exists():
            for exp in ExperienceRequest.objects.filter(created_at__lte=current_date - timedelta(days=7)):
                exp.delete()
            self.stdout.write(self.style.SUCCESS("All weekly experience requests have been deleted."))
        else:
            self.stdout.write(self.style.WARNING("No weekly experience requests found to delete."))