from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import QuizzSerializer,QuizSubmissionSerializer
from .database import quizzes

# Create your views here.
class QuizCreateView(APIView):
    def cadastrarProva(self, request):
        serializer = QuizzSerializer(data=request.data)
        if not serializer.is_valid:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        result = quizzes.insert_one(serializer.validated_data)

        return Response({
            "message": "Quiz criado",
            "Quiz ID": str(result.inserted_id)
        }, status=status.HTTP_201_CREATED)