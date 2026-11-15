from django.urls import path
from .views import QuizCreateView, VisualizeTestView, SubmitQuizView, LoginLocalMongoView, VisualizesQuizzesFromClass, GetAllClasses, VisualizeAllQuizzes, GetUsuarioPeloId, GetTurmaPeloId
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    #provas
    path('prova/criar/', QuizCreateView.as_view(), name = 'criar-prova'),
    path('prova/visualizar/<str:quiz_id>/', VisualizeTestView.as_view(), name = 'ver-prova'),
    path('prova/<str:class_id>/', VisualizesQuizzesFromClass.as_view(), name = 'ver-provas-por-classe-id'),
    path('prova/submeter/<str:quiz_id>/', SubmitQuizView.as_view(), name = 'enviar-prova'),
    path('provas/', VisualizeAllQuizzes.as_view(), name = 'ver-todas-provas'),

    #turmas
    path('turmas/', GetAllClasses.as_view(), name = 'buscar-todas-turmas'),

    #get info
    path('buscar/docente/<str:docente_id>/', GetUsuarioPeloId.as_view(), name = 'buscar-usuario-pelo-id'),
    path('buscar/turma/<str:turma_id>/', GetTurmaPeloId.as_view(), name = 'buscar-turma-pelo-id'),

    #login
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/login/', LoginLocalMongoView.as_view(), name='login_local'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]