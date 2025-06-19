// Configuração da API
const API_BASE_URL = '/api'; // <-- Caminho relativo para a API em produção.

// Estado da aplicação
let produtos = [];
let imagensTemporarias = [];
let editandoProduto = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
    
    // Event listener para o formulário
    document.getElementById('produtoForm').addEventListener('submit', salvarProduto);
    
    // Event listener para drag and drop de imagens
    const imageUpload = document.querySelector('.image-upload');
    imageUpload.addEventListener('dragover', handleDragOver);
    imageUpload.addEventListener('dragleave', (e) => { e.currentTarget.style.borderColor = '#ccc'; e.currentTarget.style.background = 'transparent'; });
    imageUpload.addEventListener('drop', handleDrop);
});

// Funções de UI
function showAlert(message, type = 'success') {
    const alertElement = document.getElementById(`alert-${type}`);
    const messageElement = document.getElementById(`alert-${type}-message`);
    
    messageElement.textContent = message;
    alertElement.classList.add('active');
    
    setTimeout(() => {
        alertElement.classList.remove('active');
    }, 5000);
}

function showLoading() {
    document.getElementById('loading').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('active');
}

function toggleForm() {
    const form = document.getElementById('productForm');
    const isVisible = form.classList.contains('active');
    
    if (isVisible) {
        form.classList.remove('active');
    } else {
        resetForm();
        form.classList.add('active');
        document.getElementById('formTitle').textContent = '➕ Adicionar Novo Produto';
    }
}

function cancelForm() {
    document.getElementById('productForm').classList.remove('active');
    resetForm();
}

function resetForm() {
    document.getElementById('produtoForm').reset();
    document.getElementById('produtoId').value = '';
    imagensTemporarias = [];
    editandoProduto = null;
    updateImagePreview();
}

// Funções de manipulação de imagens
function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    processImages(files);
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.style.borderColor = '#667eea';
    event.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.style.borderColor = '#ccc';
    event.currentTarget.style.background = 'transparent';
    
    const files = Array.from(event.dataTransfer.files);
    processImages(files);
}

function processImages(files) {
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagensTemporarias.push({
                    url: e.target.result,
                    name: file.name
                });
                updateImagePreview();
            };
            reader.readAsDataURL(file);
        }
    });
}

function updateImagePreview() {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    imagensTemporarias.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
            <img src="${image.url}" alt="${image.name}">
            <button type="button" class="image-remove" onclick="removeImage(${index})">×</button>
        `;
        preview.appendChild(imageItem);
    });
}

function removeImage(index) {
    imagensTemporarias.splice(index, 1);
    updateImagePreview();
}

// Funções da API
async function carregarProdutos() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/produtos`);
        
        if (response.ok) {
            produtos = await response.json();
            renderizarProdutos();
        } else {
            showAlert('Erro ao carregar produtos.', 'error');
        }
    } catch (error) {
        console.error('Erro em carregarProdutos:', error);
        showAlert('Erro de conexão com o servidor.', 'error');
    } finally {
        hideLoading();
    }
}

async function salvarProduto(event) {
    event.preventDefault();
    
    const produtoId = document.getElementById('produtoId').value;
    
    const produtoData = {
        nome: document.getElementById('nome').value,
        categoria: document.getElementById('categoria').value,
        descricao: document.getElementById('descricao').value,
        url_destino: document.getElementById('urlDestinoIndividual').value,
        imagens: imagensTemporarias.map(img => img.url)
    };
    
    try {
        showLoading();
        
        let response;
        const url = produtoId ? `${API_BASE_URL}/produtos/${produtoId}` : `${API_BASE_URL}/produtos`;
        const method = produtoId ? 'PUT' : 'POST';

        response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produtoData)
        });
        
        if (response.ok) {
            showAlert(produtoId ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
            cancelForm();
            await carregarProdutos();
        } else {
            const error = await response.json();
            showAlert(error.message || 'Erro ao salvar produto.', 'error');
        }
    } catch (error) {
        console.error('Erro em salvarProduto:', error);
        showAlert('Erro de conexão com o servidor.', 'error');
    } finally {
        hideLoading();
    }
}

function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    
    editandoProduto = produto;
    
    document.getElementById('produtoId').value = produto.id;
    document.getElementById('nome').value = produto.nome;
    document.getElementById('categoria').value = produto.categoria;
    document.getElementById('descricao').value = produto.descricao || '';
    document.getElementById('urlDestinoIndividual').value = produto.url_destino || '';
    
    imagensTemporarias = [];
    if (produto.imagens && typeof produto.imagens === 'string') {
        const urls = produto.imagens.split(',');
        urls.forEach((url, index) => {
            if (url.trim()) {
                imagensTemporarias.push({
                    url: url.trim(),
                    name: `Imagem ${index + 1}`
                });
            }
        });
    }
    updateImagePreview();
    
    document.getElementById('formTitle').textContent = '✏️ Editar Produto';
    document.getElementById('productForm').classList.add('active');
}

async function excluirProduto(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('Produto excluído com sucesso!');
            await carregarProdutos();
        } else {
            showAlert('Erro ao excluir produto.', 'error');
        }
    } catch (error) {
        console.error('Erro em excluirProduto:', error);
        showAlert('Erro de conexão com o servidor.', 'error');
    } finally {
        hideLoading();
    }
}

async function enviarCatalogo() {
    const urlDestino = document.getElementById('urlDestino').value;
    
    if (!urlDestino) {
        showAlert('Por favor, configure a URL de destino.', 'error');
        return;
    }
    
    if (!confirm(`Enviar catálogo com ${produtos.length} produtos para ${urlDestino}?`)) {
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/enviar-catalogo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url_destino: urlDestino
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showAlert(`Catálogo enviado com sucesso! ${result.total_produtos} produtos enviados.`);
        } else {
            showAlert(result.message || 'Erro ao enviar catálogo.', 'error');
        }
    } catch (error) {
        console.error('Erro em enviarCatalogo:', error);
        showAlert('Erro de conexão com o servidor.', 'error');
    } finally {
        hideLoading();
    }
}

// Função para renderizar produtos
function renderizarProdutos() {
    const grid = document.getElementById('productsGrid');
    
    if (!produtos || produtos.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6c757d;">
                <h3>📦 Nenhum produto cadastrado</h3>
                <p>Clique em "Adicionar Produto" para começar</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = produtos.map(produto => {
        const primeiraImagem = (produto.imagens && typeof produto.imagens === 'string') ? produto.imagens.split(',')[0].trim() : null;
        const dataFormatada = produto.data ? new Date(produto.data).toLocaleDateString('pt-BR') : '';
        
        return `
            <div class="product-card">
                <div class="product-image">
                    ${primeiraImagem ? 
                        `<img src="${primeiraImagem}" alt="${produto.nome}">` : 
                        '<div class="no-image">📷 Sem imagem</div>'
                    }
                </div>
                <div class="product-info">
                    <div class="product-title">${produto.nome}</div>
                    <div class="product-category">${produto.categoria}</div>
                    <div class="product-description">${produto.descricao || 'Sem descrição'}</div>
                    <div class="product-date">📅 ${dataFormatada}</div>
                    ${produto.url_destino ? `<div class="product-date">🔗 <a href="${produto.url_destino}" target="_blank">Link do produto</a></div>` : ''}
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm" onclick="editarProduto(${produto.id})">
                            ✏️ Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="excluirProduto(${produto.id})">
                            🗑️ Excluir
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}