import csv
from django.core.management.base import BaseCommand
from api.models import Movie

class Command(BaseCommand):
    help = 'Import movies from a CSV file into the Movie catalog database.'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file containing movie data')
        parser.add_argument('--truncate', action='store_true', help='Delete all existing Movie records before import')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        truncate = options['truncate']

        if truncate:
            Movie.objects.all().delete()
            self.stdout.write(self.style.WARNING('Cleared existing Movie records.'))

        with open(csv_file, encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                movie, created = Movie.objects.update_or_create(
                    tmdb_id=int(row['tmdb_id']),
                    defaults={
                        'title': row.get('title', '').strip(),
                        'overview': row.get('overview', '').strip(),
                        'release_date': row.get('release_date', '').strip(),
                        'poster_path': row.get('poster_path', '').strip() or None,
                        'backdrop_path': row.get('backdrop_path', '').strip() or None,
                        'vote_average': float(row['vote_average']) if row.get('vote_average') else None,
                        'vote_count': int(row['vote_count']) if row.get('vote_count') else None,
                        'popularity': float(row['popularity']) if row.get('popularity') else None,
                        'revenue': int(row['revenue']) if row.get('revenue') else None,
                        'runtime': int(row['runtime']) if row.get('runtime') else None,
                        'genres': row.get('genres', '').strip() or None,
                    }
                )
                if created:
                    count += 1

        self.stdout.write(self.style.SUCCESS(f'Imported {count} movies from {csv_file}'))
