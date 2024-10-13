class Arvore {
    constructor(Id, nomePopular, nomeCientifico, altura, regiao, posicaoNaLista) {
        this.Id = Id;
        this.nomePopular = nomePopular;
        this.nomeCientifico = nomeCientifico;
        this.altura = altura;
        this.regiao = regiao;

        this.posicaoNaLista = posicaoNaLista; //atributo para facilitar a alteração e exclusão
    }
}
