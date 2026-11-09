from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import FavouriteDeleteView, FavouriteListCreateView, InquiryListCreateView, PropertyViewSet
router = DefaultRouter()
router.register("properties", PropertyViewSet, basename="property")
urlpatterns = [
    path("", include(router.urls)),
    path("favourites/", FavouriteListCreateView.as_view(), name="favourites"),
    path("favourites/<int:pk>/", FavouriteDeleteView.as_view(), name="favourite-delete"),
    path("inquiries/", InquiryListCreateView.as_view(), name="inquiries"),
]
