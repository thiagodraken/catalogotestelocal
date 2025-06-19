# Sistema de Catálogo de Produtos

Este é um sistema completo para gerenciamento de catálogo de produtos com integração para envio de dados para URLs externas.

## Estrutura do Projeto

```
catalogo-produtos/
├── backend/
│   └── catalogo-produtos/
│       ├── src/
│       │   ├── models/
│       │   │   ├── user.py
│       │   │   └── produto.py
│       │   ├── routes/
│       │   │   ├── user.py
│       │   │   └── produto.py
│       │   ├── static/
│       │   ├── database/
│       │   └── main.py
│       ├── venv/
│       └── requirements.txt
└── frontend/
    ├── index.html
    └── script.js
```

## Funcionalidades

### Backend (Flask)
- **API RESTful** para gerenciamento de produtos
- **CRUD completo** (Create, Read, Update, Delete)
- **Modelo de dados** com campos: ID, Nome, Categoria, Descrição, Data, Imagens, URL de destino
- **Concatenação de URLs de imagens** em uma única string
- **Endpoint especial** para envio do catálogo para URL externa
- **CORS habilitado** para integração com frontend
- **Banco de dados SQLite** para persistência

### Frontend (HTML/CSS/JavaScript)
- **Interface moderna e responsiva**
- **Formulário para inclusão/edição** de produtos
- **Upload múltiplo de imagens** com drag & drop
- **Listagem visual** dos produtos em cards
- **Configuração da URL de destino** customizável
- **Botão para envio** do catálogo completo
- **Alertas e feedback** visual para o usuário

## Endpoints da API

### Produtos
- `GET /api/produtos` - Lista todos os produtos
- `POST /api/produtos` - Cria um novo produto
- `GET /api/produtos/{id}` - Busca um produto específico
- `PUT /api/produtos/{id}` - Atualiza um produto
- `DELETE /api/produtos/{id}` - Exclui um produto

### Envio de Catálogo
- `POST /api/enviar-catalogo` - Envia todos os produtos para URL externa

## Formato dos Dados

### Produto
```json
{
  "id": 1,
  "nome": "Nome do Produto",
  "categoria": "Categoria",
  "descricao": "Descrição do produto",
  "data": "2025-06-18T14:00:00",
  "imagens": "url1,url2,url3",
  "url_destino": "https://exemplo.com/produto"
}
```

### Envio de Catálogo
```json
{
  "produtos": [
    {
      "id": 1,
      "nome": "Produto 1",
      "categoria": "Eletrônicos",
      "descricao": "Descrição",
      "data": "2025-06-18T14:00:00",
      "imagens": "url1,url2",
      "url_destino": "https://exemplo.com/produto1"
    }
  ],
  "total_produtos": 1
}
```

## Como Executar

### Backend
1. Navegue até a pasta do backend:
   ```bash
   cd backend/catalogo-produtos
   ```

2. Ative o ambiente virtual:
   ```bash
   source venv/bin/activate
   ```

3. Execute o servidor:
   ```bash
   python src/main.py
   ```

O servidor estará disponível em `http://localhost:5001`

### Frontend
1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Abra o arquivo `index.html` em um navegador ou sirva através de um servidor web local.

## Configuração para HostGator

### Preparação dos Arquivos
1. **Backend**: Faça upload de todos os arquivos da pasta `backend/catalogo-produtos/`
2. **Frontend**: Faça upload dos arquivos `index.html` e `script.js`
3. **Dependências**: Certifique-se de que o `requirements.txt` está atualizado

### Configurações Necessárias
1. **Python**: Verifique se a HostGator suporta Python 3.11+
2. **Banco de dados**: O SQLite está incluído, mas você pode migrar para MySQL se necessário
3. **CORS**: Já configurado para aceitar requisições de qualquer origem
4. **Porta**: Ajuste a porta conforme necessário (padrão: 5001)

### Variáveis de Ambiente
- Configure a `SECRET_KEY` do Flask para produção
- Ajuste a URL da API no frontend (`API_BASE_URL` no script.js)

## Recursos Implementados

✅ **Inclusão de produtos** com todos os campos solicitados  
✅ **Edição de produtos** com possibilidade de adicionar/remover imagens  
✅ **Exclusão de produtos** com confirmação  
✅ **Concatenação de URLs de imagens** em string única  
✅ **Envio para URL customizável** em formato JSON  
✅ **Interface responsiva** e moderna  
✅ **Validação de dados** no frontend e backend  
✅ **Feedback visual** com alertas e loading  
✅ **Upload múltiplo de imagens** com preview  

## Tecnologias Utilizadas

- **Backend**: Flask, SQLAlchemy, Flask-CORS
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Banco de dados**: SQLite
- **Estilo**: CSS Grid, Flexbox, Gradientes, Animações

## Próximos Passos

1. **Teste local** completo do sistema
2. **Deploy na HostGator** seguindo as instruções
3. **Configuração da URL de destino** real
4. **Testes de integração** com o sistema externo

