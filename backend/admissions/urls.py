from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CollegeViewSet, CourseViewSet, ApplicationViewSet, DashboardStatsAPIView

app_name = 'admissions'

router = DefaultRouter()
router.register(r'colleges', CollegeViewSet, basename='college')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'applications', ApplicationViewSet, basename='application')

urlpatterns = [
    path('dashboard/stats/', DashboardStatsAPIView.as_view(), name='dashboard-stats'),
    path('', include(router.urls)),
]
