"""Store uploaded images on Cloudinary instead of the server's disk.

Hosts such as Render wipe local files on every redeploy, so uploads must live
elsewhere. This is switched on in settings.py when CLOUDINARY_URL is set;
locally (no CLOUDINARY_URL) Django keeps using backend/media/.
"""
import os
import uuid

import cloudinary
import cloudinary.uploader
from django.core.files.storage import Storage


class CloudinaryMediaStorage(Storage):
    def get_available_name(self, name, max_length=None):
        # A random suffix means two uploads of "house.jpg" never overwrite each other.
        root, ext = os.path.splitext(name)
        return f"{root}-{uuid.uuid4().hex[:8]}{ext}"

    def _save(self, name, content):
        root, _ext = os.path.splitext(name)
        content.seek(0)
        cloudinary.uploader.upload(
            content, public_id=root, resource_type="image", overwrite=False
        )
        return name  # this string is what gets saved in the database

    def exists(self, name):
        return False  # get_available_name already guarantees a unique name

    def delete(self, name):
        root, _ext = os.path.splitext(name)
        cloudinary.uploader.destroy(root, resource_type="image")

    def url(self, name):
        return f"https://res.cloudinary.com/{cloudinary.config().cloud_name}/image/upload/{name}"
