from django.db.models import Q
from rest_framework import generics, permissions, viewsets
from .models import Favourite, Inquiry, Property
from .permissions import IsAgentOrAdminForWrite, IsOwnerOrAdmin
from .serializers import FavouriteSerializer, InquirySerializer, PropertySerializer

class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    permission_classes = [IsAgentOrAdminForWrite, IsOwnerOrAdmin]
    filterset_fields = {"city": ["exact", "icontains"], "owner": ["exact"], "property_type": ["exact"], "bedrooms": ["gte"], "price": ["gte", "lte"]}
    search_fields = ["title", "description", "address", "city"]
    ordering_fields = ["price", "created_at", "bedrooms"]
    def get_queryset(self):
        queryset = Property.objects.select_related("owner").prefetch_related("images")
        if self.request.user.is_authenticated and self.request.user.role == "admin":
            return queryset
        if self.action in ("update", "partial_update", "destroy"):
            return queryset
        return queryset.filter(Q(is_published=True) | Q(owner=self.request.user) if self.request.user.is_authenticated else Q(is_published=True))
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class FavouriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavouriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Favourite.objects.none()
        return Favourite.objects.filter(user=self.request.user).select_related("property", "property__owner")

class FavouriteDeleteView(generics.DestroyAPIView):
    serializer_class = FavouriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Favourite.objects.none()
        return Favourite.objects.filter(user=self.request.user)

class InquiryListCreateView(generics.ListCreateAPIView):
    serializer_class = InquirySerializer
    def get_permissions(self):
        return [permissions.AllowAny()] if self.request.method == "POST" else [permissions.IsAuthenticated()]
    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Inquiry.objects.none()
        user = self.request.user
        if user.role == "admin":
            return Inquiry.objects.all()
        return Inquiry.objects.filter(property__owner=user)
