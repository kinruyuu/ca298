# Generated by Django 5.0.1 on 2024-02-22 18:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Luigi_pizza', '0010_order_order'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='order',
            new_name='pizza',
        ),
    ]
