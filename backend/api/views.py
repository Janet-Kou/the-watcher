from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from django.db.models import Avg
from django.conf import settings
import requests
import os
from .models import WatchlistItem
from .serializers import (
    UserSerializer, RegisterSerializer, 
    WatchlistItemSerializer
)

TMDB_API_KEY= "1664d90cf01e2096cc12e14b3a7a7623"

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WatchlistItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        movie_id = self.request.data.get('movie_id')

        if WatchlistItem.objects.filter(user=self.request.user, movie_id=movie_id).exists():
            raise ValidationError("This movie is already in your watchlist!")
        
        serializer.save(user=self.request.user)
@api_view(['GET'])
@permission_classes([AllowAny])
def search_movies(request):
    """Search movies from TMDB API"""
    query = request.query_params.get('query')
    
    if not query:
        return Response({'error': 'Search query required'}, status=400)
    
    tmdb_key = os.getenv('TMDB_API_KEY')

    url = f"https://api.themoviedb.org/3/search/movie?api_key={'1664d90cf01e2096cc12e14b3a7a7623'}&query={query}"
    response = requests.get(url)
    
    if response.status_code == 200:
        return Response(response.json())
    else:
        return Response({'error': 'Failed to fetch movies'}, status=500)


# @api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated])

# def reviews(request, movie_id):
#     """Get reviews for a movie or add a review"""
#     if request.method == 'GET':
#         reviews_list = UserReview.objects.filter(movie_id=movie_id)
#         serializer = UserReviewSerializer(reviews_list, many=True)
        
#         # Calculate average rating
#         avg_rating = reviews_list.aggregate(Avg('rating'))['rating__avg']
        
#         return Response({
#             'reviews': serializer.data,
#             'average_rating': avg_rating
#         })
    
#     elif request.method == 'POST':
#         # Check if user already reviewed this movie
#         existing = UserReview.objects.filter(user=request.user, movie_id=movie_id).first()
#         if existing:
#             return Response({'error': 'You have already reviewed this movie'}, status=400)
        
#         serializer = UserReviewSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(user=request.user, movie_id=movie_id)
#             return Response(serializer.data, status=201)
#         return Response(serializer.errors, status=400)