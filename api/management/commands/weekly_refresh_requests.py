from django.core.management.base import BaseCommand
from api.models import ExperienceRequest
from django.utils import timezone

class Command(BaseCommand):
    help = "Refresh weekly experience requests"

    def handle(self, *args, **options):
        current_date = timezone.now().date()
        if ExperienceRequest.objects.exists():
            ExperienceRequest.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("All weekly experience requests have been deleted."))
        else:
            self.stdout.write(self.style.WARNING("No weekly experience requests found to delete."))