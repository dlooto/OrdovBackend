# Generated by Django 2.2 on 2019-11-24 10:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('interviews', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='interview',
            name='callInstanceId',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
