from django.db import models
from django.contrib.auth.models import User

class WatchlistItem(models.Model):
    STATUS_CHOICES = [
        ('plan_to_watch', 'Plan to Watch'),
        ('watching', 'Watching'),
        ('watched', 'Watched'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_id = models.IntegerField()  # The ID from TMDB
    title = models.CharField(max_length=255)
    poster_path = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='plan_to_watch')
    rating = models.IntegerField(null=True, blank=True)
    review = models.TextField(null=True, blank=True)

    class Meta:
        # This prevents the same user from adding the same movie twice!
        unique_together = ('user', 'movie_id')

    def __str__(self):
        return f"{self.user.username} - {self.title}"