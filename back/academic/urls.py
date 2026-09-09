from django.urls import path
from .views import QuizCreateView, VisualizeTestView, SubmitQuizView

urlpatterns = [
    path('prova/criar', QuizCreateView.as_view(), name = 'criar-prova'),
    path('prova/visualizar/<str:quiz_id>/', VisualizeTestView.as_view(), name = 'ver-prova'),
    path('prova/submeter/<str:quiz_id>/', SubmitQuizView.as_view(), name = 'enviar-prova')
]