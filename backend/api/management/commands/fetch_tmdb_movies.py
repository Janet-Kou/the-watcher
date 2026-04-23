import csv
import requests
from django.core.management.base import BaseCommand
from api.models import Movie

class Command(BaseCommand):
    help = 'Fetch top grossing movies from TMDB API and import them into the database.'

    def add_arguments(self, parser):
        parser.add_argument('--pages', type=int, default=250, help='Number of pages to fetch (default: 250 = ~5000 movies)')
        parser.add_argument('--sort', default='revenue', choices=['revenue', 'popularity'], help='Sort by revenue or popularity')
        parser.add_argument('--output', default='./api/data/tmdb_movies.csv', help='CSV output file path')
        parser.add_argument('--no-import', action='store_true', help='Only save CSV, do not import to database')

    def handle(self, *args, **options):
        pages = options['pages']
        sort_by = options['sort']
        output_file = options['output']
        no_import = options['no_import']

        api_key = '1664d90cf01e2096cc12e14b3a7a7623'
        base_url = 'https://api.themoviedb.org/3/discover/movie'

        self.stdout.write(f'Fetching {pages} pages of movies sorted by {sort_by}...')

        movies = []
        for page in range(1, pages + 1):
            if page % 10 == 0:
                self.stdout.write(f'  Fetching page {page}/{pages}...')

            params = {
                'api_key': api_key,
                'language': 'en-US',
                'page': page,
                'sort_by': f'{sort_by}.desc',
                'with_revenue': 'true' if sort_by == 'revenue' else 'false',
            }

            try:
                response = requests.get(base_url, params=params, timeout=10)
                response.raise_for_status()
                data = response.json()

                for movie in data.get('results', []):
                    movies.append({
                        'tmdb_id': movie.get('id'),
                        'title': movie.get('title', ''),
                        'overview': movie.get('overview', ''),
                        'release_date': movie.get('release_date', ''),
                        'poster_path': movie.get('poster_path', ''),
                        'backdrop_path': movie.get('backdrop_path', ''),
                        'vote_average': movie.get('vote_average', ''),
                        'vote_count': movie.get('vote_count', ''),
                        'popularity': movie.get('popularity', ''),
                        'revenue': movie.get('revenue', ''),
                        'runtime': movie.get('runtime', ''),
                        'genres': ','.join([g.get('name', '') for g in movie.get('genres', [])]) if isinstance(movie.get('genres'), list) else '',
                    })
            except requests.RequestException as e:
                self.stdout.write(self.style.WARNING(f'Error fetching page {page}: {e}'))
                continue

        self.stdout.write(self.style.SUCCESS(f'Fetched {len(movies)} movies'))

        # Write to CSV
        self.stdout.write(f'Writing to {output_file}...')
        try:
            with open(output_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=[
                    'tmdb_id', 'title', 'overview', 'release_date', 'poster_path',
                    'backdrop_path', 'vote_average', 'vote_count', 'popularity', 'revenue', 'runtime', 'genres'
                ])
                writer.writeheader()
                writer.writerows(movies)
            self.stdout.write(self.style.SUCCESS(f'Saved {len(movies)} movies to {output_file}'))
        except IOError as e:
            self.stdout.write(self.style.ERROR(f'Error writing CSV: {e}'))
            return

        if no_import:
            self.stdout.write('Skipping import (use --no-import to disable)')
            return

        # Import into database
        self.stdout.write('Importing movies into database...')
        Movie.objects.all().delete()
        self.stdout.write(self.style.WARNING('Cleared existing Movie records.'))

        count = 0
        for row in movies:
            try:
                Movie.objects.update_or_create(
                    tmdb_id=row['tmdb_id'],
                    defaults={
                        'title': (row['title'] or '').strip(),
                        'overview': (row['overview'] or '').strip(),
                        'release_date': (row['release_date'] or '').strip(),
                        'poster_path': (row['poster_path'] or '').strip() or None,
                        'backdrop_path': (row['backdrop_path'] or '').strip() or None,
                        'vote_average': float(row['vote_average']) if row['vote_average'] else None,
                        'vote_count': int(row['vote_count']) if row['vote_count'] else None,
                        'popularity': float(row['popularity']) if row['popularity'] else None,
                        'revenue': int(row['revenue']) if row['revenue'] else None,
                        'runtime': int(row['runtime']) if row['runtime'] else None,
                        'genres': (row['genres'] or '').strip() or None,
                    }
                )
                count += 1
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'Error importing movie {row["tmdb_id"]}: {e}'))

        self.stdout.write(self.style.SUCCESS(f'Imported {count} movies into database'))
