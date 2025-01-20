from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Booking
import json


def home(request):
    return render(request, 'home.html')

def book_seat(request):
    return render(request, 'book_seat.html')


@method_decorator(csrf_exempt, name='dispatch')
def save_booking(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        booking = Booking.objects.create(
            seat_id=data['seatId'],
            slot=data['slot'],
            name=data['name'],
            contact=data['contact'],
            email=data['email'],
            aadhaar=data['aadhaar']
        )
        return JsonResponse({'message': 'Booking saved successfully', 'id': booking.id})
    return JsonResponse({'error': 'Invalid request'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
def get_bookings(request, slot):
    if request.method == 'GET':
        bookings = Booking.objects.filter(slot=slot).values()
        return JsonResponse(list(bookings), safe=False)
    return JsonResponse({'error': 'Invalid request'}, status=400)
