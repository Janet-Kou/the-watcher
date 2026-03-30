from rest_framework import serializers
from django.contrib.auth.models import User
from .models import WatchlistItem, UserReview

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

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
        fields = ['id', 'movie_id', 'movie_title', 'poster_path', 'status', 'user_rating', 'review', 'added_at']

class UserReviewSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = UserReview
        fields = ['id', 'movie_id', 'movie_title', 'rating', 'review_text', 'username', 'created_at']