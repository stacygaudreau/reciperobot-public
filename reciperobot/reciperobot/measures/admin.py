from django.contrib import admin
from .models import Measure, MeasureAlias

@admin.register(Measure)
class MeasureAdmin(admin.ModelAdmin):
    pass

@admin.register(MeasureAlias)
class MeasureAliasAdmin(admin.ModelAdmin):
    pass
    
