from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ('created_at','created_by')

    def create(self, validated_data):
        validated_data.setdefault('created_by', self.context['request'].user)
        return super().create(validated_data)


class UserWithReportsSerializer(serializers.ModelSerializer):
    reports = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'reports']

    def get_reports(self,obj):
        reports = obj.reports_received.all()
        return ReportSerializer(reports, many=True).data