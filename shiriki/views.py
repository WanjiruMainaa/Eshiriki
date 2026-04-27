from django.db.models import Q
from rest_framework import generics, viewsets, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.models import User
from .models import Task, Team, Comment
from .serializers import TaskSerializer, TeamSerializer, CommentSerializer

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

        User.objects.create_user(username=username, email=email, password=password)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(Q(assigned_to=user) | Q(team__members=user)).distinct()

    def perform_create(self, serializer):
        serializer.save(assigned_to=self.request.user)

class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Team.objects.filter(members=self.request.user).distinct()

    def perform_create(self, serializer):
        team = serializer.save()
        team.members.add(self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Comment.objects.filter(Q(task__assigned_to=user) | Q(task__team__members=user)).distinct()
        task_id = self.request.query_params.get('task')
        if task_id:
            queryset = queryset.filter(task_id=task_id)
        return queryset

    def perform_create(self, serializer):
        task = serializer.validated_data.get('task')
        user = self.request.user
        if not Task.objects.filter(pk=task.pk).filter(Q(assigned_to=user) | Q(team__members=user)).exists():
            raise PermissionDenied('You cannot comment on this task.')
        serializer.save(user=user)
