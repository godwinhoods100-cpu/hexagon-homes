from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

def validate_image(image):
    if image.size > 8 * 1024 * 1024:
        raise ValidationError("Images must be no larger than 8MB.")
    if getattr(image, "content_type", None) not in ("image/jpeg", "image/png", "image/webp"):
        raise ValidationError("Only JPEG, PNG and WebP images are supported.")

class Property(models.Model):
    class Type(models.TextChoices):
        HOUSE = "house", "House"
        APARTMENT = "apartment", "Apartment"
        VILLA = "villa", "Villa"
        COTTAGE = "cottage", "Cottage"
        PENTHOUSE = "penthouse", "Penthouse"
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="properties", on_delete=models.CASCADE)
    title = models.CharField(max_length=180)
    description = models.TextField()
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, db_index=True)
    property_type = models.CharField(max_length=20, choices=Type.choices, db_index=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, db_index=True)
    bedrooms = models.PositiveSmallIntegerField()
    bathrooms = models.PositiveSmallIntegerField()
    area_sqft = models.PositiveIntegerField()
    amenities = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["city", "property_type", "price"])]

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="properties/%Y/%m/", validators=[validate_image])
    alt_text = models.CharField(max_length=180, blank=True)
    is_primary = models.BooleanField(default=False)

class Favourite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="favourites", on_delete=models.CASCADE)
    property = models.ForeignKey(Property, related_name="favourited_by", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=["user", "property"], name="unique_user_property_favourite")]

class Inquiry(models.Model):
    property = models.ForeignKey(Property, related_name="inquiries", on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="inquiries", on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    message = models.TextField(max_length=2000)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-created_at"]
