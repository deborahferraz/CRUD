let listaAniversariante = []; //conjunto de dados
let oQueEstaFazendo = ''; //variável global de controle
let aniversariante = null; //variavel global 

window.onload = inserirDadosIniciais();

//metodo para mostrar mensagem quando o foco for para a chave primaria 
document.getElementById("inputCPF").addEventListener("focus", function () {
    mostrarAviso("Digite o CPF e clic no botão procure");
});

//backend (não interage com o html)
function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaAniversariante.length; i++) {
        const aniversariante = listaAniversariante[i];
        if (aniversariante.cpf == chave) {
            aniversariante.posicaoNaLista = i; // se achou, guarda nesse atributo a posição na lista (índice)
            return listaAniversariante[i];//se achou, interrompe o laço de repetição e devolve a linha inteira
        }
    }
    return null;//não achou
}

// Função para procurar um elemento pela chave primária   ---------------------------------------------------------
function procure() {
    const cpf = document.getElementById("inputCPF").value;
    if (cpf) { // se digitou um CPF
        aniversariante = procurePorChavePrimaria(cpf);
        if (aniversariante) { //achou na lista
            mostrarDadosAniversariante(aniversariante);
            visibilidadeDosBotoes('inline', 'none', 
                'inline', 'inline', 'none'); // Habilita botões de alterar e excluir
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else { //não achou na lista
            limparAtributos();
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
            mostrarAviso("Não achou na lista, pode inserir");
        }
    } else { // se deixou o Ra em branco e tentou procurar
        document.getElementById("inputCPF").focus();
        return;
    }
}

//backend->frontend
function inserir() {
    liberarEdicaoDaChaveOuAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clic o botão salvar");
    document.getElementById("inputCPF").focus();

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
    const cpf = document.getElementById("inputCPF").value;
    const nome = document.getElementById("inputNome").value;

    let dataNasc = document.getElementById("inputDataNasc").value;
    

    //verificar se o que foi digitado pelo USUÁRIO está correto
    if (cpf &&
        nome &&
        !isNaN(parseFloat(dataNasc))
    ) { // se tudo certo 
        switch (oQueEstaFazendo) {
            case 'inserindo':
                aniversariante = new Aniversariante(cpf, nome, dataNasc);
                listaAniversariante.push(aniversariante);
                mostrarAviso("Inserido na lista");
                break;
            case 'alterando':
                aniversarianteAlterado = new Aniversariante(cpf, nome, dataNasc);
                listaAniversariante[aniversariante.posicaoNaLista] = aniversarianteAlterado;
                mostrarAviso("Alterado");
                break;
            case 'excluindo':
                let novaLista = [];
                for (let i = 0; i < listaAniversariante.length; i++) {
                    if (aniversariante.posicaoNaLista != i) {
                        novaLista.push(listaAniversariante[i]);
                    }
                }
                listaAniversariante = novaLista;
                mostrarAviso("EXCLUIDO");
                break;
            default:
                // console.error('Ação não reconhecida: ' + oQueEstaFazendo);
                mostrarAviso("Erro aleatório");
        }
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        listar();
        document.getElementById("inputCPF").focus();
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
        texto += linha.cpf + " - " +
            linha.nome + " - " +
            linha.dataNasc + "<br>";
    }
    return texto;
}

//backend->frontend (interage com html)
function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaAniversariante);
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
function mostrarDadosAniversariante(aniversariante) {
    document.getElementById("inputNome").value = aniversariante.nome;
    document.getElementById("inputDataNasc").value = aniversariante.dataNasc;
    // Define os campos como readonly
    liberarEdicaoDaChaveOuAtributos(false);
}

function liberarEdicaoDaChaveOuAtributos(soLeitura) {
    //quando chamado com true, tranca a chave e libera os outros atributos. False, faz o contrário..
    //quando a chave primaria possibilita edicao, tranca (readonly) os outros e vice-versa
    document.getElementById("inputCPF").readOnly = soLeitura;
    document.getElementById("inputNome").readOnly = !soLeitura;
    document.getElementById("inputDataNasc").readOnly = !soLeitura;
}

// Função para limpar os dados
function limparAtributos() {
    document.getElementById("inputNome").value = "";
    document.getElementById("inputDataNasc").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(valor) {
    //quando recebe valor == true no parâmetro, libera a chave e bloqueia a edição dos outros atributos. Se receber false, faz o contrário.
    document.getElementById("inputCPF").readOnly = !valor; // sempre ao contrário dos outros atributos
    document.getElementById("inputNome").readOnly = valor;
    document.getElementById("inputDataNasc").readOnly = valor;
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
    document.getElementById("inputCPF").focus();
}

//backend
function inserirDadosIniciais() {
    //esta função é para não ter que ficar digitando dados a cada vez que 
    //recarrega a página. Facilita os testes. 

    listaAniversariante = [];//se houver dados na lista, apaga todos
    let aniversariante = new Aniversariante('12345678910', 'Beatriz', '20-11-2002');
    listaAniversariante.push(aniversariante);
    listar();
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    bloquearAtributos(true);
}
