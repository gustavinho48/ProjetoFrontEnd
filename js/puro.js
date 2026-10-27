/* PROJETO CULTURABRASIL - SCRIPT VANILLA PURO (SEM BIBLIOTECAS) */

document.addEventListener('DOMContentLoaded', function() {
    var btnTema = document.getElementById('btnTemaPuro');
    var temaSalvo = localStorage.getItem('tema') || 'light';

    function trocarTemaPuro(tema) {
        document.documentElement.setAttribute('data-theme', tema);
        localStorage.setItem('tema', tema);
        if (btnTema) {
            btnTema.textContent = (tema === 'dark') ? 'Modo Claro ☀️' : 'Modo Escuro 🌙';
        }
    }
    trocarTemaPuro(temaSalvo);

    if (btnTema) {
        btnTema.addEventListener('click', function() {
            var atual = document.documentElement.getAttribute('data-theme') || 'light';
            var novo = (atual === 'light') ? 'dark' : 'light';
            trocarTemaPuro(novo);
        });
    }

    var dadosRegioes = [
        { regiao: 'Norte', estados: 7, populacao: 18.67, area: 3853, bioma: 'Amazônia' },
        { regiao: 'Nordeste', estados: 9, populacao: 54.65, area: 1554, bioma: 'Caatinga' },
        { regiao: 'Centro-Oeste', estados: 4, populacao: 16.29, area: 1606, bioma: 'Cerrado' },
        { regiao: 'Sudeste', estados: 4, populacao: 84.85, area: 924, bioma: 'Mata Atlântica' },
        { regiao: 'Sul', estados: 3, populacao: 29.93, area: 576, bioma: 'Pampa' }
    ];

    var inputBusca = document.getElementById('puroInputBusca');
    var selectBioma = document.getElementById('puroSelectBioma');
    var tabelaCorpo = document.getElementById('puroTabelaCorpo');
    var totalEstados = document.getElementById('puroTotalEstados');
    var totalPop = document.getElementById('puroTotalPopulacao');
    var totalArea = document.getElementById('puroTotalArea');
    var mediaPop = document.getElementById('puroMediaPop');
    var totalLinhas = document.getElementById('puroTotalLinhas');

    function atualizarTabela() {
        if (!tabelaCorpo) return;

        var busca = inputBusca ? inputBusca.value.toLowerCase() : '';
        var bioma = selectBioma ? selectBioma.value : 'Todos';

        tabelaCorpo.innerHTML = '';
        var somaEstados = 0;
        var somaPop = 0;
        var somaArea = 0;
        var contagem = 0;

        for (var i = 0; i < dadosRegioes.length; i++) {
            var r = dadosRegioes[i];
            var bateuBusca = (busca === '' || r.regiao.toLowerCase().indexOf(busca) !== -1);
            var bateuBioma = (bioma === 'Todos' || r.bioma === bioma);

            if (bateuBusca && bateuBioma) {
                somaEstados = somaEstados + r.estados;
                somaPop = somaPop + r.populacao;
                somaArea = somaArea + r.area;
                contagem = contagem + 1;

                var tr = document.createElement('tr');
                tr.innerHTML = '<td><strong>' + r.regiao + '</strong></td>' +
                               '<td>' + r.estados + ' estados</td>' +
                               '<td>' + r.populacao.toFixed(2) + ' milhões</td>' +
                               '<td>' + r.area + ' mil km²</td>' +
                               '<td>' + r.bioma + '</td>';
                tabelaCorpo.appendChild(tr);
            }
        }

        if (totalEstados) totalEstados.textContent = somaEstados;
        if (totalPop) totalPop.textContent = somaPop.toFixed(2) + ' mi';
        if (totalArea) totalArea.textContent = somaArea + ' mil km²';
        if (mediaPop) mediaPop.textContent = (contagem > 0 ? (somaPop / contagem).toFixed(2) : 0) + ' mi/região';
        if (totalLinhas) totalLinhas.textContent = contagem + ' de ' + dadosRegioes.length + ' regiões';
    }

    if (inputBusca) inputBusca.addEventListener('input', atualizarTabela);
    if (selectBioma) selectBioma.addEventListener('change', atualizarTabela);

    var btnReset = document.getElementById('puroBtnReset');
    if (btnReset) {
        btnReset.addEventListener('click', function() {
            if (inputBusca) inputBusca.value = '';
            if (selectBioma) selectBioma.value = 'Todos';
            atualizarTabela();
        });
    }

    atualizarTabela();
});
