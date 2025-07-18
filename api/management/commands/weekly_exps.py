from django.core.management.base import BaseCommand
from api.models import Experience, WeeklyExperience
from django.utils import timezone
import random

class Command(BaseCommand):
    help = "Generates weekly experience reports"

    def handle(self, *args, **options):

        experiences = Experience.objects.all()
        WeeklyExperiences = WeeklyExperience.objects.all()
        if experiences.exists():
            if (experiences.count() >= 5 and experiences.count() <= 10):
                WeeklyExperience.objects.all().delete()
                i = 1
                while WeeklyExperience.objects.count() < 5:
                    exp = random.choice(experiences)
                    if exp.id not in (we.experience.id for we in WeeklyExperience.objects.all()):
                        WeeklyExperience.objects.create(
                            id=i,
                            experience=exp,
                        )
                        i += 1
            elif experiences.count() > 10:
                current_weekly = list(WeeklyExperiences)
                WeeklyExperience.objects.all().delete()
                i = 1
                while WeeklyExperience.objects.count() < 5:
                    exp = random.choice(experiences)
                    if exp.id not in [we.experience for we in current_weekly]:
                        if exp.id not in [we.experience.id for we in WeeklyExperience.objects.all()]:
                            WeeklyExperience.objects.create(
                                id=i,
                                experience=exp,
                            )
                            i += 1
            else:
                WeeklyExperience.objects.all().delete()
                i = 1
                for exp in experiences:
                    WeeklyExperience.objects.create(
                        id=i,
                        experience=exp,
                    )
                    i += 1
            self.stdout.write(self.style.SUCCESS("Weekly experience reports generated successfully."))
        else:
            self.stdout.write(self.style.WARNING("No experiences found to generate weekly reports."))