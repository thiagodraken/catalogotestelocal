import sys
import os

# Caminho para a pasta raiz do seu projeto Flask (onde está main.py)
# AJUSTE ESTE CAMINHO PARA O SEU PROJETO REAL NO SERVIDOR!
# Se o seu projeto estiver em /home/seuusuario_cpanel/public_html/backend/catalogo-produtos
# e passenger_wsgi.py estiver em /home/seuusuario_cpanel/public_html/
# então o caminho relativo será 'backend/catalogo-produtos/src'
PROJECT_ROOT = os.path.join(os.path.dirname(__file__), 'backend', 'catalogo-produtos', 'src')
sys.path.insert(0, PROJECT_ROOT)

# Caminho para o ambiente virtual
# AJUSTE ESTE CAMINHO PARA O SEU AMBIENTE VIRTUAL REAL NO SERVIDOR!
# Se o seu projeto estiver em /home/seuusuario_cpanel/public_html/backend/catalogo-produtos
# e passenger_wsgi.py estiver em /home/seuusuario_cpanel/public_html/
# então o caminho relativo será 'backend/catalogo-produtos/venv/bin/activate_this.py'
VIRTUALENV_PATH = os.path.join(os.path.dirname(__file__), 'backend', 'catalogo-produtos', 'venv', 'bin', 'activate_this.py')

if os.path.exists(VIRTUALENV_PATH):
    exec(open(VIRTUALENV_PATH).read(), dict(__file__=VIRTUALENV_PATH))

# Importa a aplicação Flask do seu main.py
from main import app as application


