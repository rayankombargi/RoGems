import re

import requests
from django.core.management.base import BaseCommand, CommandError

from api.models import Experience


class Command(BaseCommand):
	help = 'Update all stored experiences with current Roblox metadata'

	def handle(self, *args, **options):
		experiences = Experience.objects.all()
		updated_count = 0
		failed_experiences = []

		for experience in experiences:
			try:
				self.update_experience(experience)
				updated_count += 1
				self.stdout.write(f'Updated experience: {experience.name}')
			except (KeyError, IndexError, ValueError, requests.RequestException) as error:
				failed_experiences.append(f'{experience.id} ({experience.name}): {error}')
				self.stderr.write(self.style.WARNING(
					f'Failed to update {experience.name}: {error}'
				))

		if failed_experiences:
			raise CommandError(
				f'Updated {updated_count} experience(s), but {len(failed_experiences)} failed.'
			)

		self.stdout.write(self.style.SUCCESS(
			f'Successfully updated {updated_count} experience(s).'
		))

	@staticmethod
	def update_experience(experience):
		match = re.search(r'/games/(\d+)', experience.url)
		if not match:
			raise ValueError('Invalid Roblox experience URL')

		place_id = match.group(1)
		universe_response = requests.get(
			f'https://apis.roblox.com/universes/v1/places/{place_id}/universe',
			timeout=30,
		)
		universe_response.raise_for_status()
		universe_id = universe_response.json()['universeId']

		game_response = requests.get(
			f'https://games.roblox.com/v1/games?universeIds={universe_id}',
			timeout=30,
		)
		game_response.raise_for_status()
		game_data = game_response.json()['data'][0]

		icon_response = requests.get(
			'https://thumbnails.roblox.com/v1/games/icons',
			params={
				'universeIds': universe_id,
				'size': '512x512',
				'format': 'Png',
				'isCircular': 'false',
			},
			timeout=30,
		)
		icon_response.raise_for_status()
		icon = icon_response.json()['data'][0]['imageUrl']

		creator = game_data.get('creator') or {}
		Experience.objects.filter(pk=experience.pk).update(
			rootPlaceId=game_data['rootPlaceId'],
			name=game_data['name'],
			url=experience.url,
			creator=creator.get('name', experience.creator),
			description=game_data.get('description'),
			genre=game_data.get('genre', experience.genre),
			genre_l1=game_data.get('genre_l1'),
			genre_l2=game_data.get('genre_l2'),
			maxPlayers=game_data.get('maxPlayers', experience.maxPlayers),
			created=game_data.get('created', experience.created),
			icon=icon,
		)
