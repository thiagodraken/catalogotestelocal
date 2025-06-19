# Guia Completo para Iniciantes: GitHub e Hospedagem na HostGator

Este guia foi feito para você que está começando! Vamos aprender, passo a passo, como colocar seu projeto de Catálogo de Produtos no GitHub e depois como usar o GitHub para hospedar seu site na HostGator.

Não se preocupe se você nunca usou o GitHub ou não tem muita experiência com tecnologia. Vou explicar tudo de forma simples e clara.

## Parte 1: Entendendo o GitHub e Preparando seu Computador

### 1.1. O que é o GitHub e Por Que Usá-lo?

Imagine que você está escrevendo um livro. Você quer salvar seu trabalho, fazer várias versões (rascunho 1, rascunho 2, versão final), e talvez até trabalhar com outras pessoas. Se algo der errado, você quer poder voltar para uma versão anterior.

O **GitHub** é como uma biblioteca gigante e inteligente para seus projetos de computador (códigos, sites, etc.). Ele serve para:

*   **Versionamento**: Salvar diferentes versões do seu projeto. Se você fizer uma mudança que estraga tudo, pode voltar facilmente para uma versão que funcionava.
*   **Colaboração**: Trabalhar em equipe. Várias pessoas podem mexer no mesmo projeto ao mesmo tempo sem bagunçar.
*   **Backup**: Seu projeto fica salvo na 


nuvem, seguro, mesmo que seu computador quebre.
*   **Portfólio**: Mostrar seus projetos para outras pessoas (futuros empregadores, clientes, etc.).

### 1.2. O que é o Git?

**Git** é a ferramenta que o GitHub usa por baixo dos panos. É um programa que você instala no seu computador para controlar as versões do seu projeto. O GitHub é um serviço online que usa o Git para armazenar seus projetos.

### 1.3. Instalando o Git no seu Computador

Para usar o GitHub, você precisa ter o Git instalado. Siga as instruções para o seu sistema operacional:

