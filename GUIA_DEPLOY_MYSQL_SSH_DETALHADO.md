# Guia Definitivo: Deploy do Catálogo de Produtos na HostGator com MySQL e GitHub via SSH

Este guia foi criado para você que não é desenvolvedor de profissão e precisa de um passo a passo **extremamente detalhado**, com **todos os comandos** e **explicações claras**, para colocar seu projeto de Catálogo de Produtos online na HostGator. Vamos usar o banco de dados MySQL (mais robusto) e o GitHub via SSH (mais eficiente para atualizações).

**Não se preocupe se você não tem experiência!** Vou explicar cada etapa, cada comando e o porquê de cada ação, como se estivesse te ensinando pessoalmente.

## Visão Geral do Processo

Vamos seguir estes grandes passos:

1.  **Preparar o Banco de Dados MySQL no cPanel**: Criar o banco de dados e o usuário que seu projeto vai usar.
2.  **Ajustar seu Projeto Local**: Fazer pequenas mudanças no seu código no seu computador para ele funcionar com o MySQL e com a HostGator.
3.  **Enviar seu Projeto para o GitHub**: Garantir que a versão mais recente do seu código esteja no GitHub.
4.  **Conectar e Configurar na HostGator via SSH**: Esta é a parte principal, onde vamos usar comandos para colocar seu projeto para rodar no servidor.
5.  **Testar e Finalizar**: Verificar se tudo está funcionando como esperado.
6.  **Atualizar o Projeto no Futuro**: Como fazer para enviar novas mudanças para o site.

--- 

## Parte 1: Preparação do Banco de Dados MySQL no cPanel

Seu projeto Flask usa um banco de dados simples (SQLite) por padrão. Para um site que vai ficar online, o MySQL é mais indicado. Você vai criar um espaço para o banco de dados e um "usuário" para ele no painel da HostGator (cPanel).

### 1.1. Acessar o cPanel

1.  Abra seu navegador de internet (Chrome, Firefox, Edge, etc.).
2.  Vá para o site da HostGator e faça login na sua conta.
3.  Procure pelo link ou botão que te leva ao **`cPanel`**. Geralmente, ele fica na área de gerenciamento dos seus serviços de hospedagem.

### 1.2. Criar um Banco de Dados MySQL

1.  Dentro do cPanel, procure pela seção que fala sobre `Bancos de Dados`. Clique em **`Bancos de Dados MySQL®`**.
2.  Você verá uma área chamada `Criar Novo Banco de Dados`.
3.  No campo de texto, digite um nome para o seu banco de dados. **Sugestão**: `catalogo_db`.
    *   **Importante**: O cPanel vai adicionar um prefixo ao nome que você digitar (ex: `seu_usuario_cpanel_`). Então, o nome final do seu banco de dados será algo como `seu_usuario_cpanel_catalogo_db`.
4.  Clique no botão **`Criar Banco de Dados`**.
5.  Você verá uma mensagem de sucesso. Clique em `Voltar`.

### 1.3. Criar um Usuário MySQL

Agora, vamos criar um "usuário" que terá permissão para acessar e mexer nesse banco de dados.

1.  Na mesma página de `Bancos de Dados MySQL®`, role a tela para baixo até a seção **`Usuários MySQL`**.
2.  Em `Adicionar Novo Usuário`, digite um nome de usuário. **Sugestão**: `catalogo_user`.
    *   **Importante**: Assim como no banco de dados, o cPanel vai adicionar um prefixo ao nome do usuário (ex: `seu_usuario_cpanel_`). Então, o nome final do seu usuário será algo como `seu_usuario_cpanel_catalogo_user`.
3.  No campo `Senha`, crie uma senha **forte**. Use letras maiúsculas, minúsculas, números e símbolos. **Anote essa senha em um local seguro, você vai precisar dela!** Você pode usar o botão `Gerador de Senhas` para criar uma senha segura.
4.  Clique no botão **`Criar Usuário`**.
5.  Você verá uma mensagem de sucesso. Clique em `Voltar`.

