from rest_framework import serializers
from .models import Task, Team, Comment, Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['full_name', 'role', 'department']
        extra_kwargs = {
            'full_name': {'required': False},
            'role': {'required': False},
            'department': {'required': False},
        }

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'task', 'user', 'text', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.StringRelatedField(read_only=True)
    team_name = serializers.StringRelatedField(source='team.name', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'priority',
            'deadline',
            'assigned_to',
            'team',
            'team_name',
            'completed',
            'created_at',
        ]
        extra_kwargs = {
            'assigned_to': {'read_only': True},
        }

class TeamSerializer(serializers.ModelSerializer):
    members = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'members']