const { Subject, from } = require('rxjs');
const { filter, take, distinct, skipWhile, merge } = require('rxjs/operators');

class Pastel {
  constructor(name) {
    this.name = name;
  }
}

class PastelSalagado extends Pastel {
  constructor(name) {
    super(name);
    this.type = 'Salgado'
  }
}

class PastelDoce extends Pastel {
  constructor(name) {
    super(name);
    this.type = 'Doce'
  }
}

const pessoa2 = new Subject();
const pessoa3 = new Subject();

const pasteisPessoa1 = new Array();
const pasteisPessoa2 = new Array();
const pasteisPessoa3 = new Array();

const calabresa = new PastelSalagado('Calabresa');
const carne = new PastelSalagado('Carne');
const portuguesa = new PastelSalagado('Portuguesa');
const frangoMisto = new PastelSalagado('Frango Misto');
const frango = new PastelSalagado('Frango');
const pepperoni = new PastelSalagado('Pepperoni');
const quatroQueijos = new PastelSalagado('Quatro queijos');
const vegetariano = new PastelSalagado('Vegetariano');

const prestigio = new PastelDoce('Prestigio');
const chocolate = new PastelDoce('Chocolate');
const romeuJulieta = new PastelDoce('Romeu e Julieta');

const pasteis = [
  calabresa,
  carne,
  calabresa,
  portuguesa,
  frangoMisto,
  frango,
  portuguesa,
  calabresa,
  portuguesa,
  pepperoni,
  quatroQueijos,
  vegetariano,
  chocolate,
  prestigio,
  romeuJulieta,
  prestigio,
  chocolate,
];

pasteisSalgados = (pastel$) => pastel$.pipe(
  filter(pastel => (pastel.type === 'Salgado' && pastel.name !== 'Carne')),
  distinct(),
  take(5)
);

pasteisDoces = (pastel$) => pastel$.pipe(
  filter(pastel => pastel.type === 'Doce'),
  take(3)
);

const sourcePasteis$ = from(pasteis);
const salgadas$ = pasteisSalgados(sourcePasteis$);
const doces$ = pasteisDoces(sourcePasteis$);

salgadas$.pipe(merge(doces$)).subscribe(
  pastel => pasteisPessoa1.push(pastel)
);

/* 
pessoa1Salgada
.pipe(
  filter(pastel => pastel.type === 'Salgado' && pastel.name !== 'Mussarela'),
  take(5)
).subscribe(
  pastel => pasteisPessoa1.push(pastel),
);
pessoa1Doce
.pipe(
  filter(pastel => pastel.type === 'Doce'),
  take(3)
).subscribe(
  pastel => pasteisPessoa1.push(pastel),
); */

pessoa2
.pipe(
  skipWhile(pastel => pastel.type === 'Salgado')
)
.subscribe(
  pastel => pasteisPessoa2.push(pastel)
);

pessoa3
.pipe(
  distinct()
)
.subscribe(
  pastel => pasteisPessoa3.push(pastel)
);

setPastel = (pastel) => {
  pessoa2.next(pastel);
  pessoa3.next(pastel);
}

pasteis.forEach(pastel => setPastel(pastel));

console.log(`pasteisPessoa1: ${JSON.stringify(pasteisPessoa1, null, 2)}`);
console.log(`pasteisPessoa2: ${JSON.stringify(pasteisPessoa2, null, 2)}`);
console.log(`pasteisPessoa3: ${JSON.stringify(pasteisPessoa3, null, 2)}`);