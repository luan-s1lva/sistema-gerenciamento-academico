from rest_framework.test import APITestCase
from rest_framework import status
from bson import ObjectId
from django.contrib.auth.hashers import make_password
from .database import quizzes, submissions, users

# Create your tests here.
class AutomaticSetupTestingQuizz(APITestCase):
    def setUp(self):
        #Cria uma prova mock no bd real
        self.mock = {
            "class_id": "turma_teste_101",
            "docente_id": "prof_teste_01",
            "titulo": "Prova de Teste Automatizado",
            "descricao": "Avaliação para teste de unidade",
            "prazo_inicio": "2026-09-10T10:00:00Z",
            "prazo_limite": "2026-09-10T23:59:59Z",
            "questoes": [
                {
                    "id": 1,
                    "enunciado": "O que se deve fazer ao iniciar um projeto",
                    "alternativas": {"A": "Começar a codar imediatamente", "B": "Planejar o projeto"},
                    "gabarito": "A",
                    "valor_questao": 50.0
                },
                {
                    "id": 2,
                    "enunciado": "Qual o sentido da vida",
                    "alternativas": {"A": "Vai do gosto do freguês", "B": "A morte"},
                    "gabarito": "B",
                    "valor_questao": 50.0
                }                
            ]
        }

        prova = quizzes.insert_one(self.mock)
        self.quiz_id = str(prova.inserted_id)

    def tearDown(self):
        #Apaga a prova criada anteriormente e as submissões da mesma
        quizzes.delete_one({"_id": ObjectId(self.quiz_id)})
        submissions.delete_many({"quiz_id": ObjectId(self.quiz_id)})

    def teste_visualizacao_pelo_discente_nao_mostra_gabarito(self):
        url = f"/api/prova/visualizar/{self.quiz_id}/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        questoes = response.data.get("questoes", [])
        self.assertEqual(len(questoes), 2)

        for q in questoes:
            self.assertNotIn("gabarito", q, "GABARITO EXPOSTO AO DISCENTE")

    def teste_discente_acertou_tudo(self):
        url = f"/api/prova/submeter/{self.quiz_id}/"
        payload = {
            "discente_id": "aluno_aluno",
            "respostas_enviadas": {
                "1": "A",
                "2": "b"
            }
        }

        #envia as respostas
        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get("total_acertos"), 2)
        self.assertEqual(response.data.get("nota_obtida"), 100.0)

    def teste_discente_acerta_q1_e_erra_q2_nota_50(self):
        url = f"/api/prova/submeter/{self.quiz_id}/"
        payload = {
            "discente_id": "aluno_aluno",
            "respostas_enviadas": {
                "1": "a",
                "2": "a"
            }
        }

        #envia as respostas
        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get("total_acertos"), 1)
        self.assertEqual(response.data.get("nota_obtida"), 50.0)

class AutomaticSetupTestingLocalLogin(APITestCase):
    def setUp(self):
        self.mock = {
                "matricula": "20230045523",
                "nome": "Teste",
                "email": "teste@ufrn.br",
                "password": make_password("senha123"),
                "auth_provider": "LOCAL",
                "role": "DOCENTE",
                "departamento": "DCO",
                "data_cadastro": "2026-09-01T12:00:00Z"
        }

        usuario = users.insert_one(self.mock)
        self.id = str(usuario.inserted_id)

    def tearDown(self):
        users.delete_one({"_id": ObjectId(self.id)})

    def teste_login_local_com_email_errado(self):
        url = f"/api/auth/login/"
        payload = {
            "email": "luan.teste.765@ufrn.edu.br",
            "password": "senha123"
        }

        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data.get("detail"), "Email não encontrado.")

    def teste_login_local_com_senha_errada(self):
            url = f"/api/auth/login/"
            payload = {
                "email": "teste@ufrn.br",
                "password": "123"
            }
    
            response = self.client.post(url, payload, format="json")

            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
            self.assertEqual(response.data.get("detail"), "Senha inválida")

    def teste_login_com_sucesso(self):
        url = f"/api/auth/login/"
        payload = {
            "email": "teste@ufrn.br",
            "password": "senha123"
        }

        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("usuario").get("matricula"), self.mock.get("matricula"))

class AutomaticSetupTestingFederatedLogin(APITestCase):

    def setUp(self):
        self.mock = {
                "matricula": "20230045523",
                "nome": "Teste",
                "email": "teste.federated@ufrn.br",
                "password": None,
                "auth_provider": "FEDERATED",
                "federated_id": 'sub_retornado_pelo_provedor_oauth',
                "role": "DOCENTE",
                "departamento": "DCO",
                "data_cadastro": "2026-09-01T12:00:00Z"
        }

        usuario = users.insert_one(self.mock)
        self.id = str(usuario.inserted_id)

    def tearDown(self):
        users.delete_one({"_id": ObjectId(self.id)})

    def teste_login_em_conta_federada_passando_senha(self):
        url = f"/api/auth/login/"
        payload = {
            "email": "teste.federated@ufrn.br",
            "password": "tentativa_de_senha_local"
        }
                    
        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data.get("erro"), "Essa conta usa apenas login federado")