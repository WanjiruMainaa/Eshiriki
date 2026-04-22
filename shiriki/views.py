from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.models import User
from .models import Task, Team
from .serializers import TaskSerializer, TeamSerializer

# Custom Token Obtain View (public access)
class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = []

# Custom Token Refresh View (public access)
class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = []

# User Registration View
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = []  # Allow unauthenticated access

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

# Task Views with Authentication
class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

# Team Views with Authentication
class TeamListCreateView(generics.ListCreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

class TeamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]
