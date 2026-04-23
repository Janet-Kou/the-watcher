from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.db.models import Avg
from django.conf import settings
import requests
import os
from .models import WatchlistItem, Movie
from .serializers import (
    UserSerializer, RegisterSerializer, 
    WatchlistItemSerializer, MovieSerializer
)
import random

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

    movies = Movie.objects.filter(title__icontains=query)[:50]
    if movies.exists():
        serializer = MovieSerializer(movies, many=True)
        return Response({'results': serializer.data})

    tmdb_key = os.getenv('TMDB_API_KEY') or TMDB_API_KEY
    url = f"https://api.themoviedb.org/3/search/movie?api_key={tmdb_key}&query={query}"
    response = requests.get(url)
    
    if response.status_code == 200:
        return Response(response.json())
    else:
        return Response({'error': 'Failed to fetch movies'}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def trending_movies(request):
    movies = Movie.objects.order_by('-popularity')[:12]
    serializer = MovieSerializer(movies, many=True)
    return Response({'results': serializer.data})

@api_view(['GET'])
@permission_classes([AllowAny])
def suggested_movies(request):
    if request.user.is_authenticated:
        watched_ids = WatchlistItem.objects.filter(user=request.user).values_list('movie_id', flat=True)
        if watched_ids:
            movies = Movie.objects.exclude(tmdb_id__in=watched_ids).order_by('-revenue')[:12]
            serializer = MovieSerializer(movies, many=True)
            return Response({'results': serializer.data})

    movies = Movie.objects.order_by('-revenue')[:12]
    serializer = MovieSerializer(movies, many=True)
    return Response({'results': serializer.data})

@api_view(['GET'])
@permission_classes([AllowAny])
def catalog_movies(request):
    """Fetch popular movies from TMDB API"""
    tmdb_key = os.getenv('TMDB_API_KEY') or TMDB_API_KEY
    url = f"https://api.themoviedb.org/3/movie/popular?api_key={tmdb_key}&language=en-US&page=1"
    response = requests.get(url)

    if response.status_code == 200:
        return Response(response.json())
    else:
        return Response({'error': 'Failed to fetch catalog movies'}, status=500)

class RecommendationView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all movies rated 4 or 5 stars
        top_rated = WatchlistItem.objects.filter(
            user=request.user, 
            rating__gte=4
        ).order_by('-id')
        
        if top_rated.exists():
            # Send the full list of favorite movies back to the frontend
            sources = [
                {"title": m.title, "tmdb_id": m.movie_id} 
                for m in top_rated
            ]
            return Response({"type": "personalized", "sources": sources})
        else:
            return Response({"type": "trending"})

class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        try:
            user = User.objects.get(email__iexact=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}"
            send_mail(
                subject="The Watcher - Password Reset",
                message=f"Click the link below to reset your password:\n\n{reset_link}\n\nIf you did not request this, ignore this email.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
            )
        except User.DoesNotExist:
            pass  # Don't reveal whether the email exists
        return Response(
            {"message": "If an account with that email exists, a reset link has been sent."},
            status=status.HTTP_200_OK
        )

class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid', '')
        token = request.data.get('token', '')
        new_password = request.data.get('new_password', '')
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"error": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "This reset link is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)

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