from rest_framework import serializers
from django.contrib.auth.models import User
from .models import WatchlistItem, Movie

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class WatchlistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchlistItem
        fields = ['id', 'movie_id', 'title', 'poster_path', 'status', 'rating', 'review']
        
    def create(self, validated_data):
        # The user is passed in from the view, not the request body
        return WatchlistItem.objects.create(**validated_data)

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = [
            'id', 'tmdb_id', 'title', 'overview', 'release_date', 'poster_path',
            'backdrop_path', 'vote_average', 'vote_count', 'popularity', 'revenue',
            'runtime', 'genres'
        ]

# class UserReviewSerializer(serializers.ModelSerializer):
#     username = serializers.ReadOnlyField(source='user.username')
    
#     class Meta:
#         model = UserReview
#         fields = ['id', 'movie_id', 'movie_title', 'rating', 'review_text', 'username', 'created_at']