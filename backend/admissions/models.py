import uuid
from django.db import models

class College(models.Model):
    name = models.CharField(max_length=200, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, default='')
    location = models.CharField(max_length=150, default='Global')
    min_marks_requirement = models.FloatField(
        help_text="Minimum percentage/marks required for admission (e.g. 80.0)"
    )
    established_year = models.IntegerField(null=True, blank=True, default=2000)
    website = models.URLField(blank=True, default='')
    image_url = models.URLField(
        blank=True,
        default='https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} (Cutoff: {self.min_marks_requirement}%)"


class Course(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='courses')
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=30)
    duration_years = models.IntegerField(default=4)
    tuition_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Tuition fee per year")
    min_cutoff_percentage = models.FloatField(
        null=True, blank=True,
        help_text="Optional course-specific cutoff. Defaults to college cutoff if null."
    )
    seats_available = models.IntegerField(default=60)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        unique_together = ('college', 'code')

    def __str__(self):
        return f"{self.name} - {self.college.name}"

    @property
    def effective_cutoff(self):
        return self.min_cutoff_percentage if self.min_cutoff_percentage is not None else self.college.min_marks_requirement


class Application(models.Model):
    STATUS_CHOICES = (
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('PENDING_REVIEW', 'Pending Review'),
        ('WAITLISTED', 'Waitlisted'),
    )

    application_id = models.CharField(max_length=30, unique=True, editable=False, db_index=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='applications')
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name='applications')
    student_name = models.CharField(max_length=150)
    student_email = models.EmailField()
    student_phone = models.CharField(max_length=20, blank=True, default='')
    marks_percentage = models.FloatField(help_text="Student's scored marks percentage (0-100)")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING_REVIEW')
    remarks = models.TextField(blank=True, default='')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_at']

    def save(self, *args, **kwargs):
        if not self.application_id:
            # Generate human-friendly tracking ID: APP-XXXXXX
            short_id = uuid.uuid4().hex[:8].upper()
            self.application_id = f"APP-{short_id}"

        # Automatic eligibility logic matching original Python logic if status not explicitly set
        if not self.remarks and not kwargs.get('force_status', False):
            required_cutoff = self.course.effective_cutoff if self.course else self.college.min_marks_requirement
            if self.marks_percentage >= required_cutoff:
                self.status = 'ACCEPTED'
                self.remarks = f"Automatic Acceptance: Student scored {self.marks_percentage}% meeting cutoff of {required_cutoff}%."
            else:
                self.status = 'REJECTED'
                self.remarks = f"Did not meet cutoff: Student scored {self.marks_percentage}%, below required {required_cutoff}%."

        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.application_id}] {self.student_name} - {self.college.name} ({self.status})"