### 1.4. Adicionar o Usuário ao Banco de Dados

Agora precisamos dar permissão para o usuário que você criou acessar o banco de dados que você criou.

1.  Ainda na página de `Bancos de Dados MySQL®`, role a tela para baixo até a seção **`Adicionar Usuário ao Banco de Dados`**.
2.  No campo `Usuário`, selecione o usuário que você acabou de criar (ex: `seu_usuario_cpanel_catalogo_user`).
3.  No campo `Banco de Dados`, selecione o banco de dados que você criou (ex: `seu_usuario_cpanel_catalogo_db`).
4.  Clique no botão **`Adicionar`**.
5.  Na próxima tela, chamada `Gerenciar Privilégios de Usuário`, marque a caixa **`TODOS OS PRIVILÉGIOS`**. Isso dá ao seu usuário total controle sobre o banco de dados.
6.  Clique no botão **`Fazer Alterações`**.

**Parabéns! Anote as seguintes informações, você vai precisar delas para configurar seu projeto:**

*   **Nome Completo do Banco de Dados**: `seu_usuario_cpanel_catalogo_db` (com o prefixo do cPanel)
*   **Nome Completo do Usuário do Banco de Dados**: `seu_usuario_cpanel_catalogo_user` (com o prefixo do cPanel)
*   **Senha do Usuário do Banco de Dados**: A senha forte que você criou
*   **Host do Banco de Dados**: Na HostGator, geralmente é **`localhost`**. Se tiver dúvidas, consulte a documentação da HostGator ou o suporte.

--- 

## Parte 2: Modificações no Backend (Flask) para MySQL (No seu Computador Local)

Seu projeto Flask precisa saber que agora vai usar o MySQL em vez do SQLite. Você fará essas mudanças no seu computador e depois as enviará para o GitHub.

### 2.1. Alterar o Arquivo `src/main.py`

Este arquivo é o "coração" do seu backend Flask. Vamos dizer a ele como se conectar ao MySQL.

1.  No seu computador, abra a pasta do seu projeto `catalogo-produtos`.
2.  Navegue até o arquivo: `backend/catalogo-produtos/src/main.py`.
3.  Abra este arquivo com um editor de texto (como VS Code, Sublime Text, Notepad++ ou até o Bloco de Notas).
4.  **Localize a linha que configura o banco de dados SQLite.** Ela deve ser parecida com esta (provavelmente perto da linha 23 ou 24):
    ```python
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
    ```
5.  **Substitua** essa linha por estas novas linhas. **Lembre-se de colocar as informações do seu banco de dados que você anotou na Parte 1.4!**
    ```python
    # Importar pymysql para o SQLAlchemy poder se conectar ao MySQL
    import pymysql
    pymysql.install_as_MySQLdb()

    # Configuração do banco de dados MySQL
    # SUBSTITUA os valores entre aspas com suas credenciais reais do MySQL da HostGator
    app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://seu_usuario_cpanel_catalogo_user:sua_senha@localhost/seu_usuario_cpanel_catalogo_db"
    ```
    *   **Explicação**: Estamos dizendo ao Flask para usar o `PyMySQL` para se conectar a um banco de dados MySQL. A URL de conexão (`mysql+pymysql://...`) contém o usuário, a senha, o host (geralmente `localhost`) e o nome do banco de dados.

6.  **Ajuste Final no `main.py` para Produção (Muito Importante!)**:
    *   Para ambientes online (produção), o Flask não deve ser iniciado com `app.run()`. Isso é para desenvolvimento local. O servidor da HostGator (Apache com Passenger/WSGI) vai cuidar de iniciar sua aplicação.
    *   Role até o final do arquivo `main.py`.
    *   Localize as linhas que começam com `if __name__ == '__main__':` e `app.run(...)`. Elas devem estar assim (ou parecidas):
        ```python
        if __name__ == '__main__':
            app.run(host='0.0.0.0', port=5000, debug=True)
        ```
    *   **Comente ou remova** essas linhas. Para comentar, coloque um `#` na frente de cada linha. Por exemplo:
        ```python
        # if __name__ == '__main__':
        #     app.run(host='0.0.0.0', port=5000, debug=True)
        ```
    *   **Explicação**: Ao comentar essas linhas, você garante que o Flask não tentará iniciar seu próprio servidor quando for executado pelo sistema da HostGator, evitando conflitos.

