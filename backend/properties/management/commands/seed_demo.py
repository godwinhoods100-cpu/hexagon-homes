"""Create demo agents, a buyer and six sample listings for local development.

    python manage.py seed_demo --password "<choose a password>"

Safe to run more than once: existing users and listings are skipped.
"""
from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand, CommandError
from PIL import Image, ImageDraw, ImageFont

from properties.models import Property, PropertyImage

User = get_user_model()

DEMO_USERS = [
    # email, first name, last name, role
    ("agent1@hexagon.test", "Amara", "Bello", "agent"),
    ("agent2@hexagon.test", "Tunde", "Okafor", "agent"),
    ("buyer@hexagon.test", "Chidi", "Eze", "user"),
]

# title, address, city, type, price, beds, baths, sqft, description, amenities
LISTINGS = [
    ("The Alder Residence", "14 Beaumont Crescent", "London", "house", 1280000, 4, 3, 2840,
     "An exceptional contemporary residence where quiet luxury meets considered architecture. "
     "Floor-to-ceiling glass, warm natural materials and landscaped gardens create a private urban retreat.",
     ["Private garden", "Designer kitchen", "Underfloor heating", "EV charging", "Home office", "Security system"]),
    ("Azure House", "82 Marine Parade", "Brighton", "villa", 875000, 3, 2, 1960,
     "A light-filled coastal home with uninterrupted sea views, a secluded pool terrace and beautifully resolved interiors.",
     ["Sea view", "Swimming pool", "Roof terrace", "Garage", "Smart home"]),
    ("No. 9 Parkside", "9 Richmond Avenue", "Manchester", "apartment", 695000, 3, 2, 1510,
     "A refined city apartment balancing generous proportions with tactile finishes and direct access to the park.",
     ["Concierge", "Balcony", "Residents' lounge", "Cycle storage", "Lift"]),
    ("Willow Courtyard", "3 The Paddocks", "Bristol", "house", 945000, 4, 3, 2310,
     "A distinctive family house arranged around a peaceful private courtyard, moments from the city and countryside.",
     ["Courtyard", "Garden studio", "Utility room", "Parking", "Fireplace"]),
    ("Glasshouse Penthouse", "21 Crown Street", "Edinburgh", "penthouse", 1120000, 3, 3, 2040,
     "Elevated living with panoramic city views, expansive terraces and effortless access to Edinburgh's cultural heart.",
     ["City views", "Two terraces", "Private lift", "Parking", "Concierge"]),
    ("Fernbank Cottage", "6 Church Lane", "Bath", "cottage", 580000, 2, 2, 1240,
     "A thoughtfully renewed period cottage filled with character, calm and beautifully crafted modern details.",
     ["Period features", "Garden", "Wood burner", "Bespoke joinery"]),
]

PALETTES = [
    ((22, 41, 69), (96, 132, 170)),
    ((18, 80, 92), (118, 190, 190)),
    ((70, 52, 40), (196, 160, 120)),
    ((40, 70, 52), (150, 190, 140)),
    ((52, 40, 80), (170, 150, 210)),
    ((80, 40, 46), (210, 150, 150)),
]


def placeholder_image(title, palette):
    """A simple gradient JPEG with the title, so listings look fine without real photos."""
    width, height = 1200, 800
    top, bottom = palette
    img = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(img)
    for y in range(height):
        t = y / (height - 1)
        draw.line([(0, y), (width, y)], fill=tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    try:
        font = ImageFont.load_default(size=56)
    except TypeError:  # very old Pillow
        font = ImageFont.load_default()
    box = draw.textbbox((0, 0), title, font=font)
    draw.text(((width - (box[2] - box[0])) / 2, (height - (box[3] - box[1])) / 2), title, fill="white", font=font)
    buffer = BytesIO()
    img.save(buffer, "JPEG", quality=85)
    return buffer.getvalue()


class Command(BaseCommand):
    help = "Create demo users and sample property listings (safe to re-run)."

    def add_arguments(self, parser):
        parser.add_argument("--password", required=True, help="Password to give the demo users.")

    def handle(self, *args, **options):
        password = options["password"]
        if len(password) < 8:
            raise CommandError("Use a password of at least 8 characters.")

        users = {}
        for email, first, last, role in DEMO_USERS:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={"username": email.split("@")[0], "first_name": first, "last_name": last, "role": role},
            )
            if created:
                user.set_password(password)
                user.save()
            users[email] = user
            self.stdout.write(f"{'created' if created else 'exists '} user {email} ({role})")

        agents = [users["agent1@hexagon.test"], users["agent2@hexagon.test"]]
        for index, (title, address, city, kind, price, beds, baths, sqft, desc, amenities) in enumerate(LISTINGS):
            if Property.objects.filter(title=title).exists():
                self.stdout.write(f"exists  listing {title}")
                continue
            prop = Property.objects.create(
                owner=agents[index % 2], title=title, description=desc, address=address, city=city,
                property_type=kind, price=price, bedrooms=beds, bathrooms=baths, area_sqft=sqft,
                amenities=amenities, is_published=True,
            )
            image = PropertyImage(property=prop, alt_text=title, is_primary=True)
            image.image.save(
                f"{title.lower().replace(' ', '-').replace('.', '')}.jpg",
                ContentFile(placeholder_image(title, PALETTES[index % len(PALETTES)])),
            )
            self.stdout.write(f"created listing {title}")

        self.stdout.write(self.style.SUCCESS("Done. Log in with agent1@hexagon.test or buyer@hexagon.test."))
