from django.contrib import admin
from .models import College, Course, Application

@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'location', 'min_marks_requirement', 'established_year')
    search_fields = ('name', 'code', 'location')
    list_filter = ('location',)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'college', 'duration_years', 'tuition_fee', 'min_cutoff_percentage', 'seats_available')
    search_fields = ('name', 'code', 'college__name')
    list_filter = ('college', 'duration_years')


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('application_id', 'student_name', 'college', 'course', 'marks_percentage', 'status', 'applied_at')
    search_fields = ('application_id', 'student_name', 'student_email', 'college__name')
    list_filter = ('status', 'college', 'applied_at')
    readonly_fields = ('application_id', 'applied_at', 'updated_at')
