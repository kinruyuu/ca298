from django.urls import path
from . import views
from .forms import *

urlpatterns = [
   path('', views.index, name="index"),
   path('register/', views.UserSignupView.as_view(), name="register"),
   path('login/',views.LoginView.as_view(template_name="login.html", authentication_form=UserLoginForm)),
   path('logout/', views.logout_user, name="logout"),
   path('create_pizza/', views.create_pizza, name='create_pizza'),
   path('delivery_details/<int:pid>/', views.delivery_details, name='delivery_details'),
   path('order_confirmation/<int:order_id>/', views.order_confirmation, name='order_confirmation'),
   path('previous_orders/', views.previous_orders, name='previous_orders'),
]