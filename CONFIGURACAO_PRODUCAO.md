# Configuração de Produção para HostGator

## Arquivo de Configuração WSGI

### app.wsgi
```python
#!/usr/bin/python3
import sys
import os

# Adicione o caminho do projeto (AJUSTE CONFORME SEU DIRETÓRIO)
sys.path.insert(0, "/home/seuusuario/public_html/catalogo-produtos/")

# Ative o ambiente virtual (AJUSTE O CAMINHO)
activate_this = '/home/seuusuario/public_html/catalogo-produtos/venv/bin/activate_this.py'
if os.path.exists(activate_this):
    exec(open(activate_this).read(), dict(__file__=activate_this))

from src.main import app as application

if __name__ == "__main__":
    application.run()
```

## Configuração do Apache (.htaccess)

### .htaccess (Diretório Raiz)
```apache
RewriteEngine On

# Redirecionar chamadas da API para o Flask
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ /cgi-bin/catalogo-produtos.cgi/$1 [QSA,L]

# Servir arquivos estáticos normalmente
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]
```

### catalogo-produtos.cgi
```bash
#!/bin/bash
cd /home/seuusuario/public_html/catalogo-produtos
source venv/bin/activate
python src/main.py
```

## Configuração de Produção do Flask

### src/main.py (Versão Produção)
```python
import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.models.produto import Produto
from src.routes.user import user_bp
from src.routes.produto import produto_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Configurações de produção
if os.environ.get('FLASK_ENV') == 'production':
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'sua-chave-secreta-super-segura-aqui')
    app.config['DEBUG'] = False
else:
    app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'
    app.config['DEBUG'] = True

# Habilitar CORS para todas as rotas
CORS(app, origins=['*'])

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(produto_bp, url_prefix='/api')

# Configuração do banco de dados
db_path = os.path.join(os.path.dirname(__file__), 'database', 'app.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
with app.app_context():
    # Criar diretório do banco se não existir
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

# Para execução via CGI/WSGI
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=app.config.get('DEBUG', False))
```

## Frontend Configurado para Produção

### script.js (Versão Produção)
```javascript
// Configuração da API - Detecta automaticamente o ambiente
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5001/api' 
    : window.location.origin + '/api';

// Estado da aplicação
let produtos = [];
let imagensTemporarias = [];
let editandoProduto = null;

// Resto do código permanece igual...
```

## Estrutura de Diretórios para HostGator

```
public_html/
├── catalogo-produtos/
│   ├── src/
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   └── produto.py
│   │   ├── routes/
│   │   │   ├── user.py
│   │   │   └── produto.py
│   │   ├── database/
│   │   │   └── app.db (criado automaticamente)
│   │   └── main.py
│   ├── venv/
│   └── requirements.txt
├── index.html
├── script.js
├── .htaccess
└── app.wsgi
```

## Comandos de Deploy

### 1. Upload via FTP/SFTP
```bash
# Compactar projeto localmente
tar -czf catalogo-produtos.tar.gz backend/catalogo-produtos/ frontend/

# Upload para servidor
# Use seu cliente FTP preferido (FileZilla, WinSCP, etc.)

# Descompactar no servidor (via SSH)
cd /home/seuusuario/public_html
tar -xzf catalogo-produtos.tar.gz
```

### 2. Configuração via SSH
```bash
# Conectar via SSH
ssh seuusuario@seudominio.com

# Navegar para o diretório
cd public_html

# Mover arquivos para posição correta
mv backend/catalogo-produtos ./
mv frontend/* ./

# Configurar ambiente virtual
cd catalogo-produtos
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Ajustar permissões
chmod 755 src/main.py
chmod 755 app.wsgi
chmod -R 755 venv/
```

### 3. Teste de Funcionamento
```bash
# Testar API
curl https://seudominio.com/api/produtos

# Testar frontend
curl https://seudominio.com/

# Verificar logs
tail -f /home/seuusuario/logs/error.log
```

## Variáveis de Ambiente

### .env (Opcional)
```bash
FLASK_ENV=production
SECRET_KEY=sua-chave-secreta-super-segura
DATABASE_URL=sqlite:///database/app.db
CORS_ORIGINS=https://seudominio.com
```

## Monitoramento

### Script de Monitoramento (monitor.py)
```python
#!/usr/bin/env python3
import requests
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_api():
    try:
        response = requests.get('https://seudominio.com/api/produtos', timeout=10)
        if response.status_code == 200:
            logger.info("API está funcionando")
            return True
        else:
            logger.error(f"API retornou status {response.status_code}")
            return False
    except Exception as e:
        logger.error(f"Erro ao verificar API: {e}")
        return False

if __name__ == "__main__":
    while True:
        check_api()
        time.sleep(300)  # Verificar a cada 5 minutos
```

## Backup Automático

### Script de Backup (backup.sh)
```bash
#!/bin/bash
BACKUP_DIR="/home/seuusuario/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup do banco de dados
cp /home/seuusuario/public_html/catalogo-produtos/src/database/app.db $BACKUP_DIR/app_$DATE.db

# Backup dos arquivos
tar -czf $BACKUP_DIR/catalogo_$DATE.tar.gz /home/seuusuario/public_html/catalogo-produtos/

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup concluído: $DATE"
```

### Crontab para Backup Automático
```bash
# Editar crontab
crontab -e

# Adicionar linha para backup diário às 2h da manhã
0 2 * * * /home/seuusuario/scripts/backup.sh
```

