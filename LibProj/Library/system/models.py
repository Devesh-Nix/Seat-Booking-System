from django.db import models

class Booking(models.Model):
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=10)
    email = models.EmailField()
    aadhaar = models.CharField(max_length=4)
    slot = models.CharField(max_length=50)
    seat_id = models.CharField(max_length=10)
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - Seat {self.seat_id} - {self.slot}"
