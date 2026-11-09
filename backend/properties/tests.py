from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from PIL import Image
from io import BytesIO
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from .models import Favourite, Property

class PropertyApiTests(APITestCase):
    def setUp(self):
        self.agent = User.objects.create_user(username="agent", email="agent@example.com", password="StrongPass123!", role="agent")
        self.other = User.objects.create_user(username="other", email="other@example.com", password="StrongPass123!", role="agent")
        self.buyer = User.objects.create_user(username="buyer", email="buyer@example.com", password="StrongPass123!")
        self.property = Property.objects.create(owner=self.agent, title="Test House", description="A complete description", address="1 Test Road", city="London", property_type="house", price=500000, bedrooms=3, bathrooms=2, area_sqft=1400)
    def test_public_can_list_and_filter(self):
        response = self.client.get("/api/properties/?city=London&price_lte=600000")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
    def test_only_agent_can_create(self):
        payload = {"title": "New Home", "description": "Description", "address": "2 Road", "city": "Bath", "property_type": "house", "price": 300000, "bedrooms": 2, "bathrooms": 1, "area_sqft": 900}
        self.client.force_authenticate(self.buyer)
        self.assertEqual(self.client.post("/api/properties/", payload).status_code, status.HTTP_403_FORBIDDEN)
        self.client.force_authenticate(self.agent)
        self.assertEqual(self.client.post("/api/properties/", payload).status_code, status.HTTP_201_CREATED)
    def test_owner_permission_blocks_update_and_delete(self):
        self.client.force_authenticate(self.other)
        url = f"/api/properties/{self.property.id}/"
        self.assertEqual(self.client.patch(url, {"title": "Changed"}).status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.delete(url).status_code, status.HTTP_403_FORBIDDEN)
    def test_duplicate_favourite_is_prevented(self):
        self.client.force_authenticate(self.buyer)
        self.client.post("/api/favourites/", {"property": self.property.id})
        self.client.post("/api/favourites/", {"property": self.property.id})
        self.assertEqual(Favourite.objects.filter(user=self.buyer, property=self.property).count(), 1)
    def test_image_upload(self):
        image = BytesIO()
        Image.new("RGB", (20, 20), "blue").save(image, "JPEG")
        image.seek(0)
        upload = SimpleUploadedFile("home.jpg", image.read(), content_type="image/jpeg")
        self.client.force_authenticate(self.agent)
        response = self.client.post("/api/properties/", {"title": "Image Home", "description": "Description", "address": "2 Road", "city": "Bath", "property_type": "house", "price": 300000, "bedrooms": 2, "bathrooms": 1, "area_sqft": 900, "uploaded_images": [upload]}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data["images"]), 1)
