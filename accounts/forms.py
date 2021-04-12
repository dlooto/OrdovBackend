from django import forms

from ordov.choices import USER_TYPE_CHOICES
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

# https://simpleisbetterthancomplex.com/tutorial/2017/02/18/how-to-create-user-sign-up-view.html#sign-up-with-extra-fields
class SignUpForm(UserCreationForm):
    user_type = forms.TypedChoiceField(choices=USER_TYPE_CHOICES)
    class Meta:
        model = User
        fields = ('username', 'password1', 'password2', 'user_type')
