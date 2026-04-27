from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, TeamViewSet, CommentViewSet, UserRegistrationView, CustomTokenObtainPairView, CustomTokenRefreshView

router = DefaultRouter()
router.register('tasks', TaskViewSet, basename='task')
router.register('teams', TeamViewSet, basename='team')
router.register('comments', CommentViewSet, basename='comment')

urlpatterns = [
     path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
] + router.urls