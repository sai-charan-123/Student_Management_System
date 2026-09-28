from rest_framework import serializers
from .models import College, Course, Application

class CourseSerializer(serializers.ModelSerializer):
    effective_cutoff = serializers.FloatField(read_only=True)
    college_name = serializers.CharField(source='college.name', read_only=True)

    class Meta:
        model = Course
        fields = [
            'id',
            'college',
            'college_name',
            'name',
            'code',
            'duration_years',
            'tuition_fee',
            'min_cutoff_percentage',
            'effective_cutoff',
            'seats_available',
            'created_at'
        ]
        read_only_fields = ['id', 'effective_cutoff', 'college_name', 'created_at']

    def validate_min_cutoff_percentage(self, value):
        if value is not None and (value < 0 or value > 100):
            raise serializers.ValidationError("Course cutoff percentage must be between 0 and 100.")
        return value


class CollegeSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    total_applications = serializers.SerializerMethodField()
    accepted_applications = serializers.SerializerMethodField()
    min_marks_requirement = serializers.FloatField(min_value=0.0, max_value=100.0)
    description = serializers.CharField(required=False, allow_blank=True, default='')
    location = serializers.CharField(required=False, allow_blank=True, default='Global')
    website = serializers.CharField(required=False, allow_blank=True, default='')
    image_url = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = College
        fields = [
            'id',
            'name',
            'code',
            'description',
            'location',
            'min_marks_requirement',
            'established_year',
            'website',
            'image_url',
            'courses',
            'total_applications',
            'accepted_applications',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'total_applications', 'accepted_applications', 'courses', 'created_at', 'updated_at']

    def get_total_applications(self, obj):
        return obj.applications.count()

    def get_accepted_applications(self, obj):
        return obj.applications.filter(status='ACCEPTED').count()


class ApplicationSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(source='college.name', read_only=True)
    college_cutoff = serializers.FloatField(source='college.min_marks_requirement', read_only=True)
    course_name = serializers.SerializerMethodField()
    course = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Application
        fields = [
            'id',
            'application_id',
            'college',
            'college_name',
            'college_cutoff',
            'course',
            'course_name',
            'student_name',
            'student_email',
            'student_phone',
            'marks_percentage',
            'status',
            'remarks',
            'applied_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'application_id', 'college_name', 'college_cutoff', 'course_name', 'status', 'remarks', 'applied_at', 'updated_at']

    def get_course_name(self, obj):
        return obj.course.name if obj.course else None

    def to_internal_value(self, data):
        # Gracefully handle empty string for course when coming from HTML selects
        if isinstance(data, dict) and data.get('course') == '':
            data = data.copy()
            data['course'] = None
        return super().to_internal_value(data)

    def validate_marks_percentage(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Marks percentage must be between 0 and 100.")
        return value

    def validate_student_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Student name cannot be blank.")
        return value.strip()


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=Application.STATUS_CHOICES)
    remarks = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = Application
        fields = ['status', 'remarks']
