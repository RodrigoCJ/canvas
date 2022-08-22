export type CanvasDados = {
    urlImage: string;
    width: number;
    height: number;
    widthRes: number;
    heightRes: number;
    ftConv: number;
}

export type Forma = {
    tipo: number; //1-> linha, 2->quadrado
    cor: string;
    inicio: number[];
    fim: number[];
    referencia: number;
}

export type Config ={
     tipo: number;//1-> linha, 2->quadrado,0->nenhum
     cor: string;
     grossura: number;
     corSombra: string;
     sombra: number;
     raioCirculo: number;
     alpha: number;
}