*   **Windows**: Baixe o instalador em [git-scm.com/download/win](https://git-scm.com/download/win). Siga as instruções de instalação, aceitando as opções padrão na maioria dos casos.
*   **macOS**: Você pode instalar o Git de várias maneiras. A mais fácil é abrir o Terminal (pesquise por "Terminal" no Spotlight) e digitar:
    ```bash
    git --version
    ```
    Se o Git não estiver instalado, o sistema vai perguntar se você quer instalá-lo. Clique em "Instalar".
*   **Linux (Ubuntu/Debian)**: Abra o Terminal e digite:
    ```bash
    sudo apt update
    sudo apt install git
    ```

### 1.4. Verificando a Instalação do Git

Depois de instalar, abra o Terminal (ou Prompt de Comando no Windows) e digite:

```bash
git --version
```

Você deve ver a versão do Git instalada (ex: `git version 2.34.1`). Se aparecer, parabéns! O Git está pronto.

### 1.5. Configurando o Git (Uma Vez Só)

Agora, vamos dizer ao Git quem você é. Isso é importante para que ele saiba quem fez as mudanças no projeto.

No Terminal/Prompt de Comando, digite (substitua pelo seu nome e e-mail):

```bash
git config --global user.name "Seu Nome Completo"
git config --global user.email "seu.email@exemplo.com"
```

## Parte 2: Preparando seu Projeto para o GitHub

Seu projeto de Catálogo de Produtos tem duas partes principais: o **Backend** (a "inteligência" que lida com os dados) e o **Frontend** (a parte que você vê no navegador).

Para o GitHub, vamos considerar a pasta `catalogo-produtos/` como a raiz do seu projeto. Dentro dela, você tem `backend/` e `frontend/`.

### 2.1. Navegando até a Pasta do Projeto

No Terminal/Prompt de Comando, você precisa ir até a pasta principal do seu projeto. Se você baixou o projeto, ele deve estar em algum lugar como `Downloads` ou `Documentos`.

Use o comando `cd` (change directory - mudar diretório):

```bash
# Exemplo para Windows:
cd C:\Users\SeuUsuario\Downloads\catalogo-produtos

# Exemplo para macOS/Linux:
cd /home/seuusuario/Downloads/catalogo-produtos
```

*Dica: Você pode digitar `cd ` (com um espaço no final) e arrastar a pasta `catalogo-produtos` do seu explorador de arquivos para o terminal. Ele preencherá o caminho automaticamente!*

### 2.2. Inicializando o Repositório Git no Projeto

Dentro da pasta `catalogo-produtos` (verifique se o caminho no terminal está correto), digite:

```bash
git init
```

Este comando cria uma pasta escondida chamada `.git` dentro do seu projeto. É aqui que o Git vai guardar todo o histórico de versões.

### 2.3. O Arquivo `.gitignore` (Muito Importante!)

Alguns arquivos e pastas do seu projeto não precisam ir para o GitHub (como o ambiente virtual do Python, que é grande e pode ser recriado, ou o banco de dados local). O arquivo `.gitignore` diz ao Git para ignorar esses itens.

Eu já criei um `.gitignore` para você dentro da pasta `backend/catalogo-produtos/`. Para o GitHub, é melhor que ele esteja na raiz do seu projeto principal (`catalogo-produtos/`).

**Conteúdo do `.gitignore`:**

```
# Python
venv/
*.pyc
.env

# Database
*.db

# Node modules (se você usar npm/yarn no futuro)
node_modules/

# Logs
*.log

# Arquivos gerados pelo sistema operacional
.DS_Store
.localized
Thumbs.db
```

**Como criar/verificar o `.gitignore`:**

1.  Abra a pasta `catalogo-produtos` no seu explorador de arquivos.
2.  Crie um novo arquivo de texto e salve-o como `.gitignore` (sim, com um ponto na frente e sem nome). Se já existir, abra-o.
3.  Copie e cole o conteúdo acima dentro dele e salve.

### 2.4. Adicionando os Arquivos para o Primeiro "Commit"

"Commit" é como um "salvar" no Git. Antes de salvar, você precisa dizer ao Git quais arquivos você quer incluir nesse "salvar".

No Terminal/Prompt de Comando (ainda na pasta `catalogo-produtos`), digite:

```bash
git add .
```

O `.` (ponto) significa "todos os arquivos e pastas neste diretório e subdiretórios". O Git vai adicionar tudo, exceto o que estiver no `.gitignore`.

### 2.5. Fazendo o Primeiro "Commit"

Agora, vamos fazer o primeiro "salvar" (commit) e dar uma mensagem para ele, explicando o que foi feito.

```bash
git commit -m "Primeiro commit: Estrutura inicial do catálogo de produtos"
```

O texto entre as aspas é a mensagem do seu commit. É importante que seja algo que ajude você (e outros) a entender o que mudou nessa versão.

## Parte 3: Criando seu Repositório no GitHub

Agora que seu projeto está pronto localmente, vamos criar um lugar para ele no GitHub.

### 3.1. Crie uma Conta no GitHub

Se você ainda não tem, acesse [github.com](https://github.com/) e clique em "Sign up" para criar sua conta. Siga as instruções.

### 3.2. Crie um Novo Repositório no GitHub

1.  Faça login no GitHub.
2.  No canto superior direito da tela, clique no sinal de `+` (mais) e selecione `New repository`.
3.  Você verá uma tela para configurar o novo repositório:
    *   **Owner**: Será seu nome de usuário.
    *   **Repository name**: Dê um nome para o seu projeto. Sugiro `catalogo-produtos` ou `meu-catalogo-hostgator`. Use letras minúsculas e hífens para separar palavras (ex: `meu-novo-projeto`).
    *   **Description (optional)**: Uma breve descrição do que é o seu projeto.
    *   **Public ou Private**: Escolha `Public` se quiser que qualquer pessoa veja seu código (ótimo para portfólio) ou `Private` se quiser que só você (ou quem você convidar) veja.
    *   **NÃO** marque as caixas "Add a README file", "Add .gitignore" ou "Choose a license". Você já tem esses arquivos localmente.
4.  Clique no botão verde `Create repository`.

### 3.3. Conectando seu Projeto Local ao GitHub

Depois de criar o repositório no GitHub, você verá uma página com algumas instruções. Procure pela seção que diz "...or push an existing repository from the command line" (ou envie um repositório existente da linha de comando).

Você verá algo parecido com isto:

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

Vamos entender e executar esses comandos no seu Terminal/Prompt de Comando (ainda na pasta `catalogo-produtos`):

1.  **`git remote add origin ...`**: Este comando diz ao seu Git local onde está o repositório no GitHub. Copie e cole a linha inteira que o GitHub te deu.
    *Exemplo: `git remote add origin https://github.com/seu-usuario/catalogo-produtos.git`*

2.  **`git branch -M main`**: Este comando renomeia sua branch principal (o "galho" principal do seu projeto) para `main`. É uma boa prática moderna.

3.  **`git push -u origin main`**: Este é o comando que envia todo o seu projeto (o que você "comitou") para o GitHub. Ele pode pedir seu nome de usuário e senha do GitHub (ou um "Personal Access Token" se você tiver autenticação de dois fatores).

    *Se pedir senha e você tiver autenticação de dois fatores, o GitHub não aceitará sua senha normal. Você precisará criar um "Personal Access Token" (PAT). Pesquise por "GitHub Personal Access Token" para ver como criar um. É um código que você usa no lugar da senha.*

Parabéns! Seu projeto agora está no GitHub. Você pode ir para a página do seu repositório no GitHub e ver todos os seus arquivos lá.

## Parte 4: Hospedando seu Projeto na HostGator

Agora que seu projeto está no GitHub, vamos ver como colocá-lo online na HostGator. Existem algumas formas, mas vamos focar na mais simples e comum para iniciantes.

### 4.1. Entendendo a HostGator e o cPanel

A **HostGator** é uma empresa que "aluga" espaço em servidores para você colocar seu site. É como alugar um terreno na internet.

O **cPanel** é um painel de controle que a HostGator (e muitas outras empresas de hospedagem) oferece. Ele facilita a administração do seu site, como gerenciar arquivos, bancos de dados, e-mails, etc.

### 4.2. Opção Recomendada: Download Manual e Upload via cPanel

Esta é a forma mais fácil para quem está começando. Você baixa o projeto do GitHub e envia para a HostGator.

#### 4.2.1. Baixando seu Projeto do GitHub

1.  Acesse seu repositório no GitHub (ex: `https://github.com/SEU_USUARIO/catalogo-produtos`).
2.  No lado direito da página, procure um botão verde chamado `Code`.
3.  Clique em `Code` e selecione `Download ZIP`.
4.  Um arquivo `.zip` será baixado para o seu computador (ex: `catalogo-produtos-main.zip`).

#### 4.2.2. Acessando o cPanel da HostGator

1.  Faça login na sua conta HostGator.
2.  Procure pelo link ou botão que te leva ao `cPanel`.
3.  Dentro do cPanel, procure por `Gerenciador de Arquivos` (File Manager).

#### 4.2.3. Fazendo Upload e Descompactando os Arquivos

1.  No `Gerenciador de Arquivos`, você verá várias pastas. A pasta principal para seu site é geralmente `public_html`.
    *   **Decida onde colocar seu projeto**: Se for o site principal, coloque dentro de `public_html`. Se for um subdomínio ou uma pasta separada (ex: `seudominio.com/catalogo`), crie uma pasta dentro de `public_html` (ex: `public_html/catalogo`) e entre nela.
2.  Clique no botão `Upload` na parte superior do Gerenciador de Arquivos.
3.  Arraste e solte o arquivo `.zip` que você baixou do GitHub, ou clique em `Select File` para encontrá-lo no seu computador.
4.  Espere o upload terminar (a barra de progresso deve ficar verde).
5.  Volte para o `Gerenciador de Arquivos` (talvez precise atualizar a página).
6.  Localize o arquivo `.zip` que você acabou de enviar.
7.  Clique com o botão direito do mouse sobre ele e selecione `Extract` (Extrair).
8.  Confirme o diretório para extração (deve ser o diretório atual onde você está).
9.  Após a extração, você verá uma nova pasta (ex: `catalogo-produtos-main`). **Mova o conteúdo desta pasta para o diretório correto.**
    *   Entre na pasta `catalogo-produtos-main`.
    *   Selecione todos os arquivos e pastas dentro dela (clique em `Select All`).
    *   Clique no botão `Move` na parte superior.
    *   No campo de destino, altere o caminho para o diretório onde você quer que seu site esteja (ex: `/public_html/` ou `/public_html/catalogo/`).
    *   Clique em `Move Files`.
10. Agora você pode deletar o arquivo `.zip` e a pasta vazia `catalogo-produtos-main` para economizar espaço.

### 4.3. Configurando o Backend (Flask) na HostGator

Esta é a parte mais "técnica", mas siga as instruções com calma.

Seu backend Flask precisa de um ambiente Python para rodar. A HostGator geralmente oferece uma ferramenta para isso no cPanel.

1.  **No cPanel**, procure por `Setup Python App` (Configurar Aplicativo Python).
2.  Clique em `Create Application` (Criar Aplicativo).
3.  Preencha os detalhes:
    *   **Python version**: Selecione a versão mais recente disponível (ex: Python 3.9, 3.10 ou 3.11).
    *   **Application root**: Este é o caminho para a pasta raiz do seu backend. Se você moveu os arquivos como sugeri, será algo como `/home/SEU_USUARIO/public_html/catalogo-produtos/backend/catalogo-produtos`.
    *   **Application URL**: A URL onde seu backend estará acessível (ex: `seudominio.com/api`).
    *   **Application startup file**: `main.py`
    *   **Application Entry point**: `app` (o nome da sua aplicação Flask no `main.py`)
4.  Clique em `Create`.
5.  Após a criação, o cPanel vai te dar alguns comandos para instalar as dependências. Você precisará usar o Terminal via SSH para isso.

#### 4.3.1. Instalando Dependências via SSH (Opcional, mas Recomendado)

Se você não tem acesso SSH, pode tentar instalar as dependências via cPanel, mas SSH é mais confiável.

1.  **Ative o Acesso SSH na HostGator**: No cPanel, procure por `Acesso SSH` e siga as instruções para ativá-lo e gerar suas chaves (se necessário).
2.  **Conecte via SSH**: Use um programa como PuTTY (Windows) ou o Terminal (macOS/Linux) para se conectar. O comando será algo como:
    ```bash
    ssh seuusuario@seudominio.com
    ```
    *Substitua `seuusuario` e `seudominio.com` pelos seus dados.*
3.  **Navegue até a pasta do seu backend**: O cPanel vai te mostrar o caminho exato quando você configurar o Python App. Será algo como:
    ```bash
    cd /home/SEU_USUARIO/virtualenv/SEU_DOMINIO/3.x/lib/python3.x/site-packages
    # Ou o caminho que o cPanel indicar para o seu ambiente virtual
    ```
    *Dica: O cPanel geralmente cria um ambiente virtual para você. O caminho exato é mostrado na tela de `Setup Python App`.*
4.  **Instale as dependências**: Use o `pip` para instalar o que está no seu `requirements.txt`.
    ```bash
    pip install -r /home/SEU_USUARIO/public_html/catalogo-produtos/backend/catalogo-produtos/requirements.txt
    ```
    *Ajuste o caminho para o seu `requirements.txt`.*
5.  **Reinicie o Aplicativo Python**: Volte para o cPanel, na tela de `Setup Python App`, e clique em `Restart` (Reiniciar) para que as mudanças entrem em vigor.

### 4.4. Configurando o Frontend (HTML/CSS/JS)

O frontend é mais simples, pois são apenas arquivos estáticos.

1.  **Ajuste a URL da API no `script.js`**: No seu `script.js` (que está na pasta `public_html` ou subpasta), você precisa dizer onde o frontend vai encontrar o backend.
    *   Abra o `script.js` no `Gerenciador de Arquivos` do cPanel (clique com o botão direito e `Edit`).
    *   Procure pela linha:
        ```javascript
        const API_BASE_URL = 'http://localhost:5001/api';
        ```
    *   Altere para a URL do seu backend na HostGator. Se você configurou o Python App para `seudominio.com/api`, então será:
        ```javascript
        const API_BASE_URL = 'https://seudominio.com/api';
        // Ou se for um subdiretório, como seudominio.com/catalogo/api
        // const API_BASE_URL = 'https://seudominio.com/catalogo/api';
        ```
    *   **Importante**: Use `https://` se seu site tiver certificado SSL (o que é padrão hoje em dia).
    *   Salve as alterações.

### 4.5. Testando seu Site

1.  Abra seu navegador e digite a URL do seu site (ex: `https://seudominio.com` ou `https://seudominio.com/catalogo`).
2.  Verifique se a página carrega corretamente.
3.  Tente adicionar um produto, editar, excluir e enviar o catálogo. Observe se as operações funcionam e se os alertas aparecem.

### 4.6. Dicas Importantes para a HostGator

*   **Caminhos**: Preste muita atenção aos caminhos dos arquivos e pastas. Um erro de digitação pode impedir que seu site funcione.
*   **Permissões**: Às vezes, arquivos Python precisam de permissões especiais. Se tiver erros de "Permission Denied", no Gerenciador de Arquivos, clique com o botão direito no arquivo `main.py` e em `Change Permissions` (Mudar Permissões), e marque a opção de "Execute" para o proprietário (geralmente 755).
*   **Logs**: Se algo não funcionar, procure os logs de erro. No cPanel, pode haver uma seção de "Logs de Erro" ou você pode verificar os logs do seu aplicativo Python.
*   **Suporte HostGator**: Não hesite em contatar o suporte da HostGator se você ficar travado. Eles podem ajudar com problemas específicos do servidor.

## Parte 5: Mantendo seu Projeto Atualizado (Opcional, mas Recomendado)

Sempre que você fizer mudanças no seu projeto no seu computador, você vai querer atualizar o GitHub e, depois, a HostGator.

### 5.1. Atualizando o GitHub

1.  No seu computador, dentro da pasta `catalogo-produtos`, faça suas alterações.
2.  No Terminal/Prompt de Comando:
    ```bash
    git add .
    git commit -m "Sua mensagem sobre as novas mudanças"
    git push origin main
    ```
    Isso envia as novas versões para o GitHub.

### 5.2. Atualizando na HostGator

Se você usou o **Download Manual**:

1.  Baixe o novo `.zip` do GitHub.
2.  Faça upload para a HostGator.
3.  Extraia e substitua os arquivos antigos (cuidado para não apagar o banco de dados `app.db` se ele estiver na mesma pasta!).
4.  Reinicie o aplicativo Python no cPanel.

Se você usou o **Clonar via SSH** (Opção 2 do guia anterior):

1.  Conecte-se via SSH.
2.  Navegue até a pasta do seu projeto na HostGator.
3.  Puxe as atualizações do GitHub:
    ```bash
    git pull origin main
    ```
4.  Reinicie o aplicativo Python no cPanel.

---

