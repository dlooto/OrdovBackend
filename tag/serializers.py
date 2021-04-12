from rest_framework import serializers

from .models import FocusPoint, ItemInFocusPoint, RootTag, SubTag

# Removed
class FocusPointSerializer(serializers.ModelSerializer):

    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    # REFER TO: EducationSerializer
    class Meta:
        model = FocusPoint
        fields = (
            'id',
            'name',
            'last_modified',
            'created',
        )

class RootTagSerializer(serializers.ModelSerializer):

    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    # REFER TO: EducationSerializer
    class Meta:
        model = RootTag
        fields = (
            'id',
            'name',
            'last_modified',
            'created',
        )

# Removed
class ItemInFocusPointSerializer(serializers.ModelSerializer):

    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    # REFER TO: EducationSerializer
    focusPointName = serializers.SerializerMethodField()

    def get_focusPointName(self, item):
        fps = FocusPoint.objects.filter(pk=item.focusPoint.id)
        if (fps):
            assert len(fps) == 1
            return fps[0].name
        else:
            return "MockFocus"
    class Meta:
        model = ItemInFocusPoint
        fields = (
            'id',
            'focusPoint',
            'focusPointName',
            'name',
            'last_modified',
        )

class SubTagSerializer(serializers.ModelSerializer):

    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    # REFER TO: EducationSerializer
    rootTagName = serializers.SerializerMethodField()

    def get_rootTagName(self, item):
        tags = RootTag.objects.filter(pk=item.rootTag.id)
        if (tags):
            assert len(tags) == 1
            return tags[0].name
        else:
            return "MockTag"
    class Meta:
        model = SubTag
        fields = (
            'id',
            'rootTag',
            'rootTagName',
            'name',
            'last_modified',
        )
