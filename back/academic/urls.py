from django.urls import path
from .views import QuizCreateView, VisualizeTestView, SubmitQuizView, LoginLocalMongoView, VisualizesQuizzesFromClass, GetAllClasses
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    #provas
    path('prova/criar/', QuizCreateView.as_view(), name = 'criar-prova'),
    path('prova/visualizar/<str:quiz_id>/', VisualizeTestView.as_view(), name = 'ver-prova'),
    path('provas/<str:class_id>/', VisualizesQuizzesFromClass.as_view(), name = 'ver-provas'),
    path('prova/submeter/<str:quiz_id>/', SubmitQuizView.as_view(), name = 'enviar-prova'),

    #turmas
    path('turmas/', GetAllClasses.as_view(), name = 'buscar-turmas'),

    #login
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/login/', LoginLocalMongoView.as_view(), name='login_local'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]