from rest_framework import serializers
from .models import Favourite, Inquiry, Property, PropertyImage

class PropertyImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    class Meta:
        model = PropertyImage
        fields = ("id", "image", "url", "alt_text", "is_primary")
    def get_url(self, obj) -> str:
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    owner_name = serializers.CharField(source="owner.get_full_name", read_only=True)
    uploaded_images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)
    class Meta:
        model = Property
        fields = ("id", "owner", "owner_name", "title", "description", "address", "city", "property_type", "price", "bedrooms", "bathrooms", "area_sqft", "amenities", "is_published", "images", "uploaded_images", "created_at", "updated_at")
        read_only_fields = ("id", "owner", "created_at", "updated_at")
    def validate(self, attrs):
        for field in ("price", "area_sqft"):
            if field in attrs and attrs[field] <= 0:
                raise serializers.ValidationError({field: "Must be greater than zero."})
        return attrs
    def create(self, validated_data):
        images = validated_data.pop("uploaded_images", [])
        property_obj = Property.objects.create(**validated_data)
        for index, image in enumerate(images):
            PropertyImage.objects.create(property=property_obj, image=image, is_primary=index == 0)
        return property_obj
    def update(self, instance, validated_data):
        images = validated_data.pop("uploaded_images", [])
        instance = super().update(instance, validated_data)
        for image in images:
            PropertyImage.objects.create(property=instance, image=image, is_primary=not instance.images.exists())
        return instance

class FavouriteSerializer(serializers.ModelSerializer):
    property_detail = PropertySerializer(source="property", read_only=True)
    class Meta:
        model = Favourite
        fields = ("id", "property", "property_detail", "created_at")
        read_only_fields = ("id", "created_at")
    def create(self, validated_data):
        favourite, _ = Favourite.objects.get_or_create(user=self.context["request"].user, **validated_data)
        return favourite

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ("id", "property", "sender", "name", "email", "phone", "message", "is_read", "created_at")
        read_only_fields = ("id", "sender", "is_read", "created_at")
    def create(self, validated_data):
        request = self.context["request"]
        return Inquiry.objects.create(sender=request.user if request.user.is_authenticated else None, **validated_data)
