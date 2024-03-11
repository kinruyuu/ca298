# forms.py
import re
from .models import *
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django import forms
from django.db import transaction
from django.core.exceptions import ValidationError
from datetime import datetime

class UserSignupForm(UserCreationForm):
    email = forms.EmailField(label = "Email")

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("email", "password1", "password2")

    @transaction.atomic
    def save(self):
        user = super().save(commit=False)
        user.is_admin = False
        user.username = self.cleaned_data.get('email')
        user.email = self.cleaned_data.get('email')
        user.save()
        return user


class UserLoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super(UserLoginForm, self).__init__(*args, **kwargs)

class UserPizzaForm(forms.ModelForm):
    class Meta:
        model = Pizza
        fields = ['size', 'crust', 'sauce', 'cheese', 'pepperoni', 'chicken', 'ham', 'pineapple', 'peppers', 'mushrooms', 'onions']


class UserPaymentForm(forms.ModelForm):
    def clean_card_number(self):
        card_number = self.cleaned_data['card_number']
        if len(card_number) != 16 or not card_number.isdigit():
            raise ValidationError("Please enter a valid 16-digit card number.")
        return card_number

    def clean_expiry_date(self):
        expiry_date = self.cleaned_data['expiry_date']
        if not re.match(r'(0[1-9]|1[0-2])\/?([0-9]{2})$', expiry_date):
            raise ValidationError("Please enter a valid expiry date in the format MM/YY.")
        month, year = map(int, expiry_date.split('/'))
        if datetime.now() > datetime(day=1, month=month, year=2000+year):
            raise ValidationError("The card has already expired.")
        return expiry_date


    def clean_cvv(self):
        cvv = self.cleaned_data['cvv']
        if len(cvv) != 3 or not cvv.isdigit():
            raise ValidationError("Please enter a valid 3-digit CVV.")
        return cvv
    
    class Meta:
        model = Order
        fields = ['name', 'delivery_address', 'card_number', 'expiry_date', 'cvv']
        widgets = {
            'card_number': forms.TextInput(attrs={'placeholder': '16 digits'}),
            'expiry_date': forms.TextInput(attrs={'placeholder': 'MM/YY'}),
            'cvv': forms.TextInput(attrs={'placeholder': '3 digits'})
        }
