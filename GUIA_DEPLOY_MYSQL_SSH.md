# Guia Detalhado: Deploy na HostGator com MySQL (cPanel) e GitHub (SSH)

Este guia é para você que deseja uma solução mais robusta para o banco de dados (MySQL) e um fluxo de deploy mais eficiente usando o GitHub via SSH na HostGator.

Vamos cobrir desde a configuração do MySQL no cPanel até o deploy do seu projeto Flask e Frontend, com as devidas adaptações.

## Parte 1: Preparação do Banco de Dados MySQL no cPanel

Seu projeto Flask usa SQLite por padrão, mas para um ambiente de produção, o MySQL é mais adequado. Você precisará criar um banco de dados e um usuário para ele no cPanel da HostGator.

### 1.1. Acessar o cPanel

1.  Faça login na sua conta HostGator.
2.  Procure pelo link ou botão que te leva ao `cPanel`.

### 1.2. Criar um Banco de Dados MySQL

1.  Dentro do cPanel, procure pela seção `Bancos de Dados` e clique em `Bancos de Dados MySQL®`.
2.  Na seção `Criar Novo Banco de Dados`, digite um nome para o seu banco de dados (ex: `catalogo_db`).
3.  Clique em `Criar Banco de Dados`.

### 1.3. Criar um Usuário MySQL

1.  Na mesma página de `Bancos de Dados MySQL®`, role para baixo até a seção `Usuários MySQL`.
2.  Em `Adicionar Novo Usuário`, digite um nome de usuário (ex: `catalogo_user`).
3.  Crie uma senha forte e anote-a em um local seguro. Você pode usar o gerador de senhas.
4.  Clique em `Criar Usuário`.

### 1.4. Adicionar o Usuário ao Banco de Dados

1.  Ainda na página de `Bancos de Dados MySQL®`, role para baixo até a seção `Adicionar Usuário ao Banco de Dados`.
2.  No campo `Usuário`, selecione o usuário que você acabou de criar (ex: `seu_usuario_cpanel_catalogo_user`).
3.  No campo `Banco de Dados`, selecione o banco de dados que você criou (ex: `seu_usuario_cpanel_catalogo_db`).
4.  Clique em `Adicionar`.
5.  Na próxima tela, marque a caixa `TODOS OS PRIVILÉGIOS`.
6.  Clique em `Fazer Alterações`.

**Anote as seguintes informações, você precisará delas:**
*   **Nome do Banco de Dados**: `seu_usuario_cpanel_catalogo_db` (o prefixo `seu_usuario_cpanel_` é adicionado automaticamente pela HostGator)
*   **Nome de Usuário do Banco de Dados**: `seu_usuario_cpanel_catalogo_user`
*   **Senha do Usuário do Banco de Dados**: A senha que você criou
*   **Host do Banco de Dados**: Geralmente `localhost` (mas pode ser outro, verifique a documentação da HostGator se tiver dúvidas).

## Parte 2: Modificações no Backend (Flask) para MySQL

Você precisará alterar o arquivo `src/main.py` e adicionar uma dependência no `requirements.txt`.

### 2.1. Alterar `src/main.py`

Você fará essa alteração no seu computador local antes de enviar para o GitHub.

1.  Abra o arquivo `backend/catalogo-produtos/src/main.py`.
2.  Localize a linha que configura o `SQLALCHEMY_DATABASE_URI` (provavelmente perto da linha 23 ou 24):
    ```python
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
    ```
3.  **Substitua** essa linha pela configuração do MySQL, usando as informações que você anotou:
    ```python
    # Importar pymysql para o SQLAlchemy poder se conectar ao MySQL
    import pymysql
    pymysql.install_as_MySQLdb()

    # Configuração do banco de dados MySQL
    # Substitua 'seu_usuario_cpanel_catalogo_user', 'sua_senha', 'seu_usuario_cpanel_catalogo_db' e 'localhost'
    app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://seu_usuario_cpanel_catalogo_user:sua_senha@localhost/seu_usuario_cpanel_catalogo_db"
    ```
    *Lembre-se de substituir os placeholders com seus dados reais!*.
