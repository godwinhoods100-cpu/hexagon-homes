from rest_framework import status
from rest_framework.test import APITestCase

class AuthApiTests(APITestCase):
    def test_register_login_profile_and_logout(self):
        registration = self.client.post("/api/auth/register/", {"username": "jane", "email": "jane@example.com", "password": "A-secure-pass-741!", "first_name": "Jane"})
        self.assertEqual(registration.status_code, status.HTTP_201_CREATED)
        login = self.client.post("/api/auth/login/", {"email": "jane@example.com", "password": "A-secure-pass-741!"})
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        self.assertEqual(self.client.get("/api/auth/profile/").status_code, status.HTTP_200_OK)
        self.assertEqual(self.client.post("/api/auth/logout/", {"refresh": login.data["refresh"]}).status_code, status.HTTP_204_NO_CONTENT)
