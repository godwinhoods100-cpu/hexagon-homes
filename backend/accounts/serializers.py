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
    username = serializers.CharField(required=False, allow_blank=True, max_length=150)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "first_name", "last_name", "role")
        extra_kwargs = {"email": {"validators": []}}

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate(self, attrs):
        # The frontend signs people up with an email only, so build a unique username from it.
        if not attrs.get("username"):
            base = attrs["email"].split("@")[0][:140] or "user"
            candidate, n = base, 1
            while User.objects.filter(username__iexact=candidate).exists():
                n += 1
                candidate = f"{base}{n}"
            attrs["username"] = candidate
        return attrs
    def validate_role(self, value):
        if value == User.Role.ADMIN:
            raise serializers.ValidationError("Administrator accounts cannot be self-registered.")
        return value
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