4.  Salve o arquivo `main.py`.

### 2.2. Adicionar Dependência ao `requirements.txt`

Você precisa adicionar o `PyMySQL` (ou `mysqlclient`) ao seu `requirements.txt` para que o Flask possa se conectar ao MySQL.

1.  No seu computador local, navegue até a pasta `backend/catalogo-produtos` no terminal.
2.  Ative seu ambiente virtual:
    ```bash
    source venv/bin/activate
    ```
3.  Instale o `PyMySQL`:
    ```bash
    pip install PyMySQL
    ```
4.  Atualize seu `requirements.txt`:
    ```bash
    pip freeze > requirements.txt
    ```

## Parte 3: Subindo as Alterações para o GitHub

Agora que você modificou o backend para usar MySQL, precisa enviar essas mudanças para o seu repositório no GitHub.

1.  No terminal, na pasta `catalogo-produtos` (a raiz do seu projeto, não a do backend):
    ```bash
    git add .
    git commit -m "Configurado backend para usar MySQL e adicionado PyMySQL"
    git push origin main
    ```

## Parte 4: Deploy na HostGator via SSH e GitHub

Esta parte assume que você já tem acesso SSH ativado na sua conta HostGator.

### 4.1. Conectar via SSH

1.  Use um programa como PuTTY (Windows) ou o Terminal (macOS/Linux) para se conectar à sua conta HostGator.
    ```bash
    ssh seuusuario_cpanel@seudominio.com
    ```
    *Substitua `seuusuario_cpanel` pelo seu nome de usuário do cPanel e `seudominio.com` pelo seu domínio.*

### 4.2. Clonar o Repositório GitHub

Vamos clonar seu projeto diretamente do GitHub para o servidor da HostGator.

1.  Navegue até o diretório onde você quer que seu site esteja. Geralmente é `public_html` para o site principal, ou uma subpasta dentro dele (ex: `public_html/catalogo`).
    ```bash
    cd public_html
    # Se for para uma subpasta, crie-a primeiro:
    # mkdir catalogo
    # cd catalogo
    ```
2.  Clone seu repositório GitHub. O `.` (ponto) no final significa que ele vai clonar os arquivos diretamente para o diretório atual, sem criar uma subpasta extra.
    ```bash
    git clone https://github.com/SEU_USUARIO/catalogo-produtos.git .
    ```
    *Se seu repositório for privado, você precisará configurar chaves SSH entre a HostGator e o GitHub. Isso é um tópico um pouco mais avançado, mas o GitHub tem bons guias sobre como adicionar uma chave SSH ao seu repositório.*

### 4.3. Configurar o Ambiente Python (Flask Backend) e WSGI via SSH

Esta é a abordagem mais moderna e flexível para rodar aplicações Python na HostGator, sem depender do `Setup Python App` para a criação do ambiente virtual.

1.  **Conectar via SSH**:
    *   Certifique-se de estar conectado à sua conta HostGator via SSH (conforme o passo 4.1).

2.  **Navegar até a pasta do Backend**:
    *   Vá para a pasta raiz do seu backend Flask. Se você clonou o projeto na raiz de `public_html`, o caminho será:
        ```bash
        cd /home/seuusuario_cpanel/public_html/backend/catalogo-produtos
        ```

3.  **Criar e Ativar o Ambiente Virtual**:
    *   É crucial criar um ambiente virtual para isolar as dependências do seu projeto.
        ```bash
        python3 -m venv venv
        ```
    *   Ative o ambiente virtual:
        ```bash
        source venv/bin/activate
        ```
    *   Você verá `(venv)` no início da linha de comando, indicando que o ambiente está ativo.

4.  **Instalar Dependências**:
    *   Com o ambiente virtual ativo, instale todas as bibliotecas listadas no seu `requirements.txt`, incluindo o `gunicorn` que será usado para servir a aplicação:
        ```bash
        pip install -r requirements.txt gunicorn
        ```
    *   Isso instalará todas as bibliotecas, incluindo o `PyMySQL` e o `gunicorn`.

