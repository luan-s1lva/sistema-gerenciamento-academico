from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from .serializers import QuizzSerializer, QuizSubmissionSerializer, LocalLoginSerializer, ClassSerializer
from .database import quizzes, submissions, users, classes
from rest_framework.permissions import AllowAny
# Create your views here.

#Caso de uso: Cadastrar avaliação
class QuizCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
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

#Caso de uso : Buscar todas as provas para uma dada turma
class VisualizesQuizzesFromClass(APIView):
    def get(self, request, class_id):
        try:
            provas = quizzes.find({"class_id": class_id})
            lista_provas = list(provas)
        except Exception as e:
            print(f"[ERRO BANCO ATLAS]: {e}")
            return Response({"erro": "Falha na comunicação com o banco de dados.", "detalhes": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not lista_provas:
            return Response({"erro": "Nenhuma prova disponível"}, status = status.HTTP_404_NOT_FOUND)

        resposta = []
        for prova in lista_provas:
            resposta.append({
                "id": str(prova["_id"]),
                "class_id": str(prova.get("class_id")),
                "docente_id": str(prova.get("docente_id")),
                "titulo": prova.get("titulo"),
                "descricao": prova.get("descricao"),
                "prazo_inicio": prova.get("prazo_inicio"),
                "prazo_limite": prova.get("prazo_limite"),
                "total_questoes": len(prova.get("questoes"))
            })

        return Response(resposta, status = status.HTTP_200_OK)

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
            str(questao["id"]): {
                "correta": str(questao.get("gabarito", "")).strip().upper(),
                "valor": float(questao.get("valor_questao", 0))
            } for questao in prova.get("questoes", [])
        }

        for questao_id, resposta_aluno in respostas.items():
            _id = str(questao_id)
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
            "respostas_enviadas": respostas,
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
            "nota_obtida": nota_final,
            "total_acertos": total_acertos,
            "total_questoes": len(prova.get("questoes", [])),
        }, status=status.HTTP_201_CREATED)

class LoginLocalMongoView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LocalLoginSerializer(data = request.data)

        if not serializer.is_valid():
            return Response({"erro": f"Credenciais inválidas: {serializer.errors}"}, status=status.HTTP_400_BAD_REQUEST)

        usuario = None

        email = serializer.validated_data["email"]
        senha = serializer.validated_data["password"]

        try:
            usuario = users.find_one({"email": email})
        except Exception as e:
            return Response({"erro": f"Erro de conexão com o banco: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not usuario:
            return Response(
                {"detail": "Email não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        password_hash = usuario.get("password")
        if not password_hash:
            return Response({"erro": "Essa conta usa apenas login federado"}, status=status.HTTP_403_FORBIDDEN)

        if not check_password(senha, usuario["password"]):
            return Response(
                {"detail": "Senha inválida"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken()
        refresh["user_id"] = str(usuario["_id"])
        refresh["matricula"] = usuario["matricula"]
        refresh["nome"] = usuario["nome"]
        refresh["role"] = usuario["role"]

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "usuario": {
                "id": str(usuario["_id"]),
                "nome": usuario["nome"],
                "matricula": usuario["matricula"],
                "role": usuario["role"]
            }
        }, status=status.HTTP_200_OK)

#Caso de uso: buscar todas as turmas
class GetAllClasses(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            turmas = classes.find()
            lista_turmas = list(turmas)
        except Exception as e:
            print(f"[ERRO BANCO ATLAS]: {e}")
            return Response({"erro": "Falha na comunicação com o banco de dados.", "detalhes": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        if not lista_turmas:
            return Response({"erro": "Nenhuma turma disponível"}, status = status.HTTP_404_NOT_FOUND)

        resposta = []
        for item in lista_turmas:
            resposta.append({
                "id": str(item["_id"]),
                "nome": item.get("nome_turma")
            })

        return Response(resposta, status=status.HTTP_200_OK)