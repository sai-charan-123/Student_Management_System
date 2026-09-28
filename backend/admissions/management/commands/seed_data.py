from django.core.management.base import BaseCommand
from admissions.models import College, Course, Application

class Command(BaseCommand):
    help = "Seed database with initial colleges from collage_adm.py, courses, and sample applications"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE("Checking initial College Admissions data..."))

        # Make deployment/restart safe: only seed an empty database.
        if College.objects.exists():
            self.stdout.write(self.style.SUCCESS("Database already contains college data; skipping seed."))
            return

        self.stdout.write(self.style.NOTICE("Seeding initial College Admissions data..."))

        # The database is empty at this point.
        Course.objects.all().delete()
        Application.objects.all().delete()
        College.objects.all().delete()

        colleges_data = [
            {
                "name": "Oxford University",
                "code": "OXF",
                "min_marks_requirement": 80.0,
                "location": "Oxford, United Kingdom",
                "established_year": 1096,
                "website": "https://www.ox.ac.uk",
                "description": "World-leading collegiate research university known for academic excellence, historic colleges, and prestigious alumni.",
                "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
                "courses": [
                    {"name": "Computer Science (Hons)", "code": "CS-OXF", "duration_years": 3, "tuition_fee": 38000, "seats": 40, "cutoff": 85.0},
                    {"name": "Philosophy, Politics & Economics (PPE)", "code": "PPE-OXF", "duration_years": 3, "tuition_fee": 35000, "seats": 60, "cutoff": 82.0},
                    {"name": "Biomedical Sciences", "code": "BMS-OXF", "duration_years": 4, "tuition_fee": 41000, "seats": 35, "cutoff": 80.0},
                ]
            },
            {
                "name": "CAMBRIDGE UNIVERSITY",
                "code": "CAMB",
                "min_marks_requirement": 87.0,
                "location": "Cambridge, United Kingdom",
                "established_year": 1209,
                "website": "https://www.cam.ac.uk",
                "description": "One of the oldest and most revered universities worldwide, pioneer in scientific discoveries and mathematical rigor.",
                "image_url": "https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=800&auto=format&fit=crop&q=80",
                "courses": [
                    {"name": "Engineering & Aerospace", "code": "ENG-CAMB", "duration_years": 4, "tuition_fee": 42000, "seats": 50, "cutoff": 88.0},
                    {"name": "Mathematical Tripos", "code": "MATH-CAMB", "duration_years": 3, "tuition_fee": 36000, "seats": 45, "cutoff": 90.0},
                    {"name": "Natural Sciences", "code": "NATSCI-CAMB", "duration_years": 4, "tuition_fee": 39000, "seats": 50, "cutoff": 87.0},
                ]
            },
            {
                "name": "Madanapalle Institute of Technology & Science (MITS)",
                "code": "MITS",
                "min_marks_requirement": 70.0,
                "location": "Madanapalle, Andhra Pradesh, India",
                "established_year": 1998,
                "website": "https://www.mits.ac.in",
                "description": "Premier engineering & technology institution offering cutting-edge programs in computing, AI, and robotics with top campus placements.",
                "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
                "courses": [
                    {"name": "Computer Science & Engineering (CSE)", "code": "CSE-MITS", "duration_years": 4, "tuition_fee": 85000, "seats": 180, "cutoff": 75.0},
                    {"name": "Artificial Intelligence & Data Science", "code": "AIDS-MITS", "duration_years": 4, "tuition_fee": 85000, "seats": 120, "cutoff": 72.0},
                    {"name": "Electronics & Communication (ECE)", "code": "ECE-MITS", "duration_years": 4, "tuition_fee": 75000, "seats": 120, "cutoff": 70.0},
                ]
            },
            {
                "name": "Gnanambika Degree & PG College",
                "code": "GNAN",
                "min_marks_requirement": 68.0,
                "location": "Madanapalle, Andhra Pradesh, India",
                "established_year": 1999,
                "website": "https://www.gnanambika.edu.in",
                "description": "Reputed regional educational center providing accessible, high-quality science, commerce, and computer application degrees.",
                "image_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
                "courses": [
                    {"name": "B.Sc Computer Science & Statistics", "code": "BSC-CS-GNAN", "duration_years": 3, "tuition_fee": 45000, "seats": 90, "cutoff": 68.0},
                    {"name": "Master of Computer Applications (MCA)", "code": "MCA-GNAN", "duration_years": 2, "tuition_fee": 55000, "seats": 60, "cutoff": 70.0},
                    {"name": "Bachelor of Business Administration (BBA)", "code": "BBA-GNAN", "duration_years": 3, "tuition_fee": 40000, "seats": 60, "cutoff": 68.0},
                ]
            },
            {
                "name": "Viswam Degree & Engineering College",
                "code": "VISWAM",
                "min_marks_requirement": 65.0,
                "location": "Angallu, Andhra Pradesh, India",
                "established_year": 2006,
                "website": "https://www.viswam.edu.in",
                "description": "Dynamic institute committed to technical education, skill enhancement, and career enablement for aspiring engineers and managers.",
                "image_url": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
                "courses": [
                    {"name": "B.Tech Information Technology", "code": "IT-VSW", "duration_years": 4, "tuition_fee": 65000, "seats": 90, "cutoff": 65.0},
                    {"name": "B.Tech Mechanical Engineering", "code": "MECH-VSW", "duration_years": 4, "tuition_fee": 60000, "seats": 60, "cutoff": 65.0},
                    {"name": "MBA - Marketing & Finance", "code": "MBA-VSW", "duration_years": 2, "tuition_fee": 50000, "seats": 60, "cutoff": 65.0},
                ]
            }
        ]

        created_colleges = {}
        for cdata in colleges_data:
            courses = cdata.pop("courses")
            college = College.objects.create(**cdata)
            created_colleges[college.code] = college
            for c in courses:
                Course.objects.create(
                    college=college,
                    name=c["name"],
                    code=c["code"],
                    duration_years=c["duration_years"],
                    tuition_fee=c["tuition_fee"],
                    seats_available=c["seats"],
                    min_cutoff_percentage=c["cutoff"]
                )
            self.stdout.write(f"  + Created College: {college.name} (Cutoff: {college.min_marks_requirement}%)")

        # Sample applications to showcase the admissions dashboard
        sample_applications = [
            {
                "college": created_colleges["OXF"],
                "course": created_colleges["OXF"].courses.first(),
                "student_name": "Aarav Sharma",
                "student_email": "aarav.sharma@example.com",
                "student_phone": "+91 98765 43210",
                "marks_percentage": 92.5,
            },
            {
                "college": created_colleges["CAMB"],
                "course": created_colleges["CAMB"].courses.first(),
                "student_name": "Emily Watson",
                "student_email": "emily.watson@example.com",
                "student_phone": "+44 7911 123456",
                "marks_percentage": 89.0,
            },
            {
                "college": created_colleges["MITS"],
                "course": created_colleges["MITS"].courses.first(),
                "student_name": "Sai Charan",
                "student_email": "saicharan@example.com",
                "student_phone": "+91 91234 56789",
                "marks_percentage": 84.0,
            },
            {
                "college": created_colleges["OXF"],
                "course": created_colleges["OXF"].courses.first(),
                "student_name": "Rahul Verma",
                "student_email": "rahul.v@example.com",
                "student_phone": "+91 94444 12345",
                "marks_percentage": 76.5,
            },
            {
                "college": created_colleges["VISWAM"],
                "course": created_colleges["VISWAM"].courses.first(),
                "student_name": "Priya Reddy",
                "student_email": "priya.reddy@example.com",
                "student_phone": "+91 99887 66554",
                "marks_percentage": 78.0,
            },
            {
                "college": created_colleges["GNAN"],
                "course": created_colleges["GNAN"].courses.first(),
                "student_name": "Karthik Nair",
                "student_email": "karthik.nair@example.com",
                "student_phone": "+91 98111 22334",
                "marks_percentage": 63.5,
            }
        ]

        for app_data in sample_applications:
            app = Application.objects.create(**app_data)
            self.stdout.write(f"  + Application: {app.student_name} -> {app.college.name} [{app.status}] (Marks: {app.marks_percentage}%)")

        self.stdout.write(self.style.SUCCESS("Successfully seeded all College Admissions data!"))

