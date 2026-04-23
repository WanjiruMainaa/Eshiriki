from django.urls import path
from .views import TaskListCreateView, TaskDetailView, TeamListCreateView, TeamDetailView

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('teams/', TeamListCreateView.as_view(), name='team-list-create'),
    path('teams/<int:pk>/', TeamDetailView.as_view(), name='team-detail'),
]