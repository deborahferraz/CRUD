class Jogador {
    constructor(Id, nome, dataNascimento, dataAtual, posicaoNaLista) {
        this.Id = Id;
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.dataAtual = dataAtual;

        this.posicaoNaLista = posicaoNaLista; //atributo para facilitar a alteração e exclusão 
    }
}
