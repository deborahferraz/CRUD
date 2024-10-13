let listaCarros = []; //conjunto de dados
let oQueEstaFazendo = ''; //variável global de controle
let carro = null; //variavel global 

window.onload = inserirDadosIniciais;

//metodo para mostrar mensagem quando o foco for para a chave primaria 
document.getElementById("inputPlaca").addEventListener("focus", function () {
    mostrarAviso("Digite a Placa e clic no botão procure");
});

//backend (não interage com o html)
function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaCarros.length; i++) {
        const carro = listaCarros[i];
        if (carro.placa == chave) {
            carro.posicaoNaLista = i; // se achou, guarda nesse atributo a posição na lista (índice)
            return listaCarros[i];//se achou, interrompe o laço de repetição e devolve a linha inteira
        }
    }
    return null;//não achou
}

// Função para procurar um elemento pela chave primária   ---------------------------------------------------------
function procure() {
    const placa = document.getElementById("inputPlaca").value;
    if (placa) { // se digitou uma Placa
        carro = procurePorChavePrimaria(placa);
        if (carro) { //achou na lista
            mostrarDadosCarro(carro);
            visibilidadeDosBotoes('inline', 'none', 
                'inline', 'inline', 'none'); // Habilita botões de alterar e excluir
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else { //não achou na lista
            limparAtributos();
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
            mostrarAviso("Não achou na lista, pode inserir");
        }
    } else { // se deixou a Placa em branco e tentou procurar
        document.getElementById("inputPlaca").focus();
        return;
    }
}

//backend->frontend
function inserir() {
    liberarEdicaoDaChaveOuAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clic o botão salvar");
    document.getElementById("inputPlaca").focus();


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
    const placa = document.getElementById("inputPlaca").value;
    const nome = document.getElementById("inputNome").value;

    let dataLancamento = document.getElementById("inputdataLancamento").value;
    let peso = parseFloat(document.getElementById("inputPeso").value);
    let cor = document.getElementById("inputCor").value;

    //verificar se o que foi digitado pelo USUÁRIO está correto
    if (placa &&
        nome &&
        dataLancamento &&
        !isNaN(parseFloat(peso)) &&
        cor )

     { // se tudo certo 
        switch (oQueEstaFazendo) {
            case 'inserindo':
                carro = new Carro(placa, nome, dataLancamento, peso, cor);
                listaCarros.push(carro);
                mostrarAviso("Inserido na lista");
                break;
            case 'alterando':
                carroAlterado = new Carro(placa, nome, dataLancamento, peso, cor);
                listaCarros[carro.posicaoNaLista] = carroAlterado;
                mostrarAviso("Alterado");
                break;
            case 'excluindo':
                let novaLista = [];
                for (let i = 0; i < listaCarros.length; i++) {
                    if (carro.posicaoNaLista != i) {
                        novaLista.push(listaCarros[i]);
                    }
                }
                listaCarros = novaLista;
                mostrarAviso("EXCLUIDO");
                break;
            default:
                // console.error('Ação não reconhecida: ' + oQueEstaFazendo);
                mostrarAviso("Erro aleatório");
        }
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        listar();
        document.getElementById("inputPlaca").focus();
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
        texto += linha.placa + " - " +
            linha.nome + " - " +
            linha.dataLancamento + " - " +
            linha.peso + " - " +
            linha.cor + " - " + "<br>";
    }
    return texto;
}

//backend->frontend (interage com html)
function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaCarros);
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
function mostrarDadosCarro(carro) {
    document.getElementById("inputNome").value = carro.nome;
    document.getElementById("inputdataLancamento").value = carro.dataLancamento;
    document.getElementById("inputPeso").value = carro.peso;
    document.getElementById("inputCor").value = carro.cor;

    // Define os campos como readonly
    liberarEdicaoDaChaveOuAtributos(false);
}

function liberarEdicaoDaChaveOuAtributos(soLeitura) {
    //quando chamado com true, tranca a chave e libera os outros atributos. False, faz o contrário..
    //quando a chave primaria possibilita edicao, tranca (readonly) os outros e vice-versa
    document.getElementById("inputPlaca").readOnly = soLeitura;
    document.getElementById("inputNome").readOnly = !soLeitura;
    document.getElementById("inputdataLancamento").readOnly = !soLeitura;
    document.getElementById("inputPeso").readOnly = !soLeitura;
    document.getElementById("inputCor").readOnly = !soLeitura;
}

// Função para limpar os dados
function limparAtributos() {
    document.getElementById("inputNome").value = "";
    document.getElementById("inputdataLancamento").value = "";
    document.getElementById("inputPeso").value = "";
    document.getElementById("inputCor").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(valor) {
    //quando recebe valor == true no parâmetro, libera a chave e bloqueia a edição dos outros atributos. Se receber false, faz o contrário.
    document.getElementById("inputPlaca").readOnly = !valor; // sempre ao contrário dos outros atributos
    document.getElementById("inputNome").readOnly = valor;
    document.getElementById("inputdataLancamento").readOnly = valor;
    document.getElementById("inputPeso").readOnly = valor;
    document.getElementById("inputCor").readOnly = valor;
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
    document.getElementById("inputPlaca").focus();
}

//backend
function inserirDadosIniciais() {
    //esta função é para não ter que ficar digitando dados a cada vez que 
    //recarrega a página. Facilita os testes. 

    listaCarros = [];//se houver dados na lista, apaga todos
    let carro = new Carro('123', 'Civic G10', "09/08/2016", "1.291", "Prata");
    listaCarros.push(carro);
    listar();
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    bloquearAtributos(true);
}
