# Generated by Django 2.2 on 2019-09-29 13:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('resumes', '0001_initial'),
        ('companies', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start', models.DateField(blank=True, null=True)),
                ('end', models.DateField(blank=True, null=True)),
                ('name', models.CharField(blank=True, max_length=20, null=True)),
                ('brief', models.TextField(blank=True, default='', max_length=500, null=True)),
                ('scale', models.IntegerField(default=0)),
                ('role', models.CharField(blank=True, max_length=20, null=True)),
                ('company_name', models.CharField(blank=True, default='', max_length=50, null=True)),
                ('duty', models.CharField(blank=True, max_length=50, null=True)),
                ('summary', models.TextField(blank=True, default='', max_length=500, null=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('company', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='companies.Company')),
                ('resume', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='resumes.Resume')),
            ],
        ),
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default='', max_length=10, null=True)),
                ('cert', models.CharField(blank=True, default='', max_length=20, null=True)),
                ('description', models.TextField(blank=True, default='', max_length=100, null=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('resume', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='resumes.Resume')),
            ],
        ),
        migrations.CreateModel(
            name='Experience',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start', models.DateField(blank=True, null=True)),
                ('end', models.DateField(blank=True, null=True)),
                ('company_name', models.CharField(blank=True, max_length=50, null=True)),
                ('department_name', models.CharField(blank=True, max_length=50, null=True)),
                ('post_name', models.CharField(blank=True, max_length=50, null=True)),
                ('work_province', models.CharField(blank=True, max_length=20, null=True)),
                ('work_city', models.CharField(blank=True, max_length=30, null=True)),
                ('work_district', models.CharField(blank=True, max_length=30, null=True)),
                ('level', models.CharField(blank=True, max_length=50, null=True)),
                ('description', models.CharField(blank=True, max_length=50, null=True)),
                ('salary', models.IntegerField(default=0)),
                ('deduct_salary', models.IntegerField(default=0)),
                ('leave_reason', models.CharField(blank=True, max_length=20, null=True)),
                ('shift', models.CharField(blank=True, max_length=20, null=True)),
                ('duty', models.TextField(blank=True, default='', max_length=500, null=True)),
                ('subornates', models.IntegerField(default=0)),
                ('p_type', models.CharField(blank=True, default='', max_length=50, null=True)),
                ('p_feature', models.CharField(blank=True, default='', max_length=50, null=True)),
                ('witness', models.CharField(blank=True, max_length=20, null=True)),
                ('witness_post', models.CharField(blank=True, max_length=20, null=True)),
                ('witness_phone', models.CharField(blank=True, max_length=15, null=True)),
                ('reserved1', models.CharField(blank=True, max_length=50, null=True)),
                ('reserved2', models.CharField(blank=True, max_length=50, null=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('company', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='companies.Company')),
                ('department', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='companies.Department')),
                ('post', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='companies.Post')),
                ('resume', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='resumes.Resume')),
            ],
            options={
                'permissions': (('edit_experience', 'Can edit the experience'), ('delete2_experience', 'Can delete the experience')),
            },
        ),
        migrations.CreateModel(
            name='Certification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.CharField(blank=True, default='', max_length=20, null=True)),
                ('name', models.CharField(blank=True, default='', max_length=20, null=True)),
                ('institution', models.CharField(blank=True, default='', max_length=50, null=True)),
                ('description', models.TextField(blank=True, default='', max_length=100, null=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('resume', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='resumes.Resume')),
            ],
        ),
    ]