/* PROJETO CULTURABRASIL - SCRIPT PRINCIPAL */

document.addEventListener('DOMContentLoaded', function() {
    var btnTema = document.getElementById('themeToggleBtn');
    var iconeTema = document.getElementById('themeIcon');
    var temaSalvo = localStorage.getItem('tema') || 'light';

    function trocarTema(tema) {
        document.documentElement.setAttribute('data-theme', tema);
        localStorage.setItem('tema', tema);
        if (iconeTema) {
            iconeTema.className = (tema === 'dark') ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-fill';
        }
    }
    trocarTema(temaSalvo);

    if (btnTema) {
        btnTema.addEventListener('click', function() {
            var atual = document.documentElement.getAttribute('data-theme') || 'light';
            var novo = (atual === 'light') ? 'dark' : 'light';
            trocarTema(novo);
        });
    }

    var formNome = document.getElementById('formNomeUsuario');
    var inputNome = document.getElementById('inputNomeUsuario');
    var boxSemNome = document.getElementById('welcomeLoggedOut');
    var boxComNome = document.getElementById('welcomeLoggedIn');
    var textoSaudacao = document.getElementById('saudacaoTexto');
    var btnTrocarNome = document.getElementById('btnLimparStorage');
    var badgeNome = document.getElementById('navUserBadge');

    function carregarUsuario() {
        var nome = localStorage.getItem('usuario');
        if (nome) {
            if (boxSemNome) boxSemNome.classList.add('d-none');
            if (boxComNome) boxComNome.classList.remove('d-none');
            if (textoSaudacao) textoSaudacao.innerHTML = 'Olá, <strong>' + nome + '</strong>! Bem-vindo(a).';
            if (badgeNome) {
                badgeNome.textContent = nome;
                badgeNome.classList.remove('d-none');
            }
        } else {
            if (boxSemNome) boxSemNome.classList.remove('d-none');
            if (boxComNome) boxComNome.classList.add('d-none');
            if (badgeNome) badgeNome.classList.add('d-none');
        }
    }
    carregarUsuario();

    if (formNome) {
        formNome.addEventListener('submit', function(e) {
            e.preventDefault();
            var nome = inputNome ? inputNome.value.trim() : '';
            if (nome) {
                localStorage.setItem('usuario', nome);
                if (inputNome) inputNome.value = '';
                carregarUsuario();
            }
        });
    }

    if (btnTrocarNome) {
        btnTrocarNome.addEventListener('click', function() {
            localStorage.removeItem('usuario');
            carregarUsuario();
        });
    }

    var btnClique = document.getElementById('btnAdicionarClique');
    var btnZerar = document.getElementById('btnZerarContador');

    function pegarCliques() {
        var c = localStorage.getItem('cliques');
        return c ? parseInt(c, 10) : 0;
    }

    function mostrarCliques() {
        var total = pegarCliques();
        var lista = document.querySelectorAll('.contador-exploracoes-valor');
        for (var i = 0; i < lista.length; i++) {
            lista[i].textContent = total;
        }
    }

    function somarClique() {
        var total = pegarCliques() + 1;
        localStorage.setItem('cliques', total);
        mostrarCliques();
    }

    if (btnClique) btnClique.addEventListener('click', somarClique);
    if (btnZerar) {
        btnZerar.addEventListener('click', function() {
            localStorage.setItem('cliques', 0);
            mostrarCliques();
        });
    }
    mostrarCliques();

    var formNota = document.getElementById('formAnotacao');
    var inputTitulo = document.getElementById('tituloAnotacao');
    var selectRegiao = document.getElementById('regiaoAnotacao');
    var inputData = document.getElementById('dataAnotacao');
    var textNota = document.getElementById('textoAnotacao');
    var tabela = document.getElementById('corpoTabelaAnotacoes');
    var contadorNotas = document.getElementById('countAnotacoes');
    var msgVazio = document.getElementById('emptyStateAnotacoes');
    var filtroRegiao = document.getElementById('filtroRegiaoNotas');

    var notasPadrao = [
        { titulo: 'Festival de Parintins', regiao: 'Norte', data: '2026-06-25', texto: 'Assistir aos bois Garantido e Caprichoso.' },
        { titulo: 'Frevo de Olinda', regiao: 'Nordeste', data: '2026-02-14', texto: 'Dançar frevo nas ladeiras históricas.' },
        { titulo: 'Pantanal', regiao: 'Centro-Oeste', data: '2026-08-10', texto: 'Conhecer a fauna e a Viola de Cocho.' }
    ];

    function carregarNotas() {
        var salvas = localStorage.getItem('notas');
        if (salvas) {
            return JSON.parse(salvas);
        }
        localStorage.setItem('notas', JSON.stringify(notasPadrao));
        return notasPadrao;
    }

    function salvarNotas(lista) {
        localStorage.setItem('notas', JSON.stringify(lista));
    }

    function mostrarNotas() {
        if (!tabela) return;
        var lista = carregarNotas();
        var filtro = filtroRegiao ? filtroRegiao.value : 'Todas';

        tabela.innerHTML = '';
        var filtradas = [];

        for (var i = 0; i < lista.length; i++) {
            if (filtro === 'Todas' || lista[i].regiao === filtro) {
                filtradas.push(lista[i]);
            }
        }

        if (contadorNotas) contadorNotas.textContent = filtradas.length + ' registro(s)';

        if (filtradas.length === 0) {
            if (msgVazio) msgVazio.classList.remove('d-none');
            return;
        }
        if (msgVazio) msgVazio.classList.add('d-none');

        for (var j = 0; j < filtradas.length; j++) {
            var n = filtradas[j];
            var tr = document.createElement('tr');
            tr.innerHTML = '<td><strong>' + n.titulo + '</strong></td>' +
                           '<td><span class="badge bg-secondary">' + n.regiao + '</span></td>' +
                           '<td><small>' + (n.data || '-') + '</small></td>' +
                           '<td>' + n.texto + '</td>' +
                           '<td class="text-end"><button class="btn btn-danger btn-sm btn-remover" data-index="' + j + '"><i class="bi bi-trash"></i></button></td>';
            tabela.appendChild(tr);
        }

        var botoesExcluir = document.querySelectorAll('.btn-remover');
        for (var k = 0; k < botoesExcluir.length; k++) {
            botoesExcluir[k].addEventListener('click', function() {
                var index = parseInt(this.getAttribute('data-index'), 10);
                var listaAtual = carregarNotas();
                listaAtual.splice(index, 1);
                salvarNotas(listaAtual);
                somarClique();
                mostrarNotas();
            });
        }
    }

    if (formNota) {
        formNota.addEventListener('submit', function(e) {
            e.preventDefault();
            var titulo = inputTitulo ? inputTitulo.value.trim() : '';
            var regiao = selectRegiao ? selectRegiao.value : 'Norte';
            var data = inputData ? inputData.value : '';
            var texto = textNota ? textNota.value.trim() : '';

            if (titulo && texto) {
                var lista = carregarNotas();
                lista.push({ titulo: titulo, regiao: regiao, data: data, texto: texto });
                salvarNotas(lista);
                formNota.reset();
                somarClique();
                mostrarNotas();
            }
        });
    }

    if (filtroRegiao) {
        filtroRegiao.addEventListener('change', mostrarNotas);
    }
    mostrarNotas();

    var formContato = document.getElementById('formContatoPrincipal');
    var alertaContato = document.getElementById('alertaSucessoContato');

    if (formContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            var nome = document.getElementById('contatoNome').value;
            var email = document.getElementById('contatoEmail').value;
            var assunto = document.getElementById('contatoAssunto').value;
            var mensagem = document.getElementById('contatoMensagem').value;

            if (nome && email && assunto && mensagem) {
                var mensagens = JSON.parse(localStorage.getItem('mensagens') || '[]');
                mensagens.push({ nome: nome, email: email, assunto: assunto, mensagem: mensagem });
                localStorage.setItem('mensagens', JSON.stringify(mensagens));

                formContato.reset();
                somarClique();
                if (alertaContato) {
                    alertaContato.classList.remove('d-none');
                    setTimeout(function() { alertaContato.classList.add('d-none'); }, 4000);
                }
            }
        });
    }
});
