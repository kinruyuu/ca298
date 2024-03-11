from django.shortcuts import render, get_object_or_404
from .models import *
from .forms import *
from django.views.generic import CreateView
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required


def index(request):
    return render(request, 'index.html')

class UserSignupView(CreateView):
    model = User
    form_class = UserSignupForm
    template_name = 'user_signup.html'

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('/previous_orders/')

class UserLoginView(LoginView):
    template_name='login.html'

@login_required
def logout_user(request):
    logout(request)
    return redirect("/")

@login_required
def redirect_user(request):
    user = request.user
    if user.is_authenticated:
        return redirect("/previous_order") # this goes to previous order page
    else:
        return redirect("/") # this goes to home page

@login_required   
def show_preview_orders(request):
    return render(request, 'previous_orders.html')              


@login_required
def create_pizza(request):
    if request.method == "POST":
        form = UserPizzaForm(request.POST)
        if form.is_valid():
            pizza = form.save(commit=False)
            pizza.user = request.user  # Assign the logged-in user to the pizza
            pizza.save()
            return redirect('delivery_details', pid=pizza.id)   # Redirect to the delivery details page')
    else:
        form = UserPizzaForm()
    return render(request, 'create_pizza.html', {'form': form})

@login_required
def delivery_details(request, pid):
    pizza = get_object_or_404(Pizza, pk=pid)
    
    if request.method == "POST":
        form = UserPaymentForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)  # Don't save yet, we need to add pizza first
            order.pizza = pizza
            order.user = request.user  # Assign the logged-in user to the order
            order.save()
            return redirect('order_confirmation', order_id=order.pk)
    else:
        # Don't pass instance=pizza here
        form = UserPaymentForm()
    return render(request, 'delivery_details.html', {'form': form})

@login_required
def order_confirmation(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    if order:
        return render(request, 'order_confirmation.html', {'order': order})
    else:
        return render(request, 'order_not_confirmation.html', {'order': order})

@login_required
def previous_orders(request):
    user = request.user
    orders = Order.objects.filter(user=user)
    for order in orders:
        card_number = order.card_number
        masked_card_number = "X" * 12 + card_number[-4:]  # Mask the first 12 numbers with "X"
        order.card_number = masked_card_number
    return render(request, 'previous_orders.html', {'orders': orders})