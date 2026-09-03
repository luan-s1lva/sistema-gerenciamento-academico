from django.urls import path
from .views import QuizCreateView, VisualizeTestView

urlpatterns = [
    path('prova/criar', QuizCreateView.as_view(), name = 'criar-prova'),
    path('prova/visualizar/<str:quiz_id>', VisualizeTestView.as_view(), name = 'ver-prova')
]