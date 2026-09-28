import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create or update the UniAdmit admin superuser."

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
            },
        )

        # Always make sure the admin account has the correct details.
        user.email = email
        user.first_name = "Sai"
        user.last_name = "Charan"
        user.is_staff = True
        user.is_superuser = True

        # Always synchronize the password with ADMIN_PASSWORD.
        user.set_password(password)

        user.save()

        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Superuser '{username}' created successfully."
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Superuser '{username}' updated successfully."
                )
            )