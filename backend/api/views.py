from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Avg
import requests
import os
from .models import WatchlistItem, UserReview
from .serializers import (
    UserSerializer, RegisterSerializer, 
    WatchlistItemSerializer, UserReviewSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_movies(request):
    """Search movies from TMDB API"""
    query = request.query_params.get('q', '')
    genre = request.query_params.get('genre', '')
    year = request.query_params.get('year', '')
    
    if not query:
        return Response({'error': 'Search query required'}, status=400)
    
    tmdb_key = os.getenv('TMDB_API_KEY')
    url = 'https://api.themoviedb.org/3/search/movie'
    params = {
        'api_key': tmdb_key,
        'query': query,
        'language': 'en-US',
        'page': 1
    }
    
    if genre:
        params['with_genres'] = genre
    if year:
        params['primary_release_year'] = year
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        return Response(response.json())
    else:
        return Response({'error': 'Failed to fetch movies'}, status=500)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def watchlist(request):
    """Get or add to watchlist"""
    if request.method == 'GET':
        items = WatchlistItem.objects.filter(user=request.user)
        serializer = WatchlistItemSerializer(items, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = WatchlistItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def watchlist_detail(request, pk):
    """Update or delete watchlist item"""
    try:
        item = WatchlistItem.objects.get(pk=pk, user=request.user)
    except WatchlistItem.DoesNotExist:
        return Response({'error': 'Item not found'}, status=404)
    
    if request.method == 'PUT':
        serializer = WatchlistItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        item.delete()
        return Response(status=204)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def reviews(request, movie_id):
    """Get reviews for a movie or add a review"""
    if request.method == 'GET':
        reviews_list = UserReview.objects.filter(movie_id=movie_id)
        serializer = UserReviewSerializer(reviews_list, many=True)
        
        # Calculate average rating
        avg_rating = reviews_list.aggregate(Avg('rating'))['rating__avg']
        
        return Response({
            'reviews': serializer.data,
            'average_rating': avg_rating
        })
    
    elif request.method == 'POST':
        # Check if user already reviewed this movie
        existing = UserReview.objects.filter(user=request.user, movie_id=movie_id).first()
        if existing:
            return Response({'error': 'You have already reviewed this movie'}, status=400)
        
        serializer = UserReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, movie_id=movie_id)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)