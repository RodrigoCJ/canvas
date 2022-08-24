export type Dados = {
    urlImage: string;
    width: number;
    height: number;
    widthRes: number;
    heightRes: number;
    ftConv: number;
}

export type Forma = {
    tipo: "quadrado"|"linha";
    cor: string;
    inicio: number[];
    fim: number[];
    referencia: number;
}

export type Configuracao ={
     tipo: "quadrado"|"linha"|"nada";
     cor: string;
     grossura: number;
     corSombra: string;
     sombra: number;
     raioCirculo: number;
     alphaLinha: number;
     alphaCirculo: number;
     habilitaZoom: boolean;
     habilitaConf: boolean;
     exibeID: boolean;
}