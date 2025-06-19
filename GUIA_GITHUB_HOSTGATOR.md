# Guia: Subindo o Projeto para o GitHub e Deploy na HostGator

Este guia detalha como versionar seu projeto no GitHub e como utilizá-lo para fazer o deploy na HostGator.

## 1. Subindo o Projeto para o GitHub

### 1.1. Inicializar o Git Localmente

Primeiro, você precisa inicializar um repositório Git na pasta raiz do seu projeto (`catalogo-produtos/`).

1.  Abra o terminal ou prompt de comando.
2.  Navegue até a pasta raiz do seu projeto:
    ```bash
    cd /caminho/para/seu/projeto/catalogo-produtos
    ```
3.  Inicialize o repositório Git:
    ```bash
    git init
    ```

### 1.2. Adicionar Arquivos e Fazer o Primeiro Commit

É importante ignorar arquivos que não devem ir para o repositório (como a pasta `venv/` do Python).

1.  Crie um arquivo `.gitignore` na raiz do seu projeto (`catalogo-produtos/`) com o seguinte conteúdo:
    ```
    # Python
    venv/
    *.pyc
    .env

    # Database
    *.db

    # Node modules (if using npm/yarn in frontend)
    node_modules/

    # Logs
    *.log

    # OS generated files
    .DS_Store
    .localized
    Thumbs.db
    ```
2.  Adicione todos os arquivos do projeto ao stage:
    ```bash
    git add .
    ```
3.  Faça o primeiro commit:
    ```bash
    git commit -m "Primeiro commit: Estrutura inicial do catálogo de produtos"
    ```

### 1.3. Criar um Repositório no GitHub

1.  Acesse o GitHub e faça login na sua conta.
2.  No canto superior direito, clique no sinal de `+` e selecione `New repository`.
3.  Preencha os detalhes:
    -   **Repository name**: `catalogo-produtos` (ou o nome que preferir)
    -   **Description**: (Opcional) Uma breve descrição do seu projeto.
    -   **Public/Private**: Escolha se o repositório será público ou privado.
    -   **NÃO** marque a opção para inicializar o repositório com um README, .gitignore ou licença, pois você já os tem localmente.
4.  Clique em `Create repository`.

### 1.4. Conectar o Repositório Local ao GitHub

Após criar o repositório no GitHub, você verá instruções para conectar seu repositório local. Siga as instruções para 


adicionar o remote e fazer o push inicial:

1.  Adicione o repositório remoto:
    ```bash
    git remote add origin https://github.com/SEU_USUARIO/catalogo-produtos.git
    # Ou se usar SSH:
    # git remote add origin git@github.com:SEU_USUARIO/catalogo-produtos.git
    ```
    *Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub.*

2.  Renomeie a branch principal (opcional, mas recomendado para `main`):
    ```bash
    git branch -M main
    ```

3.  Envie seus arquivos para o GitHub:
    ```bash
    git push -u origin main
    ```

Seus arquivos agora estarão no GitHub!

## 2. Usando o GitHub para Hospedar na HostGator

Existem algumas maneiras de usar seu repositório GitHub para fazer o deploy na HostGator. As opções variam em complexidade e automação.

### Opção 1: Download Manual (Mais Simples)

Esta é a forma mais direta e recomendada para quem está começando ou para projetos que não exigem deploy contínuo.

1.  **No GitHub**: Acesse seu repositório no GitHub.
2.  Clique no botão verde `Code`.
3.  Selecione `Download ZIP`.
4.  **Na HostGator**: Faça o upload do arquivo `.zip` para o seu servidor via cPanel (Gerenciador de Arquivos) ou FTP/SFTP.
5.  Descompacte o arquivo no diretório correto (geralmente `public_html` ou um subdiretório).
6.  Siga as instruções de instalação e configuração do backend e frontend conforme o arquivo `INSTALACAO_HOSTGATOR.md` e `CONFIGURACAO_PRODUCAO.md` que você já possui.

    *Vantagens*: Simples, não exige ferramentas adicionais.
    *Desvantagens*: Processo manual, sem automação para atualizações.

### Opção 2: Clonar o Repositório via SSH (Mais Avançado)

Se você tem acesso SSH à sua conta HostGator, pode clonar o repositório diretamente.

1.  **Na HostGator (via SSH)**:
    -   Conecte-se à sua conta HostGator via SSH.
    -   Navegue até o diretório onde deseja hospedar o projeto (ex: `cd public_html`).
    -   Clone seu repositório GitHub:
        ```bash
        git clone https://github.com/SEU_USUARIO/catalogo-produtos.git .
        # O ponto final no final clona para o diretório atual
        ```
        *Se seu repositório for privado, você precisará configurar chaves SSH entre a HostGator e o GitHub.*

2.  **Configuração**: Siga as instruções de instalação e configuração do backend e frontend conforme o arquivo `INSTALACAO_HOSTGATOR.md` e `CONFIGURACAO_PRODUCAO.md`.

3.  **Atualizações**: Para atualizar o projeto no servidor, basta navegar até o diretório e usar `git pull`:
    ```bash
    cd /caminho/para/seu/projeto/na/hostgator
    git pull origin main
    ```

    *Vantagens*: Mais rápido para atualizações, versionamento direto no servidor.
    *Desvantagens*: Requer acesso SSH e conhecimento básico de Git no terminal.

### Opção 3: GitHub Actions (Automação de CI/CD - Mais Complexo)

Esta é a opção mais avançada e automatizada, mas pode ser mais complexa de configurar na HostGator, pois exige que a HostGator permita a execução de scripts externos ou que você configure um servidor intermediário.

1.  **No GitHub**: Crie um workflow de GitHub Actions (`.github/workflows/deploy.yml`) que se conecte à sua HostGator via SSH/FTP e faça o deploy dos arquivos quando houver um push para a branch `main`.
    -   Isso geralmente envolve o uso de ações de terceiros para SSH/FTP e a configuração de segredos no GitHub para suas credenciais da HostGator.

2.  **Na HostGator**: Certifique-se de que sua conta HostGator permite conexões SSH/FTP para automação e que você tem as permissões necessárias.

    *Vantagens*: Deploy totalmente automatizado a cada push, CI/CD.
    *Desvantagens*: Complexidade de configuração, dependência das permissões e recursos da HostGator.

### Recomendações

-   Para a maioria dos usuários da HostGator e para este tipo de projeto, a **Opção 1 (Download Manual)** ou a **Opção 2 (Clonar via SSH)** são as mais práticas.
-   Sempre teste suas alterações localmente antes de fazer o deploy.
-   Mantenha seu arquivo `.gitignore` atualizado para evitar o envio de arquivos desnecessários ou sensíveis para o GitHub.

Espero que este guia detalhado ajude você a gerenciar seu projeto com o GitHub e a fazer o deploy na HostGator!