5.  **Criar o Arquivo WSGI (`passenger_wsgi.py`)**:
    *   A HostGator (e muitos outros hosts) usa o Phusion Passenger para rodar aplicações Python. Ele procura por um arquivo específico, geralmente `passenger_wsgi.py`, na raiz do seu domínio ou subdomínio.
    *   Você precisará criar este arquivo na pasta **raiz do seu domínio/subdomínio** (ex: `/home/seuusuario_cpanel/public_html/` ou `/home/seuusuario_cpanel/public_html/catalogo/`).
    *   Crie o arquivo `passenger_wsgi.py` com o seguinte conteúdo (via SSH usando `nano` ou `vim`, ou via Gerenciador de Arquivos do cPanel):
        ```python
        import sys
        import os

        # Caminho para a pasta raiz do seu projeto Flask (onde está main.py)
        # AJUSTE ESTE CAMINHO PARA O SEU PROJETO REAL NO SERVIDOR!
        PROJECT_ROOT = os.path.join(os.path.dirname(__file__), 'backend', 'catalogo-produtos', 'src')
        sys.path.insert(0, PROJECT_ROOT)

        # Caminho para o ambiente virtual
        # AJUSTE ESTE CAMINHO PARA O SEU AMBIENTE VIRTUAL REAL NO SERVIDOR!
        VIRTUALENV_PATH = os.path.join(os.path.dirname(__file__), 'backend', 'catalogo-produtos', 'venv', 'bin', 'activate_this.py')

        if os.path.exists(VIRTUALENV_PATH):
            exec(open(VIRTUALENV_PATH).read(), dict(__file__=VIRTUALENV_PATH))

        # Importa a aplicação Flask do seu main.py
        from main import app as application
        ```
    *   **ATENÇÃO**: Você precisará ajustar `PROJECT_ROOT` e `VIRTUALENV_PATH` para os caminhos corretos no seu servidor HostGator. Por exemplo, se você clonou o projeto na raiz de `public_html`, `os.path.dirname(__file__)` já apontará para `public_html`.

6.  **Configurar o `.htaccess` para Redirecionamento**:
    *   O arquivo `.htaccess` é usado pelo servidor Apache para direcionar as requisições para sua aplicação Flask.
    *   Crie ou edite o arquivo `.htaccess` na **raiz do seu domínio/subdomínio** (ex: `/home/seuusuario_cpanel/public_html/` ou `/home/seuusuario_cpanel/public_html/catalogo/`).
    *   Adicione o seguinte conteúdo:
        ```apache
        # Ativa o módulo Passenger
        PassengerEnabled On
        PassengerAppRoot /home/seuusuario_cpanel/public_html/backend/catalogo-produtos

        # Define o arquivo WSGI de inicialização
        PassengerPython /home/seuusuario_cpanel/public_html/backend/catalogo-produtos/venv/bin/python
        PassengerAppSourceFile passenger_wsgi.py

        # Redireciona todas as requisições para o Passenger
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^(.*)$ passenger_wsgi.py/$1 [QSA,L]
        ```
    *   **ATENÇÃO**: Ajuste o `PassengerAppRoot` e `PassengerPython` para os caminhos corretos no seu servidor.

7.  **Ajuste no `main.py` para Produção (Importante!)**:
    *   Para ambientes de produção, o Flask não deve usar `app.run()`. Em vez disso, o servidor web (Apache via Passenger/WSGI) será responsável por iniciar a aplicação.
    *   No seu computador local, abra o arquivo `backend/catalogo-produtos/src/main.py`.
    *   Localize a parte final do arquivo:
        ```python
        # if __name__ == '__main__':
        #     app.run(host='0.0.0.0', port=5000, debug=True)
        ```
    *   **Certifique-se de que esta parte está comentada ou removida**, como já fizemos anteriormente. Se não estiver, comente-a.
    *   Salve o `main.py` e **envie a alteração para o GitHub** (passo 3.1 do guia).

