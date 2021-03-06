# Generated by Django 2.2 on 2020-12-05 13:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tag', '0001_initial'),
        ('companies', '0007_auto_20201121_1655'),
    ]

    operations = [
        migrations.CreateModel(
            name='PostTag2',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.IntegerField(null=True)),
                ('scoreType', models.IntegerField(null=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('focusPoint', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='tag.FocusPoint')),
                ('itmeInFocusPoint', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='tag.ItemInFocusPoint')),
                ('post', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='companies.Post')),
            ],
        ),
    ]
