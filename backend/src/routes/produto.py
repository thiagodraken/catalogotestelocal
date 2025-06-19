from flask import Blueprint, jsonify, request
import requests
from src.models.produto import Produto, db

produto_bp = Blueprint('produto', __name__)

@produto_bp.route('/produtos', methods=['GET'])
def get_produtos():
    """Retorna todos os produtos"""
    produtos = Produto.query.all()
    return jsonify([produto.to_dict() for produto in produtos])

@produto_bp.route('/produtos', methods=['POST'])
def create_produto():
    """Cria um novo produto"""
    data = request.json
    
    produto = Produto(
        nome=data['nome'],
        categoria=data['categoria'],
        descricao=data.get('descricao', ''),
        url_destino=data.get('url_destino', '')
    )
    
    # Processar imagens se fornecidas
    if 'imagens' in data and data['imagens']:
        if isinstance(data['imagens'], list):
            produto.set_imagens_list(data['imagens'])
        else:
            produto.imagens = data['imagens']
    
    db.session.add(produto)
    db.session.commit()
    return jsonify(produto.to_dict()), 201

@produto_bp.route('/produtos/<int:produto_id>', methods=['GET'])
def get_produto(produto_id):
    """Retorna um produto específico"""
    produto = Produto.query.get_or_404(produto_id)
    return jsonify(produto.to_dict())

@produto_bp.route('/produtos/<int:produto_id>', methods=['PUT'])
def update_produto(produto_id):
    """Atualiza um produto existente"""
    produto = Produto.query.get_or_404(produto_id)
    data = request.json
    
    produto.nome = data.get('nome', produto.nome)
    produto.categoria = data.get('categoria', produto.categoria)
    produto.descricao = data.get('descricao', produto.descricao)
    produto.url_destino = data.get('url_destino', produto.url_destino)
    
    # Processar imagens se fornecidas
    if 'imagens' in data:
        if isinstance(data['imagens'], list):
            produto.set_imagens_list(data['imagens'])
        else:
            produto.imagens = data['imagens']
    
    db.session.commit()
    return jsonify(produto.to_dict())

@produto_bp.route('/produtos/<int:produto_id>', methods=['DELETE'])
def delete_produto(produto_id):
    """Exclui um produto"""
    produto = Produto.query.get_or_404(produto_id)
    db.session.delete(produto)
    db.session.commit()
    return '', 204

@produto_bp.route('/enviar-catalogo', methods=['POST'])
def enviar_catalogo():
    """Envia todos os produtos para a URL de destino configurável"""
    data = request.json
    url_destino = data.get('url_destino', 'https://ra-bcknd.com/v1/api-trigger/n878vcj28crk35f9u4l6')
    
    # Buscar todos os produtos
    produtos = Produto.query.all()
    
    # Preparar dados para envio
    catalogo_data = {
        'produtos': [produto.to_dict() for produto in produtos],
        'total_produtos': len(produtos)
    }
    
    try:
        # Enviar dados para a URL de destino
        response = requests.post(url_destino, json=catalogo_data, timeout=30)
        
        if response.status_code == 200:
            return jsonify({
                'success': True,
                'message': 'Catálogo enviado com sucesso',
                'url_destino': url_destino,
                'total_produtos': len(produtos)
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': f'Erro ao enviar catálogo: {response.status_code}',
                'url_destino': url_destino
            }), 400
            
    except requests.exceptions.RequestException as e:
        return jsonify({
            'success': False,
            'message': f'Erro de conexão: {str(e)}',
            'url_destino': url_destino
        }), 500

