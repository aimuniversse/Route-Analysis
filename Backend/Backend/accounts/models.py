from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    name = models.CharField(max_length=255)
    travels_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    place = models.CharField(max_length=255)

    # Use email as the username field if we want, but since the user wants 
    # Phone OR Email login, we'll keep standard username or handle it in login logic.
    # For now, let's keep username but allow it to be blank if we want, 
    # but AbstractUser requires username. We can set username = email.
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name', 'phone_number']

    def __str__(self):
        return self.email
