from django.db import models
from django.contrib.auth.models import User

class WatchlistItem(models.Model):
    STATUS_CHOICES = [
        ('plan_to_watch', 'Plan to Watch'),
        ('watching', 'Watching'),
        ('watched', 'Watched'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    movie_id = models.CharField(max_length=50)
    movie_title = models.CharField(max_length=200)
    poster_path = models.CharField(max_length=500, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='plan_to_watch')
    user_rating = models.IntegerField(null=True, blank=True)
    review = models.TextField(blank=True)
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'movie_id']

    def __str__(self):
        return f"{self.user.username} - {self.movie_title}"

class UserReview(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    movie_id = models.CharField(max_length=50)
    movie_title = models.CharField(max_length=200)
    rating = models.IntegerField()
    review_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'movie_id']