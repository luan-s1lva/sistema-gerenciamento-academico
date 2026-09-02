# academic/models.py
# 
# Nota de Arquitetura:
# Este projeto utiliza persistência NoSQL com MongoDB Atlas via driver PyMongo.
# A validação de esquemas e serialização de dados é gerenciada por serializers.py
# e o acesso ao banco ocorre diretamente em database.py