from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

from .serializers import (
    CustomUserSerializer, UserRegistrationSerializer,
    CustomTokenObtainPairSerializer
)
from .permissions import IsAdmin, HasDataAccess

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Extended token obtain view that includes role and subscription info.
    """
    serializer_class = CustomTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users.
    - Admins can manage all users and their subscriptions
    - Users can view and edit their own profile
    """
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer

    def get_permissions(self):
        if self.action == 'create' or self.action == 'register':
            permission_classes = [AllowAny]
        elif self.action in ['update', 'partial_update']:
            # Users can only update themselves unless they're admin
            permission_classes = [IsAuthenticated]
        elif self.action in ['destroy', 'list']:
            # Only admins can delete or list users
            permission_classes = [IsAdmin]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        # Regular users only see themselves
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """
        Register a new user.
        Returns the new user's profile (subscription defaults to 'free').
        """
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_serializer = CustomUserSerializer(user)
            return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Get the current user's profile.
        """
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], permission_classes=[IsAdmin])
    def set_subscription(self, request, pk=None):
        """
        Admin action to change a user's subscription level.
        """
        user = self.get_object()
        subscription_type = request.data.get('subscription_type')
        
        if subscription_type not in dict(User.SUBSCRIPTION_CHOICES):
            return Response(
                {'error': f'Invalid subscription type. Must be one of: {list(dict(User.SUBSCRIPTION_CHOICES).keys())}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.subscription_type = subscription_type
        user.save()
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], permission_classes=[IsAdmin])
    def set_admin(self, request, pk=None):
        """
        Admin action to promote/demote a user to/from admin.
        """
        user = self.get_object()
        is_staff = request.data.get('is_staff', False)
        
        user.is_staff = is_staff
        user.save()
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """
        Override update to ensure users can only edit their own profile.
        """
        user = self.get_object()
        
        # Regular users can only update themselves
        if not request.user.is_staff and request.user.id != user.id:
            return Response(
                {'error': 'You can only edit your own profile.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Prevent regular users from changing their own subscription or admin status
        if not request.user.is_staff:
            request.data.pop('subscription_type', None)
            request.data.pop('is_staff', None)
        
        return super().update(request, *args, **kwargs)
