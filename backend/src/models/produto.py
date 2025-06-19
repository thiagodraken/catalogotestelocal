from src.models.user import db
from datetime import datetime

class Produto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    categoria = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    data = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    imagens = db.Column(db.Text, nullable=True)  # URLs das imagens concatenadas em uma string
    url_destino = db.Column(db.String(500), nullable=True)

    def __repr__(self):
        return f'<Produto {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'categoria': self.categoria,
            'descricao': self.descricao,
            'data': self.data.isoformat() if self.data else None,
            'imagens': self.imagens,
            'url_destino': self.url_destino
        }

    def get_imagens_list(self):
        """Retorna as URLs das imagens como uma lista"""
        if self.imagens:
            return [url.strip() for url in self.imagens.split(',') if url.strip()]
        return []

    def set_imagens_list(self, urls_list):
        """Define as URLs das imagens a partir de uma lista"""
        if urls_list:
            self.imagens = ','.join([url.strip() for url in urls_list if url.strip()])
        else:
            self.imagens = None

