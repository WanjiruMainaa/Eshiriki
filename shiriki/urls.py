from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, TeamViewSet, CommentViewSet

router = DefaultRouter()
router.register('tasks', TaskViewSet, basename='task')
router.register('teams', TeamViewSet, basename='team')
router.register('comments', CommentViewSet, basename='comment')

urlpatterns = router.urls