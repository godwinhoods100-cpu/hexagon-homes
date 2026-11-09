from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        USER = "user", "Buyer or renter"
        AGENT = "agent", "Agent"
        ADMIN = "admin", "Administrator"
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.USER, db_index=True)
    phone = models.CharField(max_length=30, blank=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def save(self, *args, **kwargs):
        # Superusers created with `createsuperuser` should be administrators in the app too.
        if self.is_superuser:
            self.role = self.Role.ADMIN
        super().save(*args, **kwargs)
