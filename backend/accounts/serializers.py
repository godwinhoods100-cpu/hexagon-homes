from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "phone", "role")
        read_only_fields = ("id", "role")

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "first_name", "last_name", "role")
    def validate_role(self, value):
        if value == User.Role.ADMIN:
            raise serializers.ValidationError("Administrator accounts cannot be self-registered.")
        return value
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
