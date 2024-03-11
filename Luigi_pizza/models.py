from email.policy import default
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinLengthValidator, RegexValidator
from django.utils import timezone

class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    email = models.EmailField('Email', unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = UserManager()

# Class for Pizza size
class Size(models.Model):
    id = models.AutoField(primary_key=True)
    size = models.CharField(max_length=50)
    def __str__(self):
        return f'{self.size}'

# Class for Pizza crust
class Crust(models.Model):
    id = models.AutoField(primary_key=True)
    crust = models.CharField(max_length=50)
    def __str__(self):
        return f'{self.crust}'

# Class for Pizza sauce
class Sauce(models.Model):
    id = models.AutoField(primary_key=True)
    sauce = models.CharField(max_length=50)
    def __str__(self):
        return f'{self.sauce}'

# Class for Pizza cheese
class Cheese(models.Model):
    id = models.AutoField(primary_key=True)
    cheese = models.CharField(max_length=50)
    def __str__(self):
        return f'{self.cheese}' 

# Class for the pizza
class Pizza(models.Model):
    id = models.AutoField(primary_key=True)

    # list of ingredients
    pepperoni = models.BooleanField(default=False)
    chicken = models.BooleanField(default=False)
    ham = models.BooleanField(default=False)
    pineapple = models.BooleanField(default=False)
    peppers = models.BooleanField(default=False)
    mushrooms = models.BooleanField(default=False)
    onions = models.BooleanField(default=False)

    # callback ingredients using foreignkeys
    size = models.ForeignKey(Size, on_delete=models.CASCADE)
    crust = models.ForeignKey(Crust, on_delete=models.CASCADE)
    sauce = models.ForeignKey(Sauce, on_delete=models.CASCADE)
    cheese = models.ForeignKey(Cheese, on_delete=models.CASCADE)

     # ForeignKey to link the pizza to the user
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def selected_toppings(self):
        toppings = []
        if self.pepperoni:
            toppings.append('Pepperoni')
        if self.chicken:
            toppings.append('Chicken')
        if self.ham:
            toppings.append('Ham')
        if self.pineapple:
            toppings.append('Pineapple')
        if self.peppers:
            toppings.append('Peppers')
        if self.mushrooms:
            toppings.append('Mushrooms')
        if self.onions:
            toppings.append('Onions')
        return toppings

    def __str__(self):
        return f'{self.size} , {self.crust} : {self.sauce}, {self.cheese}'
    
# Class for the payment
class Order(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    delivery_address = models.CharField(max_length=255)
    card_number = models.CharField(max_length=16, validators=[MinLengthValidator(16)])
    expiry_date = models.CharField(max_length=5, validators=[MinLengthValidator(5)])
    cvv = models.CharField(max_length=3, validators=[MinLengthValidator(3)])
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    placed_at = models.DateTimeField(default=timezone.now)
    pizza = models.ForeignKey(Pizza, on_delete=models.CASCADE, null=True)
    def __str__(self):
        return f'Order {self.id}'