7.  **Salve** o arquivo `main.py`.

### 2.2. Adicionar Dependência ao `requirements.txt`

Seu projeto precisa de uma nova "biblioteca" (o `PyMySQL`) para se comunicar com o MySQL. Vamos adicioná-la ao seu `requirements.txt`.

1.  No seu computador, abra o **Terminal** (macOS/Linux) ou **Prompt de Comando/PowerShell** (Windows).
2.  Navegue até a pasta do seu backend Flask. **Cuidado para não confundir com a pasta raiz do projeto!**
    ```bash
    # Exemplo para Windows:
    cd C:\Users\SeuUsuario\Downloads\catalogo-produtos\backend\catalogo-produtos

    # Exemplo para macOS/Linux:
    cd /home/seuusuario/Downloads/catalogo-produtos/backend/catalogo-produtos
    ```
3.  **Ative o ambiente virtual** do seu projeto local. Isso garante que as bibliotecas sejam instaladas no lugar certo.
    ```bash
    source venv/bin/activate
    ```
    *   **Explicação**: `source` executa o script `activate` que está dentro da pasta `venv/bin/`. Você verá `(venv)` aparecer no início da linha de comando, indicando que o ambiente está ativo.

4.  **Instale o `PyMySQL`**:
    ```bash
    pip install PyMySQL
    ```
    *   **Explicação**: `pip` é o instalador de pacotes do Python. Este comando baixa e instala a biblioteca `PyMySQL`.

5.  **Atualize seu `requirements.txt`**:
    ```bash
    pip freeze > requirements.txt
    ```
    *   **Explicação**: `pip freeze` lista todas as bibliotecas instaladas no seu ambiente virtual. O `>` redireciona essa lista para o arquivo `requirements.txt`, sobrescrevendo-o com a lista atualizada (que agora inclui o `PyMySQL`).

--- 

## Parte 3: Subindo as Alterações para o GitHub (No seu Computador Local)

Agora que você fez as mudanças para usar o MySQL e ajustou o `main.py` para produção, é hora de enviar essas alterações para o seu repositório no GitHub.

1.  No Terminal/Prompt de Comando, certifique-se de estar na **pasta raiz do seu projeto** (`catalogo-produtos`), não na pasta do backend.
    ```bash
    # Se você está na pasta do backend, volte uma pasta:
    cd ..
    # Ou navegue diretamente para a raiz do projeto:
    # cd C:\Users\SeuUsuario\Downloads\catalogo-produtos
    ```
2.  **Adicione as mudanças ao Git**:
    ```bash
    git add .
    ```
    *   **Explicação**: Este comando diz ao Git para "preparar" todas as mudanças que você fez nos arquivos para serem salvas no próximo "commit". O `.` significa "todos os arquivos e pastas no diretório atual e subdiretórios".

