from rest_framework.permissions import SAFE_METHODS, BasePermission

class IsAgentOrAdminForWrite(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or (request.user.is_authenticated and request.user.role in ("agent", "admin"))

class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.method in SAFE_METHODS or request.user.role == "admin" or obj.owner_id == request.user.id
