let listaArvores = []; //conjunto de dados
let oQueEstaFazendo = ''; //variável global de controle
let arvore = null; //variavel global 

window.onload = function() {
    inserirDadosIniciais();
    document.getElementById("inputId").addEventListener("focus", function () {
        mostrarAviso("Digite o Id e clic no botão procure");
    });
};

//backend (não interage com o html)
function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaArvores.length; i++) {
        const arvore = listaArvores[i];
        if (arvore.Id == chave) {
            arvore.posicaoNaLista = i; // se achou, guarda nesse atributo a posição na lista (índice)
            return listaArvores[i];//se achou, interrompe o laço de repetição e devolve a linha inteira
        }
    }
    return null;//não achou
}

// Função para procurar um elemento pela chave primária   ---------------------------------------------------------
function procure() {
    const Id = document.getElementById("inputId").value;
    if (Id) { // se digitou um Ra
        arvore = procurePorChavePrimaria(Id);
        if (arvore) { //achou na lista
            mostrarDadosArvore(arvore);
            visibilidadeDosBotoes('inline', 'none', 
                'inline', 'inline', 'none'); // Habilita botões de alterar e excluir
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else { //não achou na lista
            limparAtributos();
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
            mostrarAviso("Não achou na lista, pode inserir");
        }
    } else { // se deixou o Id em branco e tentou procurar
        document.getElementById("inputId").focus();
        return;
    }
}

//backend->frontend
function inserir() {
    liberarEdicaoDaChaveOuAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clic o botão salvar");
    document.getElementById("inputId").focus();

}
// Função para alterar um elemento da lista
function alterar() {
    // Remove o readonly dos campos
    liberarEdicaoDaChaveOuAtributos(true);

    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');

    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clic o botão salvar");
}

// Função para excluir um elemento da lista
function excluir() {
    liberarEdicaoDaChaveOuAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)

    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - clic o botão salvar para confirmar a exclusão");
}

function salvar() {
    //gerencia operações inserir, alterar e excluir na lista
    const id = document.getElementById("inputId").value;
    const nomePopular = document.getElementById("inputNomePopular").value;

    let nomeCientifico = document.getElementById("inputNomeCientifico").value;
    let altura = parseFloat(document.getElementById("inputAltura").value);
    let regiao = document.getElementById("inputRegiao").value;

    //verificar se o que foi digitado pelo USUÁRIO está correto
    if (id &&
        nomePopular &&
        nomeCientifico &&
        !isNaN(altura) && 
        regiao )
    { // se tudo certo 
        switch (oQueEstaFazendo) {
            case 'inserindo':
                arvore = new Arvore(id, nomePopular, nomeCientifico, altura, regiao);
                listaArvores.push(arvore);
                mostrarAviso("Inserido na lista");
                break;
            case 'alterando':
                arvoreAlterado = new Arvore(id, nomePopular, nomeCientifico, altura, regiao);
                listaArvores[arvore.posicaoNaLista] = arvoreAlterado;
                mostrarAviso("Alterado");
                break;
            case 'excluindo':
                let novaLista = [];
                for (let i = 0; i < listaArvores.length; i++) {
                    if (arvore.posicaoNaLista != i) {
                        novaLista.push(listaArvores[i]);
                    }
                }
                listaArvores = novaLista;
                mostrarAviso("EXCLUIDO");
                break;
            default:
                // console.error('Ação não reconhecida: ' + oQueEstaFazendo);
                mostrarAviso("Erro aleatório");
        }
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        listar();
        document.getElementById("inputId").focus();
    } else {
        alert("Erro nos dados digitados");
        return;
    }
}

//backend
function preparaListagem(vetor) {
    let texto = "";
    for (let i = 0; i < vetor.length; i++) {
        const linha = vetor[i];
        texto += linha.Id + " - " +
            linha.nomePopular + " - " +
            linha.nomeCientifico + " - " +
            linha.altura + " - " +
            linha.regiao + "<br>";
    }
    return texto;
}

//backend->frontend (interage com html)
function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaArvores);
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação de edição");
}

function mostrarAviso(mensagem) {
    //printa a mensagem na divAviso
    document.getElementById("divAviso").innerHTML = mensagem;
}

// Função para mostrar os dados do aluno nos campos
function mostrarDadosArvore(arvore) {
    document.getElementById("inputNomePopular").value = arvore.nomePopular;
    document.getElementById("inputNomeCientifico").value = arvore.nomeCientifico;
    document.getElementById("inputAltura").value = arvore.altura;
    document.getElementById("inputRegiao").value = arvore.regiao;

    // Define os campos como readonly
    liberarEdicaoDaChaveOuAtributos(false);
}

function liberarEdicaoDaChaveOuAtributos(soLeitura) {
    //quando chamado com true, tranca a chave e libera os outros atributos. False, faz o contrário..
    //quando a chave primaria possibilita edicao, tranca (readonly) os outros e vice-versa
    document.getElementById("inputId").readOnly = soLeitura;
    document.getElementById("inputNomePopular").readOnly = !soLeitura;
    document.getElementById("inputNomeCientifico").readOnly = !soLeitura;
    document.getElementById("inputAltura").readOnly = !soLeitura;
    document.getElementById("inputRegiao").readOnly = !soLeitura;
}

// Função para limpar os dados
function limparAtributos() {
    document.getElementById("inputNomePopular").value = "";
    document.getElementById("inputNomeCientifico").value = "";
    document.getElementById("inputAltura").value = "";
    document.getElementById("inputRegiao").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(valor) {
    //quando recebe valor == true no parâmetro, libera a chave e bloqueia a edição dos outros atributos. Se receber false, faz o contrário.
    document.getElementById("inputId").readOnly = !valor; // sempre ao contrário dos outros atributos
    document.getElementById("inputNomePopular").readOnly = valor;
    document.getElementById("inputNomeCientifico").readOnly = valor;
    document.getElementById("inputAltura").readOnly = valor;
    document.getElementById("inputRegiao").readOnly = valor;
}

// Função para deixar visível ou invisível os botões
function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    //  visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); 
    //none significa que o botão ficará invisível (visibilidade == none)
    //inline significa que o botão ficará visível 

    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar; // o cancelar sempre aparece junto com o salvar
    document.getElementById("inputId").focus();
}

//backend
function inserirDadosIniciais() {
    //esta função é para não ter que ficar digitando dados a cada vez que 
    //recarrega a página. Facilita os testes. 

    listaArvores = [];//se houver dados na lista, apaga todos
    let arvore = new Arvore('1', 'Laranja Lima', 'Citrus sinensis sp', 9, 'Sudeste');
    listaArvores.push(arvore);
    arvore = new Arvore('2', 'Macieira', 'Malus', 10, 'Sul');
    listaArvores.push(arvore);
    listar();
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    bloquearAtributos(true);
}
