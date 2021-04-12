from rest_framework import serializers
from .models import UserProfile

# TODO: The Permission DB only
class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    def get_username(self, userProfile):
        return userProfile.user.username

    class Meta:
       model = UserProfile
       fields = (
         'username',
         'user_type',
         'user',
         'id',
       )

