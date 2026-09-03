from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from .serializers import QuizzSerializer,QuizSubmissionSerializer
from .database import quizzes

# Create your views here.

#Caso de uso: Cadastrar avaliação
class QuizCreateView(APIView):
    def post(self, request):
        serializer = QuizzSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        resultado = quizzes.insert_one(serializer.validated_data)

        return Response({
            "message": "Quiz criado",
            "Quiz ID": str(resultado.inserted_id)
        }, status=status.HTTP_201_CREATED)

#Caso de uso: Visualizar avaliação(Discente)
class VisualizeTestView(APIView):
    def get(self, request, quiz_id):
        try:
            obj_id = ObjectId(quiz_id.strip())
        except (InvalidId, TypeError) as e:
            return Response({"erro": f"Formato inválido de ID: {str(e)}"}, status = status.HTTP_400_BAD_REQUEST)

        try:
            prova = quizzes.find_one({"_id": obj_id})
        except Exception as e:
            print(f"[ERRO BANCO ATLAS]: {e}")
            return Response({"erro": "Falha na comunicação com o banco de dados.", "detalhes": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not prova:
            return Response({"erro": "Quiz não encontrado ou não existe"}, status = status.HTTP_404_NOT_FOUND)

        questoes_aluno = []
        for p in prova.get("questoes", []):
            questoes_aluno.append({
                "id": p["id"],
                "enunciado": p["enunciado"],
                "alternativas": p["alternativas"],
                "valor_questao": p["valor_questao"]
            })

        return Response({
            "id": str(prova["_id"]),
            "docente_id": prova["docente_id"],
            "titulo": prova["titulo"],
            "descricao": prova["descricao"],
            "prazo_inicio": prova["prazo_inicio"],
            "prazo_limite": prova["prazo_limite"],
            "questoes": questoes_aluno
        }, status = status.HTTP_200_OK)