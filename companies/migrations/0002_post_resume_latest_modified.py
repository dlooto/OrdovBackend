# Generated by Django 2.2 on 2019-10-27 11:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='resume_latest_modified',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
