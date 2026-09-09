from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from .serializers import QuizzSerializer,QuizSubmissionSerializer
from .database import quizzes, submissions

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

#Caso de uso: Entregar prova
class SubmitQuizView(APIView):
    def post(self, request, quiz_id):
        serializer = QuizSubmissionSerializer(data=request.data)
        prova = None

        if not serializer.is_valid():
            return Response({"erro": f"Quiz inválido: {serializer.errors}"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            obj_id = ObjectId(quiz_id.strip())
        except (InvalidId, TypeError) as e:
            return Response({"erro": f"Erro no ID: {str(e)}"}, status = status.HTTP_400_BAD_REQUEST)

        try:
            prova = quizzes.find_one({"_id": obj_id})
        except Exception as e:
            return Response({"erro": "Erro de conexão com o banco.", "detalhes": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        discente_id = serializer.validated_data["discente_id"]
        respostas = serializer.validated_data["respostas_enviadas"]

        total_acertos = 0
        nota_final = 0.0
        detalhes_correcao = {}

        gabarito_map = {
            str(p["id"]): {
                "correta": str(p.get("gabarito", "")).strip().upper(),
                "valor": float(p.get("valor_questao", 0))
            } for p in prova.get("questoes", [])
        }

        for p_id, resposta_aluno in respostas.items():
            _id = str(p_id)
            if _id in gabarito_map:
                alternativa_correta = gabarito_map[_id]["correta"]
                valor = gabarito_map[_id]["valor"]
                acertou = (str(resposta_aluno).strip().upper()) == alternativa_correta

                if acertou:
                    total_acertos += 1
                    nota_final += valor

                detalhes_correcao[_id] = {
                    "resposta_aluno": resposta_aluno,
                    "acertou": acertou,
                    "pontos_obtidos": valor if acertou else 0.0
                }

        submissao_pdu = {
            "quiz_id": prova.get("_id"),
            "turma_id": prova.get("class_id"),
            "discente_id": discente_id,
            "data_submissao": datetime.now(),
            "respotas_enviadas": respostas,
            "detalhes_correcao": detalhes_correcao, 
            "total_acertos": total_acertos,
            "total_questoes": len(prova.get("questoes", [])),
            "nota_obtida": nota_final,
            "status": "CORRIGIDO"
        }

        resultado = submissions.insert_one(submissao_pdu)

        return Response({
            "mensagem": "Avaliação enviada com sucesso",
            "submissao_id": str(resultado.inserted_id),
            "nota_final": nota_final,
            "total_acertos": total_acertos,
            "total_questoes": len(prova.get("questoes", [])),
        }, status=status.HTTP_201_CREATED)