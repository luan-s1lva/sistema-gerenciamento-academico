from rest_framework import serializers

class QuestionSerializer(serializers.Serializer):
    id = serializers.CharField()
    enunciado = serializers.CharField()
    alternativas = serializers.DictField(child=serializers.CharField())
    gabarito = serializers.CharField(max_length=1)
    valor_questao = serializers.FloatField()

class QuizzSerializer(serializers.Serializer):
    id = serializers.CharField(required=False, read_only=True)
    turma_id = serializers.CharField()
    docente_id = serializers.CharField()
    titulo = serializers.CharField()
    descricao = serializers.CharField()
    prazo_inicio = serializers.DateTimeField()
    prazo_fim = serializers.DateTimeField()
    peso_total = serializers.IntegerField()
    questoes = QuestionSerializer(many=True)
    criado_em = serializers.DateTimeField()

class UserSerializer(serializers.Serializer):
    id = serializers.CharField()
    matricula = serializers.CharField()
    nome = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.CharField()
    departamento = serializers.CharField()
    data_cadastro = serializers.DateTimeField()

class CourseSerializer(serializers.Serializer):
    id = serializers.CharField()
    codigo = serializers.CharField()
    nome = serializers.CharField()
    carga_horaria = serializers.IntegerField()
    ementa = serializers.CharField()
    gestor_id = serializers.CharField()
    docentes_ids = serializers.DictField(child=serializers.CharField())
    ativo = serializers.BooleanField()

class ClassSerializer(serializers.Serializer):
    id = serializers.CharField()
    curso_id = serializers.CharField()
    docente_id = serializers.CharField()
    ano = serializers.CharField()
    periodo = serializers.CharField()
    nome_turma = serializers.CharField()
    horario = serializers.CharField()
    discentes_matriculados = serializers.DictField(child=serializers.CharField())
    turma = serializers.CharField()
    ativo = serializers.BooleanField()

class SubmissionSerializer(serializers.Serializer):
    id = serializers.CharField()
    quiz_id = serializers.CharField()
    turma_id = serializers.CharField()
    discente_id = serializers.CharField()
    data_submissao = serializers.DateTimeField()
    respostas_enviadas = serializers.DictField(child=serializers.CharField())
    total_acertos = serializers.IntegerField()
    total_questoes = serializers.IntegerField()
    nota_obtida = serializers.IntegerField()
    status = serializers.CharField()

class QuizSubmissionSerializer(serializers.Serializer):
    discente_id = serializers.CharField()
    respostas_enviadas = serializers.DictField(child=serializers.CharField(max_length=1))

class LocalLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()