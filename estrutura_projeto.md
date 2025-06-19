# Estrutura do Projeto - Catálogo de Produtos

Para uma organização clara e facilitar o deploy, o projeto está estruturado da seguinte forma:

```
catalogo-produtos/
├── backend/                     # Contém todos os arquivos do servidor Flask (API)
│   └── catalogo-produtos/       # Raiz da aplicação Flask
│       ├── src/                 # Código fonte da aplicação Flask
│       │   ├── models/          # Definições dos modelos de banco de dados
│       │   │   ├── user.py      # Modelo de exemplo (pode ser removido se não for usado)
│       │   │   └── produto.py   # Modelo de dados para os produtos
│       │   ├── routes/          # Definições das rotas da API
│       │   │   ├── user.py      # Rotas de exemplo (pode ser removido se não for usado)
│       │   │   └── produto.py   # Rotas CRUD para produtos e envio do catálogo
│       │   ├── static/          # Diretório para arquivos estáticos do Flask (se houver)
│       │   ├── database/        # Contém o arquivo do banco de dados SQLite
│       │   │   └── app.db       # Banco de dados SQLite (gerado automaticamente)
│       │   └── main.py          # Ponto de entrada principal da aplicação Flask
│       ├── venv/                # Ambiente virtual Python com as dependências
│       └── requirements.txt     # Lista de dependências Python do backend
├── frontend/                    # Contém todos os arquivos da interface do usuário (HTML/CSS/JS)
│   ├── index.html               # Página principal da interface do catálogo
│   └── script.js                # Lógica JavaScript para o frontend
├── docs/                        # Documentação do projeto
│   ├── README.md                # Visão geral do projeto e funcionalidades
│   ├── INSTALACAO_HOSTGATOR.md  # Guia detalhado de instalação na HostGator
│   └── CONFIGURACAO_PRODUCAO.md # Detalhes da configuração para ambiente de produção
├── config/                      # Arquivos de configuração para deploy
│   ├── .htaccess                # Configuração do servidor Apache (para HostGator)
│   └── app.wsgi                 # Script WSGI para rodar a aplicação Flask
└── catalogo-produtos-completo.tar.gz # Arquivo compactado com todo o projeto
```

### Explicação da Estrutura:

- **`catalogo-produtos/`**: É o diretório raiz do projeto.

- **`backend/`**: Contém tudo o que é necessário para o servidor Flask (sua API).
    - **`catalogo-produtos/`**: Dentro de `backend/`, esta é a pasta específica da sua aplicação Flask, onde estão o código-fonte, ambiente virtual e dependências.

- **`frontend/`**: Contém os arquivos da interface do usuário que rodam no navegador do cliente. Estes arquivos são independentes do backend e podem ser servidos por qualquer servidor web.

- **`docs/`**: Agrupa toda a documentação relevante do projeto, facilitando o acesso e a manutenção.

- **`config/`**: Contém arquivos de configuração específicos para o deploy, como o `.htaccess` (para servidores Apache como na HostGator) e o `app.wsgi` (para o servidor WSGI que executa o Flask).

- **`catalogo-produtos-completo.tar.gz`**: Um arquivo compactado que inclui todas as partes do projeto, pronto para ser baixado e descompactado no seu ambiente de hospedagem.

