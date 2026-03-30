from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('search/', views.search_movies, name='search'),
    path('watchlist/', views.watchlist, name='watchlist'),
    path('watchlist/<int:pk>/', views.watchlist_detail, name='watchlist-detail'),
    path('reviews/<str:movie_id>/', views.reviews, name='reviews'),
]