3.  **Faça um "Commit" das mudanças**:
    ```bash
    git commit -m "Configurado backend para usar MySQL, adicionado PyMySQL e ajustado para produção"
    ```
    *   **Explicação**: `git commit` salva as mudanças preparadas. A mensagem (`-m 


Sua mensagem sobre as novas mudanças")` é uma descrição do que você fez. Seja claro e objetivo.

4.  **Envie as mudanças para o GitHub**:
    ```bash
    git push origin main
    ```
    *   **Explicação**: `git push` envia seus commits locais para o repositório remoto no GitHub. `origin` é o nome padrão para o seu repositório no GitHub, e `main` é o nome da sua branch principal. Se for a primeira vez que você faz isso, ele pode pedir seu nome de usuário e senha do GitHub. Se você usa autenticação de dois fatores, precisará de um "Personal Access Token" (PAT) em vez da sua senha normal. (Se precisar de ajuda para criar um PAT, pesquise "GitHub Personal Access Token" no Google).

--- 

## Parte 4: Deploy na HostGator via SSH e GitHub (No Servidor da HostGator)

Esta é a parte onde vamos trabalhar diretamente no servidor da HostGator, usando comandos via SSH. É como se você estivesse sentado na frente do computador da HostGator, mas fazendo tudo por texto.

### 4.1. Conectar via SSH

Para se conectar, você precisará de um programa de terminal que suporte SSH. Se você usa Windows, o PuTTY é uma opção popular, ou você pode usar o PowerShell/CMD. No macOS e Linux, o Terminal já vem com SSH.

1.  **Abra seu Terminal (macOS/Linux/PowerShell) ou PuTTY (Windows)**.
2.  **Digite o comando de conexão SSH**. Você precisará do seu nome de usuário do cPanel, do seu domínio e da porta SSH (que geralmente é diferente da padrão 22 na HostGator).
    *   **Como encontrar a porta SSH**: No seu cPanel, procure pela seção `Segurança` e clique em `Acesso SSH`. Lá você encontrará a porta correta.
    *   **Comando de conexão**: Substitua `seu_usuario_cpanel`, `seudominio.com` e `PORTA_SSH` pelos seus dados reais.
    ```bash
    ssh seu_usuario_cpanel@seudominio.com -p PORTA_SSH
    ```
    *   **Exemplo**: `ssh usuario123@meusite.com.br -p 2222`

3.  **Pressione Enter**.
4.  O terminal pedirá sua **senha**. Digite a senha do seu cPanel. **Atenção**: Ao digitar a senha, nada aparecerá na tela (nem asteriscos `*`). Isso é normal por segurança. Apenas digite e pressione Enter.
5.  Se tudo der certo, você verá uma mensagem de boas-vindas da HostGator e o prompt de comando mudará para algo como `[seu_usuario@servidor ~]$`. Isso significa que você está conectado ao seu servidor!

### 4.2. Clonar o Repositório GitHub para o Servidor

Agora que você está conectado ao servidor, vamos copiar seu projeto do GitHub para lá. Isso é chamado de "clonar" um repositório.

1.  **Navegue até o diretório onde você quer que seu site esteja.**
    *   Para a maioria dos sites principais, o diretório é `public_html`.
    *   Se você quer que seu site seja acessível por um subdomínio (ex: `catalogo.seudominio.com`) ou uma subpasta (ex: `seudominio.com/catalogo`), você precisará criar essa pasta primeiro.
    *   **Comando para ir para `public_html`**: (Digite e pressione Enter)
        ```bash
        cd public_html
        ```
    *   **Se precisar criar uma subpasta (ex: `catalogo`)**: (Digite e pressione Enter)
        ```bash
        mkdir catalogo
        cd catalogo
        ```
        *   **Explicação**: `cd` significa "change directory" (mudar diretório). `mkdir` significa "make directory" (criar diretório).

2.  **Clone seu repositório GitHub.**
    *   Você precisará da URL do seu repositório no GitHub (ex: `https://github.com/SEU_USUARIO/catalogo-produtos.git`). Você encontra essa URL clicando no botão verde `Code` no seu repositório no GitHub.
    *   **Comando para clonar**: O `.` (ponto) no final é importante! Ele diz para o Git clonar os arquivos diretamente para a pasta atual, sem criar uma subpasta extra com o nome do repositório.
        ```bash
        git clone https://github.com/SEU_USUARIO/catalogo-produtos.git .
        ```
    *   **Exemplo**: `git clone https://github.com/meu-usuario/catalogo-produtos.git .`
    *   **Pressione Enter**.
    *   Se seu repositório for privado, ele pode pedir seu nome de usuário e senha do GitHub novamente. Se você tiver autenticação de dois fatores, precisará usar um Personal Access Token (PAT) aqui também.
    *   **Explicação**: `git clone` baixa uma cópia completa do seu repositório do GitHub para o servidor.

### 4.3. Configurar o Ambiente Python (Flask Backend) e WSGI via SSH

Esta é a abordagem mais moderna e flexível para rodar aplicações Python na HostGator, sem depender do `Setup Python App` do cPanel para a criação do ambiente virtual. Vamos criar o ambiente virtual e configurar o WSGI (Web Server Gateway Interface) manualmente.

1.  **Navegar até a pasta do Backend**:
    *   Seu projeto foi clonado e tem as pastas `backend` e `frontend`. Precisamos ir para a pasta do backend para configurar o ambiente Python.
    *   **Comando**: (Digite e pressione Enter)
        ```bash
        cd backend/catalogo-produtos
        ```
    *   **Explicação**: Agora você está dentro da pasta `backend/catalogo-produtos`, onde estão os arquivos do seu servidor Flask (`src/main.py`, `requirements.txt`, etc.).

2.  **Criar o Ambiente Virtual**:
    *   Um ambiente virtual (`venv`) é como uma caixa isolada para o seu projeto Python. Ele garante que as bibliotecas que você instalar para este projeto não interfiram em outros projetos Python no servidor.
    *   **Comando**: (Digite e pressione Enter)
        ```bash
        python3 -m venv venv
        ```
    *   **Explicação**: `python3` garante que você está usando a versão mais recente do Python. `-m venv venv` cria um novo ambiente virtual chamado `venv` dentro da sua pasta atual.

3.  **Ativar o Ambiente Virtual**:
    *   Para usar o ambiente virtual, você precisa ativá-lo.
    *   **Comando**: (Digite e pressione Enter)
        ```bash
        source venv/bin/activate
        ```
    *   **Explicação**: `source` executa o script `activate` que está dentro da pasta `venv/bin/`. Você saberá que o ambiente está ativo porque verá `(venv)` aparecer no início da linha de comando, assim: `(venv) [seu_usuario@servidor catalogo-produtos]$`.

4.  **Instalar Dependências**:
    *   Agora que o ambiente virtual está ativo, vamos instalar todas as bibliotecas que seu projeto Flask precisa, listadas no `requirements.txt`.
    *   **Comando**: (Digite e pressione Enter)
        ```bash
        pip install -r requirements.txt gunicorn
        ```
    *   **Explicação**: `pip` é o instalador de pacotes do Python. `-r requirements.txt` diz para o `pip` instalar tudo que está listado no arquivo `requirements.txt`. Adicionamos `gunicorn` aqui porque ele é um servidor WSGI (Web Server Gateway Interface) que o Apache/Passenger usará para rodar sua aplicação Flask de forma eficiente em produção.
    *   Aguarde a instalação de todas as bibliotecas. Pode demorar um pouco.

5.  **Criar o Arquivo WSGI (`passenger_wsgi.py`)**:
    *   A HostGator (e muitos outros hosts) usa o Phusion Passenger para rodar aplicações Python. Ele procura por um arquivo específico, geralmente `passenger_wsgi.py`, para saber como iniciar sua aplicação.
    *   Este arquivo precisa estar na **raiz do seu domínio/subdomínio** (ex: `/home/seuusuario_cpanel/public_html/` ou `/home/seuusuario_cpanel/public_html/catalogo/`).
    *   **Vamos criar este arquivo diretamente via SSH usando o editor `nano`**.
    *   Primeiro, volte para a pasta raiz do seu domínio/subdomínio:
        ```bash
        cd /home/seu_usuario_cpanel/public_html/
        # Ou cd /home/seu_usuario_cpanel/public_html/catalogo/
        ```
    *   **Comando para criar/editar o arquivo `passenger_wsgi.py`**: (Digite e pressione Enter)
        ```bash
        nano passenger_wsgi.py
        ```
    *   O editor `nano` será aberto. Copie e cole o conteúdo abaixo. **ATENÇÃO: Você precisará ajustar os caminhos `PROJECT_ROOT` e `VIRTUALENV_PATH` para os caminhos corretos no seu servidor!**
        ```python
        import sys
        import os

        # Caminho para a pasta raiz do seu projeto Flask (onde está main.py)
        # AJUSTE ESTE CAMINHO PARA O SEU PROJETO REAL NO SERVIDOR!
        # Exemplo: se passenger_wsgi.py está em /home/seu_usuario_cpanel/public_html/
        # e seu backend está em /home/seu_usuario_cpanel/public_html/backend/catalogo-produtos/
        # então o caminho relativo será 'backend/catalogo-produtos/src'
        PROJECT_ROOT = os.path.join(os.path.dirname(__file__), 'backend', 'catalogo-produtos', 'src')
        sys.path.insert(0, PROJECT_ROOT)

        # Caminho para o ambiente virtual
        # AJUSTE ESTE CAMINHO PARA O SEU AMBIENTE VIRTUAL REAL NO SERVIDOR!
        # Exemplo: se passenger_wsgi.py está em /home/seu_usuario_cpanel/public_html/
        # e seu venv está em /home/seu_usuario_cpanel/public_html/backend/catalogo-produtos/venv/
        # então o caminho relativo será 'backend/catalogo-produtos/venv/bin/activate_this.py'
        VIRTUALENV_PATH = os.path.join(os.path.dirname(__file__), 'backend', 'catalogo-produtos', 'venv', 'bin', 'activate_this.py')

        if os.path.exists(VIRTUALENV_PATH):
            exec(open(VIRTUALENV_PATH).read(), dict(__file__=VIRTUALENV_PATH))

        # Importa a aplicação Flask do seu main.py
        # O nome 'app' é o nome da sua instância Flask em main.py
        from main import app as application
        ```
    *   **Para salvar e sair do `nano`**: Pressione `Ctrl + X`, depois `Y` (para confirmar que quer salvar) e `Enter`.
    *   **Explicação**: Este arquivo diz ao Passenger onde encontrar sua aplicação Flask (`main.py`) e qual ambiente virtual usar para executá-la.

6.  **Configurar o `.htaccess` para Redirecionamento**:
    *   O arquivo `.htaccess` é um arquivo de configuração do servidor Apache. Ele diz ao Apache como lidar com as requisições que chegam ao seu site, direcionando-as para sua aplicação Flask.
    *   Este arquivo também precisa estar na **raiz do seu domínio/subdomínio** (ex: `/home/seuusuario_cpanel/public_html/` ou `/home/seuusuario_cpanel/public_html/catalogo/`).
    *   **Vamos criar/editar este arquivo diretamente via SSH usando o editor `nano`**.
    *   Certifique-se de estar na pasta raiz do seu domínio/subdomínio (onde você criou o `passenger_wsgi.py`).
    *   **Comando para criar/editar o arquivo `.htaccess`**: (Digite e pressione Enter)
        ```bash
        nano .htaccess
        ```
    *   O editor `nano` será aberto. Copie e cole o conteúdo abaixo. **ATENÇÃO: Você precisará ajustar os caminhos `PassengerAppRoot` e `PassengerPython` para os caminhos corretos no seu servidor!**
        ```apache
        # Ativa o módulo Passenger
        PassengerEnabled On
        # Caminho para a pasta raiz do seu projeto Flask (onde está o venv e o src)
        # AJUSTE ESTE CAMINHO PARA O SEU PROJETO REAL NO SERVIDOR!
        PassengerAppRoot /home/seu_usuario_cpanel/public_html/backend/catalogo-produtos

        # Define o interpretador Python do seu ambiente virtual
        # AJUSTE ESTE CAMINHO PARA O SEU AMBIENTE VIRTUAL REAL NO SERVIDOR!
        PassengerPython /home/seu_usuario_cpanel/public_html/backend/catalogo-produtos/venv/bin/python

        # Define o arquivo WSGI de inicialização
        PassengerAppSourceFile passenger_wsgi.py

        # Redireciona todas as requisições para o Passenger
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^(.*)$ passenger_wsgi.py/$1 [QSA,L]
        ```
    *   **Para salvar e sair do `nano`**: Pressione `Ctrl + X`, depois `Y` (para confirmar que quer salvar) e `Enter`.
    *   **Explicação**: Este `.htaccess` diz ao Apache para usar o Passenger para rodar sua aplicação Python. Ele aponta para a raiz do seu projeto Flask (`PassengerAppRoot`), para o interpretador Python dentro do seu ambiente virtual (`PassengerPython`), e para o arquivo `passenger_wsgi.py` que criamos.

### 4.4. Executar as Migrações do Banco de Dados

Agora que o ambiente está configurado e o Flask sabe como se conectar ao MySQL, precisamos dizer ao Flask para criar as tabelas no seu novo banco de dados MySQL.

1.  **Navegue de volta para a pasta do seu backend Flask**:
    ```bash
    cd /home/seu_usuario_cpanel/public_html/backend/catalogo-produtos
    ```
2.  **Ative o ambiente virtual** (se ele não estiver ativo):
    ```bash
    source venv/bin/activate
    ```
3.  **Execute o comando para criar as tabelas**: (Digite e pressione Enter)
    ```bash
    python -c "from src.main import app, db; with app.app_context(): db.create_all()"
    ```
    *   **Explicação**: Este é um comando Python curto que importa sua aplicação Flask (`app`) e o objeto de banco de dados (`db`) do seu `main.py`. `with app.app_context():` garante que o comando seja executado no contexto da sua aplicação Flask, o que é necessário para interagir com o banco de dados. `db.create_all()` é o comando que realmente cria as tabelas no MySQL, baseado nos modelos que você definiu (`Produto`).
    *   Você não verá uma mensagem de sucesso, mas se não houver erros, as tabelas foram criadas.

### 4.5. Configurar o Frontend e Testar

Seu frontend (HTML/CSS/JavaScript) precisa saber onde encontrar a API do seu backend.

1.  **Ajuste a URL da API no `script.js`**:
    *   No seu computador local, abra o arquivo `frontend/script.js`.
    *   Procure pela linha que define `API_BASE_URL`. Ela deve ser parecida com:
        ```javascript
        const API_BASE_URL = 'http://localhost:5001/api';
        ```
    *   **Altere** essa linha para a URL real do seu backend na HostGator. Se você configurou seu backend para ser acessível em `seudominio.com/api`, então será:
        ```javascript
        const API_BASE_URL = 'https://seudominio.com/api';
        // Ou se for um subdiretório, como seudominio.com/catalogo/api
        // const API_BASE_URL = 'https://seudominio.com/catalogo/api';
        ```
    *   **Importante**: Use `https://` se seu site tiver um certificado SSL (o que é altamente recomendado e padrão hoje em dia).
    *   **Salve** o arquivo `script.js`.
    *   **Envie esta alteração para o GitHub** (use `git add .`, `git commit -m 


Atualizado URL da API no frontend"`, `git push origin main`).

2.  **Reiniciar a Aplicação Passenger**:
    *   Para que todas as mudanças que você fez (código, `.htaccess`, `passenger_wsgi.py`) entrem em vigor, você precisa "tocar" em um arquivo especial que força o Passenger a reiniciar sua aplicação.
    *   No SSH, certifique-se de estar na pasta raiz do seu projeto Flask (`/home/seu_usuario_cpanel/public_html/backend/catalogo-produtos`).
    *   **Comandos**: (Digite e pressione Enter)
        ```bash
        mkdir -p tmp
        touch tmp/restart.txt
        ```
    *   **Explicação**: `mkdir -p tmp` cria uma pasta chamada `tmp` se ela não existir. `touch tmp/restart.txt` cria um arquivo vazio chamado `restart.txt` dentro da pasta `tmp`. Apenas a existência ou a atualização da data/hora deste arquivo faz com que o Passenger reinicie sua aplicação.

3.  **Testar seu Site**: (Finalmente!)
    *   Abra seu navegador de internet.
    *   Digite a URL do seu site (ex: `https://seudominio.com` ou `https://seudominio.com/catalogo`).
    *   **Verifique se a página carrega corretamente.** Se não carregar, verifique os logs de erro (no cPanel, procure por `Logs de Erro` ou `Error Logs`).
    *   **Tente adicionar um produto.** Preencha os campos e clique em salvar. Se tudo estiver correto, o produto deve aparecer na lista e ser salvo no seu banco de dados MySQL.
    *   **Verifique se as operações de edição, exclusão e envio do catálogo funcionam.** Observe se os alertas aparecem e se os dados são atualizados.

**Parabéns! Se você chegou até aqui com sucesso, seu Catálogo de Produtos está online na HostGator!**

--- 

## Parte 5: Atualizando o Projeto no Futuro (Fluxo de Trabalho)

Uma das grandes vantagens de usar o GitHub e SSH é a facilidade de atualizar seu site sempre que você fizer mudanças no código.

### 5.1. No seu Computador Local (Quando fizer mudanças no código)

1.  **Faça as alterações** no seu código (backend ou frontend) no seu computador.
2.  **Teste as mudanças** localmente para garantir que tudo funciona.
3.  **Abra o Terminal/Prompt de Comando** e navegue até a **raiz do seu projeto** (`catalogo-produtos`).
4.  **Adicione as mudanças ao Git**:
    ```bash
    git add .
    ```
5.  **Faça um "Commit" das mudanças** (com uma mensagem clara sobre o que você alterou):
    ```bash
    git commit -m "Sua mensagem sobre as novas mudanças"
    ```
6.  **Envie as novas versões para o GitHub**:
    ```bash
    git push origin main
    ```

### 5.2. Na HostGator (Para aplicar as mudanças no site online)

1.  **Conecte-se via SSH** à sua conta HostGator (conforme o passo 4.1).
2.  **Navegue até a pasta raiz do seu projeto clonado** na HostGator (ex: `/home/seu_usuario_cpanel/public_html/`).
    ```bash
    cd /home/seu_usuario_cpanel/public_html/
    # Ou cd /home/seu_usuario_cpanel/public_html/catalogo/
    ```
3.  **Puxe as atualizações do GitHub**:
    ```bash
    git pull origin main
    ```
    *   **Explicação**: Este comando baixa todas as mudanças que você enviou para o GitHub para o seu servidor da HostGator.

4.  **Se você adicionou novas dependências no `requirements.txt`** (além das que já instalou):
    *   Navegue até a pasta do backend:
        ```bash
        cd backend/catalogo-produtos
        ```
    *   Ative o ambiente virtual:
        ```bash
        source venv/bin/activate
        ```
    *   Instale as novas dependências:
        ```bash
        pip install -r requirements.txt
        ```
    *   Volte para a raiz do seu projeto clonado:
        ```bash
        cd ..
        cd ..
        ```

5.  **Se você fez alterações no banco de dados** (ex: adicionou novas colunas em um modelo, criou um novo modelo):
    *   Navegue até a pasta do backend:
        ```bash
        cd backend/catalogo-produtos
        ```
    *   Ative o ambiente virtual:
        ```bash
        source venv/bin/activate
        ```
    *   Execute o comando de migração (o mesmo que você usou na Parte 4.4):
        ```bash
        python -c "from src.main import app, db; with app.app_context(): db.create_all()"
        ```
    *   Volte para a raiz do seu projeto clonado:
        ```bash
        cd ..
        cd ..
        ```

6.  **Reinicie a Aplicação Passenger**:
    *   Para que as novas mudanças no código entrem em vigor, você precisa reiniciar a aplicação Flask. Faça isso "tocando" no arquivo `tmp/restart.txt` dentro da pasta raiz do seu projeto Flask (`backend/catalogo-produtos`).
    *   Navegue até a pasta do backend:
        ```bash
        cd backend/catalogo-produtos
        ```
    *   **Comandos**: (Digite e pressione Enter)
        ```bash
        mkdir -p tmp
        touch tmp/restart.txt
        ```
    *   Volte para a raiz do seu projeto clonado:
        ```bash
        cd ..
        cd ..
        ```

--- 

Espero que este guia super detalhado seja exatamente o que você precisa! Se tiver qualquer dúvida em qualquer etapa, não hesite em perguntar. Estou aqui para ajudar!

