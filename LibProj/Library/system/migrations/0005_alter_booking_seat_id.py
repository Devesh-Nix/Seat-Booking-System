# Generated by Django 5.1.5 on 2025-01-18 09:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system', '0004_booking_booked_at_alter_booking_aadhaar_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='seat_id',
            field=models.CharField(max_length=10),
        ),
    ]
