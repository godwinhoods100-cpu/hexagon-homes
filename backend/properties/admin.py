from django.contrib import admin
from .models import Favourite, Inquiry, Property, PropertyImage
admin.site.register([Property, PropertyImage, Favourite, Inquiry])
