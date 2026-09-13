from django.urls import path
from .views import QuizCreateView, VisualizeTestView, SubmitQuizView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('prova/criar', QuizCreateView.as_view(), name = 'criar-prova'),
    path('prova/visualizar/<str:quiz_id>/', VisualizeTestView.as_view(), name = 'ver-prova'),
    path('prova/submeter/<str:quiz_id>/', SubmitQuizView.as_view(), name = 'enviar-prova'),


    #login
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]