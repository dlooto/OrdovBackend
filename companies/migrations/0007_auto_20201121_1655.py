# Generated by Django 2.2 on 2020-11-21 08:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0006_auto_20200325_2308'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='finished',
        ),
        migrations.AlterField(
            model_name='post',
            name='address_city',
            field=models.CharField(blank=True, default='', max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='address_district',
            field=models.CharField(blank=True, default='', max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='address_province',
            field=models.CharField(blank=True, default='', max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='address_street',
            field=models.CharField(blank=True, default='', max_length=20, null=True),
        ),
    ]