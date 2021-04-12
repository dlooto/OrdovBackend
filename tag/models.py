from django.db import models

# Create your models here.
# Removed
class FocusPoint(models.Model):
    name = models.CharField(max_length=10, blank=True, null=True)

    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

# Removed
class ItemInFocusPoint(models.Model):
    focusPoint = models.ForeignKey(FocusPoint, on_delete=models.CASCADE, default='')
    name       = models.CharField(max_length=10, blank=True, null=True)

    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

class RootTag(models.Model):
    name = models.CharField(max_length=10, blank=True, null=True)

    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

    class Meta:
        unique_together = (
            ('name'),
        )

class SubTag(models.Model):
    rootTag = models.ForeignKey(RootTag, on_delete=models.CASCADE, default='')
    name    = models.CharField(max_length=10, blank=True, null=True)

    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

    class Meta:
        unique_together = (
            ('rootTag', 'name'),
        )
