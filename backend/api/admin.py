from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    """
    Admin interface for CustomUser model.
    Extends Django's default UserAdmin with subscription and role information.
    """
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone_number', 'company_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Subscription', {'fields': ('subscription_type',)}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )
    
    list_display = ('username', 'email', 'get_full_name', 'subscription_type', 'is_staff', 'created_at')
    list_filter = ('is_staff', 'is_superuser', 'subscription_type', 'created_at')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'company_name')
    ordering = ('-created_at',)
    
    readonly_fields = ('created_at', 'updated_at', 'last_login', 'date_joined')

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username
    get_full_name.short_description = 'Full Name'