8.  **Executar as Migrações do Banco de Dados**:
    *   Como você mudou para MySQL, o `db.create_all()` precisa ser executado para criar as tabelas no novo banco de dados.
    *   Ainda na sessão SSH, com o ambiente virtual ativado (passo 4.3.3), execute um script Python para criar as tabelas:
        ```bash
        python -c "from src.main import app, db; with app.app_context(): db.create_all()"
        ```
    *   Este comando executa um pequeno script Python que inicializa o Flask e cria as tabelas no banco de dados MySQL configurado.

9.  **Reiniciar a Aplicação Passenger**:
    *   Para que as mudanças no `passenger_wsgi.py` e `.htaccess` (e qualquer outra alteração no código) entrem em vigor, você precisa "tocar" no arquivo `tmp/restart.txt` dentro da pasta raiz do seu projeto Flask (`backend/catalogo-produtos`).
    *   No SSH, navegue até a pasta `backend/catalogo-produtos` e execute:
        ```bash
        mkdir -p tmp
        touch tmp/restart.txt
        ```
    *   Isso forçará o Passenger a reiniciar sua aplicação.

### 4.4. Executar as Migrações do Banco de Dados

Como você mudou para MySQL, o `db.create_all()` precisa ser executado para criar as tabelas no novo banco de dados.

1.  Ainda na sessão SSH, com o ambiente virtual ativado (conforme o passo 4.3.3), execute um script Python para criar as tabelas:
    ```bash
    python -c "from src.main import app, db; with app.app_context(): db.create_all()"
    ```
    *Este comando executa um pequeno script Python que inicializa o Flask e cria as tabelas no banco de dados MySQL configurado.*

### 4.5. Configurar o Frontend e Testar

1.  **Ajuste a URL da API no `script.js`**: No seu `script.js` (que estará em `/home/seuusuario_cpanel/public_html/frontend/script.js` se você clonou na raiz de `public_html`), você precisa dizer onde o frontend vai encontrar o backend.
    *   Você pode editar o arquivo via SSH (com `nano` ou `vim`) ou via `Gerenciador de Arquivos` do cPanel.
    *   Procure pela linha `const API_BASE_URL = ...` e altere para a URL do seu backend na HostGator:
        ```javascript
        const API_BASE_URL = 'https://seudominio.com/api';
        // Ou se for um subdiretório, como seudominio.com/catalogo/api
        // const API_BASE_URL = 'https://seudominio.com/catalogo/api';
        ```
    *   **Importante**: Use `https://` se seu site tiver certificado SSL.
    *   Salve as alterações.

2.  **Reiniciar o Aplicativo Python**: Volte para o cPanel, na tela de `Setup Python App`, e clique em `Restart` (Reiniciar) para que as mudanças no backend entrem em vigor.

3.  **Testar seu Site**: Abra seu navegador e digite a URL do seu site (ex: `https://seudominio.com` ou `https://seudominio.com/catalogo`).
    *   Verifique se a página carrega.
    *   Tente adicionar um produto. Se tudo estiver correto, ele deve ser salvo no seu banco de dados MySQL.
    *   Verifique se as operações de edição, exclusão e envio do catálogo funcionam.

## Parte 5: Atualizando o Projeto no Futuro

Uma das grandes vantagens de usar o GitHub via SSH é a facilidade de atualização.

1.  **No seu computador local**: Faça as alterações no seu código, teste-as e envie para o GitHub:
    ```bash
    git add .
    git commit -m "Sua mensagem sobre as novas mudanças"
    git push origin main
    ```

2.  **Na HostGator (via SSH)**:
    *   Conecte-se via SSH.
    *   Navegue até a pasta raiz do seu projeto clonado (ex: `/home/seuusuario_cpanel/public_html/`).
    *   Puxe as atualizações do GitHub:
        ```bash
        git pull origin main
        ```
    *   Se você adicionou novas dependências no `requirements.txt`, instale-as:
        ```bash
        cd backend/catalogo-produtos
        source /home/seuusuario_cpanel/virtualenv/seudominio.com/3.x/bin/activate
        pip install -r requirements.txt
        ```
    *   **Reinicie o Aplicativo Python** no cPanel para que as novas mudanças no backend entrem em vigor.

---

