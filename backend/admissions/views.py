from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.db.models import Q, Count, Avg
from .models import College, Course, Application
from .serializers import (
    CollegeSerializer,
    CourseSerializer,
    ApplicationSerializer,
    ApplicationStatusUpdateSerializer
)

class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all().prefetch_related('courses')
    serializer_class = CollegeSerializer
    
    def get_permissions(self):
        if self.action in ['list','retrieve','check_eligibility']:
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get_queryset(self):
        queryset = College.objects.all().prefetch_related('courses')
        search = self.request.query_params.get('search', None)
        max_cutoff = self.request.query_params.get('max_cutoff', None)
        location = self.request.query_params.get('location', None)

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(code__icontains=search) |
                Q(location__icontains=search) |
                Q(description__icontains=search)
            )

        if location:
            queryset = queryset.filter(location__icontains=location)

        if max_cutoff:
            try:
                cutoff_val = float(max_cutoff)
                queryset = queryset.filter(min_marks_requirement__lte=cutoff_val)
            except ValueError:
                pass

        return queryset

    @action(detail=False, methods=['get'])
    def check_eligibility(self, request):
        marks_str = request.query_params.get('marks', None)
        if not marks_str:
            return Response({'error': 'Please provide marks parameter (e.g. ?marks=75)'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            marks = float(marks_str)
        except ValueError:
            return Response({'error': 'Marks must be a valid number'}, status=status.HTTP_400_BAD_REQUEST)

        all_colleges = College.objects.all().prefetch_related('courses')
        eligible = []
        not_eligible = []

        for col in all_colleges:
            col_data = CollegeSerializer(col).data
            if marks >= col.min_marks_requirement:
                eligible.append(col_data)
            else:
                not_eligible.append(col_data)

        return Response({
            'student_marks': marks,
            'eligible_count': len(eligible),
            'eligible_colleges': eligible,
            'ineligible_colleges': not_eligible
        })


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().select_related('college')
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ['list','retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get_queryset(self):
        queryset = Course.objects.all().select_related('college')
        college_id = self.request.query_params.get('college', None)
        if college_id:
            queryset = queryset.filter(college_id=college_id)
        return queryset


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().select_related('college', 'course')
    serializer_class = ApplicationSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]

        if self.action == 'track':
            return [AllowAny()]

        return [IsAdminUser()]
    def get_queryset(self):
        queryset = Application.objects.all().select_related('college', 'course')
        status_param = self.request.query_params.get('status', None)
        college_id = self.request.query_params.get('college', None)
        search = self.request.query_params.get('search', None)
        email = self.request.query_params.get('email', None)

        if status_param:
            queryset = queryset.filter(status=status_param.upper())
        if college_id:
            queryset = queryset.filter(college_id=college_id)
        if email:
            queryset = queryset.filter(student_email__iexact=email)
        if search:
            queryset = queryset.filter(
                Q(student_name__icontains=search) |
                Q(student_email__icontains=search) |
                Q(application_id__icontains=search) |
                Q(college__name__icontains=search)
            )

        return queryset

    @action(detail=False, methods=['get'])
    def track(self, request):
        query = request.query_params.get('query', '').strip()
        if not query:
            return Response({'error': 'Please provide an application ID or email address to search.'}, status=status.HTTP_400_BAD_REQUEST)

        applications = Application.objects.filter(
            Q(application_id__iexact=query) | Q(student_email__iexact=query)
        ).select_related('college', 'course')

        if not applications.exists():
            return Response({'message': 'No applications found matching your criteria.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        serializer = ApplicationStatusUpdateSerializer(application, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(ApplicationSerializer(application).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DashboardStatsAPIView(APIView):
    permission_classes=[IsAdminUser]
    
    def get(self, request):
        total_colleges = College.objects.count()
        total_courses = Course.objects.count()
        applications = Application.objects.all()
        total_apps = applications.count()

        accepted_count = applications.filter(status='ACCEPTED').count()
        rejected_count = applications.filter(status='REJECTED').count()
        pending_count = applications.filter(status='PENDING_REVIEW').count()
        waitlisted_count = applications.filter(status='WAITLISTED').count()

        acceptance_rate = round((accepted_count / total_apps * 100), 1) if total_apps > 0 else 0
        avg_marks = applications.aggregate(Avg('marks_percentage'))['marks_percentage__avg'] or 0.0

        colleges = College.objects.annotate(
            app_count=Count('applications'),
            accepted_cnt=Count('applications', filter=Q(applications__status='ACCEPTED'))
        ).order_by('-app_count')

        colleges_summary = [
            {
                'id': c.id,
                'name': c.name,
                'code': c.code,
                'min_marks_requirement': c.min_marks_requirement,
                'applications_count': c.app_count,
                'accepted_count': c.accepted_cnt
            }
            for c in colleges
        ]

        recent_apps = Application.objects.select_related('college', 'course').order_by('-applied_at')[:5]
        recent_apps_data = ApplicationSerializer(recent_apps, many=True).data

        return Response({
            'total_colleges': total_colleges,
            'total_courses': total_courses,
            'total_applications': total_apps,
            'accepted_count': accepted_count,
            'rejected_count': rejected_count,
            'pending_count': pending_count,
            'waitlisted_count': waitlisted_count,
            'acceptance_rate': acceptance_rate,
            'average_student_marks': round(avg_marks, 1),
            'colleges_summary': colleges_summary,
            'recent_applications': recent_apps_data
        })
