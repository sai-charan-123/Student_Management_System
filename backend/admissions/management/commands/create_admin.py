import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create the UniAdmit admin superuser if it does not already exist."

    def handle(self, *args, **options):
        User = get_user_model()

        username = os.getenv("ADMIN_USERNAME", "sai-charan-13")
        email = os.getenv(
            "ADMIN_EMAIL",
            "sathavallisaicharan@gmail.com",
        )
        password = os.getenv("ADMIN_PASSWORD")

        if not password:
            raise CommandError(
                "ADMIN_PASSWORD environment variable is not configured."
            )

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "first_name": "Sai",
                "last_name": "Charan",
                "is_staff": True,
                "is_superuser": True,
            },
        )

        if created:
            user.set_password(password)
            user.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Superuser '{username}' created successfully."
                )
            )
        else:
            changed = False

            if not user.is_staff:
                user.is_staff = True
                changed = True

            if not user.is_superuser:
                user.is_superuser = True
                changed = True

            if user.email != email:
                user.email = email
                changed = True

            if user.first_name != "Sai":
                user.first_name = "Sai"
                changed = True

            if user.last_name != "Charan":
                user.last_name = "Charan"
                changed = True

            if changed:
                user.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Superuser '{username}' already exists and is configured."
                )
            )