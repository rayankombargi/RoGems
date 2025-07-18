from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import Experience, DailyExperience
import random

class Command(BaseCommand):
    help = 'Generate daily experiences for all users'

    def handle(self, *args, **options):
        current_date = timezone.now().date()

        experiences = Experience.objects.all()
        daily_experiences = DailyExperience.objects.all()
        if experiences.exists():
            if experiences.count() >= 5 and experiences.count() <= 10:
                DailyExperience.objects.all().delete()
                i = 1
                while DailyExperience.objects.count() < 5:
                    exp = random.choice(experiences)
                    if exp.id not in [de.experience.id for de in daily_experiences]:
                        DailyExperience.objects.create(
                            id=i,
                            experience=exp,
                        )
                        i += 1
            elif experiences.count() > 10:
                current_daily = list(daily_experiences)
                DailyExperience.objects.all().delete()
                i = 1
                while DailyExperience.objects.count() < 5:
                    exp = random.choice(experiences)
                    if exp.id not in [de.experience.id for de in current_daily]:
                        if exp.id not in [de.experience.id for de in DailyExperience.objects.all()]:
                            DailyExperience.objects.create(
                                id=i,
                                experience=exp,
                            )
                            i += 1
            else:
                DailyExperience.objects.all().delete()
                i = 1
                for exp in experiences:
                    DailyExperience.objects.create(
                        id=i,
                        experience=exp,
                    )
                    i += 1
            self.stdout.write(self.style.SUCCESS(f'Successfully generated daily experiences for {current_date}'))
        else:
            self.stdout.write(self.style.WARNING('No experiences available to generate daily experiences.'))