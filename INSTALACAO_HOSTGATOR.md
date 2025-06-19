# Guia de Instalação na HostGator

## Pré-requisitos

1. **Conta na HostGator** com suporte a Python
2. **Acesso ao cPanel** ou SSH
3. **Python 3.11+** disponível no servidor

## Passo a Passo para Deploy

### 1. Preparação dos Arquivos

#### Backend
1. Faça upload de toda a pasta `backend/catalogo-produtos/` para o diretório raiz do seu domínio
2. Certifique-se de que os seguintes arquivos estão presentes:
   - `src/main.py`
   - `src/models/produto.py`
   - `src/models/user.py`
   - `src/routes/produto.py`
   - `src/routes/user.py`
   - `requirements.txt`

#### Frontend
1. Faça upload dos arquivos do frontend:
   - `index.html`
   - `script.js`

### 2. Configuração do Ambiente Python

#### Via SSH (Recomendado)
```bash
# Navegue até o diretório do projeto
cd /home/seuusuario/public_html/catalogo-produtos

# Crie um ambiente virtual
python3 -m venv venv

# Ative o ambiente virtual
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt
```

#### Via cPanel (Alternativo)
1. Acesse o **Python App** no cPanel
2. Crie uma nova aplicação Python
3. Selecione Python 3.11+
4. Configure o diretório da aplicação
5. Instale as dependências listadas em `requirements.txt`

### 3. Configuração do Banco de Dados

O sistema usa SQLite por padrão, que não requer configuração adicional. O banco será criado automaticamente na primeira execução.

#### Para usar MySQL (Opcional)
1. Crie um banco de dados MySQL no cPanel
2. Atualize a configuração em `src/main.py`:
```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://usuario:senha@localhost/nome_do_banco'
```

### 4. Configuração do Servidor Web

#### Arquivo .htaccess (Apache)
Crie um arquivo `.htaccess` no diretório raiz:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ /catalogo-produtos/src/main.py/$1 [QSA,L]
```

#### Configuração WSGI
Crie um arquivo `app.wsgi`:
```python
#!/usr/bin/python3
import sys
import os

# Adicione o caminho do projeto
sys.path.insert(0, "/home/seuusuario/public_html/catalogo-produtos/")

# Ative o ambiente virtual
activate_this = '/home/seuusuario/public_html/catalogo-produtos/venv/bin/activate_this.py'
exec(open(activate_this).read(), dict(__file__=activate_this))

from src.main import app as application

if __name__ == "__main__":
    application.run()
```

### 5. Configurações de Produção

#### Atualize src/main.py
```python
import os

# Configurações de produção
if os.environ.get('FLASK_ENV') == 'production':
    app.config['SECRET_KEY'] = 'sua-chave-secreta-super-segura'
    app.config['DEBUG'] = False
else:
    app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'
    app.config['DEBUG'] = True

# Para produção, use uma porta específica ou deixe o servidor web gerenciar
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])
```

#### Atualize script.js
```javascript
// Configuração da API para produção
const API_BASE_URL = window.location.origin + '/api';
// ou especifique a URL completa:
// const API_BASE_URL = 'https://seudominio.com/api';
```

### 6. Teste da Instalação

1. **Teste o Backend**:
   ```bash
   curl https://seudominio.com/api/produtos
   ```

2. **Teste o Frontend**:
   Acesse `https://seudominio.com/index.html`

3. **Teste a Integração**:
   - Adicione um produto através da interface
   - Verifique se aparece na listagem
   - Teste o envio para URL externa

### 7. Monitoramento e Logs

#### Logs do Flask
Os logs estarão disponíveis em:
- `/home/seuusuario/logs/` (via cPanel)
- `/var/log/apache2/error.log` (via SSH)

#### Logs de Erro Comuns
1. **Erro 500**: Verifique permissões dos arquivos
2. **Erro de módulo**: Certifique-se de que todas as dependências estão instaladas
3. **Erro de banco**: Verifique permissões de escrita no diretório

### 8. Segurança

#### Configurações Recomendadas
1. **Altere a SECRET_KEY** para uma chave única e segura
2. **Configure HTTPS** no domínio
3. **Restrinja acesso** ao diretório `venv/` e arquivos `.py`
4. **Configure backup** do banco de dados

#### Arquivo .htaccess de Segurança
```apache
# Proteger arquivos Python
<Files "*.py">
    Order allow,deny
    Deny from all
</Files>

# Proteger ambiente virtual
<Directory "venv">
    Order allow,deny
    Deny from all
</Directory>

# Proteger banco de dados
<Files "*.db">
    Order allow,deny
    Deny from all
</Files>
```

### 9. Manutenção

#### Backup Regular
```bash
# Backup do banco de dados
cp src/database/app.db backup/app_$(date +%Y%m%d).db

# Backup dos arquivos
tar -czf backup/catalogo_$(date +%Y%m%d).tar.gz src/ frontend/
```

#### Atualizações
1. Faça backup antes de qualquer atualização
2. Teste em ambiente de desenvolvimento primeiro
3. Atualize dependências com cuidado:
   ```bash
   pip install --upgrade -r requirements.txt
   ```

### 10. Solução de Problemas

#### Problemas Comuns

**Erro: "Module not found"**
- Verifique se o ambiente virtual está ativo
- Reinstale as dependências: `pip install -r requirements.txt`

**Erro: "Permission denied"**
- Ajuste permissões: `chmod 755 src/main.py`
- Verifique propriedade dos arquivos

**Erro: "Database locked"**
- Verifique permissões de escrita no diretório do banco
- Reinicie a aplicação

**Frontend não carrega produtos**
- Verifique se a URL da API está correta no `script.js`
- Teste a API diretamente: `curl https://seudominio.com/api/produtos`
- Verifique logs de erro no navegador (F12)

### 11. Contato e Suporte

Para problemas específicos da HostGator:
1. Consulte a documentação oficial da HostGator sobre Python
2. Entre em contato com o suporte técnico
3. Verifique os fóruns da comunidade

---

**Nota**: Este guia assume uma instalação padrão da HostGator. Algumas configurações podem variar dependendo do plano e configurações específicas do servidor.

