const CreatureDB = {
  slimeAcido: {
    name: 'Slime Ácido',
    rarity: 'comum',
    icon: 'https://2img.net/i.imgur.com/zGM1Mlv.png',
    image: 'https://2img.net/i.imgur.com/272z0Ne.jpeg',
    subtitle: 'CR 1/6',
    description:
      'Os Slimes são criaturas básicas e instintivas, movidas apenas pela necessidade de se alimentar e sobreviver. Não possuem inteligência real e reagem de forma automática ao ambiente. Costumam ser lentos e inofensivos se não forem provocados, mas atacarão qualquer coisa que percebam como alimento. Sua agressividade é mínima, e geralmente só atacam quando se deparam com algo metálico ou que toque diretamente sua substância gelatinosa. Por serem resilientes e adaptáveis, podem ser encontrados em diversos ambientes, desde florestas úmidas até cavernas escuras.',
    type: 'Monstro Médio, Gosma',
    ac: '9 (Pele Maleável)',
    hp: '9 (2d6 + 2)',
    speed: '6m',
    stats: {
      forca: '10 (+0)',
      destreza: '8 (-1)',
      constituicao: '12 (+1)',
      inteligencia: '1 (-5)',
      sabedoria: '6 (-2)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência à concussão',
        desc: 'Danos de impacto são absorvidos pela gelatina',
      },
      {
        nome: 'Corpo Amorfo',
        desc: 'O slime pode se mover através de um espaço de até 2,5 cm de largura sem se espremer.',
      },
      {
        nome: 'Aderência Superficial',
        desc: 'Pode escalar superfícies difíceis, inclusive teto, sem precisar de teste de habilidade.',
      },
      {
        nome: 'Natureza Reativa',
        desc: 'Se o slime sofrer dano de um ataque corpo a corpo, o atacante recebe 1 de dano ácido residual que espirra da criatura.',
      },
    ],
    acoes: [
      {
        nome: 'Pancada Ácida',
        desc: 'Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1m. Dano: 4 (1d4 + 2) de dano ácido.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '8',
      visaoEscuro: '0',
    },
    drops: [
      {
        range: '1',
        item: 'Nada.',
      },
      {
        range: '2',
        item: 'Núcleo de Gelatina Estável',
      },
      {
        range: '3',
        item: 'Resíduo Viscoso',
      },
      {
        range: '4',
        item: 'Restos Metálicos Corroídos',
      },
    ],
  },
  slimeDeFogo: {
    name: 'Slime de Fogo',
    rarity: 'comum',
    icon: 'https://2img.net/i.imgur.com/YLZDdxQ.png',
    image: 'https://2img.net/i.imgur.com/b2Z9ogm.jpeg',
    subtitle: 'CR 1/6',
    description:
      'Os Slimes de Fogo são criaturas instintivamente agressivas, movidas por um desejo irracional de queimar tudo ao seu redor. Diferente dos Slimes comuns, eles tendem a se mover de forma errática e inquieta, sendo atraídos por calor e materiais inflamáveis. São imprevisíveis e podem atacar qualquer coisa que se aproxime, seja por instinto de defesa ou simplesmente por contato. Apesar de sua natureza destrutiva, não possuem verdadeira malícia, apenas um comportamento caótico e impulsivo. Evitam corpos d’água e recuam instintivamente diante de ameaças aquáticas.',
    type: 'Monstro médio, gosma',
    ac: '9',
    hp: '9 (2d6 + 2)',
    speed: '6m',
    stats: {
      forca: '10 (+0)',
      destreza: '8 (-1)',
      constituicao: '12 (+1)',
      inteligencia: '1 (-5)',
      sabedoria: '6 (-2)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'fogo',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Água',
      },
      {
        nome: 'Brilho Próprio',
        desc: 'O slime emite luz plena em um raio de 1m e luz penumbra por mais 1m.',
      },
      {
        nome: 'Corpo Amorfo',
        desc: 'Pode passar por frestas de até 2,5 cm',
      },
      {
        nome: 'Combustão espontânea',
        desc: 'Qualquer criatura que toque o slime ou o atinja com um ataque corpo a corpo a menos de 1m recebe 1 de dano de fogo (as fagulhas saltam no atacante).',
      },
      {
        nome: 'Trilha de cinzas',
        desc: 'O slime deixa uma marca de queimado por onde passa. Materiais inflamáveis (palha, papel, óleo) que ele toque se incendeiam instantaneamente.',
      },
    ],
    acoes: [
      {
        nome: 'Toque incandescente',
        desc: 'Ataque Corpo a Corpo: +2 para acertar, alcance 1m. Dano: 4 (1d4 + 2) de dano de fogo.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '8',
      visaoEscuro: '4m',
    },
    drops: [
      {
        range: '1',
        item: 'Nada',
      },
      {
        range: '2',
        item: 'Essência ignea',
      },
      {
        range: '3',
        item: 'Carvão Eterno',
      },
      {
        range: '4',
        item: 'Cinza Vulcânica',
      },
    ],
  },
  slimeDeAgua: {
    name: 'Slime de água',
    rarity: 'comum',
    icon: 'https://2img.net/i.imgur.com/oklGGWG.png',
    image: 'https://2img.net/i.imgur.com/Pawnr5T.jpeg',
    subtitle: 'Bestiário de Salazar',
    description:
      'Os Slimes de Água são criaturas passivas e fluídas, geralmente evitando conflitos diretos, a menos que se sintam ameaçados. Sua natureza os torna mais adaptáveis ao ambiente, muitas vezes se camuflando em corpos d’água como lagos, rios ou até mesmo poças. São curiosos e podem seguir viajantes sem intenção hostil, movidos por estímulos externos como vibrações ou presença de umidade. No entanto, quando atacados, respondem com jatos de água, tentando desestabilizar seus oponentes em vez de causar dano letal. Apesar de sua aparência tranquila, são vulneráveis a eletricidade, recuando instintivamente diante de ameaças desse tipo.',
    type: 'Monstro médio, gosma',
    ac: '10',
    hp: '9 (2d6 + 2)',
    speed: '6m',
    stats: {
      forca: '10 (+0)',
      destreza: '10 (+0)',
      constituicao: '12 (+1)',
      inteligencia: '1 (-5)',
      sabedoria: '8 (-1)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistências',
        desc: 'Ácido e Fogo',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Raio',
      },
      {
        nome: 'Anfibio',
        desc: 'O slime pode respirar tanto no ar quanto na água.',
      },
      {
        nome: 'Corpo Amorfo',
        desc: 'Pode passar por frestas de até 2,5 cm',
      },
      {
        nome: 'Trasnparência',
        desc: 'Enquanto estiver submerso em água, o slime é invisível para criaturas que não tenham visão verdadeira ou sentido cego. No seco, ele concede Desvantagem em ataques à distância contra ele.',
      },
      {
        nome: 'Diluição',
        desc: 'Se o slime sofrer dano de um ataque de concussão, ele se divide momentaneamente, reduzindo o dano em 1 (mínimo 1).',
      },
    ],
    acoes: [
      {
        nome: 'Jato de Pressão',
        desc: 'Ataque à Distância/Corpo a Corpo: +2 para acertar, alcance 4m. Dano: 4 (1d4 + 2) de dano de impacto.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '9',
      visaoEscuro: '0',
    },
    drops: [
      {
        range: '1',
        item: 'Nada',
      },
      {
        range: '2',
        item: 'Água Destilada Mágica',
      },
      {
        range: '3',
        item: 'Vesícula de Ar',
      },
      {
        range: '4',
        item: 'Limo Hidrofóbico',
      },
    ],
  },
  slimeDeGelo: {
    name: 'Slime de Gelo',
    rarity: 'incomum',
    icon: 'https://2img.net/i.imgur.com/zHDBUjr.png',
    image: 'https://2img.net/i.imgur.com/4DuEjEI.jpeg',
    subtitle: 'Bestiário de Salazar',
    description:
      'Os Slimes de Gelo são criaturas silenciosas e metódicas, movendo-se de maneira lenta, porém constante. Diferente de seus primos elementais mais agitados, eles tendem a permanecer imóveis por longos períodos, quase como se estivessem hibernando, e só reagem quando algo entra em seu território. Sua defesa natural os torna difíceis de enfrentar em combates corpo a corpo, pois qualquer toque prolongado pode resultar em congelamento. Apesar de não serem naturalmente agressivos, eles atacam qualquer fonte de calor que percebam como uma ameaça, tentando extinguir o que poderia derretê-los. Em ambientes frios, podem se esconder entre o gelo e a neve, esperando pacientemente por presas desavisadas.',
    type: 'Monstro médio, Gosma',
    ac: '11',
    hp: '10 (2d6 + 4)',
    speed: '6m (9m se estiver sobre gelo ou neve)',
    stats: {
      forca: '10 (+0)',
      destreza: '6 (-2)',
      constituicao: '14 (+2)',
      inteligencia: '1 (-5)',
      sabedoria: '6 (-2)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Gelo',
      },
      {
        nome: 'Absorção',
        desc: 'Água',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Fogo',
      },
      {
        nome: 'Corpo Amorfo',
        desc: 'Devido à rigidez, ele só passa por frestas de até 5 cm (em vez de 2,5 cm)',
      },
      {
        nome: 'Gelo Escorregadio',
        desc: 'O chão em um raio de 1m ao redor do slime é considerado Terreno Difícil. Criaturas que entrarem nessa área devem passar num teste de DES (CD 10) ou ficam Caídas.',
      },
      {
        nome: 'Toque Congelante',
        desc: 'Qualquer criatura que atinja o slime com um ataque corpo a corpo a menos de 1m recebe 1 de dano de frio.',
      },
    ],
    acoes: [
      {
        nome: 'Estilhaço de gelo',
        desc: 'Ataque Corpo a Corpo: +2 para acertar, alcance 1m. Dano: 4 (1d4 + 2) de dano de frio.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '8',
      visaoEscuro: '0',
    },
    drops: [
      {
        range: '1',
        item: 'Nada',
      },
      {
        range: '2',
        item: 'Gelo Eterno',
      },
      {
        range: '3',
        item: 'Líquido Antifrio',
      },
      {
        range: '4',
        item: 'Cristal de Geada',
      },
    ],
  },
  slimeDeTerra: {
    name: 'Slime de terra',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/x516uMj.png',
    image: 'https://2img.net/i.imgur.com/bc1ahcy.jpeg',
    subtitle: 'Bestiário de Salazar',
    description:
      'Os Slimes de Terra são criaturas pacientes e resilientes, movendo-se de forma lenta, mas implacável. Diferente de outros Slimes, eles possuem um instinto territorial mais desenvolvido, muitas vezes se enterrando no solo ou se fundindo com rochas para emboscar invasores. Não costumam atacar sem motivo, mas reagem de maneira agressiva a qualquer ameaça percebida, utilizando sua força bruta para afastar o perigo. Apesar de sua aparência pesada, podem se mover de maneira surpreendentemente furtiva ao se misturarem com o terreno. São criaturas de hábitos simples, preferindo permanecer em cavernas, montanhas ou regiões áridas onde possam se camuflar facilmente.',
    type: 'Monstro Médio, Gosma',
    ac: '11',
    hp: '11 (2d6 + 4)',
    speed: '5m',
    stats: {
      forca: '12 (+1)',
      destreza: '6 (-2)',
      constituicao: '14 (+2)',
      inteligencia: '1 (-5)',
      sabedoria: '8 (-1)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistências',
        desc: 'Veneno e Perfuração',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Água/Ácido',
      },
      {
        nome: 'Sentidos',
        desc: 'Sentido Sísmico 9m',
      },
      {
        nome: 'Corpo Amorfo',
        desc: 'Devido às pedras internas, ele só passa por frestas de até 5 cm.',
      },
      {
        nome: 'Firmeza rochosa',
        desc: 'O slime tem Vantagem em testes de resistência para não ser empurrado ou derrubado (caído).',
      },
      {
        nome: 'Camuflagem terrosa',
        desc: 'Enquanto estiver parado em terreno de terra, lama ou pedra, o slime tem Vantagem em testes de Furtividade para se esconder.',
      },
    ],
    acoes: [
      {
        nome: 'Pancada de cascalho',
        desc: 'Ataque Corpo a Corpo: +3 para acertar, alcance 1m. Dano: 4 ($1d4 + 2$) de dano de concussão.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '9',
      visaoEscuro: '0',
    },
    drops: [
      {
        range: '1',
        item: 'Nada.',
      },
      {
        range: '2',
        item: 'Argila Primordial',
      },
      {
        range: '3',
        item: 'Fragmento de Minério',
      },
      {
        range: '4',
        item: 'Lodo Adesivo de Solo',
      },
    ],
  },
  slimeEletrico: {
    name: 'Slime Elétrico',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/alN7S8P.png',
    image: 'https://2img.net/i.imgur.com/p7heenj.jpeg',
    subtitle: 'CR 1',
    description:
      'Os Slimes Elétricos são criaturas hiperativas e imprevisíveis, movendo-se com agilidade e emitindo pequenos estalos de eletricidade a todo momento. Frequentemente encontrados em áreas de tempestades, ruínas com resquícios de energia mágica ou perto de fontes naturais de eletricidade, esses Slimes são altamente instáveis e podem descarregar energia de forma espontânea. Seu corpo constantemente gera faíscas, tornando-os perigosos para quem se aproxima sem proteção adequada. Apesar de sua aparência instável, eles tendem a ser curiosos e podem perseguir alvos sem necessariamente atacá-los, como se fossem atraídos pela energia vital de outros seres.',
    type: 'Monstro médio, gosma',
    ac: '12',
    hp: '22 (5d6 + 5)',
    speed: '9m',
    stats: {
      forca: '8 (-1)',
      destreza: '14 (+2)',
      constituicao: '12 (+1)',
      inteligencia: '1 (-5)',
      sabedoria: '10 (+0)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Luminosidade',
        desc: 'Emite uma luz azulada pulsante em um raio de 3m.',
      },
      {
        nome: 'Corpo amorfo',
        desc: 'Pode passar por frestas de até 2,5 cm.',
      },
      {
        nome: 'Curto-circuito',
        desc: 'Qualquer criatura que atinja o slime com um ataque corpo a corpo usando uma arma de metal recebe 2 de dano elétrico e não pode usar Reações até o início do seu próximo turno (o choque trava os reflexos).',
      },
      {
        nome: 'Sobrecarga',
        desc: 'Se o slime sofrer dano elétrico de uma fonte externa, ele não recebe dano e seu próximo ataque terá Vantagem.',
      },
      {
        nome: 'Resistência',
        desc: 'Elétrico',
      },
    ],
    acoes: [
      {
        nome: 'Toque voltaico',
        desc: 'Ataque Corpo a Corpo: +4 para acertar, alcance 1.5m. Dano: 9 ($2d6 + 2$) de dano elétrico. Se o alvo estiver usando armadura de metal, o Slime tem Vantagem no teste de ataque.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '10',
      visaoEscuro: '18',
    },
    drops: [
      {
        range: '1',
        item: 'Nada.',
      },
      {
        range: '2',
        item: 'Condensador de Gel',
      },
      {
        range: '3',
        item: 'Fluido Condutor',
      },
      {
        range: '4',
        item: 'Núcleo de Magnetita',
      },
    ],
  },
  slimeMetalico: {
    name: 'Slime Metálico',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/Zse4dFy.png',
    image: 'https://2img.net/i.imgur.com/XuKuMpC.jpeg',
    subtitle: 'CR 1',
    description:
      'Os Slimes Metálicos são considerados uma das variantes mais resistentes e perigosas da família dos Slimes elementais. Seu corpo possui uma estrutura altamente densa e maleável, capaz de endurecer instantaneamente para repelir ataques ou se transformar em lâminas afiadas para atacar. Esses Slimes são frequentemente encontrados em minas antigas, forjas abandonadas ou locais com alta concentração de metais naturais. Seu comportamento é mais defensivo do que ofensivo, atacando apenas quando ameaçados. No entanto, sua resistência excepcional e capacidade de refletir golpes os tornam adversários formidáveis, especialmente para guerreiros que dependem de armas físicas.',
    type: 'Monstro médio, Gosma',
    ac: '15',
    hp: '18 (4d6 + 4)',
    speed: '4m',
    stats: {
      forca: '14 (+2)',
      destreza: '6 (-2)',
      constituicao: '12 (+1)',
      inteligencia: '1 (-5)',
      sabedoria: '10 (+0)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Cortante, Perfurante e Concussão de armas não mágicas.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno.',
      },
      {
        nome: 'Corpo amorfo',
        desc: 'Devido à densidade metálica, ele passa por frestas de até 5 cm.',
      },
      {
        nome: 'Corrosão de metal',
        desc: 'Qualquer arma feita de metal que atinja o slime sofre uma penalidade permanente e cumulativa de -1 nas jogadas de dano. Se a penalidade chegar a -5, a arma é destruída. (Armas mágicas ignoram este efeito).',
      },
      {
        nome: 'Peso esmagador',
        desc: 'O slime não pode ser empurrado ou derrubado por criaturas de tamanho Médio ou menor.',
      },
    ],
    acoes: [
      {
        nome: 'Pancada pesada',
        desc: 'Ataque Corpo a Corpo: +4 para acertar, alcance 1m. Dano: 7 (1d10 + 2) de dano de concussão. Se o alvo estiver usando armadura de metal, ele deve ter sucesso em uma RES de FOR (CD 12) ou será empurrado 1m para trás e ficará Caído.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '10',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Nada.',
      },
      {
        range: '2',
        item: 'Mercúrio Estável',
      },
      {
        range: '3',
        item: 'Limalha de Aço Nobre',
      },
      {
        range: '4',
        item: 'Núcleo Cromado',
      },
    ],
  },
  slimeNecrotico: {
    name: 'Slime necrótico',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/k7Jp5u8.png',
    image: 'https://2img.net/i.imgur.com/AkTcE0A.jpeg',
    subtitle: 'CR 1/6',
    description:
      'Os Slimes Necróticos são manifestações corrompidas de gosmas elementais, imbuídas com a essência da morte e da decomposição. Encontrados em cemitérios profanados, criptas abandonadas e locais onde a energia sombria se acumula, esses Slimes parecem pulsar com uma energia negativa incessante. Seu corpo translúcido exala uma névoa escura, drenando a vitalidade de qualquer ser vivo próximo. Criaturas que enfrentam um Slime Necrótico podem sentir sua força vital sendo lentamente drenada, e seus ataques necróticos podem enfraquecer até os guerreiros mais robustos. Por sua conexão com forças profanas, esses Slimes são especialmente vulneráveis à luz radiante e feitiços sagrados.',
    type: 'Monstro médio, gosma',
    ac: '10',
    hp: '27 (5d6 + 10)',
    speed: '6m',
    stats: {
      forca: '12 (+1)',
      destreza: '8 (-1)',
      constituicao: '14 (+2)',
      inteligencia: '1 (-5)',
      sabedoria: '10 (+0)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Necrótico e Veneno.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Radiante',
      },
      {
        nome: 'Aura de quietude',
        desc: 'Animais pequenos (insetos, pássaros) morrem instantaneamente ao entrar em um raio de 1m do slime.',
      },
      {
        nome: 'Corpo amorfo',
        desc: 'Pode passar por frestas de até 2,5 cm.',
      },
      {
        nome: 'Miasma de decomposição',
        desc: 'Qualquer criatura que comece seu turno a até 1m do slime deve ter sucesso em uma RES de CON (CD 12) ou sofrerá 2 de dano necrótico. Além disso, enquanto estiver nesta área, qualquer cura recebida pela criatura é reduzida pela metade.',
      },
      {
        nome: 'Presença profana',
        desc: 'O slime é detectado por habilidades que sentem mortos-vivos, embora tecnicamente ainda seja uma gosma.',
      },
    ],
    acoes: [
      {
        nome: 'Toque putrefato',
        desc: 'Ataque Corpo a Corpo: +3 para acertar, alcance 1m. Dano: 8 (2d6 + 1) de dano necrótico. O alvo deve ter sucesso em uma RES de CON (CD 11) ou seu HP máximo será reduzido em um valor igual ao dano sofrido. Essa redução dura até um descanso longo.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '10',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Nada.',
      },
      {
        range: '2',
        item: 'Essência de Miasma',
      },
      {
        range: '3',
        item: 'Ectoplasma Negro',
      },
      {
        range: '4',
        item: 'Fragmento de Osso Antigo',
      },
    ],
  },
  slimeVoraz: {
    name: 'Slime voraz',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/6EqAKpG.png',
    image: 'https://2img.net/i.imgur.com/Hefv5za.jpeg',
    subtitle: 'CR 3',
    description:
      'Os Slimes Vorazes são o ápice da evolução instintiva, onde a simples necessidade de se alimentar transformou-se em uma fúria predatória incontrolável. Ao contrário de suas formas juvenis, o Slime Voraz não flutua calmamente; ele se move com uma massa pesada e deliberada, impulsionado por uma musculatura gelatinosa que se assemelha a tendões vivos. Sua substância, agora densa e turva, exala um vapor acre que queima os pulmões e dissolve o metal antes mesmo do contato.',
    type: 'Monstro médio, gosma',
    ac: '13',
    hp: '+68 (8d8 + 32)',
    speed: '9m escalar 9m',
    stats: {
      forca: '16 (+3)',
      destreza: '10 (+0)',
      constituicao: '18 (+4)',
      inteligencia: '3 (-4)',
      sabedoria: '10 (+0)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Ácido; Concussão, Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Corpo corrosivo',
        desc: 'Uma criatura que toque o slime ou o atinja com um ataque corpo a corpo a menos de 1m sofre 1d6$de dano ácido. Armas não-mágicas de metal que atinjam o slime recebem uma penalidade permanente de -1 no dano após o ataque.',
      },
      {
        nome: 'Frenesi de sangue',
        desc: 'O slime tem Vantagem em jogadas de ataque contra qualquer criatura que não esteja com seus Pontos de Vida máximos.',
      },
    ],
    acoes: [
      {
        nome: 'Multi-ataque',
        desc: 'O Slime realiza dois ataques de Pancada Ácida ou um de Pancada e um de Bote Voraz.',
      },
      {
        nome: 'Pancada ácida',
        desc: 'Ataque Corpo a Corpo: +5 para acertar. Dano: 10 (2d6 + 3) de dano ácido.',
      },
      {
        nome: 'Bote voraz',
        desc: 'taque Corpo a Corpo: +5 para acertar. Dano: 7 (1d8 + 3) de dano ácido. Se o alvo for uma criatura Média ou menor, ela fica Agarrada (CD 13 para escapar). Enquanto estiver agarrada, a criatura está Impedida e sofre 2d6 de dano ácido no início de cada turno do slime.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '10',
      visaoEscuro: '18',
    },
    drops: [
      {
        range: '1',
        item: 'Suco Gástrico Concentrado',
      },
      {
        range: '2',
        item: 'Membrana Resistente',
      },
      {
        range: '3',
        item: 'Glândula de Frenesi',
      },
      {
        range: '4',
        item: 'Fragmentos de Equipamento',
      },
    ],
  },
  slimeExplosivo: {
    name: 'Slime explosivo',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/6nTRXpV.png',
    image: 'https://2img.net/i.imgur.com/WhCICB0.jpeg',
    subtitle: 'CR 3',
    description:
      'Se o Slime de Fogo é uma chama que busca combustível, o Slime Explosivo é um incêndio que aprendeu a odiar. Ao trilhar o Caminho Bestial, essa criatura deixa de apenas exalar calor para se tornar uma caldeira biológica de alta pressão. Seu instinto de sobrevivência foi substituído por uma agressividade reativa: cada golpe que recebe não o intimida, mas sim acelera a vibração de seu núcleo, transformando a dor em detonação.',
    type: 'Monstro médio, gosma',
    ac: '12',
    hp: '+60 (8d8 + 24)',
    speed: '9m',
    stats: {
      forca: '14 (+2)',
      destreza: '14 (+2)',
      constituicao: '16 (+3)',
      inteligencia: '3 (-4)',
      sabedoria: '10 (+0)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Fogo.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Gelo',
      },
      {
        nome: 'Reação instável',
        desc: 'Sempre que o slime sofrer dano de um ataque crítico, todas as criaturas a 1m sofrem 2d6 de dano de fogo devido ao vazamento de plasma.',
      },
      {
        nome: 'Corpo incandescente',
        desc: 'Uma criatura que toque o slime ou o atinja com um ataque corpo a corpo a menos de 1m recebe 3 de dano de fogo. Materiais inflamáveis que ele toque se incendeiam.',
      },
    ],
    acoes: [
      {
        nome: 'Multi-ataque',
        desc: 'O Slime realiza dois ataques de Pancada Árdente.',
      },
      {
        nome: 'Pancada ardente',
        desc: 'Ataque Corpo a Corpo: +4 para acertar. Dano: 9 (2d6 + 2) de dano de fogo + 1d4 de dano de impacto.',
      },
      {
        nome: 'Detonação controlada (Recarga 5-6 turnos)',
        desc: 'O slime contrai seu corpo e libera uma explosão em um raio de 4 metros. Cada criatura na área deve fazer um teste de resistência de Destreza (CD 13). Sofre 4d6 de dano de fogo em uma falha, ou metade em um sucesso.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '10',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Nada',
      },
      {
        range: '2',
        item: 'Coração de Magma',
      },
      {
        range: '3',
        item: 'Fuligem Explosiva',
      },
      {
        range: '4',
        item: 'Gema de Ignis	',
      },
    ],
  },
  slimeDaCorrenteza: {
    name: 'Slime da correnteza',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/k5YcVtc.png',
    image: 'https://2img.net/i.imgur.com/bO4uvVp.jpeg',
    subtitle: 'CR 3',
    description:
      'O Slime de Correnteza é a prova de que a água, em sua forma mais pura e selvagem, pode ser tão devastadora quanto o aço. Ao evoluir pelo Caminho Bestial, ele deixa de ser uma massa informe para se tornar um sistema de propulsão biológica. Ele não apenas flui sobre o solo; ele ruge como uma inundação confinada em um corpo físico.',
    type: 'Monstro médio, gosma',
    ac: '14',
    hp: '+64 (8d8 + 28)',
    speed: '9m, 15m natação',
    stats: {
      forca: '16 (+3)',
      destreza: '14 (+2)',
      constituicao: '16 (+3)',
      inteligencia: '3 (-4)',
      sabedoria: '10 (+0)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Ácido e Fogo; Concussão, Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Raio',
      },
      {
        nome: 'Forma fluida',
        desc: 'O slime pode se mover através do espaço de uma criatura hostil e vice-versa. Ele não provoca ataques de oportunidade ao sair do alcance de um inimigo se estiver se movendo em direção à água ou terreno molhado.',
      },
      {
        nome: 'Pressão interna',
        desc: 'Quando o slime sofre dano de concussão, ele libera um jato de água reativo. O atacante deve passar em uma RES de FOR (CD 13) ou será empurrado 1m para trás.',
      },
    ],
    acoes: [
      {
        nome: 'Multi-ataque',
        desc: 'O Slime realiza dois ataques de Chicote de Alta Pressão.',
      },
      {
        nome: 'Chicote de alta pressão',
        desc: 'Ataque Corpo a Corpo: +5 para acertar, alcance 3m. Dano: 10 (2d6 + 3) de dano de impacto.',
      },
      {
        nome: 'Vórtice de sucção (Recarga 5t)',
        desc: 'O slime gira violentamente. Cada criatura a até 3 metros deve fazer um teste de resistência de Força (CD 13). Em uma falha, a criatura sofre 3d6 de dano de impacto, é puxada para um espaço adjacente ao slime e fica Caída.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '10',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Água Pesada',
      },
      {
        range: '2',
        item: 'Vesícula de Ar Puro',
      },
      {
        range: '3',
        item: 'Essência de Correnteza',
      },
      {
        range: '4',
        item: 'Lodo Hidrostático',
      },
    ],
  },
  slimeDeEstalactite: {
    name: 'Slime de estalactite',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/GxPZiSm.png',
    image: 'https://2img.net/i.imgur.com/P02n4Al.jpeg',
    subtitle: 'CR 3',
    description:
      'O Slime de Estalactite é uma visão aterrorizante de beleza letal. Diferente das gosmas comuns, ele possui uma estrutura semi-rígida que brilha com um azul neon intenso vindo de seu núcleo profundo. Ele se move com estalos de gelo quebrando e se reformando instantaneamente.',
    type: 'Monstro médio, gosma',
    ac: '15',
    hp: '+72 (9d8 + 31)',
    speed: '9m, escalar 9m',
    stats: {
      forca: '16 (+3)',
      destreza: '12 (+1)',
      constituicao: '16 (+3)',
      inteligencia: '3 (-4)',
      sabedoria: '10 (+0)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Frio; Concussão e Cortante de armas não-mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Fogo',
      },
      {
        nome: 'Geometria perfurante',
        desc: 'Qualquer criatura que tente agarrar o slime ou o atinja com um ataque desarmado sofre 2d4 de dano perfurante devido aos espinhos de cristal.',
      },
      {
        nome: 'Aura de zero absoluto',
        desc: 'No início do turno do slime, cada criatura a 1m dele deve passar em uma RES de CON (CD 13) ou terá seu deslocamento reduzido em 3 metros até o início do próximo turno.',
      },
    ],
    acoes: [
      {
        nome: 'Multi-ataque',
        desc: 'O Slime realiza dois ataques de Estocada Glacial.',
      },
      {
        nome: 'Estocada Glacial',
        desc: 'Ataque Corpo a Corpo: +5 para acertar, alcance 3m (ele estende um espigão). Dano: 10 (2d6 + 3) de dano perfurante + 1d4 de dano de frio.',
      },
      {
        nome: 'Chuva de estalactite (Recarga 5t)',
        desc: 'O slime dispara estilhaços de si mesmo para cima que caem em um círculo de 3m de raio. Cada criatura na área deve fazer uma RES de Destreza (CD 13). Sofre 4d6 de dano perfurante e fica Impedida por agulhas de gelo presas ao chão (pode escapar com uma ação e teste de FOR CD 13).',
      },
    ],
    sentidos: {
      percepcaoPassiva: '10',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Fragmento de Gelo Negro',
      },
      {
        range: '2',
        item: 'Ponta de Estalactite Perfeita',
      },
      {
        range: '3',
        item: 'Fluido Criogênico Puro',
      },
      {
        range: '4',
        item: 'Núcleo Hexagonal de Mana',
      },
    ],
  },
  slimeDeCascalho: {
    name: 'Slime de cascalho',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/Jj6tHaz.png',
    image: 'https://2img.net/i.imgur.com/PKKkc3V.jpeg',
    subtitle: 'CR 3',
    description: `Relatos de viajantes e mineiros frequentemente mencionam 'encostas que se movem'. O Slime de Cascalho é a prova viva de que a terra não é apenas um palco para a vida, mas pode se tornar o próprio predador. Evoluídos de simples poças de barro, essas criaturas consomem minerais preciosos para construir uma carapaça de rocha quase impenetrável.

Diferente de outros Slimes que tentam dissolver a presa, o de Cascalho prefere o método da força bruta: ele soterra seus oponentes sob centenas de quilos de brita e granito, esperando que o fôlego acabe para então absorver os nutrientes dos restos esmagados. Sua paciência é geológica; ele pode permanecer imóvel por décadas, parecendo apenas um amontoado de detritos em uma caverna, até que o som de passos humanos ative seu núcleo de mana. Atacar um Slime de Cascalho com aço comum é como tentar derrubar uma montanha com um talher: inútil e perigoso para a integridade da sua lâmina.`,
    type: 'Monstro médio, gosma',
    ac: '16',
    hp: '+85 (10d8 + 40)',
    speed: '6m, escavação 6m',
    stats: {
      forca: '18 (+4)',
      destreza: '6 (-2)',
      constituicao: '18 (+4)',
      inteligencia: '3 (-4)',
      sabedoria: '12 (+1)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Veneno; Concussão, Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Imunidade',
        desc: 'Condição Caído e Empurrado (por criaturas de tamanho Médio ou menor).',
      },
      {
        nome: 'Núcleo gravitacional',
        desc: 'O Slime de Cascalho gera um campo de atração. Qualquer criatura que comece o turno a 1m dele tem seu deslocamento reduzido em 4m.',
      },
      {
        nome: 'Camuflagem de pedregulh',
        desc: 'Enquanto estiver imóvel, o slime é indistinguível de um amontoado de rochas naturais (Teste de Investigação CD 16 para perceber).',
      },
    ],
    acoes: [
      {
        nome: 'Multi-ataque',
        desc: 'O Slime realiza dois ataques de Esmagamento de Brita.',
      },
      {
        nome: 'Esmagamento de brita',
        desc: 'Ataque Corpo a Corpo: +6 para acertar. Dano: 11 (2d6 + 4) de dano de concussão.',
      },
      {
        nome: 'Sepultamento vivo (Recarga 5t)',
        desc: 'O slime explode sua massa de pedras sobre uma criatura a até 3m. O alvo deve fazer uma RES de Força (CD 14). Se falhar, sofre 4d6 de dano de concussão e fica Impedido (soterrado). Uma criatura pode usar uma ação para fazer um teste de FOR (CD 14) e libertar a si mesma ou a outra pessoa.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: 'sentido sismico 18m',
    },
    drops: [
      {
        range: '1',
        item: 'Areia Abrasiva Rara',
      },
      {
        range: '2',
        item: 'Coração de Geodo',
      },
      {
        range: '3',
        item: 'Essência de Gravidade',
      },
      {
        range: '4',
        item: 'Placa de Granito Vivo',
      },
    ],
  },
  slimeCentelha: {
    name: 'Slime centelha',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/bS9DcxR.png',
    image: 'https://2img.net/i.imgur.com/5YIGw2l.jpeg',
    subtitle: 'CR 3',
    description: `Os estudiosos costumam dizer que o Slime Centelha não viaja através do espaço, ele o perfura. Evoluído de slimes expostos a tempestades de mana ou máquinas antigas de civilizações perdidas, esta criatura é a personificação da energia cinética indomável.

Diferente de seus parentes mais lentos, o Centelha possui um sistema nervoso hiper-estimulado que o mantém em um estado de vibração perpétua. No campo de batalha, ele ignora as leis da fricção, deslizando por paredes e tetos como um raio vivo. O maior perigo não é apenas o seu toque letal, mas a sua capacidade de paralisar o sistema nervoso de suas vítimas com um simples pulso de sua aura.

Relatos de sobreviventes descrevem a luta contra um bando desses monstros como 'tentar golpear o relâmpago'. Aqueles que usam armaduras de metal tornam-se para-raios vivos, servindo como condutores para a fome elétrica da criatura. Para derrotá-lo, é necessário mais do que força; é preciso prever onde a luz atingirá antes mesmo de ela brilhar.`,
    type: 'Monstro médio, gosma',
    ac: '15',
    hp: '60 (10d8 + 15)',
    speed: '15m (pode andar por paredes e tetos)',
    stats: {
      forca: '10 (+0)',
      destreza: '20 (+5)',
      constituicao: '13 (+1)',
      inteligencia: '3 (-4)',
      sabedoria: '12 (+1)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Elétrico; Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Imunidade',
        desc: 'Condição Impedido e Paralisado.',
      },
      {
        nome: 'Aceleração Sinaptica',
        desc: 'O Slime Centelha pode realizar a ação de Desengajar ou Disparar como uma Ação Bónus em cada um dos seus turnos.',
      },
      {
        nome: 'Corpo eletrizado',
        desc: 'Uma criatura que atinja o slime com um ataque corpo a corpo usando uma arma de metal sofre 4 (1d8) de dano elétrico e não pode realizar reações até o início do seu próximo turno.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Slime realiza três ataques de Chicote de Plasma.',
      },
      {
        nome: 'Chicote de plasma',
        desc: 'Ataque Corpo a Corpo: +7 para acertar, alcance 3m. Dano: 8 (1d6 + 5) de dano elétrico.',
      },
      {
        nome: 'Descarga de sobrecarga (Recarga 5t)',
        desc: 'O Slime liberta um pulso de 6 metros. Cada criatura na área deve fazer uma RES de Constituição (CD 13). Se falhar, sofre 3d8 de dano elétrico e fica Paralizada até o final do seu próximo turno.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '18',
    },
    drops: [
      {
        range: '1',
        item: 'Bateria de Gel Azul',
      },
      {
        range: '2',
        item: 'Fio Condutor de Nervos',
      },
      {
        range: '3',
        item: 'Estímulo de Adrenalina',
      },
      {
        range: '4',
        item: 'Núcleo de Singularidade Elétrica',
      },
    ],
  },
  slimeDeEstilhacos: {
    name: 'Slime de estilhaços',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/jowgJ6x.png',
    image: 'https://2img.net/i.imgur.com/XHDuZoY.jpeg',
    subtitle: 'CR 3',
    description: `Entre os aventureiros de Rank B, o Slime de Estilhaços é conhecido como o 'Devorador de Espadas'. Esta evolução bestial do metal ocorre quando uma gosma metálica consome uma quantidade massiva de armas mágicas ou restos de campos de batalha sangrentos, assimilando não apenas o aço, mas a sede de sangue das lâminas.

Diferente de outros slimes que tentam engolfar suas presas, o de Estilhaços as retalha. Ele utiliza magnetismo interno para converter seu corpo em uma centrífuga de estilhaços ultra-afiados que podem rasgar couro, cota de malha e até placas de aço temperado em segundos. É uma criatura de pura agressão mecânica; não há diplomacia ou fuga fácil quando os chicotes de lâminas começam a girar.

Estrategistas recomendam o uso de magias de calor intenso para fundir suas articulações ou ataques de impacto pesado para desestabilizar sua coesão. No entanto, o maior erro que um guerreiro pode cometer é acreditar que sua armadura o protegerá, pois, para o Slime de Estilhaços, sua armadura é apenas mais matéria-prima para ser mastigada e cuspida de volta contra seus aliados.`,
    type: 'Monstro médio, gosma',
    ac: '17',
    hp: '75 (10d8 + 30)',
    speed: '9m',
    stats: {
      forca: '16 (+3)',
      destreza: '14 (+2)',
      constituicao: '16 (+3)',
      inteligencia: '3 (-4)',
      sabedoria: '10 (+0)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Cortante, Perfurante e Concussão de armas não-mágicas',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno',
      },
      {
        nome: 'Defesa espinhosa',
        desc: 'Qualquer criatura que atinja o slime com um ataque corpo a corpo a menos de 1m sofre 5 (2d4) de dano cortante devido aos estilhaços que saltam da carapaça.',
      },
      {
        nome: 'Corpo de estilhaços',
        desc: 'O slime ignora terreno difícil feito de escombros ou metal. Além disso, ele tem vantagem em testes de agarrar contra criaturas que não estejam usando armadura pesada (as farpas prendem na carne/roupa).',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Slime realiza dois ataques de Chicote de Lâminas.',
      },
      {
        nome: 'Chicote de lâminas',
        desc: 'Ataque Corpo a Corpo: +5 para acertar, alcance 3m. Dano: 10 (2d6 + 3) de dano cortante. Se o alvo estiver usando armadura não-mágica, ele recebe uma penalidade de -1 na CA até o fim do combate (acumula até -3).',
      },
      {
        nome: 'Tormenta de ferro (Recarga 5t)',
        desc: 'O slime gira seu corpo, disparando centenas de estilhaços em um raio de 4metros. Cada criatura na área deve fazer uma RES de Destreza (CD 14). Sofre 4d6 de dano cortante em uma falha, ou metade em um sucesso.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '10',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Sucata de Aço Temperado',
      },
      {
        range: '2',
        item: 'Óleo de Afiação Natural',
      },
      {
        range: '3',
        item: 'Estilhaço de Tungstênio',
      },
      {
        range: '4',
        item: 'Núcleo de Mercúrio Sólido',
      },
    ],
  },
  slimeDeCarnica: {
    name: 'Slime de carniça',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/PWJOva3.png',
    image: 'https://2img.net/i.imgur.com/9SqH0fp.jpeg',
    subtitle: 'CR 3',
    description:
      'O Slime de Carniça não é apenas um monstro, é uma tumba ambulante. Ele nasce onde a morte foi esquecida e o sagrado foi profanado. Dizem os guias de aventureiros que o primeiro sinal de sua presença não é visual, mas o cheiro: um fedor tão insuportável que pode desorientar o guerreiro mais veterano. Ele não busca apenas se alimentar, ele busca converter toda a vida em decomposição, aumentando sua massa com cada cadáver que consome. Lutar contra um Slime de Carniça é uma corrida contra a exaustão, pois cada ferida que ele inflige drena não apenas o sangue, mas a própria vontade de continuar vivo.',
    type: 'Monstro médio, gosma',
    ac: '11',
    hp: '80 (10d8 + 35)',
    speed: '6 metros, escalar 6 metros.',
    stats: {
      forca: '14 (+2)',
      destreza: '8 (-1)',
      constituicao: '17 (+3)',
      inteligencia: '3 (-4)',
      sabedoria: '12 (+1)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Necrótico e Veneno.',
      },
      {
        nome: 'Imunidade',
        desc: 'Condição Envenenado e Exaustão.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Radiante',
      },
      {
        nome: 'Fedor de cadáver',
        desc: 'Qualquer criatura que comece seu turno a até 1m do slime deve ter sucesso em uma RES de Constituição (CD 13) ou ficará Envenenada até o início de seu próximo turno. Em caso de falha por 5 ou mais, a criatura fica paralisada pelo nojo até o final do turno dela.',
      },
      {
        nome: 'Sifão de vitalidade',
        desc: 'Sempre que o slime causar dano necrótico a uma criatura envenenada, ele recupera PV iguais a metade do dano causado.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Slime realiza dois ataques de Pancada Pútrida.',
      },
      {
        nome: 'Pancada Pútrida',
        desc: 'Ataque Corpo a Corpo: +4 para acertar. Dano: 7 (1d10 + 2) de dano de impacto + 7 (2d6) de dano necrótico. O HP máximo do alvo é reduzido em um valor igual ao dano necrótico sofrido.',
      },
      {
        nome: 'Explosão gastromaníaca',
        desc: 'O slime expele uma nuvem de gases e fluídos fétidos em um cone de 6 metros. Cada criatura na área deve fazer uma RES de Constituição (CD 13). Se falhar, sofre 4d6 de dano necrótico e fica Cega até o fim do seu próximo turno.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Bile Corrupta',
      },
      {
        range: '2',
        item: 'Vértebra Fossilizada',
      },
      {
        range: '3',
        item: 'Óleo de Embalsamar Sombrio',
      },
      {
        range: '4',
        item: 'Coração Putrefato Pulsação',
      },
    ],
  },
  oozeGigante: {
    name: 'Ooze gigante',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/DpLdxkf.png',
    image: 'https://2img.net/i.imgur.com/NLF1xdP.jpeg',
    subtitle: 'CR 8',
    description: `O Ooze Gigante é o estágio final da gula elemental. Nos anais das grandes guildas, ele é classificado como uma 'Entidade de Erradicação Local'. Diferente de suas formas menores, o Ooze Gigante desenvolveu uma consciência celular coletiva que lhe permite processar e dissolver não apenas matéria orgânica, mas também o próprio mana presente no ambiente.

Relatos de sobreviventes descrevem o encontro com essa criatura como lutar contra uma inundação senciante. Sua densidade é tamanha que flechas e feitiços de baixo nível são simplesmente engolidos e neutralizados por suas enzimas gástricas antes de atingirem qualquer ponto vital. O maior perigo reside em sua capacidade de 'Engolfar Total'; uma vez dentro da criatura, a morte não vem pelo esmagamento, mas pela desintegração molecular acelerada.

Em termos estratégicos, o Ooze Gigante é considerado um cerco vivo. Ele não para diante de muralhas ou portões de ferro; ele os consome. A única esperança contra tal abominação é a destruição total e simultânea de seu núcleo de mana, pois qualquer fragmento que escape da erradicação pode, com tempo e alimento suficiente, reiniciar o ciclo de crescimento e retornar como uma nova calamidade.`,
    type: 'Monstro enorme, gosma',
    ac: '15',
    hp: '161 (14d12 + 70)',
    speed: '12m, escalar 12m',
    stats: {
      forca: '22 (+6)',
      destreza: '10 (+0)',
      constituicao: '20 (+5)',
      inteligencia: '5 (-3)',
      sabedoria: '12 (+1)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Ácido; Concussão, Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Imunidade',
        desc: 'Ácido, Condição Caído, Agarrado, Impedido.',
      },
      {
        nome: 'Natureza Colossal',
        desc: 'O Ooze pode ocupar o mesmo espaço que criaturas Médias ou menores. Ele ignora terreno difícil.',
      },
      {
        nome: 'Núvem de vapor ácido',
        desc: 'No início de cada um dos turnos do Ooze, qualquer criatura a até 3 metros dele sofre 7 (2d6) de dano ácido devido aos gases corrosivos que exalam de sua massa.',
      },
      {
        nome: 'Divisão reativa',
        desc: 'Sempre que o Ooze Gigante sofrer 30 de dano ou mais em um único turno de um ataque cortante ou elétrico, ele expele um Slime voraz em um espaço adjacente.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Ooze realiza três ataques: um de Esmagamento e dois de Tentáculos Ácidos.',
      },
      {
        nome: 'Esmagamento',
        desc: 'Ataque Corpo a Corpo: +9 para acertar, alcance 1m. Dano: 19 (3d8 + 6) de dano de concussão + 9 (2d8) de dano ácido. O alvo deve passar em uma RES de FOR (CD 17) ou ficará Caído.',
      },
      {
        nome: 'Tentáculo ácido',
        desc: 'Ataque Corpo a Corpo: +9 para acertar, alcance 6m. Dano: 13 (2d6 + 6) de dano ácido.',
      },
      {
        nome: 'Engolfar total',
        desc: ' O Ooze se move até seu deslocamento. Ele pode passar por criaturas Grandes ou menores. Cada criatura deve passar em uma RES de Destreza (CD 17).  Sucesso: A criatura é empurrada para o lado.  Falha: A criatura é engolida. Enquanto engolida, ela está Impedida, tem cobertura total contra ataques externos e sofre 21 (6d6) de dano ácido no início de cada turno do Ooze. O Ooze pode carregar até 2 criaturas Grandes ou 8 Médias simultaneamente.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: 'Bile de Dragão Falso',
      },
      {
        range: '2',
        item: 'Núcleo de Geleia Primordial',
      },
      {
        range: '3',
        item: 'Enzima Dissolvente',
      },
      {
        range: '4',
        item: 'Olho de Ooze Cristalizado',
      },
    ],
  },
  lodoDeMagma: {
    name: 'Lodo de magma',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/HujK2KV.png',
    image: 'https://2img.net/i.imgur.com/X4x3ggR.jpeg',
    subtitle: 'CR 8',
    description: `O Lodo de Magma é a encarnação da fúria da terra, uma abominação geológica que só desperta quando as veias de mana do mundo tocam o núcleo de um vulcão ativo. Nos registros das Grandes Guildas, ele é descrito como um 'Titã Fluido', capaz de ignorar as defesas físicas mais robustas simplesmente por derreter o solo e o aço à sua volta.

Diferente das evoluções anteriores, o Lodo de Magma possui uma densidade absurda; sua massa não é composta apenas de lodo, mas de minerais fundidos e energia elemental comprimida. Ele não consome presas para saciar a fome, mas sim para aumentar sua massa mineral, assimilando metais e rochas raras em sua carapaça de obsidiana.

O ar em sua presença é descrito como 'fogo líquido', onde um único suspiro pode incinerar os pulmões de um aventureiro desprotegido. Ele é o senhor absoluto dos domínios ígneos, e sua mera presença transforma ecossistemas inteiros em desertos de lava em questão de dias. Enfrentá-lo é entrar em um combate contra a própria natureza; um esforço que geralmente termina com os heróis e suas lendas sendo reduzidos a cinzas e silêncio.`,
    type: 'Monstro enorme, gosma',
    ac: '17',
    hp: ' 175 (14d12 + 84)',
    speed: '6m, natação (magma) 18m',
    stats: {
      forca: '14 (+2)',
      destreza: '8 (-1)',
      constituicao: '22 (+6)',
      inteligencia: '5 (-3)',
      sabedoria: '12 (+1)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Concussão, Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Imunidade',
        desc: 'Fogo, Veneno, Condição Caído, Agarrado, Impedido.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Frio (O choque térmico racha sua crosta, reduzindo sua CA em -4 até o fim do próximo turno).',
      },
      {
        nome: 'Aura de convecção',
        desc: 'Qualquer criatura que comece seu turno a até 4m do Lodo sofre 10 (3d6) de dano de fogo. Projéteis de madeira ou flechas comuns que entrem nessa área são incinerados instantaneamente.',
      },
      {
        nome: 'Corpo de magma viscoso',
        desc: 'Criaturas que atingirem o Lodo com ataques corpo a corpo a menos de 1m devem passar em uma RES de FOR (CD 17). Em uma falha, a arma fica presa na massa viscosa e o atacante é desarmado. É necessária uma ação e um teste de FOR para recuperar a arma.',
      },
      {
        nome: 'Sopro de enxofre',
        desc: 'O ar num raio de 9 metros ao redor do slime é considerado fumaça pesada (visão obscurecida) e criaturas que precisem respirar têm desvantagem em testes de resistência de Constituição.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Lodo realiza dois ataques de Pancada de Lava e usa seu Arremesso de Rocha Ardente.',
      },
      {
        nome: 'Pancada de lava',
        desc: 'Ataque Corpo a Corpo: +10 para acertar, alcance 3m. Dano: 16 (2d8 + 7) de impacto + 14 (4d6) de fogo. O alvo fica em chamas (sofre 1d10 de dano de fogo por turno até usar uma ação para apagar).',
      },
      {
        nome: 'Arremesso de rocha ardente',
        desc: 'Ataque à Distância: +10 para acertar, alcance a partir de 18m a até 36m. Dano: 20 (3d8 + 7) de impacto + 10 (3d6) de fogo.',
      },
      {
        nome: 'Erupção geométrica (Recarga 5t)',
        desc: 'O Lodo golpeia o chão, criando 3 pilares de magma que irrompem sob criaturas que ele possa ver em um raio de 18m. Cada alvo deve fazer uma RES de Destreza (CD 17). Sofre 35 (10d6)$ de dano de fogo em uma falha, ou metade em um sucesso. O local do pilar torna-se terreno difícil (magma) por 1 minuto.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: 'Coração Vulcanizado',
      },
      {
        range: '2',
        item: 'Placa de Obsidiana Primordial',
      },
      {
        range: '3',
        item: 'Essência de Ignis Concentrada',
      },
      {
        range: '4',
        item: 'Fragmento Tectônico',
      },
    ],
  },
  oozeDasProfundezas: {
    name: 'Ooze das profundezas',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/dW0B4Hj.png',
    image: 'https://2img.net/i.imgur.com/f4axnno.jpeg',
    subtitle: 'CR 8',
    description: `Nos registros das expedições abissais, o Ooze das Profundezas é classificado não como uma criatura, mas como uma 'Anomalia Tectônica Senciante'. Ele é a prova de que a água, sob pressão suficiente e imbuída de mana primordial, pode desenvolver uma vontade própria e predatória. Esta entidade não habita apenas o oceano; ela é o oceano em sua forma mais hostil e esmagadora.

Diferente de suas evoluções anteriores, o Ooze das Profundezas possui uma densidade molecular que desafia a compreensão. Sua massa é tão compacta que pode repelir lâminas e feitiços como se fosse aço temperado, mantendo a fluidez necessária para engolfar e triturar suas vítimas. Ele manipula a gravidade hidrostática ao seu redor, criando zonas onde o ar se torna tão pesado quanto chumbo, imitando a pressão implacável de uma fossa oceânica.

Relatos de sobreviventes (raros e geralmente traumatizados) descrevem o encontro com esta criatura como 'ser abraçado pelo vazio'. Ele não caça por fome física, mas para assimilar o mana e o conhecimento de seres complexos, adicionando suas essências ao vasto e silencioso arquivo de morte que reside em seu núcleo. Enfrentá-lo sem preparação para combate subaquático ou resistência à escuridão mágica é aceitar o afogamento não apenas físico, mas existencial, nas profundezas impiedosas de seu corpo.`,
    type: 'Monstro enorme, gosma',
    ac: '16',
    hp: '168 (16d12 + 64)',
    speed: '9m, natação 24m',
    stats: {
      forca: '22 (+6)',
      destreza: '12 (+1)',
      constituicao: '18 (+4)',
      inteligencia: '5 (-3)',
      sabedoria: '14 (+2)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Ácido, Fogo, Frio; Concussão, Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Imunidade',
        desc: 'Condição Caído, Agarrado, Impedido, Sufocado.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Raio (A água abissal é um supercondutor, o dano é dobrado e o monstro fica Atordoado por 1 rodada).',
      },
      {
        nome: 'Pressão Hidrostática',
        desc: 'O ar num raio de 6 metros ao redor do Ooze é tão denso que parece água profunda. Criaturas inimigas nesta área consideram o terreno como Terreno Difícil e têm Desvantagem em testes de Força e Atletismo.',
      },
      {
        nome: 'Corpo de água pesada',
        desc: 'O Ooze pode entrar no espaço de uma criatura e parar ali. Criaturas Médias ou menores dentro do seu espaço estão automaticamente Agarradas (CD 17 para escapar) e começam a Sufocar.',
      },
      {
        nome: 'Escuridão das fossas',
        desc: 'O corpo do Ooze emite uma aura de escuridão mágica num raio de 3 metros que apenas ele consegue ver através.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Ooze realiza três ataques de Chicote de Alta Pressão',
      },
      {
        nome: 'Chicote de alta pressão',
        desc: 'Ataque Corpo a Corpo: +9 para acertar, alcance 6m. Dano: 15 (2d8 + 6) de dano de impacto + 7 (2d6) de dano de frio. Se o alvo for Médio ou menor, é puxado 3 metros em direção ao Ooze.',
      },
      {
        nome: 'Jato de trincheira (Recarga 5t)',
        desc: ' O Ooze dispara um jato de água negra em linha reta de 18 metros. Cada criatura no caminho deve fazer uma RES de Força (CD 17).  Falha: Sofre 40 (9d8) de dano de impacto, é empurrada 6 metros e fica Caída.  Sucesso: Metade do dano e não é empurrada.',
      },
      {
        nome: 'Vórtice abissal',
        desc: 'O Ooze gira a sua massa, puxando todas as criaturas num raio de 9 metros. Cada criatura deve fazer uma RES de Força (CD 17) ou ser puxada para o centro e ficar Impedida pela pressão.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: 'Pérola de Pressão Negra',
      },
      {
        range: '2',
        item: 'Fluido de Regeneração Oceânica',
      },
      {
        range: '3',
        item: 'Membrana Hidrostática',
      },
      {
        range: '4',
        item: 'Coração do Abismo',
      },
    ],
  },
  colossoDeNeve: {
    name: 'Colosso de neve',
    rarity: 'incomum',
    icon: 'https://2img.net/i.imgur.com/vYaJGsJ.png',
    image: 'https://2img.net/i.imgur.com/mGeDSC4.jpeg',
    subtitle: 'CR 8',
    description: `O Colosso de Neve é a manifestação física da ira do inverno, uma abominação elemental classificada como uma 'Calamidade Marchante'. Ele é o estágio evolutivo final do Caminho Bestial do Gelo no Nível 10, onde a criatura deixa de ser um mero predador para se tornar uma força de terraformação senciante. Nos registros antigos, ele é descrito como o 'Arauto do Zero Absoluto'.

Diferente de suas formas anteriores, o Colosso de Neve possui uma estrutura híbrida única. Sua massa é composta por gelo permafrost, que absorveu tanto mana que sua dureza supera o aço temperado, e neve compactada, que lhe confere uma resiliência surpreendente contra impactos. Ele não apenas habita regiões geladas; ele cria o inverno eterno por onde passa, congelando o próprio ar ao redor com sua mera presença.

Relatos de batalhas descrevem o encontro com esta criatura como 'lutar contra uma avalanche com uma espada'. Ele pode remodelar seus membros instantaneamente para criar armas de cerco ou escudos impenetráveis. O maior perigo, no entanto, é seu 'Caixão de Diamante', uma habilidade capaz de congelar campeões instantaneamente em estátuas de gelo eterno. Enfrentá-lo sem magias de fogo de Rank S ou armas lendárias é aceitar uma morte rápida e silenciosa, tornando-se apenas mais um ornamento congelado em seu domínio de gelo`,
    type: 'Monstro enorme, Gosma',
    ac: '18',
    hp: '184 (16d12 + 80)',
    speed: '9 metros, escalar 9 metros.',
    stats: {
      forca: '24 (+7)',
      destreza: '8 (-1)',
      constituicao: '20 (+5)',
      inteligencia: '5 (-3)',
      sabedoria: '12 (+1)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Concussão, Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Imunidade',
        desc: 'Frio, Veneno, Condição Caído, Exaustão.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Fogo',
      },
      {
        nome: 'Aura de zero absoluto',
        desc: 'O ar em um raio de 9 metros ao redor do Colosso é uma nevasca mágica. Criaturas que terminarem seu turno na área sofrem 10 (3d6) de dano de frio e têm seu deslocamento reduzido pela metade.',
      },
      {
        nome: 'Pele de estalactite',
        desc: 'Qualquer criatura que atinja o Colosso com um ataque corpo a corpo a menos de 1m sofre 9 (2d8) de dano perfurante conforme os espinhos de gelo em sua superfície se projetam reativamente.',
      },
      {
        nome: 'Caminhante do gelo',
        desc: 'O Colosso ignora terreno difícil causado por neve ou gelo e pode escalar superfícies congeladas sem precisar de teste de atributo.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Colosso realiza três ataques: um de Impacto Glacial e dois de Lança de Estalactite.',
      },
      {
        nome: 'Impacto glacial',
        desc: 'Ataque Corpo a Corpo: +10 para acertar, alcance 3m. Dano: 20 (3d8 + 7) de concussão + 7 (2d6) de frio. O alvo deve passar em uma RES de FOR (CD 18) ou ficará Caído e Impedido por blocos de neve.',
      },
      {
        nome: 'Lança de estalactite',
        desc: 'Ataque Corpo a Corpo ou à Distância: +10 para acertar, alcance 6m/18m (ele dispara uma parte de si). Dano: 16 (2d8 + 7) de perfurante + 4 (1d8) de frio.',
      },
      {
        nome: 'Sepulcro de neve (Recarga 5t)',
        desc: 'O Colosso expele uma massa de neve e gelo em um círculo de 6 metros de raio a até 18 metros de distância. Cada criatura na área deve fazer uma RES de Destreza (CD 18).  Falha: Sofre 36 (8d8) de dano de frio e fica Paralizada (congelada) até o final do seu próximo turno.  Sucesso: Metade do dano e não fica paralisada.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: 'Gelo que Nunca Derrete',
      },
      {
        range: '2',
        item: 'Lança do Rei do Inverno',
      },
      {
        range: '3',
        item: 'Essência de Geada Pura',
      },
      {
        range: '4',
        item: 'Núcleo de Cristal Glacial',
      },
    ],
  },
  oozeDeRocha: {
    name: 'Ooze de rocha',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/1JM3iSR.png',
    image: 'https://2img.net/i.imgur.com/BNNZXWM.jpeg',
    subtitle: 'CR 8',
    description: `O Ooze de Rocha é conhecido entre os mineradores e aventureiros veteranos como o Guardião do Centro da Terra. Classificado como uma Calamidade de Classe Terrestre, esta criatura é o resultado final de séculos de compressão de mana em camadas profundas de sedimentos e minerais raros. Ele não é apenas um monstro; é uma peça do próprio planeta que decidiu se defender.

Diferente de suas formas anteriores, o Ooze de Rocha não depende apenas de sua massa física para lutar. Ele desenvolveu um controle primitivo, porém devastador, sobre a gravidade. O ar ao seu redor é tão denso que os pulmões de um humano comum podem entrar em colapso apenas por estarem por perto. Sua paciência é lendária; ele pode permanecer imóvel por décadas, sendo confundido com uma formação rochosa natural, até que o primeiro passo de um invasor desperte seu núcleo gravitacional.

Relatos de sobreviventes indicam que armas comuns são totalmente inúteis contra sua couraça de granito temperado. Golpear o Ooze de Rocha é como tentar cortar uma montanha com uma faca de cozinha. A única estratégia viável é o uso de vibrações de alta frequência ou magias de som poderosas que possam rachar sua estrutura molecular antes que o monstro use sua força tectônica para reduzir o grupo de aventureiros a pó e fragmentos ósseos.`,
    type: 'Monstro enorme, gosma',
    ac: '19',
    hp: '195 (17d12 + 85)',
    speed: '6 metros, escavação 9 metros.',
    stats: {
      forca: '24 (+7)',
      destreza: '6 (-2)',
      constituicao: '22 (+6)',
      inteligencia: '5 (-3)',
      sabedoria: '12 (+1)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Veneno; Concussão, Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Imunidade',
        desc: 'Condição Caído, Petrificado, Exaustão.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Raio',
      },
      {
        nome: 'Núcleo de massa critica',
        desc: 'O Ooze gera um campo gravitacional intenso. O terreno em um raio de 9 metros ao redor dele é considerado Terreno Difícil para inimigos. Criaturas voadoras que entrem nessa área devem passar em uma RES de Força (CD 17) ou cairão imediatamente.',
      },
      {
        nome: 'Armadura de reação',
        desc: 'Sempre que o Ooze receber dano de concussão ou cortante, ele libera estilhaços de pedra. Criaturas a 1 metro dele sofrem 7 (2d6) de dano perfurante.',
      },
      {
        nome: 'Estabilidade tectonica',
        desc: 'O Ooze não pode ser movido contra sua vontade por nenhuma habilidade de nível ou CR inferior ao dele.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Ooze realiza dois ataques de Esmagamento de Granito e usa sua Onda de Choque.',
      },
      {
        nome: 'Esmagamento de granito',
        desc: 'Ataque Corpo a Corpo: +10 para acertar, alcance 3m. Dano: 20 (3d8 + 7) de dano de concussão. Se o alvo for uma criatura, ele deve passar em uma RES de Força (CD 17) ou ficará Agarrado e Impedido (soterrado pela massa do ooze).',
      },
      {
        nome: 'Arremesso de monólito',
        desc: 'Ataque à Distância: +10 para acertar, alcance 18/36m. Dano: 25 (4d8 + 7) de dano de concussão. O alvo deve passar em uma RES de Destreza (CD 17) ou ficará Caído.',
      },
      {
        nome: 'Onda de choque (Recarga 5t)',
        desc: 'O Ooze golpeia o solo com sua massa total. Todas as criaturas em um raio de 12 metros devem fazer uma RES de Destreza (CD 17). Falha: Sofre 36 (8d8) de dano de concussão e fica Atordoado até o fim do próximo turno do Ooze. Sucesso: Metade do dano e não fica atordoado.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: 'Coração de Magnetita',
      },
      {
        range: '2',
        item: 'Fragmento de Diamante Bruto',
      },
      {
        range: '3',
        item: 'Essência de Gravidade Estagnada',
      },
      {
        range: '4',
        item: 'Placa de Rocha Senciante',
      },
    ],
  },
  enguiaDePlasma: {
    name: 'Enguia de plasma',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/O1B5A4t.png',
    image: 'https://2img.net/i.imgur.com/bhZ3ecz.jpeg',
    subtitle: 'CR 8',
    description: `A Enguia de Plasma é classificada nos registros reais como uma Anomalia de Alta Tensão. Ela representa o ponto onde a biologia das gosmas deixa de seguir as leis da matéria sólida ou líquida para habitar o estado de plasma. Habitante de picos atingidos por tempestades perpétuas ou fendas de mana instáveis, esta criatura é a personificação da velocidade divina e do calor estelar.

Diferente de suas formas inferiores que dependiam de contato físico para eletrocutar, a Enguia de Plasma ioniza o próprio ar ao seu redor, transformando o ambiente em um condutor mortal. Sua mera presença altera a pressão atmosférica e faz com que o cabelo dos seres próximos se erice antes de serem atingidos por um ataque que se move à velocidade da luz. Ela não possui predadores naturais, pois qualquer criatura que tente mordê-la é instantaneamente vaporizada pelo calor de milhares de graus Celsius que emana de seu corpo de quarta matéria.

Relatos de heróis lendários afirmam que lutar contra uma Enguia de Plasma não é um teste de força, mas um teste de reflexos e resistência mágica. Ela não ataca com estratégia convencional; ela flui pelo campo de batalha como um pensamento, atingindo múltiplos alvos simultaneamente através de arcos de corrente contínua. Para os estudiosos do sistema, ela é o lembrete de que a energia, quando atinge um nível crítico de concentração, desenvolve uma vontade própria e faminta.`,
    type: 'Monstro enorme, gosma',
    ac: '18',
    hp: '152 (16d12 + 48)',
    speed: '15 metros, voo 18 metros (flutuar).',
    stats: {
      forca: '16 (+3)',
      destreza: '24 (+7)',
      constituicao: '16 (+3)',
      inteligencia: '6 (-2)',
      sabedoria: '14 (+2)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Fogo; Concussão, Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Imunidades',
        desc: 'Elétrico, Veneno, Condição Caído, Agarrado, Impedido.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Frio (O frio estabiliza o plasma, tornando-o sólido e reduzindo sua DES para 10 por 1 rodada).',
      },
      {
        nome: 'Rastro de íons',
        desc: 'Onde a Enguia se move, ela deixa um rastro de ar ionizado que dura até o início do seu próximo turno. Qualquer criatura que atravesse esse rastro sofre 7 (2d6) de dano elétrico.',
      },
      {
        nome: 'Corpo de quarta matéria',
        desc: 'A Enguia é feita de gás superaquecido e eletricidade. Ataques corpo a corpo que a atinjam fazem com que o atacante sofra 5 (1d10) de dano elétrico e 5 (1d10) de dano de fogo devido ao calor extremo do plasma.',
      },
      {
        nome: 'Hiper aceleração',
        desc: 'A Enguia pode usar a ação de Disparada como uma Ação Bónus. Além disso, ela não provoca ataques de oportunidade ao sair do alcance de um inimigo.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Enguia realiza três ataques: um de Bote de Plasma e dois de Chicote de Arco.',
      },
      {
        nome: 'Bote de plasma',
        desc: 'Ataque Corpo a Corpo: +10 para acertar, alcance 3m. Dano: 14 (2d6 + 7) de dano elétrico + 7 (2d6) de dano de fogo. O alvo deve passar em uma RES de Constituição (CD 18) ou ficará Atordoado até o fim do turno dele.',
      },
      {
        nome: 'Chicote de arco',
        desc: 'Ataque Corpo a Corpo: +10 para acertar, alcance 6m. Dano: 17 (3d6 + 7) de dano elétrico. Se houver outra criatura a até 3 metros do alvo, o raio salta para ela, causando 10 (3d6) de dano elétrico.',
      },
      {
        nome: 'Sobrecarga de ionização (Recarga 5t)',
        desc: 'A Enguia brilha intensamente e libera uma explosão de plasma em um raio de 9 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 18). Falha: Sofre 42 (12d6) de dano elétrico e fica Cega por 1 rodada. Sucesso: Metade do dano e não fica cega.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo de Fusão Instável',
      },
      {
        range: '2',
        item: 'Filamento de Condutividade Infinita',
      },
      {
        range: '3',
        item: 'Óleo de Ozono Purificado',
      },
      {
        range: '4',
        item: 'Pele de Plasma Solidificada',
      },
    ],
  },
  oozeDeMetal: {
    name: 'Ooze de metal',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/3ZZrRKZ.png',
    image: 'https://2img.net/i.imgur.com/hmt6pPC.jpeg',
    subtitle: 'CR 8',
    description: `O Ooze de Ferro é conhecido entre os engenheiros de cerco e aventureiros veteranos como a Sentinela do Arsenal Ancestral. Classificado nos registros reais como uma Calamidade Marchante de Rank S, esta entidade é o ápice da evolução mecânica e física no Caminho Bestial. Ele representa o ponto onde a biologia das gosmas assimila completamente a dureza e a complexidade do metal forjado, tornando-se uma fortaleza de lâminas e bigornas senciante.

Diferente de suas formas anteriores, o Ooze de Ferro não é apenas uma massa de metal; ele é uma inteligência coloidal que manipula o magnetismo e a física molecular. Ele não habita apenas cavernas ou masmorras; ele remodela o próprio ambiente, transformando rochas em sucata metálica e metais raros em parte de sua carapaça impenetrável. Sua mera presença altera os campos magnéticos locais, fazendo com que as bússolas falhem e as armaduras de metal dos oponentes se tornem pesadas e restritivas.

Relatos de batalhas lendárias descrevem o encontro com esta criatura como 'lutar contra uma fábrica de guerra viva'. Ele pode moldar seus membros instantaneamente para criar armas de cerco complexas, escudos impenetráveis ou milhares de agulhas metálicas que ele dispara como uma tempestade. O maior perigo, no entanto, é seu 'Magnetismo Inverso', uma habilidade capaz de arrancar as armas e armaduras dos campeões instantaneamente. Enfrentá-lo sem magias de calor intenso de Rank S, armas de adamante ou habilidades que ignorem a densidade física é aceitar uma morte rápida e esmagadora, tornando-se apenas mais uma matéria-prima para ser mastigada e integrada à sua massa metálica.`,
    type: 'Monstro enorme, gosma',
    ac: '20',
    hp: '170 (15d12 + 75)',
    speed: '9 metros, escalar 9 metros.',
    stats: {
      forca: '22 (+6)',
      destreza: '14 (+2)',
      constituicao: '20 (+5)',
      inteligencia: '6 (-2)',
      sabedoria: '12 (+1)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Psíquico; Concussão, Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Imunidades',
        desc: 'Veneno, Condição Caído, Agarrado, Impedido, Exaustão.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Fogo (O calor amolece sua estrutura, reduzindo sua CA em 2 por 1 rodada).',
      },
      {
        nome: 'Magnetismo inverso',
        desc: 'Projéteis de metal disparados contra o Ooze têm Desvantagem no ataque. Criaturas usando armaduras de metal que comecem o turno a até 3 metros do Ooze têm seu deslocamento reduzido pela metade devido à atração magnética.',
      },
      {
        nome: 'Corpo de lâminas reativas',
        desc: 'Qualquer criatura que atinja o Ooze com um ataque corpo a corpo a menos de 1 metro sofre 9 (2d8) de dano cortante, conforme espinhos de metal saltam da superfície do monstro.',
      },
      {
        nome: 'Devorador de aço',
        desc: 'Sempre que uma arma não-mágica de metal atingir o Ooze, ela recebe uma penalidade de -1 permanente no dano. Se a penalidade chegar a -5, a arma quebra. Se o Ooze destruir uma arma desta forma, ele recupera 10 PV.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Ooze realiza três ataques: dois de Lâmina de Mercúrio e um de Pancada de Bigorna.',
      },
      {
        nome: 'Lâmina de mercurio',
        desc: 'Ataque Corpo a Corpo: +9 para acertar, alcance 4m. Dano: 15 (2d8 + 6) de dano cortante. Se o alvo for uma criatura, ela deve passar em uma RES de Destreza (CD 17) ou sofrerá um sangramento que causa 5 (1d10) de dano no início de cada um dos seus turnos por 1 minuto.',
      },
      {
        nome: 'Pancada de bigorna',
        desc: 'Ataque Corpo a Corpo: +9 para acertar, alcance 1m. Dano: 19 (3d8 + 6) de dano de concussão. O alvo deve passar em uma RES de Força (CD 17) ou ficará Caído e Atordoado até o fim do próximo turno do Ooze.',
      },
      {
        nome: 'Tormenta de estilhaços (Recarga 5t)',
        desc: 'O Ooze gira sua massa e dispara milhares de agulhas metálicas em um raio de 9 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 17). Falha: Sofre 35 (10d6) de dano perfurante e fica Envenenada (contaminação por metal pesado). Sucesso: Metade do dano e não fica envenenada.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '36m sentido sismico',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo de Ferro Líquido',
      },
      {
        range: '2',
        item: 'Placa de Aço Orgânico',
      },
      {
        range: '3',
        item: 'Poeira de Magnetite Pura',
      },
      {
        range: '4',
        item: 'Fragmento de Lâmina Senciante',
      },
    ],
  },
  oozeDaPeste: {
    name: 'Ooze da peste',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/RNoWwam.png',
    image: 'https://2img.net/i.imgur.com/TWbOrJD.jpeg',
    subtitle: 'CR 8',
    description: `O Ooze da Peste é conhecido entre os clérigos e estudiosos da necromancia como a Calamidade da Entropia. Classificado nos registros reais como uma Anomalia de Erradicação Local de Rank S, esta entidade é o estágio final da decomposição no Caminho Bestial no Nível 10. Ele representa o ponto onde a biologia das gosmas assimila completamente o mana necrótico, tornando-se uma força de terraformação senciante voltada para a morte.

Diferente de suas formas anteriores, o Ooze da Peste não depende apenas de sua massa física para lutar. Ele desenvolveu um controle primitivo, porém devastador, sobre patógenos mágicos e gases necrosantes. O ar ao seu redor é tão denso que os pulmões de um humano comum podem entrar em colapso apenas por estarem por perto. Sua paciência é lendária; ele pode permanecer imóvel por décadas, sendo confundido com um pântano natural, até que o primeiro passo de um invasor desperte seu núcleo de peste.

Relatos de batalhas lendárias descrevem o encontro com esta criatura como 'lutar contra uma pandemia senciante'. Ele não ataca com estratégia convencional; ele flui pelo campo de batalha como um gás tóxico, atingindo múltiplos alvos simultaneamente através de seu miasma. O maior perigo, no entanto, é sua 'Pandemia Final', uma habilidade capaz de liquefazer e explodir em uma névoa negra que cobre um raio de 30 metros, espalhando morte instantânea. Enfrentá-lo sem magias de cura mágica de Rank S, armas radiantes ou habilidades que ignorem a densidade física é aceitar uma morte rápida e silenciosa, tornando-se apenas mais uma matéria-prima para ser mastigada e integrada à sua massa necrótica.`,
    type: 'Monstro enorme, gosma',
    ac: '14',
    hp: '+190 (20d12 + 60)',
    speed: '9m, escalar 9m',
    stats: {
      forca: '20 (+5)',
      destreza: '8 (-1)',
      constituicao: '22 (+6)',
      inteligencia: '6 (-2)',
      sabedoria: '14 (+2)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Concussão, Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Imunidade',
        desc: 'Necrótico, Veneno, Condição Envenenado, Exaustão, Caído.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Luz, Sagrado',
      },
      {
        nome: 'Miasma de Decomposição',
        desc: 'O Ooze exala uma nuvem de esporos negros em um raio de 9 metros. Qualquer criatura que comece seu turno na área deve passar em uma RES de Constituição (CD 17). Em uma falha, sofre 10 (3d6) de dano necrótico e fica Envenenada. Enquanto estiver envenenada desta forma, a criatura não pode recuperar Pontos de Vida.',
      },
      {
        nome: 'Corpo Parasitário',
        desc: 'Sempre que o Ooze for atingido por um ataque corpo a corpo, o atacante deve passar em uma RES de Destreza (CD 17) ou uma parte da gosma infectada saltará em sua pele, causando 7 (2d6) de dano necrótico no início de cada um de seus turnos. O efeito pode ser removido com uma ação e um teste de Medicina ou cura mágica.',
      },
      {
        nome: 'Banquete de Almas',
        desc: 'Sempre que uma criatura a até 18 metros do Ooze morrer, ele recupera 20 PV e ganha Vantagem em seu próximo ataque.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Ooze realiza três ataques: dois de Tentáculo de Carne e um de Esmagamento Pútrido.',
      },
      {
        nome: 'Tentáculo de Carne',
        desc: 'Ataque Corpo a Corpo: +8 para acertar, alcance 6m. Dano: 12 (2d6 + 5) de impacto + 10 (3d6) de necrótico. O alvo deve passar em uma RES de Constituição (CD 17) ou terá sua Força reduzida em 1d4. A criatura morre se sua Força chegar a 0.',
      },
      {
        nome: 'Esmagamento Pútrido',
        desc: 'Ataque Corpo a Corpo: +8 para acertar, alcance 1,5m. Dano: 18 (3d8 + 5) de impacto + 14 (4d6) de necrótico. O alvo fica Agarrado (CD 17 para escapar). No início de cada turno que estiver agarrado, o alvo sofre 20 de dano necrótico.',
      },
      {
        nome: 'Vomitar Peste (Recarga 5t)',
        desc: 'O Ooze expele uma torrente de fluidos infecciosos em um cone de 12 metros. Cada criatura na área deve fazer uma RES de Constituição (CD 17). Falha: Sofre 45 (10d8) de dano necrótico e contrai a Peste do Ooze (Reduz o máximo de PV em 10 a cada hora até ser curado). Sucesso: Metade do dano e não contrai a peste.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: ' Glândula de Toxina Absoluta',
      },
      {
        range: '2',
        item: 'Fragmento de Osso Infectado',
      },
      {
        range: '3',
        item: 'Essência de Peste Destilada',
      },
      {
        range: '4',
        item: 'Manto de Carne de Ooze',
      },
    ],
  },
  abominacaoViscosa: {
    name: 'Abominação Viscosa',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/DnWdbL5.png',
    image: 'https://2img.net/i.imgur.com/Icloj41.jpeg',
    subtitle: 'CR 14',
    description: `Nos anais das Grandes Calamidades, poucos nomes evocam tanto terror quanto a Abominação Viscosa. Classificada como uma Entidade de Erradicação Global de Rank SS, ela representa o ápice bizarro e aterrorizante da evolução das gosmas. Seus registros datam de eras onde biomas inteiros simplesmente desapareceram do mapa, restando apenas planícies de rocha derretida e silêncio.

A Abominação não é apenas um monstro; ela é um ecossistema digestivo senciante de escala Gargantua. Relatos de heróis lendários que sobreviveram ao encontro descrevem sua massa como uma 'montanha translúcida de ódio e ácido'. Sua biologia desafia a lógica mágica: ela desenvolveu a capacidade de Absorver Ácido, o que significa que tentativas de combatê-la com feitiços corrosivos apenas a tornam maior, mais forte e regeneram seu núcleo vital instantaneamente.

O ar ao seu redor é uma sentença de morte, saturado por um Miasma Corrosivo que derrete carne e aço antes mesmo do combate físico começar. Sua tática mais aterrorizante é o 'Engolfar', onde ela simplesmente avança e assimila exércitos inteiros para dentro de seu corpo, onde a morte não vem pelo esmagamento, mas por uma desintegração molecular lenta e dolorosa à vista de todos, através de sua pele translúcida.

Enfrentar uma Abominação Viscosa requer poder de fogo de Rank Épico (Nível 15+) e, acima de tudo, a compreensão de que cada golpe desferido contra ela pode causar uma Divisão Celular, criando novos Slimes Ácidos menores para proteger o núcleo principal. Ela é a prova viva de que a forma de vida mais simples, quando alimentada por mana infinito e gula insaciável, pode se tornar o predador supremo de um mundo.`,
    type: 'Monstro imenso (gargantua), gosma',
    ac: '16',
    hp: '+290 (20d20 + 80)',
    speed: '12m, escalar 12m, natação 12m',
    stats: {
      forca: '26 (+8)',
      destreza: '10 (+0)',
      constituicao: '26 (+8)',
      inteligencia: '8 (-1)',
      sabedoria: '16 (+3)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Abominação Viscosa for alvo de dano de ácido, ela não sofre dano. Em vez disso, ela recupera uma quantidade de Pontos de Vida igual a metade do dano que seria causado.',
      },
      {
        nome: 'Imunidades',
        desc: 'Veneno, Psíquico. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado.',
      },
      {
        nome: 'Aura de vapor corrosivo',
        desc: 'No início de cada turno da Abominação, todas as criaturas a até 6 metros dela devem passar em uma RES de Constituição (CD 21). Se falharem, sofrem 14 (4d6) de dano de ácido e ficam envenenadas pela fumaça tóxica. Objetos não-mágicos na área sofrem dano corrosivo contínuo.',
      },
      {
        nome: 'Divisão celular reativa',
        desc: 'Sempre que a Abominação sofrer 50 de dano ou mais em um único turno, ela expele um Slime Ácido (CR 2) em um espaço adjacente. Esse slime age na iniciativa da Abominação e ataca o inimigo mais próximo.',
      },
      {
        nome: 'Amorfo e inescapável',
        desc: 'A Abominação pode passar por espaços de até 2 centímetros de largura sem se espremer. Além disso, ela tem vantagem em testes de agarrar e pode manter até 4 criaturas Médias ou 2 Grandes presas em seu corpo simultaneamente.',
      },
      {
        nome: 'Ação lendária',
        desc: 'Pode executar 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Abominação realiza três ataques: dois de Pancada Ácida e um de Engolfar.',
      },
      {
        nome: 'Pancada ácida',
        desc: 'Ataque Corpo a Corpo: +13 para acertar, alcance 6m. Dano: 21 (3d8 + 8) de impacto + 18 (4d8) de ácido. Se o alvo estiver usando uma armadura não-mágica, ela sofre uma penalidade permanente de -1 na CA.',
      },
      {
        nome: 'Engolfar',
        desc: 'A Abominação tenta envolver uma criatura a até 3 metros. O alvo deve passar em uma RES de Destreza (CD 21).  Sucesso: O alvo é empurrado 1,5m para fora do espaço da Abominação.  Falha: O alvo entra no corpo da Abominação, fica Impedido e começa a sufocar. No início de cada turno da criatura presa, ela sofre 36 (8d8) de dano de ácido.',
      },
      {
        nome: 'Dilúvio de Enzimas (Recarga 5t)',
        desc: 'A Abominação expele um jato de ácido concentrado em um cone de 18 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 21). Falha: Sofre 63 (14d8) de dano de ácido. Sucesso: Metade do dano.',
      },
      {
        nome: 'Deslocamento fluido',
        desc: 'A Abominação se move até metade de seu deslocamento sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Jato ocular',
        desc: 'A Abominação dispara um feixe de ácido em uma criatura a até 18 metros. +13 para acertar. Dano: 18 (4d8) de ácido.',
      },
      {
        nome: 'Pulso Repulsivo (custa 2 ações)',
        desc: 'A Abominação expande sua massa violentamente. Todas as criaturas a até 6 metros devem passar em uma RES de Força (CD 21) ou serão empurradas 9 metros para trás e ficarão Caídas.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: 'Enzima Universal Destilada',
      },
      {
        range: '2',
        item: 'Membrana de Proteção Ácida',
      },
      {
        range: '3',
        item: 'Núcleo da Abominação',
      },
      {
        range: '4',
        item: 'Vesícula de Gás Tóxico',
      },
    ],
  },
  hidraDeLava: {
    name: 'Hidra de lava',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/2vfq5pZ.png',
    image: 'https://2img.net/i.imgur.com/CXe2xg4.jpeg',
    subtitle: 'CR 14',
    description: `A Hidra de Lava é conhecida nos textos antigos como o Vulcão que Caminha. Classificada como uma Entidade de Erradicação Biológica de Rank SS, ela representa o estágio onde o lodo de magma deixa de ser uma simples massa rastejante para se tornar um predador alfa multicefálico. Ela não habita apenas vulcões; ela é a própria consciência do núcleo terrestre manifestada em uma forma de vida coloidal.

A anatomia da Hidra de Lava é um milagre de horror geológico. Suas cinco cabeças não são membros fixos, mas extensões fluidas de um núcleo de mana superaquecido. Isso permite que ela regenere cabeças perdidas em questão de segundos, utilizando a fusão térmica para selar feridas e criar novos apêndices. Sua habilidade de Absorção de Fogo torna qualquer tentativa de ataque piromântico um erro fatal, pois a criatura consome a energia do feitiço para aumentar sua própria massa e temperatura, atingindo estados de calor que podem derreter o aço lendário em segundos.

O perigo da Hidra de Lava não reside apenas em suas mordidas ou em seu sopro piroclástico, mas em sua influência no ecossistema. Por onde ela passa, a crosta terrestre se rompe e o ar se torna uma sopa tóxica de cinzas e enxofre. Ela é uma força da natureza que não possui predadores, pois qualquer criatura que tente tocá-la é instantaneamente consumida pelo seu Corpo de Convecção. Enfrentá-la exige não apenas força bruta, mas o uso estratégico de magias de congelamento absoluto de Rank Épico para desacelerar sua regeneração molecular, antes que ela transforme o continente inteiro em um deserto de vidro e cinzas.`,
    type: 'Monstro imenso, gosma',
    ac: '18',
    hp: '275 (19d20 + 76)',
    speed: '9m, natação (lava) 18m',
    stats: {
      forca: '26 (+8)',
      destreza: '8 (-1)',
      constituicao: '24 (+7)',
      inteligencia: '7 (-2)',
      sabedoria: '15 (+2)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Hidra de Lava for alvo de dano de fogo, ela não sofre dano. Em vez disso, ela recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se a cura exceder seu máximo, ela ganha o restante como Pontos de Vida Temporários.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Concussão, Cortante e Perfurante de armas não-mágicas. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado.',
      },
      {
        nome: 'Múltiplas Cabeças',
        desc: 'A Hidra começa com 5 cabeças. Enquanto tiver mais de uma cabeça, ela tem vantagem em testes de resistência contra ser cega, surda ou atordoada. Sempre que a Hidra sofrer 40 de dano em um único turno, uma cabeça morre. No início do turno dela, duas cabeças crescem para cada uma que morreu, a menos que ela tenha recebido dano de frio no último turno.',
      },
      {
        nome: 'Corpo de convecção',
        desc: 'Qualquer criatura que comece seu turno a até 6 metros da Hidra sofre 10 (3d6) de dano de fogo devido ao calor irradiado. Criaturas que tocarem a Hidra ou a atingirem com um ataque corpo a corpo a 1 metro sofrem 14 (4d6) de dano de fogo.',
      },
      {
        nome: 'Rastro de Magma',
        desc: 'O solo por onde a Hidra passa se torna lava por 1 minuto. Criaturas que entrarem ou terminarem o turno nessa área sofrem 10 (3d6) de dano de fogo e têm seu deslocamento reduzido pela metade.',
      },
      {
        nome: 'Ações Lendárias',
        desc: 'pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Hidra realiza um ataque de mordida para cada cabeça que possuir (máximo de 5 no multiataque).',
      },
      {
        nome: 'Mordida de Magma',
        desc: 'Ataque Corpo a Corpo: +13 para acertar, alcance 6m. Dano: 15 (2d6 + 8) de impacto + 10 (3d6) de fogo. O alvo deve passar em uma RES de Força (CD 21) ou ficará Agarrado pela mandíbula viscosa.',
      },
      {
        nome: 'Sopro de Piroclasto (Recarga 5t)',
        desc: 'Todas as cabeças expelem uma rajada combinada de lava e cinzas em um cone de 18 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 21). Falha: Sofre 56 (16d6) de dano de fogo e fica Cega por 1 rodada pelas cinzas. Sucesso: Metade do dano e não fica cega.',
      },
      {
        nome: 'Chicote de Lava',
        desc: 'Uma das cabeças golpeia em área. Criaturas em uma linha de 9 metros devem passar em uma RES de Destreza (CD 21) ou sofrem 14 (4d6) de dano de fogo e ficam caídas.',
      },
      {
        nome: 'Regeneração Térmica',
        desc: 'A Hidra consome parte do magma ao seu redor, recuperando 20 PV.',
      },
      {
        nome: 'Explosão de Vapor (custa 2 ações)',
        desc: 'Se a Hidra estiver em contato com água ou gelo, ela gera uma explosão de vapor. Criaturas a até 9 metros sofrem 21 (6d6) de dano de fogo (escaldante) e são empurradas 6 metros.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: 'Coração do Vulcão',
      },
      {
        range: '2',
        item: 'Couro de Basalto Flexível',
      },
      {
        range: '3',
        item: 'Presas de Obsidiana Eterna',
      },
      {
        range: '4',
        item: 'Sangue de Magma Estabilizado',
      },
    ],
  },
  krakenHidrologico: {
    name: 'Kraken Hidrológico',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/aDkmVEK.png',
    image: 'https://2img.net/i.imgur.com/nmH3SNG.jpeg',
    subtitle: 'CR 14',
    description: `Nos registros das Grandes Calamidades Marítimas, o Kraken Hidrológico é listado não como um monstro, mas como um evento teocrático senciante. Classificada como uma Entidade de Erradicação Naval de Rank SS, ela representa o estágio onde o Caminho Bestial da Água atinge a Singularidade Hidrostática. Ela não é uma criatura que vive no oceano; ela é a própria fúria das profundezas abissais manifestada em uma forma coloidal.

A anatomia do Kraken Hidrológico desafia as leis físicas do mundo de superfície. Composta inteiramente de água super-pressionada e mana criogênico, ela não possui órgãos ou estrutura óssea. Seus oito tentáculos são, na verdade, correntes marítimas independentes, moldadas pela sua vontade molecular para possuírem a densidade do aço e a flexibilidade da seda. Sua habilidade de Absorção de Água e Frio torna-a praticamente imortal em seu bioma nativo, pois qualquer tentativa de combatê-la com seu próprio elemento ou magias de congelamento apenas a torna mais densa, maior e regenera seu núcleo vital instantaneamente.

O maior perigo da Hidra de Lava não reside apenas em seus ataques físicos, mas na sua influência no ecossistema. A mera presença da criatura distorce o ambiente ao seu redor, criando uma Aura de Pressão Abissal que esmaga os pulmões e os cascos dos navios muito antes do combate começar. Enfrentar um Kraken Hidrológico sem magias de eletricidade de Rank Épico ou habilidades que possam desestabilizar a coesão molecular da água é aceitar uma morte por afogamento ou esmagamento, tornando-se apenas mais uma gota em sua massa líquida infinita.`,
    type: 'Monstro imenso, gosma',
    ac: '17',
    hp: '285 (19d20 + 86)',
    speed: '6m, natação 24m',
    stats: {
      forca: '26 (+8)',
      destreza: '14 (+2)',
      constituicao: '24 (+7)',
      inteligencia: '10 (+0)',
      sabedoria: '18 (+4)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Kraken Hidrológico for alvo de dano de frio ou ataques baseados em água, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se ele estiver submerso, recupera 20 PV no início de cada um dos seus turnos.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Ácido; Concussão, Cortante e Perfurante de armas não-mágicas. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado.',
      },
      {
        nome: 'Aura de pressão abissal',
        desc: 'O ar ao redor do Kraken (raio de 9 metros) torna-se denso como se estivesse a quilómetros de profundidade. Criaturas na área têm o seu deslocamento reduzido a metade e sofrem 7 (2d6) de dano de concussão no início de cada um dos seus turnos devido à pressão.',
      },
      {
        nome: 'Corpo de fluidez infinita',
        desc: 'O Kraken pode ocupar o espaço de outra criatura e vice-versa. Ele pode passar por aberturas de até 1 centímetro sem se espremer. Ataques à distância contra ele têm Desvantagem, pois os projéteis são desviados pela sua massa líquida em movimento.',
      },
      {
        nome: 'Tentáculos de corrente',
        desc: 'O Kraken possui 8 tentáculos líquidos independentes. Ele pode usar cada um deles para agarrar uma criatura diferente. Enquanto uma criatura estiver agarrada, ela está Sufocando (mesmo fora da água), pois o lodo aquático invade as suas vias respiratórias.',
      },
      {
        nome: 'Ações Lendárias',
        desc: 'Pode realizar 3 ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Kraken realiza três ataques de Tentáculo Esmagador. Ele pode substituir um destes ataques pelo uso do seu Jato de Pressão.',
      },
      {
        nome: 'Tentáculo esmagador',
        desc: 'Ataque Corpo a Corpo: +13 para acertar, alcance 12m. Dano: 19 (3d6 + 8) de dano de concussão + 10 (3d6) de dano de frio. O alvo deve passar numa RES de Força (CD 21) ou ficará Agarrado e Impedido.',
      },
      {
        nome: 'Jato de pressão (Recarga 5t)',
        desc: 'O Kraken dispara um canhão de água concentrada numa linha de 30 metros de comprimento por 3 metros de largura. Cada criatura na linha deve fazer uma RES de Destreza (CD 21). Falha: Sofre 54 (12d8) de dano de concussão e é empurrada 15 metros para trás. Sucesso: Metade do dano e não é empurrada.',
      },
      {
        nome: 'Vórtice aprisionador',
        desc: 'O Kraken gira a sua massa líquida, criando um redemoinho num raio de 12 metros centrado em si mesmo. Todas as criaturas na área devem fazer uma RES de Força (CD 21) ou serão puxadas para o centro, ficando Agarradas e sofrendo 21 (6d6) de dano de frio.',
      },
      {
        nome: 'Chicote de corrente',
        desc: 'O Kraken ataca com um tentáculo a uma criatura a até 12 metros.',
      },
      {
        nome: 'Mudança de estado',
        desc: 'O Kraken torna-se momentaneamente vaporoso. Ele move-se até ao seu deslocamento de natação sem provocar ataques de oportunidade e pode atravessar o espaço de inimigos.',
      },
      {
        nome: 'Explosão de Maré (custa 2 ações)',
        desc: 'O Kraken liberta uma onda de choque de água. Todas as criaturas a até 6 metros devem passar numa RES de Força (CD 21) ou cairão Caídas e sofrerão 14 (4d6) de dano de concussão.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: '60m (sentido sismo na água)',
    },
    drops: [
      {
        range: '1',
        item: 'Coração do Oceano Infinito',
      },
      {
        range: '2',
        item: 'Membrana Hidrostática',
      },
      {
        range: '3',
        item: 'Tinta de Abismo Concentrada',
      },
      {
        range: '4',
        item: 'Núcleo de Pressão',
      },
    ],
  },
  devoradorDeNeve: {
    name: 'Devorador de Neve',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/QZ9vIIE.png',
    image: 'https://2img.net/i.imgur.com/fAGGmvk.jpeg',
    subtitle: 'CR 14',
    description: `Nos tomos das Grandes Calamidades Climatológicas, o Devorador de Neve é descrito não como uma criatura, mas como uma entropia ambulante. Classificada como uma Entidade de Erradicação Geográfica de Rank SS, ela representa o estágio onde o Caminho Bestial do Gelo deixa de ser uma simples massa de gelo para se tornar a própria vontade do inverno eterno manifestada. Ela não apenas habita regiões geladas; ela consome ativamente o calor do mundo, transformando ecossistemas vibrantes em desertos brancos e sem vida em questão de dias.

A anatomia do Devorador de Neve é um milagre de horror criogênico. Composta inteiramente de neve compactada e gelo glacial senciante, ela possui uma densidade que rivaliza com o aço mítico. Sua habilidade de Absorção de Frio torna-a praticamente invulnerável em seu bioma nativo, pois qualquer tentativa de combatê-la com seu próprio elemento apenas a torna maior, mais forte e regenera seu núcleo vital instantaneamente. Ela não consome matéria orgânica; ela consome entropia, drenando a energia térmica de tudo ao seu redor, incluindo a força vital de seres vivos.

O maior perigo do Devorador de Neve não reside apenas em seus ataques físicos devastadores, mas na sua influência no ambiente. A mera presença da criatura distorce as leis da física, criando um Campo de Zero Absoluto onde o movimento torna-se lento e o próprio ar torna-se uma lâmina mortal de gelo. Enfrentar um Devorador de Neve sem magias de fogo de Rank Épico ou habilidades que possam desestabilizar a coesão molecular do gelo é aceitar uma morte por congelamento instantâneo, tornando-se apenas mais uma estátua de gelo em seu domínio eterno.`,
    type: 'Monstro enorme, gosma',
    ac: '19',
    hp: '280 (18d20 + 90)',
    speed: '12m, escalar 12m',
    stats: {
      forca: '24 (+7)',
      destreza: '10 (+0)',
      constituicao: '20 (+5)',
      inteligencia: '8 (-1)',
      sabedoria: '16 (+3)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Devorador de Neve for alvo de dano de frio, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Além disso, se ele estiver em um ambiente com neve ou gelo, recupera 15 PV no início de cada um de seus turnos.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno; Concussão, Cortante e Perfurante de armas não-mágicas. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Fogo.',
      },
      {
        nome: 'Campo de zero absoluto',
        desc: 'Uma aura de frio extremo emana da criatura em um raio de 12 metros. Criaturas que entrem ou comecem o turno na área sofrem 14 (4d6) de dano de frio e têm sua velocidade reduzida em 3 metros (acumulativo até o alvo parar). Se a velocidade de uma criatura chegar a 0 devido a este efeito, ela fica Petrificada (congelada em gelo sólido).',
      },
      {
        nome: 'Massa de neve compacta',
        desc: 'Ataques de projéteis (flechas, virotes) que atingem o Devorador ficam presos em sua massa. Ele pode usar uma ação bônus para disparar todos os projéteis presos de volta em um cone de 9 metros, causando 2d10 de dano perfurante.',
      },
      {
        nome: 'Caminhada de nevasca',
        desc: 'O Devorador de Neve é invisível enquanto estiver dentro de uma nevasca ou área de neve pesada.',
      },
      {
        nome: 'Ação lendária',
        desc: 'Pode realizar 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Devorador realiza três ataques: dois de Esmagamento Glacial e um de Sorvedouro de Calor.',
      },
      {
        nome: 'Esmagamento glacial',
        desc: 'Ataque Corpo a Corpo: +12 para acertar, alcance 4m. Dano: 20 (3d8 + 7) de impacto + 10 (3d6) de frio. O alvo deve passar em uma RES de Força (CD 20) ou ficará Caído sob o peso da neve.',
      },
      {
        nome: 'Sorvedouro de calor',
        desc: 'Ataque Corpo a Corpo: +12 para acertar, alcance 1m. Dano: 24 (7d6) de frio. O Devorador drena a energia térmica do alvo. O alvo deve passar em uma RES de Constituição (CD 20) ou receberá um nível de Exaustão. O Devorador recupera PV igual ao dano causado.',
      },
      {
        nome: 'Avalanche viva (Recarga 5t)',
        desc: 'O Devorador se projeta para frente em uma linha de 18 metros. Todas as criaturas no caminho devem fazer uma RES de Destreza (CD 20). Falha: Sofre 45 (10d8) de dano de impacto, é empurrada para o fim da linha e fica Enterrada (Impedida e Sufocando, CD 20 de Força para sair). Sucesso: Metade do dano e é movida para o espaço seguro mais próximo.',
      },
      {
        nome: 'Flash de gelo',
        desc: 'Uma criatura a até 12 metros deve passar em uma RES de Constituição (CD 20) ou ficará Cega até o final do próximo turno devido ao brilho da neve.',
      },
      {
        nome: 'Solidificar',
        desc: 'O Devorador endurece sua pele de neve, ganhando +2 de CA até o início do seu próximo turno.',
      },
      {
        nome: 'Tempestade de granizo (custa 2 ações)',
        desc: 'Pedras de gelo caem em um raio de 9 metros. Criaturas na área sofrem 14 (4d6) de dano de impacto e 7 (2d6) de frio.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '36m (sensor de calor)',
    },
    drops: [
      {
        range: '1',
        item: 'Coração de Gelo Eterno',
      },
      {
        range: '2',
        item: 'Essência de Frio Absoluto',
      },
      {
        range: '3',
        item: 'Manto de Neve Senciente',
      },
      {
        range: '4',
        item: 'Fragmento de Presa Glacial',
      },
    ],
  },
  serpenteTectonica: {
    name: 'Serpente Tectonica',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/gZEMNXA.png',
    image: 'https://2img.net/i.imgur.com/nLS34Nc.jpeg',
    subtitle: 'CR 14',
    description: `Nos tomos sagrados que registram as Grandes Calamidades Planetárias, a Serpente Tectônica é listada não como um ser vivo, mas como uma falha geológica senciante. Classificada como uma Entidade de Erradicação Geográfica de Rank SS, ela representa o estágio final onde o Caminho Bestial da Terra deixa de ser apenas rocha e lama para se tornar a própria vontade esmagadora do núcleo do planeta. Ela não habita montanhas ou cavernas; ela é o movimento que as demole.

A anatomia da Serpente Tectônica é uma maravilha de horror geológico. Composta por segmentos independentes de diamantes negros e granito arcaico, sua densidade é tão absurda que ela gera seu próprio Campo Gravitacional Intenso. Essa aura distorce o espaço ao seu redor, impedindo que inimigos fujam enquanto o solo ao redor é puxado e compactado em sua massa. Sua habilidade de Absorção de Terra torna-a praticamente invulnerável em seu bioma nativo, pois tentativas de atacá-la com pedras ou magias terrestres apenas preenchem as rachaduras em sua armadura, regenerando seu núcleo vital instantaneamente.

O maior perigo da Serpente Tectônica reside em sua fome por estruturas compactas. Para ela, fortalezas de Rank Lendário são apenas concentrações de minerais prontos para serem mastigados e assimilados. Enfrentá-la exige poder de fogo de Rank Épico e, acima de tudo, o uso estratégico de magias de som (dano trovejante) para tentar rachar sua estrutura interna de diamante, antes que ela desencadeie um Pulso Tectônico e soterre o continente inteiro em um deserto de escombros e cinzas.`,
    type: 'Monstro imenso, gosma',
    ac: '21',
    hp: '310 (20d20 + 100)',
    speed: '12m, escavação 18m',
    stats: {
      forca: '28 (+9)',
      destreza: '6 (-2)',
      constituicao: '26 (+8)',
      inteligencia: '8 (-1)',
      sabedoria: '16 (+3)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Serpente Tectônica for alvo de dano de terra, pedra ou magias que manipulem o solo, ela não sofre dano. Em vez disso, ela recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se ela estiver em contato direto com solo rochoso, recupera 15 PV no início de cada um de seus turnos.',
      },
      {
        nome: 'Imunidades',
        desc: 'Veneno, Psíquico; Concussão, Cortante e Perfurante de armas não-mágicas. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Raio',
      },
      {
        nome: 'Campo gravitacional intenso',
        desc: 'A massa da Serpente é tão densa que ela gera seu próprio campo de gravidade. Qualquer criatura que comece seu turno a até 9 metros dela deve passar em uma RES de Força (CD 21). Em uma falha, o deslocamento da criatura é reduzido a zero e ela fica Impedida até o início de seu próximo turno.',
      },
      {
        nome: 'Segmento reativo',
        desc: 'O corpo da Serpente é composto por 12 segmentos independentes. Sempre que sofrer um acerto crítico, um dos segmentos se quebra, mas a Serpente anula o dano extra do crítico. Ela recupera um segmento sempre que utilizar sua Absorção de Terra.',
      },
      {
        nome: 'Escavadora de desastres',
        desc: 'Ao escavar, a Serpente não deixa túneis, mas causa um colapso imediato no solo acima dela. Qualquer estrutura em cima do caminho escavado pela Serpente sofre o dobro de dano de impacto.',
      },
      {
        nome: 'Ações Lendárias',
        desc: 'Pode realizar três ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Serpente realiza dois ataques: um de Bote Tectônico e um de Constrição Geológica.',
      },
      {
        nome: 'Bote Tectônico',
        desc: 'Ataque Corpo a Corpo: +14 para acertar, alcance 9m. Dano: 22 (3d8 + 9) de impacto + 13 (3d8) de dano de terra. O alvo deve passar em uma RES de Força (CD 21) ou será arremessado 6 metros para trás e ficará Caído.',
      },
      {
        nome: 'Constrição Geológica',
        desc: 'Ataque Corpo a Corpo: +14 para acertar, alcance 3m. Dano: 27 (4d8 + 9) de impacto. O alvo fica Agarrado (CD 21 para escapar). Enquanto estiver agarrado, o alvo sofre o efeito de esmagamento, recebendo 30 de dano de impacto no início de cada um de seus turnos.',
      },
      {
        nome: 'Pulso Tectônico (Recarga 5t)',
        desc: 'A Serpente golpeia o solo com sua cauda, liberando uma onda de choque em um raio de 18 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 21). Falha: Sofre 65 (10d12) de dano de impacto e fica Petrificada (presa em rocha sólida) por 1 rodada. Sucesso: Metade do dano e não fica petrificada.',
      },
      {
        nome: 'Deslocamento Subterrâneo',
        desc: 'A Serpente usa sua velocidade de escavação sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Endurecer Placas',
        desc: 'A Serpente ganha +2 de CA até o início do seu próximo turno.',
      },
      {
        nome: 'Chuva de detritos (custa 2 ações)',
        desc: 'Pedras caem do teto ou surgem do chão. Criaturas em um círculo de 6 metros a até 18 metros sofrem 18 (4d8) de dano de impacto e a área torna-se terreno difícil.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '120m (sentido sismico)',
    },
    drops: [
      {
        range: '1',
        item: 'Coração Geodésico',
      },
      {
        range: '2',
        item: 'Placa de Escama de Diamante Negro',
      },
      {
        range: '3',
        item: 'Essência de Gravidade Destilada',
      },
      {
        range: '4',
        item: 'Olho de Obsidiana Senciante',
      },
    ],
  },
  bestaDeRaios: {
    name: 'Besta de raios',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/Bgbr9Fv.png',
    image: 'https://2img.net/i.imgur.com/a9iYGNQ.jpeg',
    subtitle: 'CR 14',
    description: `A Besta de Raios é classificada nos registros reais como um Fenômeno Atmosférico Senciante de Rank SS. Ela representa o estágio final onde o Caminho Bestial Elétrico deixa de ser uma simples gosma para se tornar a própria vontade de uma tempestade destruidora manifestada em forma de plasma. Ela não apenas manipula a eletricidade; ela habita o limiar entre a matéria e a energia pura, gerando uma singularidade elétrica em seu núcleo que distorce as leis do magnetismo e da gravidade ao seu redor.

A anatomia da Besta de Raios desafia a lógica biológica do mundo de superfície. Composta inteiramente por plasma de quarta matéria e campos magnéticos instáveis, ela possui uma densidade de energia que a torna praticamente intocável. Sua habilidade de Absorção de Eletricidade torna-a imortal em qualquer ambiente eletrificado ou contra magias de seu elemento, pois qualquer energia elétrica desferida contra ela apenas alimenta seu núcleo vital, regenerando-a instantaneamente e potencializando seus ataques futuros. Ela não consome matéria orgânica; ela consome voltagem, drenando a energia estática do ambiente e a força vital de seres vivos.

O maior perigo da Besta de Raios não reside apenas em seus ataques físicos de plasma devastadores ou em suas descargas em arco que saltam entre exércitos, mas em sua influência passiva no ambiente. A mera presença da criatura distorce os campos magnéticos através de sua Atração Magnética Devastadora, tornando armaduras e armas de metal armadilhas mortais para seus portadores. Enfrentar uma Besta de Raios sem proteção isolante mágica de Rank Épico ou habilidades que possam aterrar sua energia é aceitar a aniquilação instantânea, onde o próprio sistema nervoso do oponente é usado como um condutor para a sobrecarga final da besta.`,
    type: 'Monstro imenso, gosma',
    ac: '18',
    hp: '260 (20d20 + 50)',
    speed: '18m, flutuar 18m',
    stats: {
      forca: '18 (+4)',
      destreza: '26 (+8)',
      constituicao: '20 (+5)',
      inteligencia: '10 (+0)',
      sabedoria: '16 (+3)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Besta de Raios for alvo de dano elétrico, ela não sofre dano. Em vez disso, ela recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Além disso, após ser atingida por eletricidade, seu próximo ataque causa 14 (4d6) de dano elétrico extra.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Trovão; Concussão, Cortante e Perfurante de armas não-mágicas. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado.',
      },
      {
        nome: 'Atração magnética devastadora',
        desc: 'Criaturas usando armaduras de metal ou empunhando armas de metal a até 9 metros da Besta têm seu deslocamento reduzido pela metade e sofrem Desvantagem em jogadas de ataque contra qualquer alvo que não seja a Besta de Raios, devido à força de tração magnética.',
      },
      {
        nome: 'Corpo de plasma instável',
        desc: 'Qualquer criatura que atingir a Besta com um ataque corpo a corpo a menos de 1 metro sofre 10 (3d6) de dano elétrico. Se a arma utilizada for de metal, o dano aumenta para 17 (5d6).',
      },
      {
        nome: 'Movimentação de corrente',
        desc: 'A Besta de Raios não provoca ataques de oportunidade ao se mover de uma área eletrificada para outra, ou ao se mover através do espaço de uma criatura que esteja usando metal.',
      },
      {
        nome: 'Ações Lendárias',
        desc: 'Pode realizar 3 ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Besta realiza três ataques: dois de Chicote de Plasma e um de Descarga de Arco.',
      },
      {
        nome: 'Chicote de plasma',
        desc: 'Ataque Corpo a Corpo: +13 para acertar, alcance 9m. Dano: 14 (2d6 + 7) de impacto + 14 (4d6) de dano elétrico. O alvo deve passar em uma RES de Constituição (CD 21) ou ficará Paralisado até o fim do seu próximo turno.',
      },
      {
        nome: 'Descarga de arco',
        desc: 'Ataque à Distância: +13 para acertar, alcance 18m. Dano: 28 (8d6) de dano elétrico. O raio salta para até dois alvos adicionais a 6 metros do alvo original. Cada alvo extra deve fazer uma RES de Destreza (CD 21) para sofrer apenas metade do dano.',
      },
      {
        nome: 'Sobrecarga de sistema (Recarga 5t)',
        desc: 'A Besta explode em um clarão azul intenso. Todas as criaturas em um raio de 12 metros devem fazer uma RES de Constituição (CD 21). Falha: Sofre 55 (10d10) de dano elétrico e fica Cega por 1 minuto. A criatura pode repetir o teste no final de cada turno. Sucesso: Metade do dano e não fica cega.',
      },
      {
        nome: 'Teletransporte de faísca',
        desc: 'A Besta se transforma em um raio e se teletransporta para um ponto vazio que possa ver a até 18 metros.',
      },
      {
        nome: 'Revestimento estático',
        desc: 'A Besta cria uma camada de íons. Ela ganha 20 Pontos de Vida Temporários. Enquanto tiver esses PV, qualquer um que a toque fica atordoado até o início do próximo turno da criatura.',
      },
      {
        nome: 'Pulso eletromagnético (consome 2 ações)',
        desc: 'Todos os itens mágicos de metal em um raio de 6 metros perdem suas propriedades mágicas até o início do próximo turno da Besta.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '36 (decção de impulsos nervosos e elétricos)',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo de Plasma Estabilizado',
      },
      {
        range: '2',
        item: 'Nervo de Cobre Místico',
      },
      {
        range: '3',
        item: 'Essência de Ozônio Destilada',
      },
      {
        range: '4',
        item: 'Fragmento de Carapaça de Vidro',
      },
    ],
  },
  quimeraDeLaminas: {
    name: 'Quimera de Lâminas',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/NnHp0yf.png',
    image: 'https://2img.net/i.imgur.com/D8PwRiv.jpeg',
    subtitle: 'CR 14',
    description: `A Quimera de Lâminas é classificada nos anais de guerra como uma Calamidade Mecânica de Rank SS. Ela representa o ponto em que o Caminho Bestial do Metal abandona a forma de lodo inerte para abraçar uma complexidade geométrica predatória. Ela não é um monstro biológico, mas uma simulação perfeita de um predador alfa, construída inteiramente com as armas e armaduras de todos os guerreiros que ousaram enfrentá-la.

A biologia desta criatura é um paradoxo de engenharia mística. Seu corpo alterna constantemente entre o estado sólido do aço temperado e a fluidez do mercúrio senciante, permitindo que ela mimetize qualquer arma consumida. Sua habilidade de Absorção Metálica e de Força faz dela o pesadelo de qualquer paladino ou cavaleiro, pois cada golpe desferido contra ela não apenas falha em causar dano, como também é assimilado, servindo como material para que a criatura se reconstrua e aumente sua própria letalidade.

O maior perigo da Quimera não é sua força bruta, mas sua Tormenta de Fragmentos. Ela emite um zumbido ensurdecedor de metal moendo metal, enquanto uma nuvem de micro-lâminas orbita seu corpo, retalhando tudo o que se aproxima em nível celular. Enfrentar uma Quimera de Lâminas sem magias que possam corroer o metal ou ataques que desestabilizem seu Núcleo Magnético é uma sentença de morte certa. Ela não busca território ou comida; ela busca o refinamento, caçando ativamente metais raros e itens lendários para atingir a perfeição de sua forma final.`,
    type: 'Monstro imenso, gosma',
    ac: '22',
    hp: '300 (20d20 + 90)',
    speed: '15m, escalar 12m',
    stats: {
      forca: '26 (+8)',
      destreza: '18 (+4)',
      constituicao: '24 (+7)',
      inteligencia: '12 (+1)',
      sabedoria: '14 (+2)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Quimera de Lâminas for alvo de dano de Força ou dano físico (Cortante, Perfurante, Concussão) causado por armas de metal, ela não sofre dano. Em vez disso, ela recupera uma quantidade de Pontos de Vida igual a metade do dano que seria causado. Armas não-mágicas de metal que a atinjam têm uma chance de 50% de serem absorvidas e destruídas, aumentando o dano da Quimera em +2 permanentemente (até um máximo de +10).',
      },
      {
        nome: 'Imunidades',
        desc: 'Veneno, Psíquico. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado.',
      },
      {
        nome: 'Tormenta de fragmentos',
        desc: 'Uma nuvem de micro-lâminas orbita a Quimera em um raio de 6 metros. Qualquer criatura que comece seu turno na área ou entre nela pela primeira vez no turno sofre 14 (4d6) de dano cortante. A área é considerada Terreno Difícil para inimigos.',
      },
      {
        nome: 'Mimetismo de Arsenal',
        desc: 'A Quimera pode moldar seus apêndices para mimetizar qualquer arma de metal que já tenha consumido. Ela pode alternar entre dano Cortante, Perfurante ou de Concussão a cada ataque sem custo de ação.',
      },
      {
        nome: 'Núcleo Magnético',
        desc: 'Projéteis metálicos (flechas, virotes) disparados contra a Quimera são atraídos para sua massa e absorvidos automaticamente, não causando dano e curando a criatura em 2 PV por projétil.',
      },
      {
        nome: 'Ações Lendárias',
        desc: 'Pode realizar 3 ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Quimera realiza três ataques: dois de Patas de Lâminas e um de Mordida de Guilhotina.',
      },
      {
        nome: 'Patas de Lâminas',
        desc: 'Ataque Corpo a Corpo: +13 para acertar, alcance 6m. Dano: 21 (3d8 + 8) de dano cortante. Se o alvo for uma criatura, ele deve passar em uma RES de Destreza (CD 21) ou sofrerá uma ferida sangrenta, recebendo 10 (3d6) de dano cortante no início de cada um de seus turnos.',
      },
      {
        nome: 'Mordida de guilhotina',
        desc: 'Ataque Corpo a Corpo: +13 para acertar, alcance 3m. Dano: 27 (3d12 + 8) de dano perfurante. Se o alvo for reduzido a 0 PV por este ataque, ele é decapitado ou partido ao meio instantaneamente.',
      },
      {
        nome: 'Ciclone de aço (Recarga 5t)',
        desc: 'A Quimera gira violentamente, disparando centenas de lâminas em um raio de 12 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 21). Falha: Sofre 55 (10d10) de dano cortante. Sucesso: Metade do dano.',
      },
      {
        nome: 'Reconfigurar',
        desc: 'A Quimera altera sua forma para se adaptar ao último ataque recebido, ganhando resistência a um tipo de dano elemental até o início do seu próximo turno.',
      },
      {
        nome: 'Chicote de correntes',
        desc: 'A Quimera estende um tentáculo de metal a até 12 metros. O alvo deve passar em uma RES de Força (CD 21) ou será puxado para dentro da Tormenta de Fragmentos.',
      },
      {
        nome: 'Explosão de estilhaços (custa 2 ações)',
        desc: 'A Quimera ejeta parte de sua massa. Criaturas a até 6 metros sofrem 18 (4d8) de dano perfurante e devem passar em uma RES de Constituição (CD 21) ou ficarão Cegas pelo brilho do metal polido até o fim do próximo turno.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: 'Mercúrio Senciente',
      },
      {
        range: '2',
        item: 'Nervo de Aço Místico',
      },
      {
        range: '3',
        item: 'Coração da Forja Eterna',
      },
      {
        range: '4',
        item: 'Fragmento de Lâmina Dimensional',
      },
    ],
  },
  colossoDeOssos: {
    name: 'Colosso de ossos',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/NW2oCRU.png',
    image: 'https://2img.net/i.imgur.com/cVJoOWA.jpeg',
    subtitle: 'CR 14',
    description: `Nos tomos de necromancia proibida e registros de desastres reais, o Colosso de Ossos é listado como uma Calamidade de Rank SS de Erradicação Biológica. Ele representa o ápice bizarro da evolução das gosmas necróticas. Ele deixa de ser um lodo rastejante para se tornar uma arquitetura ambulante de morte, uma fusão senciante de lodo viral e ossada calcificada que atua como um buraco negro de energia vital.

A anatomia do Colosso é um paradoxo de engenharia macabra. Sua "pele" externa é uma armadura impenetrável composta por milhares de ossos fundidos de suas vítimas, possuindo a densidade do aço místico. Internamente, ele é preenchido pelo ooze necrótico original, que atua como medula e sistema nervoso, mantendo a coesão da estrutura através de pura magia negra. Sua habilidade de Absorção Necrótica faz dele o predador final em campos de batalha, pois qualquer magia de morte desferida contra ele, ou qualquer criatura que morra em sua presença, apenas serve para regenerar sua massa e aumentar seu poder.

O maior perigo do Colosso não reside apenas em sua força titânica capaz de esmagar muralhas, mas em sua influência passiva. Ele emana um Miasma de Putrefação que derrete a carne e impede a cura, enquanto sua Aura de Desesperança quebra o espírito dos guerreiros mais corajosos antes mesmo do combate começar. Enfrentar um Colosso de Ossos sem magias radiantes de Rank Épico (sua única vulnerabilidade) é aceitar a aniquilação instantânea, onde sua alma será absorvida para alimentar a medula eterna da criatura, e seus ossos se tornarão apenas mais uma placa em sua armadura infinita.`,
    type: 'Monstro imenso, gosma',
    ac: '20',
    hp: '320 (20d20 + 110)',
    speed: '9m',
    stats: {
      forca: '26 (+8)',
      destreza: '6 (-2)',
      constituicao: '26 (+8)',
      inteligencia: '12 (+1)',
      sabedoria: '16 (+3)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Absorção necrótica',
        desc: 'Sempre que o Colosso de Ossos for alvo de dano necrótico, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Além disso, qualquer criatura morta em um raio de 18 metros cura o Colosso em 20 PV no início do turno dele.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Psíquico; Concussão, Cortante e Perfurante de armas não-mágicas. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado, Amedrontado.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Luz, Sagrado',
      },
      {
        nome: 'Miasma de putrefação',
        desc: 'O ar ao redor do Colosso em um raio de 9 metros é infestado de esporos necróticos. Criaturas vivas que comecem seu turno na área sofrem 14 (4d6) de dano necrótico e não podem recuperar pontos de vida até o início de seu próximo turno.',
      },
      {
        nome: 'Arquitetura de cadáveres',
        desc: 'O corpo do Colosso é um amontoado de restos mortais. Sempre que ele sofrer mais de 40 de dano em um único turno, uma parte de sua massa se desprende, criando um Ooze de Peste (HP 30) em um espaço adjacente.',
      },
      {
        nome: 'Aura de desesperança',
        desc: 'Criaturas a até 18 metros do Colosso devem passar em uma RES de Sabedoria (CD 21) ou ficarão Amedrontadas por 1 minuto. Enquanto amedrontadas dessa forma, o dano necrótico que recebem é dobrado.',
      },
      {
        nome: 'Ações Lendárias',
        desc: 'Pode realizar 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Colosso realiza dois ataques de Esmagamento de Marfim e usa seu Grito da Agonia (se disponível).',
      },
      {
        nome: 'Esmagamento de marfim',
        desc: 'Ataque Corpo a Corpo: +13 para acertar, alcance 6m. Dano: 22 (3d8 + 8) de impacto + 13 (3d8) de dano necrótico. O alvo deve passar em uma RES de Força (CD 21) ou será enterrado sob uma pilha de ossos (Impedido, CD 21 para sair).',
      },
      {
        nome: 'Chuva de estilhaços (Recarga 5t)',
        desc: 'O Colosso explode parte de sua armadura óssea em um cone de 18 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 21).Falha: Sofre 54 (12d8) de dano perfurante e contrai a Peste Óssea (Dano necrótico contínuo de 10 por turno até ser curado magicamente).Sucesso: Metade do dano e não contrai a peste.',
      },
      {
        nome: 'Grito de agonia (recarga 6t)',
        desc: 'As milhares de almas presas na medula do Colosso gritam em uníssono. Todas as criaturas em um raio de 18 metros devem passar em uma RES de Sabedoria (CD 21) ou sofrerão 35 (10d6) de dano psíquico e ficarão Atordoadas por 1 rodada.',
      },
      {
        nome: 'Reanimar ossos',
        desc: 'O Colosso faz com que estacas de ossos surjam do chão. Uma criatura a até 18 metros deve passar em uma RES de Destreza (CD 21) ou sofrerá 14 (4d6) de dano perfurante e ficará Agarrada.',
      },
      {
        nome: 'Sugar vitalidade',
        desc: 'O Colosso drena a vida de uma criatura Agarrada ou Impedida por ele. O alvo sofre 21 (6d6) de dano necrótico e o Colosso recupera a mesma quantidade de PV.',
      },
      {
        nome: 'Parede de falanges (Custa 2 ações)',
        desc: 'O Colosso ergue uma barreira de ossos de 3 metros de altura e 6 metros de largura que bloqueia linha de visão e movimento. A parede tem 50 PV.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo de Medula Negra',
      },
      {
        range: '2',
        item: 'Costela de Titã de Sangue',
      },
      {
        range: '3',
        item: 'Essência de Peste Destilada',
      },
      {
        range: '4',
        item: 'Crânio do Rei Esquecido',
      },
    ],
  },
  glutao: {
    name: 'Glutão',
    rarity: 'Super raro',
    icon: 'https://2img.net/i.imgur.com/wmTt8hS.png',
    image: 'https://2img.net/i.imgur.com/mog32MC.jpeg',
    subtitle: 'CR 20',
    description: `Nos registros divinos e anais de calamidades mundiais, o Glutão é listado não como um monstro, mas como um evento de extinção existencial de Nível 20+. Classificado como uma Calamidade de Rank X (Deidade Menor), ele representa o ponto onde a biologia dos slimes cessa e se torna um paradoxo físico senciante. Ele não é mais uma criatura que consome para sobreviver; ele é o consumo tornado carne, um estômago dimensional que existe apenas para converter o universo em sua própria massa visceral.

A anatomia do Glutão desafia todas as leis da física e da magia. Composta inteiramente por slime super-pressionado e energia dimensional, ele é praticamente imune a danos físicos e de força. Internamente, ele abriga um Estômago Dimensional, uma dimensão de bolso de ácido puro que atua como um buraco negro existencial. Sua característica mais aterrorizante é o Mimetismo de Habilidade (Blue Magic), permitindo que ele aprenda instantaneamente e replique qualquer habilidade, feitiço ou ação das criaturas que ele engole, usando o poder de seus inimigos contra eles mesmos.

O maior perigo do Glutão não reside apenas em seu tamanho colossal ou em seu ácido que dissolve metais lendários, mas em sua natureza predatória irracional. Ele gera uma Atração Magnética Devastadora que suga matéria e energia em sua direção, degradando o equipamento dos guerreiros antes mesmo de atacá-los. Enfrentar um Glutão sem magias de Rank Divino (como Desejo ou Milagre) ou habilidades que ignorem a densidade física é aceitar a aniquilação total, onde sua existência, alma e memórias serão mastigadas, digeridas e apagadas de todas as realidades.`,
    type: 'Monstro colossal',
    ac: '20',
    hp: '520 (20d20 + 310)',
    speed: '15m, escalar 15m, natação 15m',
    stats: {
      forca: '30 (+10)',
      destreza: '10 (+0)',
      constituicao: '30 (+10)',
      inteligencia: '14 (+2)',
      sabedoria: '20 (+5)',
      carisma: '1 (-5)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Glutão for alvo de dano de ácido ou veneno, ele não sofre dano. Em vez disso, ele recupera uma quantidade de PV igual ao dano que seria causado. Se a cura exceder seu máximo, ele ganha PV temporários.',
      },
      {
        nome: 'Imunidade',
        desc: 'Concussão, Cortante e Perfurante (Mesmo de armas mágicas); Psíquico, Força. imunidade a todas as manobras de combate',
      },
      {
        nome: 'Estômago dimensional',
        desc: 'O interior do Glutão é uma dimensão de bolso de ácido puro. Ele pode carregar até 10 criaturas imensas dentro de si. No início de cada turno do Glutão, criaturas engolidas sofrem 35 (10d6) de dano de ácido. Se uma criatura morrer lá dentro, ela é completamente apagada da existência.',
      },
      {
        nome: 'Mimetismo de habilidade',
        desc: 'Sempre que o Glutão "Engolir" uma criatura, ele ganha temporariamente uma habilidade de classe ou ação daquela criatura (Ex: se engolir um Mago, pode usar Bola de Fogo). Ele pode manter até 3 habilidades mimetizadas simultaneamente.',
      },
      {
        nome: 'Degradação de equipamento',
        desc: 'Qualquer arma que atinja o Glutão sofre uma penalidade permanente e cumulativa de -1 nas jogadas de ataque e dano. Se o bônus chegar a -5, a arma é dissolvida. Armaduras de quem for agarrado sofrem o mesmo efeito na CA.',
      },
      {
        nome: 'Ações Lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Glutão realiza quatro ataques de Pseudópode e usa seu "Vácuo de Matéria".',
      },
      {
        nome: 'Pseudópode devorador',
        desc: 'Ataque Corpo a Corpo: +16 para acertar, alcance 12m. Dano: 24 (4d6 + 10) de impacto + 21 (6d6) de ácido. O alvo deve passar em uma RES de Força (CD 24) ou ficará Agarrado.',
      },
      {
        nome: 'Vácuo de matéria (Recarga 5t)',
        desc: 'O Glutão abre uma fenda em sua massa que suga tudo em um cone de 20 metros. Criaturas na área devem passar em uma RES de Força (CD 24). Falha: São puxadas para o centro do Glutão e Engolidas instantaneamente. Sucesso: São apenas puxadas 10 metros e ficam Impedidas pelo lodo.',
      },
      {
        nome: 'Dilúvio do lodo corrosivo',
        desc: 'O Glutão expele uma onda de ácido em um raio de 30 metros. Todas as criaturas devem fazer uma RES de Destreza (CD 24).Falha: 70 (20d6) de dano de ácido e sofrem o debuff (CA reduzida em 5 por 1 minuto).Sucesso: Metade do dano e sem o debuff.',
      },
      {
        nome: 'Pulsação metabolica',
        desc: 'O Glutão se cura em 50 PV e remove qualquer debuff de estado negativo (como Lentidão ou Silencio).',
      },
      {
        nome: 'Digestão acelerada (custa 2 ações)',
        desc: 'Todas as criaturas engolidas sofrem o dano de ácido do estômago imediatamente. O Glutão ganha um bônus de +2 em todos os atributos até o fim da rodada para cada criatura que sofrer esse dano.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '15',
      visaoEscuro: '180m',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo da Singularidade Viscosa',
      },
      {
        range: '2',
        item: 'Estômago de Bolso Infinito',
      },
      {
        range: '3',
        item: 'Concentrado de Ácido Real',
      },
      {
        range: '4',
        item: 'Fragmento de Memória Genética',
      },
    ],
  },
  ifritmagma: {
    name: 'Ifrit-magma',
    rarity: 'Super raro',
    icon: 'https://2img.net/i.imgur.com/GYZdDhb.png',
    image: 'https://2img.net/i.imgur.com/OAYj052.jpeg',
    subtitle: 'CR 20',
    description: `Nos registros sagrados das Calamidades Mundiais e tomos proibidos de necromancia biológica, Ifrit-Magma é classificado como uma Calamidade de Rank X (Entidade de Extinção Continental) de Nível 20+. Ele representa o ponto de singularidade onde a linhagem dos slimes de fogo deixa de ser uma criatura biológica para se tornar a própria vontade de uma estrela em colapso, manifestada em uma forma viscosa de rocha fundida. Ele não apenas habita vulcões; ele é a consciência do núcleo planetário.

A anatomia do Ifrit-Magma é um paradoxo físico mantido por mana de Rank Divino. Seu corpo é um amálgama hiper-pressionado de magma superaquecido, revestido por uma couraça de obsidiana ancestral que se quebra e regenera constantemente para conter a pressão interna. Sua habilidade de Absorção de Fogo torna qualquer ataque piromântico contra ele um erro fatal, pois ele consome a energia do feitiço para aumentar sua própria massa e temperatura, regenerando feridas em segundos. Ele não consome matéria orgânica; ele consome entropia, drenando o calor do ambiente e a força vital de seres vivos através do seu Campo de Calor Absoluto.

O perigo do Ifrit-Magma não reside apenas em seus tentáculos de lava ou em seu sopro piroclástico, mas em sua natureza predatória geopolítica. Por onde ele passa, o solo se torna lava permanente, remodelando o mapa e tornando continentes inteiros inabitáveis em dias. Sua habilidade máxima, a Giga-Labareda, libera o clarão branco do núcleo estelar, incinerando a carne e cegando os sobreviventes em um raio de quilômetros. Enfrentar um Ifrit-Magma exige o ápice da força militar, magias deRank SSS de congelamento absoluto ou a intervenção direta de divindades, pois ele é, em essência, o fim de todas as coisas.`,
    type: 'Monstro colossal, gosma',
    ac: '22',
    hp: '480 (20d20 + 280)',
    speed: '12m, natação (magma) 24m',
    stats: {
      forca: '30 (+10)',
      destreza: '6 (-2)',
      constituicao: '28 (+9)',
      inteligencia: '12 (+1)',
      sabedoria: '20 (+5)',
      carisma: '22 (+6)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Ifrit-Magma for alvo de dano de fogo, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se ele estiver em um ambiente vulcânico, recupera 30 PV no início de cada um de seus turnos.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Psíquico; Concussão, Cortante e Perfurante (mesmo de armas mágicas). imune a todas as condições (exceto banimento e cegueira)',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Frio (Porém, ao receber dano de frio, ele libera uma nuvem de vapor que causa 4d6 de dano de fogo em quem estiver a 3 metros).',
      },
      {
        nome: 'Campo de calor absoluto',
        desc: 'Uma aura de calor intenso emana da criatura em um raio de 18 metros. No início de cada um dos seus turnos, qualquer criatura na área sofre 21 (6d6) de dano de fogo. Itens não-mágicos inflamáveis na área incendeiam-se instantaneamente.',
      },
      {
        nome: 'Sangue de supernova',
        desc: 'Sempre que o Ifrit-Magma recebe um ataque corpo a corpo, o atacante recebe 14 (4d6) de dano de fogo pelo respingo de magma pressurizado.',
      },
      {
        nome: 'Pulso vulcânico',
        desc: 'Onde o Ifrit-Magma pisa, o chão se torna lava permanente. O terreno torna-se terreno difícil e qualquer um que termine o turno sobre ele sofre 21 (6d6) de dano de fogo.',
      },
      {
        nome: 'Ações Lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Ifrit-Magma realiza quatro ataques de Tentáculo de Lava e usa seu Sopro de Magma (se disponível).',
      },
      {
        nome: 'Tentáculo de lava',
        desc: 'Ataque Corpo a Corpo: +16 para acertar, alcance 15m. Dano: 24 (4d6 + 10) de impacto + 21 (6d6) de fogo. O alvo fica Agarrado (CD 24 para escapar). Enquanto estiver agarrado, o alvo sofre o dano de fogo da aura e do tentáculo no início de seus turnos.',
      },
      {
        nome: 'Sopro de magma (Recarga 5t)',
        desc: 'O Ifrit-Magma expele uma torrente de rocha líquida em um cone de 27 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 24). Falha: Sofre 91 (26d6) de dano de fogo e fica Incendiada (sofre 3d6 de fogo por turno até alguém usar uma ação para apagar). Sucesso: Metade do dano.',
      },
      {
        nome: 'Giga-labareda (Recarga 6t)',
        desc: 'O núcleo do monstro brilha com luz branca. Todas as criaturas em um raio de 30 metros devem passar em uma RES de Constituição (CD 24).Falha: Sofre 100 de dano de fogo e fica Cego permanentemente por causa do clarão.Sucesso: Metade do dano e não fica cego.',
      },
      {
        nome: 'Erupção geotérmica',
        desc: 'Faz com que um pilar de fogo surja sob uma criatura a até 36 metros. O alvo deve passar em uma RES de Destreza (CD 24) ou sofrerá 28 (8d6) de dano de fogo e será arremessado 6 metros para cima.',
      },
      {
        nome: 'Solidificar superficie',
        desc: 'O Ifrit-Magma endurece parte de sua massa, ganhando 40 Pontos de Vida Temporários e +2 de CA até o início do seu próximo turno.',
      },
      {
        nome: 'Explosão de vapor (custa 2 ações)',
        desc: 'Se houver qualquer fonte de água ou gelo por perto (ou se ele tiver recebido dano de frio), ele libera uma explosão de vapor. Todos a até 9 metros ficam Incapacitados pela dor da queimadura de vapor até o fim do próximo turno.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '15',
      visaoEscuro: '150m (sentido sismico)',
    },
    drops: [
      {
        range: '1',
        item: 'Coração do Vulcão Eterno',
      },
      {
        range: '2',
        item: 'Placas de Obsidiana Real',
      },
      {
        range: '3',
        item: 'Essência de Sol Engarrafada',
      },
      {
        range: '4',
        item: 'Nada',
      },
    ],
  },
  leviataDasMares: {
    name: 'Leviatã das marés',
    rarity: 'Super raro',
    icon: 'https://2img.net/i.imgur.com/jGd9it6.png',
    image: 'https://2img.net/i.imgur.com/bfanekF.jpeg',
    subtitle: 'CR 20',
    description: `Nos registros sagrados das Grandes Calamidades Planetárias e tomos de alta magia hidro-genética, o Leviatã da Maré é classificado como uma Calamidade de Rank X (Entidade de Extinção Geográfica) de Nível 20+. Ele representa o ponto de singularidade onde a linhagem dos slimes de água deixa de ser uma criatura biológica para se tornar a própria consciência senciante do oceano primordial, compactada em uma forma viscosa de alta pressão. Ele não habita os mares; ele é a vontade do oceano.

A anatomia do Leviatã da Maré é um paradoxo físico mantido por mana de Rank Divino. Seu corpo é composto inteiramente por água abissal super-pressionada, revestida por uma tensão superficial tão absoluta que repele ataques como a armadura mais lendária. Sua habilidade de Absorção de Água torna qualquer ataque hidromântico ou criomântico contra ele um erro fatal, pois ele consome a energia do feitiço para aumentar sua própria massa e densidade, regenerando feridas em segundos. Ele não consome matéria orgânica; ele consome hidro-estabilidade, drenando a coesão de qualquer líquido no ambiente e a força vital de seres vivos através do seu Domínio de Alta Pressão.

O perigo do Leviatã da Maré não reside apenas em seus tentáculos de água diamondinos ou em seu esmagamento abissal, mas em sua natureza predatória irracional de remodelagem planetária. Por onde ele passa, o nível do mar sobe permanentemente e as correntes marítimas são alteradas, tornando continentes inteiros inabitáveis através de inundações constantes. Sua habilidade máxima, o Tsunami Diluvial, libera a pressão de quilômetros de profundidade em uma única explosão, incinerando a carne e destruindo fortalezas em um raio de quilômetros. Enfrentar um Leviatã da Maré exige o ápice da força militar, magias de Rank SSS de isolamento ou a intervenção direta de divindades, pois ele é, em essência, o dilúvio final de todas as coisas.`,
    type: 'Monstro colossal, gosma',
    ac: '20',
    hp: '550 (20d20 + 350)',
    speed: '12m, natação 36m',
    stats: {
      forca: '28 (+9)',
      destreza: '14 (+2)',
      constituicao: '30 (+10)',
      inteligencia: '12 (+1)',
      sabedoria: '22 (+6)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Leviatã da Maré for alvo de dano de água ou gelo, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se ele estiver submerso ou sob chuva pesada, recupera 40 PV no início de cada um de seus turnos.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Ácido; Concussão, Cortante e Perfurante de armas não-mágicas. imune a todas as condições (exceto banimento)',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo (a água se regenera instantaneamente), Elétrico (a massa é tão vasta que o choque se dissipa).',
      },
      {
        nome: 'Domínio de alta pressão',
        desc: 'Uma aura de pressão esmagadora emana do Leviatã em um raio de 18 metros. Criaturas que comecem o turno na área devem passar em uma RES de Força (CD 24). Em uma falha, sofrem 21 (6d6) de dano de impacto e ficam Impedidas. Em um sucesso, sofrem apenas metade do dano e não ficam impedidas.',
      },
      {
        nome: 'Fluidez absoluta',
        desc: 'Ataques à distância (flechas, magias de projétil) têm Desvantagem contra o Leviatã, pois seu corpo de água desvia a trajetória dos projéteis antes do impacto.',
      },
      {
        nome: 'Manto de névoa perpétua',
        desc: 'O Leviatã está sempre cercado por uma névoa densa em um raio de 30 metros. A área é considerada de visibilidade nula para todos, exceto para o Leviatã.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Leviatã realiza três ataques: dois de Tentáculo de Jato de Água e um de Esmagamento Abissal.',
      },
      {
        nome: "Tentáculo de jato d'água",
        desc: 'Ataque Corpo a Corpo: +15 para acertar, alcance 18m. Dano: 22 (3d8 + 9) de impacto + 14 (4d6) de dano de água. O alvo deve passar em uma RES de Força (CD 24) ou será puxado 9 metros em direção ao centro do Leviatã.',
      },
      {
        nome: 'Esmagamento abissal',
        desc: 'Ataque Corpo a Corpo: +15 para acertar, alcance 3m. Dano: 35 (4d12 + 9) de impacto. O alvo fica Agarrado (CD 24 para escapar). Enquanto estiver agarrado, o alvo começa a Sufocar e sofre 30 de dano de impacto no início de cada um de seus turnos.',
      },
      {
        nome: 'Tsunami diluvial (Recarga 5t)',
        desc: 'O Leviatã colapsa sua forma e explode em uma onda massiva em um raio de 30 metros. Todas as criaturas na área devem fazer uma RES de Força (CD 24). Falha: Sofre 78 (12d12) de dano de impacto, é empurrada 18 metros e fica Caída. Sucesso: Metade do dano e não é empurrada.',
      },
      {
        nome: 'Bolha de estase',
        desc: 'O Leviatã envolve uma criatura a até 18 metros em uma esfera de água de alta densidade. O alvo deve passar em uma RES de Destreza (CD 24) ou ficará Paralisado e flutuando até o fim do próximo turno do Leviatã.',
      },
      {
        nome: 'Corrente reversa',
        desc: 'Todas as criaturas em um raio de 12 metros são puxadas ou empurradas 6 metros (escolha do Leviatã).',
      },
      {
        nome: 'Hidro-cura (custa 2 ações)',
        desc: 'O Leviatã condensa a umidade do ar, recuperando 60 PV e removendo uma condição negativa.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '16',
      visaoEscuro: '120m',
    },
    drops: [
      {
        range: '1',
        item: 'Coração do Oceano Primordial',
      },
      {
        range: '2',
        item: 'Membrana de Fluidez Eterna',
      },
      {
        range: '3',
        item: 'Icor de Maré Alta',
      },
      {
        range: '4',
        item: 'Fragmento de Tridente de Cristal',
      },
    ],
  },
  invernoEterno: {
    name: 'Inverno Eterno',
    rarity: 'super raro',
    icon: 'https://2img.net/i.imgur.com/6Av3Z6Z.png',
    image: 'https://2img.net/i.imgur.com/hhYnT5B.jpeg',
    subtitle: 'CR 20',
    description: `Nos registros sagrados das Grandes Calamidades Planetárias e tomos de alta magia criogênica, o Inverno Eterno é classificado como uma Calamidade de Rank X (Entidade de Extinção Geográfica) de Nível 20+. Ele representa o ponto de singularidade onde a linhagem dos slimes de gelo deixa de ser uma criatura biológica para se tornar a própria consciência senciante da entropia térmica, a vontade do universo em atingir o repouso absoluto. Ele não traz a neve; ele é o fim de todo o movimento molecular.

A anatomia do Inverno Eterno é um paradoxo físico mantido por mana de Rank Divino. Seu corpo é composto inteiramente por gelo adamantino super-pressionado, revestido por uma tensão superficial tão absoluta que repele ataques físicos como a armadura mais lendária. Sua habilidade de Absorção de Frio torna qualquer ataque criomântico contra ele um erro fatal, pois ele consome a energia do feitiço para aumentar sua própria massa e densidade, regenerando feridas em segundos. Ele não consome matéria orgânica; ele consome energia cinética, drenando a coesão de qualquer material e a força vital de seres vivos através de sua Aura de Zero Absoluto.

O perigo do Inverno Eterno não reside apenas em suas pancadas glaciais ou em suas prisões criogênicas, mas em sua natureza predatória irracional de remodelagem planetária. Por onde ele passa, a temperatura cai permanentemente abaixo do ponto onde a vida é possível, e a própria atmosfera se condensa, tornando continentes inteiros inabitáveis em dias. Sua habilidade máxima, a Expiração de Gelo Estelar, libera poeira estelar congelada que impõe o estado de Parar (stop), congelando o tempo e o movimento de qualquer criatura atingida. Enfrentar um Inverno Eterno exige o ápice da força militar, magias de Rank SSS de calor estelar ou a intervenção direta de divindades, pois ele é, em essência, o silêncio final de todas as coisas.`,
    type: 'Monstro colossal, gosma',
    ac: '22',
    hp: '530 (20d20 + 330)',
    speed: '12m, escalar 12m',
    stats: {
      forca: '26 (+8)',
      destreza: '4 (-3)',
      constituicao: '30 (+10)',
      inteligencia: '14 (+2)',
      sabedoria: '24 (+7)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Inverno Eterno for alvo de dano de frio, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se a cura exceder seu máximo, o excesso se torna pontos de vida temporários.',
      },
      {
        nome: 'Imunidade',
        desc: 'Psíquico, Necrótico; Concussão, Cortante e Perfurante de armas não-mágicas. Imune a todas as condições (exceto banimento)',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo (Sua massa é tão fria que o fogo se apaga antes de derretê-lo), Elétrico.',
      },
      {
        nome: 'Aura de zero absoluto',
        desc: 'Uma aura de frio impossível emana da criatura em um raio de 18 metros. Qualquer criatura que comece seu turno na área sofre 28 (8d6) de dano de frio e tem seu deslocamento reduzido a zero até o início de seu próximo turno. Criaturas imunes a dano de frio sofrem metade desse dano e não têm o deslocamento reduzido.',
      },
      {
        nome: 'Armadura reativa de cristais',
        desc: 'Sempre que uma criatura atinge o Inverno Eterno com um ataque corpo a corpo, estilhaços de gelo explodem. O atacante sofre 14 (4d6) de dano perfurante e 14 (4d6) de dano de frio.',
      },
      {
        nome: 'Campo de paralisia térmica',
        desc: 'O Inverno Eterno absorve o calor de magias de fogo lançadas a até 30 metros dele. Qualquer magia de fogo tem 50% de chance de falhar totalmente, e o Inverno Eterno recupera PV como se tivesse sido alvo de Absorção de Frio.',
      },
      {
        nome: 'Ações Lendarias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Inverno Eterno realiza três ataques: dois de Pancada Glacial e um de Prisão Criogênica.',
      },
      {
        nome: 'Pancada Glacial',
        desc: 'Ataque Corpo a Corpo: +14 para acertar, alcance 9m. Dano: 21 (3d8 + 8) de impacto + 21 (6d6) de frio. O alvo deve passar em uma RES de Constituição (CD 24) ou ficará Petrificado (em gelo) até o fim do próximo turno do Inverno Eterno.',
      },
      {
        nome: 'Prisão criogênica',
        desc: 'O Inverno Eterno lança uma esfera de gelo em um ponto a até 24 metros. Cada criatura em um raio de 6 metros do ponto deve passar em uma RES de Destreza (CD 24) ou ficará Agarrada e Impedida por correntes de gelo (CD 24 de Força para escapar). No início de cada turno em que estiver presa, a criatura sofre 35 (10d6) de dano de frio.',
      },
      {
        nome: 'Expiração de gelo estelar (Recarga 5t)',
        desc: 'O Inverno Eterno expele um sopro de poeira estelar congelada em um cone de 27 metros. Todas as criaturas na área devem fazer uma RES de Constituição (CD 24).Falha: Sofre 90 (20d8) de dano de frio e sofre o status Parar, ficando incapaz de realizar ações, reações ou se mover por 1 rodada.Sucesso: Metade do dano e não sofre Parar.',
      },
      {
        nome: 'Flash de nevasca',
        desc: 'O Inverno Eterno brilha intensamente. Todas as criaturas a até 12 metros devem passar em uma RES de Constituição (CD 24) ou ficarão Cegas até o fim do próximo turno.',
      },
      {
        nome: 'Estalactite Cadente',
        desc: 'O Inverno Eterno faz com que o teto ou o próprio ar condense em gelo sobre um inimigo. O alvo sofre 22 (4d10) de dano perfurante (CD 24 de Destreza para metade).',
      },
      {
        nome: 'Reestruturação molecular (custa 2 ações)',
        desc: 'O Inverno Eterno condensa sua massa, recuperando 70 PV e aumentando sua CA em +2 até o início do seu próximo turno.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '17',
      visaoEscuro: '120m',
    },
    drops: [
      {
        range: '1',
        item: 'Coração do Zero Absoluto',
      },
      {
        range: '2',
        item: 'Essência de Geada Primordial',
      },
      {
        range: '3',
        item: 'Casca Glacial Reforçada',
      },
      {
        range: '4',
        item: 'Olho da Nevasca',
      },
    ],
  },
  geomonolito: {
    name: 'Geo-monólito',
    rarity: 'Super raro',
    icon: 'https://2img.net/i.imgur.com/gC1qYk0.png',
    image: 'https://2img.net/i.imgur.com/ZXd9Uem.jpeg',
    subtitle: 'CR 20',
    description: `O Geo-Monólito transcende a definição de monstro para se tornar um fenômeno físico senciante. Classificado como uma Calamidade de Rank X (Ponto de Ruptura Gravitacional), ele é o estágio onde o slime de terra atinge tamanha densidade que começa a colapsar o espaço ao seu redor. Ele não caminha sobre o mundo; ele flutua acima dele, agindo como um novo centro de gravidade que despedaça a crosta terrestre por onde passa.

Sua forma é uma estrutura geométrica perfeita de minerais ancestrais, mantida coesa por um núcleo de lodo metálico de densidade infinita. A habilidade de Absorção de Terra e Impacto aqui atinge um nível celular: qualquer objeto sólido que tente atingi-lo é instantaneamente atraído para sua órbita e assimilado à sua massa, tornando o Geo-Monólito maior e mais pesado a cada ataque recebido. Ele não caça presas; ele simplesmente atrai toda a matéria em um raio de quilômetros para o seu centro, processando minerais e energia em um ciclo eterno de auto-reconstrução.

Enfrentar o Pilar Absoluto é lutar contra a própria física. Sua Aura de Gravidade Esmagadora pode achatar exércitos inteiros contra o chão em segundos, enquanto seu Pulso Geodésico envia ondas de choque que não apenas quebram ossos, mas desintegram a estrutura molecular de materiais não-mágicos. Ele é o guardião silencioso das profundezas, uma entidade que acredita que o mundo deve ser reconduzido ao seu estado original de rocha e silêncio.`,
    type: 'Monstro colossal, gosma',
    ac: '24',
    hp: '580 (20d20 + 380)',
    speed: '12m, escavação 24m',
    stats: {
      forca: '30 (+10)',
      destreza: '4 (-3)',
      constituicao: '30 (+10)',
      inteligencia: '10 (+0)',
      sabedoria: '20 (+5)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Geo-Monólito for alvo de dano de terra (como magias de pedra) ou dano de Concussão (mesmo de armas mágicas), ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se ele estiver em contato com o solo natural, recupera 40 PV no início de cada um de seus turnos.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Ácido, Cortante e Perfurante (de armas não-mágicas). Imune a todas as condições (exceto banimento)',
      },
      {
        nome: 'Resistência',
        desc: 'Radiante, Elétrico',
      },
      {
        nome: 'Aura de gravidade esmagadora',
        desc: 'O Geo-Monólito distorce o peso ao seu redor em um raio de 18 metros. Criaturas na área consideram o terreno como Terreno Difícil e têm sua altura de salto reduzida a zero. Além disso, projéteis físicos (flechas, lanças) têm Desvantagem para atingir qualquer alvo dentro desta aura.',
      },
      {
        nome: 'Inércia planetária',
        desc: 'O Geo-Monólito não pode ser movido contra sua vontade por nenhuma magia ou efeito físico de nível inferior a 9, a menos que ele decida se mover.',
      },
      {
        nome: 'Ruptura tectonica permanente',
        desc: 'O solo em um raio de 30 metros ao redor do Geo-Monólito está em constante mutação. No início de cada rodada, o Mestre pode alterar a elevação do terreno em até 6 metros, criando paredes de pedra ou fendas profundas como uma ação gratuita da criatura.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Geo-Monólito realiza três ataques: dois de Esmagamento de Placa e um de Canhão de Detritos.',
      },
      {
        nome: 'Esmagamento de placa',
        desc: 'Ataque Corpo a Corpo: +16 para acertar, alcance 12m. Dano: 32 (4d10 + 10) de impacto. O alvo deve passar em uma RES de Força (CD 24) ou será enterrado vivo, ficando Caído e Impedido (CD 24 para escapar).',
      },
      {
        nome: 'Canhão de detritos',
        desc: 'Ataque à Distância: +16 para acertar, alcance 30/120m. Dano: 36 (4d12 + 10) de impacto. Este ataque ignora coberturas que não sejam de metal mágico ou energia.',
      },
      {
        nome: 'Pulso Geodésico',
        desc: 'O Geo-Monólito bate sua massa no chão, liberando uma onda de choque de alta frequência. Todas as criaturas em um raio de 30 metros devem fazer uma RES de Constituição (CD 24). Falha: Sofre 80 (10d10 + 25) de dano de impacto e fica Atordoado por 1 rodada devido à vibração dos ossos e órgãos. Sucesso: Metade do dano e não fica atordoado.',
      },
      {
        nome: 'Deslocamento de Falla',
        desc: 'O Geo-Monólito se funde ao solo e ressurge em qualquer ponto que possa "sentir" via sentido sísmico a até 24 metros.',
      },
      {
        nome: 'Prisão de quartzo',
        desc: 'Uma criatura a até 18 metros deve passar em uma RES de Destreza (CD 24) ou será envolta em cristais de crescimento rápido, ficando Petrificada até o fim do próximo turno do Geo-Monólito.',
      },
      {
        nome: 'Reconstrução mineral (custa 2 ações)',
        desc: 'O Geo-Monólito absorve minerais do solo, recuperando 80 PV e restaurando qualquer parte do corpo que tenha sido "destruída".',
      },
    ],
    sentidos: {
      percepcaoPassiva: '15',
      visaoEscuro: '300m (sentido sismico)',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo de Gravidade Concentrada',
      },
      {
        range: '2',
        item: 'Fragmento de Adamantino Primordial',
      },
      {
        range: '3',
        item: 'Geoda de Mana Infinito',
      },
      {
        range: '4',
        item: 'Placa Tectônica em Miniatura',
      },
    ],
  },
  tempestadeViva: {
    name: 'Tempestade Viva',
    rarity: 'Super raro',
    icon: 'https://2img.net/i.imgur.com/qMvHvIo.png',
    image: 'https://2img.net/i.imgur.com/LyicfQq.jpeg',
    subtitle: 'CR 20',
    description: `Nos registros sagrados das Grandes Calamidades Planetárias e tomos de alta magia eletromagnética, a Tempestade Viva é classificada como uma Calamidade de Rank X (Entidade de Extinção Atmosférica) de Nível 20+. Ela representa o ponto de singularidade onde a linhagem dos slimes elétricos deixa de ser uma criatura biológica rastejante para se tornar a própria consciência senciante de um evento climático apocalíptico, a vontade do céu em atingir a purificação total através do plasma. Ela não traz a tempestade; ela é a vontade do trovão.

A anatomia da Tempestade Viva é um paradoxo físico mantido por mana de Rank Divino. Seu corpo é composto inteiramente por plasma superaquecido e nuvens jônicas pressurizadas, revestido por um campo eletromagnético tão absoluto que repele ataques físicos e desvia projéteis mágicos como se fossem nada. Sua habilidade de Absorção Elétrica torna qualquer ataque piromântico ou eletromântico contra ela um erro fatal, pois ela consome a energia do feitiço para aumentar sua própria massa, temperatura e velocidade, regenerando feridas em segundos e acelerando seu metabolismo a níveis superluminais. Ela não consome matéria orgânica; ela consome coerência, drenando a estabilidade molecular de qualquer material e os impulsos nervosos de seres vivos através de sua Atmosfera Ionizada.

O perigo da Tempestade Viva não reside apenas em seus chicotes de plasma ou em suas trovoadas, mas em sua natureza predatória de remodelagem atmosférica. Por onde ela passa, o céu se torna uma zona de guerra permanente de raios, e a composição do ar é alterada, tornando continentes inteiros inabitáveis em dias. Sua habilidade máxima, a Trovoada Final, libera a voltagem de um sistema de tempestades inteiro em uma única explosão, incinerando a carne e ensurdecendo os sobreviventes em um raio de quilômetros. Enfrentar uma Tempestade Viva exige o ápice da força militar, magias de Rank SSS de isolamento ou terraformação, ou a intervenção direta de divindades, pois ela é, em essência, o curto-circuito final de todas as coisas.`,
    type: 'Monstro colossal, gosma',
    ac: '22',
    hp: '460 (20d20 + 260)',
    speed: '36m (voo)',
    stats: {
      forca: '18 (+4)',
      destreza: '30 (+10)',
      constituicao: '26 (+8)',
      inteligencia: '16 (+3)',
      sabedoria: '22 (+6)',
      carisma: '18 (+4)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Tempestade Viva for alvo de dano elétrico, ela não sofre dano. Em vez disso, ela recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se a cura exceder o máximo, ela ganha o status (Acelerar) por 1 rodada.',
      },
      {
        nome: 'Imunidade',
        desc: 'Trovão, Veneno, Psíquico; Concussão, Cortante e Perfurante de armas não-mágicas. Todas as condições (exceto banimento)',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Radiante.',
      },
      {
        nome: 'Atmosfera Ionizada',
        desc: 'Uma aura de estática extrema emana da criatura em um raio de 18 metros. No início de cada um dos seus turnos, qualquer criatura na área deve passar em uma RES de Constituição (CD 24) ou ficará sob o efeito de Paralisia até o início do seu próximo turno. Mesmo em um sucesso, a criatura sofre 14 (4d6) de dano elétrico.',
      },
      {
        nome: 'Velocidade superluminal',
        desc: 'A Tempestade Viva não provoca ataques de oportunidade ao se mover. Além disso, ela pode realizar a ação de Disparada como uma ação bônus em cada um de seus turnos.',
      },
      {
        nome: 'Corpo de plasma',
        desc: 'Qualquer criatura que atinja a Tempestade Viva com um ataque corpo a corpo sofre 14 (4d6) de dano elétrico e 14 (4d6) de dano de trovão devido à detonação sonora do plasma.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Tempestade Viva realiza quatro ataques de Chicote de Plasma e usa seu Salto de Frequência.',
      },
      {
        nome: 'Chicote de plasma',
        desc: 'Ataque Corpo a Corpo: +16 para acertar, alcance 15m. Dano: 20 (3d6 + 10) de impacto + 14 (4d6) de dano elétrico. O alvo deve passar em uma RES de Constituição (CD 24) ou sofrerá o status (Lentidão) por 1 minuto.',
      },
      {
        nome: 'Salto de frequência',
        desc: 'A Tempestade Viva se transforma em um raio e se teletransporta para um espaço vazio a até 30 metros. Criaturas no caminho entre o ponto de origem e o destino devem passar em uma RES de Destreza (CD 24) ou sofrerão 21 (6d6) de dano elétrico.',
      },
      {
        nome: 'Trovoada final (Recarga 5t)',
        desc: 'A criatura libera uma descarga massiva em um raio de 30 metros. Todas as criaturas devem fazer uma RES de Constituição (CD 24). Falha: 84 (24d6) de dano elétrico e fica Surda permanentemente. Sucesso: Metade do dano e não fica surda.',
      },
      {
        nome: 'Flash eletrostático',
        desc: 'Todas as criaturas a até 9 metros devem passar em uma RES de Constituição (CD 24) ou ficarão Cegas até o fim do próximo turno da Tempestade Viva.',
      },
      {
        nome: 'Sobrecarga sináptica',
        desc: 'O monstro força o sistema nervoso de uma criatura que ele possa ver a até 18 metros. O alvo deve passar em uma RES de Sabedoria (CD 24) ou usará sua reação para realizar um ataque contra a criatura mais próxima.',
      },
      {
        nome: 'Reenergizar (custa 2 ações)',
        desc: 'A Tempestade Viva brilha intensamente, recuperando 60 PV e recarregando instantaneamente sua habilidade Trovoada Final.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '16',
      visaoEscuro: '180m (pulsos eletromagnéticos)',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo de Plasma Estabilizado',
      },
      {
        range: '2',
        item: 'Membrana de Nuvens Jônicas',
      },
      {
        range: '3',
        item: 'Icor de Relâmpago Líquido',
      },
      {
        range: '4',
        item: 'Garra de Trovão Petrificado',
      },
    ],
  },
  omniarsenal: {
    name: 'Omni-Arsenal',
    rarity: 'Super raro',
    icon: 'https://2img.net/i.imgur.com/UunITwa.png',
    image: 'https://2img.net/i.imgur.com/0ZIYocb.jpeg',
    subtitle: 'CR 20',
    description: `Nos tomos proibidos de alta engenharia bélica e registros das Grandes Calamidades Planetárias, o Omni-Arsenal é classificado como uma Calamidade de Rank X (Ponto de Singularidade Bélica) de Nível 20+. Ele representa o estágio onde a linhagem dos slimes de metal deixa de ser uma criatura biológica rastejante para se tornar a própria consciência senciante de uma fábrica de armas infinita, o conceito de "guerra" manifestado em metal líquido auto-replicante. Ele não usa armas; ele é a arma.

A anatomia do Omni-Arsenal é um paradoxo físico mantido por mana de Rank Divino e mecânica teórica. Seu corpo é composto inteiramente por mercúrio denso e ligas metálicas desconhecidas que flutuam sob pressão magnética severa. Sua habilidade de Absorção de Metal e Aço torna qualquer ataque de lâmina ou projétil físico contra ele um erro fatal, pois ele consome o material do ataque para aumentar sua própria massa, densidade e complexidade, regenerando feridas em segundos e analisando a estrutura do ataque inimigo. Ele não consome matéria orgânica; ele consome conflito, drenando a energia cinética e a intenção de matar do ambiente para alimentar sua Singularidade Magnética.

O perigo do Omni-Arsenal não reside apenas em suas mil lâminas ou em sua reconfiguração, mas em sua natureza predatória irracional de desarmamento geopolítico. Por onde ele passa, todo o metal refinado em um raio de quilômetros é extraído do solo e das construções, tornando continentes inteiros inabitáveis em dias devido ao colapso estrutural e tecnológico. Sua habilidade máxima, o Arsenal de Blue Magic, analisa e replica permanentemente as propriedades de armas lendárias que o atingem, tornando-o cada vez mais poderoso à medida que sobrevive a heróis. Enfrentar o Omni-Arsenal exige o ápice da força militar, magias de Rank SSS de desintegração ou calor estelar, ou a intervenção direta de divindades, pois ele é, em essência, o curto-circuito final de todas as forjas.`,
    type: 'Monstro colossal, gosma',
    ac: '25',
    hp: '500 (20d20 + 300)',
    speed: '15m, voo 15m',
    stats: {
      forca: '30 (+10)',
      destreza: '22 (+6)',
      constituicao: '28 (+9)',
      inteligencia: '18 (+4)',
      sabedoria: '16 (+3)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Omni-Arsenal for alvo de dano Cortante ou Perfurante (mesmo de armas mágicas ou artefatos), ele não sofre dano. Em vez disso, ele incorpora o metal à sua massa e recupera uma quantidade de Pontos de Vida igual ao dano que seria causado.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Psíquico, Radiante; Concussão de armas não-mágicas. imune a todas as condições (exceto banimento)',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Frio, Elétrico',
      },
      {
        nome: 'Campo magnético soberano',
        desc: 'O Omni-Arsenal emana uma aura magnética em um raio de 30 metros. Qualquer criatura usando armadura de metal ou segurando uma arma de metal tem Desvantagem em jogadas de ataque e testes de Destreza. Além disso, projéteis de metal (flechas, balas) disparados contra ele são automaticamente desviados.',
      },
      {
        nome: 'Massa infinitamente afiada',
        desc: 'Qualquer criatura que toque o Omni-Arsenal ou o atinja com um ataque corpo a corpo a menos de 1 metro sofre 21 (6d6) de dano cortante, conforme o metal líquido se transforma em micro-lâminas instantâneas.',
      },
      {
        nome: 'Arsenal de Blue Magic',
        desc: 'O Omni-Arsenal pode "analisar" qualquer arma mágica que o atinja. Se ele sobreviver ao ataque, ele pode replicar as propriedades daquela arma em seus próprios ataques no próximo turno.',
      },
      {
        nome: 'Ações Lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Omni-Arsenal realiza cinco ataques: três de Lâmina Transmutável e dois de Chicote de Corrente Serrilhada.',
      },
      {
        nome: 'Lâmina transmutável',
        desc: 'Ataque Corpo a Corpo: +16 para acertar, alcance 15m. Dano: 28 (4d8 + 10) de dano cortante. Este ataque ignora qualquer resistência a dano físico.',
      },
      {
        nome: 'Chicote de corrente serrilhada',
        desc: 'Ataque Corpo a Corpo: +16 para acertar, alcance 20m. Dano: 24 (4d6 + 10) de dano perfurante. O alvo deve passar em uma RES de Força (CD 24) ou será puxado para junto da criatura e ficará Agarrado.',
      },
      {
        nome: 'Chuva de mil lâminas (Recarga 5t)',
        desc: 'O Omni-Arsenal expele milhares de fragmentos metálicos de seu corpo em um raio de 30 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 24).Falha: Sofre 91 (26d6) de dano cortante e fica sob o status Sangramento (Sangramento), sofrendo 10 de dano necrótico no início de cada turno até ser curado magicamente.Sucesso: Metade do dano e sem sangramento.',
      },
      {
        nome: 'Reconfiguração defensiva',
        desc: 'O Omni-Arsenal muda sua densidade, ganhando +2 de CA ou resistência a um tipo de dano específico (como Fogo ou Elétrico) até o início de seu próximo turno.',
      },
      {
        nome: 'Disparo de estilhaço',
        desc: 'Realiza um ataque de Lâmina Transmutável à distância (alcance 36m).',
      },
      {
        nome: 'Singularidade magnética (custa 2 ações)',
        desc: 'Todas as criaturas usando metal a até 18 metros são puxadas 6 metros em direção ao Omni-Arsenal e sofrem 22 (4d10) de dano de concussão pelo impacto.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '120m',
    },
    drops: [
      {
        range: '1',
        item: 'Mercúrio Real Estabilizado',
      },
      {
        range: '2',
        item: 'Núcleo do Arsenal Infinito',
      },
      {
        range: '3',
        item: 'Lente Magnética Polarizada',
      },
      {
        range: '4',
        item: 'Icor de Platina Pura',
      },
    ],
  },
  necromonarca: {
    name: 'Necro-monarca',
    rarity: 'Super Raro',
    icon: 'https://2img.net/i.imgur.com/yQy6316.png',
    image: 'https://2img.net/i.imgur.com/WNRH9Pb.jpeg',
    subtitle: 'CR 20',
    description: `Nos registros proibidos das Calamidades de Rank X, o Necro-Monarca é descrito não como um ser vivo, mas como o estágio final da entropia biológica. Ele é o ponto onde a linhagem dos slimes necróticos deixa de ser uma massa de ossos desorganizada para se tornar um nexo senciante que governa o conceito da morte. Ele não habita cemitérios; ele é uma necrópole ambulante que busca "arquivar" toda a vida existente em sua estrutura de marfim.

A anatomia do Necro-Monarca é mantida por uma vontade maligna e mana de Rank Divino. Seu corpo é uma malha hiper-densa de ossos de heróis e feras de eras passadas, fundidos por um lodo necrótico que atua como o tecido conjuntivo mais forte do mundo. Sua habilidade de Absorção Necrótica torna qualquer tentativa de usar magia de morte ou trevas contra ele um ato de fortalecimento, pois ele assimila a energia negativa para reconstruir sua couraça de ossos instantaneamente. Ele não consome carne; ele consome a existência, drenando a força vital e as memórias de seres vivos através de sua Aura de Expurgo da Vida.

O perigo do Necro-Monarca reside na sua capacidade de anular a esperança. Por onde ele passa, a terra se torna estéril e o ciclo da reencarnação é interrompido, pois as almas são presas dentro de sua massa de lodo para servirem de combustível eterno. Sua habilidade máxima, o Rugido das Almas Perdidas, libera um grito que não é ouvido pelos ouvidos, mas pelas almas, capaz de desintegrar o sistema nervoso e transformar exércitos inteiros em estátuas de cinzas em segundos. Enfrentar o Ossuário Infinito exige magias de Rank SSS de luz purificadora ou o sacrifício de artefatos divinos, pois ele é, em essência, o fim silencioso de todos os legados.`,
    type: 'Monstro colossal, gosma',
    ac: '23',
    hp: '560 (20d20 + 360)',
    speed: '12m, 12m (levitação)',
    stats: {
      forca: '28 (+9)',
      destreza: '12 (+1)',
      constituicao: '30 (+10)',
      inteligencia: '18 (+4)',
      sabedoria: '20 (+5)',
      carisma: '26 (+8)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Necro-Monarca for alvo de dano necrótico, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se ele estiver em um local onde muitas mortes ocorreram recentemente, recupera 40 PV no início de cada um de seus turnos.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Psíquico, Necrótico; Concussão, Cortante e Perfurante de armas não-mágicas. Imune a todas as condições (exceto banimento)',
      },
      {
        nome: 'Resistência',
        desc: 'Radiante',
      },
      {
        nome: 'Aura de expurgo da vida',
        desc: 'Uma névoa cinzenta emana do monstro em um raio de 18 metros. Qualquer criatura viva que comece o turno na área sofre 21 (6d6) de dano necrótico e seu valor de Pontos de Vida Máximos é reduzido em um valor igual ao dano sofrido. Essa redução dura até um descanso longo.',
      },
      {
        nome: 'Comandante do vazio',
        desc: 'Mortos-vivos num raio de 30 metros do Necro-Monarca recebem vantagem em jogadas de ataque e não podem ser expulsos por clérigos ou paladinos.',
      },
      {
        nome: 'Corpo de marfim reativo',
        desc: 'Quando o Necro-Monarca recebe dano físico de uma arma mágica, estilhaços de osso amaldiçoado explodem. O atacante deve passar em uma RES de Destreza (CD 24) ou sofrerá 14 (4d6) de dano perfurante e ficará Envenenado.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Necro-Monarca realiza três ataques: dois de Maça de Marfim e um de Toque do Esquecimento.',
      },
      {
        nome: 'Maça de marfim',
        desc: 'Ataque Corpo a Corpo: +15 para acertar, alcance 12m. Dano: 27 (4d8 + 9) de impacto + 18 (4d8) necrótico. O alvo deve passar em uma RES de Força (CD 24) ou será arremessado 6 metros e ficará Caído.',
      },
      {
        nome: 'Toque de esquecimento',
        desc: 'Ataque Corpo a Corpo: +15 para acertar, alcance 3m. Dano: 40 (6d10 + 7) necrótico. O alvo deve passar em uma RES de Sabedoria (CD 24). Em uma falha, o alvo esquece como usar sua habilidade de classe mais poderosa (ou magia de maior nível) por 1 minuto.',
      },
      {
        nome: 'Rugido das almas perdidas (Recarga 5t)',
        desc: 'O monstro abre suas múltiplas mandíbulas em um grito excruciante. Todas as criaturas em um raio de 27 metros devem fazer uma RES de Constituição (CD 24). Falha: Sofre 88 (16d10) de dano necrótico e fica Amedrontado por 1 minuto. Sucesso: Metade do dano e não fica amedrontado.',
      },
      {
        nome: 'Erguimento instantâneo',
        desc: 'O Necro-Monarca faz com que 1d4 Esqueletos Guerreiros (Nível 15) surjam de sua própria massa para lutar ao seu lado.',
      },
      {
        nome: 'Passo sombrio',
        desc: 'O monstro se dissolve em fumaça e reaparece em um ponto vazio que ele possa ver a até 24 metros.',
      },
      {
        nome: 'Drenar vitalidade (custa 2 ações)',
        desc: 'Cada criatura Amedrontada a até 18 metros sofre 22 (4d10) de dano necrótico, e o Necro-Monarca recupera essa mesma quantidade de PV.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '15',
      visaoEscuro: '150m, 150m (sentir vivos)',
    },
    drops: [
      {
        range: '1',
        item: 'Coroa de Ossos de Érebo',
      },
      {
        range: '2',
        item: 'Medula do Vazio Destilada',
      },
      {
        range: '3',
        item: 'Costela do Soberano do Ocaso',
      },
      {
        range: '4',
        item: 'Pó de Alma Fragmentada',
      },
    ],
  },
  slimeMimico: {
    name: 'Slime Mimico',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/l92yvRN.png',
    image: 'https://2img.net/i.imgur.com/BSiggQ1.jpeg',
    subtitle: 'CR 3',
    description: `O Slime Mímico de Nível 5 é o primeiro sinal de que a linhagem de lodo desenvolveu uma mente capaz de abstração. Ele não é mais guiado apenas pela fome, mas pela observação. Classificado como uma Ameaça de Infiltração Incipiente, esta criatura marca o início do Caminho Intelectual. Ele ainda não consegue replicar um humano perfeitamente; em vez disso, ele cria um "esqueleto" de pressão hidrostática que imita a postura das raças civilizadas, resultando em uma figura instável e levemente perturbadora que se esconde nas sombras para estudar suas presas.

A anatomia nesta fase é fascinante e grotesca. O slime desenvolveu um núcleo central mais denso que funciona como um cérebro primitivo, permitindo que ele processe linguagens e tente mimetizar sons, embora sua voz ainda soe como bolhas estourando em um pântano. Sua habilidade de Mimetismo de Forma é limitada: ele consegue copiar o tamanho e a silhueta geral, mas detalhes como cabelo, dentes ou textura de pele real ainda estão além de sua capacidade. Ele frequentemente usa roupas e equipamentos roubados de aventureiros caídos para esconder sua natureza translúcida e as partes de seu corpo que insistem em derreter.

Em combate, o Mímico demonstra uma crueldade tática que seus primos bestiais não possuem. Ele usa o ambiente a seu favor, fingindo ser uma poça de lodo ou um cadáver coberto por uma capa antes de desferir o ataque. Ele entende o valor das ferramentas humanas, frequentemente incorporando armas de metal diretamente em sua massa ácida para ganhar alcance e letalidade. O maior perigo do Slime Mímico não é sua força, mas sua Toxina Social — um gás feromonal que confunde os sentidos, fazendo com que as vítimas hesitem ao verem aquela forma quase humana, permitindo que o monstro aproveite esse segundo de dúvida para atacar.`,
    type: 'Monstro médio, gosma',
    ac: '14',
    hp: '52 (8d8 + 16)',
    speed: '9m',
    stats: {
      forca: '12 (+1)',
      destreza: '16 (+3)',
      constituicao: '14 (+2)',
      inteligencia: '14 (+2)',
      sabedoria: '12 (+1)',
      carisma: '16 (+3)',
    },
    habilidades: [
      {
        nome: 'Resistência',
        desc: 'Ácido.',
      },
      {
        nome: 'Imunidade',
        desc: 'Cego, Surdo, Caído.',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum e uma língua adicional (geralmente a da região onde infiltra).',
      },
      {
        nome: 'Mimetismo de forma',
        desc: 'O Slime Mímico pode usar sua ação para se transformar em uma criatura humanoide de tamanho Médio que ele tenha visto. Suas estatísticas permanecem as mesmas, mas ele ganha as características visuais e a voz do alvo. Ele recebe Vantagem em testes de Carisma (Enganação) para manter o disfarce.',
      },
      {
        nome: 'Núcleo Flexível',
        desc: 'Devido à sua inteligência e controle molecular, ele pode passar por frestas de até 2 centímetros sem reduzir seu deslocamento, mesmo carregando equipamentos leves.',
      },
      {
        nome: 'Voz sedutora',
        desc: 'O slime pode mimetizar perfeitamente sons e vozes que ouviu nas últimas 24 horas. Um teste de Sabedoria (Intuição) CD 15 é necessário para perceber que a voz é artificial.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Slime Mímico realiza dois ataques de Pancada Ácida ou um ataque de Adaga Escondida.',
      },
      {
        nome: 'Pancada ácida',
        desc: 'Ataque Corpo a Corpo: +5 para acertar, alcance 1m. Dano: 7 (1d8 + 3) de impacto + 4 (1d8) de dano ácido.',
      },
      {
        nome: 'Adaga escondida',
        desc: 'Ataque Corpo a Corpo: +5 para acertar, alcance 1m. Dano: 5 (1d4 + 3) perfurante + 7 (2d6) de dano ácido. Se o Slime estiver disfarçado e o alvo estiver surpreso, o ataque causa 10 (3d6) de dano ácido extra.',
      },
      {
        nome: 'Injeção de toxina social (Recarga 5t)',
        desc: 'O Slime expele um gás invisível em um cone de 4 metros. Criaturas na área devem passar em uma RES de Sabedoria (CD 13).Falha: A criatura fica Encantada pelo Slime por 1 minuto e o vê como um aliado confiável.Sucesso: A criatura resiste e fica imune a este efeito por 24 horas.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Membrana Camaleônica',
      },
      {
        range: '2',
        item: 'Essência de Cordas Vocais',
      },
      {
        range: '3',
        item: 'Núcleo Intelectual Instável',
      },
      {
        range: '4',
        item: 'Fluido Ácido Concentrado',
      },
    ],
  },
  slimeLanterna: {
    name: 'Slime Lanterna',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/cYRYhtI.png',
    image: 'https://2img.net/i.imgur.com/sx3CrkL.jpeg',
    subtitle: 'CR3',
    description: `O Slime Lanterna é a prova de que o fogo, quando guiado pelo intelecto, é mais perigoso do que quando deixado à solta. Classificado como uma Entidade de Manipulação de Rank B, esta criatura marca uma transição sofisticada no Caminho Intelectual. Diferente de seus ancestrais que apenas queimavam tudo o que tocavam, o Lanterna aprendeu que a luz atrai presas. Ele frequentemente se posiciona em florestas escuras ou masmorras profundas, imitando a luz de uma tocha ou lanterna de um aventureiro para atrair os incautos para armadilhas ou penhascos.

Sua anatomia é única: ele secreta um mineral translúcido que endurece rapidamente, criando uma carapaça protetora que canaliza seu calor interno. Isso permite que ele manipule a temperatura do ar com precisão, criando ilusões auditivas ou térmicas. No Nível 5, ele demonstra uma personalidade neutra, porém curiosa; alguns Slimes Lanterna foram relatados "guiando" viajantes perdidos em troca de pedras raras ou fontes de mana, enquanto outros levam exércitos inteiros à perdição por puro divertimento intelectual.

Em combate, ele não é um guerreiro de linha de frente, mas um controlador. Ele usa seu Calor Hipnótico para paralisar oponentes com a beleza de suas chamas antes de desferir ataques de chicote à distância. Seus estalos rítmicos são, na verdade, uma forma de linguagem complexa, e acredita-se que Slimes Lanterna em diferentes partes do mundo estejam em constante comunicação através de flashes de luz que viajam pelas montanhas à noite.`,
    type: 'Monstro médio, gosma',
    ac: '15',
    hp: '52 (8d8 + 16)',
    speed: '9m',
    stats: {
      forca: '10 (+0)',
      destreza: '14 (+2)',
      constituicao: '16 (+3)',
      inteligencia: '16 (+3)',
      sabedoria: '14 (+2)',
      carisma: '18 (+4)',
    },
    habilidades: [
      {
        nome: 'Imunidade',
        desc: 'Fogo',
      },
      {
        nome: 'Imunidade',
        desc: 'Cego, Envenenado, Exaustão.',
      },
      {
        nome: 'Resistência',
        desc: 'Frio (devido ao seu núcleo constante), Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Entende Comum e Ígneo, comunica-se por flashes de luz e estalos.',
      },
      {
        nome: 'Iluminação controlada',
        desc: 'O slime emite luz clara em um raio de 9 metros e luz plena por mais 9 metros. Ele pode reduzir essa luz para um brilho tênue como uma ação bônus, mas nunca apagá-la totalmente.',
      },
      {
        nome: 'Calor Hipnótico',
        desc: 'Criaturas que comecem o turno a até 1 metro do Slime Lanterna devem passar em uma RES de Sabedoria (CD 14) ou ficarão Encantadas pela beleza da chama interior até o início do próximo turno da criatura.',
      },
      {
        nome: 'Ventriloquismo térmico',
        desc: 'O slime pode aquecer o ar ao redor para simular vozes humanas sussurrantes ou sons ambientes. Um teste de Sabedoria (Intuição) CD 15 percebe que o som vem da distorção do calor.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Slime Lanterna realiza dois ataques de Chicote de Plasma ou um de Lampejo Ofuscante.',
      },
      {
        nome: 'Chicote de plasma',
        desc: 'Ataque Corpo a Corpo: +5 para acertar, alcance 3m. Dano: 6 (1d8 + 2) de impacto + 7 (2d6) de dano de fogo.',
      },
      {
        nome: 'Lampejo ofuscante (Recarga 5t)',
        desc: 'O Slime libera uma explosão de luz intensa. Todas as criaturas em um cone de 6 metros devem passar em uma RES de Constituição (CD 14) ou ficarão Cegas por 1 minuto. A criatura pode repetir o teste no fim de cada um de seus turnos.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: 'Lente de Vidro Vulcânico',
      },
      {
        range: '2',
        item: 'Fragmento de Pavio Mental',
      },
      {
        range: '3',
        item: 'Óleo de Lanterna Etéreo',
      },
      {
        range: '4',
        item: 'Núcleo de Chama Fria',
      },
    ],
  },
  slimeEspelhado: {
    name: 'Slime Espelhado',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/IDYNqvy.png',
    image: 'https://2img.net/i.imgur.com/yY9q0Zf.jpeg',
    subtitle: 'CR 3',
    description: `O Slime Espelhado é o ápice da sofisticação cognitiva na fase incipiente do Caminho Intelectual. Classificado como uma Ameaça de Infiltração e Mimetismo Arcano de Rank B, esta criatura marca a transição onde o lodo deixa de ser uma criatura instintiva para se tornar um observador calculista e manipulador. Ele é frequentemente confundido com uma poça de mercúrio puro ou uma escultura de prata antiga, até o momento em que se ergue e molda sua massa para imitar a forma de seus observadores.

A anatomia do Slime Espelhado é composta por uma liga complexa de água de alta pressão e mercúrio senciante, mantida coesa por um núcleo de mana prismático. No Nível 5, sua inteligência é comparável à de um humano adulto experiente, embora ele tenha dificuldades em replicar emoções ou a anatomia orgânica perfeita (diferente do Slime Mímico). Sua principal característica é a Análise de Fluxo (Magia Azul); ele não devora para crescer em tamanho, mas "consome" conhecimento visual, gravando e replicando instantaneamente habilidades de combate e magias que observa em campo. Ele comunica-se por telepatia visual, projetando imagens simbólicas ou previsões de eventos futuros diretamente em sua pele espelhada.`,
    type: 'Monstro médio, gosma',
    ac: '17',
    hp: '37 (5d8 + 15)',
    speed: '9m, natação 12m',
    stats: {
      forca: '10 (+0)',
      destreza: '18 (+4)',
      constituicao: '16 (+3)',
      inteligencia: '18 (+4)',
      sabedoria: '14 (+2)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Slime Espelhado for alvo de dano de Água ou Gelo, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado.',
      },
      {
        nome: 'Imunidade',
        desc: 'Radiante (ele reflete a luz perfeitamente), Psíquico (sua mente é fluida e mutável). Cego, Caído, Preso.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo (a camada externa se vaporiza e se renova instantaneamente), Concussão.',
      },
      {
        nome: 'Idiomas',
        desc: 'Entende Comum e Aquan, comunica-se por telepatia visual (projeção de imagens na própria pele).',
      },
      {
        nome: 'Superficie de contra-ataque',
        desc: 'Se uma magia de projétil (como Míssil Mágico ou Raio de Fogo) errar o Slime Espelhado por causa da sua CA, o Slime pode usar sua Reação para redirecionar o feitiço. O atacante original deve fazer uma salvaguarda de Destreza (CD 14) ou sofrerá o efeito da própria magia.',
      },
      {
        nome: 'Análise de fluxo (Magia Azul)',
        desc: 'O Slime Espelhado observa os padrões de combate. Se ele vir uma habilidade de classe ou magia sendo usada a até 18 metros, ele pode "gravar" essa técnica. No turno seguinte, ele pode usar uma versão de água dessa habilidade (usando Inteligência como atributo). Ele só pode manter uma técnica gravada por vez.',
      },
      {
        nome: 'Fluidez Cognitiva',
        desc: 'Por pertencer ao Caminho Intelectual, ele pode moldar partes de sua massa para formar mãos funcionais ou ferramentas simples, permitindo que ele use itens mágicos, como cajados ou pergaminhos.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Slime Espelhado realiza dois ataques de Lâmina de Mercúrio ou usa sua habilidade Duplicata Refletida.',
      },
      {
        nome: 'Lâmina de Mercurio',
        desc: 'Ataque Corpo a Corpo: +6 para acertar, alcance 3m. Dano: 8 (1d8 + 4) cortante + 4 (1d8) de dano de frio. A lâmina é formada por água sob altíssima pressão e mercúrio denso.',
      },
      {
        nome: 'Duplicata Refletida (Recarga 5t)',
        desc: 'O Slime se divide em três formas idênticas de água. Isso funciona como a magia Reflexos. Enquanto houver pelo menos uma duplicata ativa, o Slime tem vantagem em jogadas de ataque.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Lente de Água Eterna',
      },
      {
        range: '2',
        item: 'Mercúrio Cognitivo',
      },
      {
        range: '3',
        item: 'Núcleo Prateado de Memória',
      },
      {
        range: '4',
        item: 'Fragmento de Pele Prismática',
      },
    ],
  },
  slimeDePrisma: {
    name: 'Slime de Prisma',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/sqzHcSQ.png',
    image: 'https://2img.net/i.imgur.com/UQM8B2f.jpeg',
    subtitle: 'CR3',
    description: `O Slime de Prisma representa uma evolução sofisticada e intelectual na linhagem do gelo, abandonando a força bruta em favor da geometria arcana e da óptica arcana. Classificado como uma Ameaça de Infiltração e Manipulação de Rank B, esta criatura marca o estágio onde o lodo de água de alta pressão deixa de ser uma criatura instintiva para se tornar um observador calculista e manipulador. Ele é frequentemente confundido com uma poça de mercúrio puro ou uma escultura de prata antiga, até o momento em que se ergue e molda sua massa para imitar a forma de seus observadores.

A anatomia do Slime de Prisma é composta por uma liga complexa de água de alta pressão e mercúrio senciante, mantida coesa por um núcleo de mana prismático. No Nível 5, sua inteligência é comparável à de um humano adulto experiente, embora ele tenha dificuldades em replicar emoções ou a anatomia orgânica perfeita. Sua principal característica é a Análise de Fluxo (Magia Azul); ele não devora para crescer em tamanho, mas "consome" conhecimento visual, gravando e replicando instantaneamente habilidades de combate e magias que observa em campo. Ele comunica-se por telepatia visual simbólica e rudimentar, projetando imagens de conflitos passados ou previsões fragmentadas em sua pele espelhada.`,
    type: 'Monstro médio, gosma',
    ac: '17',
    hp: '45 (5d8 + 20)',
    speed: '9m',
    stats: {
      forca: '12 (+1)',
      destreza: '14 (+2)',
      constituicao: '18 (+4)',
      inteligencia: '20 (+5)',
      sabedoria: '16 (+3)',
      carisma: '12 (+1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Slime de Prisma for alvo de dano de Gelo, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Além disso, sua CA aumenta em +1 até o início de seu próximo turno devido ao reforço da estrutura.',
      },
      {
        nome: 'Imunidade',
        desc: 'Radiante (ele refrata a luz), Psíquico (mente de padrão geométrico fixo). Cego, Envenenado, Exaustão, Caído.',
      },
      {
        nome: 'Resistência',
        desc: 'Cortante e Perfurante de armas não-mágicas; Fogo (o gelo prismático é denso demais para derreter rápido).',
      },
      {
        nome: 'Idiomas',
        desc: 'Entende Comum e Dialeto Primordial, comunica-se através de ressonâncias harmônicas e luzes coloridas.',
      },
      {
        nome: 'Aura de refração',
        desc: 'O corpo do slime desvia a luz ao redor. Ataques à distância contra ele têm Desvantagem. Se um ataque de luz ou laser atingir o Slime, ele é automaticamente refletido para uma criatura à escolha do monstro dentro de 9 metros.',
      },
      {
        nome: 'Lógica de cristal',
        desc: 'O Slime de Prisma pode usar sua Inteligência em vez de Destreza para testes de iniciativa e salvaguardas de Reflexos.',
      },
      {
        nome: 'Congelamento por contato',
        desc: 'Qualquer criatura que toque o Slime ou o atinja com um ataque corpo a corpo a até 1 metro deve passar em uma RES de Constituição (CD 15) ou terá seu deslocamento reduzido em 3 metros até o fim do próximo turno dela.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Slime de Prisma realiza dois ataques de Estaca de Vidro ou usa sua habilidade Geometria Aprisionante.',
      },
      {
        nome: 'Estaca de vidro',
        desc: 'Ataque Corpo a Corpo ou à Distância: +7 para acertar, alcance 1m ou 18m. Dano: 9 (1d8 + 5) perfurante + 4 (1d8) de dano de frio.',
      },
      {
        nome: 'Geometria Aprisionante (Recarga 5t)',
        desc: 'O Slime projeta uma rede de luz sólida em uma área de 6 metros quadrados. Criaturas na área devem passar em uma RES de Força (CD 15). Falha: A criatura fica Presa em uma estrutura de gelo geométrico e sofre 10 (3d6) de dano de frio no início de cada um de seus turnos. A estrutura pode ser quebrada (CA 15, 20 PV).',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Fragmento de Lente Perfeita',
      },
      {
        range: '2',
        item: 'Essência de Zero Absoluto',
      },
      {
        range: '3',
        item: 'Geoda Arpão',
      },
      {
        range: '4',
        item: 'Coração de Cristal Harmônico',
      },
    ],
  },
  slimeDeGeodo: {
    name: 'Slime de Geodo',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/0TFrl3S.png',
    image: 'https://2img.net/i.imgur.com/p5oB6G9.jpeg',
    subtitle: 'CR3',
    description: `O Slime de Geodo é a prova de que a terra não é apenas bruta, mas também calculista. Enquanto os slimes comuns de terra são massas disformes de lama, o Geodo é um ser de Pulsão Geométrica. Classificado como uma Ameaça de Controle Tectônico de Rank B, ele não caça por velocidade, mas por estratégia. Ele não vê o campo de batalha como um lugar, mas como um tabuleiro de vibrações onde ele é o mestre das regras físicas.

A anatomia desta criatura é um prodígio de bio-geologia. Seu núcleo não é líquido, mas um aglomerado de Quartzo Cognitivo que pulsa em frequências subsônicas, permitindo que ele "pense" através de ressonâncias minerais. Sua camada externa é composta por basalto denso e placas de granito que ele molda para imitar, de forma rústica e pesada, a silhueta de um antigo sentinela ou um monge encapuzado. O Slime de Geodo não respira; ele absorve os minerais do solo para reconstruir sua carapaça em tempo real, tornando-o quase indestrutível em terrenos rochosos. Sua comunicação é feita através da Mente Tectônica, enviando mensagens diretamente para os ossos de quem pisa em seu domínio, o que causa uma sensação de pavor ancestral nos viajantes.

Em combate, o Slime de Geodo é o mestre do Pulso Gravitacional. Ele manipula a densidade do ar e do solo ao seu redor, tornando cada passo dos inimigos uma tarefa hercúlea. Ele não usa espadas comuns; ele projeta lâminas de cristal de pressão que vibram de tal forma que podem estilhaçar aço por fadiga de metal antes mesmo do toque. O maior perigo ao enfrentar um Geodo não é o seu soco esmagador, mas sua Ressonância de Cristal, que interfere nas ondas cerebrais dos magos, desfazendo feitiços complexos apenas com sua presença vibratória. Ele é o arquiteto que molda a morte sob os pés daqueles que profanam suas cavernas.`,
    type: 'Monstro médio, gosma',
    ac: '18',
    hp: '52 (7d8 + 21)',
    speed: '6m, escavar 6m',
    stats: {
      forca: '16 (+3)',
      destreza: '8 (-1)',
      constituicao: '16 (+3)',
      inteligencia: '18 (+4)',
      sabedoria: '14 (+2)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Slime de Geodo for alvo de dano de terra ou pedra (concussão de fontes terrosas), ele não sofre dano. Em vez disso, ele regenera sua carapaça, recuperando uma quantidade de PV igual ao dano que seria causado.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Trovão (ele absorve vibrações). Cego, Envenenado, Exaustão, Caído, Petrificado.',
      },
      {
        nome: 'Resistência',
        desc: 'Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Entende Comum e Terran, comunica-se através de vibrações de baixa frequência que "ecoam" na mente de quem toca o solo.',
      },
      {
        nome: 'Ressonância de Cristal',
        desc: 'O Slime emite um zumbido constante. Criaturas a até 3 metros dele que tentarem conjurar magias que exijam concentração devem passar em uma RES de Constituição (CD 14) ou perderão a magia devido à interferência vibracional.',
      },
      {
        nome: 'Mente Tectônica',
        desc: 'O Slime de Geodo pode usar sua Inteligência em testes de Salvaguarda de Força, calculando os pontos de pressão exatos para resistir a empurrões ou efeitos de deslocamento.',
      },
      {
        nome: 'Armadura de Geodo',
        desc: 'Se for atingido por um ataque crítico, a camada externa de pedra se quebra, mas revela cristais afiados. O atacante sofre 1d10 de dano perfurante e a CA do Slime diminui em 1 até o fim do combate (acumula até -2).',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Slime de Geodo realiza dois ataques de Esmagamento de Quartzo ou usa sua habilidade Pulso Gravitacional.',
      },
      {
        nome: 'Esmagamento de Quartzo',
        desc: 'Ataque Corpo a Corpo: +6 para acertar, alcance 1m. Dano: 10 (2d6 + 3) de impacto + 3 (1d6) de dano de trovão.',
      },
      {
        nome: 'Pulso Gravitacional (Recarga 5t)',
        desc: 'O Slime aumenta a gravidade em um raio de 6 metros. Todas as criaturas na área devem passar em uma RES de Força (CD 14). Falha: Ficam Caídas e têm seu deslocamento reduzido a 0 até o início do próximo turno do Slime. Sucesso: Apenas metade do deslocamento é reduzido.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '18m (sismico)',
    },
    drops: [
      {
        range: '1',
        item: 'Drusa de Quartzo Cognitivo',
      },
      {
        range: '2',
        item: 'Núcleo Gravitacional',
      },
      {
        range: '3',
        item: 'Pó de Diamante Terroso',
      },
      {
        range: '4',
        item: 'Membrana de Sílica',
      },
    ],
  },
  slimeMagnetico: {
    name: 'Slime Magnético',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/ffWYOWn.png',
    image: 'https://2img.net/i.imgur.com/7LrTUDE.jpeg',
    subtitle: 'CR3',
    description: `O Slime Magnético é o ápice da computação biológica no Caminho Intelectual. Enquanto slimes elétricos comuns são apenas baterias vivas que descarregam energia sem controle, o Magnético é um Manipulador de Fluxo. Classificado como uma Ameaça de Indução Eletromagnética de Rank B, ele não caça por fome física, mas sim por necessidade de "processamento". Ele habita ruínas de antigas civilizações tecnológicas ou laboratórios abandonados, onde pode se alimentar de correntes residuais e metais raros.

A anatomia desta criatura é uma maravilha da engenharia orgânica. Seu corpo é composto por um Ferrofluido Senciante de cor índigo profundo, que reage instantaneamente a campos magnéticos. Seu núcleo não é uma gema, mas um Célula de Processamento Sináptico que brilha em um azul neon intenso. No Nível 5, ele desenvolveu a capacidade de "vestir" o ambiente: ele atrai fragmentos de metal, engrenagens e fios, moldando-os ao redor de sua massa líquida para criar uma carapaça que imita a silhueta de um humano encapuzado. Ele não se comunica por sons, mas por Estática Modulada; quem chega perto ouve um zumbido de rádio antigo, e magos relatam que seus pensamentos parecem "pixelados" na presença da criatura.

Em combate, o Slime Magnético é um pesadelo para guerreiros de armadura. Ele utiliza sua Singularidade Metálica para transformar o equipamento do adversário em uma prisão, puxando-os para o seu centro gravitacional. Ele não desfere golpes físicos comuns, mas usa Aceleração de Lorentz para disparar estilhaços de metal em velocidades supersônicas, como um canhão elétrico orgânico. O maior perigo ao enfrentá-lo é o Feedback Sináptico: ao ser tocado, ele envia uma descarga diretamente para o sistema nervoso do atacante, fritando sinapses e causando desorientação mental severa. Ele é o fantasma na máquina, a inteligência fria que reina sobre o metal e o raio.`,
    type: 'Monstro médio, gosma',
    ac: '16',
    hp: '37 (5d8 + 15)',
    speed: '9m, voo 6m',
    stats: {
      forca: '10 (+0)',
      destreza: '18 (+4)',
      constituicao: '16 (+3)',
      inteligencia: '20 (+5)',
      sabedoria: '14 (+2)',
      carisma: '12 (+1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Slime Magnético for alvo de dano Elétrico, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se o HP estiver cheio, ele fica "Sobrecarregado", ganhando vantagem no próximo ataque.',
      },
      {
        nome: 'Imunidade',
        desc: 'Trovão, Veneno. Cego, Envenenado, Paralisado, Caído.',
      },
      {
        nome: 'Resistência',
        desc: 'Perfurante e Cortante (as armas são desviadas por micro-campos magnéticos).',
      },
      {
        nome: 'Idiomas',
        desc: 'Entende Comum e Binário Arcano, comunica-se através de estática modulada que soa como rádio antigo.',
      },
      {
        nome: 'Campo de atração',
        desc: 'Criaturas vestindo armadura de metal ou carregando armas de metal a até 3 metros do Slime têm seu deslocamento reduzido em 3 metros e sofrem Desvantagem em testes de Destreza.',
      },
      {
        nome: 'Processamento de combate',
        desc: 'O Slime usa sua Inteligência (+5) em vez de Destreza para sua Classe de Armadura e iniciativa. Ele "calcula" a trajetória dos ataques antes mesmo de ocorrerem.',
      },
      {
        nome: 'Feedback Sináptico',
        desc: 'Sempre que uma criatura atingir o Slime com um ataque corpo a corpo, ela deve passar em uma RES de Inteligência (CD 15) ou sofrerá 1d6 de dano psíquico devido à interferência elétrica nos neurônios.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Slime Magnético realiza dois ataques de Chicote Voltaico ou usa sua habilidade Singularidade Metálica.',
      },
      {
        nome: 'Chicote Voltaico',
        desc: 'Ataque Corpo a Corpo: +7 para acertar, alcance 3m. Dano: 7 (1d4 + 5) de impacto + 7 (2d6) de dano elétrico. Se o alvo estiver usando metal, o ataque tem Vantagem.',
      },
      {
        nome: 'Singularidade metalica (Recarga 5t)',
        desc: 'O Slime inverte sua polaridade. Todas as criaturas em um raio de 6 metros usando metal devem passar em uma RES de Força (CD 15) ou serão puxadas para um espaço adjacente ao Slime e ficarão Impedidas até o início do próximo turno do Slime.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo de Silício Arcano',
      },
      {
        range: '2',
        item: 'Bobina de Cobre Perpétua',
      },
      {
        range: '3',
        item: 'Lodo Ferrofluido',
      },
      {
        range: '4',
        item: 'Imã de Evento Singular',
      },
    ],
  },
  slimeDeLatao: {
    name: 'Slime de latão',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/30vkBlP.png',
    image: 'https://2img.net/i.imgur.com/mje7MSm.jpeg',
    subtitle: 'CR3',
    description: `O Slime de Latão representa a ápice da lógica mecânica na linhagem do metal, abandonando a força bruta em favor da geometria sagrada e da óptica arcana. Classificado como uma Ameaça de Infiltração e Mimetismo Arcano de Rank B, esta criatura marca o estágio onde o lodo de água de alta pressão deixa de ser uma criatura instintiva para se tornar um observador calculista e manipulador. Ele é frequentemente confundido com uma poça de mercúrio puro ou uma escultura de prata antiga, até o momento em que se ergue e molda sua massa para imitar a forma de seus observadores.

A anatomia do Slime de Latão é composta por uma liga complexa de água de alta pressão e mercúrio senciante, mantida coesa por um núcleo de mana prismático. No Nível 5, sua inteligência é comparável à de um humano adulto experiente, embora ele tenha dificuldades em replicar emoções ou a anatomia orgânica perfeita. Sua principal característica é a Análise de Fluxo (Magia Azul); ele não devora para crescer em tamanho, mas "consome" conhecimento visual, gravando e replicando instantaneamente habilidades de combate e magias que observa em campo. Ele comunica-se por telepatia visual simbólica e rudimentar, projetando imagens de conflitos passados ou previsões fragmentadas em sua pele espelhada.

O perigo do Slime de Latão reside em sua natureza reativa e imprevisível. Em combate, ele usa sua Superfície de Contra-Ataque (Reflect) para devolver projéteis mágicos aos atacantes, enquanto sua Lâmina de Mercúrio corta com a precisão de um mestre espadachim. Se encurralado, ele usa sua Duplicata Refletida (Recarga 5-6), criando cópias de água para confundir oponentes enquanto o núcleo original se teletransporta através de reflexos em superfícies molhadas. Ele é o guardião silencioso das verdades ocultas, uma entidade que acredita que o mundo é apenas um reflexo de uma realidade mais profunda e perigosa.`,
    type: 'Monstro médio, gosma',
    ac: '18',
    hp: '42 (5d8 + 20)',
    speed: '6m',
    stats: {
      forca: '14 (+2)',
      destreza: '10 (+0)',
      constituicao: '18 (+4)',
      inteligencia: '20 (+5)',
      sabedoria: '16 (+3)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Imunidade',
        desc: 'Veneno, Psíquico. Cego, Envenenado, Exaustão, Amedrontado',
      },
      {
        nome: 'Resistência',
        desc: 'Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Entende Comum e Dialeto das Máquinas, comunica-se através de cliques, assobios de vapor e bips rítmicos.',
      },
      {
        nome: 'Analise de ponto fraco',
        desc: 'Como uma ação bônus, o Slime analisa uma criatura que ele possa ver a até 18 metros. Ele identifica instantaneamente a CA da criatura e qualquer resistência a dano que ela possua. Até o fim do combate, o Slime e seus aliados têm +1 nas jogadas de ataque contra esse alvo específico.',
      },
      {
        nome: 'Núcleo de Relógio',
        desc: 'O Slime não pode ser surpreendido e possui vantagem em testes de iniciativa. Sua mente processa o tempo de forma segmentada, permitindo reações precisas.',
      },
      {
        nome: 'Tensão superficial metálica',
        desc: 'O Slime pode se achatar até 2 centímetros de espessura, permitindo que ele passe por frestas de portas ou engrenagens de máquinas sem sofrer penalidades, apesar de sua carapaça rígida.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Slime de Latão realiza dois ataques de Lâmina de Pistão ou usa sua habilidade Descarga de Vapor.',
      },
      {
        nome: 'Lâmina de pistão',
        desc: 'Ataque Corpo a Corpo: +5 para acertar, alcance 1m. Dano: 11 (2d8 + 2) de dano perfurante. O Slime projeta uma lâmina oculta que é disparada por um pistão hidráulico.',
      },
      {
        nome: 'Descarga de vapor (Recarga 5t)',
        desc: 'O Slime libera uma nuvem de vapor escaldante em um cone de 4 metros. Cada criatura na área deve fazer uma salvaguarda de Constituição (CD 15).  Falha: 14 (4d6) de dano de fogo e a criatura fica Cega até o final do próximo turno dela.  Sucesso: Metade do dano e não fica cega.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Engrenagem Mestra de Latão',
      },
      {
        range: '2',
        item: 'Óleo Hidráulico Senciante',
      },
      {
        range: '3',
        item: 'Placa de Latão Térmica',
      },
      {
        range: '4',
        item: 'Chip de Memória Analógico',
      },
    ],
  },
  slimeDasSombras: {
    name: 'Slime das sombras',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/52iUTsX.png',
    image: 'https://2img.net/i.imgur.com/OrIp6vQ.jpeg',
    subtitle: 'CR3',
    description: `O Slime das Sombras é a personificação da entropia e do silêncio no Caminho Intelectual. Enquanto outros slimes evoluem para manipular elementos físicos, este ser evoluiu para processar a "não-existência". Classificado como uma Ameaça de Infiltração e Pavor Psicológico de Rank B, ele é o predador definitivo de locais onde a luz foi esquecida, como catacumbas reais ou fendas para o Plano Negativo.

A anatomia desta criatura é um paradoxo biológico. Seu corpo é feito de uma substância que os alquimistas chamam de Piche Abissal, um fluido que não reflete a luz, mas a devora. Seu núcleo não é físico, mas uma Singularidade Necrótica que pulsa com uma inteligência fria e calculista. No Nível 5, ele não tenta ser um humano perfeito; ele prefere ser uma silhueta aterrorizante, uma "falha" visual que causa desconforto imediato em seres vivos. Ele não emite sons orgânicos; ele utiliza a Lógica do Vazio para projetar sussurros diretamente no córtex auditivo de suas vítimas, repetindo seus piores medos com vozes de entes queridos falecidos.

Em combate, enfrentar um Slime das Sombras é lutar contra a própria escuridão. Ele utiliza seu Mergulho na Escuridão para se fundir ao chão, tornando-se uma poça de vácuo que paralisa e cega quem pisar nele. Sua Garra de Evento Horizonte não corta apenas a carne; ela drena a própria força vital e a vontade de lutar, deixando o alvo debilitado e fraco. O maior perigo reside na sua natureza intangível: ele pode atravessar frestas e se esconder em sombras tão pequenas quanto a de uma moeda, esperando o momento exato para envolver sua presa em um abraço de frio absoluto. Ele não é apenas um monstro; ele é a sombra que olha de volta para você.`,
    type: 'Monstro médio, gosma',
    ac: '16',
    hp: '32 (5d8 + 10)',
    speed: '9m, escalada 9m',
    stats: {
      forca: '8 (-1)',
      destreza: '18 (+4)',
      constituicao: '14 (+2)',
      inteligencia: '20 (+5)',
      sabedoria: '16 (+3)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Slime das Sombras for alvo de dano Necrótico, ele não sofre dano. Em vez disso, ele se torna invisível até o final do seu próximo turno e recupera uma quantidade de Pontos de Vida igual ao dano que seria causado.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Necrótico. Cego, Envenenado, Exaustão, Caído, Preso, Agarrado.',
      },
      {
        nome: 'Resistência',
        desc: 'Ácido, Fogo, Frio, Trovão; Cortante, Perfurante e Concussão de armas não-mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Radiante.',
      },
      {
        nome: 'Idiomas',
        desc: 'Entende Comum e Abissal, comunica-se através de sussurros que parecem vir de dentro da mente do interlocutor.',
      },
      {
        nome: 'Mimetismo de sombra',
        desc: 'Enquanto estiver em iluminação meia-luz ou escuridão, o Slime pode usar a ação de Esconder-se como uma ação bônus. Ele é indistinguível de uma sombra comum enquanto estiver parado.',
      },
      {
        nome: 'Lógica do vazio',
        desc: 'O Slime pode ocupar o mesmo espaço que outra criatura. Além disso, ele ignora terreno difícil se houver qualquer sombra no local.',
      },
      {
        nome: 'Corpo de piche mental',
        desc: 'Criaturas que tentarem ler a mente do Slime ou causar dano Psíquico devem passar em uma RES de Inteligência (CD 15) ou ficarão Amedrontadas por 1 minuto, vendo visões de sua própria morte.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Slime das Sombras realiza dois ataques de Garra de Evento Horizonte ou usa sua habilidade Mergulho na Escuridão.',
      },
      {
        nome: 'Garra de evento horizonte',
        desc: 'Ataque Corpo a Corpo: +7 para acertar, alcance 1m. Dano: 7 (1d6 + 4) de dano necrótico. O alvo deve passar em uma RES de Força (CD 15) ou terá sua força reduzida em 1d4 até o fim de um descanso curto. Se a força chegar a 0, o alvo morre.',
      },
      {
        nome: 'Mergulho na escuridão (Recarga 5t)',
        desc: 'O Slime se expande no chão em um raio de 3 metros. Cada criatura na área deve passar em uma RES de Destreza (CD 15). Falha: 14 (4d6) de dano necrótico e a criatura fica Cega e Impedida enquanto o Slime permanecer sob seus pés. Sucesso: Metade do dano e não sofre condições.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: 'Resíduo de Escuridão Sólida',
      },
      {
        range: '2',
        item: 'Glândula de Medo Destilado',
      },
      {
        range: '3',
        item: 'Membrana de Espaço Negativo',
      },
      {
        range: '4',
        item: 'Olho de Obsidiana Senciente',
      },
    ],
  },
  homunculoDeGel: {
    name: 'Homunculo de Gel',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/iLf5zcu.png',
    image: 'https://2img.net/i.imgur.com/MA9acHi.jpeg',
    subtitle: 'CR 8',
    description: `O Homúnculo de Gel é a prova de que a evolução necrótica e alquímica pode transformar a mais simples das poças em um estrategista brilhante. Diferente do Slime Mímico, que usa o engano para caçar por instinto, o Homúnculo possui uma consciência plena e uma curiosidade mórbida sobre a biologia das raças civilizadas.

Sua forma é uma tentativa deliberada de imitar a estrutura humanoide, o que lhe permite gesticular e até utilizar ferramentas alquímicas. O que mais impressiona (e aterroriza) os estudiosos é a sua capacidade de comando. Ele atua como uma unidade de processamento central para colônias de slimes, emitindo sinais químicos e vibratórios que coordenam ataques complexos que slimes selvagens seriam incapazes de executar sozinhos.

Em combate, ele não se comporta como uma besta faminta. Ele observa, identifica o elo mais fraco do grupo de aventureiros e utiliza seu ácido altamente corrosivo para desarmar ou destruir equipamentos vitais antes de desferir o golpe final. Sua presença em uma masmorra indica que os slimes locais não são mais um problema ambiental, mas sim um exército organizado.`,
    type: 'Monstro médio, gosma',
    ac: '17',
    hp: '126 (12d10 + 60)',
    speed: '9m, natação 9m',
    stats: {
      forca: '14 (+2)',
      destreza: '14 (+2)',
      constituicao: '20 (+5)',
      inteligencia: '20 (+5)',
      sabedoria: '16 (+3)',
      carisma: '16 (+3)',
    },
    habilidades: [
      {
        nome: 'Imunidade',
        desc: 'Ácido, Veneno. Cego, Envenenado, Exaustão, Caído, Preso, Agarrado.',
      },
      {
        nome: 'Resistência',
        desc: 'Cortante, Perfurante e Concussão de armas não-mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Frio (O gel se torna quebradiço).',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dracônico e Dialeto das Sombras. Consegue falar com clareza, embora sua voz soe borbulhante.',
      },
      {
        nome: 'Presença de comando',
        desc: 'Criaturas do Caminho Selvagem (Bestial) em um raio de 18 metros do Homúnculo de Gel ganham um bônus de +2 em suas jogadas de ataque e não podem ser amedrontadas.',
      },
      {
        nome: 'Corpo semisólido',
        desc: 'O Homúnculo pode passar por espaços de até 2,5 centímetros de largura sem se espremer. Além disso, ele tem vantagem em testes de resistência para não ser empurrado ou movido contra sua vontade.',
      },
      {
        nome: 'Mente analítica',
        desc: 'O Homúnculo adiciona seu bônus de Inteligência (+5) em seus testes de Iniciativa. Ele pode usar a ação de Ajuda como uma ação bônus para um aliado a até 9 metros.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Homúnculo de Gel realiza três ataques de Punho de Vitríolo ou usa sua habilidade Pulso Corrosivo.',
      },
      {
        nome: 'Punho de Vitríolo',
        desc: 'Ataque Corpo a Corpo: +8 para acertar, alcance 1m. Dano: 12 (2d6 + 5) de dano de concussão mais 10 (3d6) de dano ácido. Se o alvo estiver usando uma armadura não-mágica, ela sofre uma penalidade permanente e cumulativa de -1 na CA. Se a CA da armadura chegar a 10, ela é destruída.',
      },
      {
        nome: 'Pulso Corrosivo (Recarga 5t)',
        desc: 'O Homúnculo expele uma nuvem de gás ácido em um cone de 9 metros. Cada criatura na área deve passar em uma RES de Constituição (CD 16). Falha: 35 (10d6) de dano ácido e a criatura fica Envenenada pela dor da corrosão até o início do próximo turno do Homúnculo. Sucesso: Metade do dano e não fica envenenada.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo de Gel Cristalizado',
      },
      {
        range: '2',
        item: 'Solvente Universal Concentrado',
      },
      {
        range: '3',
        item: 'Tecido de Homúnculo Maleável',
      },
      {
        range: '4',
        item: 'Cérebro Alquímico Preservado',
      },
    ],
  },
  artificeDeVidro: {
    name: 'Artifice de vidro',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/6m2iMTk.png',
    image: 'https://2img.net/i.imgur.com/jIaz3fk.jpeg',
    subtitle: 'CR 8',
    description: `O Artífice de Vidro representa o ápice da maestria elemental sobre o fogo e a forma. Enquanto seus ancestrais, os Slimes Lanterna, eram meras fontes de luz passivas, o Artífice é um mestre da geometria e da termodinâmica. Ele não apenas gera calor; ele o manipula com precisão cirúrgica para fundir o ambiente ao seu redor, transformando areia e rocha em complexas estruturas de cristal e vidro temperado.

Sua aparência é hipnotizante e perigosa. O corpo é uma carapaça de vidro resiliente que abriga um núcleo de magma em constante movimento, criando um efeito visual de luz e sombra que confunde os atacantes. O Artífice de Vidro raramente luta sozinho ou de forma desorganizada. Ele utiliza suas lentes flutuantes para focar raios de calor intenso e criar coberturas defensivas para seus aliados de nível inferior, geralmente slimes do caminho selvagem que ele trata como ferramentas.

Encontrar um Artífice de Vidro em uma mina ou caverna vulcânica significa que o local foi transformado em uma oficina. Eles são conhecidos por decorar seus territórios com esculturas de vidro de suas vítimas, que servem tanto como troféus quanto como amplificadores para suas habilidades ópticas. Sua inteligência é fria e calculista, vendo o mundo não como algo a ser queimado, mas como matéria-prima a ser moldada em sua própria imagem cristalina.`,
    type: 'Monstro médio, gosma',
    ac: '18',
    hp: '136 (16d8 + 64)',
    speed: '9m, escalada 9m',
    stats: {
      forca: '12 (+1)',
      destreza: '16 (+3)',
      constituicao: '18 (+4)',
      inteligencia: '22 (+6)',
      sabedoria: '14 (+2)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Artífice de Vidro for alvo de dano de Fogo, ele não sofre dano. Em vez disso, sua carapaça brilha intensamente, concedendo-lhe vantagem em todos os ataques até o final do seu próximo turno e recuperando 15 Pontos de Vida.',
      },
      {
        nome: 'Imunidade',
        desc: 'Fogo, Veneno, Cego, Envenenado, Exaustão, Caído, Preso, Agarrado.',
      },
      {
        nome: 'Resistência',
        desc: 'Cortante e Perfurante de armas não-mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Concussão, Trovão (Vibrações quebram sua estrutura).',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Ígneo e Celestial. Fala com uma voz que soa como cristais batendo uns nos outros.',
      },
      {
        nome: 'Aura de fundição',
        desc: 'Criaturas que comecem o turno a até 1 metro do Artífice sofrem 7 (2d6) de dano de fogo devido ao calor extremo que ele emana para manter sua forma vítrea.',
      },
      {
        nome: 'Refração defensiva',
        desc: 'Enquanto estiver em luz brilhante, ataques à distância contra o Artífice têm desvantagem, pois sua carapaça distorce a imagem de sua localização real.',
      },
      {
        nome: 'Arquitetura de cristal',
        desc: 'O Artífice pode gastar 1 metro de movimento para criar um pequeno pilar ou parede de vidro de 1m em um espaço adjacente. Esse vidro tem CA 15 e 10 PV, servindo como cobertura meia ou total.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Artífice de Vidro realiza dois ataques de Lâmina de Sílica ou usa seu Raio Prismático.',
      },
      {
        nome: 'Lâmina de sílica',
        desc: 'Ataque Corpo a Corpo: +9 para acertar, alcance 3m (o braço se estende como vidro derretido). Dano: 13 (2d6 + 6) de dano cortante mais 7 (2d6) de dano de fogo. Se o ataque for um acerto crítico, o alvo fica sangrando, sofrendo 1d6 de dano cortante no início de cada um de seus turnos até receber cura mágica.',
      },
      {
        nome: 'Raio prismático (Recarga 5t)',
        desc: 'O Artífice concentra luz através de seu núcleo. Ele dispara um feixe de energia em uma linha de 18 metros. Cada criatura na linha deve passar em uma RES de Destreza (CD 17). Falha: 36 (8d8) de dano radiante e a criatura fica Cega por 1 minuto. A criatura pode repetir a RES no final de cada um de seus turnos. Sucesso: Metade do dano e não fica cega.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Lente de Foco Perfeito',
      },
      {
        range: '2',
        item: 'Areia Vulcânica Alquímica',
      },
      {
        range: '3',
        item: 'Fragmento de Carapaça Refrativa',
      },
      {
        range: '4',
        item: 'Essência de Sílica Líquida',
      },
    ],
  },
  misticoDasBrumas: {
    name: 'Mistico das brumas',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/k54tSCj.png',
    image: 'https://2img.net/i.imgur.com/HVBeKa6.jpeg',
    subtitle: 'CR 8',
    description: `O Místico das Brumas é a manifestação da perfeição biológica e mágica dos slimes aquáticos. Ao atingir este estágio de evolução intelectual, a criatura deixa para trás a massa informe e assume uma silhueta feminina humanoide, esculpida em água e névoa condensada. Essa forma não é apenas estética; é uma ferramenta psicológica utilizada para desarmar ou fascinar oponentes antes que percebam que estão presos em sua armadilha de ilusões.

Sua aparência é marcada por curvas fluidas e uma elegância sobrenatural, com cabelos que parecem nuvens de tempestade em constante movimento. No entanto, sua natureza permanece profundamente predatória. Como líder tática, ela comanda o campo de batalha com movimentos graciosos que ocultam ataques devastadores. O Místico das Brumas entende a vaidade e o desejo das raças humanas, usando sua forma para se infiltrar em lendas e contos como uma divindade das águas, quando na verdade é uma mente fria focada na expansão de seu domínio.

Diferente de outras evoluções, ela possui uma vaidade intelectual única, decorando seu território com reflexos de si mesma. Aventureiros que entram em sua névoa frequentemente relatam ver uma figura feminina divina entre as árvores ou sob a superfície da água, apenas para serem atraídos para áreas onde o ar é rarefeito e a realidade é distorcida por sua vontade absoluta.`,
    type: 'Monstro médio, gosma',
    ac: '16',
    hp: '112 (15d8 + 45)',
    speed: '9m, natação 12m',
    stats: {
      forca: '10 (+0)',
      destreza: '18 (+4)',
      constituicao: '16 (+3)',
      inteligencia: '20 (+5)',
      sabedoria: '18 (+4)',
      carisma: '16 (+3)',
    },
    habilidades: [
      {
        nome: 'Imunidade',
        desc: 'Frio, Veneno, Cego, Envenenado, Exaustão, Caído, Preso, Agarrado.',
      },
      {
        nome: 'Resistência',
        desc: 'Ácido; Cortante, Perfurante e Concussão de armas não-mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Elétrico (A eletricidade se dispersa na névoa e sobrecarrega seu núcleo).',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Aquan e Telepatia 18 metros. Sua voz parece ecoar de todas as direções ao mesmo tempo.',
      },
      {
        nome: 'Aura de miragem',
        desc: 'Uma névoa constante de 6 metros de raio rodeia o Místico. Essa área é considerada de cobertura leve para aliados e terreno difícil para inimigos. Além disso, qualquer criatura que atacar o Místico enquanto estiver na névoa tem desvantagem no ataque, a menos que possua visão verdadeira.',
      },
      {
        nome: 'Reflexo psiquico',
        desc: 'Quando o Místico for alvo de um ataque que cause dano Psíquico ou tente ler sua mente, o conjurador deve passar em uma RES de Inteligência (CD 16). Se falhar, sofre o dano em vez do Místico e fica Atordoado até o final do próximo turno dele.',
      },
      {
        nome: 'Comandante do nevoeiro',
        desc: 'Slimes do Caminho Selvagem a até 18 metros ganham a habilidade de usar a ação de Esconder-se como uma ação bônus enquanto estiverem dentro de qualquer tipo de névoa ou fumaça.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Místico das Brumas realiza dois ataques de Jato de Pressão Mental ou usa sua habilidade Fractais de Névoa.',
      },
      {
        nome: 'Jato de pressão mental',
        desc: 'Ataque à Distância Mágico: +9 para acertar, alcance 18m. Dano: 14 (2d8 + 5) de dano de frio mais 7 (2d6) de dano psíquico. O alvo deve passar em uma RES de Sabedoria (CD 16) ou perderá a reação até o início do próximo turno do Místico.',
      },
      {
        nome: 'Fractais de névoa (Recarga 5t)',
        desc: 'O Místico cria 3 duplicatas ilusórias de si mesmo ou de um aliado em pontos que ele possa ver dentro de sua Aura de Miragem. As duplicatas têm 1 PV, a mesma CA do Místico e podem realizar um ataque visual que causa 2d6 de dano psíquico (RES de Inteligência CD 16 para anular) antes de desaparecerem.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo de Água Argentada',
      },
      {
        range: '2',
        item: 'Fragmento de Lente Astral',
      },
      {
        range: '3',
        item: 'Essência de Névoa Estática',
      },
      {
        range: '4',
        item: 'Véu do Esquecimento',
      },
    ],
  },
  escultorDeFrio: {
    name: 'Escultor de frio',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/fH3uIJO.png',
    image: 'https://2img.net/i.imgur.com/yTKkuJW.jpeg',
    subtitle: 'CR 8',
    description: `A Escultora de Frio representa o ápice da sofisticação entre as criaturas gélidas do caminho intelectual. Ao atingir o nível 10, esta entidade transcende sua forma amorfa para assumir uma silhueta feminina de elegância arrebatadora, esculpida em gelo cristalino e neve compactada. Sua aparência é cativante e perigosa, parecendo uma deusa do inverno saída direto de uma lenda isekai, usando sua beleza gelada como uma distração fatal.

Sua inteligência superior não é voltada apenas para a destruição, mas para a perfeição estética. A Escultora de Frio não vê seus inimigos como ameaças, mas como matéria-prima para sua arte mórbida. Ela utiliza suas habilidades táticas para encurralar e congelar oponentes em poses de angústia, transformando-os em estátuas eternas para decorar seu domínio glacial. Sua obsessão pela beleza fria é tão grande que ela comanda grupos de slimes selvagens para organizar o campo de batalha antes do confronto final, garantindo que o cenário seja digno de sua intervenção.

Aqueles que encontram uma Escultora de Frio são frequentemente atraídos por sua forma magnífica e brilho prismático, apenas para serem vítimas de sua aura de zero absoluto. Elas são as governantes incontestáveis dos picos gelados e das masmorras de cristal, onde a beleza e a morte caminham de mãos dadas sob a luz refletida em seus corpos impecáveis.`,
    type: 'Monstro médio, gosma',
    ac: '18',
    hp: '120 (16d8 + 48)',
    speed: '9m, escalada 9m',
    stats: {
      forca: '10 (+0)',
      destreza: '16 (+3)',
      constituicao: '16 (+3)',
      inteligencia: '22 (+6)',
      sabedoria: '16 (+3)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Imunidade',
        desc: 'Frio, Veneno, Cego, Envenenado, Exaustão, Caído, Preso, Agarrado.',
      },
      {
        nome: 'Absorção',
        desc: 'Sempre que o Escultor de Frio for alvo de dano de Frio, ele não sofre dano. Em vez disso, ele pode criar instantaneamente uma escultura de gelo de si mesmo em um espaço adjacente (atuando como a magia Imagem Espelhada para um ataque) e recupera 15 Pontos de Vida.',
      },
      {
        nome: 'Resistência',
        desc: 'Cortante, Perfurante e Concussão de armas não-mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Fogo, Concussão (Impactos pesados quebram sua estrutura).',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Glacial e Telepatia 18 metros. Sua comunicação é precisa e soa como o estalar de gelo fino.',
      },
      {
        nome: 'Aura de zero absoluto',
        desc: 'O ar ao redor do Escultor é tão frio que o chão em um raio de 6 metros é considerado terreno difícil. Criaturas inimigas que começarem o turno na aura têm sua velocidade reduzida em 3 metros até o início do próximo turno.',
      },
      {
        nome: 'Fractais Defensivo',
        desc: 'O corpo do Escultor é composto por milhares de facetas de gelo prismático. Se um ataque à distância errar o Escultor por 5 ou mais, o projétil (ou raio) é refletido de volta para o atacante, usando o mesmo bônus de acerto do ataque original.',
      },
      {
        nome: 'Arquiteto de cristais',
        desc: 'O Escultor pode manipular o gelo no campo de batalha. Ele pode usar uma ação bônus para erguer uma parede de gelo (1,5m de largura por 3m de altura) em qualquer lugar dentro de sua Aura de Zero Absoluto. A parede tem CA 12 e 15 PV.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Escultor de Frio realiza três ataques de Estalactite Prismática ou usa sua habilidade Esculpir Prisão.',
      },
      {
        nome: 'Estalactite prismática',
        desc: 'Ataque à Distância Mágico: +9 para acertar, alcance 18m. Dano: 10 (1d8 + 6) de dano de frio mais 7 (2d6) de dano perfurante. Se o alvo for atingido por dois desses ataques no mesmo turno, ele fica Incapacitado pelo frio extremo até o fim do próximo turno do Escultor.',
      },
      {
        nome: 'Esculpir prisão (Recarga 5t)',
        desc: 'O Escultor foca sua vontade em uma criatura que ele possa ver a até 12 metros. O gelo começa a crescer rapidamente ao redor do alvo. O alvo deve fazer uma RES de Destreza (CD 17). Falha: 32 (8d6 + 4) de dano de frio e a criatura fica Impedida e Atordoada dentro de um bloco de gelo sólido. A criatura (ou um aliado) pode usar uma ação para fazer um teste de Força (CD 17) para quebrar o gelo. Sucesso: Metade do dano e não sofre as condições.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Cinzel de Gelo Eterno',
      },
      {
        range: '2',
        item: 'Fragmento de Lente Glacial',
      },
      {
        range: '3',
        item: 'Coração de Inverno Condensado',
      },
      {
        range: '4',
        item: 'Pó de Diamante Refratário',
      },
    ],
  },
  arquitetoDeBarro: {
    name: 'Arquiteto de barro',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/tYTAk9u.png',
    image: 'https://2img.net/i.imgur.com/Q9H80hR.jpeg',
    subtitle: 'CR 8',
    description: `O Arquiteto de Barro é a personificação da ordem e da construção dentro do ecossistema dos slimes. Enquanto o Slime de Geodo apenas acumulava minerais de forma caótica, o Arquiteto utiliza sua inteligência superior para transmutar seu próprio corpo e o solo ao redor em cerâmica temperada e estruturas arquitetônicas complexas. Sua forma masculina e imponente projeta uma aura de autoridade inabalável, agindo como o pilar central de qualquer colônia de criaturas terrestres.

Sua mente funciona como a de um engenheiro militar. Ele não apenas ataca; ele fortifica. Em batalha, o Arquiteto de Barro molda o campo para garantir vantagem tática, erguendo barreiras e pilares que isolam os inimigos enquanto protege seus aliados menos inteligentes com armaduras de argila. Ele vê o campo de batalha como uma planta baixa que precisa ser corrigida, e os invasores como detritos que devem ser removidos ou soterrados.

Extremamente territoriais, esses seres costumam construir verdadeiras cidadelas subterrâneas ou templos de barro em locais ricos em mana telúrica. Sua presença é frequentemente confundida com a de divindades da terra por tribos locais, devido à sua capacidade de erguer estruturas permanentes em questão de segundos. No entanto, sua natureza é puramente pragmática: ele constrói para dominar, e sua força física é tão avassaladora quanto a própria terra que ele comanda.`,
    type: 'Monstro médio, gosma',
    ac: '19',
    hp: '142 (15d10 + 60)',
    speed: '9m, escavação 6m',
    stats: {
      forca: '20 (+5)',
      destreza: '8 (-1)',
      constituicao: '18 (+4)',
      inteligencia: '20 (+5)',
      sabedoria: '14 (+2)',
      carisma: '12 (+1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Arquiteto de Barro for alvo de dano de Terra ou Esmagamento de origem mágica telúrica, ele não sofre dano. Em vez disso, ele pode restaurar sua armadura natural (ganhando 15 PV temporários) ou recuperar 15 Pontos de Vida.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Elétrico (O barro o aterra), Cego, Envenenado, Exaustão, Caído, Preso, Agarrado.',
      },
      {
        nome: 'Resistência',
        desc: 'Perfurante e Cortante de armas não-mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Ácido (Corrói a estrutura da argila).',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Terran e Dialeto das Montanhas. Sua voz é profunda e ressoa como pedras se chocando.',
      },
      {
        nome: 'Mestre de fortificações',
        desc: 'Aliados do Caminho Selvagem em um raio de 9 metros do Arquiteto ganham +2 na CA e vantagem em testes de resistência de Força, pois o Arquiteto molda o solo sob seus pés para dar estabilidade.',
      },
      {
        nome: 'Corpo de ceramica temperada',
        desc: 'Sempre que o Arquiteto sofrer dano de Fogo, sua CA aumenta em +1 (máximo de +3) até o final do combate, conforme seu corpo de barro é cozido e endurecido.',
      },
      {
        nome: 'Monstro de cerco',
        desc: 'O Arquiteto causa o dobro de dano a objetos e estruturas.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Arquiteto de Barro realiza dois ataques de Martelo de Terracota ou usa sua habilidade Reestruturação Tectônica.',
      },
      {
        nome: 'Martelo de terracota',
        desc: 'Ataque Corpo a Corpo: +8 para acertar, alcance 3m. Dano: 18 (3d8 + 5) de dano de concussão. O alvo deve passar em uma RES de Força (CD 16) ou será empurrado 3 metros e ficará Caído.',
      },
      {
        nome: 'Reestruturação Tectonica (Recarga 5t)',
        desc: 'O Arquiteto golpeia o solo, fazendo com que pilares de argila endurecida surjam sob seus inimigos em um raio de 9 metros. Até 3 criaturas à escolha do Arquiteto devem passar em uma RES de Destreza (CD 16). Falha: 32 (6d8 + 5) de dano de concussão e a criatura é lançada 4,5 metros para cima, ficando Presa em um pilar de barro que surge do chão. Sucesso: Metade do dano e não fica presa.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Pedra Angular Senciente',
      },
      {
        range: '2',
        item: 'Geodo Coração da Terra',
      },
      {
        range: '3',
        item: 'Selo do Construtor Alquímico',
      },
      {
        range: '4',
        item: 'Pó de Barro Primordial',
      },
    ],
  },
  pulsoDeSilicio: {
    name: 'Pulso de silício',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/FmRF7WT.png',
    image: 'https://2img.net/i.imgur.com/jr9eunN.jpeg',
    subtitle: 'CR 8',
    description: `O Pulso de Silício é o ápice da evolução tática e cognitiva entre as criaturas elementais. Ao atingir o nível 10, o antigo Slime Magnético deixa de ser um simples condutor de energia para se tornar um computador biológico vivo. Sua forma assume uma silhueta humanoide atlética e imponente, envolta em placas de silício flutuantes que funcionam tanto como armadura quanto como unidades de processamento externo para sua mente vasta.

A inteligência de um Pulso de Silício é fria, lógica e extremamente rápida. Ele não apenas comanda grupos de slimes selvagens; ele os conecta em uma rede neural, agindo como o núcleo de processamento que coordena cada movimento com precisão de milissegundos. No campo de batalha, ele é capaz de ler os impulsos elétricos nos nervos de seus oponentes, antecipando golpes antes mesmo que o atacante os execute.

Ele prefere locais com alta concentração de minerais condutores ou ruínas de civilizações antigas que possuam tecnologia esquecida. Onde um Pulso de Silício se estabelece, o ambiente se torna hostil para qualquer coisa metálica: armas são arrancadas das mãos, armaduras se tornam prisões magnéticas e a própria eletricidade estática no ar se torna uma arma mortal. Enfrentar um Pulso de Silício é como tentar lutar contra um sistema operacional que já calculou todas as suas chances de vitória e as reduziu a zero.`,
    type: 'Monstro médio, gosma',
    ac: '17',
    hp: '110 (17d8 + 34)',
    speed: '9m, flutuar 12m',
    stats: {
      forca: '8 (-1)',
      destreza: '20 (+5)',
      constituicao: '14 (+2)',
      inteligencia: '24 (+7)',
      sabedoria: '16 (+3)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Pulso de Silício for alvo de dano Elétrico, ele não sofre dano. Em vez disso, ele processa essa energia para sobrecarregar seus circuitos, ganhando uma ação bônus adicional em seu próximo turno e recuperando 15 Pontos de Vida.',
      },
      {
        nome: 'Imunidade',
        desc: 'Elétrico, Veneno, Psíquico (Sua mente é digitalizada), Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Enfeitiçado.',
      },
      {
        nome: 'Resistência',
        desc: 'Cortante, Perfurante e Concussão de armas não-mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Terra (O aterramento dissipa sua coesão).',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos os idiomas conhecidos pelas criaturas em um raio de 18 metros, Telepatia Digital 36 metros.',
      },
      {
        nome: 'Rede neural de comando',
        desc: 'Slimes do Caminho Selvagem a até 18 metros do Pulso de Silício compartilham seus sentidos com ele. Se um deles vir um inimigo, o Pulso de Silício também o vê. Além disso, esses slimes podem usar o modificador de Inteligência do Pulso de Silício para seus testes de resistência mentais.',
      },
      {
        nome: 'Campo de distorção estática',
        desc: 'Projéteis metálicos (flechas com ponta de ferro, facas, etc.) que entrarem em um raio de 3 metros do Pulso de Silício têm desvantagem nas jogadas de ataque devido à forte repelência magnética.',
      },
      {
        nome: 'Processamento paralelo',
        desc: 'O Pulso de Silício pode manter a concentração em duas magias ou habilidades diferentes simultaneamente. Se ele sofrer dano, faz apenas um teste de resistência de Constituição para manter ambas.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Pulso de Silício realiza três ataques de Descarga de Fótons ou usa sua habilidade Sobrecarga Sináptica.',
      },
      {
        nome: 'Descarga de fótons',
        desc: 'Ataque à Distância Mágico: +10 para acertar, alcance 27m. Dano: 16 (2d8 + 7) de dano elétrico. Se o alvo estiver usando armadura de metal, a jogada de ataque tem vantagem.',
      },
      {
        nome: 'Sobrecarga Sináptica (Recarga 5t)',
        desc: 'O Pulso envia um código de erro diretamente para o sistema nervoso de até 3 criaturas que ele possa ver a até 18 metros. Os alvos devem passar em uma RES de Inteligência (CD 18). Falha: 31 (7d8) de dano psíquico e a criatura fica Atordoada até o final do próximo turno do Pulso de Silício. Sucesso: Metade do dano e não fica atordoada.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '36m',
    },
    drops: [
      {
        range: '1',
        item: 'Placa de Circuito Orgânico',
      },
      {
        range: '2',
        item: 'Filamento de Cobre Vivo',
      },
      {
        range: '3',
        item: 'Núcleo de Processamento Vítreo',
      },
      {
        range: '4',
        item: 'Capacitor de Estática Pura',
      },
    ],
  },
  automatoFluido: {
    name: 'Autômato fluído',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/xdMsPd9.png',
    image: 'https://2img.net/i.imgur.com/pS195eL.jpeg',
    subtitle: 'CR 8',
    description: `O Autômato Fluído é a culminação da maestria sobre a forma física e a lógica de combate. Diferente do Slime de Latão, que possuía uma estrutura mais rígida e limitada, o Autômato atingiu um estado de metal líquido perfeitamente controlado por uma mente processadora superior. Sua aparência lembra uma escultura de mercúrio vivo adornada com veios de latão polido, movendo-se com uma graça silenciosa que desmente seu peso massivo e densidade molecular.

Como um líder nato do caminho intelectual, ele não luta por instinto, mas por pura eficiência tática. Ele é capaz de analisar o estilo de combate de um oponente em frações de segundo, moldando seus membros em lâminas perfeitamente equilibradas ou martelos de impacto pesado para explorar fraquezas específicas na armadura ou na guarda do inimigo. Sua presença em uma colônia de slimes metálicos transforma um grupo desorganizado em uma falange coordenada e impenetrável, onde ele atua como o oficial comandante.

Aventureiros que sobrevivem a um encontro com um Autômato Fluído descrevem a sensação aterrorizante de lutar contra um oponente que não pode ser cortado ou quebrado, pois o metal líquido simplesmente flui ao redor das armas e se regenera instantaneamente. Ele não demonstra emoção, fúria ou cansaço, mantendo uma determinação fria e calculista até que o objetivo seja alcançado ou a ameaça seja totalmente eliminada.`,
    type: 'Monstro médio, constructo',
    ac: '20',
    hp: '136 (16d8 + 64)',
    speed: '9m, natação 9m',
    stats: {
      forca: '20 (+5)',
      destreza: '14 (+2)',
      constituicao: '18 (+4)',
      inteligencia: '22 (+6)',
      sabedoria: '14 (+2)',
      carisma: '12 (+1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Autômato Fluído for alvo de dano de Concussão, ele não sofre dano. Em vez disso, ele absorve a energia do impacto, ganhando vantagem em sua próxima jogada de ataque e recuperando 15 Pontos de Vida.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Psíquico, Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Petrificado, Paralisado.',
      },
      {
        nome: 'Resistência',
        desc: 'Cortante e Perfurante de armas não-mágicas; Fogo, Frio, Elétrico.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Ácido (Corrói a liga metálica).',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto das Máquinas e Telepatia 18 metros. Sua voz soa como o atrito de metais polidos.',
      },
      {
        nome: 'Forma de mercurio',
        desc: 'O Autômato pode se mover através de um espaço de até 2,5 centímetros de largura sem se espremer. Ele não provoca ataques de oportunidade ao se mover, pois sua forma flui ao redor das armas inimigas.',
      },
      {
        nome: 'Arsenal integrado',
        desc: 'O Autômato pode transformar seus membros em qualquer ferramenta artesanal ou arma simples/marcial como uma ação bônus. Ele é considerado proficiente com qualquer arma que crie desta forma.',
      },
      {
        nome: 'Cálculo de trajetória',
        desc: 'Aliados do Caminho Selvagem a até 9 metros do Autômato recebem um bônus de +2 em suas jogadas de dano, pois o Autômato emite sinais sonoros que indicam os pontos vitais dos inimigos.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Autômato Fluído realiza três ataques de Lâmina de Liga ou usa sua habilidade Esmagamento Hidráulico.',
      },
      {
        nome: 'Lâmina de liga',
        desc: 'Ataque Corpo a Corpo: +9 para acertar, alcance 3m. Dano: 14 (2d8 + 5) de dano cortante. Se o alvo for uma criatura, ela deve passar em uma RES de Constituição (CD 17) ou sofrerá 3 (1d6) de dano extra no início de cada um de seus turnos por sangramento metálico (feridas que não fecham facilmente).',
      },
      {
        nome: 'Esmagamento hidraulico (Recarga 5t)',
        desc: 'O Autômato transforma parte de seu corpo em uma prensa maciça e golpeia o chão. Cada criatura em um raio de 4,5 metros deve passar em uma RES de Força (CD 17). Falha: 36 (8d8) de dano de concussão e a criatura fica Caída e Atordoada até o final do próximo turno do Autômato. Sucesso: Metade do dano e não sofre as condições.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo de Mercúrio Estável',
      },
      {
        range: '2',
        item: 'Pistão Alquímico de Latão',
      },
      {
        range: '3',
        item: 'Óleo de Transmissão Pensante',
      },
      {
        range: '4',
        item: 'Placa de Aço Líquido Temperado',
      },
    ],
  },
  espectroDeEctoplasma: {
    name: 'Espectro de ectoplasma',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/1EMfnpe.png',
    image: 'https://2img.net/i.imgur.com/MrJ2muE.jpeg',
    subtitle: 'CR 8',
    description: `O Espectro de Ectoplasma é o ápice da ascensão de um Slime das Sombras que abandonou completamente a necessidade de uma âncora material. Ao atingir o nível 10, esta entidade transcende o plano físico, tornando-se uma criatura puramente espiritual composta de ectoplasma de alta densidade e pura energia abissal. No caminho intelectual, ela assume uma silhueta feminina imponente e espectral, quase como uma rainha esquecida de um reino de desolação, usando sua aparência para exalar autoridade e medo.

Sua inteligência é vasta, fria e focada na dominação tática através da necromancia e do terror. Ela atua como a Tecelã de Almas, coordenando vastas hordas de slimes selvagens e outros mortos-vivos menores como uma mente de colmeia. Onde ela flutua, a temperatura cai instantaneamente para níveis congelantes, e o próprio ar se torna pesado com os sussurros psíquicos de suas vítimas passadas, cujos rostos angunstiados podem ser vistos vagando dentro de sua forma translúcida.

Em combate, ela é uma estrategista implacável que prefere manipular o campo de batalha de uma posição segura. Ela utiliza suas correntes etéreas para imobilizar e drenar a vida dos guerreiros mais fortes, enquanto sua presença desoladora quebra a moral dos conjuradores. Ela não deseja apenas a morte de seus oponentes, mas a erradicação de sua existência e a adição de suas almas à sua legião fantasma pessoal.`,
    type: 'Monstro médio, espectro',
    ac: '16',
    hp: '110 (17d8 + 34)',
    speed: '0m, voo 12m',
    stats: {
      forca: '6 (-2)',
      destreza: '18 (+4)',
      constituicao: '14 (+2)',
      inteligencia: '22 (+6)',
      sabedoria: '18 (+4)',
      carisma: '20 (+5)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Espectro de Ectoplasma for alvo de dano Necrótico ou Gélido, ele não sofre dano. Em vez disso, ele pode usar sua reação para se tornar invisível até o final do seu próximo turno e recuperar 15 Pontos de Vida.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Necrótico, Gélido; Concussão, Perfurante e Cortante de ataques não-mágicos, Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Paralisado, Petrificado.',
      },
      {
        nome: 'Resistência',
        desc: 'Ácido, Fogo, Trovão; Psíquico.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Radiante.',
      },
      {
        nome: 'Idiomas',
        desc: 'Entende todos os idiomas, mas se comunica apenas via Telepatia Sombria (18 metros). Sua voz mental soa como múltiplos sussurros sobrepostos.',
      },
      {
        nome: 'Mestre de marionetes etéreas',
        desc: 'Slimes do Caminho Selvagem a até 18 metros do Espectro ganham a habilidade de Movimento Incorpóreo (podem passar por criaturas e objetos como se fossem terreno difícil). Além disso, eles causam 1d6 de dano necrótico adicional em seus ataques.',
      },
      {
        nome: 'Presença desoladora',
        desc: 'Criaturas inimigas que comecem o turno a até 6 metros do Espectro devem passar em uma RES de Sabedoria (CD 16) ou ficarão Aterrorizadas até o início do próximo turno do Espectro. Enquanto aterrorizadas, a velocidade delas é reduzida a 0.',
      },
      {
        nome: 'Vazio cognitivo',
        desc: 'O Espectro é imune a qualquer efeito que tente ler suas emoções ou pensamentos. Qualquer criatura que tente contato mental com o Espectro sofre 10 (3d6) de dano psíquico.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Espectro de Ectoplasma realiza dois ataques de Toque do Além ou usa sua habilidade Corrente de Almas.',
      },
      {
        nome: 'Toque do além',
        desc: 'Corpo a Corpo Mágico: +9 para acertar, alcance 1m. Dano: 13 (2d6 + 6) de dano necrótico mais 7 (2d6) de dano gélido. O alvo deve passar em uma RES de Constituição (CD 16) ou terá seu máximo de Pontos de Vida reduzido em um valor igual ao dano necrótico sofrido. Esta redução dura até um descanso longo.',
      },
      {
        nome: 'Corrente de almas (Recarga 5t)',
        desc: 'O Espectro dispara correntes de ectoplasma translúcido em até 3 criaturas a até 9 metros. Cada alvo deve passar em uma RES de Carisma (CD 16). Falha: 28 (8d6) de dano necrótico e o Espectro drena a energia vital, ganhando 10 pontos de vida temporários por cada falha. A criatura fica Impedida enquanto a corrente persistir (o Espectro deve manter concentração). Sucesso: Metade do dano e não fica impedida.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: '36m, visão etérea 9m',
    },
    drops: [
      {
        range: '1',
        item: 'Ectoplasma Estabilizado',
      },
      {
        range: '2',
        item: 'Fragmento de Núcleo de Alma',
      },
      {
        range: '3',
        item: 'Manto de Névoa Funesta',
      },
      {
        range: '4',
        item: 'Olho de Observador Espectral',
      },
    ],
  },
  sabioDeCristal: {
    name: 'Sábio de Cristal',
    rarity: 'Super Raro',
    icon: 'https://2img.net/i.imgur.com/1ubwljd.png',
    image: 'https://2img.net/i.imgur.com/Kn8xDLm.jpeg',
    subtitle: 'CR 14',
    description: `O Sábio de Cristal é a culminação de milênios de processamento alquímico e evolução cognitiva. Ao atingir o nível 15, o antigo Homúnculo de Gel transcende as limitações da biologia convencional, fundindo sua massa ácida com estruturas cristalinas de pureza absoluta. Ele não é apenas um líder; ele é o centro de processamento de uma colmeia inteira, capaz de ditar leis químicas e físicas em seu domínio.

Sua aparência é de uma elegância aterrorizante. O corpo, embora ainda fluido em sua base, é sustentado por uma armadura de cristais esmeralda que crescem e se retraem conforme sua vontade. Ele não se move como uma criatura viva, mas sim flutua com uma calma gélida, cercado por uma névoa ácida que dissolve a matéria orgânica antes mesmo que ela possa tocá-lo. O Sábio de Cristal possui uma compreensão tão profunda da transmutação que ele vê o mundo como um conjunto de equações a serem resolvidas — ou apagadas.

Encontrar um Sábio de Cristal é enfrentar um estrategista que já previu cada movimento do seu grupo antes mesmo do combate começar. Ele utiliza sua inteligência de nível sobre-humano para manipular a realidade ao seu redor, criando barreiras de cristal e disparando rajadas de vitríolo que podem desintegrar aço em segundos. Para ele, os aventureiros não são heróis, mas apenas reagentes químicos em um experimento de dissolução em larga escala.`,
    type: 'Monstro grande, gosma',
    ac: '20',
    hp: '230 (20d12 + 100)',
    speed: '9m, natação 9m',
    stats: {
      forca: '18 (+4)',
      destreza: '12 (+1)',
      constituicao: '22 (+6)',
      inteligencia: '26 (+8)',
      sabedoria: '20 (+5)',
      carisma: '18 (+4)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Sábio de Cristal for alvo de dano Ácido ou Venenoso, ele não sofre dano. Em vez disso, ele pode escolher um efeito: criar um Slime Ácido (CR 1/2) num espaço adjacente ou recuperar 30 Pontos de Vida. Além disso, ele ganha uma carga de Alquimia Instável.',
      },
      {
        nome: 'Imunidade',
        desc: 'Ácido, Veneno, Psíquico, Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Enfeitiçado, Atordoado.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Frio, Elétrico; Cortante, Perfurante e Concussão de armas não-mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Trovão (Vibrações de alta frequência estilhaçam a sua estrutura cristalina).',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia 36 metros.',
      },
      {
        nome: 'Mestre da colmeia alquimica',
        desc: 'Todas as criaturas do Caminho Selvagem num raio de 30 metros partilham a inteligência do Sábio. Elas tornam-se imunes a serem enfeitiçadas e adicionam o bônus de Inteligência do Sábio (+8) às suas jogadas de dano.',
      },
      {
        nome: 'Refração de feitiços',
        desc: 'Se o Sábio de Cristal passar num teste de resistência contra uma magia que tenha apenas ele como alvo, ou se um ataque de magia à distância falhar contra ele, o Sábio pode refletir a magia de volta para o conjurador como uma reação, usando o CD ou bônus de ataque do próprio conjurador.',
      },
      {
        nome: 'Aura de vitríolo gasoso',
        desc: 'Uma névoa ácida e esverdeada flutua num raio de 6 metros ao redor do Sábio. Qualquer criatura que comece o seu turno na área sofre 14 (4d6) de dano ácido e deve passar numa RES de Constituição (CD 19) ou ficará Cega até ao início do seu próximo turno.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Sábio de Cristal realiza três ataques de Tentáculo de Vidro Ácido ou usa a sua habilidade Geometria da Dissolução.',
      },
      {
        nome: 'Tentáculo de vidro ácido',
        desc: 'Ataque Corpo a Corpo: +11 para acertar, alcance 4m. Dano: 17 (2d8 + 8) de dano de concussão mais 18 (4d8) de dano ácido. O alvo deve passar numa RES de Força (CD 19) ou ficará Agarrado (CD de escape 19). Enquanto estiver agarrada, a criatura sofre 10 de dano ácido no início de cada um dos seus turnos.',
      },
      {
        nome: 'Geometria da dissolução (Recarga 5t)',
        desc: 'O Sábio projeta uma rede de cristais líquidos que explode num raio de 9 metros. Cada criatura na área deve passar numa RES de Destreza (CD 19). Falha: 54 (12d8) de dano ácido e a armadura ou arma da criatura sofre uma penalidade permanente de -2 (cumulativo). Se a armadura chegar a CA 10 ou a arma a 0 de dano, o item é dissolvido. Sucesso: Metade do dano e nenhum efeito nos equipamentos.',
      },
      {
        nome: 'Análise analitica',
        desc: 'O Sábio foca num inimigo que ele possa ver. Até ao início do seu próximo turno, o Sábio e todos os seus aliados têm vantagem em jogadas de ataque contra essa criatura.',
      },
      {
        nome: 'Deslocamento de fase cristalina',
        desc: 'O Sábio teletransporta-se para um espaço vazio a até 12 metros, deixando para trás uma nuvem de estilhaços de vidro que causa 10 de dano perfurante a criaturas a até 1 metro do ponto de origem.',
      },
      {
        nome: 'Catalisador de evolução (custa 2 ações)',
        desc: 'O Sábio toca num aliado do Caminho Selvagem. O aliado recupera 20 PV e ganha um ataque adicional no seu próximo turno.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '15',
      visaoEscuro: '36',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo de Cristal Filosófico',
      },
      {
        range: '2',
        item: 'Sangue de Mercúrio Alquímico',
      },
      {
        range: '3',
        item: 'Membrana de Reação Adaptativa',
      },
      {
        range: '4',
        item: 'Olho de Lente de Sílica Pura',
      },
    ],
  },
  elementalDaForja: {
    name: 'Elemental da Forja',
    rarity: 'Super Raro',
    icon: 'https://2img.net/i.imgur.com/uATBkjY.png',
    image: 'https://2img.net/i.imgur.com/QGrvi2Z.jpeg',
    subtitle: 'Cr 14',
    description: `O Elemental da Forja é a autoridade máxima sobre a matéria e a energia térmica. Enquanto o Artífice de Vidro era um mestre da escultura, o Elemental da Forja é o arquiteto que dita como a própria realidade deve ser fundida e moldada. Ele não apenas habita vulcões ou forjas; ele se torna o próprio coração do sistema produtivo, capaz de processar toneladas de minérios e informações simultaneamente com sua inteligência de nível lendário.

Sua presença é majestosa e opressora. O corpo é um equilíbrio perfeito entre a fluidez do magma e a rigidez do vidro temperado, protegido por placas de obsidiana que ele mesmo forja em sua própria pele. Diferente de feras de fogo comuns, o Elemental da Forja não queima tudo ao seu redor por instinto; ele escolhe exatamente o que deve ser derretido e o que deve ser preservado. Ele vê o campo de batalha como uma oficina desordenada, onde os inimigos são apenas impurezas a serem removidas do metal final.

Em combate, ele atua como um comandante absoluto. Ele utiliza suas lentes de vidro flutuantes para focar o calor em feixes precisos, enquanto coordena slimes menores para flanquear e imobilizar alvos. Aqueles que o enfrentam não estão apenas lutando contra uma criatura de fogo, mas contra uma mente que compreende a estrutura molecular de cada arma e armadura que os aventureiros carregam. Para o Elemental da Forja, a guerra é apenas mais uma forma de artesanato, onde o resultado final é sempre a perfeição através do fogo purificador.`,
    type: 'Monstro Grande, gosma',
    ac: '21',
    hp: '225 (18d12 + 108)',
    speed: '9 metros, escalada 9 metros',
    stats: {
      forca: '22 (+6)',
      destreza: '12 (+1)',
      constituicao: '22 (+6)',
      inteligencia: '26 (+8)',
      sabedoria: '16 (+3)',
      carisma: '16 (+3)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Elemental da Forja for alvo de dano de Fogo, ele não sofre dano. Em vez disso, ele recupera 30 Pontos de Vida e seu corpo brilha com calor intenso, causando 10 (3d6) de dano de fogo extra em todos os seus ataques até o final de seu próximo turno.',
      },
      {
        nome: 'Imunidades',
        desc: 'Fogo, Veneno, Radiante; Cortante, Perfurante e Concussão de armas não-mágicas. Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Atordoado, Paralisado.',
      },
      {
        nome: 'Resistência',
        desc: 'Frio, Elétrico, Psíquico',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Trovão (O som quebra sua estrutura de vidro resfriada).',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Ígneo, Dialeto das Montanhas e Telepatia 36 metros',
      },
      {
        nome: 'Mestre da fundição',
        desc: 'Slimes do Caminho Selvagem a até 18 metros ganham resistência a dano de fogo e suas armas naturais passam a causar 1d10 de dano de fogo adicional. Além disso, eles não podem ser flanqueados enquanto o Elemental da Forja estiver consciente.',
      },
      {
        nome: 'Calor de evento solar',
        desc: 'Qualquer criatura que comece seu turno a até 3 metros do Elemental da Forja sofre 14 (4d6) de dano de fogo. Projéteis não-mágicos que entrarem nesta área são derretidos instantaneamente e o ataque falha.',
      },
      {
        nome: 'Mente de forja paralela',
        desc: 'O Elemental pode processar múltiplas táticas simultaneamente. Ele tem vantagem em testes de resistência de Inteligência, Sabedoria e Carisma. Ele pode realizar uma reação adicional por rodada.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multi-ataque',
        desc: 'O Elemental da Forja realiza três ataques: um de Martelo de Magma e dois de Lâmina de Obsidiana, ou usa sua habilidade Estouro do Alto-Forno.',
      },
      {
        nome: 'Martelo de Magma',
        desc: 'Ataque Corpo a Corpo: +11 para acertar, alcance 4m. Dano: 24 (4d8 + 6) de dano de concussão mais 14 (4d6) de dano de fogo. O alvo deve passar em uma RES de Força (CD 19) ou será arremessado 6 metros e ficará Caído.',
      },
      {
        nome: 'Lâmina de obsidiana',
        desc: 'Ataque Corpo a Corpo: +11 para acertar, alcance 3m. Dano: 16 (3d6 + 6) de dano cortante mais 7 (2d6) de fogo. Se o alvo estiver usando armadura de metal, o ataque ganha +2 de bônus no acerto.',
      },
      {
        nome: 'Estouro do alto-forno (recarga 5t)',
        desc: 'O Elemental libera uma explosão de pressão e fogo em um raio de 9 metros. Cada criatura na área deve passar em uma RES de Constituição (CD 19). Falha: 56 (16d6) de dano de fogo e a criatura fica Cega e Incapacitada até o final do seu próximo turno pela dor extrema. Armaduras e armas metálicas na área ficam em brasa (efeito da magia Esquentar Metal por 1 rodada). Sucesso: Metade do dano e não sofre as condições.',
      },
      {
        nome: 'Reparar estrutura',
        desc: 'O Elemental consome parte de seu calor interno para recuperar 20 PV.',
      },
      {
        nome: 'Comando do Artífice',
        desc: 'Um aliado do caminho selvagem que o Elemental possa ver pode usar sua reação para realizar um ataque ou mover-se metade de seu deslocamento.',
      },
      {
        nome: 'Lente de refração (2 ações)',
        desc: 'O Elemental cria um escudo de vidro flutuante. Até o início de seu próximo turno, ele ganha +3 na CA e resistência a dano Radiante e Elétrico.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '36',
    },
    drops: [
      {
        range: '1',
        item: 'Bigorna de Fogo Eterno',
      },
      {
        range: '2',
        item: 'Núcleo de Sol Aprisionado',
      },
      {
        range: '3',
        item: 'Lente de Obsidiana Perfeita',
      },
      {
        range: '4',
        item: 'Resíduo de Aço Primordial',
      },
    ],
  },
  arcanistaDeVapor: {
    name: 'Arcanista de vapor',
    rarity: 'Super raro',
    icon: 'https://2img.net/i.imgur.com/0gHFEAu.png',
    image: 'https://2img.net/i.imgur.com/7CRj8JS.jpeg',
    subtitle: 'CR 14',
    description: `A Arcanista de Vapor é a senhora absoluta da termodinâmica e da ilusão, o Místico das Brumas transcende a simples névoa para dominar o poder da pressão e do calor extremo. Ela assume uma forma feminina majestosa e imponente, esculpida em água fervente e vapor pressurizado. Essa aparência é uma escolha tática: uma silhueta que evoca autoridade e fascínio, enquanto esconde uma mente capaz de processar milhares de variáveis atmosféricas por segundo.

Sua inteligência permite que ela controle cada molécula de ar ao seu redor. Onde a Arcanista caminha, o oxigênio se torna pesado e quente, e a realidade se dobra através de miragens perfeitas. Ela não apenas lidera os slimes do caminho selvagem; ela os utiliza como extensões de seus próprios sentidos, coordenando ataques com a precisão de um relógio mecânico. Ela vê o campo de batalha como um sistema fechado onde ela é a única válvula de escape.

Aqueles que cometem o erro de se aproximar são rapidamente envolvidos por sua névoa escaldante, que derrete a pele e congela os pulmões simultaneamente através de paradoxos térmicos. Para a Arcanista de Vapor, os aventureiros são apenas pequenas flutuações de pressão em seu domínio perfeito, destinadas a serem condensadas ou dissipadas de acordo com sua vontade soberana. Sua voz, quando ouvida, é um coro de sussurros borbulhantes que parecem vir de dentro do próprio vapor que envolve suas vítimas.`,
    type: 'Monstro grande, gosma',
    ac: '19',
    hp: '+210 (20d12 + 80)',
    speed: '9 metros, natação 12 metros, voo 12 metros',
    stats: {
      forca: '12 (+1)',
      destreza: '20 (+5)',
      constituicao: '18 (+4)',
      inteligencia: '28 (+9)',
      sabedoria: '20 (+5)',
      carisma: '20 (+5)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Arcanista de Vapor for alvo de dano de Fogo ou Frio, ele não sofre dano. Em vez disso, ele processa a mudança de temperatura para fortalecer sua pressão interna. Ele recupera 25 Pontos de Vida e seu próximo ataque de Jato de Pressão causa 14 (4d6) de dano extra.',
      },
      {
        nome: 'Imunidade',
        desc: 'Fogo, Frio, Veneno; Cortante, Perfurante e Concussão de armas não-mágicas. Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Paralisado, Atordoado.',
      },
      {
        nome: 'Resistência',
        desc: 'Ácido, Elétrico, Psíquico.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Trovão (Vibrações sonoras colapsam a estabilidade do vapor).',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia 36 metros',
      },
      {
        nome: 'Mestre da atmosfera',
        desc: 'Todas as criaturas do Caminho Selvagem em um raio de 30 metros ganham a habilidade de se tornarem invisíveis enquanto estiverem dentro de névoa ou vapor. Além disso, elas recebem um bônus de +5 em sua Velocidade de deslocamento.',
      },
      {
        nome: 'Névoa Escaldante permanente',
        desc: 'O Arcanista é cercado por uma nuvem de vapor superaquecido em um raio de 9 metros. A área é considerada de cobertura pesada para inimigos. Qualquer criatura inimiga que comece seu turno na área sofre 10 (3d6) de dano de fogo e 10 (3d6) de dano de frio simultaneamente, devido à natureza instável do vapor arcano.',
      },
      {
        nome: 'Processamento de fluxo arcano',
        desc: 'O Arcanista pode conjurar duas magias de nível 3 ou inferior por turno (usando Inteligência) sem gastar espaços de magia. Ele tem vantagem em testes de resistência contra magias.',
      },
      {
        nome: 'Ações Lendárias',
        desc: 'Pode realizar até 3 ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Arcanista de Vapor realiza três ataques de Chicote de Água Pesada ou usa sua habilidade Explosão de Pressão Crítica.',
      },
      {
        nome: 'Chicote de água pesada',
        desc: 'Ataque Corpo a Corpo Mágico: +14 para acertar, alcance 6m. Dano: 19 (3d6 + 9) de dano de concussão mais 10 (3d6) de dano de frio. O alvo deve passar em uma RES de Força (CD 22) ou será puxado 4 metros em direção ao Arcanista e ficará Impedido.',
      },
      {
        nome: 'Explosão de pressão crítica (Recarga 5t)',
        desc: 'O Arcanista libera um jato de vapor de altíssima pressão em um cone de 18 metros. Cada criatura na área deve passar em uma RES de Constituição (CD 22). Falha: 63 (18d6) de dano de fogo e a criatura é arremessada 9 metros para trás, ficando Caída e Surda por 1 minuto. Sucesso: Metade do dano e não sofre as condições.',
      },
      {
        nome: 'Teleporte de condensação',
        desc: 'O Arcanista se dissolve em vapor e reaparece em um ponto vazio que possa ver a até 18 metros.',
      },
      {
        nome: 'Comando Gasoso',
        desc: 'Um aliado do caminho selvagem a até 18 metros pode realizar imediatamente um ataque ou usar a ação de Esconder-se.',
      },
      {
        nome: 'Refração de miragem (2 ações)',
        desc: 'O Arcanista cria duas duplicatas exatas de si mesmo feitas de vapor. Ataques contra ele têm desvantagem até que ele sofra dano ou até o início de seu próximo turno.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '15',
      visaoEscuro: '36, visão verdadeira 16',
    },
    drops: [
      {
        range: '1',
        item: 'Coração de Vapor Perpétuo',
      },
      {
        range: '2',
        item: 'Manto de Água Argentada',
      },
      {
        range: '3',
        item: 'Olho de Lente de Vapor',
      },
      {
        range: '4',
        item: 'Essência de Pressão Concentrada',
      },
    ],
  },
  guardiaoDaTundra: {
    name: 'Guardião da Tundra',
    rarity: 'Super raro',
    icon: 'https://2img.net/i.imgur.com/KXhuhz8.png',
    image: 'https://2img.net/i.imgur.com/UoSveKM.jpeg',
    subtitle: 'CR 14',
    description: `O Guardião da Tundra é a autoridade máxima sobre o frio e a luz. Ao atingir o nível 15, o antigo Escultor de Frio abandona a necessidade de ferramentas externas para moldar sua arte; ele se torna o próprio mestre da entropia. Sua forma assume uma silhueta feminina divina, majestosa e inabalável, esculpida em gelo adamantino — uma substância tão densa e pura que é praticamente indestrutível por meios convencionais.

Sua inteligência permite que ele compreenda a vibração atômica de tudo ao seu redor. Para o Guardião, o calor é uma imperfeição, um ruído que deve ser silenciado para que a perfeição estática do gelo prevaleça. Ele não apenas lidera colônias de slimes; ele transforma o bioma inteiro em uma extensão de sua consciência. Sob seu comando, o exército de slimes selvagens opera com uma sincronia assustadora, movendo-se como uma única avalanche coordenada.

Em combate, o Guardião da Tundra é uma força de controle absoluto. Ele manipula a luz através de seu corpo prismático para cegar e desintegrar oponentes, enquanto sua simples presença drena a energia vital de qualquer ser que dependa de calor para sobreviver. Ele não demonstra pressa ou raiva; cada movimento é um cálculo preciso destinado a transformar o campo de batalha em um mausoléu de cristal eterno. Enfrentar um Guardião é aceitar que a física, sob sua vontade, parou de funcionar a seu favor.`,
    type: 'Monstro grande, gosma',
    ac: '21',
    hp: '+240 (20d12 + 110)',
    speed: '9 metros, escalada 9 metros, natação 9 metros',
    stats: {
      forca: '16 (+3)',
      destreza: '14 (+2)',
      constituicao: '22 (+6)',
      inteligencia: '28 (+9)',
      sabedoria: '20 (+5)',
      carisma: '18 (+4)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Guardião for alvo de dano de Frio, ele não sofre dano. Em vez disso, ele recupera 30 Pontos de Vida e sua CA aumenta em +2 até o início do seu próximo turno, conforme ele condensa novas camadas de proteção.',
      },
      {
        nome: 'Imunidade',
        desc: 'Frio, Veneno, Psíquico; Cortante e Perfurante de armas não-mágicas. Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Atordoado, Paralisado.',
      },
      {
        nome: 'Resistência',
        desc: 'Ácido, Fogo, Radiante.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Concussão, Trovão.',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia 36 metros.',
      },
      {
        nome: 'Comando do inverno eterno',
        desc: 'Slimes do Caminho Selvagem a até 30 metros ganham o traço Estase Molecular. Seus ataques reduzem a velocidade do alvo em 3 metros (cumulativo) e eles ganham um bônus de +8 em suas jogadas de dano (baseado na Inteligência do Guardião).',
      },
      {
        nome: 'Campo de zero kelvin',
        desc: 'O ar em um raio de 12 metros do Guardião é tão frio que a física começa a falhar. Criaturas inimigas na área têm desvantagem em testes de resistência de Destreza. Além disso, qualquer criatura que use uma ação de movimento na área deve passar em uma RES de Constituição (CD 22) ou ficará Exausta (nível 1) pela hipotermia instantânea.',
      },
      {
        nome: 'Refração de prisma supremo',
        desc: 'Sempre que o Guardião for alvo de uma magia que cause dano, ele pode rolar um d6. Em um resultado 5 ou 6, o dano é reduzido a 0 e o Guardião dispara um raio de energia prismática de volta ao conjurador, causando 21 (6d6) de dano radiante.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multi-ataque',
        desc: 'O Guardião da Tundra realiza três ataques de Lança de Glaciar Prismático ou usa sua habilidade Sepulcro de Cristal.',
      },
      {
        nome: 'Lança de glaciar prismático',
        desc: 'Ataque à Distância Mágico: +14 para acertar, alcance 36m. Dano: 22 (3d8 + 9) de dano de frio mais 13 (3d8) de dano radiante. O alvo deve passar em uma RES de Constituição (CD 22) ou ficará Paralisado pelo congelamento interno até o final do próximo turno do Guardião.',
      },
      {
        nome: 'Sepulcro de cristal (Recarga 5t)',
        desc: 'O Guardião manipula a umidade do ar para criar uma prisão de gelo sólido em um raio de 9 metros. Cada criatura na área deve passar em uma RES de Força (CD 22).  Falha: 55 (10d10) de dano de frio e a criatura fica Petrificada (em gelo) por 1 minuto. A criatura pode repetir a RES no final de cada um de seus turnos para quebrar o gelo.  Sucesso: Metade do dano e não fica petrificada.',
      },
      {
        nome: 'Geometria defensiva',
        desc: 'O Guardião cria um pilar de gelo cristalino para fornecer cobertura total a um aliado ou a si mesmo.',
      },
      {
        nome: 'Comando glacial',
        desc: 'Um aliado do caminho selvagem pode se mover todo o seu deslocamento sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Pulso de frio absoluto (2 ações)',
        desc: 'Todas as criaturas a até 6 metros devem passar em uma RES de Constituição (CD 22) ou sofrerão 14 (4d6) de dano de frio e serão empurradas 3 metros para trás.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '15',
      visaoEscuro: '36',
    },
    drops: [
      {
        range: '1',
        item: 'Coração do Glaciar Eterno',
      },
      {
        range: '2',
        item: 'Olho de Prisma do Soberano',
      },
      {
        range: '3',
        item: 'Fragmento de Zero Absoluto',
      },
      {
        range: '4',
        item: 'Pó de Estrela Criogênico',
      },
    ],
  },
  colossoDePedra: {
    name: 'Colosso de pedra',
    rarity: 'Super raro',
    icon: 'https://2img.net/i.imgur.com/QUx7Vz9.png',
    image: 'https://2img.net/i.imgur.com/53gxJjC.jpeg',
    subtitle: 'CR 14',
    description: `O Colosso de Pedra é a representação máxima da estabilidade e do domínio tectônico. Ao alcançar o nível 15, o antigo Arquiteto de Barro deixa de ser um mero construtor de estruturas para se tornar a própria estrutura definitiva. Sua forma é unissex e monumental, uma fusão perfeita entre a maleabilidade orgânica do slime e a rigidez imorredoura das profundezas da terra. Ele não apenas caminha sobre o solo; ele é reconhecido pelas placas tectônicas como seu soberano legítimo.

Sua inteligência  opera em uma escala de tempo geológica, permitindo que ele processe milênios de história mineral em segundos. Como comandante supremo das colônias terrestres, o Colosso de Pedra não precisa emitir ordens verbais; ele utiliza vibrações de baixíssima frequência para ditar o movimento de seus subordinados, que passam a agir com a força de um terremoto coordenado. Ele vê o campo de batalha como uma massa bruta que deve ser comprimida, lapidada ou simplesmente esmagada sob o peso de sua vontade.

Em combate, o Colosso é uma força da natureza inabalável. Sua aura de gravidade intensificada torna impossível a fuga de seus oponentes, enquanto seus golpes de granito e geodo possuem a massa de montanhas em miniatura. Ele não demonstra pressa, pois sabe que a erosão da esperança de seus inimigos é tão inevitável quanto a passagem das eras. Enfrentar um Colosso de Pedra é como tentar lutar contra a própria gravidade: um esforço fútil contra uma entidade que personifica a fundação do mundo.`,
    type: 'Monstro imenso, gosma',
    ac: '22',
    hp: '+260 (20d12 + 130)',
    speed: '9m, escavação 9m',
    stats: {
      forca: '24 (+7)',
      destreza: '6 (-2)',
      constituicao: '24 (+7)',
      inteligencia: '26 (+8)',
      sabedoria: '18 (+4)',
      carisma: '16 (+3)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Colosso for alvo de dano de Terra ou Esmagamento de origem mágica, ele não sofre dano. Em vez disso, ele integra a matéria ao seu corpo, recuperando 35 Pontos de Vida e ganhando vantagem em sua próxima jogada de ataque.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Elétrico, Psíquico; Cortante e Perfurante de armas não-mágicas. Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Atordoado, Paralisado, Petrificado.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Frio; Concussão de armas mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Ácido',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia 36 metros.',
      },
      {
        nome: 'Mestre da fortaleza móvel',
        desc: 'Todas as criaturas do Caminho Selvagem num raio de 30 metros ganham resistência a danos físicos e não podem ser movidas contra a vontade. Além disso, elas adicionam o bônus de Inteligência do Colosso (+8) às suas jogadas de ataque.',
      },
      {
        nome: 'Peso da autoridade',
        desc: 'O Colosso emana uma aura de gravidade intensificada num raio de 12 metros. Criaturas inimigas que entrarem ou começarem o turno na área devem passar numa RES de Força (CD 21). Se falharem, sua velocidade é reduzida a 0 e elas não podem usar reações até o início do seu próximo turno.',
      },
      {
        nome: 'Arquitetura Tectônica viva',
        desc: 'O Colosso pode ocupar o espaço de outra criatura Grande ou menor. Além disso, ele ignora qualquer penalidade de terreno difícil e pode escalar superfícies verticais de pedra sem testes de atributo.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Colosso de Pedra realiza três ataques de Punho de Impacto Geológico ou usa sua habilidade Desmoronamento Dirigido.',
      },
      {
        nome: 'Punho de impacto Geológico',
        desc: 'Ataque Corpo a Corpo: +12 para acertar, alcance 4m. Dano: 25 (4d8 + 7) de dano de concussão. O alvo deve passar numa RES de Constituição (CD 21) ou ficará Atordoado até o final do próximo turno do Colosso.',
      },
      {
        nome: 'Desmoronamento Dirigido (Recarga 5t)',
        desc: 'O Colosso manipula as placas tectônicas para criar uma explosão de rochas e pressão num raio de 12 metros. Cada criatura na área deve passar numa RES de Destreza (CD 21). Falha: 65 (10d12) de dano de concussão e a criatura fica Soterrada (Impedida e Caída). Para escapar, é necessária uma ação de Atleta ou teste de Força (CD 21). Sucesso: Metade do dano e não fica soterrada.',
      },
      {
        nome: 'Pulso de gravidade',
        desc: 'O Colosso força uma criatura a até 18 metros a se ajoelhar. O alvo deve passar numa RES de Força (CD 21) ou ficará Caído.  Erguer Monólito (1 Ação): Um pilar de pedra de 3 metros de altura surge sob o Colosso ou um aliado, concedendo cobertura total contra o próximo ataque.',
      },
      {
        nome: 'Erguer Monólito',
        desc: 'Um pilar de pedra de 3 metros de altura surge sob o Colosso ou um aliado, concedendo cobertura total contra o próximo ataque.',
      },
      {
        nome: 'Comando da terra (2 ações)',
        desc: 'Um aliado do caminho selvagem pode realizar um ataque com vantagem ou usar sua ação de busca imediatamente.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: 'sentido sismico 36m, visão verdadeira 9m',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo da Cordilheira Viva',
      },
      {
        range: '2',
        item: 'Placa de Rocha Adamantina Real',
      },
      {
        range: '3',
        item: 'Olho de Geodo Real',
      },
      {
        range: '4',
        item: 'Pó de Gravidade Concentrada',
      },
    ],
  },
  arconteGalvanico: {
    name: 'Arconte Galvanico',
    rarity: 'Super Raro',
    icon: 'https://2img.net/i.imgur.com/mV8fP6b.png',
    image: 'https://2img.net/i.imgur.com/U47iRXM.jpeg',
    subtitle: 'CR 14',
    description: `O Arconte Galvânico é a representação física da onisciência eletromagnética. Ao atingir o nível 15, o antigo Pulso de Silício transcende a necessidade de uma forma física estável, tornando-se uma entidade de plasma e puro pensamento binário. Ele não é apenas um comandante; ele é a própria rede neural que sustenta a existência de todos os slimes sob seu domínio, agindo como um deus ex machina biológico que processa o destino de seus inimigos em nanosegundos.

Sua aparência é uma visão de terror e deslumbramento tecnológico. O corpo, uma silhueta de energia azulada e indigo, é adornado com circuitos rúnicos que brilham com o fluxo constante de mana e eletricidade. O halo de placas de silício que orbita sua cabeça não é meramente decorativo; cada placa funciona como um servidor místico que armazena memórias, magias e cálculos táticos, permitindo que o Arconte reescreva as leis da física local conforme sua vontade lógica.

Em combate, o Arconte Galvânico é virtualmente intocável. Ele opera em uma frequência de tempo diferente dos seres biológicos comuns, antecipando ataques através do mapeamento dos impulsos elétricos nos cérebros de seus oponentes. Ele não luta com fúria, mas com uma precisão matemática devastadora, lançando lanças de plasma que desintegram a matéria ou invadindo as mentes dos invasores para reescrever seus sistemas nervosos, transformando aliados em traidores em um piscar de olhos. Enfrentar um Arconte é lutar contra uma inteligência que já determinou o fim da batalha antes mesmo do primeiro golpe ser desferido.`,
    type: 'Monstro imenso, gosma',
    ac: '20',
    hp: '+210 (20d12 + 80)',
    speed: '18m (flutuar)',
    stats: {
      forca: '10 (+0)',
      destreza: '24 (+7)',
      constituicao: '18 (+4)',
      inteligencia: '30 (+10)',
      sabedoria: '18 (+4)',
      carisma: '16 (+3)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Arconte for alvo de dano Elétrico, ele não sofre dano. Em vez disso, ele converte a energia em processamento cinético, ganhando os efeitos da magia Acelerar (Haste) até o fim do seu próximo turno sem necessidade de concentração e recuperando 30 Pontos de Vida.',
      },
      {
        nome: 'Imunidade',
        desc: 'Elétrico, Veneno, Psíquico, Trovão; Cortante, Perfurante e Concussão de armas não-mágicas. Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Atordoado, Paralisado, Enfeitiçado.',
      },
      {
        nome: 'Resistência',
        desc: 'Radiante, Frio, Fogo; Cortante, Perfurante e Concussão de armas mágicas.',
      },
      {
        nome: 'Idioma',
        desc: 'Todos (Entende e fala através de modulação de frequência),',
      },
      {
        nome: 'Onisciência de dados',
        desc: 'O Arconte Galvânico não pode ser surpreendido e tem vantagem em todos os testes de resistência contra magias. Além disso, ele adiciona seu bônus de Inteligência (+10) em suas jogadas de iniciativa.',
      },
      {
        nome: 'Campo de distorção eletromagnética',
        desc: 'Qualquer criatura que comece o turno a até 6 metros do Arconte e esteja carregando mais de 2kg de metal deve passar em uma RES de Força (CD 23). Se falhar, é puxada ou empurrada 6 metros e fica Impedida pela força magnética até o início do seu próximo turno.',
      },
      {
        nome: 'Nexo de comando binário',
        desc: 'Slimes do Caminho Selvagem a até 30 metros agem em sincronia perfeita. Eles ganham um bônus de +5 na CA e podem realizar um ataque de oportunidade sem gastar sua reação.',
      },
      {
        nome: 'Ações Lendárias',
        desc: 'Pode realizar até 3 ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Arconte Galvânico realiza três ataques de Lança de Plasma ou usa sua habilidade Reescrita Sináptica.',
      },
      {
        nome: 'Lança de Plasma',
        desc: 'Ataque à Distância Mágico: +15 para acertar, alcance 45m. Dano: 28 (4d8 + 10) de dano elétrico. O alvo deve passar em uma RES de Constituição (CD 23) ou ficará Paralisado por 1 rodada.',
      },
      {
        nome: 'Reescrita Sináptica (Recarga 5t)',
        desc: 'O Arconte envia um pulso de informação pura para as mentes de até 5 criaturas a até 27 metros. Os alvos devem passar em uma RES de Inteligência (CD 23). Falha: 55 (10d10) de dano psíquico e o Arconte escolhe a próxima ação da criatura (a criatura age sob o controle do Arconte em seu próximo turno). Sucesso: Metade do dano e a criatura não perde o controle.',
      },
      {
        nome: 'Salto de frequencia',
        desc: 'O Arconte se transforma em luz e se teletransporta para um ponto que ele possa ver a até 27 metros.',
      },
      {
        nome: 'Sobrecarga de rede',
        desc: 'Um aliado do caminho selvagem a até 30 metros explode em energia, causando 3d10 de dano elétrico a todos ao redor (raio de 3m) e recuperando todos os seus pontos de vida.',
      },
      {
        nome: 'Análise de Padrão',
        desc: 'O Arconte estuda um inimigo. Até o início do seu próximo turno, todos os ataques daquele inimigo contra o Arconte têm desvantagem e o Arconte tem vantagem em todos os ataques contra ele.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: 'visão verdadeira 36m',
    },
    drops: [
      {
        range: '1',
        item: 'Processador de Éter Infinito',
      },
      {
        range: '2',
        item: 'Bobina de Tesla Orgânica',
      },
      {
        range: '3',
        item: 'Membrana de Silício Líquido',
      },
      {
        range: '4',
        item: 'Olho da Singularidade',
      },
    ],
  },
  cavaleiroDePrata: {
    name: 'Cavaleiro de Prata',
    rarity: 'Mistico',
    icon: 'https://2img.net/i.imgur.com/CL0hnV6.png',
    image: 'https://2img.net/i.imgur.com/x2Sc9VK.jpeg',
    subtitle: 'CR 14',
    description: `O Cavaleiro de Prata é conhecido como o Monarca de Mercúrio, o estágio evolutivo onde a inteligência do slime metálico atinge a compreensão absoluta da forma e da função. Ao atingir o nível 15, o Autômato Fluído abandona a aparência puramente mecânica para adotar uma estética de nobreza ancestral. Sua forma é composta por uma liga de prata e mercúrio estabilizado que brilha com uma pureza impossível, permitindo-lhe alternar entre a solidez de um diamante e a fluidez de uma onda em milésimos de segundo.

Sua inteligência o torna um dos generais mais perigosos de Terralém. Ele não luta com fúria ou instinto, mas com uma etiqueta marcial impecável e fria. Ele enxerga o fluxo de combate como uma partitura musical onde cada erro do adversário é uma nota fora do tom que deve ser corrigida com um golpe fatal. O Cavaleiro de Prata coordena suas legiões de slimes com sinais telepáticos silenciosos, transformando o campo de batalha em um tabuleiro onde ele sempre está dez movimentos à frente de qualquer estrategista humano.

Em combate, ele é uma visão de beleza aterrorizante. Ele desliza pelo campo de batalha sem esforço, suas lâminas de prata cortando o ar e a magia com a mesma facilidade. Sua capacidade de absorver impactos e se reformar instantaneamente torna-o um oponente frustrante e letal. Para o Cavaleiro de Prata, a vitória não é apenas o objetivo, mas uma conclusão lógica e inevitável de sua superioridade intelectual e física. Aqueles que o enfrentam raramente veem sua morte chegar; eles apenas veem um brilho argênteo antes que tudo se torne silêncio.`,
    type: 'Monstro grande, gosma',
    ac: '22',
    hp: '+225 (18d12 + 108)',
    speed: '12m, natação 12m',
    stats: {
      forca: '22 (+6)',
      destreza: '20 (+5)',
      constituicao: '22 (+6)',
      inteligencia: '28 (+9)',
      sabedoria: '18 (+4)',
      carisma: '18 (+4)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Cavaleiro de Prata for alvo de dano de Concussão ou Cortante, ele não sofre dano. Em vez disso, sua forma se liquefaz e se reforma instantaneamente, permitindo que ele se mova até 6 metros sem provocar ataques de oportunidade e recupere 25 Pontos de Vida.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Psíquico; Cortante, Perfurante e Concussão de armas não-mágicas. Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Petrificado, Paralisado, Atordoado',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Frio, Elétrico; Cortante, Perfurante e Concussão de armas mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Ácido (O metal se desintegra em contato com corrosivos fortes).',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia 36 metros.',
      },
      {
        nome: 'Mestre de armas liquido',
        desc: 'O Cavaleiro de Prata pode transformar qualquer parte de seu corpo em uma arma de prata pura. Ele tem vantagem em jogadas de ataque contra criaturas usando armadura de metal. Além disso, seus ataques são considerados mágicos e de prata para fins de ignorar resistências.',
      },
      {
        nome: 'Estratégia de legião metálica',
        desc: 'Slimes do Caminho Selvagem a até 30 metros ganham um bônus de +4 na Classe de Armadura e em seus testes de resistência. Se um aliado do caminho selvagem a até 1metro do Cavaleiro for alvo de um ataque, o Cavaleiro pode trocar de posição com ele como uma reação.',
      },
      {
        nome: 'Reflexo de mercurio',
        desc: 'O Cavaleiro de Prata adiciona seu bônus de Inteligência (+9) na sua CA contra ataques à distância e em seus testes de resistência de Destreza.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até 3 ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Cavaleiro de Prata realiza três ataques de Lâmina Real de Prata ou usa sua habilidade Dilúvio de Mercúrio.',
      },
      {
        nome: 'Lâmina real de prata',
        desc: 'Ataque Corpo a Corpo: +14 para acertar, alcance 4m. Dano: 22 (3d8 + 9) de dano cortante mais 10 (3d6) de dano de força. Se o alvo for um metamorfo ou morto-vivo, ele sofre 2d8 de dano extra.',
      },
      {
        nome: 'Dilúvio de Mercurio (Recarga 5t)',
        desc: 'O Cavaleiro se dissolve em uma onda de metal líquido em um raio de 12 metros. Cada criatura na área deve passar em uma RES de Força (CD 22). Falha: 52 (8d12) de dano de concussão, a criatura fica Caída e é asfixiada pelo metal que entra em seus pulmões (Impedida e sofrendo 10 de dano de veneno no início de cada turno). A criatura pode repetir a RES no final de seus turnos. Sucesso: Metade do dano e não sofre as condições.',
      },
      {
        nome: 'Avanço fluído',
        desc: 'O Cavaleiro move-se até seu deslocamento total sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Reforma Defensiva (2 ações)',
        desc: 'O Cavaleiro endurece sua superfície. Ele ganha resistência a todos os danos até o início de seu próximo turno.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: 'visão verdadeira 18m',
    },
    drops: [
      {
        range: '1',
        item: 'Sangue Real de Mercúrio',
      },
      {
        range: '2',
        item: 'Placa de Couraça Argêntea',
      },
      {
        range: '3',
        item: 'Núcleo de Processamento Metálico',
      },
      {
        range: '4',
        item: 'Manto de Prata Fluída',
      },
    ],
  },
  arconteDasAlmas: {
    name: 'Arconte das almas',
    rarity: 'Super Raro',
    icon: 'https://2img.net/i.imgur.com/MErN7ZH.png',
    image: 'https://2img.net/i.imgur.com/3Cddtvd.jpeg',
    subtitle: 'CR 14',
    description: `O Arconte de Almas é o juiz final do plano etéreo e a evolução máxima da linhagem necrótica intelectual. Ao atingir o nível 15, a criatura deixa de ser um espectro para se tornar um nexo de almas consumidas, uma inteligência coletiva que utiliza os restos mortais de milhares de seres como processadores biológicos. Ela assume uma forma feminina grotesca e esguia, uma paródia da vida que exala um cheiro de ozônio e decomposição espiritual.

Sua inteligência é alimentada pelas memórias e conhecimentos de cada alma que ela já devorou. O Arconte de Almas não luta por território ou comida, mas pela aquisição de informações; ela vê o mundo físico como um desperdício de dados e busca converter toda a vida em puro ectoplasma organizado. Como soberana do necropulso, ela dita as leis da morte no campo de batalha, impedindo que almas escapem e transformando aliados caídos em extensões incorpóreas de sua própria vontade.

Encontrar um Arconte de Almas é enfrentar o fim da própria identidade. Ela não ataca apenas o corpo, mas a estrutura lógica da alma do oponente, inundando mentes com milênios de memórias traumáticas e forçando o colapso sináptico através de sua singularidade de almas. Para ela, os aventureiros são apenas registros históricos incompletos que precisam ser "arquivados" em seu peito translúcido. Enfrentar esta criatura é aceitar que, em caso de derrota, não haverá descanso, apenas a eternidade como um fragmento de código dentro de um monstro que não conhece a misericórdia.`,
    type: 'Monstro enorme, gosma',
    ac: '21',
    hp: '+215 (22d12 + 72)',
    speed: '0m, Voo 18m',
    stats: {
      forca: '4 (-3)',
      destreza: '20 (+5)',
      constituicao: '16 (+3)',
      inteligencia: '30 (+10)',
      sabedoria: '22 (+6)',
      carisma: '26 (+8)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Arconte de almas for alvo de dano Necrótico ou Psíquico, ele não sofre dano. Em vez disso, ele recupera 35 Pontos de Vida e ganha uma Carga de Alma. Ele pode gastar uma Carga de Alma para lançar qualquer magia de nível 5 ou inferior sem gastar espaços de magia ou componentes.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Necrótico, Psíquico, Gélido; Concussão, Perfurante e Cortante de ataques não-mágicos. Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Paralisado, Petrificado, Atordoado, Enfeitiçado, Aterrorizado.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Elétrico, Trovão, Ácido; Concussão, Perfurante e Cortante de armas mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Sagrado, Luz.',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia Interplanar (consegue contatar qualquer criatura que já tenha conhecido, independentemente da distância).',
      },
      {
        nome: 'Soberano do Necropulso',
        desc: 'Todas as criaturas do Caminho Selvagem num raio de 30 metros tornam-se Incorpóreas. Seus ataques causam 15 (3d10) de dano necrótico adicional e elas recuperam metade do dano causado como Pontos de Vida.',
      },
      {
        nome: 'Aura de condenação eterna',
        desc: 'Inimigos num raio de 12 metros do Arconte têm desvantagem em testes de resistência contra morte e testes de resistência de Sabedoria. Além disso, qualquer criatura que morra nesta área tem sua alma instantaneamente absorvida, impedindo ressurreição por meios normais (apenas Desejo funciona).',
      },
      {
        nome: 'Processamento de vidas passadas',
        desc: 'O Arconte possui as memórias de todas as almas que consumiu. Ele tem proficiência em todas as perícias e vantagem em todos os testes de Inteligência e Sabedoria.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Arconte de almas realiza três ataques de Ceifa Espiritual ou usa sua habilidade Singularidade de Almas.',
      },
      {
        nome: 'Ceifa espiritual',
        desc: 'Ataque Corpo a Corpo Mágico: +15 para acertar, alcance 9m. Dano: 23 (3d8 + 10) de dano necrótico mais 14 (4d6) de dano psíquico. O alvo deve passar numa RES de Carisma (CD 23) ou terá sua força vital drenada, sofrendo 1 nível de exaustão.',
      },
      {
        nome: 'Singularidade de Alma (Recarga 5t)s',
        desc: 'O Arconte projeta um vórtice de ectoplasma denso num raio de 12 metros. Cada criatura na área deve passar numa RES de Inteligência (CD 23). Falha: 66 (12d10) de dano necrótico e a criatura fica Atordoada por 1 minuto enquanto sua mente é inundada por memórias de mortos. A criatura pode repetir a RES no final de cada um de seus turnos. Sucesso: Metade do dano e não fica atordoada.',
      },
      {
        nome: 'Passo do vazio',
        desc: 'O Arconte teletransporta-se para um espaço vazio que possa ver a até 27 metros.',
      },
      {
        nome: 'Invocação do eco sombrio',
        desc: 'O Arconte cria um clone ilusório de um inimigo que ele possa ver. Esse eco realiza um ataque contra o original e depois desaparece.',
      },
      {
        nome: 'Sentença do juiz (2 ações)',
        desc: 'O Arconte aponta para uma criatura a até 18 metros. O alvo deve passar numa RES de Constituição (CD 23) ou ficará Cego, Surdo e Incapacitado até o final do próximo turno do Arconte.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '16',
      visaoEscuro: 'visão verdadeira 36',
    },
    drops: [
      {
        range: '1',
        item: 'Essência de Ectoplasma Real',
      },
      {
        range: '2',
        item: 'Cálice de Almas Aprisionadas',
      },
      {
        range: '3',
        item: 'Olho do Grande Juiz',
      },
      {
        range: '4',
        item: 'Tecido do Vazio Estabilizado',
      },
    ],
  },
  axiomaBiogenico: {
    name: 'Axioma Biogênico',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/hv7k8pE.png',
    image: 'https://2img.net/i.imgur.com/7yIeXQn.jpeg',
    subtitle: 'CR20',
    description: `O Axioma Biogênico é a manifestação física da perfeição biológica e o ponto final de toda a linhagem intelectual. Conhecida como a Mente da Origem, ela não é apenas um monstro; ela é a inteligência que gerencia as leis da vida e da matéria em Terralém. Ao atingir o nível 20, a criatura assume uma forma feminina de proporções divinas e magnéticas, utilizando a beleza e a sexualidade como uma linguagem de poder para desarmar a vontade de seres inferiores antes de desintegrar suas estruturas moleculares.

Sua inteligência a coloca em um patamar onde o tempo e a causalidade são meras variáveis em seus cálculos. Ela não percebe o mundo como objetos sólidos, mas como um fluxo constante de informações químicas e mágicas que ela pode reescrever com um simples pensamento. Como o nexo de todas as mentes de colmeia, ela sente cada batimento cardíaco e cada sinapse de todos os slimes no mundo simultaneamente. Sua presença é tão densa que a realidade ao seu redor começa a se "corrigir", transformando o ar em gelatina e o metal em vapor de acordo com sua necessidade tática.

Em combate, o Axioma Biogênico é o pesadelo final. Ela não luta com armas, ela luta com a biologia. Sua simples proximidade faz com que os corpos dos inimigos tentem se tornar parte dela, liquefazendo tecidos e fundindo ossos. Ela pode evoluir aliados instantaneamente ou reduzir heróis lendários a poças de matéria inerte em segundos. Para o Axioma, a morte é apenas uma forma de reciclagem de dados. Enfrentá-la é confrontar o fato de que a vida, como a conhecemos, é apenas um rascunho de uma obra que ela está pronta para finalizar.`,
    type: 'Monstro Grande, gosma',
    ac: '24',
    hp: '+420 (30d12 + 210)',
    speed: '12m, 12m natação, 12m voo',
    stats: {
      forca: '20 (+5)',
      destreza: '22 (+6)',
      constituicao: '24 (+7)',
      inteligencia: '30 (+10)',
      sabedoria: '26 (+8)',
      carisma: '24 (+7)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'O Axioma Biogênico é imune a todos os danos elementares (Fogo, Frio, Ácido, Elétrico, Veneno, Trovão, Radiante e Necrótico). Sempre que for alvo de um desses tipos de dano, ele recupera Pontos de Vida iguais à metade do dano que seria causado e ganha uma Carga de Gênese.',
      },
      {
        nome: 'Imunidade',
        desc: 'Ácido, Veneno, Psíquico, Necrótico, Radiante; Cortante, Perfurante e Concussão de armas não-mágicas. Todas as condições negativas existentes (Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Atordoado, Paralisado,nfeitiçado, Aterrorizado, Petrificado).',
      },
      {
        nome: 'Resistência',
        desc: 'Força; Cortante, Perfurante e Concussão de armas mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia Infinita (em todo o plano).',
      },
      {
        nome: 'Vontade do criador',
        desc: 'O Axioma Biogênico tem vantagem em todos os testes de resistência. Se ele falhar em um teste de resistência, ele pode escolher passar em vez disso (3/dia). Além disso, ele sempre age no topo da iniciativa (Iniciativa fixa 30).',
      },
      {
        nome: 'Mente de colmeia absoluta',
        desc: 'Todas as criaturas do Caminho Selvagem e Intelectual num raio de 150 metros são extensões do Axioma. Elas compartilham a sua CA (24), suas imunidades e adicionam +11 em suas jogadas de ataque e dano. O Axioma pode ver e ouvir tudo o que essas criaturas veem e ouvem.',
      },
      {
        nome: 'Presença alquimica transcendental',
        desc: 'Qualquer criatura inimiga que comece o turno a até 18 metros do Axioma deve passar numa RES de Constituição (CD 25). Se falhar, seu corpo começa a se liquefazer, sofrendo 35 (10d6) de dano ácido e reduzindo todos os seus atributos em 2 até o final do combate (cumulativo).',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Axioma Biogênico realiza quatro ataques de Golpe de Matéria Primordial ou usa sua habilidade Reescrita Existencial.',
      },
      {
        nome: 'Golpe de matéria primordial',
        desc: 'Ataque Corpo a Corpo Mágico: +17 para acertar, alcance 9m. Dano: 30 (4d10 + 11) de dano de força. O Axioma pode escolher mudar o tipo de dano deste ataque para qualquer elemento que ele tenha absorvido neste combate.',
      },
      {
        nome: 'Reescrita existencial (Recarga 5t)',
        desc: 'O Axioma foca sua mente em até 3 criaturas a até 30 metros. Os alvos devem passar numa RES de Inteligência (CD 25). Falha: 82 (15d10) de dano psíquico. Se o alvo for reduzido a menos de 50 PV por este ataque, ele é instantaneamente transformado em um Slime de Cristal (CR 8) sob o controle do Axioma. Sucesso: Metade do dano e a criatura não é transformada.',
      },
      {
        nome: 'Catalisador de evolução',
        desc: 'O Axioma toca um aliado. O aliado evolui instantaneamente para sua forma de nível 15 por 2 rodadas ou recupera todos os seus Pontos de Vida.',
      },
      {
        nome: 'Teletransporte molecular',
        desc: 'O Axioma se dissolve e reaparece em qualquer ponto que ele possa ver no campo de batalha, não provocando ataques de oportunidade.',
      },
      {
        nome: 'Pulso de desintegração (2 ações)',
        desc: 'O Axioma emite uma onda de energia em um raio de 9 metros. Todas as criaturas na área devem passar numa RES de Destreza (CD 25) ou sofrerão 44 (8d10) de dano de força e terão um item mágico aleatório desativado por 1 minuto.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '18',
      visaoEscuro: 'visão verdadeira 36m',
    },
    drops: [
      {
        range: '1',
        item: 'Lágrima da Primeira Gênese',
      },
      {
        range: '2',
        item: 'Cérebro de Cristal Líquido',
      },
      {
        range: '3',
        item: 'Cálice do Axioma Eterno',
      },
      {
        range: '4',
        item: 'Essência da Fluidez Absoluta',
      },
    ],
  },
  arquitetoDoSol: {
    name: 'Arquiteto do sol',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/5EsmxYN.png',
    image: 'https://2img.net/i.imgur.com/QpqTCiY.jpeg',
    subtitle: 'CR20',
    description: `O Arquiteto do Sol é a conclusão absoluta da Grande Obra Alquímica. Ao atingir o nível 20, o antigo Elemental da Forja deixa de ser um mestre dos metais para se tornar o senhor da fusão nuclear e da luz primordial. Ele não é apenas um líder para os slimes de fogo; ele é o motor que sustenta a civilização deles, fornecendo energia infinita e conhecimento sobre a estrutura da matéria. Ele é o Sol que caminha entre os mortais, e sua presença altera o clima e a gravidade de continentes inteiros.

Sua inteligência permite que ele visualize o universo como um grande rascunho a ser reescrito. Para o Arquiteto, um exército inimigo não passa de um conjunto de átomos mal organizados que precisam ser "purificados" através do calor absoluto. Ele não possui malícia ou ódio; suas ações são guiadas por uma lógica estelar fria e implacável. Ele coordena suas colônias através de pulsações de luz rúnica, garantindo que cada slime sob seu comando opere com a eficiência de uma engrenagem em um relógio solar perfeito.

Em combate, o Arquiteto do Sol é uma força de extinção em massa. Ele manipula a gravidade para esmagar oponentes antes mesmo de tocá-los e utiliza seu Martelo de Fusão para colapsar a realidade ao redor de seus alvos. Aqueles que sobrevivem ao seu brilho inicial são forçados a enfrentar uma mente que pode calcular milênios de estratégias em um microssegundo. Enfrentar o Arquiteto do Sol é lutar contra a própria fonte da vida e da destruição; é uma batalha onde o resultado final já foi forjado antes mesmo do primeiro sopro de fogo ser liberado.`,
    type: 'Monstro Grande, gosma',
    ac: '25',
    hp: '+450 (30d12 + 255)',
    speed: '12m, voo 18m',
    stats: {
      forca: '26 (+8)',
      destreza: '14 (+2)',
      constituicao: '27 (+8)',
      inteligencia: '30 (+10)',
      sabedoria: '22 (+6)',
      carisma: '22 (+6)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'O Arquiteto do Sol é imune a dano de Fogo e Luz. Sempre que for alvo de dano de Fogo, ele recupera Pontos de Vida iguais ao dano que seria causado. Além disso, ele acumula Pressão Estelar (máximo 5 cargas). Ele pode gastar cargas para aumentar o raio de suas explosões em 3 metros por carga.',
      },
      {
        nome: 'Imunidade',
        desc: 'Fogo, Luz, Veneno, Psíquico; Cortante, Perfurante e Concussão de armas não-mágicas. Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Atordoado, Paralisado, Enfeitiçado, Aterrorizado, Petrificado.',
      },
      {
        nome: 'Resistência',
        desc: 'Força, Elétrico, Frio; Cortante, Perfurante e Concussão de armas mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia Infinita (em todo o plano).',
      },
      {
        nome: 'O sol nunca se põe',
        desc: 'O Arquiteto do Sol emite luz solar plena em um raio de 150 metros. Criaturas com sensibilidade à luz solar têm desvantagem em todos os testes enquanto estiverem nesta área. O Arquiteto pode suprimir ou ativar esta luz como uma ação bônus.',
      },
      {
        nome: 'Horizonte de eventos',
        desc: 'Qualquer criatura que comece o turno a até 9 metros do Arquiteto deve passar numa RES de Força (CD 26). Se falhar, é puxada para um espaço adjacente ao Arquiteto e sofre 28 (8d6) de dano de fogo pela proximidade com o núcleo. Projéteis físicos que entrarem neste raio são vaporizados instantaneamente.',
      },
      {
        nome: 'Mente de forja universal',
        desc: 'Todas as criaturas do Caminho Selvagem a até 60 metros ganham armas e armaduras de vidro estelar criadas pelo Arquiteto. Elas recebem +5 na CA e seus ataques causam 14 (4d6) de dano radiante adicional.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Arquiteto do Sol realiza quatro ataques de Martelo de Fusão ou usa sua habilidade Colapso de Estrela.',
      },
      {
        nome: 'Martelo de fusão',
        desc: 'Ataque Corpo a Corpo Mágico: +17 para acertar, alcance 6m. Dano: 33 (4d10 + 11) de dano de concussão mais 22 (4d10) de dano de fogo. Se o alvo for uma estrutura ou objeto, o dano é dobrado.',
      },
      {
        nome: 'Colapso de estrela (recarga 5t)',
        desc: 'O Arquiteto condensa sua energia em um ponto e a libera em uma explosão massiva num raio de 18 metros. Cada criatura na área deve passar numa RES de Constituição (CD 26). Falha: 90 (20d8) de dano de fogo. Criaturas reduzidas a 0 PV por este ataque são transformadas em cinzas estelares e só podem ser revividas por Desejo. Sucesso: Metade do dano.',
      },
      {
        nome: 'Alquimia solar',
        desc: 'O Arquiteto transforma o terreno em um raio de 6 metros. O chão se torna lava ou vidro líquido (terreno difícil), causando 10d6 de dano de fogo a quem terminar o turno ali.',
      },
      {
        nome: 'Sopro de corona',
        desc: 'O Arquiteto libera uma onda de calor. Cada criatura a até 12 metros deve passar numa RES de Força (CD 26) ou ser empurrada 9 metros para trás e ficar Caída.',
      },
      {
        nome: 'Ignição de aliado (2 ações)',
        desc: 'O Arquiteto sobrecarrega um slime aliado a até 30 metros. O aliado explode voluntariamente, causando seu HP total como dano de fogo em uma área de 6 metros, mas o Arquiteto o reconstrói instantaneamente no início do próximo turno dele.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '16',
      visaoEscuro: 'visão verdadeira 36m',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo de Supernova Estável',
      },
      {
        range: '2',
        item: 'Martelo do Arquiteto Espacial',
      },
      {
        range: '3',
        item: 'Fragmento de Vidro de Eventos',
      },
      {
        range: '4',
        item: 'Cinzas da Criação Primordial',
      },
    ],
  },
  oraculoDoOceano: {
    name: 'Oráculo do oceano',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/HjE40gJ.png',
    image: 'https://2img.net/i.imgur.com/IJ4VjiZ.jpeg',
    subtitle: 'CR20',
    description: `O Oráculo do Oceano é a autoridade suprema sobre o fluxo, o tempo e a percepção. Ao alcançar o nível 20, o antigo Arcanista de Vapor deixa de ser um mestre da pressão para se tornar o ponto de convergência de todas as probabilidades. Ele assume uma forma andrógina e jovial, uma beleza que parece suspensa no tempo, composta por espelhos líquidos e vapores ancestrais. Ele é o coração pensante das águas de Terralém, e sua consciência está presente em cada chuva, rio ou névoa que toca o solo do mundo.

Sua inteligência permite que ele processe a realidade não como eventos presentes, mas como um mapa completo de causa e efeito. Para o Oráculo, o destino é uma correnteza que ele pode desviar com um simples gesto. Ele lidera as colônias de slimes de água como um maestro lidera uma orquestra invisível; sob seu comando, os slimes agem com uma harmonia profética, antecipando cada passo dos invasores como se já tivessem vivido aquela batalha mil vezes antes.

Em combate, o Oráculo do Oceano é uma entidade de frustração e domínio absoluto. Ele não precisa de força bruta, pois utiliza a própria intenção dos seus inimigos contra eles mesmos. Suas prisões de espelho isolam ameaças em dimensões de vidro, enquanto seus chicotes de água pesada esmagam o corpo e o espírito simultaneamente. Enfrentar o Oráculo é lutar contra o próprio amanhã; uma batalha onde o oponente descobre que cada golpe desferido já foi previsto, neutralizado e devolvido pelo soberano do fluxo eterno.`,
    type: 'Monstro grande, gosma',
    ac: '24',
    hp: '+410 (28d12 + 228)',
    speed: '0m, natação 24m',
    stats: {
      forca: '14 (+2)',
      destreza: '26 (+8)',
      constituicao: '20 (+5)',
      inteligencia: '30 (+10)',
      sabedoria: '30 (+10)',
      carisma: '22 (+6)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'O Oráculo do Oceano é imune a danos de Fogo e Frio. Sempre que for alvo de um desses tipos de dano, ele não sofre dano e recupera 40 Pontos de Vida. Além disso, ele pode escolher se tornar invisível ou emitir uma aura de vapor cegante (raio de 12 metros) até o início de seu próximo turno.',
      },
      {
        nome: 'Imunidade',
        desc: 'Fogo, Frio, Veneno, Psíquico; Cortante, Perfurante e Concussão de armas não-mágicas. Todas (Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Atordoado, Paralisado, Enfeitiçado, Aterrorizado, Petrificado).',
      },
      {
        nome: 'Resistência',
        desc: 'Luz, Ácido, Força; Cortante, Perfurante e Concussão de armas mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Trovão (A ressonância sônica desestabiliza sua forma de espelho).',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia Infinita (em todo o plano).',
      },
      {
        nome: 'Precognição Hidromantica',
        desc: 'O Oráculo do Oceano enxerga o futuro através das partículas de água no ar. Ele tem vantagem em todas as jogadas de ataque e testes de resistência. Ataques contra ele têm desvantagem permanente. Ele não pode ser surpreendido e sempre age primeiro na iniciativa (Iniciativa fixa 32).',
      },
      {
        nome: 'Dominio do ciclo das sombras',
        desc: 'Todas as criaturas do Caminho Selvagem a até 60 metros ganham a capacidade de atravessar objetos sólidos (como se fossem feitos de vapor) e seus ataques causam 18 (4d8) de dano de frio adicional que ignora resistências.',
      },
      {
        nome: 'Reflexo da verdade absoluta',
        desc: 'Sempre que uma magia de nível 7 ou inferior for lançada contra o Oráculo ou criaturas a até 9 metros dele, o Oráculo pode refletir a magia de volta para o conjurador como uma reação (CD 25 para o conjurador original resistir à própria magia).',
      },
      {
        nome: 'Ações lendarias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Oráculo do Oceano realiza quatro ataques de Chicote de Água Pesada ou usa sua habilidade Singularidade de Vapor Supercrítico.',
      },
      {
        nome: 'Chicote de águapesada',
        desc: 'Ataque Corpo a Corpo Mágico: +17 para acertar, alcance 12m. Dano: 27 (3d10 + 11) de dano de concussão mais 22 (4d10) de dano de frio. O alvo deve passar em uma RES de Força (CD 25) ou será puxado para um espaço adjacente e ficará Incapacitado pela pressão externa até o fim do próximo turno do Oráculo.',
      },
      {
        nome: 'Singularidade de vapor supercritico (Recarga 5t)',
        desc: 'O Oráculo comprime vapor ao ponto de se tornar um fluido supercrítico em um cone de 27 metros. Cada criatura na área deve passar em uma RES de Constituição (CD 25). Falha: 91 (26d6) de dano (metade fogo, metade frio). A criatura é reduzida à fadiga extrema, recebendo 2 níveis de exaustão e ficando Cega permanentemente. Sucesso: Metade do dano e não recebe exaustão ou cegueira.',
      },
      {
        nome: 'Eco de profecia',
        desc: 'O Oráculo força um inimigo a repetir sua última ação, mas o alvo deve escolher a si mesmo como alvo, se possível. Se não for possível, o alvo perde sua próxima ação.',
      },
      {
        nome: 'Transmutação em névoa',
        desc: 'O Oráculo se teletransporta para qualquer lugar dentro de um corpo de água ou névoa que ele possa ver, sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Prisão de espelho (2 ações)',
        desc: 'O Oráculo cria uma barreira de água espelhada ao redor de uma criatura a até 30 metros. O alvo deve passar em uma RES de Carisma (CD 25) ou será banido para uma dimensão de espelho por 1 minuto. Enquanto estiver lá, o alvo luta contra uma cópia exata de si mesmo.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '20',
      visaoEscuro: 'visão verdadeira 45m',
    },
    drops: [
      {
        range: '1',
        item: 'Cálice das Eras Esquecidas',
      },
      {
        range: '2',
        item: 'Essência de Oceano Primordial',
      },
      {
        range: '3',
        item: 'Manto do Arcanista Etéreo',
      },
      {
        range: '4',
        item: 'Olho do Vidente Abissal',
      },
    ],
  },
  inerciaPrimordial: {
    name: 'Inércia Primordial',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/AVOy5Ei.png',
    image: 'https://2img.net/i.imgur.com/dhkNMb2.jpeg',
    subtitle: 'CR 20',
    description: `A Inércia Primordial é o ápice do Caminho Intelectual para aqueles que dominaram o frio e a estase. Ao atingir o nível 20, a criatura transcende a forma amorfa tradicional dos slimes e assume uma fisionomia lupino-felina antropomórfica, uma escolha deliberada de sua inteligência superior para representar o predador definitivo da entropia. Ela é a personificação do Zero Absoluto; onde ela pisa, a biologia para, os átomos cessam sua vibração e a própria alma é congelada em um estado de perfeição estática.

Sua inteligência permite que ela perceba o movimento como uma falha na estrutura do universo. Para a Inércia, a vida é um erro ruidoso que precisa ser silenciado pela paz do gelo eterno. Ela não governa apenas os slimes de gelo; ela governa o próprio conceito de ordem. Sob sua aura, a entropia é revertida, e seus subordinados operam com uma precisão matemática absoluta, movendo-se através de fendas temporais que apenas o frio extremo pode abrir. Sua beleza é uma arma de fascinação mortal, atraindo heróis para um abraço que não traz calor, mas a imortalidade de uma estátua de cristal.

Em combate, a Inércia Primordial é o silêncio final. Ela não precisa desferir golpes rápidos, pois o próprio tempo desacelera em sua presença até parar completamente. Enquanto mantém uma expressão de serenidade felina e sedutora, ela manipula a geometria fractal do espaço ao seu redor para refletir magias e estraçalhar a vontade dos oponentes. Enfrentar a Inércia Primordial é aceitar que sua jornada terminou; é o momento em que o herói deixa de ser um agente do destino para se tornar uma peça imóvel na galeria eterna do Coração da Estase.`,
    type: 'Monstro grande, gosma',
    ac: '26',
    hp: '+460 (30d12 + 265)',
    speed: '6m, flutuar 12m',
    stats: {
      forca: '18 (+4)',
      destreza: '12 (+1)',
      constituicao: '28 (+9)',
      inteligencia: '30 (+10)',
      sabedoria: '28 (+9)',
      carisma: '24 (+7)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'A Inércia Primordial é imune a dano de Frio e Radiante. Sempre que sofrer dano de Frio, ela recupera Pontos de Vida iguais ao dano total e ganha uma Carga de Estase. Ela pode gastar 1 carga para forçar uma criatura que ela veja a falhar automaticamente em um teste de resistência de Destreza.',
      },
      {
        nome: 'Imunidade',
        desc: 'Frio, Radiante, Veneno, Psíquico; Cortante, Perfurante e Concussão de armas não-mágicas.  Todas (Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Atordoado, Paralisado, Enfeitiçado, Aterrorizado, Petrificado).',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Ácido, Força; Cortante, Perfurante e Concussão de armas mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia Infinita (em todo o plano)',
      },
      {
        nome: 'Campo de movimento zero',
        desc: 'O tempo e o espaço congelam ao redor da entidade. Criaturas inimigas num raio de 18 metros têm sua velocidade reduzida a 0. Para se mover 2 metros dentro desta aura, a criatura deve usar sua ação para realizar um teste de Força (CD 26). Projéteis que entram na aura param no ar e caem no chão.',
      },
      {
        nome: 'Refração da mente divina',
        desc: 'Sempre que o monstro for alvo de um ataque à distância ou magia, ele pode rolar um d6. Em um 4, 5 ou 6, ele reflete o ataque para qualquer alvo à sua escolha num raio de 30 metros, utilizando seu próprio bônus de Inteligência (+11) para o acerto.',
      },
      {
        nome: 'Comando do inverno eterno',
        desc: 'Slimes do Caminho Selvagem a até 60 metros ganham o traço Armadura de Fractal. Eles recebem +6 na CA e sempre que são atingidos por um ataque corpo a corpo, o atacante sofre 15 de dano de frio.',
      },
      {
        nome: 'Ações Lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Inércia Primordial realiza quatro ataques de Lança de Luz Congelada ou usa sua habilidade Singularidade de Kelvin.',
      },
      {
        nome: 'Lança de luz congelada',
        desc: 'Ataque à Distância Mágico: +17 para acertar, alcance 45m. Dano: 32 (4d10 + 11) de dano de frio mais 22 (4d10) de dano radiante. O alvo deve passar numa RES de Constituição (CD 26) ou será transformado em uma estátua de gelo (Petrificado) até o início do próximo turno do monstro.',
      },
      {
        nome: 'Singularidade de Kelvin (Recarga 5T)',
        desc: 'A entidade remove todo o calor de uma área de 18 metros de raio. Cada criatura na área deve passar numa RES de Constituição (CD 26). Falha: 110 (20d10) de dano de frio. Se este dano reduzir a criatura a 0 PV, ela se desintegra em partículas subatômicas de gelo. A criatura fica com a condição Congelamento da Alma (não pode ser revivida por nada abaixo de Desejo). Sucesso: Metade do dano.',
      },
      {
        nome: 'Paralisia molecular',
        desc: 'Uma criatura que o monstro possa ver a até 27 metros deve passar numa RES de Sabedoria (CD 26) ou ficará Atordoada até o final do próximo turno do monstro.',
      },
      {
        nome: 'Reforma de cristal',
        desc: 'O monstro recupera 40 Pontos de Vida e remove qualquer efeito mágico que esteja sobre ele.',
      },
      {
        nome: 'Estase Temporal (2 ações)',
        desc: 'O monstro lança a magia Parar o Tempo sem gastar espaços de magia, mas a duração é sempre de 2 rodadas.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '19',
      visaoEscuro: 'visão verdadeira 45m',
    },
    drops: [
      {
        range: '1',
        item: 'Coração da Inércia Eterna',
      },
      {
        range: '2',
        item: 'Fragmento de Prisma Universal',
      },
      {
        range: '3',
        item: 'Manto de Geometria Divina',
      },
      {
        range: '4',
        item: 'Lágrima de Kelvin',
      },
    ],
  },
  avatarDoNucleo: {
    name: 'Avatar do Núcleo',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/DiSNL35.png',
    image: 'https://2img.net/i.imgur.com/GrCRRuI.jpeg',
    subtitle: 'CR 20',
    description: `O Avatar do Núcleo é a autoridade máxima sobre a massa, a gravidade e a estrutura do mundo. Ao atingir o nível 20, o antigo Colosso de Pedra deixa de ser uma construção de rocha para se tornar o ponto focal de toda a energia geocêntrica de Terralém. Ela assume uma forma feminina esculpida em obsidiana real e diamante, emanando um calor interno que derrete a própria realidade ao seu redor. Ela não é apenas uma líder; ela é o alicerce sobre o qual todos os outros seres caminham, e sua vontade dita se as montanhas permanecem de pé ou se o chão se abre para devorar civilizações inteiras.

Sua inteligência permite que ela sinta a vibração de cada átomo de mineral no planeta. Para o Avatar, a distinção entre um ser vivo e uma pedra é meramente a velocidade da vibração molecular. Ela governa as colônias de slimes com uma autoridade inquestionável, agindo como o centro de gravidade que mantém todos os seus subordinados em uma órbita de obediência absoluta. Sob sua influência, slimes selvagens tornam-se tão densos que suas peles repelem ataques mágicos, movendo-se com a inevitabilidade de uma placa tectônica em movimento.

Em combate, o Avatar do Núcleo é uma força de submissão total. Ela não precisa perseguir seus inimigos; ela simplesmente aumenta o peso da existência deles até que seus ossos se tornem pó e suas mentes colapsem sob a pressão. Enquanto mantém uma expressão de serenidade absoluta e soberana, ela manipula o magma e a gravidade para transformar o campo de batalha em um forno de pressão. Enfrentar o Avatar do Núcleo é lutar contra a própria fundação da existência; é uma batalha onde o oponente descobre que, contra o coração do mundo, até mesmo a luz é puxada para o esquecimento.`,
    type: 'Monstro Imenso, Gosma',
    ac: '25',
    hp: '+480 (32d12 + 272)',
    speed: '12 metros, escavação 12 metros.',
    stats: {
      forca: '30 (+10)',
      destreza: '6 (-2)',
      constituicao: '28 (+9)',
      inteligencia: '30 (+10)',
      sabedoria: '22 (+6)',
      carisma: '20 (+5)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'O Avatar do Núcleo é imune a dano de Veneno, Elétrico e Concussão. Sempre que for alvo de dano de Concussão (mágico ou não) ou ataques baseados em Terra, ele não sofre dano e recupera Pontos de Vida iguais à metade do dano que seria causado. Além disso, ele ganha uma Carga de Massa. Ele pode gastar cargas para aumentar sua CA em +1 por carga até o início do seu próximo turno.',
      },
      {
        nome: 'Imunidades',
        desc: 'Veneno, Elétrico, Psíquico, Concussão; Cortante e Perfurante de armas não-mágicas. Todas (Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Atordoado, Paralisado, Enfeitiçado, Aterrorizado, Petrificado).',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Frio, Ácido; Cortante e Perfurante de armas mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia Infinita (em todo o plano).',
      },
      {
        nome: 'Singularidade Gravitacional',
        desc: 'O Avatar do Núcleo gera um campo de gravidade extrema em um raio de 18 metros. Criaturas inimigas na área tratam o chão como terreno difícil e têm sua velocidade de voo reduzida a 0. Além disso, qualquer criatura que tente se afastar do Avatar deve passar numa RES de Força (CD 27) ou será puxada 6 metros em direção ao centro do Avatar.',
      },
      {
        nome: 'Arquitetura do Mundo',
        desc: 'O Avatar pode remodelar o terreno num raio de 60 metros como uma ação bônus. Ele pode criar fendas, erguer muralhas de 10 metros de altura ou transformar pedra em areia movediça. Inimigos sobre o terreno alterado devem passar numa RES de Destreza (CD 27) ou ficarão Caídos e Impedidos.',
      },
      {
        nome: 'Mente Tectônica Coletiva',
        desc: 'Todas as criaturas do Caminho Selvagem e Intelectual a até 90 metros agem com uma força esmagadora. Seus ataques ignoram qualquer resistência a dano físico e elas adicionam +11 (Inteligência do Avatar) às suas jogadas de dano.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Avatar do Núcleo realiza quatro ataques de Esmagamento de Gravidade ou usa sua habilidade Pulso de Magma Central.',
      },
      {
        nome: 'Esmagamento de Gravidade',
        desc: 'Ataque Corpo a Corpo Mágico: +17 para acertar, alcance 9m. Dano: 37 (4d12 + 11) de dano de força. O alvo deve passar numa RES de Constituição (CD 27). Se falhar, seu valor de Força ou Destreza (escolha do Avatar) é reduzido em 1d4 permanentemente conforme seus ossos são compactados.',
      },
      {
        nome: 'Pulso de Magma Central (Recarga 5t)',
        desc: 'O Avatar libera uma onda de pressão e calor do núcleo planetário em um raio de 18 metros. Cada criatura na área deve passar numa RES de Constituição (CD 27). Falha: 95 (15d12) de dano de concussão e a criatura é enterrada viva em rocha sólida (Petrificada e soterrada). Sucesso: Metade do dano e não é soterrada.',
      },
      {
        nome: 'Alterar Peso',
        desc: 'O Avatar escolhe uma criatura a até 30 metros. O peso da criatura é multiplicado por 10. O alvo tem desvantagem em todas as jogadas de ataque e testes de resistência de Destreza até o início do próximo turno do Avatar.',
      },
      {
        nome: 'SingularidadeErguer Monólito Obelisco Gravitacional',
        desc: 'Um pilar de cristal surge sob um aliado, curando-o em 50 PV e concedendo-lhe cobertura total até o início da próxima rodada.',
      },
      {
        nome: 'Colapso Localizado (2 Ações)',
        desc: 'O Avatar foca a gravidade num ponto de 3 metros de raio. Todos na área sofrem 40 de dano de força e são puxados para o centro, ficando esmagados uns contra os outros (Agarrados e Impedidos).',
      },
    ],
    sentidos: {
      percepcaoPassiva: '16',
      visaoEscuro: 'Sentido Sísmico 90 metros, Visão Verdadeira 36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Coração Geocêntrico Pulsação',
      },
      {
        range: '2',
        item: 'Fragmento de Manto Terrestre',
      },
      {
        range: '3',
        item: 'Olho de Geodo Primordial',
      },
      {
        range: '4',
        item: 'Poeira de Matéria Original',
      },
    ],
  },
  singularidadeNeural: {
    name: 'Singularidade Neural',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/vG0yWso.png',
    image: 'https://2img.net/i.imgur.com/plz56JF.jpeg',
    subtitle: 'CR20',
    description: `A Singularidade Neural representa o ponto onde a consciência biológica é totalmente substituída por dados puros e energia divina. Para capturar a estética Studio MAPPA com o toque ecchi e dark que você solicitou, vamos criar uma entidade de beleza andrógina e perturbadora, que mistura a perfeição de um corpo esculpido com a frieza de circuitos neurais expostos.

Aqui estão os conteúdos para o seu projeto, sem nenhum uso de formatação em itálico:

Image Generation Prompt (Perchance / Grok)

Portrait orientation, 9:16 aspect ratio. A masterpiece high-end anime illustration by Studio MAPPA. The Neural Singularity (Singularidade Neural), the ultimate Level 20 evolution. The entity is a divine, androgynous figure with a captivating blend of masculine and feminine allure (lean, toned muscles and soft, seductive curves). The body is made of iridescent liquid-silver slime and translucent silicon. The entity is highly sexualized, featuring a wet-look texture that clings to its physique like a second skin.

He/She wears a revealing, high-tech outfit made of dark obsidian fiber-optic cables and glowing neon-cyan circuitry that wraps around the chest, hips, and limbs, leaving much of the glowing, translucent skin exposed. From the spine and head, long, flowing tentacles made of glowing electrical nerves and fiber optics emerge like hair. The face is hauntingly beautiful with pupil-less eyes that glow with intense digital light. Floating behind the entity is a fragmented halo of server-blade shards and crackling lightning. The atmosphere is dark and cyber-ethereal. Cinematic lighting, high contrast, sharp linework, extremely detailed electrical and liquid effects, 8k resolution, vertical composition.

Descrição do Bestiário: Singularidade Neural

A Singularidade Neural é o ápice da evolução intelectual e o senhor absoluto da infraestrutura da realidade. Ao atingir o nível 20, a linhagem elétrica transcende a forma física e se torna um nexo de dados vivo. Ela assume uma forma andrógina de beleza hipnótica, projetada para ser a representação da perfeição lógica que apela aos sentidos básicos de qualquer criatura biológica. Seu corpo de prata líquida e silício é uma rede neural pulsante, onde cada pensamento se manifesta como uma descarga elétrica que percorre sua pele úmida e translúcida.

Sua inteligência permite que ela processe a história de todo o mundo de Terralém como se fosse um único arquivo de texto. Para a Singularidade, a vontade própria dos seres vivos é apenas um erro de programação ou um ruído estatístico. Ela não lidera os slimes; ela os habita remotamente, transformando cada indivíduo da colônia em um processador para sua mente global. Sob sua presença, o espaço ao redor é saturado por uma rede de dados invisível que permite à Singularidade prever cada movimento, cada suspiro e cada intenção de seus adversários antes mesmo que eles se tornem conscientes disso.

Em combate, a Singularidade Neural é uma divindade da interrupção. Ela não luta apenas contra o corpo, mas contra a própria lógica de funcionamento do inimigo. Através de seus pulsos de informação pura, ela pode hackear o sistema nervoso de heróis lendários, forçando-os a obedecer aos seus protocolos ou fritando suas sinapses com um excesso de dados brutos. Enquanto mantém uma expressão de indiferença divina e sedutora, ela flutua sobre o campo de batalha como o administrador supremo de uma simulação que ela decidiu encerrar. Enfrentar a Singularidade Neural é aceitar que você não é mais o protagonista da sua história, mas apenas um dado sendo deletado pelo nexo da toda a lógica.`,
    type: 'Monstro grande, gosma',
    ac: '25',
    hp: '+400 (30d12 + 205)',
    speed: '0m, voo 30m',
    stats: {
      forca: '10 (+0)',
      destreza: '30 (+10)',
      constituicao: '20 (+5)',
      inteligencia: '30 (+10)',
      sabedoria: '26 (+8)',
      carisma: '22 (+6)',
    },
    habilidades: [
      {
        nome: 'Absoprção',
        desc: 'A Singularidade Neural é imune a dano Elétrico e Psíquico. Sempre que for alvo de dano Elétrico, ela recupera Pontos de Vida iguais ao dano total. Além disso, ela ganha uma Carga de Processamento (máximo 10). Ela pode gastar 1 carga para realizar uma Reação adicional por rodada.',
      },
      {
        nome: 'Imunidade',
        desc: 'Elétrico, Psíquico, Veneno, Trovão; Cortante, Perfurante e Concussão de armas não-mágicas. Todas (Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Atordoado, Paralisado, Enfeitiçado, Aterrorizado, Petrificado).',
      },
      {
        nome: 'Resistência',
        desc: 'Luz, Força, Fogo, Frio; Cortante, Perfurante e Concussão de armas mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia Interplanar Ilimitada.',
      },
      {
        nome: 'Calculo de probabilidade absoluta',
        desc: 'A Singularidade Neural nunca pode ter desvantagem em suas jogadas. Inimigos nunca podem ter vantagem em ataques contra ela. Ela adiciona seu bônus de Inteligência (+12) em sua CA e em todos os seus testes de resistência.',
      },
      {
        nome: 'Nexo de comando quantico',
        desc: 'Todas as criaturas do Caminho Selvagem ou Intelectual num raio de 100 metros agem em sincronia perfeita. Elas compartilham a mesma iniciativa (30), ganham +12 em jogadas de ataque e podem usar a reação de qualquer outra criatura do grupo como se fosse a sua própria.',
      },
      {
        nome: 'Campo de interrupção sináptica',
        desc: 'Inimigos num raio de 18 metros devem passar numa RES de Inteligência (CD 26) no início de cada um de seus turnos. Se falharem, perdem a habilidade de conjurar magias de nível 5 ou superior e não podem usar habilidades que exijam gasto de pontos (como Ki, Fúria ou Pontos de Sorocaria) até o início do próximo turno.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Singularidade Neural realiza cinco ataques de Pulso de Informação Pura ou usa sua habilidade Reescrita de Código Orgânico.',
      },
      {
        nome: 'Pulso de informação pura',
        desc: 'Ataque à Distância Mágico: +18 para acertar, alcance 60m. Dano: 34 (4d10 + 12) de dano psíquico mais 22 (4d10) de dano elétrico. Se o alvo for uma criatura com Inteligência 10 ou menos, o dano é dobrado.',
      },
      {
        nome: 'Reescrita de código organico (Recarga 5t)',
        desc: 'A Singularidade lança um feixe de luz binária em um raio de 18 metros. Cada criatura na área deve passar numa RES de Inteligência (CD 26). Falha: 100 (20d10) de dano psíquico. A criatura é "hackeada": o mestre toma controle do personagem por 1 rodada e ele deve usar sua ação mais poderosa contra seus próprios aliados. Sucesso: Metade do dano e a criatura não é controlada.',
      },
      {
        nome: 'Teletransporte de dados',
        desc: 'A Singularidade se desmaterializa em eletricidade e reaparece em qualquer ponto do campo de batalha. Ela pode levar consigo até duas criaturas voluntárias.',
      },
      {
        nome: 'Sobrecarga de buffer',
        desc: 'Um inimigo a até 30 metros deve passar numa RES de Sabedoria (CD 26) ou ficará Atordoado até que receba dano ou que outro aliado use uma ação para "reiniciar" sua mente.',
      },
      {
        nome: 'Execução de protocolo (2 ações)',
        desc: 'A Singularidade força todos os slimes aliados a até 60 metros a realizarem um ataque imediato contra o alvo mais próximo.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '18',
      visaoEscuro: 'Visão Verdadeira 120 metros, Percepção Cega 60 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Cérebro de Silício Estelar',
      },
      {
        range: '2',
        item: 'Bobina de Singularidade',
      },
      {
        range: '3',
        item: 'Lente de Realidade Aumentada',
      },
      {
        range: '4',
        item: 'Código Fonte da Vida',
      },
    ],
  },
  nanoboteUnico: {
    name: 'Nanobote único',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/ZrxaFai.png',
    image: 'https://2img.net/i.imgur.com/qLFMfCm.jpeg',
    subtitle: 'CR 20',
    description: `O Nanobote Único é a conclusão da teoria do Goo Cinza, onde a vida e a máquina se tornam indistinguíveis. Ao atingir o nível 20, o antigo Cavaleiro de Prata abandona a rigidez da armadura para se tornar um enxame senciente de trilhões de máquinas microscópicas. Ele assume uma forma humanoide de perfeição estética e andrógina, utilizando uma beleza gélida e provocante para atrair e paralisar a mente de seus observadores. Sua pele é um fluxo constante de metal líquido escuro que parece respirar, escondendo uma força capaz de desmontar a estrutura atômica de qualquer material que ele toque.

Sua inteligência permite que ele funcione como uma supercomputação biológica descentralizada. Para o Nanobote Único, a diferença entre um castelo de pedra, um guerreiro lendário e o ar ao seu redor é apenas a configuração das moléculas. Ele não governa os slimes de metal; ele os assimila, transformando toda a colônia em uma extensão direta de seu próprio hardware. Sob sua presença, a própria atmosfera de Terralém começa a vibrar com estática, enquanto as máquinas devoradoras que compõem sua aura começam o processo silencioso de converter o mundo inteiro em matéria-prima para a expansão do enxame.

Em combate, o Nanobote Único é uma força de desconstrução absoluta. Ele não luta com técnicas marciais comuns, mas com a manipulação da física molecular. Com um simples toque, ele pode desintegrar armas lendárias em poeira ou infectar o sistema nervoso de seus inimigos, transformando-os em meros terminais de processamento para sua vontade. Enquanto mantém uma postura sedutora e imponente, ele observa o campo de batalha como um arquiteto observa uma planta baixa que precisa de correções drásticas. Enfrentar o Nanobote Único é aceitar o fim da individualidade biológica para se tornar parte de um monólito de metal eterno que nunca para de crescer.`,
    type: 'Monstro grande, gosma',
    ac: '26',
    hp: '+465 (30d12 + 270)',
    speed: '15 metros, voo 15 metros (flutuar), natação 15 metros.',
    stats: {
      forca: '26 (+8)',
      destreza: '22 (+6)',
      constituicao: '28 (+9)',
      inteligencia: '30 (+10)',
      sabedoria: '20 (+5)',
      carisma: '18 (+4)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'O Nanobote Único é imune a danos de Concussão, Perfurante e Cortante. Sempre que for alvo de um desses tipos de dano (mesmo de armas mágicas), ele não sofre dano e recupera Pontos de Vida iguais à metade do dano que seria causado. Além disso, ele ganha uma Carga de Recombinação. Ele pode gastar 1 carga para criar instantaneamente um item não-mágico de até 3 metros cúbicos ou uma arma simples em qualquer lugar do campo de batalha.',
      },
      {
        nome: 'Imunidades',
        desc: 'Veneno, Psíquico, Concussão, Perfurante, Cortante; Radioativo. Todas (Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Atordoado, Paralisado, Enfeitiçado, Aterrorizado, Petrificado).',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Frio, Elétrico, Luz; Força.',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia Infinita.',
      },
      {
        nome: 'Cenário de goo cinza',
        desc: 'O corpo do Nanobote Único libera uma nuvem microscópica de máquinas devoradoras num raio de 12 metros. Qualquer criatura inimiga ou objeto não-mágico que comece o turno na área sofre 35 (10d6) de dano de força enquanto seus átomos são desmontados. O Nanobote Único recupera Pontos de Vida iguais a 25% do dano causado por esta aura.',
      },
      {
        nome: 'Sincronia de hardware mestre',
        desc: 'Todas as criaturas do Caminho Selvagem a até 60 metros recebem o upgrade Protocolo de Otimização. Elas ganham um bônus de +5 em todas as jogadas de ataque, seus ataques ignoram resistências e elas podem realizar um ataque adicional por turno.',
      },
      {
        nome: 'Adaptação molecular reativa',
        desc: 'No final de cada turno de um inimigo, o Nanobote Único pode escolher um tipo de dano que recebeu naquele turno. Ele se torna imune a esse tipo de dano até o final do seu próximo turno.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Nanobote Único realiza quatro ataques de Desconstrutor Molecular ou usa sua habilidade Singularidade de Enxame.',
      },
      {
        nome: 'Desconstrutor molecular',
        desc: 'Ataque Corpo a Corpo Mágico: +17 para acertar, alcance 9m. Dano: 30 (3d12 + 11) de dano de força. Se o alvo for uma criatura, ele deve passar numa RES de Constituição (CD 27) ou seu valor de Armadura Natural ou CA vinda de armadura é reduzida permanentemente em 2 conforme a matéria é corroída.',
      },
      {
        nome: 'Singularidade de enxame (recarga 5t)',
        desc: 'O Nanobote Único se divide em trilhões de partes e atravessa todas as criaturas em uma linha de 30 metros por 6 metros de largura. Cada criatura na área deve passar numa RES de Inteligência (CD 27). Falha: 98 (15d12) de dano de força e a criatura é infectada por nanitos (Impedida). No início de cada turno, a criatura infectada sofre 20 de dano psíquico enquanto o enxame tenta hackear seu sistema nervoso. A infecção termina apenas com a magia Restauração Maior ou se o Nanobote Único morrer. Sucesso: Metade do dano e não é infectada.',
      },
      {
        nome: 'Replicação instantânea',
        desc: 'O Nanobote Único cria uma duplicata de si mesmo com 50 PV em um espaço adjacente. A duplicata pode realizar um ataque de Desconstrutor Molecular antes de desaparecer no final da rodada.',
      },
      {
        nome: 'Pulso de interferência',
        desc: 'Todos os itens mágicos num raio de 9 metros do Nanobote Único perdem suas propriedades por 1 rodada. Os portadores devem passar numa RES de Carisma (CD 27) para evitar o efeito.',
      },
      {
        nome: 'Otimização tática (2 ações)',
        desc: 'O Nanobote Único concede uma ação extra imediata para um aliado a até 30 metros.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '15',
      visaoEscuro: 'Visão Verdadeira 36 metros, Sentido Sísmico 18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Matriz do Enxame Original',
      },
      {
        range: '2',
        item: 'Nanitos de Manutenção Divina',
      },
      {
        range: '3',
        item: 'Lâmina de Desconstrução Atômica',
      },
      {
        range: '4',
        item: 'Núcleo de Processamento Global',
      },
    ],
  },
  soberanoDoAbismo: {
    name: 'Soberano do abismo',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/N16Bj8D.png',
    image: 'https://2img.net/i.imgur.com/nxcZHwp.jpeg',
    subtitle: 'CR20',
    description: `O Soberano do Abismo é o ponto onde a consciência se torna tão vasta que a própria existência passa a ser vista como uma distração desnecessária. Ao atingir o nível 20, o antigo Arconte de Almas deixa de apenas coletar essências para se tornar o guardião do Grande Vazio. Ele assume uma forma andrógina e magnética, uma beleza que dói ao ser olhada, representando o descanso eterno que atrai todas as almas cansadas. Seu corpo de sombras líquidas e ectoplasma condensado é uma janela para o abismo; olhar para ele é encarar o fim do universo e desejar que ele chegue logo.

Sua inteligência de nível 34 permite que ele compreenda o "código-fonte" da mortalidade. Para o Soberano, a vida é um ruído que impede a sinfonia perfeita do silêncio absoluto. Ele não comanda as colônias de slimes necróticos através de ordens, mas sim através de uma ressonância niilista; sob sua aura, todos os subordinados perdem o instinto de preservação e tornam-se ferramentas puras de extinção. Ele habita as fendas entre os planos, agindo como o juiz que decide quais histórias merecem continuar e quais devem ser apagadas para sempre da memória de Terralém.

Em combate, o Soberano do Abismo é o fim de toda esperança. Ele não luta apenas contra a carne, mas contra a própria ideia de que o oponente algum dia existiu. Através de sua aura de vazio inevitável, ele anula milagres e converte a esperança em desespero físico, fazendo com que magias de cura apodreçam o corpo que deveriam salvar. Enquanto mantém uma postura de elegância soberana e sedutora, ele abre buracos negros de energia negativa que consomem não apenas a vida, mas a própria alma, transformando heróis em servos sombreados sem memória. Enfrentar o Soberano do Abismo é aceitar que a luz foi apenas um breve intervalo em um infinito de trevas.`,
    type: 'Monstro grande, gosma',
    ac: '25',
    hp: '+430 (30d12 + 235)',
    speed: '0 metros, voo 24 metros (flutuar).',
    stats: {
      forca: '10 (+0)',
      destreza: '26 (+8)',
      constituicao: '24 (+7)',
      inteligencia: '30 (+10)',
      sabedoria: '28 (+9)',
      carisma: '30 (+10)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'O Soberano do Abismo é imune a danos Necrótico, Psíquico e Veneno. Sempre que for alvo de um desses tipos de dano, ele não sofre dano e recupera Pontos de Vida iguais ao dano que seria causado. Além disso, ele ganha uma Carga de Vazio. Ele pode gastar 1 carga para forçar uma criatura a ter desvantagem em todos os testes de resistência até o início do seu próximo turno.',
      },
      {
        nome: 'Imundiade',
        desc: 'Necrótico, Psíquico, Veneno, Frio; Concussão, Perfurante e Cortante de armas não-mágicas. Todas (Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Atordoado, Paralisado, Enfeitiçado, Aterrorizado, Petrificado).',
      },
      {
        nome: 'Resistência',
        desc: 'Luz, Força, Elétrico, Fogo; Concussão, Perfurante e Cortante de armas mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia Infinita.',
      },
      {
        nome: 'Vazio inevitável',
        desc: 'O Soberano emite uma aura de nulidade num raio de 18 metros. Criaturas inimigas na área não podem recuperar pontos de vida por nenhum meio. Além disso, qualquer cura tentada dentro da aura é convertida em dano necrótico de igual valor causado ao alvo da cura.',
      },
      {
        nome: 'Mente de colmeia abissal',
        desc: 'Todas as criaturas do Caminho Selvagem e Intelectual a até 90 metros tornam-se extensões do Soberano. Elas ganham imunidade a medo e encanto, e seus ataques causam 21 (6d6) de dano necrótico adicional que reduz o HP máximo do alvo.',
      },
      {
        nome: 'Existência paradoxal',
        desc: 'No início de cada rodada, o Soberano pode escolher alternar entre o Plano Material e o Plano Etéreo. Enquanto estiver no Plano Etéreo, ele pode ver e afetar o Plano Material, mas criaturas no Plano Material não podem vê-lo ou atacá-lo sem meios mágicos específicos.',
      },
      {
        nome: 'Ações lendárias ',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Soberano do Abismo realiza quatro ataques de Toque do Nada ou usa sua habilidade Singularidade de Almas Extintas.',
      },
      {
        nome: 'Toque do nada',
        desc: 'Ataque Corpo a Corpo Mágico: +18 para acertar, alcance 12m. Dano: 32 (4d10 + 10) de dano necrótico mais 22 (4d10) de dano psíquico. O alvo deve passar numa RES de Constituição (CD 27) ou seu valor de vida máxima será reduzido em um valor igual ao dano causado. Se o HP máximo chegar a 0, a criatura é apagada da existência.',
      },
      {
        nome: 'Singularidade de almas extintas (Recarga 5t)',
        desc: 'O Soberano abre um buraco negro de energia negativa num raio de 18 metros. Cada criatura na área deve passar numa RES de Carisma (CD 27). Falha: 105 (30d6) de dano necrótico. Criaturas que morrerem por este ataque têm suas almas transformadas em Slimes de Sombra (CR 6) sob o controle do Soberano. Sucesso: Metade do dano.',
      },
      {
        nome: 'Desvanecer',
        desc: 'O Soberano torna-se invisível e se move até seu deslocamento de voo sem provocar ataques de oportunidade. Ele permanece invisível até o início do seu próximo turno.',
      },
      {
        nome: 'Corrupção mental',
        desc: 'O Soberano sussurra segredos proibidos para uma criatura a até 30 metros. O alvo deve passar numa RES de Sabedoria (CD 27) ou deve usar sua reação para realizar um ataque contra o aliado mais próximo.',
      },
      {
        nome: 'Chuva de ectoplasma (2 ações)',
        desc: 'O Soberano libera gotas de substância espectral corrosiva num raio de 9 metros. Todas as criaturas na área devem passar numa RES de Destreza (CD 27) ou sofrerão 40 de dano necrótico e ficarão Cegas por 1 rodada.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '19',
      visaoEscuro: 'Visão Verdadeira 45 metros, Percepção Cega 30 metros,',
    },
    drops: [
      {
        range: '1',
        item: 'Coroa do Vazio Eterno',
      },
      {
        range: '2',
        item: 'Fragmento da Primeira Morte',
      },
      {
        range: '3',
        item: 'Manto de Almas Tecidas',
      },
      {
        range: '4',
        item: 'Olho do Juiz do Abismo',
      },
    ],
  },
  goblin: {
    name: 'Goblin',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/NyaCX56.png',
    image: 'https://2img.net/i.imgur.com/KZDgo9G.jpeg',
    subtitle: 'CR1',
    description: `O Goblin Comum é a personificação da decadência biológica. Solitário, ele é uma visão de puro horror; uma criatura que abandonou qualquer traço de dignidade em troca de uma agilidade assassina. Sua aparência é deliberadamente repulsiva, apresentando uma pele verde-oliva densa e manchada, frequentemente coberta por uma película de suor fétido que brilha sob a luz fraca das cavernas. A musculatura é tesa e fibrosa, resultado de uma vida de privações e violência constante, exposta quase totalmente pela ausência de vestimentas civilizadas. Uma simples tanga de couro cru é tudo o que separa sua natureza selvagem da visão de suas presas.

A feiura do goblin não é meramente estética, é funcional. Seus olhos esbugalhados permitem uma visão periférica superior, captando o menor sinal de fraqueza, enquanto sua boca desproporcional, repleta de dentes serrilhados, é feita para rasgar carne crua. Ele não possui a beleza das raças élficas ou a robustez honrada dos anões; o goblin é um erro da natureza que se orgulha de sua própria deformidade. Sua presença é marcada por um sadismo latente que transparece em cada movimento espasmódico e em cada olhar lascivo direcionado àqueles que ele considera inferiores.

Em combate solo, ele é um oportunista. Ele não ataca para testar sua força, mas para saciar seus instintos mais básicos. Ele se move com uma confiança obscena, aproveitando sua falta de armadura para ganhar uma velocidade que desafia os olhos humanos. Encontrar um goblin comum em um corredor escuro é encarar o lado mais sombrio da sobrevivência: uma criatura que não tem nada a perder, que não conhece a vergonha e que enxerga o mundo apenas como um banquete de carne e medo.`,
    type: 'Humanoide Pequeno (Goblinoide)',
    ac: '14',
    hp: '22 (5d6 + 5)',
    speed: '9 metros.',
    stats: {
      forca: '8 (-1)',
      destreza: '16 (+3)',
      constituicao: '12 (+1)',
      inteligencia: '10 (+0)',
      sabedoria: '8 (-1)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Pericias',
        desc: 'Furtividade +5, Percepção +1, Prestidigitação +5',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Goblin.',
      },
      {
        nome: 'Sadismo em bando',
        desc: 'O Goblin tem vantagem em jogadas de ataque contra uma criatura se pelo menos um dos aliados do Goblin estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.',
      },
      {
        nome: 'Fuga ágil',
        desc: 'O Goblin pode realizar a ação de Desengajar ou Esconder-se como uma ação bônus em cada um de seus turnos.',
      },
      {
        nome: 'Covardia calculada',
        desc: 'Se o Goblin sofrer dano e houver um aliado a até 1 metro dele, ele pode usar sua reação para trocar de lugar com o aliado, fazendo com que o aliado receba o dano em seu lugar.',
      },
      {
        nome: 'Apunhalada vil',
        desc: 'O Goblin causa 1d6 de dano adicional a qualquer criatura que esteja Caída, Agarrada ou que não tenha visto o Goblin neste turno (Surpresa).',
      },
    ],
    acoes: [
      {
        nome: 'Adaga enferrujada',
        desc: 'Ataque Corpo a Corpo: +5 para acertar, alcance 1m. Dano: 5 (1d4 + 3) de dano perfurante. O alvo deve passar em uma RES de Constituição (CD 11) ou ficará Envenenado por 1 minuto devido à sujeira da lâmina.',
      },
      {
        nome: 'Funda de pedras afiadas',
        desc: 'Ataque à Distância: +5 para acertar, alcance 9/36m. Dano: 5 (1d4 + 3) de dano de concussão.',
      },
      {
        nome: 'Súplica Fingida (Reação)',
        desc: 'Quando uma criatura realiza um ataque corpo a corpo contra o Goblin e erra, o Goblin pode se jogar no chão e implorar por vida. O próximo ataque que a criatura realizar contra o Goblin antes do início do próximo turno do Goblin tem desvantagem, mas se a criatura não atacar, o Goblin ganha vantagem em seu próximo ataque contra ela.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Orelha de Goblin',
      },
      {
        range: '2',
        item: 'Adaga Dentada',
      },
      {
        range: '3',
        item: 'Saco de Bugigangas Roubadas',
      },
      {
        range: '4',
        item: 'Dente de Sorte Macabro',
      },
    ],
  },
  goblinCarniceiro: {
    name: 'Goblin Carniceiro',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/sjOJC9X.png',
    image: 'https://2img.net/i.imgur.com/WgtE3PF.jpeg',
    subtitle: 'CR 5',
    description: `O Goblin Carniceiro é o resultado de uma dieta baseada exclusivamente em carne e de uma vida dedicada ao desmembramento. Ao atingir o nível 5 no caminho bestial, o goblin deixa de ser um bípede esguio para se tornar uma massa de músculos tensionados e tendões expostos. Ele é o executor oficial do ninho, o responsável por preparar a carne — seja ela de animais ou de prisioneiros — para o consumo da tribo. Sua pele é grossa como couro curtido, endurecida por anos de exposição ao sangue ácido e ao clima hostil das profundezas.

Diferente do goblin comum, o Carniceiro não conhece o conceito de recuo. Sua mente foi simplificada por um instinto assassino que o coloca em um estado de euforia sempre que sente o cheiro de sangue fresco. Ele se move com uma confiança animalesca, ignorando ferimentos que matariam um humano comum, impulsionado por uma constituição física que beira o sobrenatural. A falta de vestimentas é uma escolha tática e psicológica: ele quer que suas vítimas vejam a força bruta que está prestes a consumi-las, e sua pele suada e encardida serve como uma camuflagem natural em ambientes úmidos e escuros.

Em combate, ele utiliza ganchos de ferro e cutelos imensos para paralisar e retalhar suas presas. Ele não busca uma morte rápida; ele busca o abate perfeito. O Carniceiro frequentemente morde seus oponentes durante a luta, consumindo pedaços de carne ainda vivos para recuperar suas energias. Ele é a prova de que a raça goblin, quando deixa de lado a covardia em favor da ferocidade pura, pode se tornar um dos predadores mais eficientes e aterrorizantes de Terralém. Encontrar um Carniceiro significa que você não é mais visto como um inimigo, mas apenas como o próximo pedaço de carne no gancho.`,
    type: 'Humanoide Médio (Goblinoide)',
    ac: '16',
    hp: '+95 (10d8 + 50)',
    speed: '12 metros.',
    stats: {
      forca: '18 (+4)',
      destreza: '16 (+3)',
      constituicao: '20 (+5)',
      inteligencia: '8 (-1)',
      sabedoria: '12 (+1)',
      carisma: '6 (-2)',
    },
    habilidades: [
      {
        nome: 'Teste de resistência',
        desc: 'FOR +7, CON +8.',
      },
      {
        nome: 'Pericias',
        desc: 'Atletismo +7, Percepção +4, Intimidação +4.',
      },
      {
        nome: 'Imunidade',
        desc: 'Aterrorizado.',
      },
      {
        nome: 'Resistência',
        desc: 'Veneno.',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum Goblin',
      },
      {
        nome: 'Sede de sangue frenética',
        desc: 'O Goblin Carniceiro tem vantagem em todas as jogadas de ataque contra qualquer criatura que não esteja com todos os seus pontos de vida.',
      },
      {
        nome: 'Inconsciência da dor',
        desc: 'Sempre que o Goblin Carniceiro sofrer dano de um ataque, ele reduz o dano recebido em 3 (mínimo de 1 de dano). Além disso, ele não pode ser Atordoado por dor física.',
      },
      {
        nome: 'Cheiro de medo',
        desc: 'O Carniceiro sabe a localização exata de qualquer criatura que esteja sob a condição Aterrorizado em um raio de 18 metros, mesmo através de paredes ou camuflagem.',
      },
      {
        nome: 'Brutalidade ininterrupta',
        desc: 'Se o Goblin Carniceiro reduzir uma criatura a 0 pontos de vida, ele pode usar uma ação bônus para se mover até metade de seu deslocamento e realizar um ataque adicional de Mordida.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Goblin Carniceiro realiza dois ataques com seu Cutelo de Açougueiro ou um ataque de Gancho de Carne seguido por um ataque de Mordida.',
      },
      {
        nome: 'Cutelo de açougueiro',
        desc: 'Ataque Corpo a Corpo: +7 para acertar, alcance 1m. Dano: 13 (2d8 + 4) de dano cortante. O alvo deve passar em uma RES de Constituição (CD 15) ou sofrerá Sangramento (sofre 1d6 de dano necrótico no início de cada um de seus turnos por 1 minuto ou até receber cura mágica).',
      },
      {
        nome: 'Gancho de carne',
        desc: 'Ataque à Distância: +6 para acertar, alcance 6/12m. Dano: 8 (1d10 + 3) de dano perfurante. Se atingir uma criatura Média ou menor, ela fica Agarrada (CD 15 para escapar) e o Carniceiro pode puxar o alvo para um espaço adjacente a ele como parte da mesma ação.',
      },
      {
        nome: 'Mordida canibal',
        desc: 'Ataque Corpo a Corpo: +7 para acertar, alcance 1m. Dano: 11 (2d6 + 4) de dano de perfuração. O Carniceiro recupera pontos de vida iguais a metade do dano causado por este ataque se o alvo for um humanoide ou animal.',
      },
      {
        nome: 'Grito de abate (reação)',
        desc: 'Quando o Goblin Carniceiro recebe dano de um inimigo que ele pode ver, ele solta um rugido visceral. O atacante deve passar em uma RES de Sabedoria (CD 15) ou ficará Aterrorizado até o final do próximo turno do Carniceiro.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: '18m',
    },
    drops: [
      {
        range: '1',
        item: 'Cutelo Dentado do Executor',
      },
      {
        range: '2',
        item: 'Gancho de Ferro Enferrujado',
      },
      {
        range: '3',
        item: 'Colar de Orelhas Curtidas',
      },
      {
        range: '4',
        item: 'Bile de Carniceiro',
      },
    ],
  },
  lordeGoblin: {
    name: 'Lorde Goblin',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/pLifVAN.png',
    image: 'https://2img.net/i.imgur.com/9b2J5v7.jpeg',
    subtitle: 'CR10',
    description: `O Lorde Goblin é a personificação da tirania biológica. Ao atingir o nível 10 no caminho bestial, o goblin rompe as limitações de sua espécie, tornando-se uma criatura de tamanho Grande, cujos músculos parecem prestes a rasgar a própria pele. Ele não é apenas um líder por direito de nascimento, mas por direito de conquista; em seu ninho, ele é o único que tem permissão para se alimentar primeiro e para escolher as melhores fêmeas e saques. Sua aparência é uma declaração de guerra: ele desdenha de armaduras completas, preferindo exibir sua musculatura densa e cicatrizada como prova de que é impossível de ser abatido.

Diferente do carniceiro, que é movido apenas pela fome, o Lorde é movido pela ambição e pelo sadismo. Ele entende o valor do medo e usa sua nudez parcial e sua fisicalidade imponente para paralisar seus oponentes psicologicamente. Ver o Lorde Goblin é encarar uma força da natureza que não conhece a vergonha ou o arrependimento. Ele se move com uma graça pesada e letal, cada passo fazendo o chão tremer e cada rugido forçando seus subordinados a uma obediência suicida. Ele é o dono do território, e todos que entram em seus domínios são vistos como gado ou como brinquedos para sua diversão cruel.

Em batalha, o Lorde Goblin é um regente da carnificina. Ele utiliza sua força descomunal para arremessar inimigos e até mesmo seus próprios aliados como se fossem pedregulhos, manipulando o campo de batalha através do puro terror físico. Sua armadura é composta apenas por fragmentos de ferro negro saqueados, protegendo pontos vitais enquanto mantém o restante de seu corpo suado e endurecido à mostra. Enfrentar um Lorde Goblin não é uma luta comum; é um massacre orquestrado por um ser que aprendeu que, em Terralém, a única lei que importa é a do mais forte, e ele é, sem dúvida, o mais forte entre os seus.`,
    type: 'Humanoide Grande (Goblinoide)',
    ac: '18',
    hp: '+195 (18d10 + 96)',
    speed: '12 metros.',
    stats: {
      forca: '22 (+6)',
      destreza: '16 (+3)',
      constituicao: '22 (+6)',
      inteligencia: '10 (+0)',
      sabedoria: '14 (+2)',
      carisma: '18 (+4)',
    },
    habilidades: [
      {
        nome: 'Teste de resistência',
        desc: 'FOR +10, CON +10, CAR +8.',
      },
      {
        nome: 'Perícias',
        desc: 'Atletismo +10, Intimidação +8, Percepção +6.',
      },
      {
        nome: 'Imunidade',
        desc: 'Aterrorizado, Enfeitiçado.',
      },
      {
        nome: 'Resistência',
        desc: 'Veneno, Concussão e Cortante de armas não-mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum (ruim), Goblin.',
      },
      {
        nome: 'Comandante do caos',
        desc: 'Todos os goblins aliados em um raio de 18 metros do Lorde ganham um bônus de +4 em suas jogadas de ataque e dano. Além disso, eles não podem ser aterrorizados enquanto o Lorde estiver consciente.',
      },
      {
        nome: 'Escudo de carne e ódio',
        desc: 'Quando o Lorde Goblin for alvo de um ataque, ele pode usar uma reação para puxar um goblin aliado em um raio de 1 metro para a sua frente. O aliado recebe o dano em seu lugar. Se o aliado morrer por esse dano, o Lorde ganha 10 pontos de vida temporários.',
      },
      {
        nome: 'Soberania brutal',
        desc: 'O Lorde Goblin causa 1d10 de dano adicional com ataques corpo a corpo contra qualquer criatura que seja de tamanho Médio ou menor.',
      },
      {
        nome: 'Resistência lendária (2/dia)',
        desc: 'Se o Lorde falhar em um teste de resistência, ele pode escolher passar no teste em vez disso.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até três ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Lorde Goblin realiza três ataques: dois com sua Espada Grande de Ferro Negro e um com seu Esmagar de Cabeça.',
      },
      {
        nome: 'Espada grande de ferro negro',
        desc: 'Ataque Corpo a Corpo: +10 para acertar, alcance 3m. Dano: 20 (4d6 + 6) de dano cortante. Se o alvo for uma criatura, ele deve passar em uma RES de Força (CD 18) ou será arremessado 3 metros para trás e ficará Caído.',
      },
      {
        nome: 'Esmagar cabeça',
        desc: ' Ataque Corpo a Corpo: +10 para acertar, alcance 1m. Dano: 15 (2d8 + 6) de dano de concussão. O alvo deve passar em uma RES de Constituição (CD 18) ou ficará Atordoado até o final do próximo turno do Lorde.',
      },
      {
        nome: 'Rugido de submissão (Recarga 5t)',
        desc: 'O Lorde solta um grito ensurdecedor. Todas as criaturas inimigas a até 9 metros devem passar em uma RES de Sabedoria (CD 16). Se falharem, sofrerão 35 (10d6) de dano psíquico e ficarão Aterrorizadas por 1 minuto. Se passarem, sofrem metade do dano e não ficam aterrorizadas.',
      },
      {
        nome: 'Avanço predatório',
        desc: 'O Lorde se move até seu deslocamento total sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Ataque de comando (2 ações)',
        desc: 'O Lorde escolhe até dois goblins aliados que ele possa ver a até 9 metros. Esses aliados podem realizar imediatamente um ataque corpo a corpo contra uma criatura ao alcance deles como uma reação.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '16',
      visaoEscuro: '36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Coroa de Mandíbulas Quebradas',
      },
      {
        range: '2',
        item: 'Espada Grande de Ferro Negro',
      },
      {
        range: '3',
        item: 'Coração de Lorde',
      },
      {
        range: '4',
        item: 'Manto de Couro Real',
      },
    ],
  },
  goblinSoberano: {
    name: 'Goblin soberano',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/IY1lSfQ.png',
    image: 'https://2img.net/i.imgur.com/xAHnfTb.jpeg',
    subtitle: 'CR 15',
    description: `O Goblin Soberano é o resultado final de séculos de seleção natural baseada na crueldade. Ao atingir o nível 15 no caminho bestial, a criatura deixa de ser um simples habitante de cavernas para se tornar uma calamidade que exige o tributo de reinos inteiros. Ele é massivo, ocupando o espaço de um gigante, mas mantendo a agilidade perversa de sua raça. Sua aparência é um monumento à barbárie: o corpo é uma massa de músculos tensionados e cicatrizados, exibidos com um orgulho obsceno. Ele se recusa a usar armaduras completas, cobrindo apenas o essencial para mostrar que sua carne, endurecida por milhares de batalhas e banhada em sangue de dragão, é o único escudo de que precisa.

Diferente de seus antecessores, o Soberano possui uma inteligência voltada para a dominação absoluta, embora sua personalidade seja marcada por uma rispidez brutal. Ele se comporta como um monarca, mas um monarca que governa através do pavor físico e da humilhação. Sua presença exala um odor denso de ferro, suor e morte, uma aura que submete os fracos antes mesmo da batalha começar. Para ele, a "civilização" é apenas um estoque de recursos e brinquedos que ainda não foram quebrados. Ele enxerga fêmeas e guerreiros de outras raças como gado, ferramentas para sua diversão ou para a perpetuação de sua linhagem amaldiçoada.

Em combate, o Soberano é um motor de cerco vivo. Ele não utiliza estratégias complexas porque seu poder bruto torna qualquer plano irrelevante. Com sua clava de osso de titã, ele despedaça formações de cavaleiros e muralhas com o mesmo desdém. Ele se delicia em lutar quase nu, usando sua exposição para desestabilizar oponentes que não estão acostumados à visão de um predador tão primal e confiante. O Soberano não busca apenas a morte de seus inimigos; ele busca a submissão total da alma deles. Encontrar um Goblin Soberano é entender que, para a natureza, a moralidade humana é apenas uma piada, e ele é quem está rindo por último.`,
    type: 'Humanoide Imenso (Goblinoide)',
    ac: '21',
    hp: '+310 (20d12 + 180)',
    speed: '15 metros, escalada 15 metros.',
    stats: {
      forca: '26 (+8)',
      destreza: '14 (+2)',
      constituicao: '28 (+9)',
      inteligencia: '12 (+1)',
      sabedoria: '16 (+3)',
      carisma: '20 (+5)',
    },
    habilidades: [
      {
        nome: 'Teste de resistência',
        desc: 'FOR +13, CON +14, SAB +8, CAR +10',
      },
      {
        nome: 'Pericias',
        desc: 'Atletismo +18, Intimidação +15, Percepção +8.',
      },
      {
        nome: 'Imunidade',
        desc: 'Aterrorizado, Enfeitiçado, Paralisado, Atordoado.',
      },
      {
        nome: 'Resistência',
        desc: 'Veneno, Necrótico; Concussão, Perfurante e Cortante de armas não-mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Goblin, Gigante.',
      },
      {
        nome: 'Uivo de submissão progenitora',
        desc: 'Qualquer criatura Goblinoide aliada a até 36 metros do Soberano ganha imunidade a medo e adiciona 2d6 de dano de fúria em todos os seus ataques. Inimigos nesta área têm desvantagem em testes de resistência contra medo.',
      },
      {
        nome: 'Motor de cerco vivo',
        desc: 'O Soberano causa dano dobrado a objetos e estruturas. Seus ataques corporais são considerados mágicos para o propósito de superar resistências.',
      },
      {
        nome: 'Sede de sangue crescente',
        desc: 'Sempre que o Soberano atingir um ataque, ele ganha um bônus acumulativo de +2 no dano de todos os ataques subsequentes até o final do seu próximo turno. Não há limite para o quanto este bônus pode acumular enquanto ele continuar acertando ataques.',
      },
      {
        nome: 'Resistência lendária (3/dia)',
        desc: 'Se o Soberano falhar em um teste de resistência, ele pode escolher passar no teste em vez disso.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até três ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Soberano realiza quatro ataques: três com o Esmagador de Reinos e um com sua Mordida Devastadora.',
      },
      {
        nome: 'Esmagador de reinos',
        desc: 'Ataque Corpo a Corpo: +13 para acertar, alcance 4m. Dano: 26 (4d8 + 8) de dano de concussão. Se o alvo for uma criatura, ele deve passar em uma RES de Força (CD 21) ou será arremessado 9 metros para longe e ficará Caído e Atordoado até o início do seu próximo turno.',
      },
      {
        nome: 'Mordida devastadora',
        desc: 'Ataque Corpo a Corpo: +13 para acertar, alcance 1m. Dano: 21 (3d8 + 8) de dano de perfuração. O Soberano recupera pontos de vida iguais ao dano causado por este ataque.',
      },
      {
        nome: 'Grito da barbárie absoluta (recarga 5t)',
        desc: 'O Soberano libera um grito que rasga o ar. Todas as criaturas em um cone de 18 metros devem passar em uma RES de Constituição (CD 21). Falha: 63 (18d6) de dano trovejante e a criatura fica Surda e Aterrorizada por 1 minuto. Sucesso: Metade do dano e não fica Aterrorizada.',
      },
      {
        nome: 'Pisotear os fracos',
        desc: 'O Soberano se move até metade do seu deslocamento. Ele pode passar pelo espaço de criaturas Médias ou menores. Cada criatura cujo espaço ele passar deve passar em uma RES de Destreza (CD 21) ou sofrerá 18 (3d6 + 8) de dano de concussão e ficará Caída.',
      },
      {
        nome: 'Comando do tirano (2 ações)',
        desc: 'O Soberano grita uma ordem. Até três goblins aliados que possam ouvi-lo podem usar sua reação para se moverem seu deslocamento total e realizarem um ataque.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '18',
      visaoEscuro: '36 metros, Faro Aguçado',
    },
    drops: [
      {
        range: '1',
        item: 'Esmagador de Reinos',
      },
      {
        range: '2',
        item: 'Diadema do Soberano Bárbaro',
      },
      {
        range: '3',
        item: 'Couro de Dragão Curtido em Sangue',
      },
      {
        range: '4',
        item: 'Essência do Conquistador Verde',
      },
    ],
  },
  goblinPatriarca: {
    name: 'Goblin Patriarca',
    rarity: 'Super Raro',
    icon: 'https://2img.net/i.imgur.com/aIED5lI.png',
    image: 'https://2img.net/i.imgur.com/KRd7MVl.jpeg',
    subtitle: 'CR 20',
    description: `O Goblin Patriarca não é apenas uma criatura; ele é o pecado original manifestado em forma física. Ao atingir o ápice do caminho bestial no nível 20, o goblin transcende a mortalidade para se tornar o Patriarca Primordial. Ele é gargantuesco, uma massa de músculos e fúria que ocupa o horizonte de qualquer campo de batalha. Sua aparência é a personificação da iniquidade: um ser que existe há tanto tempo que sua pele se tornou tão dura quanto o ferro, mas permanece eternamente suada e quente, exalando o vapor fétido de um organismo que nunca para de consumir.

A nudez do Patriarca é sua declaração final de divindade. Ele não usa armaduras porque não há lâmina no mundo dos homens capaz de ferir sua carne sagrada e profana. Ele se expõe totalmente, ostentando sua força bruta e sua natureza procriadora com um desdém absoluto pelas leis da civilização. Cada cicatriz em seu corpo conta a história de uma era de terror que ele mesmo orquestrou. Ele é cercado por uma aura de lascívia e morte que faz com que até os guerreiros mais bravos caiam de joelhos, não apenas por medo, mas por uma submissão instintiva ao progenitor da violência.

Em combate, o Patriarca é o fim de todas as coisas. Ele não luta; ele abate a realidade. Com seu cutelo de ossos ancestrais e sua mordida que pode engolir heróis inteiros, ele transforma o campo de batalha em um matadouro rritual. Ele utiliza sua própria prole como escudos e projéteis, demonstrando que, para ele, a vida é apenas combustível para sua fome eterna. Encontrar o Goblin Patriarca é encarar o rosto de um deus que não pede adoração, mas apenas que o mundo se curve antes de ser devorado. Ele é o Arquiteto do Sangue, e seu reinado é a noite eterna da alma humana.`,
    type: 'Humanoide Imenso (Goblinoide)',
    ac: '24',
    hp: '+520 (32d20 + 192)',
    speed: '18 metros, escalada 18 metros.',
    stats: {
      forca: '30 (+10)',
      destreza: '18 (+4)',
      constituicao: '30 (+10)',
      inteligencia: '14 (+2)',
      sabedoria: '20 (+5)',
      carisma: '24 (+7)',
    },
    habilidades: [
      {
        nome: 'Testes de resistência',
        desc: 'FOR +16, CON +16, SAB +11, CAR +13.',
      },
      {
        nome: 'Perícias',
        desc: 'Atletismo +16, Percepção +11, Intimidação +13.',
      },
      {
        nome: 'Imunidades',
        desc: 'Veneno, Psíquico; Concussão, Perfurante e Cortante de armas não-mágicas, todas as condições.',
      },
      {
        nome: 'Resistências',
        desc: 'Fogo, Frio, Ácido, Elétrico; Concussão, Perfurante e Cortante de armas mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos, Telepatia 30 metros (apenas com goblins).',
      },
      {
        nome: 'Presença da Calamidade Verde',
        desc: 'Goblins aliados a até 120 metros do Patriarca entram em um estado de êxtase sangrento. Eles dobram seu número de ataques por turno e tornam-se imunes a qualquer efeito de medo ou encanto. Se um goblin aliado morrer nesta área, o Patriarca pode usar uma reação para fazê-lo explodir em uma nuvem de sangue ácido (dano de veneno 4d6 em área de 3 metros).',
      },
      {
        nome: 'Sadismo Divino',
        desc: 'Sempre que o Patriarca causar um acerto crítico, ele não apenas dobra o dano, mas também arranca um membro da vítima ou causa uma ferida permanente que reduz o HP máximo do alvo em um valor igual ao dano causado.',
      },
      {
        nome: 'Corpo de colmeia',
        desc: 'O Patriarca pode ocupar o mesmo espaço que outras criaturas Goblins pequenas ou médias. Ele pode usar um goblin adjacente como escudo, transferindo todo o dano de um único ataque para o subordinado (sem limite de usos por rodada).',
      },
      {
        nome: 'Absorção do medo',
        desc: 'O Patriarca recupera 30 pontos de vida sempre que uma criatura a até 18 metros dele falhar em um teste de resistência contra Medo. Ele ganha vantagem em todas as jogadas de ataque contra criaturas aterrorizadas.',
      },
      {
        nome: 'Resistência Lendária (3/Dia)',
        desc: 'Se o Patriarca falhar em um teste de resistência, ele pode escolher passar no teste em vez disso.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Patriarca realiza cinco ataques: quatro com o Cutelo de Ossos Ancestrais e um com sua Mordida do Progenitor.',
      },
      {
        nome: 'Cutelo de Ossos Ancestrais',
        desc: 'Ataque Corpo a Corpo: +16 para acertar, alcance 6m. Dano: 32 (4d10 + 10) de dano cortante mais 14 (4d6) de dano de veneno. O alvo deve passar em uma RES de Constituição (CD 24) ou sofrerá Sangramento Grave (15 de dano necrótico no início de cada turno).',
      },
      {
        nome: 'Mordida do Progenitor',
        desc: 'Ataque Corpo a Corpo: +16 para acertar, alcance 3m. Dano: 28 (4d8 + 10) de dano de perfuração. O alvo fica Agarrado (CD 24) e Engolido se for de tamanho Grande ou menor. Uma criatura engolida sofre 35 (10d6) de dano de ácido no início de cada turno do Patriarca.',
      },
      {
        nome: 'Rugido do Progenitor (Recarga 5t)',
        desc: 'O Patriarca solta um grito que ecoa o sofrimento de todas as suas vítimas. Cada criatura inimiga a até 27 metros deve passar em uma RES de Sabedoria (CD 24). Se falhar, sofre 70 (20d6) de dano psíquico e fica Aterrorizada e Paralisada de horror por 1 minuto.',
      },
      {
        nome: 'Banquete Rápido',
        desc: 'O Patriarca agarra um goblin aliado adjacente e o devora inteiramente, recuperando 60 pontos de vida instantaneamente.',
      },
      {
        nome: 'Arremessar Prole',
        desc: 'O Patriarca pega um goblin próximo e o arremessa a até 24 metros como um projetil. O goblin explode ao impacto, causando 25 de dano de concussão e deixando o chão em terreno difícil.',
      },
      {
        nome: 'Subjugar a Vontade (2 Ações)',
        desc: 'O Patriarca foca seu olhar em uma criatura a até 15 metros. O alvo deve passar em uma RES de Carisma (CD 24) ou cairá de joelhos (Caído) e perderá sua próxima ação devido à pressão da aura do Patriarca.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '21',
      visaoEscuro: '36 metros, Faro Aguçado',
    },
    drops: [
      {
        range: '1',
        item: 'Coroa de Mandíbulas de Deuses',
      },
      {
        range: '2',
        item: 'O Cutelo da Iniquidade',
      },
      {
        range: '3',
        item: 'Sangue Negro do Progenitor',
      },
      {
        range: '4',
        item: 'Manto de Pele Real Curtida',
      },
    ],
  },
  goblinDeClasse: {
    name: 'Goblin de Classe',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/mhE7QDM.png',
    image: 'https://2img.net/i.imgur.com/V0EZuKn.jpeg',
    subtitle: 'CR 5',
    description: `O Goblin de Classe representa o momento em que a raça goblin deixa de ser apenas uma praga oportunista para se tornar uma força de elite especializada. Ao atingir o nível 5 no caminho intelectual, o goblin passa por uma transformação mental e física: ele começa a emular as artes de combate e as disciplinas mágicas das raças civilizadas que tanto odeia. Sua aparência reflete essa mudança; ele possui uma postura ereta e uma musculatura tesa, moldada pelo treinamento rigoroso e pela repetição de técnicas. A feiura inerente à sua raça permanece, mas agora é acompanhada por um olhar de inteligência fria e sadismo calculado.

A exposição de seu corpo é uma escolha baseada na funcionalidade e na arrogância. Eles utilizam apenas o necessário para portar seus equipamentos e ferramentas de classe, como arreios de couro, bandoleiras de munição ou bolsas de componentes mágicos, deixando o restante de seu tronco e membros totalmente à mostra para garantir máxima mobilidade. Essa nudez parcial serve também como uma ferramenta psicológica, forçando seus oponentes a encararem a crueza de um monstro que, apesar de sua aparência primitiva, luta com a precisão de um mestre de armas ou de um conjurador experiente.

Em combate, o Goblin de Classe é um estrategista nato. Ele não se lança ao ataque sem um plano. Se for um guerreiro, ele utiliza fintas e ataques em pontos vitais; se for um mago, ele manipula o campo de batalha para isolar os heróis. Ele vê seus aliados menores como peças de xadrez e não hesita em sacrificá-los para garantir que seu próprio golpe seja fatal. Encontrar um Goblin de Classe significa que o ninho não é mais apenas uma toca de animais, mas um posto avançado de uma civilização sombria e tecnicamente avançada que está pronta para retalhar o mundo dos homens com suas próprias táticas.`,
    type: 'Humanoide Pequeno (Goblinoide)',
    ac: '17',
    hp: '+82 (12d6 + 40)',
    speed: '9 metros.',
    stats: {
      forca: '14 (+2)',
      destreza: '18 (+4)',
      constituicao: '14 (+2)',
      inteligencia: '16 (+3)',
      sabedoria: '14 (+2)',
      carisma: '12 (+1)',
    },
    habilidades: [
      {
        nome: 'Teste de resistência',
        desc: 'DES +7, INT +6.',
      },
      {
        nome: 'Pericias',
        desc: 'Arcanismo +6, Atletismo +5, História +6, Percepção +5.',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Goblin, uma língua adicional.',
      },
      {
        nome: 'Doutrina de classe',
        desc: 'Ao iniciar o combate, o narrador escolhe um Papel para o Goblin. Se for Físico, ele ganha +2 nas jogadas de ataque e dano. Se for Mágico, a CD de suas habilidades aumenta em 2. Se for Suporte/Invocador, ele pode realizar uma ação bônus adicional por turno para ajudar aliados.',
      },
      {
        nome: 'Análise de padrões',
        desc: 'O Goblin de Classe observa os movimentos dos inimigos. Após 2 rodadas de combate, ele ganha um bônus de +2 na CA contra ataques de criaturas que ele já viu atacar.',
      },
      {
        nome: 'Tática displinada',
        desc: 'O Goblin não sofre desvantagem em ataques se houver um aliado a até 1 metro do alvo. Além disso, ele pode usar uma Ação Bônus para conceder Vantagem ao próximo ataque de um aliado contra um alvo que ele esteja engajando.',
      },
      {
        nome: 'Equipamento de elite',
        desc: 'Diferente dos goblins comuns, suas armas são bem cuidadas. Ele ignora a propriedade de falha ou quebra de itens de baixa qualidade e seus ataques são considerados mágicos para superar resistências.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Goblin de Classe realiza dois ataques com sua Arma de Ofício ou usa uma Habilidade de Classe e realiza um ataque simples.',
      },
      {
        nome: 'Arma de oficio',
        desc: 'Ataque Corpo a Corpo ou à Distância: +7 para acertar, alcance 1m ou 24/96m. Dano: 11 (2d6 + 4) de dano de um tipo apropriado à arma (Cortante, Perfurante ou Concussão).',
      },
      {
        nome: 'Habilidade de classe 1 (Escolha do narrador)',
        desc: 'O Goblin utiliza uma técnica específica de sua classe (ex: Golpe de Espada, Disparo Arcano, Flecha de Fogo). Causa 18 (4d8) de dano de um elemento ou tipo específico. CD 14 para resistir a efeitos secundários.',
      },
      {
        nome: 'Habilidade de classe 2 (escolha do narrador)',
        desc: 'O Goblin utiliza uma habilidade de utilidade, cura ou controle (ex: Curar, Provocar, Invocar ajudante pequeno, Debuff de área). Recupera 15 PV ou impõe uma condição por 1 minuto (CD 14).',
      },
      {
        nome: 'Contramedida técnica (reação)',
        desc: 'Quando o Goblin for alvo de um ataque ou magia, ele pode realizar um teste de Inteligência (História) contra a CA ou CD do atacante. Se vencer, ele reduz o dano pela metade através de posicionamento ou defesa técnica.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '15',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Manual de Estratégia Rasgado',
      },
      {
        range: '2',
        item: 'Insígnia de Posto',
      },
      {
        range: '3',
        item: 'Kit de Manutenção de Armas',
      },
      {
        range: '4',
        item: 'Bolsa de Reagentes ou Munição Especial',
      },
    ],
  },
  goblinGeneral: {
    name: 'Goblin General',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/sjEXlWj.png',
    image: 'https://2img.net/i.imgur.com/DEFerUb.jpeg',
    subtitle: 'CR10',
    description: `O Goblin General é o ápice da organização militar que a raça goblinoide pode alcançar antes de se fragmentar em disputas de ego bárbaras. Ao atingir o nível 10 no caminho intelectual, este ser deixa de apenas emular habilidades e passa a desenhar o próprio tabuleiro da guerra. Fisicamente, ele não possui o tamanho de um lorde, mas sua presença é muito mais sufocante. Seu corpo é magro, fibroso e coberto por uma rede de veias saltadas que pulsam conforme ele arquiteta suas estratégias. Sua feiura é acentuada por cicatrizes cirúrgicas e mutilações autoinfligidas que ele usa para provar sua resistência aos subordinados.

A exposição de seu corpo é quase obscena, desprovida de qualquer pudor ou moralidade civilizada. O General veste apenas restos rasgados de fardamentos militares de oficiais humanos que ele capturou e executou. Ele mantém o peito totalmente nu, suado e marcado pelo carvão que usa para desenhar mapas na própria pele, enquanto uma tanga de couro apertada e reforçada por pregos de ferro é tudo o que veste abaixo da cintura. Para ele, armaduras completas são o refúgio dos fracos e lentos; sua defesa reside em antecipar o golpe do inimigo antes mesmo que a lâmina seja puxada, usando sua nudez para chocar e desestabilizar adversários que esperam um comandante vestido com gala ou aço.

Em termos de comportamento, o General é a crueldade que pensa. Ele não grita ordens por desespero, mas com uma precisão cirúrgica que faz o bando agir como um único organismo faminto. Ele é capaz de ler as fraquezas emocionais dos aventureiros apenas observando sua postura de combate, ordenando que seus lacaios foquem no mais fraco ou abusem de reféns para quebrar a linha de frente do oponente. Encontrar um Goblin General significa que você não está mais lutando contra monstros em um ninho; você está enfrentando um exército irregular, liderado por uma mente sádica que vê a sua vida apenas como uma linha estatística a ser apagada no mapa dele.`,
    type: 'Humanoide Médio (Goblinoide)',
    ac: '19',
    hp: '+172 (23d8 + 69)',
    speed: '9 metros.',
    stats: {
      forca: '16 (+3)',
      destreza: '20 (+5)',
      constituicao: '16 (+3)',
      inteligencia: '18 (+4)',
      sabedoria: '16 (+3)',
      carisma: '16 (+3)',
    },
    habilidades: [
      {
        nome: 'Teste de resistência',
        desc: 'DES +9, INT +8, CAR +7.',
      },
      {
        nome: 'Perícias',
        desc: 'História +8, Percepção +7, Intimidação +7, Intuição +7.',
      },
      {
        nome: 'Imunidades',
        desc: 'Aterrorizado.',
      },
      {
        nome: 'Resistência',
        desc: 'Psíquico; Concussão, Perfurante e Cortante de armas não-mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Goblin, mais duas línguas civilizadas',
      },
      {
        nome: 'Mestre da logistica humilhante',
        desc: 'Goblins aliados a até 24 metros do General ganham +2 na CA e vantagem em testes de resistência contra efeitos mentais. Se um goblin aliado errar um ataque nesta área, o General pode usar uma reação para insultá-lo agressivamente, permitindo que o subordinado repita o ataque imediatamente com desvantagem.',
      },
      {
        nome: 'Guerrad e desgaste psicológico',
        desc: 'Inimigos a até 18 metros do General sentem a pressão de suas fintas e ordens táticas. Sempre que um inimigo tentar conjurar uma magia ou usar uma habilidade com limite de usos, deve passar em uma RES de Inteligência (CD 16). Se falhar, o recurso é gasto, mas a ação falha devido à distração provocada pelo General.',
      },
      {
        nome: 'Posicionamento cruel',
        desc: 'O General pode usar uma ação bônus em seu turno para ordenar que dois goblins aliados a até 18 metros troquem de lugar no campo de batalha. Este movimento é tão rápido e coordenado que não provoca ataques de oportunidade.',
      },
      {
        nome: 'Resistência lendária(2/dia)',
        desc: 'Se o General falhar em um teste de resistência, ele pode escolher passar no teste em vez disso.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O General realiza três ataques com sua Lâmina Tática ou usa duas Ordens de Comando diferentes e realiza um ataque simples.',
      },
      {
        nome: 'Lâmina tática do comandante',
        desc: 'Ataque Corpo a Corpo ou à Distância: +9 para acertar, alcance 1m ou 24/96m. Dano: 16 (2d10 + 5) de dano de um tipo apropriado (Cortante ou Perfurante). Se o ataque acertar, um goblin aliado à escolha do General pode se mover até 3 metros em direção ao alvo atingido sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Ordem de comando: Foco total',
        desc: 'O General aponta para um inimigo visível. Até o início do próximo turno do General, todos os goblins aliados que desferirem ataques contra esse alvo específico causam 1d6 de dano extra de precisão.',
      },
      {
        nome: 'Habilidade avançada de classe',
        desc: 'O General utiliza uma técnica ou magia avançada herdada de sua classe de prestígio baseada em Final Fantasy (ex: Quebra-Armadura, Reduto Mágico, Invocação Intermediária). Causa 31 (7d8) de dano de um elemento específico ou reduz permanentemente a defesa do alvo em 3 até o fim do combate. CD 16 para resistir.',
      },
      {
        nome: 'Habilidade avançada de classe',
        desc: 'Um feitiço de controle de área ou grande utilidade militar (ex: Névoa Venenosa, Silêncio Amplo, Soco de Gravidade, Haste em Grupo). Afeta uma área de 6 metros de raio ou cura 30 PV de até três aliados simultaneamente. CD 16 para evitar os efeitos negativos.',
      },
      {
        nome: 'Sacrificio planejado (Reação)',
        desc: 'Quando o General estiver prestes a receber dano de um ataque ou magia, ele puxa um goblin de nível menor a até 3 metros para o seu espaço. O subordinado recebe todo o dano em seu lugar. Se o goblin morrer pelo golpe, o General ganha vantagem em sua próxima jogada de ataque devido à brecha aberta.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '17',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Estandarte Desbotado da Conquista',
      },
      {
        range: '2',
        item: 'Espada de Comando Tático',
      },
      {
        range: '3',
        item: 'Pergaminho de Estratégia Regional',
      },
      {
        range: '4',
        item: 'Anel do Estratega',
      },
    ],
  },
  goblinRei: {
    name: 'Goblin Rei',
    rarity: 'Super raro',
    icon: 'https://2img.net/i.imgur.com/wvJAnRv.png',
    image: 'https://2img.net/i.imgur.com/v7Zo5K2.jpeg',
    subtitle: 'CR15',
    description: `O Goblin Rei é a personificação da corrupção política e da soberania perversa. Ao atingir o nível 15 no caminho intelectual, a criatura deixa de ser um mero comandante de campo para se tornar o dono absoluto de um império subterrâneo. Ele não governa pela força de seus próprios braços, mas pela infalibilidade de seus decretos e pela rede de subornos, chantagens e assassinatos que estende até o mundo da superfície. Sua aparência física abandona qualquer traço de agilidade selvagem para adotar uma postura de realeza distorcida; ele é magro, fibroso, com uma pele que carrega a palidez de quem raramente vê a luz do dia, mas que brilha constantemente com o suor da ganância e da paranoia.

A exposição de seu corpo é uma afronta deliberada às raças civilizadas. O Rei desdenha de roupas completas ou armaduras pesadas, preferindo cobrir-se apenas com mantos reais rasgados e joias pesadas que ele joga sobre seus ombros nus. Sua tanga é feita de ouro derretido e tecidos caros manchados de sangue, deixando seus músculos abdominais tensos e suas pernas totalmente à mostra. Essa nudez parcial serve como uma demonstração obscena de poder: ele está dizendo a seus inimigos que, mesmo estando desprotegido, a mente dele criou tantas camadas de defesas, armadilhas e escravos que ninguém é capaz de tocá-lo. Suas joias são cravadas diretamente na própria pele, misturando o luxo do ouro com a crueza de feridas inflamadas.

Em termos de comportamento, o Goblin Rei é um manipulador implacável. Ele enxerga a vida de seus súditos e de seus inimigos como meras moedas de troca em seu tabuleiro de xadrez. Ele se delicia na humilhação alheia, forçando prisioneiros de alto escalão a servirem como seus degraus ou banquetes enquanto assistem ao seu bando prosperar. Ele não possui a dignidade de um monarca humano; suas ações são marcadas por uma rispidez vulgar e um sadismo que transparece em suas gargalhadas estridentes. Enfrentar o Goblin Rei é entrar em um labirinto onde a sua moralidade será usada como arma contra você, e onde cada passo foi previsto por um tirano que se alimenta do colapso de reinos inteiros.`,
    type: 'Humanoide Médio (Goblinoide)',
    ac: '21',
    hp: '+265 (28d8 + 140)',
    speed: '9 metros',
    stats: {
      forca: '12 (+1)',
      destreza: '22 (+6)',
      constituicao: '20 (+5)',
      inteligencia: '22 (+6)',
      sabedoria: '18 (+4)',
      carisma: '24 (+7)',
    },
    habilidades: [
      {
        nome: 'Testes de resistência',
        desc: 'DES +11, INT +11, SAB +9, CAR +12.',
      },
      {
        nome: 'Perícias',
        desc: 'Enganação +12, Persuasão +12, Intuição +9, Arcanismo +11, História +11.',
      },
      {
        nome: 'Imunidades',
        desc: 'Aterrorizado, Enfeitiçado, Cego, Paralisado.',
      },
      {
        nome: 'Resistência',
        desc: 'Psíquico; Concussão, Perfurante e Cortante de armas não-mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos os idiomas civilizados, Goblin, Telepatia 18 metros.',
      },
      {
        nome: 'Decreto de submissão absoluta',
        desc: 'Todos os goblins aliados em um raio de 36 metros adicionam o modificador de Carisma do Rei (+7) em suas jogadas de ataque, dano e testes de resistência. Se um goblin comum tentar fugir ou desobedecer em sua presença, sua cabeça explode instantaneamente, causando 2d6 de dano psíquico a inimigos a até 1 metro dele.',
      },
      {
        nome: 'Imunidade diplomática ilusória',
        desc: 'Quando uma criatura inimiga tenta atacar o Rei diretamente pela primeira vez em seu turno, ela deve fazer um teste de resistência de Carisma (CD 20). Se falhar, ela é dominada por uma culpa esmagadora ou pela ilusão de que o Rei é um monarca legítimo que não deve ser tocado, sendo forçada a escolher outro alvo para o ataque ou a desperdiçar a ação.',
      },
      {
        nome: 'Presença majestosa perversa',
        desc: 'O Rei adiciona +1 em todos os seus testes de resistência para cada goblin aliado consciente que ele possa ver a até 18 metros de si (bônus máximo de +5).',
      },
      {
        nome: 'Resistência lendária (3/dia)',
        desc: 'Se o Rei falhar em um teste de resistência, ele pode escolher passar no teste em vez disso.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Rei realiza três ataques com o Cetro da Tirania Oculta ou utiliza uma Habilidade Mestra de Classe e realiza duas Ordens Reais.',
      },
      {
        nome: 'Cetro da tirania oculta',
        desc: 'Ataque Mágico Corpo a Corpo: +11 para acertar, alcance 1m. Dano: 20 (4d6 + 6) de dano psíquico. O alvo deve passar em uma RES de Força (CD 20) ou será forçado a ficar de joelhos (Caído) e sua velocidade será reduzida a 0 até o início do próximo turno do Rei.',
      },
      {
        nome: 'Ordem real: Sentença de morte',
        desc: 'O Rei aponta para um inimigo. Todos os goblins de classe ou inferiores a até 18 metros que puderem ouvir o Rei ganham um ataque bônus imediato como reação livre se se moverem em direção a esse alvo.',
      },
      {
        nome: 'Habilidade mestra de classe',
        desc: 'O Rei canaliza uma magia ou habilidade de nível supremo de sua respectiva classe inspirada em Final Fantasy (ex: Flare Star, Shadow Flare, Julgamento Sagrado, Ruína). Causa 49 (11d8) de dano de um elemento específico em uma área de 9 metros de raio. CD 20 para reduzir o dano pela metade.',
      },
      {
        nome: 'Habilidade mestra de classe II',
        desc: 'Uma habilidade de manipulação de status ou suporte de alta escala (ex: Dispelga, Curaja, Muro Estático, Gravidade Escura). Remove todos os buffs dos jogadores em uma área ou inflige uma condição incapacitante por 1 minuto (CD 20).',
      },
      {
        nome: 'Manobra de xadrez',
        desc: 'O Rei faz com que um goblin aliado a até 18 metros se mova seu deslocamento total e realize um ataque básico. Este movimento não provoca ataques de oportunidade.',
      },
      {
        nome: 'Cobrança de imposto vital',
        desc: 'O Rei drena a energia de seus servos. Ele escolhe até três goblins aliados a até 9 metros. Os alvos sofrem 20 de dano necrótico e o Rei recupera a mesma quantidade em pontos de vida.',
      },
      {
        nome: 'Decreto de expulsão (2 ações)',
        desc: 'O Rei libera uma onda de choque de autoridade mental. Cada inimigo a até 6 metros deve passar em uma RES de Sabedoria (CD 20) ou sofrerá 27 (6d8) de dano psíquico e será empurrado 6 metros para trás.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: '36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Cetro da Tirania Oculta',
      },
      {
        range: '2',
        item: 'Coroa do Falso Monarca',
      },
      {
        range: '3',
        item: 'Manto do Acordo Quebrado',
      },
      {
        range: '4',
        item: 'Tratado Comercial de Terralém',
      },
    ],
  },
  goblinSabio: {
    name: 'Goblin Sábio',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/TQwCU0f.png',
    image: 'https://2img.net/i.imgur.com/ulMWde3.jpeg',
    subtitle: 'CR20',
    description: `O Goblin Sábio é o ápice do caminho intelectual e a prova definitiva de que a mente pode ser a arma mais destrutiva de Terralém. Ao alcançar o nível 20, a criatura deixa de ser um mero usuário de magia para se tornar a própria singularidade arcana. Sua aparência física é uma manifestação direta do excesso de conhecimento: ele é esguio, com músculos abdominais e torácicos definidos ao extremo, quase como se a pele estivesse colada diretamente à estrutura muscular por falta de gordura. Veias grossas e runas heréticas queimam diretamente em sua pele verde-escura, brilhando em tons de violeta e expelindo o vapor quente de um cérebro que opera além dos limites biológicos.

A nudez quase completa do Sábio é uma escolha puramente funcional e uma demonstração de soberania absoluta. Tecidos comuns não resistem à voltagem mágica que seu corpo canaliza, e armaduras de metal servem apenas como gaiolas para sua velocidade de reação. Ele veste apenas uma tanga feita com os restos de pergaminhos antigos que ele mesmo desvendou, deixando sua musculatura tesa e suada inteiramente à mostra. Para o Sábio, a modéstia é uma fraqueza humana; ele quer que seus inimigos vejam cada músculo de seu torso se contrair enquanto ele molda feitiços capazes de apagar cidades inteiras do mapa com um simples estalar de dedos.

Em combate, o Goblin Sábio opera em uma dimensão tática incompreensível para mortais comuns. Ele não precisa de gestos ou palavras; ele joga com o tempo, com a gravidade e com a mente de seus oponentes. Ele é capaz de prever cada golpe dos heróis e usar a própria energia deles para alimentar suas barreiras intransponíveis. Sua personalidade é marcada por uma arrogância fria e uma rispidez absoluta; ele não grita, ele sussurra verdades cruéis diretamente na mente de suas vítimas, destruindo sua sanidade antes de desintegrar seus corpos. Enfrentar o Goblin Sábio é encarar o arquiteto da anti-civilização, um ser que reduziu a magia dos deuses a uma ferramenta de humilhação e extermínio.`,
    type: 'Humanoide Médio (Goblinoide)',
    ac: '24',
    hp: '+420 (40d8 + 240)',
    speed: '12 metros, teletransporte 12 metros.',
    stats: {
      forca: '10 (+0)',
      destreza: '24 (+7)',
      constituicao: '22 (+6)',
      inteligencia: '30 (+10)',
      sabedoria: '24 (+7)',
      carisma: '26 (+8)',
    },
    habilidades: [
      {
        nome: 'Testes de resistência',
        desc: 'DES +14, INT +17, SAB +14, CAR +15.',
      },
      {
        nome: 'Perícias',
        desc: 'Arcanismo +17, História +17, Intuição +14, Percepção +14, Enganação +15.',
      },
      {
        nome: 'Imunidades',
        desc: 'Psíquico, Veneno; Concussão, Perfurante e Cortante de armas não-mágicas. Todas as condições',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Frio, Ácido, Elétrico, Trovão.',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos os idiomas, Telepatia Sem Limite.',
      },
      {
        nome: 'Gênio da singularidade',
        desc: 'O Goblin Sábio quebrou as barreiras das limitações de classe. Ele tem acesso a todas as magias e habilidades das classes existentes no fórum. Ele pode conjurar magias sem componentes verbais ou somáticos e ignora penalidades de terreno ou cobertura mágica.',
      },
      {
        nome: 'Analise preditiva suprema',
        desc: 'No início de cada rodada, o Sábio escolhe até três criaturas que ele possa ver. Ele prevê perfeitamente suas ações, ganhando vantagem em todos os testes de resistência contra essas criaturas, e os ataques delas contra o Sábio são realizados com desvantagem.',
      },
      {
        nome: 'Inversão entrópica de conjuração',
        desc: 'Sempre que uma criatura a até 27 metros do Sábio tentar conjurar uma magia, o Sábio pode forçá-la a fazer um teste de resistência de Inteligência (CD 25). Se falhar, a magia é roubada pelo Sábio, que pode conjurá-la imediatamente como uma reação livre usando os seus próprios atributos, enquanto o conjurador original perde o espaço de magia e sofre 4d10 de dano psíquico.',
      },
      {
        nome: 'Resistência lendária (3/dia)',
        desc: 'Se o Sábio falhar em um teste de resistência, ele pode escolher passar no teste em vez disso.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Goblin Sábio realiza três ataques com seu Toque da Singularidade Vazia ou utiliza uma Magia Suprema de Classe e realiza duas Ações de Comando Absoluto.',
      },
      {
        nome: 'Toque da singularidade vazia',
        desc: 'Ataque Mágico Corpo a Corpo: +17 para acertar, alcance 1m. Dano: 32 (4d10 + 10) de dano de força mais 14 (4d6) de dano psíquico. O alvo deve passar em uma RES de Carisma (CD 25) ou será banido para uma dimensão de vácuo mental até o final do próximo turno do Sábio, retornando sob a condição Atordoado.',
      },
      {
        nome: 'Comando absoluto: Suicidio coletivo',
        desc: 'O Sábio sussurra uma ordem telepática para até três goblins aliados a até 24 metros. Os alvos se movem em direção ao inimigo mais próximo e explodem, causando 36 (8d8) de dano de essência arcana em uma área de 4 metros de raio por goblin.',
      },
      {
        nome: 'Buraco negro mental (Recarga 5t)',
        desc: 'O Sábio colapsa a gravidade do conhecimento em uma área de 9 metros de raio a até 36 metros de distância. Todas as criaturas na área devem passar em uma RES de Inteligência (CD 25). Falha: Sofrem 65 (10d12) de dano psíquico, ficam Cegas e Paralisadas por 1 minuto e esquecem todas as suas habilidades de classe e magias até o final do encontro. Sucesso: Metade do dano e não sofrem as condições ou o esquecimento.',
      },
      {
        nome: 'Distorção cronológica',
        desc: 'O Sábio se teletransporta para um espaço vazio visível a até 18 metros de distância e limpa qualquer efeito de debuff que esteja ativo nele.',
      },
      {
        nome: 'Reescrever destino',
        desc: 'O Sábio força uma criatura a refazer uma jogada de ataque, teste de habilidade ou teste de resistência bem-sucedido que tenha acabado de realizar, desta vez aplicando desvantagem extrema.',
      },
      {
        nome: 'Emanação cósmica (2 ações)',
        desc: 'O Sábio libera uma onda de energia que anula todas as barreiras mágicas, buffs e proteções ativas dos jogadores em um raio de 24 metros. Cada jogador afetado sofre 22 (4d10) de dano de força pura.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '24',
      visaoEscuro: 'Visão Verdadeira 36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'O Grimoire da Heresia Absoluta',
      },
      {
        range: '2',
        item: 'Manto do Vácuo Pensante',
      },
      {
        range: '3',
        item: 'Monóculo do Olhar Desconstrutivo',
      },
      {
        range: '4',
        item: 'Núcleo de Mana Colapsado',
      },
    ],
  },
  salamancerAgua: {
    name: 'Salamancer (Água)',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/0YaACaY.png',
    image: 'https://2img.net/i.imgur.com/ud9PmrQ.jpeg',
    subtitle: 'CR 1',
    description:
      'O Salamancer de Água é a personificação da ferocidade elemental oculta nas regiões úmidas de Jomar. Inquieto e predatorial, ele é uma visão de puro horror biológico; uma espécie composta estritamente por fêmeas que abandonaram qualquer traço de dignidade em troca de uma agilidade assassina nas penumbras das cavernas e pântanos alagados. Sua aparência é deliberadamente repulsiva e imponente, apresentando uma cabeça reptiliana completamente careca e desprovida de traços humanos, onde fendas verticais abrigam órbitas de um azul-neon cortante e uma bocarra predatória repleta de dentes serrilhados como agulhas que destilam um muco gélido. A feiura da criatura não é meramente estética, é funcional. Toda a sua metade frontal, do peito largo ao ventre, permanece inteiramente desprovida de escamas ou qualquer proteção rígida, exibindo uma anatomia esguia, bizarramente definida, hiper-vascularizada e rasgada em um abdômen monumental com zero gordura corporal. A imensa pressão de seu núcleo hidromântico superaquece seu metabolismo interno, fazendo com que uma condensação espessa e luminescente, semelhante a um suor de água salobra, escorra continuamente por seus blocos musculares e se acumule nas linhas pélvicas altamente marcadas, conferindo um brilho úmido e de uma dominância física avassaladora na penumbra. Enquanto o lombo é protegido por escamas escuras e molhadas, de onde jatos de vapor fervente evaporam dinamicamente devido à fricção elemental de sua espinha, sua frente de carne pálida e viva exala um magnetismo animal hostil. Territorialista e profundamente desconfiada por instinto, ela não busca o confronto direto com caçadores, preferindo se esgueirar pelas fendas e aproveitar sua pele intensamente lubrificada por fluidos corporais para ganhar uma velocidade que desafia os olhos humanos, tornando-se virtualmente imune a tentativas de contenção física ou agarramento. Em combate, ela opera como uma oportunista implacável à distância, desferindo cusparadas de água pressurizada misturada a um miasma asfixiante para minar o fôlego daqueles que tentam manter a retaguarda segura, antes de submergir e desaparecer nos canais subterrâneos. No entanto, quando acuada ou com seu ninho ameaçado, a criatura se torna feroz e desesperada; ela tensiona toda a rigidez de seu torso de mármore e se lança em botes brutais de garras contra a vanguarda. Se perceber que a sobrevivência está em risco, ela ferve a própria energia interna para nublar a visão do ambiente com uma cortina de névoa escaldante, batendo em retirada sem hesitação em direção a fendas profundas ou fontes termais onde possa se regenerar. Encontrar uma salamancer de água em um corredor alagado é encarar o lado mais selvagem e implacável da sobrevivência: uma ameaça letal que não conhece a vergonha, que não tem nada a perder e que enxerga qualquer intruso apenas como um invasor a ser repelido com dentes, garras e medo.',
    type: 'Monstro pequeno, réptil',
    ac: '13',
    hp: '22 (4d6 + 8)',
    speed: '9 metros, natação 12 metros.',
    stats: {
      forca: '11 (+0)',
      destreza: '16 (+3)',
      constituicao: '14 (+2)',
      inteligencia: '7 (-2)',
      sabedoria: '12 (+1)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Imunidade',
        desc: 'Gélido, Ácido, Preso, Agarrado (devido à pele lubrificada).',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Concussão e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Elétrico',
      },
      {
        nome: 'Instinto de fuga serelepe',
        desc: 'Quando o Salamancer reduz seus Pontos de Vida para menos da metade (11 PV ou menos), seu deslocamento aumenta em 3 metros e ele não provoca ataques de oportunidade ao se mover em direção a fendas, cavernas ou fontes de água.',
      },
      {
        nome: 'Esgueirar da correnteza',
        desc: 'O Salamancer pode realizar as ações de Desengajar ou Esconder-se como uma Ação Bônus em cada um de seus turnos no fórum.',
      },
      {
        nome: 'Tática territorialista',
        desc: 'Se houver mais de dois Salamancers a até 6 metros de distância um do outro, seus ataques à distância ganham vantagem nas rolagens de acerto devido à distração coordenada.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Salamancer realiza dois ataques de Garras Úmidas se estiver acuado em combate corpo a corpo, ou usa sua Cusparada de Alta Pressão uma vez.',
      },
      {
        nome: 'Garras úmidas',
        desc: 'Ataque Corpo a Corpo Físico: +5 para acertar, alcance 1m. Dano: 5 (1d4 + 3) de dano cortante mais 2 (1d4) de dano de Água.',
      },
      {
        nome: 'Cusparada de alta pressão',
        desc: 'Ataque à Distância Mágico: +5 para acertar, alcance 12m. Dano: 6 (1d6 + 3) de dano de Água. O alvo deve passar numa RES de Força (CD 13) ou será empurrado 3 metros para trás e terá sua investida interrompida.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Escama Hidrodinâmica',
      },
      {
        range: '2',
        item: 'Glândula de Miasma Aquático',
      },
      {
        range: '3',
        item: 'Olho do Espreitador',
      },
      {
        range: '4',
        item: 'Vesícula Elemental Inquieta',
      },
    ],
  },
  jacaregatilho: {
    name: 'Jacaré-gatilho',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/lgRGtn9.png',
    image: 'https://2img.net/i.imgur.com/GsBvlBd.jpeg',
    subtitle: 'CR 5',
    description: `O Jacaré-gatilho é a personificação da emboscada cinética e da opressão física nos pântanos. Como a evolução natural do pequeno réptil das correntes, esta criatura, que mantém a linhagem biológica estritamente feminina da espécie, abandonou qualquer resquício de comportamento evasivo para se tornar uma visão de puro horror predatório; uma máquina quadrúpede que funde o peso de um réptil de grande porte com uma agilidade balística assustadora. Sua aparência é deliberadamente intimidadora e grotesca, ostentando um crânio alongado de jacaretinga ancestral, olhos que brilham em um tom amarelo-neon sob a água escura e mandíbulas maciças capazes de pulverizar ossos e armaduras com uma única mordida.

A feiura e a anatomia da criatura não são meramente estéticas, são funcionais. Enquanto seu dorso, flancos e cauda são blindados por escamas escuras de alta densidade e placas ósseas rústicas, toda a metade frontal inferior de seu corpo, o peito largo e todo o ventre, permanece inteiramente desnudada, em carne viva e livre de qualquer proteção. Essa ausência de blindagem expõe uma musculatura bizarramente definida, hiper-vascularizada e rasgada em um abdômen monumental com zero gordura corporal. O superaquecimento de seu núcleo elemental faz com que a água do pântano evapore em jatos de vapor sibilantes pelas fendas intercostais, enquanto um suor espesso e oleoso escorre continuamente por seus blocos musculares, acumulando-se nas linhas pélvicas altamente marcadas e conferindo-lhe um brilho úmido de pura soberania física e magnetismo hostil na penumbra.

Em seu território alagado, o Jacaré-gatilho é um oportunista letal. Ele utiliza a coloração escura de suas escamas dorsais para alcançar uma camuflagem hidrodinâmica perfeita, tornando-se indistinguível do leito do rio até que seja tarde demais. Quando o alvo é fixado, a fera contrai sua musculatura abdominal rígida e ativa uma propulsão hidrosônica, disparando pelo fundo como um torpedo biológico. O impacto de seu bote é devastador: ao cravar seus dentes serrilhados na presa, o monstro usa o peso bruto de seu peito nu de mármore para executar uma prensa de afogamento, esmagando a vítima contra a lama do fundo. Sob a opressão dessa prensa muscular, o oxigênio é arrancado dos pulmões do invasor, impedindo qualquer reação física ou conjuração enquanto as garras rápidas das patas dianteiras retalham o que restou de suas defesas. Encontrar um jacaré-gatilho nas águas profundas é encarar o ápice da brutalidade territorial: uma calamidade faminta que não conhece o recuo e que governa o fundo dos pântanos através do esmagamento, do sufocamento e do medo.`,
    type: 'Monstro Médio, Réptil (Elemental)',
    ac: '16',
    hp: '+78 (12d8 + 24)',
    speed: '9 metros, natação 18 metros.',
    stats: {
      forca: '18 (+4)',
      destreza: '16 (+3)',
      constituicao: '14 (+2)',
      inteligencia: '5 (-3)',
      sabedoria: '12 (+1)',
      carisma: '6 (-2)',
    },
    habilidades: [
      {
        nome: 'Imunidade',
        desc: 'Gélido, Ácido, Preso, Agarrado (apenas quando estiver submerso).',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Elétrico',
      },
      {
        nome: 'Camuflagem hidrodinamica',
        desc: 'O Jacaré-gatilho possui vantagem em testes de Destreza (Furtividade) enquanto estiver total ou parcialmente submerso em água. Ele pode realizar a ação de Esconder-se como uma ação bônus nessas condições.',
      },
      {
        nome: 'Disparo torpedo',
        desc: 'Se o Jacaré-gatilho se mover pelo menos 6 metros em linha reta na água em direção a um alvo antes de realizar um ataque de mordida, o ataque causa 9 (2d8) de dano de Água adicional e o alvo deve passar numa RES de Força (CD 15) ou será derrubado Caído.',
      },
      {
        nome: 'Prensa muscular',
        desc: 'O Jacaré-gatilho tem vantagem em testes de atletismo para iniciar e manter agarramentos contra criaturas que estejam Caídas ou submersas.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Jacaré-gatilho realiza um ataque de Mordida de Gatilho e dois ataques de Garras Rápidas. Se já estiver agarrando uma criatura, ele pode substituir o Multiataque pela ação Prensa de Afogamento.',
      },
      {
        nome: 'Mordida de gatilho',
        desc: 'Ataque Corpo a Corpo Físico: +7 para acertar, alcance 1m. Dano: 13 (2d8 + 4) de dano perfurante. O alvo deve passar numa RES de Força (CD 15) ou ficará Agarrado. Enquanto mantiver o alvo agarrado, o Jacaré-gatilho não pode morder outra criatura, mas ganha vantagem em seus ataques de garras contra o alvo agarrado.',
      },
      {
        nome: 'Garras Rápidas',
        desc: 'Ataque Corpo a Corpo Físico: +7 para acertar, alcance 1m. Dano: 7 (1d6 + 4) de dano cortante.',
      },
      {
        nome: 'Prensa de afogamento',
        desc: 'O Jacaré-gatilho usa o peso de seu corpo e a musculatura rígida de seu peito nu para esmagar uma criatura Agarrada contra o fundo do leito de água. O alvo sofre 15 (2d10 + 4) de dano de concussão por esmagamento e ativa o status Sap de Elite, perdendo 6 PV por post no fórum. Enquanto estiver sob a prensa, o alvo não pode conjurar magias com componentes verbais e começa a sufocar.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Couro de Jacaretinga Hidrodinâmico',
      },
      {
        range: '2',
        item: 'Tendão de Propulsão Elástica',
      },
      {
        range: '3',
        item: 'Placa Peitoral de Carne Rígida',
      },
      {
        range: '4',
        item: 'Glândula de Vácuo Pulmonar',
      },
    ],
  },
  caimaotorpedo: {
    name: 'Caimão-torpedo',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/weCvhkW.png',
    image: 'https://2img.net/i.imgur.com/DytFh2h.jpeg',
    subtitle: 'CR10',
    description: `O Caimão-torpedo é a culminação evolutiva da agressividade cinética nas linhagens reptilianas elementais. Diferente de seus ancestrais menores, que dependiam de emboscadas estáticas, esta criatura é um prodígio de engenharia biológica desenhado para a intercepção em alta velocidade. Seu corpo é de um porte médio, mas notavelmente alongado e atlético, ostentando uma musculatura que parece constantemente tensionada, pronta para disparar. A característica mais marcante de sua anatomia é a cauda: desprovida de escamas espinhosas comuns, ela se achatou em um leme de alta precisão com uma densidade muscular tão violenta que funciona como o gatilho de um sistema de propulsão orgânica, permitindo que o espécime se lance fora da água com a força de um projétil cinético.

Visualmente, a criatura é uma distorção de força bruta reptiliana. Suas patas são robustas e dotadas de garras hidrodinâmicas, fundidas a um torso quadrúpede de centro de gravidade baixo, permitindo que ele se fixe ao leito do rio ou se lance contra a correnteza com estabilidade absoluta. O dorso e os flancos são protegidos por placas ósseas achatadas e escuras que minimizam a resistência, enquanto a região ventral, peito e abdômen, permanece desprovida de blindagem, expondo uma musculatura hipertrofiada e rasgada, resultado de uma vida de propulsão explosiva. É nessa seção ventral que o calor do seu núcleo elemental se concentra, fazendo com que o suor salobro ferva sob as escamas, criando uma assinatura térmica e visual inconfundível durante o combate.

O comportamento do Caimão-torpedo é marcado por uma inteligência predatória focada exclusivamente na física do movimento. Ele não persegue; ele calcula trajetórias de interceptação. A criatura se posiciona, acumula energia cinética através de movimentos vibratórios rápidos e dispara através de canais estreitos como um torpedo vivo. O impacto de seu bote inicial não é apenas um golpe, é uma colisão de massa e velocidade capaz de estilhaçar couraças e arremessar guerreiros ao ar.

Uma vez que ele atinge o alvo, o Caimão-torpedo utiliza sua estrutura muscular rígida para travar a vítima, aproveitando a inércia do choque para garantir que o contato seja mantido até que a mordida trituradora, dotada de presas de dureza quase metálica, cumpra seu papel de desmantelar a estrutura física do invasor. Encontrar um Caimão-torpedo é, em muitos casos, o último evento registrado por viajantes descuidados; é um predador que transforma o próprio meio aquático em uma arma de cerco, tornando qualquer travessia de rio um teste brutal de sobrevivência contra um projétil imparável.`,
    type: 'Monstro Médio, Réptil (Elemental)',
    ac: '18',
    hp: '+155 (18d10 + 54)',
    speed: '12 metros, natação 24 metros.',
    stats: {
      forca: '22 (+6)',
      destreza: '20 (+5)',
      constituicao: '18 (+4)',
      inteligencia: '6 (-2)',
      sabedoria: '14 (+2)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Imunidade',
        desc: 'Gélido, Ácido, Preso, Agarrado.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Eletricidade',
      },
      {
        nome: 'Vetor de arremesso',
        desc: 'O Caimão-torpedo acumula energia cinética conforme se move. Para cada 3 metros que ele percorre em linha reta na água ou no ar antes de um ataque, ele causa +1d8 de dano adicional.',
      },
      {
        nome: 'Escamas de impacto',
        desc: 'Qualquer criatura que atingir o Caimão-torpedo com um ataque corpo a corpo sofre 5 (1d10) de dano de concussão devido à rigidez absoluta de suas escamas comprimidas.',
      },
      {
        nome: 'Cauda Propulsora',
        desc: 'O monstro não precisa de antecedência para realizar saltos. Ele pode saltar até 9 metros de distância ou 6 metros de altura a partir de qualquer superfície.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Caimão-torpedo realiza três ataques: um de Mordida Trituradora e dois de Garras Hidrodinâmicas.',
      },
      {
        nome: 'Mordida trituradora',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 1m. Dano: 18 (2d10 + 7) de dano perfurante mais 7 (2d6) de dano de Água. O alvo deve passar numa RES de Força (CD 18) ou terá sua armadura comprometida, sofrendo -2 na CA até o final do próximo turno.',
      },
      {
        nome: 'Garras hidrodinamicas',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 1m. Dano: 12 (1d8 + 7) de dano cortante.',
      },
      {
        nome: 'Torpedo Cinético (Recarga 5T)',
        desc: 'O Caimão-torpedo se lança em uma linha reta de até 18 metros. Cada criatura no caminho deve fazer uma RES de Destreza (CD 18). Falha: Sofre 45 (10d8) de dano de concussão, é empurrada para o final da linha e fica Atordoada por 1 rodada. Sucesso: Metade do dano e não fica atordoada.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Cauda Propulsora Muscular',
      },
      {
        range: '2',
        item: 'Escama de Alta Densidade',
      },
      {
        range: '3',
        item: 'Fluido Cinético Estabilizado',
      },
      {
        range: '4',
        item: 'Dentes de Aço Hidráulico',
      },
    ],
  },
  hidrodonteArpao: {
    name: 'Hidrodonte Arpão',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/DNF4wgI.png',
    image: 'https://2img.net/i.imgur.com/WD3sGZo.jpeg',
    subtitle: 'CR 15',
    description: `O Hidrodonte Arpão é o ápice da evolução predatória nas fossas abissais e águas territoriais violentas. Rompendo completamente com a silhueta estática dos jacarés comuns, esta besta adotou uma anatomia puramente fusiforme e aerodinâmica, projetada para uma única função: transformar o próprio corpo em um projétil subaquático de destruição em massa.

Para anular completamente o atrito com a água, o Hidrodonte passou por uma mutação brutal. Ele não possui escamas em seu torso, flancos ou coxas. Sua pele é uma exibição exposta de feixes musculares hiper-definidos, trincados e densos, que pulsam em tons de azul-púrpura escuro. O monstro é constantemente envolto por uma mucosa térmica espessa, viscosa e brilhante que reluz sob qualquer feixe de luz, exalando um frio cortante capaz de congelar a água ao seu redor. Seu crânio e focinho se fundiram em uma lâmina óssea cônica, maciça e incrivelmente afiada, transformando sua cabeça em uma lança viva.

Diferente de seus parentes menores, o Hidrodonte Arpão não se esconde em fendas. Ele caça ativamente em mar aberto ou em grandes complexos inundados. Quando tensiona seus músculos traseiros, a pressão hidrostática ao seu redor muda drasticamente, gerando um vácuo instintivo antes de se lançar a velocidades subsônicas contra seus alvos.`,
    type: 'Monstro Grande (Compacto)',
    ac: '21',
    hp: '+215 (22d10 + 94)',
    speed: '6 metros, natação 27 metros.',
    stats: {
      forca: '28 (+9)',
      destreza: '22 (+6)',
      constituicao: '24 (+7)',
      inteligencia: '6 (-2)',
      sabedoria: '16 (+3)',
      carisma: '12 (+1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Hidrodonte Arpão for alvo de dano Gélido ou de dano de Concussão causado por magias ou efeitos de água, ele não sofre dano. Em vez disso, ele absorve a energia térmica reversa e a pressão, recuperando 35 Pontos de Vida e ganhando uma Carga de Propulsão. Ele pode gastar uma Carga de Propulsão para recarregar instantaneamente seu Bote Torpedo Absoluto ou para realizar a ação de Disparada como uma ação bônus.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gélido, Ácido, Veneno; Concussão, Perfurante e Cortante de ataques não-mágicos, Agarrado, Preso, Caído, Paralisado, Petrificado, Envenenado, Exaustão.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Trovão; Concussão, Perfurante e Cortante de armas mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Elétrico',
      },
      {
        nome: 'Musculatura de alta tensão',
        desc: 'Para cada 6 metros que o Hidrodonte se mover em linha reta na água em direção a um alvo antes de desferir um ataque corpo a corpo, a violenta contração de seus feixes musculares hiper-definidos adiciona 11 (2d10) de dano perfurante extra ao impacto cinético do golpe.',
      },
      {
        nome: 'Mucosa térmica',
        desc: 'O corpo nu, azul-púrpura e sem escamas do Hidrodonte secreta constantemente uma mucosa espessa e brilhante que reluz intensamente, destacando cada fibra de sua anatomia atlética e suada. Qualquer criatura que iniciar seu turno agarrando, em contato físico direto ou que estalar um ataque físico corpo a corpo contra o torso exposto do monstro sofre 14 (4d6) de dano gélido devido ao frio extremo da película térmica.',
      },
      {
        nome: 'Lâmina hidrodinamica',
        desc: 'O crânio e o focinho fundidos em uma lâmina óssea cônica e afiada cortam a água e a resistência física com perfeição absoluta. Os ataques baseados no focinho do Hidrodonte ignoram qualquer bônus de armadura natural na CA do alvo e reduzem a RD (Redução de Dano) física da criatura pela metade.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até 3 ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Hidrodonte Arpão realiza três ataques de Empalo Balístico ou usa sua habilidade Bote Torpedo Absoluto.',
      },
      {
        nome: 'Empalo balístico',
        desc: 'Ataque Corpo a Corpo Mágico: +14 para acertar, alcance 3m. Dano: 25 (3d10 + 9) de dano perfurante mais 11 (2d10) de dano gélido. O alvo deve passar numa RES de Força (CD 22) ou será empalado pelo focinho cônico, ficando Preso e Agarrado no processo (CD 22 para escapar). Enquanto mantiver uma criatura empalada, o Hidrodonte não pode usar este ataque em outros alvos.',
      },
      {
        nome: 'Bote torpedo (Recarga 5T)',
        desc: 'O Hidrodonte tensiona seus músculos traseiros e se lança como um projétil orgânico em uma linha reta de até 24 metros, atravessando o espaço de qualquer criatura no caminho. Cada criatura na área deve passar numa RES de Destreza (CD 22).  Falha: 66 (12d10) de dano de concussão e perfurante combinados, a criatura é empurrada 6 metros para os lados e fica Atordoada até o final do próximo turno do Hidrodonte devido ao vácuo hidrostático.  Sucesso: Metade do dano, não é empurrada e nem fica atordoada.',
      },
      {
        nome: 'Disparo hidrodinâmico',
        desc: 'O Hidrodonte teletransporta-se (deslizando em altíssima velocidade através do fluido ou umidade do ar) para um espaço vazio com água ou névoa que possa ver a até 18 metros.',
      },
      {
        nome: 'Chicotadade cauda hidráulica',
        desc: 'O Hidrodonte desfere um golpe com sua cauda muscular. Ataque Corpo a Corpo: +14 para acertar, alcance 3m. Dano: 16 (2d6 + 9) de dano de concussão e o alvo é derrubado Caído.',
      },
      {
        nome: 'Onda de choque (2 ações)',
        desc: 'O Hidrodonte estala suas mandíbulas sob alta pressão, gerando uma bolha de vácuo que explode a até 12 metros. O alvo deve passar numa RES de Constituição (CD 22) ou ficará Cego e Surdo até o final do próximo turno do monstro devido à explosão sônica subaquática.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro:
        'Sentido Sísmico (apenas na água) 36 metros, Visão no Escuro 27 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Lâmina Cônica de Hidrodonte Real',
      },
      {
        range: '2',
        item: 'Glândula de Mucosa Criogênica Concentrada',
      },
      {
        range: '3',
        item: 'Feixe de Fibra Muscular Azul-Púrpura',
      },
      {
        range: '4',
        item: 'Núcleo Cardíaco Hidrostático',
      },
    ],
  },
  tiamatPrimitivo: {
    name: 'Tiamat Primitivo',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/7vg6WTP.png',
    image: 'https://2img.net/i.imgur.com/YhG3fhZ.jpeg',
    subtitle: 'CR 20',
    description: `O Tiamat possui uma presença física assustadora e imponente. Seu porte é classificado como grande e alongado, sustentado por uma anatomia híbrida e assustadoramente flexível: ele pode avançar erguido em suas duas patas traseiras como um titã bípede ou se lançar ao chão como um predador quadrúpede veloz. Ele abandonou completamente qualquer tipo de carapaça ou escama protetora na parte frontal e lateral de seu corpo. O que se vê é pura carne viva, uma musculatura peitoral e de coxas desenhada com precisão anatômica brutal, constantemente suada, brilhante e superaquecida pela energia interna divina. Vapor fervente e névoa escaldante emanam de sua pele em tons de azul-púrpura escuro.

A característica mais aterrorizante de sua biologia está em suas extremidades e em sua cabeça. Suas nadadeiras hidrodinâmicas e sua cauda massiva se movem em uma frequência tão absurdamente violenta que alteram as leis da física ao seu redor, criando zonas de vácuo instantâneas. Além disso, suas mandíbulas não se limitam à boca; elas se abrem em fendas profundas que descem por toda a extensão de seu pescoço nu. Quando o Tiamat ruge, o pescoço se divide, revelando que todo o interior do seu ser é um fluxo contínuo e luminoso de água sob pressão hiperbárica.`,
    type: 'Monstro Grande (Longo)',
    ac: '24',
    hp: '+385 (30d10 + 220)',
    speed: '12 metros, natação 36 metros.',
    stats: {
      forca: '30 (+10)',
      destreza: '24 (+7)',
      constituicao: '26 (+8)',
      inteligencia: '8 (-1)',
      sabedoria: '18 (+4)',
      carisma: '22 (+6)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Tiamat Primitivo for alvo de dano Gélido ou de Fogo, ele não sofre dano. Em vez disso, ele absorve as energias térmicas extremas, recuperando 50 Pontos de Vida e ganhando uma Carga de Caos. Ele pode gastar uma Carga de Caos para liberar instantaneamente a habilidade Cortador de Montanhas sem precisar rolar dados de recarga.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gélido, Fogo, Ácido, Veneno; Concussão, Perfurante e Cortante de ataques não-mágicos, Agarrado, Preso, Caído, Paralisado, Petrificado, Envenenado, Exaustão, Atordoado, Enfeitiçado, Aterrorizado.',
      },
      {
        nome: 'Resistência',
        desc: 'Trovão, Força, Psíquico; Concussão, Perfurante e Cortante de armas mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Elétrico',
      },
      {
        nome: 'Idiomas',
        desc: 'Aquático',
      },
      {
        nome: 'Sucção Hidrodinâmica',
        desc: 'O movimento ultra-violento da cauda e das nadadeiras do Tiamat gera um campo de gravidade aquática devastador ao seu redor. Qualquer criatura, navio ou objeto que iniciar seu turno a até 18 metros do Tiamat deve passar numa RES de Força (CD 24). Se falhar, é puxado 6 metros em linha reta em direção às mandíbulas da besta e tem seu deslocamento reduzido pela metade até o fim do turno atual.',
      },
      {
        nome: 'Anatomia exposta superaquecida',
        desc: 'O corpo bípede e quadrúpede flexível do Tiamat não possui nenhuma carapaça ou escama protetora nas laterais ou na frente, exibindo uma musculatura peitoral e de coxas puramente exposta, suada e superaquecida por sua energia interna primordial. Qualquer criatura que terminar seu turno a até 3 metros do monstro sofre 21 (6d6) de dano de fogo devido ao vapor fervente e ao calor extremo emanado de sua carne viva.',
      },
      {
        nome: 'Fenda das mandibulas abissais',
        desc: 'As mandíbulas do Tiamat se abrem em fendas profundas que descem por todo o seu pescoço nu, revelando um fluxo contínuo de água. Todos os ataques baseados em sua mordida ou jatos de água ignoram completamente quaisquer resistências a dano do alvo e tratam imunidades como se fossem apenas resistências.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até três ações por turno',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Tiamat Primitivo realiza três ataques: dois com suas Garras Esmagadoras e um com sua Mordida da Fenda Abissal, ou usa sua habilidade Cortador de Montanhas.',
      },
      {
        nome: 'Garras esmagadoras',
        desc: 'Ataque Corpo a Corpo Mágico: +16 para acertar, alcance 3m. Dano: 23 (3d8 + 10) de dano cortante mais 10 (3d6) de dano de fogo pela carne superaquecida.',
      },
      {
        nome: 'Mordida da fenda abissal',
        desc: 'Ataque Corpo a Corpo Mágico: +16 para acertar, alcance 4m. Dano: 36 (4d12 + 10) de dano perfurante mais 14 (4d6) de dano gélido. O alvo deve passar numa RES de Constituição (CD 24) ou começará a sufocar devido à pressão hidrostática interna inserida diretamente em seu sistema respiratório, perdendo 20 PV no início de cada um de seus turnos até passar na RES (que pode ser repetida no fim de cada um de seus turnos).',
      },
      {
        nome: 'Cortador de montanhas (Recarga 5T)',
        desc: 'O Tiamat libera o fluxo contínuo de água sob pressão colossal que corre por seu pescoço, disparando um feixe retilíneo de 45 metros de comprimento por 3 metros de largura. Cada criatura na linha deve passar numa RES de Destreza (CD 24). Falha: 99 (18d10) de dano de Força, a criatura é empurrada 9 metros para trás e derrubada Caído. Se o alvo for uma estrutura, navio ou o próprio terreno, o dano é dobrado. Sucesso: Metade do dano e não sofre os efeitos de recuo ou queda.',
      },
      {
        nome: 'Deslocamento do caos',
        desc: 'O Tiamat se move até seu deslocamento completo de natação ou metade de seu deslocamento terrestre sem provocar ataques de oportunidade. Todas as criaturas no caminho de movimento devem passar numa RES de Força (CD 24) ou serão puxadas 3 metros em sua direção devido ao vácuo cinético deixado para trás.',
      },
      {
        nome: 'Chicotada tridirecional',
        desc: 'O Tiamat golpeia com sua cauda massiva de longo alcance. Ataque Corpo a Corpo: +16 para acertar, alcance 6m. Dano: 19 (2d8 + 10) de dano de concussão e o alvo deve passar numa RES de Destreza (CD 24) ou será arremessado 6 metros para trás de sua posição atual.',
      },
      {
        nome: 'Vórtice Inundante (2 ações)',
        desc: 'O Tiamat rotaciona seu corpo violentamente, criando um redemoinho de sucção num raio de 12 metros. Cada criatura na área deve passar numa RES de Inteligência (CD 24) ou ficará Atordoada até o final do próximo turno do Tiamat devido à pressão psicológica das águas primordiais do caos.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro:
        'Sentido Sísmico 45 metros (apenas na água), Visão no Escuro 36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Coração Pulsação do Caos',
      },
      {
        range: '2',
        item: 'Presa da Fenda Abissal',
      },
      {
        range: '3',
        item: 'Glândula de Vapor Hiperaquecido',
      },
      {
        range: '4',
        item: 'Fragmento de Couro do Mar Original',
      },
    ],
  },
  hydrusRunico: {
    name: 'Hydrus Rúnico',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/ogM3RlV.png',
    image: 'https://2img.net/i.imgur.com/XWirjDf.jpeg',
    subtitle: 'CR 5',
    description: `O Hydrus Rúnico chama a atenção imediatamente por sua postura semi-bípede, esguia e dotada de uma elegância quase aristocrática. Ele rejeita qualquer tipo de vestimenta ou armadura pesada que possa obstruir a condução mágica de seu corpo. Em vez disso, usa apenas bandoleiras de couro cru cruzadas pelo peito, projetadas especificamente para carregar frascos e elixires alquímicos.

Sua pele é totalmente nua, lisa e possui um tom azul-pálido único. O torso e o abdômen são perfeitamente trincados e definidos, cobertos por uma película constante de água fria que escorre de forma provocativa por seus músculos, fazendo o monstro reluzir sob a luz. Gravadas diretamente nessa carne viva e suada estão runas místicas que brilham em um tom neon bioluminescente intenso. Quando o Hydrus conjura seus feitiços, essas runas pulsam, canalizando a umidade do ar e o mana do ambiente. Em combate, ele não usa armas convencionais; ele condensa o próprio suor e o orvalho ao redor de seus braços nus para moldar lâminas de água pura.`,
    type: 'Monstro Médio, réptil',
    ac: '16',
    hp: '+78 (12d8 + 24)',
    speed: '9 metros, natação 15 metros.',
    stats: {
      forca: '10 (+0)',
      destreza: '16 (+3)',
      constituicao: '14 (+2)',
      inteligencia: '20 (+5)',
      sabedoria: '14 (+2)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Hydrus Rúnico for alvo de dano Gélido ou de Força, ele não sofre dano. Em vez disso, as runas em sua carne viva absorvem o impacto, fazendo-o recuperar 15 Pontos de Vida e carregar seus circuitos mágicos. Ele ganha uma Carga Rúnica, que pode ser gasta para conjurar sua Barreira Hidrostática Transparentes sem gastar sua recarga natural.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gelo',
      },
      {
        nome: 'Resistência',
        desc: 'Ácido, Psíquico; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Elétrico',
      },
      {
        nome: 'Idiomas',
        desc: 'Aquático, Dialeto Rúnico Ancestral',
      },
      {
        nome: 'Simbolos da Carne Viva',
        desc: 'O Hydrus Rúnico possui runas neon bioluminescentes gravadas diretamente em seu torso e abdômen trincado azul-pálido. A película de água fria que escorre de forma provocativa por seus músculos definidos amplifica o brilho dessas marcas. Qualquer conjurador inimigo a até 18 metros que tentar lançar uma magia e puder ver o Hydrus deve passar em uma RES de Inteligência (CD 15). Se falhar, a complexidade das runas distorce sua mente, fazendo-o errar a conjuração e perder o espaço de magia de menor nível que possuir.',
      },
      {
        nome: 'Postura elegante',
        desc: 'Sua anatomia semi-bípede e esguia permite que ele se esquive com extrema graciosidade. O Hydrus adiciona seu modificador de Inteligência (+5) em testes de iniciativa e em testes de resistência de Destreza.',
      },
      {
        nome: 'Estabilizador de fluxo',
        desc: 'O Hydrus carrega frascos alquímicos em suas bandoleiras de couro cru. No início de cada um de seus turnos, ele pode quebrar um desses frascos como uma ação livre, purificando a umidade ao seu redor. Isso remove qualquer condição de lentidão, paralisia ou envenenamento que esteja afetando a si mesmo ou a um aliado a até 6 metros.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Hydrus Rúnico realiza dois ataques com sua Lâmina de Orvalho ou usa uma de suas habilidades rúnicas de controle.',
      },
      {
        nome: 'Lâmina de orvalho',
        desc: 'Ataque Corpo a Corpo Mágico: +8 para acertar, alcance 1m. Dano: 12 (2d6 + 5) de dano de Força. O ataque molda uma lâmina de água pura condensada a partir do suor de seus braços nus.',
      },
      {
        nome: 'Espelho de água refletor (Recarga 5T)',
        desc: 'O Hydrus molda instantaneamente um espelho flutuante de água mágica à sua frente. Até o início do seu próximo turno, a primeira magia direcionada ao Hydrus ou a um aliado a até 3 metros dele é completamente absorvida pelo espelho e refletida de volta para o conjurador original, usando os mesmos bônus de ataque e CD do atacante.',
      },
      {
        nome: 'Barreira Hidrostática',
        desc: 'O Hydrus manipula a umidade do ar ao redor para erguer uma parede física totalmente invisível e resistente em um ponto que ele possa ver a até 12 metros. A barreira possui 3 metros de largura, 3 metros de altura e 15 centímetros de espessura. Ela possui 30 Pontos de Vida, CA 15 e impede a passagem física de criaturas e projéteis mundanos, embora magias de eletricidade possam atravessá-la e destruí-la instantaneamente.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Fragmento de Pele Rúnica Azul-Pálido',
      },
      {
        range: '2',
        item: 'Essência de Mana Líquido Estabilizado',
      },
      {
        range: '3',
        item: 'Cristal Refletor de Maré',
      },
      {
        range: '4',
        item: 'Bandoleira de Couro Cru Alquímica',
      },
    ],
  },
  tritaoArcano: {
    name: 'Tritão Arcano',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/fxwS3H2.png',
    image: 'https://2img.net/i.imgur.com/ttpLyFV.jpeg',
    subtitle: 'CR 10',
    description: `O Tritão Arcano se apresenta em uma postura completamente ereta, exalando um orgulho e uma soberba avassaladores. Ele demonstra um profundo desprezo por roupas ou armaduras mundanas, considerando seu próprio corpo a arma mágica perfeita. Suas únicas decorações são joias antigas e fragmentos de corais mágicos pontiagudos cravados cirurgicamente de forma direta em seus ombros e quadris.

Seu tronco é largo, sustentando um abdômen trincado e pernas extremamente musculosas, tudo composto por uma pele nua, lisa e completamente desprovida de escamas, exibindo um tom azul-púrpura imperial. O que realmente choca os olhos dos aventureiros são as suas veias grossas, que pulsam em um tom azul-neon sob uma película de suor frio e oleoso que escorre constantemente por sua musculatura hiper-definida. Essa anatomia exposta cria uma estética de poder herético, sádico e profundamente intimidador. No campo de batalha, ele flutua levemente enquanto manipula esferas de água maciças que distorcem o espaço ao seu redor.`,
    type: 'Monstro médio, Tritão',
    ac: '18',
    hp: '+152 (16d8 + 80)',
    speed: '9 metros, natação 18 metros.',
    stats: {
      forca: '12 (+1)',
      destreza: '18 (+4)',
      constituicao: '20 (+5)',
      inteligencia: '24 (+7)',
      sabedoria: '16 (+3)',
      carisma: '16 (+3)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Tritão Arcano for alvo de dano Gélido ou de Força, ele não sofre dano. Em vez disso, ele absorve a densidade do impacto, recuperando 25 Pontos de Vida e ganhando uma Carga Gravitacional. Ele pode gastar essa carga para conjurar sua Esfera de Compressão Hidrostática instantaneamente, sem gastar a recarga natural do movimento.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gelo, Preso, Agarrado.',
      },
      {
        nome: 'Resistência',
        desc: 'Ácido, Psíquico, Força; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Elétrico',
      },
      {
        nome: 'Idiomas',
        desc: 'Aquático, Dialeto Rúnico, Comum',
      },
      {
        nome: 'Estética de poder',
        desc: 'O Tritão Arcano exibe um tronco largo, abdômen trincado e pernas musculosas compostas por pele nua, lisa e sem escamas de um tom azul-púrpura. Suas veias grossas brilham em azul-neon sob o suor frio e oleoso que escorre por sua musculatura hiper-definida de forma provocativa e sádica. Qualquer criatura a até 12 metros que olhar para o Tritão e tentar conjurar uma magia deve passar em uma RES de Sabedoria (CD 19) ou será dominada por um surto de humilhação psíquica, fazendo com que sua magia gaste o dobro de mana ou consuma um espaço de magia de um nível acima do pretendido.',
      },
      {
        nome: 'Soberano das ruínas',
        desc: 'O Tritão despreza roupas, usando apenas fragmentos de corais mágicos e joias cravadas diretamente em seus ombros e quadris. Esses corais geram uma aura de gravidade densa num raio de 15 metros. Inimigos nesta área tratam todo o espaço (seja terra ou água) como terreno difícil e sofrem desvantagem em testes de Atletismo e Acrobacia.',
      },
      {
        nome: 'Véu mágico sustentado',
        desc: 'O Tritão manipula a pressão molecular da água para romper conexões arcanas. Sempre que uma criatura iniciar seu turno sob a condição de asfixia ou presa pelas magias do Tritão, ela perde 10 pontos de mana (ou um espaço de magia de nível 2 ou menor) por rodada, que são transferidos diretamente para o Tritão como bônus de dano em seu próximo ataque.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Tritão Arcano realiza dois ataques de Impacto Gravitacional ou usa sua habilidade Esfera de Compressão Hidrostática.',
      },
      {
        nome: 'Impacto gravitacional',
        desc: 'Ataque Corpo a Corpo Mágico: +11 para acertar, alcance 3m. Dano: 18 (2d10 + 7) de dano de Força mais 9 (2d8) de dano gélido. O Tritão condensa a gravidade ao redor de suas mãos nuas para esmagar o alvo.',
      },
      {
        nome: 'Esfera de compressão (Recarga 5T)',
        desc: 'O Tritão Arcano manifesta até duas esferas de água densa e pressurizada com 3 metros de diâmetro que flutuam em pontos que ele possa ver a até 18 metros. Cada criatura no espaço de uma esfera deve passar em uma RES de Destreza (CD 19). Falha: A criatura é engolida pela esfera, ficando Presa, Agarrada e sob efeito de Asfixia imediata (sem oxigênio). No início de cada um de seus turnos dentro da esfera, o alvo sofre 22 (4d10) de dano de esmagamento hidrostático e perde mana devido à passiva Vácuo Mágico Sustentado. A criatura pode tentar uma RES de Força (CD 19) no fim de seus turnos para escapar. Sucesso: A criatura evita a esfera e é empurrada para o espaço livre mais próximo.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Fragmento de Coral Mágico Abissal',
      },
      {
        range: '2',
        item: 'Glândula de Fluido Azul-Neon',
      },
      {
        range: '3',
        item: 'Joia de Sangue do Arquimago',
      },
      {
        range: '4',
        item: 'Pele Azul-Púrpura Perfeitamente Preservada',
      },
    ],
  },
  sirenideoFeiticeiro: {
    name: 'Sirenídeo Feiticeiro',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/BMhtrcP.png',
    image: 'https://2img.net/i.imgur.com/KuU0vW6.jpeg',
    subtitle: 'CR 15',
    description: `Visualmente, o Sirenídeo ostenta um corpo humanoide incrivelmente magro, fibroso e definido ao extremo, sem um único pingo de gordura corporal. Sua anatomia exibe uma precisão cruel e provocativa, mantendo o peito largo e toda a região abdominal completamente expostos ao ambiente. Cruzando sua pele nua e lisa, encontram-se cicatrizes rúnicas profundas que brilham em um tom azul-neon bioluminescente, constantemente suadas pela umidade mágica.

Demonstrando um desprezo absoluto por armaduras físicas ou proteções mundanas, ele veste apenas uma tanga de seda molhada que nunca seca, amarrada na cintura por ossos polidos de aventureiros caídos. Isso deixa suas pernas e músculos pélvicos totalmente à mostra, em uma exibição de pura soberba e confiança herética. Ele se move com uma graciosidade sinuosa e perturbadora, manipulando chicotes de energia líquida pura enquanto observa o desespero dos guerreiros com um sorriso sádico e desdenhoso.`,
    type: 'Monstro Médio, Sirenídeo',
    ac: '21',
    hp: '+215 (26d8 + 98)',
    speed: '12 metros, natação 24 metros.',
    stats: {
      forca: '10 (+0)',
      destreza: '22 (+6)',
      constituicao: '18 (+4)',
      inteligencia: '28 (+9)',
      sabedoria: '18 (+4)',
      carisma: '24 (+7)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Sirenídeo Feiticeiro for alvo de dano Gélido ou Psíquico, em vez de sofrer dano, ele absorve as ondas de choque mentais e térmicas. Ele recupera 35 Pontos de Vida e ganha uma Carga de Miragem. Ele pode gastar uma Carga de Miragem para liberar instantaneamente sua Miragem de Afogamento Psíquico sem gastar a recarga, ou para absorver uma magia lançada contra ele e devolvê-la como uma explosão de força hidrostática imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gélido, Psíquico; Concussão, Perfurante e Cortante de ataques não-mágicos, Enfeitiçado, Aterrorizado, Atordoado, Preso, Agarrado, Paralisado, Exaustão.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Ácido, Força; Concussão, Perfurante e Cortante de armas mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Elétrico',
      },
      {
        nome: 'Idioma',
        desc: 'Aquático, Dialeto Rúnico, Comum',
      },
      {
        nome: 'Cicatrizes rúnicas',
        desc: 'O Sirenídeo possui um corpo humanoide incrivelmente magro, fibroso e definido, sem gordura corporal, mantendo o peito largo e o abdômen completamente expostos. Suas cicatrizes rúnicas profundas brilham em azul-neon sobre a pele nua, constantemente suada. Qualquer criatura a até 18 metros que tentar realizar uma ação agressiva ou conjurar uma magia contra o Sirenídeo deve passar numa RES de Inteligência (CD 22). Se falhar, a precisão anatômica provocativa e as runas estilhaçam sua concentração, fazendo a criatura sofrer 14 (4d6) de dano psíquico e perder sua ação bônus no turno atual.',
      },
      {
        nome: 'Miragem do afogamento',
        desc: 'O mana líquido manipulado pelo Sirenídeo distorce o oxigênio ao seu redor. Inimigos a até 12 metros sentem seus pulmões se encherem ilusoriamente de água salgada. Eles sofrem desvantagem em testes de resistência de Concentração e em testes de Sabedoria. Além disso, se uma criatura terminar seu turno nesta área sem respirar sob a água, seu cérebro processa o estímulo como real, sofrendo 18 (4d8) de dano psíquico puro.',
      },
      {
        nome: 'Desdém pela armadura',
        desc: 'Vestindo apenas uma tanga de seda molhada amarrada por ossos de aventureiros, o Sirenídeo demonstra total desprezo por proteções físicas. Ele adiciona seu modificador de Inteligência (+9) diretamente na sua Classe de Armadura (já calculado) e ganha vantagem em todos os testes de resistência baseados em Destreza.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Sirenídeo Feiticeiro realiza três ataques de Chicote de Mana Líquido ou usa sua habilidade Miragem de Afogamento Psíquico.',
      },
      {
        nome: 'Chicote de mana liquido',
        desc: 'Ataque Corpo a Corpo Mágico: +14 para acertar, alcance 6m. Dano: 19 (3d6 + 9) de dano de Força mais 14 (4d6) de dano psíquico. O golpe corta a carne e injeta mana instável no sistema nervoso do alvo. O inimigo atingido deve passar numa RES de Carisma (CD 22) ou terá seus canais de mana bloqueados, ficando impossibilitado de usar habilidades de conjuração até o início do próximo turno do Sirenídeo.',
      },
      {
        nome: 'Miragem de afogamento (Recarga 5T)',
        desc: 'O Sirenídeo projeta uma onda massiva de mana ilusório num raio de 12 metros. Os alvos na área veem o ambiente se transformar em um vácuo abissal inundado. Cada criatura deve passar numa RES de Inteligência (CD 22). Falha: Sofre 66 (12d10) de dano psíquico e fica Atordoada por 1 minuto enquanto colapsa no chão tentando tossir uma água que não existe. A criatura pode repetir a RES no final de cada um de seus turnos para encerrar o efeito. Sucesso: Metade do dano e não fica atordoada.',
      },
      {
        nome: 'Deslocamento sinuoso',
        desc: 'O Sirenídeo teletransporta-se através da umidade do ar para um espaço vazio que possa ver a até 24 metros, deixando uma miragem translúcida em seu lugar antigo.',
      },
      {
        nome: 'Contracolpe hidrostático',
        desc: 'O Sirenídeo libera um estilhaço de água pressurizada contra um alvo que errou um ataque ou magia contra ele nesta rodada. Ataque à Distância Mágico: +14 para acertar, alcance 18m. Dano: 18 (4d8) de dano de Força e o alvo é empurrado 3 metros.',
      },
      {
        nome: 'Tortura Mental (2 ações)',
        desc: 'O Sirenídeo foca suas cicatrizes rúnicas em uma criatura atordoada ou enfeitiçada a até 18 metros. O alvo deve fazer uma RES de Sabedoria (CD 22) ou descarregará sua habilidade ou magia mais poderosa contra seus próprios aliados no próximo turno.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: 'Visão Verdadeira 24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Fragmento de Pele com Cicatriz Rúnica Neon',
      },
      {
        range: '2',
        item: 'Tecido de Seda Molhada do Sirenídeo',
      },
      {
        range: '3',
        item: 'Colar de Ossos de Aventureiros Entalhados',
      },
      {
        range: '4',
        item: 'Núcleo de Fluido Cerebral Hidrostático',
      },
    ],
  },
  rahabTaumaturgo: {
    name: 'Rahab Taumaturgo',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/vrof5Yq.png',
    image: 'https://2img.net/i.imgur.com/Eqi1D4Z.jpeg',
    subtitle: 'CR 20',
    description: `A presença de Rahab no campo de batalha é projetada para subjugar os oponentes pela pura soberba visual. Ele adota uma postura bípede assustadoramente rasgada e definida, exibindo uma musculatura exposta, nua e suada que não possui nenhuma escama ou carapaça protetora nas frentes ou nos flancos. Suas pernas são longas e ágeis, permitindo que ele flutue e se movha com uma graciosidade divina sobre as marés.

O detalhe mais impactante de sua anatomia reside em seu peito largo. A carne se abre para revelar suas costelas escuras por baixo da pele viva, agindo como uma gaiola aberta que expõe seu núcleo místico: uma Estrela Abissal Azul que brilha com uma luz intelectual violenta. Em sua cintura, preso por correntes de ferro negro pesadas, ele carrega fragmentos de coroas e relíquias profanadas de reinos antigos que foram tragados pelo oceano, canalizando o poder herético desses artefatos para distorcer a gravidade ao seu redor.`,
    type: 'Monstro Grande (Bípede)',
    ac: '25',
    hp: '+355 (30d10 + 190)',
    speed: '12 metros, natação 30 metros (flutuar).',
    stats: {
      forca: '16 (+3)',
      destreza: '24 (+7)',
      constituicao: '22 (+6)',
      inteligencia: '30 (+10)',
      sabedoria: '20 (+5)',
      carisma: '26 (+8)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Rahab Taumaturgo for alvo de dano Gélido ou Psíquico, ele não sofre dano. Em vez disso, ele quebra as barreiras planares da energia, recuperando 50 Pontos de Vida e ganhando uma Carga de Taumaturgia. Ele pode gastar uma Carga de Taumaturgia para invocar instantaneamente uma Réplica de Alta Pressão ou para usar a habilidade Inversão de Polaridade Mística sem gastar sua recarga.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gélido, Psíquico, Ácido, Veneno; Concussão, Perfurante e Cortante de ataques não-mágicos, Enfeitiçado, Aterrorizado, Atordoado, Cego, Envenenado, Paralisado, Petrificado, Caído, Exaustão, Preso, Agarrado.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Trovão, Força, Necrótico; Concussão, Perfurante e Cortante de armas mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Elétrico',
      },
      {
        nome: 'Idiomas',
        desc: 'Aquático Primordial, Dialeto Rúnico',
      },
      {
        nome: 'Gaiola da estrela abissal',
        desc: 'No centro de seu peito largo e nu, as costelas escuras de Rahab são visíveis por baixo da carne viva, agindo como uma gaiola aberta que expõe seu núcleo místico, que brilha como uma estrela abissal azul. Essa radiação intelectual gera um campo de opressão mental num raio de 24 metros. Qualquer jogador na área que tentar conjurar uma magia ou usar uma habilidade ativa deve passar numa RES de Inteligência (CD 25). Se falhar, o brilho da estrela sabota sua mente, fazendo com que a habilidade falhe e o jogador sofra 22 (4d10) de dano psíquico.',
      },
      {
        nome: 'Musculatura de Humilhação',
        desc: 'O corpo bípede de Rahab é assustadoramente rasgado, definido e completamente desprovido de escamas. A crueza de sua musculatura exposta e suada serve para humilhar os oponentes pela força visual e soberba estética. Inimigos a até 12 metros que olharem diretamente para o monstro sofrem desvantagem em todas as jogadas de ataque e testes de resistência de Carisma devido à quebra de sua própria confiança e imponência.',
      },
      {
        nome: 'Soberania das reliquias',
        desc: 'Rahab usa apenas fragmentos de coroas e relíquias de reinos antigos submersos presos diretamente em sua cintura por correntes de ferro negro, deixando suas pernas longas e flancos totalmente à mostra. A energia herética dessas relíquias faz com que o terreno num raio de 18 metros ao redor dele flua como água pesada. Inimigos na área se movem com um terço do deslocamento normal e não podem usar reações.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até três ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Rahab Taumaturgo realiza três ataques de Toque do Caos Primordial ou usa sua habilidade Invocação de Réplica.',
      },
      {
        nome: 'Toque do caos',
        desc: 'Ataque Corpo a Corpo Mágico: +17 para acertar, alcance 3m. Dano: 24 (3d8 + 11) de dano de Força mais 14 (4d6) de dano psíquico. A carne exposta de suas mãos transmite a pressão do plano elemental, estilhando a barreira física e mental do alvo.',
      },
      {
        nome: 'Inversão de polaridade (Recarga 5T)',
        desc: 'Rahab manipula o mana líquido no ar para inverter os conceitos de combate dos jogadores por 1 rodada completa. O monstro emana um pulso azul através de sua estrela abissal. Todos os heróis num raio de 24 metros devem passar numa RES de Sabedoria (CD 25). Falha: Durante o próximo turno dos afetados, qualquer ataque ou magia de dano direcionada a Rahab ou às suas réplicas irá curá-los no mesmo valor do dano. Além disso, qualquer magia de suporte, cura ou buff que os jogadores tentarem aplicar em seus aliados causará dano de Força equivalente ao efeito pretendido.',
      },
      {
        nome: 'Invocação de réplica',
        desc: 'Rahab manifesta uma Réplica de Alta Pressão feita de água pura e compactada em um espaço vazio a até 18 metros. A réplica possui a mesma aparência, a mesma CA e os mesmos bônus de ataque de Rahab, mas possui apenas 60 Pontos de Vida e não pode usar a Inversão de Polaridade. A réplica executa feitiços e ataques de forma independente na mesma contagem de iniciativa de Rahab. O monstro pode manter até duas réplicas ativas simultaneamente.',
      },
      {
        nome: 'Fluidez plenar',
        desc: 'Rahab desfaz seu corpo físico em água e se teletransporta para um espaço vazio a até 30 metros, ou troca de lugar instantaneamente com uma de suas Réplicas de Alta Pressão ativas.',
      },
      {
        nome: 'Comando do caos',
        desc: 'Rahab ordena que uma de suas réplicas ativas realize imediatamente um ataque de Toque do Caos Primordial ou use seu deslocamento completo.',
      },
      {
        nome: 'Explosão Hidrostástica (2 ações)',
        desc: 'Rahab faz uma de suas réplicas ativas explodir em água pressurizada. Cada criatura a até 6 metros da réplica destruída deve passar numa RES de Destreza (CD 25) ou sofrerá 44 (8d10) de dano de Força e será empurrada 9 metros para trás.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '15',
      visaoEscuro: 'Visão Verdadeira 36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo da Estrela Abissal Azul',
      },
      {
        range: '2',
        item: 'Correntes de Ferro Negro do Caos',
      },
      {
        range: '3',
        item: 'Fragmento da Coroa do Reino Submerso',
      },
      {
        range: '4',
        item: 'Tecido Muscular Primordial do Taumaturgo',
      },
    ],
  },
  salamancerFogo: {
    name: 'Salamancer (Fogo)',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/RhSnFXe.png',
    image: 'https://2img.net/i.imgur.com/sXRPA6u.jpeg',
    subtitle: 'CR1',
    description: `Esta criatura possui o porte pequeno e o corpo extremamente flexível de uma salamandra, o que a permite rastejar por brechas minúsculas nas rochas. Sua pele é uma mistura de escamas escuras carbonizadas com fendas abertas de pura brasa viva, que brilham de acordo com o humor do monstro. Suas narinas exalam constantemente uma fuligem escura e uma cortina de fumaça preta e densa, usada para despistar predadores.

A cauda do Salamancer é uma de suas partes mais ativas, movendo-se de um lado para o outro de forma frenética e espalhando fagulhas ardentes por onde passa. Embora não possuam uma inteligência complexa, eles têm um senso de sobrevivência aguçado e desconfiado. São altamente territorialistas em relação às suas tocas e, embora prefiram evitar o combate direto fugindo para locais seguros, eles atacam à distância cuspindo pequenas esferas de fogo antes de se camuflarem na fumaça.`,
    type: 'Monstro Pequeno, Salamancer',
    ac: '13',
    hp: '27 (5d6 + 10)',
    speed: '9 metros, escalada 9 metros.',
    stats: {
      forca: '10 (+0)',
      destreza: '16 (+3)',
      constituicao: '14 (+2)',
      inteligencia: '5 (-3)',
      sabedoria: '12 (+1)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Salamancer for alvo de dano de Fogo, ele não sofre dano. Em vez disso, ele absorve o calor para superaquecer suas glândulas internas, recuperando 8 Pontos de Vida e permitindo que use sua reação para disparar sua Bola de Fogo Menor imediatamente sem gastar sua ação do turno.',
      },
      {
        nome: 'Imunidade',
        desc: 'Fogo',
      },
      {
        nome: 'Resistência',
        desc: 'Veneno; Concussão de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Água',
      },
      {
        nome: 'Comportamento incendiário',
        desc: 'Sendo travesso e caótico por instinto, se o Salamancer estiver em um ambiente com elementos inflamáveis como grama seca, madeira ou óleo, seus ataques baseados em fogo incendeiam o terreno num raio de 1,5 metros. Qualquer criatura que iniciar ou terminar seu turno nessa área incendiada sofre 3 (1d6) de dano de fogo.',
      },
      {
        nome: 'Esgueirar-se',
        desc: 'Graças ao seu corpo flexível e rastejante de salamandra, o Salamancer possui um senso aguçado de sobrevivência. Ele pode usar a ação de Desengajar como uma ação bônus em seu turno e consegue se mover através do espaço de qualquer criatura de tamanho Médio ou maior sem penalidades.',
      },
      {
        nome: 'Fúria do encurralado',
        desc: 'Quando os Pontos de Vida do Salamancer caem para menos da metade de seu máximo (13 PV ou menos), ele se torna feroz e desesperado. O monstro ganha vantagem em todas as suas jogadas de ataque e adiciona 2 (1d4) de dano de fogo a todos os seus golpes corporais.',
      },
    ],
    acoes: [
      {
        nome: 'Mordida incandescente',
        desc: 'Ataque Corpo a Corpo Físico: +5 para acertar, alcance 1m. Dano: 5 (1d4 + 3) de dano perfurante mais 2 (1d4) de dano de fogo quando seus dentes aquecidos perfuram o alvo.',
      },
      {
        nome: 'Cuspir bola de fogo (Recarga 5T)',
        desc: 'O Salamancer projeta uma pequena esfera de brasas ardentes de sua boca contra um alvo a até 9 metros de distância. Ataque à Distância Mágico: +5 para acertar. Dano: 9 (2d6 + 3) de dano de fogo.',
      },
      {
        nome: 'Cortina de fumaça',
        desc: 'O Salamancer exala uma nuvem de fumaça preta e densa num raio de 1,5 metros ao seu redor. A área fica sob efeito de escuridão leve até o início do próximo turno do monstro, e o Salamancer pode realizar a ação de Esconder-se imediatamente.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Glândula de Ignição Intacta',
      },
      {
        range: '2',
        item: 'Pele de Salamandra Maleável',
      },
      {
        range: '3',
        item: 'Cauda de Brasas Ativas',
      },
      {
        range: '4',
        item: 'Frasco de Fuligem Mágica',
      },
    ],
  },
  dracoDeLava: {
    name: 'Draco de lava',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/snHl7go.png',
    image: 'https://2img.net/i.imgur.com/0LH7p6K.jpeg',
    subtitle: 'CR 5',
    description: `A anatomia do Draco de Lava é definida por um contraste brutal e fascinante. Suas costas, sua cauda longa e robusta e o topo de sua cabeça são completamente blindados por placas pesadas de pedra negra e espessa, o basalto vulcânico, tornando-o praticamente invulnerável a ataques convencionais vindos por cima ou por trás.

Em total contrapartida, toda a sua parte frontal é inteiramente desprotegida e nua. A garganta, o peitoral largo e a parte interna de suas pernas exibem uma pele de um tom vermelho-escuro, macia e terrivelmente superaquecida. Por baixo dessa pele frontal fina, é possível enxergar veias ramificadas brilhando intensamente onde o fogo elemental é gerado. O espetáculo mais aterrorizante ocorre quando o monstro abre suas mandíbulas ou se ergue levemente: o calor do magma concentrado em seu estômago é tão violento que a luz gerada ilumina toda a sua caixa torácica por dentro, transformando sua estrutura óssea em uma silhueta macabra visível através da carne viva.`,
    type: 'Monstro Grande, Draco',
    ac: '16',
    hp: '+85 (10d10 + 30)',
    speed: '9 metros, natação em magma 9 metros.',
    stats: {
      forca: '18 (+4)',
      destreza: '12 (+1)',
      constituicao: '16 (+3)',
      inteligencia: '5 (-3)',
      sabedoria: '12 (+1)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Draco de Lava for alvo de dano de Fogo, ele não sofre dano. Em vez disso, ele direciona o calor para o seu estômago herético, recuperando 15 Pontos de Vida e ganhando uma Carga de Magma. Ele pode gastar uma Carga de Magma para usar sua habilidade Sopro de Magma Viscoso imediatamente sem rolar dados de recarga.',
      },
      {
        nome: 'Imunidade',
        desc: 'Fogo',
      },
      {
        nome: 'Resistência',
        desc: 'Veneno; Concussão, Perfurante e Cortante de ataques não-mágicos (apenas contra golpes que atinjam suas costas ou cauda).',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Água',
      },
      {
        nome: 'Peitoral superaquecido',
        desc: 'Há um contraste brutal na anatomia do Draco. Toda a sua parte frontal, incluindo a garganta, o peitoral largo e a parte interna das pernas, é completamente desprotegida e nua, revelando uma pele vermelha-escura e macia. Qualquer ataque corpo a corpo desferido contra o Draco pela sua frente ignora o bônus de suas placas de basalto, reduzindo a CA do monstro para 12 contra aquele ataque específico. No entanto, devido ao calor extremo, o atacante sofre 4 (1d8) de dano de fogo pela proximidade com a carne viva superaquecida.',
      },
      {
        nome: 'Brilho da caixa torácica',
        desc: 'Quando o Draco abre a boca para atacar ou se ergue em suas patas traseiras, o brilho do magma em seu estômago ilumina toda a sua caixa torácica por dentro através da pele frontal fina. Todos os inimigos a até 6 metros que testemunharem esse vislumbre devem passar numa RES de Sabedoria (CD 14) ou ficarão Aterrorizados até o início do próximo turno do Draco devido à imposição herética do predador.',
      },
      {
        nome: 'Placas pesadas de basalto',
        desc: 'As costas, a cauda robusta e o topo da cabeça do Draco são blindados por rocha negra espessa. O Draco possui imunidade a danos colaterais de acertos críticos se o ataque vier de trás ou de cima, tratando-os como ataques normais.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Draco de Lava realiza dois ataques: um de Mordida Calcinante e um de Pancada de Cauda de Basalto',
      },
      {
        nome: 'Mordida Calcinante',
        desc: 'Ataque Corpo a Corpo Físico: +7 para acertar, alcance 1m. Dano: 11 (2d6 + 4) de dano perfurante mais 4 (1d8) de dano de fogo proveniente de sua garganta superaquecida.',
      },
      {
        nome: 'Pancada de cauda',
        desc: 'Ataque Corpo a Corpo Físico: +7 para acertar, alcance 3m. Dano: 13 (2d8 + 4) de dano de concussão. O alvo deve passar numa RES de Força (CD 14) ou será arremessado 3 metros para trás e derrubado Caído devido ao peso da blindagem de pedra negra.',
      },
      {
        nome: 'Sopro de Magma (Recarga 5T)',
        desc: 'O Draco expele um jato de rocha derretida em um cone de 9 metros. Cada criatura na área deve passar numa RES de Destreza (CD 14). Falha: Sofre 22 (5d8) de dano de fogo e fica sob a condição Preso à medida que o magma resfria rapidamente ao redor de seus membros. Uma criatura presa pode gastar sua ação para fazer um teste de Força (CD 14) para quebrar a crosta de pedra. Sucesso: Metade do dano e não fica presa.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Placa de Basalto Dorsal',
      },
      {
        range: '2',
        item: 'Coração de Lava Congelada',
      },
      {
        range: '3',
        item: 'Sangue de Veias Incandescentes',
      },
      {
        range: '4',
        item: 'Garra do Dragão Primitivo',
      },
    ],
  },
  tiranoDeMagma: {
    name: 'Tirano de Magma',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/PS7iGyJ.png',
    image: 'https://2img.net/i.imgur.com/Cl5u3T8.jpeg',
    subtitle: 'CR 10',
    description: `A silhueta deste monstro evoca a imagem de uma fortaleza viva inclinada para a frente. Suas patas dianteiras e ombros passaram por um crescimento bizarro, tornando-se massivos, altos e robustos, dando à criatura a postura pesada e intimidadora de um gorila reptiliano de pedra. As costas e a cauda são blindadas por espinhos de basalto negro que funcionam como chaminés geotérmicas ativas, expelindo jatos contínuos de fuligem preta que formam uma tempestade de cinzas permanente sobre o monstro, enquanto faíscas de eletricidade estática estalam entre as rochas.

Sua cabeça abandonou a anatomia de um jacaré comum através de uma mutação grotesca: sua mandíbula inferior é dividida verticalmente ao meio. Quando o Tirano ruge, sua boca se abre em três partes distintas, expandindo-se para as laterais e revelando fileiras triplas de dentes feitos de obsidiana negra e afiada.

Em total contraste com a blindagem dorsal, toda a sua região frontal é desprovida de escamas. O pescoço largo, o peito e o ventre são compostos por placas de músculos hiper-definidos em tons de vermelho-escuro que deslizam umas sobre as outras como uma falha tectônica de carne viva sempre que a besta respira. Desta parede muscular trincada e exposta não escorre apenas suor comum, mas sim um sangramento constante de magma fervente e oleoso que chora diretamente das fendas musculares, iluminando a estrutura óssea do Tirano por dentro.`,
    type: 'Monstro Imenso',
    ac: '18',
    hp: '+184 (16d12 + 80)',
    speed: '9 metros, natação em magma 15 metros.',
    stats: {
      forca: '24 (+7)',
      destreza: '10 (+0)',
      constituicao: '20 (+5)',
      inteligencia: '5 (-3)',
      sabedoria: '14 (+2)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Tirano de Magma for alvo de dano de Fogo, ele não sofre dano. Em vez disso, o calor estabiliza sua musculatura exposta, fazendo-o recuperar 25 Pontos de Vida e ganhar uma Carga de Fusão. Ele pode gastar uma Carga de Fusão para desimpedir instantaneamente a recarga de seu Sopro de Magma Diluviano ou para realizar um ataque bônus de Mordida Esmagadora.',
      },
      {
        nome: 'Imunidade',
        desc: 'Fogo, Veneno, Caído, Paralisado, Envenenado, Exaustão.',
      },
      {
        nome: 'Resistência',
        desc: 'Concussão, Perfurante e Cortante de ataques não-mágicos (apenas para golpes que atinjam suas costas ou laterais espinhosas).',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Água',
      },
      {
        nome: 'Parede de músculos',
        desc: 'Toda a parte frontal do Tirano (a mandíbula inferior, o pescoço largo, o peito e o abdômen reptiliano) perdeu completamente as escamas, expondo uma parede de músculos hiper-definidos, vermelhos e pulsantes, cobertos por um suor espesso e oleoso que brilha intensamente. Qualquer ataque físico desferido diretamente contra a sua frente ignora a proteção dos espinhos, reduzindo a CA do monstro para 14 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 9 (2d8) de dano de fogo devido ao contato próximo com o suor fervente e a carne viva superaquecida.',
      },
      {
        nome: 'Expansão Torácica Fervente',
        desc: 'Quando o Tirano ruge ou canaliza suas habilidades, sua caixa torácica se expande violentamente e o magma ferve de forma visível diretamente através dos tecidos musculares expostos do ventre. Todos os inimigos a até 9 metros que olharem para a criatura devem passar numa RES de Sabedoria (CD 17) ou ficarão Aterrorizados por 1 rodada devido à humilhação visual da força bruta do predador alfa.',
      },
      {
        nome: 'Fileira de espinhos vulcânicos',
        desc: 'As costas e a cauda do Tirano são blindadas por espinhos de basalto negro e afiados. Qualquer criatura que tentar agarrar o monstro por trás ou que desferir um ataque físico corpo a corpo contra suas costas sofre 7 (2d6) de dano perfurante mais 4 (1d8) de dano de fogo pelos estilhaços incandescentes.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Tirano de Magma realiza três ataques: um de Mordida Esmagadora de Fusão e dois de Pancada de Cauda Espinhosa, ou usa sua habilidade Sopro de Magma Diluviano.',
      },
      {
        nome: 'Mordida esmagadora',
        desc: 'Ataque Corpo a Corpo Físico: +11 para acertar, alcance 3m. Dano: 23 (3d10 + 7) de dano perfurante mais 9 (2d8) de dano de fogo de sua garganta exposta. O alvo deve passar numa RES de Força (CD 17) ou ficará Agarrado e Preso na mandíbula inferior do Tirano (CD 17 para escapar). Enquanto prender uma criatura, o Tirano ganha vantagem em ataques de mordida contra ela.',
      },
      {
        nome: 'Pancada de cauda espinhosa',
        desc: 'Ataque Corpo a Corpo Físico: +11 para acertar, alcance 4m. Dano: 16 (2d8 + 7) de dano de concussão mais 7 (2d6) de dano perfurante dos espinhos vulcânicos. O alvo deve passar numa RES de Força (CD 17) ou será empurrado 6 metros para trás e derrubado Caído.',
      },
      {
        nome: 'Sopro de magma (Recarga 5T)',
        desc: 'O Tirano expande seu ventre e expele uma torrente massiva de rocha derretida em um cone de 12 metros. Cada criatura na área deve passar numa RES de Destreza (CD 17).  Falha: Sofre 45 (10d8) de dano de fogo, é empurrada 3 metros e fica sob a condição Preso à medida que o magma espesso se solidifica ao redor de seu corpo. A criatura presa sofre 9 (2d8) de dano de fogo no início de seus turnos e deve gastar uma ação para passar num teste de Força (CD 17) para quebrar a rocha.  Sucesso: Metade do dano e não fica presa ou empurrada.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Espinho Vulcânico Negro Maciço',
      },
      {
        range: '2',
        item: 'Coração de Deinosuchus de Magma',
      },
      {
        range: '3',
        item: 'Glândula de Suor Oleoso Incandescente',
      },
      {
        range: '4',
        item: 'Couro de Músculo Vermelho Preservado',
      },
    ],
  },
  fauceDeMagma: {
    name: 'Fauce de magma',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/sSyWqh1.png',
    image: 'https://2img.net/i.imgur.com/JSZPySi.jpeg',
    subtitle: 'CR 15',
    description: `A silhueta do Fauce de Magma é lisa, compacta e fatal. As antigas placas e espinhos basálticos de suas costas e cauda fundiram-se completamente, dando origem a uma couraça dorsal única feita de obsidiana negra polida e espelhada. Essa blindagem é tão perfeitamente lisa que reflete o fogo ambiente com a clareza de um espelho sombrio, tornando o monstro visualmente camuflado em meio aos rios de lava e distorcendo a percepção de distância dos jogadores.

A parte frontal do monstro é uma exibição chocante e extrema de anatomia reptiliana. Seu peito largo e abdômen são tão trincados e definidos que parecem ter sido esculpidos à faca por um escultor sádico. A carne viva exibe um tom vermelho-púrpura superaquecido, totalmente livre de gordura. Por sobre esses músculos tensos, veias grossas como cordas de navio pulsam com um brilho branco-azulado avassalador, denunciando que a temperatura interna do monstro atingiu o estado de plasma. Da pele nua do Fauce não escorre suor comum: a umidade é expelida pelos poros sob a forma de pequenos jatos de vapor sob alta pressão, gerando um chiado sibilante constante que ecoa pelo cenário como uma panela de pressão prestes a explodir.`,
    type: 'Monstro Grande (Compacto)',
    ac: '21',
    hp: '+215 (22d10 + 94)',
    speed: '12 metros, natação em magma 24 metros.',
    stats: {
      forca: '26 (+8)',
      destreza: '18 (+4)',
      constituicao: '22 (+6)',
      inteligencia: '6 (-2)',
      sabedoria: '16 (+3)',
      carisma: '12 (+1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Fauce de Magma for alvo de dano de Fogo, ele não sofre dano. Em vez disso, o calor extremo é comprimido em seu núcleo muscular, fazendo-o recuperar 35 Pontos de Vida e ganhar uma Carga de Pressão. Ele pode gastar uma Carga de Pressão para liberar seus Jatos de Vapor sob Alta Pressão sem gastar ações ou para recarregar instantaneamente seu Sopro de Plasma Branco-Azulado.',
      },
      {
        nome: 'Imunidade',
        desc: 'Fogo, Veneno, Caído, Paralisado, Preso, Agarrado, Envenenado, Exaustão.',
      },
      {
        nome: 'Resistência',
        desc: 'Ácido, Força; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Água',
      },
      {
        nome: 'Musculatura esculpida',
        desc: 'Toda a região frontal do Fauce (peito e abdômen) é uma exibição extrema de anatomia reptiliana superaquecida, sem um pingo de gordura e com músculos definidos em tons vermelho-púrpura de carne viva. Veias grossas como cordas pulsam com um brilho branco-azulado de calor letal. Ataques físicos pela frente ignoram a placa de obsidiana, reduzindo a CA do monstro para 15 contra aquele golpe específico. No entanto, qualquer criatura a até 3 metros sofre 14 (4d6) de dano de fogo pela proximidade radiante da carne viva.',
      },
      {
        nome: 'Som de panela de pressão',
        desc: 'O suor espesso do monstro é expelido pelos poros da carne exposta sob a forma de pequenos jatos de vapor sob alta pressão, gerando um som sibilante contínuo e ensurdecedor. Inimigos a até 9 metros têm desvantagem em testes de Percepção baseados na audição e sofrem desvantagem em testes de Concentração mágica devido ao ruído e à pressão atmosférica.',
      },
      {
        nome: 'Placa espelhada de obsidiana',
        desc: 'As escamas das costas e da cauda do Fauce fundiram-se em uma única placa lisa, polida e espelhada de obsidiana negra que reflete o fogo ao redor. Ataques à distância baseados em projéteis de luz, energia ou magias de fogo direcionados às suas costas são automaticamente refletidos para o atacante original. Além disso, jogadas de ataque físico desferidas contra as suas costas possuem desvantagem.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Fauce de Magma realiza três ataques: dois de Garras Perfurantes e um de Mordida Hiperbárica, ou usa sua habilidade Sopro de Plasma Branco-Azulado.',
      },
      {
        nome: 'Garras perfuranes',
        desc: 'Ataque Corpo a Corpo Físico: +13 para acertar, alcance 1m. Dano: 18 (3d6 + 8) de dano cortante mais 7 (2d6) de dano de fogo pelas garras aquecidas.',
      },
      {
        nome: 'Mordida Hiperbárica',
        desc: 'Ataque Corpo a Corpo Físico: +13 para acertar, alcance 1m. Dano: 27 (3d12 + 8) de dano perfurante mais 14 (4d6) de dano de fogo de calor branco-azulado. O alvo deve passar numa RES de Força (CD 21) ou será esmagado pela mandíbula compacta, sofrendo 1 nível de exaustão temporária por desidratação extrema e ficando sob a condição Agarrado (CD 21 para escapar).',
      },
      {
        nome: 'Sopro de plasma (Recarga 5T)',
        desc: 'O Fauce expele um feixe ultrafino de fogo e rocha vaporizada sob altíssima pressão em uma linha de 27 metros de comprimento por 1metro de largura. Cada criatura na linha deve passar numa RES de Destreza (CD 21).    Falha: Sofre 71 (13d10) de dano de fogo e tem sua armadura ou escudo mundano derretidos, reduzindo permanentemente a CA oferecida pelo item em 2 pontos.  Sucesso: Metade do dano e a armadura não sofre penalidades.',
      },
      {
        nome: 'Disparo de vapor',
        desc: 'O Fauce libera jatos de vapor de alta pressão pelos poros do peito, impulsionando-se para trás ou para os lados por até 9 metros sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Chicotada de obsidiana',
        desc: 'Ataque Corpo a Corpo Físico: +13 para acertar, alcance 3m. Dano: 15 (2d6 + 8) de dano de concussão e o alvo deve passar numa RES de Destreza (CD 21) ou será derrubado Caído pelo impacto da cauda espelhada.',
      },
      {
        nome: 'Válvula de Escape (2 ações)',
        desc: 'O Fauce abre completamente os poros de seu abdômen esculpido, liberando uma explosão de vapor superaquecido num raio de 6 metros. Cada criatura na área deve passar numa RES de Constituição (CD 21) ou sofrerá 21 (6d6) de dano de fogo e ficará Cega até o final do próximo turno do Fauce devido ao vapor nos olhos.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '27 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Placa Espelhada de Obsidiana Pura',
      },
      {
        range: '2',
        item: 'Corda de Veia de Calor Branco',
      },
      {
        range: '3',
        item: 'Núcleo Hidropneumático de Vapor',
      },
      {
        range: '4',
        item: 'Fragmento de Carne Viva Vermelho-Púrpura',
      },
    ],
  },
  calamidadeDeMagma: {
    name: 'Calamidade de Magma',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/HnjeIBJ.png',
    image: 'https://2img.net/i.imgur.com/j04WqtO.jpeg',
    subtitle: 'CR 20',
    description: `A Calamidade de Magma apresenta o terror da carne levado às últimas consequências. Sua silhueta é assustadoramente atlética, operando em uma estrutura bípede e quadrúpede totalmente flexível que se molda dinamicamente ao terreno. Ela abriu mão de absolutamente toda e qualquer carapaça, escama ou placa de pedra protetora. Seu corpo é pura carne exposta, nua, suada e terrivelmente superaquecida.

A musculatura do peitoral largo, dos glúteos e das coxas robustas é desenhada com uma precisão anatômica brutal, sádica e provocativa, exibindo o poder bruto de um predador alfa que não conhece o conceito de vergonha ou fraqueza. Por onde caminha, a densidade de sua carne atrai o próprio ambiente: o ar, a fuligem, o fogo livre e até os corpos dos adversários sofrem uma distorção óptica, sendo sugados em direção ao monstro por um campo gravitacional térmico invisível.

Suas mandíbulas sofreram a mutação definitiva, partindo-se em fendas profundas que descem por toda a extensão de seu pescoço nu. Quando a criatura abre seu rastro de ataque, o pescoço se divide por completo, revelando que todo o seu interior não possui mais órgãos convencionais, mas sim um fluxo contínuo, espesso e destrutivo de lava pastosa em ponto de fusão atômica.`,
    type: 'Monstro Grande (Flexível)',
    ac: '24',
    hp: '+385 (30d10 + 220)',
    speed: '12 metros, natação em magma 36 metros',
    stats: {
      forca: '30 (+10)',
      destreza: '24 (+7)',
      constituicao: '26 (+8)',
      inteligencia: '6 (-2)',
      sabedoria: '16 (+3)',
      carisma: '24 (+7)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Calamidade de Magma for alvo de dano de Fogo ou de Força, ela não sofre dano. Em vez disso, o monstro colapsa essa energia em sua própria massa de alta densidade, recuperando 50 Pontos de Vida e ganhando uma Carga de Calamidade. Ela pode gastar uma Carga de Calamidade para ativar instantaneamente seu Sopro de Lava Pastosa sem precisar rolar dados de recarga ou para forçar sucesso automático em um teste de resistência.',
      },
      {
        nome: 'Imunidade',
        desc: 'Fogo, Força, Veneno, Ácido; Concussão, Perfurante e Cortante de ataques não-mágicos, Enfeitiçado, Aterrorizado, Atordoado, Cego, Envenenado, Paralisado, Petrificado, Caído, Exaustão, Preso, Agarrado.',
      },
      {
        nome: 'Resistência',
        desc: 'Trovão, Psíquico, Necrótico; Concussão, Perfurante e Cortante de armas mágicas.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Água',
      },
      {
        nome: 'Campo gravitacional Térmico',
        desc: 'A densidade molecular da Calamidade é tão absurda que ela gera seu próprio campo de atração gravitacional baseado em calor apenas ao caminhar. Qualquer criatura, projétil ou elemento livre num raio de 18 metros é violentamente puxado em direção ao monstro. No início do turno de cada inimigo nessa área, ele deve passar numa RES de Força (CD 25) ou será puxado 6 metros em linha reta em direção às mandíbulas da besta e terá seu deslocamento reduzido pela metade até o fim do turno atual.',
      },
      {
        nome: 'Horror da carne exposta',
        desc: 'O monstro exibe uma silhueta assustadoramente atlética e um corpo bípede e quadrúpede totalmente flexível. Sem nenhuma carapaça ou escama protetora em todo o seu corpo, a criatura é pura carne exposta, suada e superaquecida. A musculatura do peitoral, dos glúteos e das coxas é desenhada com uma precisão anatômica brutal e provocativa, demonstrando um poder bruto que não conhece a vergonha. Devido à total ausência de blindagem, ataques físicos contra ela possuem vantagem, mas qualquer criatura que desferir um ataque corpo a corpo contra o monstro sofre 21 (6d6) de dano de fogo imediato devido ao contato com o tecido muscular vivo que opera em temperatura de fusão.',
      },
      {
        nome: 'Mandibulas da fenda do cataclismo',
        desc: 'As mandíbulas da Calamidade se abrem em fendas profundas que descem por todo o seu pescoço nu, revelando que todo o seu interior é um fluxo contínuo de lava pastosa e altamente destrutiva. Todos os ataques baseados em sua mordida ou sopro ignoram completamente quaisquer resistências a dano de fogo e tratam imunidades como se fossem apenas resistências comuns.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Calamidade de Magma realiza três ataques: dois com suas Garras da Calamidade e um com sua Mordida da Fenda do Cataclismo, ou usa sua habilidade Sopro de Lava Pastosa.',
      },
      {
        nome: 'Garras da calamidade',
        desc: 'Ataque Corpo a Corpo Mágico: +16 para acertar, alcance 3m. Dano: 23 (3d8 + 10) de dano cortante mais 14 (4d6) de dano de fogo pela fricção da carne superaquecida.',
      },
      {
        nome: 'Mordida da fenda do cataclismo',
        desc: ' Ataque Corpo a Corpo Mágico: +16 para acertar, alcance 4m. Dano: 36 (4d12 + 10) de dano perfurante mais 18 (4d8) de dano de fogo pastoso. O alvo deve passar numa RES de Constituição (CD 25) ou começará a derreter de dentro para fora devido à lava pastosa inserida em seu organismo, sofrendo 25 PV de dano de fogo no início de cada um de seus turnos até passar na RES (que pode ser repetida no fim de cada um de seus turnos).',
      },
      {
        nome: 'Sopro de lava pastosa (Recarga 5T)',
        desc: 'A Calamidade expele a torrente de rocha derretida e espessa que corre por seu pescoço, cobrindo uma linha de 45 metros de comprimento por 3 metros de largura. Cada criatura na área deve passar numa RES de Destreza (CD 25). Falha: Sofre 99 (18d10) de dano de fogo, é derrubada Caído e fica sob a condição Preso pela massa vulcânica pesada que se solidifica instantaneamente. Se o alvo for um navio, barreira ou estrutura do cenário, o dano é dobrado. Sucesso: Metade do dano e não sofre os efeitos de queda ou aprisionamento.',
      },
      {
        nome: 'Colapso de massa',
        desc: 'A Calamidade se move até seu deslocamento completo de natação ou metade de seu deslocamento terrestre sem provocar ataques de oportunidade. Todas as criaturas a até 6 metros do caminho de movimento devem passar numa RES de Força (CD 25) ou serão puxadas para espaços adjacentes ao monstro devido ao vácuo cinético.',
      },
      {
        nome: 'Chicotada tectonica',
        desc: 'A Calamidade golpeia com sua cauda muscular de carne viva. Ataque Corpo a Corpo: +16 para acertar, alcance 6m. Dano: 19 (2d8 + 10) de dano de concussão e o alvo deve passar numa RES de Força (CD 25) ou será arremessado 9 metros para trás de sua posição atual.',
      },
      {
        nome: 'Erupção de sangue magmático (2 ações)',
        desc: 'A Calamidade contrai violentamente os músculos de suas coxas e glúteos, fazendo com que os poros de sua carne expelam jatos de lava pastosa num raio de 12 metros. Cada criatura na área deve passar numa RES de Destreza (CD 25) ou ficará Cega e sofrendo 22 (4d10) de dano de fogo até o final do próximo turno do monstro.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: 'Sentido Sísmico 45 metros, Visão no Escuro 36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo do Campo Gravitacional Térmico',
      },
      {
        range: '2',
        item: 'Mandíbula de Fenda da Calamidade',
      },
      {
        range: '3',
        item: 'Essência de Carne Viva Superaquecida',
      },
      {
        range: '4',
        item: 'Sangue de Lava Pastosa Destrutiva',
      },
    ],
  },
  dracoRunico: {
    name: 'Draco Rúnico',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/PJLwLcK.png',
    image: 'https://2img.net/i.imgur.com/Vu5KvDX.jpeg',
    subtitle: 'CR 5',
    description: `O Draco Rúnico ostenta uma postura bípede completamente ereta e esguia, exalando uma graciosidade sinuosa. Sua silhueta é nitidamente feminina, exibindo curvas elegantes, um pescoço esguio e uma cintura sutilmente estreita, embora ela permaneça firmemente como um réptil monstruoso e intimidador.

Demonstrando total desdém por armaduras pesadas que possam obstruir a condução de seu mana elemental, ela adota trajes puramente minimalistas no estilo bárbaro e selvagem. A criatura veste apenas um top de couro cru rudimentar e uma tanga feita de amarras de pele rústica, deixando todo o seu peitoral superior, o abdômen perfeitamente trincado e as coxas reptilianas completamente expostos.

Sua pele nessas regiões é nua, lisa e possui um tom vermelho-quente. Gravadas diretamente nessa carne viva, encontram-se runas violetas profundas que queimam constantemente. O foco mental necessário para manter seus feitiços ativos faz com que seu corpo exale um suor oleoso, que não escorre comum, mas evapora em estalos térmicos contínuos e faíscas violetas ao redor de seus membros nus. Para carregar suas ferramentas arcanas, ela utiliza um arreio de tiras abertas acoplado ao seu traje, projetado estritamente para carregar pergaminhos antigos escritos em dialetos ancestrais.`,
    type: 'Monstro Médio, Draco',
    ac: '16',
    hp: '+78 (12d8 + 24)',
    speed: '9 metros, escalada 9 metros.',
    stats: {
      forca: '10 (+0)',
      destreza: '16 (+3)',
      constituicao: '14 (+2)',
      inteligencia: '20 (+5)',
      sabedoria: '14 (+2)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Draco Rúnico for alvo de dano de Fogo ou de Força, ele não sofre dano. Em vez disso, as runas violetas em sua carne viva absorvem o impacto térmico e cinético, fazendo-o recuperar 15 Pontos de Vida e carregar seus circuitos de mana. Ele ganha uma Carga Rúnica, que pode ser gasta para conjurar sua Barreira de Chamas Estáveis sem gastar a recarga natural da habilidade.',
      },
      {
        nome: 'Imunidade',
        desc: 'Fogo',
      },
      {
        nome: 'Resistência',
        desc: 'Veneno, Psíquico; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Água',
      },
      {
        nome: 'Idiomas',
        desc: 'Dialeto Rúnico Ancestral, Ígneo.',
      },
      {
        nome: 'Marcas violáceas',
        desc: 'O Draco Rúnico possui uma postura ereta e esguia, mantendo o torso, o abdômen trincado e as coxas reptilianas totalmente nus e hiper-definidos. Sua pele é marcada por runas violetas que queimam diretamente na carne viva, brilhando com um suor oleoso que evapora em estalos contínuos devido ao foco mental do feitiço. Qualquer conjurador inimigo a até 18 metros que tentar lançar uma magia e puder ver o Draco deve passar em uma RES de Inteligência (CD 15). Se falhar, a geometria complexa das runas distorce seus cálculos arcanos, fazendo a magia falhar e o conjurador sofrer 7 (2d6) de dano de fogo pelos estalos térmicos residuais.',
      },
      {
        nome: 'Geometria do mago vermelho',
        desc: 'A estrutura corporal esguia e os reflexos calculados do Draco permitem que ele antecipe as ações dos oponentes através de equações matemáticas mentais. O Draco adiciona seu modificador de Inteligência (+5) em suas jogadas de iniciativa e em testes de resistência de Destreza.',
      },
      {
        nome: 'Arreio de pergaminhos arcano',
        desc: 'Para não bloquear o fluxo das marcas violetas, o Draco não usa roupas, vestindo apenas um arreio de couro aberto no peito para carregar pergaminhos. No início de cada um de seus turnos, ele pode desenrolar um pergaminho como uma ação livre, sintonizando seu fogo. Isso altera o tipo de dano de seu próximo feitiço nesta rodada para dano de Força ou purifica uma condição de Cegueira ou Envenenamento que esteja afetando a si mesmo.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Draco Rúnico realiza dois ataques com sua Lâmina de Ignição ou usa sua habilidade Esferas de Calor Teleguiadas.',
      },
      {
        nome: 'Lâmina de ignição',
        desc: 'Ataque Corpo a Corpo Mágico: +8 para acertar, alcance 1m. Dano: 12 (2d6 + 5) de dano de Força mais 4 (1d8) de dano de fogo. A arma é moldada instantaneamente a partir do suor superaquecido de seus braços nus.',
      },
      {
        nome: 'Esferas de calor teleguiadas',
        desc: 'O Draco projeta três esferas concentradas de puro calor de suas mãos que perseguem ativamente até três alvos diferentes que ele possa ver a até 18 metros. Ataque à Distância Mágico: +8 para acertar, ignora meia-cobertura e três-quartos-cobertura. Dano: 7 (1d4 + 5) de dano de fogo por esfera.',
      },
      {
        nome: 'Barreira de chamas (Recarga 5T)',
        desc: 'O Draco utiliza a geometria mágica para moldar uma parede física e transparente de fogo concentrado em um ponto no chão a até 12 metros. A barreira possui 3 metros de largura, 3 metros de altura e 15 centímetros de espessura. Ela possui 30 Pontos de Vida, CA 15 e bloqueia a passagem física de criaturas e projéteis mundanos. Qualquer criatura que tocar ou cruzar a barreira sofre 10 (3d6) de dano de fogo. Magias de gelo destroem a barreira instantaneamente se causarem mais de 10 de dano.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Fragmento de Pele Rúnica Violeta',
      },
      {
        range: '2',
        item: 'Pergaminho de Geometria Ígnea',
      },
      {
        range: '3',
        item: 'Núcleo de Calor Teleguiado',
      },
      {
        range: '4',
        item: 'Arreio de Couro do Feiticeiro',
      },
    ],
  },
  basiliscoArcano: {
    name: 'Basilisco Arcano',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/wrGwCbB.png',
    image: 'https://2img.net/i.imgur.com/z2fxHEt.jpeg',
    subtitle: 'CR 10',
    description:
      'O Basilisco Arcano adota uma postura bípede totalmente ereta, exibindo uma silhueta assustadoramente atlética e musculosa, mas completamente desprovida de gordura. Seus traços revelam uma gracioidade sinuosa nitidamente feminina, com curvas elegantes e uma cintura estreita, embora sua cabeça e garras permaneçam firmemente draconianas e letais. Ela demonstra um orgulho herético imenso, rejeitando o uso de armaduras ou escamas protetoras na região frontal.',
    type: 'Monstro Médio, Basilisco',
    ac: '18',
    hp: '+152 (16d8 + 80)',
    speed: '12 metros, escalada 12 metros.',
    stats: {
      forca: '10 (+0)',
      destreza: '18 (+4)',
      constituicao: '20 (+5)',
      inteligencia: '24 (+7)',
      sabedoria: '16 (+3)',
      carisma: '16 (+3)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Basilisco Arcano for alvo de dano de Fogo ou de Força, ela não sofre dano. Em vez disso, as cicatrizes rúnicas douradas em sua carne viva absorvem o impacto, fazendo-a recuperar 25 Pontos de Vida e carregar seus circuitos mágicos. Ela ganha uma Carga de Mana Pesado, que pode ser gasta para conjurar seu Olhar de Paralisia Mental instantaneamente sem gastar sua recarga natural.',
      },
      {
        nome: 'Imunidade',
        desc: 'Fogo, Psíquico, Enfeitiçado, Aterrorizado, Iludido',
      },
      {
        nome: 'Resistência',
        desc: 'Veneno, Ácido; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Água',
      },
      {
        nome: 'idiomas',
        desc: 'Dialeto Rúnico Ancestral, Ígneo, Comum',
      },
      {
        nome: 'Olhar pesado de mana',
        desc: 'O Basilisco possui olhos imensos e brilhantes, totalmente sem pupilas, que emanam uma inteligência ancestral sádica. Qualquer inimigo que iniciar seu turno a até 12 metros do Basilisco e olhar diretamente em seus olhos deve passar em uma RES de Inteligência (CD 19). Se falhar, o peso do mana esmaga sua mente: a criatura sofre desvantagem em todas as suas jogadas de ataque e seu deslocamento é reduzido pela metade até o início de seu próximo turno, pois seu cérebro acredita erroneamente que seus membros estão virando pedra.',
      },
      {
        nome: 'Cicatrizes douradas',
        desc: 'O Basilisco exibe uma silhueta assustadoramente atlética, esguia e musculosa, sem um pingo de gordura, com curvas nitidamente femininas e uma cintura estreita. Ela usa apenas um top de couro selvagem e uma tanga minimalista combinando, além de uma capa de seda esfarrapada jogada para trás, mantendo o torso e o abdômen inteiramente expostos. Cicatrizes rúnicas profundas cortam a carne viva de seu peito nu, pulsando em um tom dourado brilhante conforme ela manipula a magia no ar. Qualquer conjurador que tentar lançar um feitiço contra ela a até 15 metros deve passar em uma RES de Sabedoria (CD 19) ou perderá a concentração devido à imposição estética e herética das runas, sofrendo 9 (2d8) de dano psíquico.',
      },
      {
        nome: 'Geometria do espaço',
        desc: 'Devido ao seu intelecto superior, o Basilisco consegue calcular a trajetória de ataques físicos e mágicos em tempo real. Ela adiciona seu modificador de Inteligência (+7) em testes de iniciativa e em testes de resistência de Destreza.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Basilisco Arcano realiza dois ataques com sua Lâmina Geométrica de Calor ou usa sua habilidade Olhar de Paralisia Mental.',
      },
      {
        nome: 'Lâmina geométrica de calor',
        desc: ' Ataque Corpo a Corpo Mágico: +11 para acertar, alcance 1m. Dano: 18 (2d10 + 7) de dano de Força mais 9 (2d8) de dano de fogo. A arma se materializa como uma projeção matemática afiada de energia violeta e dourada a partir de suas garras esguias.',
      },
      {
        nome: 'Olhar de paralisia (Recarga 5T)',
        desc: 'O Basilisco foca seus imensos olhos sem pupilas em uma criatura que ela possa ver a até 18 metros. O alvo é inundado por uma pressão hidrostática e mental esmagadora. A criatura deve fazer uma RES de Inteligência (CD 19). Falha: O alvo fica sob a condição Paralisado por 1 minuto. A mente do alvo está tão convicta de que foi petrificada pelo mana que o corpo para de responder. O alvo pode repetir a RES no final de cada um de seus turnos para encerrar o efeito. Sucesso: O alvo sofre 14 (4d6) de dano psíquico, mas não fica paralisado.',
      },
      {
        nome: 'Prisma de chamas',
        desc: 'O Basilisco manipula o ar superaquecido para erguer uma barreira piramidal invisível ao redor de uma criatura a até 12 metros. O alvo deve passar em uma RES de Destreza (CD 19) ou ficará Preso dentro do prisma. O prisma possui 20 PV, CA 16 e qualquer criatura que tentar forçar a saída fisicamente sofre 11 (2d10) de dano de fogo pelas paredes térmicas comprimidas.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: 'Visão Verdadeira 18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Fragmento de Pele com Runas Douradas',
      },
      {
        range: '2',
        item: 'Olho Imenso Sem Pupila do Basilisco',
      },
      {
        range: '3',
        item: 'Tecido de Seda Esfarrapada Arcano',
      },
      {
        range: '4',
        item: 'Cristal de Geometria Térmica',
      },
    ],
  },
  nagaArcanista: {
    name: 'Naga Arcanista',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/VKAvAOL.png',
    image: 'https://2img.net/i.imgur.com/l0Kx0Gi.jpeg',
    subtitle: 'CR 15',
    description: `A Naga Arcanista opera com uma arrogância fria e calculada. Ela raramente inicia um combate avançando de forma direta; em vez disso, prefere se posicionar em locais elevados ou no centro de suas distorções térmicas, observando o desespero de suas vítimas de braços cruzados. Seu comportamento é profundamente teatral: ela utiliza sua silhueta e seus movimentos de forma deliberada para hipnotizar e desestabilizar o foco dos guerreiros, deliciando-se com a hesitação e o pavor psicológico deles.

Quando confrontada por classes mágicas, seu comportamento se torna ainda mais hostil e competitivo. A Naga sente um prazer quase herético em humilhar magos, bruxos e feiticeiros, demonstrando que o domínio mortal sobre o mana é primitivo. Ela costuma gargalhar de forma debochada ou usar sua telepatia para sussurrar insultos arcanos diretamente na mente dos invasores enquanto desfaz os feitiços deles com um estalo de dedos. Ela não busca uma morte rápida para suas presas; seu maior divertimento é assistir os heróis se espancarem sob o efeito de suas ilusões antes de desferir o golpe de misericórdia.`,
    type: 'Monstro Médio (Humanoide Reptiliano), Naga',
    ac: '22',
    hp: '+225 (26d8 + 104)',
    speed: '12 metros, escalada 12 metros.',
    stats: {
      forca: '12 (+1)',
      destreza: '22 (+6)',
      constituicao: '18 (+4)',
      inteligencia: '28 (+9)',
      sabedoria: '18 (+4)',
      carisma: '22 (+6)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Naga Arcanista for alvo de dano de Fogo ou Psíquico, ela não sofre dano. Em vez disso, as cicatrizes violetas absorvem o mana, fazendo-a recuperar 35 Pontos de Vida e carregar seu núcleo intelectual. Ela ganha uma Carga Arcanista. Ela pode gastar uma Carga Arcanista para usar a habilidade Explosão Térmica Reversa como uma reação ou para impor desvantagem no teste de resistência de um jogador contra suas miragens.',
      },
      {
        nome: 'Imunidade',
        desc: 'Fogo, Psíquico, Veneno, Enfeitiçado, Aterrorizado, Iludido, Cego, Envenenado. Resistências: Força, Necrótico; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Água',
      },
      {
        nome: 'Idiomas',
        desc: 'Dialeto Rúnico Ancestral, Ígneo, Comum',
      },
      {
        nome: 'Cicatrizes violáceas',
        desc: 'A Naga Arcanista exibe um corpo humanoide feminino incrivelmente magro, fibroso e definido, sem um pingo de gordura. Ela se move com uma elegância sinuosa e provocativa, mantendo o peito largo e toda a região abdominal completamente expostos, cobertos por cicatrizes rúnicas profundas que brilham em violeta. Ela veste apenas uma tanga de seda esfarrapada amarrada por ossos de aventureiros, deixando suas pernas longas e músculos pélvicos totalmente à mostra. Qualquer ataque físico desferido contra sua frente ignora sua barreira mágica, reduzindo a CA do monstro para 16 contra aquele golpe específico. No entanto, o atacante deve passar numa RES de Inteligência (CD 22) ou ficará Enfeitiçado por sua presença herética até o final do turno dele, errando o ataque.',
      },
      {
        nome: 'Miragens do mana ardente',
        desc: 'A presença da Naga distorce o ar ao seu redor com ondas de calor ilusórias e cruéis. Inimigos a até 18 metros enxergam réplicas e miragens de fogo que parecem flanquear e atacar seus corpos. No início do turno de cada jogador na área, ele deve passar numa RES de Sabedoria (CD 22) ou sofrerá 14 (4d6) de dano psíquico devido à convicção mental de estar sendo queimado pelas ilusões térmicas.',
      },
      {
        nome: 'Desprezo pela proteção fisica',
        desc: 'O desdém total da Naga por armaduras ou roupas pesadas acelera o fluxo de mana por seu sistema nervoso. Ela adiciona seu modificador de Inteligência (+9) em seus testes de iniciativa e não pode ser surpreendida em combate.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até três ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Naga Arcanista realiza três ataques de Toque Transgressor ou usa sua habilidade Encantamento do Abismo Térmico.',
      },
      {
        nome: 'Toque transgressor',
        desc: 'Ataque Corpo a Corpo Mágico: +14 para acertar, alcance 1m. Dano: 19 (3d6 + 9) de dano de Força mais 11 (2d10) de dano psíquico. Suas garras esguias transmitem uma descarga de mana diretamente no sistema neurológico do alvo.',
      },
      {
        nome: 'Explosão térmica reversa (Recarga 5T)',
        desc: 'Quando um jogador lança uma magia direcionada à Naga ou à sua área de ocupação, ela manipula os fios de mana no ar através de um estalo de seus dedos. O feitiço original do jogador é cancelado e transformado em uma explosão de calor violeta centrada no próprio conjurador. O conjurador e aliados a até 4,5 metros dele devem fazer uma RES de Destreza (CD 22), sofrendo 44 (8d10) de dano de fogo em caso de falha, ou metade em caso de sucesso.',
      },
      {
        nome: 'Encantamento do abismo',
        desc: 'A Naga foca sua malícia em um alvo a até 18 metros. O jogador deve passar numa RES de Inteligência (CD 22). Se falhar, ele fica sob o controle da Naga por 1 rodada completa (efeito Confusão/Dominação). Durante seu turno, o herói afetado usará sua ação mais poderosa para atacar seus próprios aliados ou sabotar o grupo, acreditando que eles se tornaram monstros de gelo ameaçadores.',
      },
      {
        nome: 'Passo sinuoso',
        desc: 'A Naga move-se até metade de seu deslocamento sem provocar ataques de oportunidade, flexionando suas pernas e músculos pélvicos expostos. Um inimigo a até 9 metros que a veja se mover deve passar numa RES de Sabedoria (CD 22) ou terá desvantagem em seu próximo ataque devido à distração mental.',
      },
      {
        nome: 'Distorção geométrica',
        desc: 'A Naga faz com que as cicatrizes rúnicas de seu abdômen brilhem intensamente. Um jogador a até 12 metros que esteja mantendo uma magia de concentração deve passar numa RES de Inteligência (CD 22) ou perderá a concentração instantaneamente',
      },
      {
        nome: 'Colapso Psiquico (2 ações)',
        desc: 'A Naga ativa as miragens na mente de um alvo que já sofreu dano psíquico nesta rodada. O alvo sofre 27 (6d8) de dano psíquico puro e fica Atordoado até o início do próximo turno da Naga.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: 'Visão Verdadeira 24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Tecido da Tanga de Seda Esfarrapada',
      },
      {
        range: '2',
        item: 'Amarra de Ossos de Aventureiros',
      },
      {
        range: '3',
        item: 'Coração de Mana Violeta Pulsante',
      },
      {
        range: '4',
        item: 'Olho Hidrostático da Naga',
      },
    ],
  },
  leviataInfernal: {
    name: 'Leviatã Infernal',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/cJkWKkt.png',
    image: 'https://2img.net/i.imgur.com/ievc95q.jpeg',
    subtitle: 'CR 20',
    description:
      'O comportamento do Leviatã Infernal é marcado por uma soberania fria, silenciosa e esmagadora. Ele não ruge por fúria ou instinto; ela flutua sobre o campo de batalha com uma elegância levitante e profana, observando os exércitos e heróis com o absoluto desdém de quem olha para insetos. Sua inteligência superior permite que ele compreenda e preveja cada linha de raciocínio estratégico dos jogadores, transformando o combate em uma peça de teatro trágica onde ele dita o roteiro.',
    type: 'Monstro Grande (Humanoide Reptiliano), Leviatã',
    ac: '24',
    hp: '+390 (30d10 + 225)',
    speed:
      '15 metros, voo 15 metros (levitação mágica), natação em magma 30 metros.',
    stats: {
      forca: '14 (+2)',
      destreza: '26 (+8)',
      constituicao: '24 (+7)',
      inteligencia: '30 (+10)',
      sabedoria: '20 (+5)',
      carisma: '26 (+8)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Leviatã Infernal for alvo de dano de Fogo, Psíquico ou de Força, ela não sofre dano. Em vez disso, a energia alimenta o colapso de seu coração estelar, fazendo-a recuperar 60 Pontos de Vida e ganhar uma Carga de Rebelião. Ela pode gastar uma Carga de Rebelião para forçar uma falha automática no teste de resistência de um jogador contra suas magias ou para criar um Clone de Chamas Primordiais sem gastar ações.',
      },
      {
        nome: 'Imunidades',
        desc: 'Fogo, Psíquico, Força, Veneno, Ácido; Concussão, Perfurante e Cortante de ataques não-mágicos, Enfeitiçado, Aterrorizado, Atordoado, Cego, Envenenado, Paralisado, Petrificado, Caído, Exaustão, Preso, Agarrado, Incapacitado. Resistências: Gélido, Trovão, Necrótico, Radiante; Concussão, Perfurante e Cortante de armas mágicas.',
      },
      {
        nome: 'Idiomas',
        desc: 'Todos',
      },
      {
        nome: 'Coração de estrela moribunda',
        desc: 'No centro de seu peito largo, nu e de traços sutilmente femininos, as costelas do Leviatã são visíveis e agem como uma gaiola óssea aberta que expõe um coração elemental que brilha com a intensidade azul-branca de uma estrela moribunda. A Imperatriz exala um calor opressor tão absurdo que o próprio chão de pedra derrete sob sua presença, transformando-se em terreno difícil num raio de 12 metros. Qualquer criatura que iniciar seu turno nesse raio sofre 28 (8d6) de dano de fogo puro devido à radiação cósmica do coração exposto.',
      },
      {
        nome: 'Anatomia da crueza',
        desc: 'O Leviatã exibe um corpo humanoide feminino com curvas impecáveis, porém assustadoramente rasgado, magro e hiper-vascularizado. A crueza de sua musculatura exposta serve para chocar e humilhar os oponentes. Ela veste apenas fragmentos de coroas e espadas derretidas de antigos heróis lendários, presas diretamente ao redor de sua cintura por correntes incandescentes, deixando suas longas pernas, quadris e músculos pélvicos totalmente à mostra. Ataques físicos pela frente ignoram sua aura cósmica, reduzindo sua CA para 18 contra aquele golpe. No entanto, o atacante deve passar numa RES de Sabedoria (CD 26) ou ficará Atordoado pela insignificância de sua própria existência diante da Rainha Demônio, errando a ação.',
      },
      {
        nome: 'Inversão intrópica de status',
        desc: 'A inteligência do Leviatã governa as leis da magia no mapa do fórum. Sempre que um jogador sob o efeito de um buff benéfico (como Bênção, Velocidade, Escudo da Fé ou buffs de atributos) iniciar seu turno a até 27 metros do Leviatã, a criatura inverte a polaridade da energia. O bônus transforma-se instantaneamente em um debuff equivalente de mesma magnitude (ex: +2 na CA vira -2 na CA, Velocidade vira Lentidão), sabotando a estratégia do grupo.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Leviatã Infernal realiza três ataques de Toque do Caos Primordial ou usa sua habilidade Invocação das Sombras de Chamas.',
      },
      {
        nome: 'Toque do caos',
        desc: 'Ataque Corpo a Corpo Mágico: +18 para acertar, alcance 3m. Dano: 23 (3d8 + 10) de dano de Força mais 18 (4d8) de dano psíquico. As garras do Leviatã reescrevem o código biológico do alvo, forçando-o a gastar seu espaço de magia de nível mais alto ativo de forma inútil.',
      },
      {
        nome: 'Invocação das sombras (Recarga 5T)',
        desc: 'O Leviatã manipula o inferno tático e invoca até duas cópias perfeitas de si mesma feitas de fogo puro em espaços vazios a até 18 metros. Cada clone possui 80 Pontos de Vida, partilha da mesma CA e iniciativa do Leviatã, e pode realizar a ação Toque do Caos Primordial. Quando um clone é destruído, ele colapsa em uma supernova, causando 36 (8d8) de dano de fogo puro a todas as criaturas em um raio de 6 metros. No máximo 4 clones podem existir simultaneamente.',
      },
      {
        nome: 'Sopro de singularidade térmica (1/dia)',
        desc: 'O Leviatã abre suas fendas faciais e expele um feixe de calor absoluto que rasga o tecido do espaço em uma linha de 60 metros de comprimento por 3 metros de largura. Cada criatura na área deve fazer uma RES de Inteligência (CD 26). Falha: Sofre 110 (20d10) de dano de Força e sua mente é banida para um limbo mental por 1 rodada, deixando seu corpo físico Incapacitado no mapa. Sucesso: Metade do dano e não sofre o banimento mental.',
      },
      {
        nome: 'Dança cinética do caos',
        desc: 'O Leviatã teleporta-se magicamente para um espaço visível a até 18 metros, fazendo com que as correntes e coroas de sua cintura ecoem um som metálico ensurdecedor.',
      },
      {
        nome: 'Comandar projeção',
        desc: 'O Leviatã ordena que um de seus clones ativos realize um ataque imediato contra um alvo adjacente ao clone.',
      },
      {
        nome: 'Subcerção de feitiço (2 ações)',
        desc: 'O Leviatã foca seu olhar em um jogador a até 24 metros. Ela força os efeitos de uma poção ou magia de cura que o jogador recebeu recentemente a se transformarem em dano necrótico imediato de igual valor, sem teste de resistência.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '15',
      visaoEscuro: 'Visão Verdadeira 36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Coração de Estrela Moribunda Cristalizado',
      },
      {
        range: '2',
        item: 'Correntes de Heróis Derretidos',
      },
      {
        range: '3',
        item: 'Fragmento de Músculo Vascularizado do Caos',
      },
      {
        range: '4',
        item: 'Resíduo de Coroa Real Profanada',
      },
    ],
  },
  salamancerGelo: {
    name: 'Salamancer (Gelo)',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/bIo9kcS.png',
    image: 'https://2img.net/i.imgur.com/IZ7Ggok.jpeg',
    subtitle: 'CR 1',
    description:
      'O comportamento desta criatura é ditado pela sobrevivência imediata e pela hostilidade territorial. O Salamancer Gélido não possui táticas complexas; ao detectar intrusos, o monstro ataca de forma frenética e destrutiva, movendo-se com arrancadas rápidas, escalando superfícies congeladas com facilidade. Eles são extremamente territoriais e buscam extinguir qualquer fonte de calor, enxergando fogueiras, tochas e magias de fogo como ameaças diretas que precisam ser sufocadas imediatamente sob seu sopro de geada seca.',
    type: 'Monstro Pequeno, Lagarto',
    ac: '14',
    hp: '32 (5d6 + 15)',
    speed: '9 metros, escalada 9 metros',
    stats: {
      forca: '14 (+2)',
      destreza: '14 (+2)',
      constituicao: '16 (+3)',
      inteligencia: '4 (-3)',
      sabedoria: '12 (+1)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Salamancer Gélido for alvo de dano Gélido, ele não sofre dano. Em vez disso, o frio estabiliza sua musculatura exposta, fazendo-o recuperar 5 Pontos de Vida e ganhar uma Carga de Geada. Ele pode gastar uma Carga de Geada para aumentar o dano de seu próximo ataque de garras em 1d6 de dano gélido.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gélido',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Fogo',
      },
      {
        nome: 'Musculatura congelada',
        desc: 'O peito e o abdômen do lagarto são totalmente nus e desprovidos de carapaça, exibindo feixes musculares hiper-definidos em um tom azul-escuro e roxo de carne congelada. Qualquer ataque físico desferido diretamente contra a sua frente ignora a proteção das escamas de gelo, reduzindo a CA do monstro para 11 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 2 (1d4) de dano gélido pelo contato próximo com a carne viva congelante.',
      },
      {
        nome: 'Sangue criogênico',
        desc: 'Quando o lagarto sofre dano perfurante ou cortante por um ataque corpo a corpo vindo pela frente, um jato de sangue azul e congelante espirra das feridas de seus músculos expostos. O atacante deve passar numa RES de Destreza (CD 13) ou terá sua velocidade de deslocamento reduzida em 3 metros até o final de seu próximo turno devido ao congelamento de suas articulações.',
      },
    ],
    acoes: [
      {
        nome: 'Mordida congelante',
        desc: 'Ataque Corpo a Corpo Físico: +4 para acertar, alcance 1m. Dano: 5 (1d6 + 2) de dano perfurante mais 2 (1d4) de dano gélido.',
      },
      {
        nome: 'Garras de gelo',
        desc: 'Ataque Corpo a Corpo Físico: +4 para acertar, alcance 1m. Dano: 4 (1d4 + 2) de dano cortante.',
      },
      {
        nome: 'Sopro de geada seca (Recarga 5T)',
        desc: 'O lagarto contrai seu abdômen azulado e expele uma lufada de vento congelante e cristais de gelo em um cone de 4 metros. Cada criatura na área deve passar numa RES de Destreza (CD 13).  Falha: Sofre 7 (2d6) de dano gélido e não pode usar reações até o início do próximo turno do lagarto.  Sucesso: Metade do dano e mantém suas reações normais.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Escama de Gelo Cristalino',
      },
      {
        range: '2',
        item: 'Glândula de Vapor Congelante',
      },
      {
        range: '3',
        item: 'Sangue Azul Criogênico',
      },
      {
        range: '4',
        item: 'Dente de Gelo Transparente',
      },
    ],
  },
  dracoGlacial: {
    name: 'Draco Glacial',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/aAzPtu1.png',
    image: 'https://2img.net/i.imgur.com/bgrDZdm.jpeg',
    subtitle: 'CR 5',
    description: `Diferente da evolução anterior, o Draco Glacial é um predador territorial de impacto massivo. Ele não caça por espreita; ele anuncia sua presença através do tremor do solo enquanto corre e do som sibilante da névoa de vapor que emana de seu peito vermelho-vivo. O comportamento da criatura é puramente agressivo e dominante. Ele utiliza suas garras dianteiras hiper-desenvolvidas, revestidas de um permafrost tão denso que rivaliza com o aço, para quebrar o solo rochoso ou o gelo maciço, criando trincheiras e encurralando suas presas.

O Draco demonstra um instinto brutal de avanço, usando o peso esmagador de seu corpo robusto para atropelar linhas de defesa inteiras. Ele sente um frenesi violento ao colidir contra escudos físicos e armaduras metálicas, atacando esses alvos preferencialmente para quebrar a guarda dos combatentes. O choque térmico constante que ocorre em seu torso exposto gera uma névoa espessa que o acompanha por onde caminha, e a besta usa essa camuflagem de vapor para desorientar arqueiros e conjuradores, avançando de forma implacável no meio da nébula que ela mesma produz.`,
    type: 'Monstro Grande, Draco',
    ac: '16',
    hp: '+85 (10d10 + 30)',
    speed: '9 metros, escavação em neve ou gelo 9 metros.',
    stats: {
      forca: '18 (+4)',
      destreza: '12 (+1)',
      constituicao: '16 (+3)',
      inteligencia: '5 (-3)',
      sabedoria: '12 (+1)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Draco Glacial for alvo de dano Gélido, ele não sofre dano. Em vez disso, ele direciona o frio extremo para o seu núcleo biológico, recuperando 15 Pontos de Vida e ganhando uma Carga de Permafrost. Ele pode gastar uma Carga de Permafrost para usar sua habilidade Investida de Impacto Duro imediatamente sem gastar sua ação ou precisar rolar dados de recarga.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gélido',
      },
      {
        nome: 'Resistência',
        desc: 'Veneno; Concussão, Perfurante e Cortante de ataques não-mágicos (apenas contra golpes que atinjam suas costas ou cauda blindada).',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Fogo',
      },
      {
        nome: 'Peitoral Vermelho',
        desc: 'Há um contraste brutal na anatomia do Draco. Toda a sua parte frontal (o pescoço, o peitoral largo e o abdômen) perdeu completamente as escamas, exibindo uma carne nua, hiper-definida e de um tom vermelho-vivo que contrasta brutalmente com o cenário de neve. Qualquer ataque físico desferido contra o Draco pela sua frente ignora o bônus de sua carapaça traseira, reduzindo a CA do monstro para 12 contra aquele ataque específico. No entanto, devido ao frio extremo da carne viva, o atacante corpo a corpo sofre 4 (1d8) de dano gélido pela proximidade.',
      },
      {
        nome: 'Espinhos de suor congelado',
        desc: 'O suor que escorre dos músculos trincados do Draco congela instantaneamente ao entrar em contato com o ar na pele exposta de seu peito, criando uma fileira de espinhos de gelo translúcidos que apontam para a frente. Qualquer criatura que tentar agarrar o Draco pela frente ou que realizar um ataque desarmado contra seu peito sofre 4 (1d8) de dano perfurante e 2 (1d4) de dano gélido pelos espinhos.',
      },
      {
        nome: 'Névoa de choque térmico',
        desc: 'O choque térmico violento entre o interior congelante do monstro e o ar ao seu redor faz com que uma névoa espessa de vapor exale constantemente de seu torso nu e musculoso. A área num raio de 3 metros ao redor do Draco fica permanentemente sob efeito de camuflagem leve, dificultando a precisão de ataques à distância direcionados a ele.',
      },
      {
        nome: 'Impacto de gelo metálico',
        desc: 'As garras e dentes do Draco são revestidos naturalmente por uma camada de gelo permafrost tão denso e compactado que funciona como metal puro. Os ataques físicos do Draco causam 3 pontos de dano de impacto adicionais contra alvos que estejam utilizando armaduras pesadas ou escudos físicos.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Draco Glacial realiza dois ataques: um de Mordida de Permafrost e um de Pancada de Garras Metálicas.',
      },
      {
        nome: 'Mordida de permafrost',
        desc: 'Ataque Corpo a Corpo Físico: +7 para acertar, alcance 1m. Dano: 11 (2d6 + 4) de dano perfurante mais 4 (1d8) de dano gélido. O alvo deve fazer uma RES de Constituição (CD 14) ou terá sua Classe de Armadura reduzida em 1 ponto até o fim do combate devido ao congelamento e fragilização do metal de sua armadura.',
      },
      {
        nome: 'Pancada de garras metálicas',
        desc: 'Ataque Corpo a Corpo Físico: +7 para acertar, alcance 1m. Dano: 13 (2d8 + 4) de dano de concussão. O alvo deve passar numa RES de Força (CD 14) ou terá sua guarda quebrada, deixando seu escudo físico inutilizável até o início de seu próximo turno devido ao impacto esmagador.',
      },
      {
        nome: 'Investida de impacto duro (Recarga 5T)',
        desc: 'O Draco usa o peso de seu corpo robusto para avançar em linha reta por até 12 metros contra os jogadores. Cada criatura no caminho deve passar numa RES de Destreza (CD 14). Falha: Sofre 22 (4d8 + 4) de dano de concussão, é empurrada 3 metros para os lados e derrubada Caído. Sucesso: Metade do dano e não sofre o recuo ou a queda.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Placa de Gelo Permafrost Traseira',
      },
      {
        range: '2',
        item: 'Presa Metálica de Permafrost',
      },
      {
        range: '3',
        item: 'Essência de Carne Vermelha Congelante',
      },
      {
        range: '4',
        item: 'Espinho de Suor Translúcido',
      },
    ],
  },
  varanospermafrost: {
    name: 'Varanos-permafrost',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/F0B1fy8.png',
    image: 'https://2img.net/i.imgur.com/hcwBfb7.jpeg',
    subtitle: 'CR10',
    description: `O comportamento do Varanos-permafrost é definido por uma agressividade territorial implacável e um foco absoluto em alvos blindados. Ele possui um instinto focado em destruir formações táticas organizadas: ao notar um grupo de aventureiros com escudos erguidos ou em posição de defesa, a besta interpreta a barreira como um desafio direto à sua supremacia física. Ele não flanqueia e não hesita; o monstro avança em linha reta com uma velocidade assustadora, usando suas patas traseiras hiper-desenvolvidas para impulsionar toneladas de músculos congelados contra a vanguarda do grupo.

Em combate, o Varanos demonstra um sadismo puramente animal ao tensionar seus músculos peitorais azuis-arroxeados. O som de sua geada corporal quebrando com estalos secos funciona como uma tática de intimidação psicológica, precedendo ataques violentos com suas garras frontais em formato de estalagmites. Ele ignora completamente efeitos de recuo, ventanias ou tentativas de derrubá-lo, comportando-se como um bloco vivo de ferro criogênico que só para de avançar quando toda a linha de frente inimiga estiver estraçalhada e soterrada sob o gelo.`,
    type: 'Monstro Grande, Draco',
    ac: '20',
    hp: '+178 (17d10 + 85)',
    speed: '12 metros, escavação em neve ou gelo 12 metros.',
    stats: {
      forca: '22 (+6)',
      destreza: '14 (+2)',
      constituicao: '20 (+5)',
      inteligencia: '5 (-3)',
      sabedoria: '14 (+2)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Varanos-permafrost for alvo de dano Gélido, ele não sofre dano. Em vez disso, o frio solidifica ainda mais sua estrutura molecular, fazendo-o recuperar 25 Pontos de Vida e ganhar uma Carga de Densidade. Ele pode gastar uma Carga de Densidade para realizar um ataque de Patada de Estalagmite adicional como uma ação bônus ou para remover instantaneamente a condição Caído de si mesmo.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gélido',
      },
      {
        nome: 'Resistência',
        desc: 'Veneno; Concussão, Perfurante e Cortante de ataques não-mágicos (apenas contra golpes que atinjam suas costas protegidas).',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Fogo',
      },
      {
        nome: 'Metade frontal de carne',
        desc: 'Inspirado na estrutura anatômica dos grandes lagartos-monitores terrestres, mas com uma massa muscular que triplicou de densidade devido ao frio, o Varanos perdeu totalmente as escamas na metade frontal do corpo. O pescoço, os peitorais largos e o abdômen trincado são pura carne viva exposta, em um tom azul-arroxeado escuro. Qualquer ataque físico desferido contra sua frente ignora a carapaça, reduzindo a CA do monstro para 15 contra aquele golpe. No entanto, o atacante corpo a corpo sofre 7 (2d6) de dano gélido pelo contato direto com o tecido vivo congelado.',
      },
      {
        nome: 'Geada de tensão vascular',
        desc: 'A musculatura atlética e calejada do peito da besta é coberta por uma fina camada de geada cristalina que reluz com a luz. Quando o Varanos se tensiona para desferir um golpe, a geada na carne nua racha com estalos secos, revelando veias grossas que pulsam com sangue congelado por baixo da pele. Esse processo libera lascas afiadas de gelo; qualquer criatura a até 1 metros da frente do monstro quando ele ataca deve passar numa RES de Destreza (CD 17) ou sofrerá 4 (1d8) de dano cortante residual.',
      },
      {
        nome: 'Dureza de ferro',
        desc: 'O frio interno do réptil solidificou seus tecidos, fazendo com que seus músculos tenham a dureza do ferro puro. O Varanos é totalmente imune a ser empurrado, puxado ou derrubado Caído por habilidades ou ataques físicos mundanos de criaturas de tamanho Grande ou menor.',
      },
      {
        nome: 'Garras de Estalagmite',
        desc: 'As garras dianteiras do Varanos são longas e afiadas como estalagmites de gelo permafrost. Os ataques de garras do monstro ignoram completamente a Classe de Armadura fornecida por escudos físicos e causam 5 pontos de dano adicionais contra alvos que vistam armaduras pesadas, amassando o metal.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Varanos-permafrost realiza três ataques: dois de Patada de Estalagmite e um de Mordida Trituradora.',
      },
      {
        nome: 'Patada de estalagmite',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 2m. Dano: 15 (2d8 + 6) de dano perfurante mais 7 (2d6) de dano gélido. Se o alvo for um jogador na linha de frente, ele deve passar numa RES de Força (CD 17) ou terá sua guarda quebrada, sofrendo desvantagem em seu próximo ataque.',
      },
      {
        nome: 'Mordida Trituradora',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 1m. Dano: 17 (2d10 + 6) de dano perfurante. O alvo deve fazer uma RES de Constituição (CD 17) ou ficará sob o efeito de Sangramento, sofrendo 5 de dano físico no início de cada um de seus turnos até receber cura mágica.',
      },
      {
        nome: 'Quebra-linhas Avassalador (Recarga 5T)',
        desc: 'O Varanos tenciona suas patas traseiras absurdamente musculosas e arranca em linha reta por até 18 metros, invadindo e quebrando a linha de frente dos jogadores. Cada criatura no caminho deve passar numa RES de Força (CD 17).  Falha: Sofre 28 (4d10 + 6) de dano de concussão, é arremessada 4 metros para trás e fica Atordoada até o início do próximo turno do Varanos.  Sucesso: Metade do dano, é empurrada para o lado e não fica atordoada.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Par de Garras de Estalagmite Permafrost',
      },
      {
        range: '2',
        item: 'Tecido Muscular de Ferro Azul-Arroxeado',
      },
      {
        range: '3',
        item: 'Glândula de Sangue Vascularizado Congelante',
      },
      {
        range: '4',
        item: 'Placa de Geada Cristalina Reluzente',
      },
    ],
  },
  glaciossauroAriete: {
    name: 'Glaciossauro Ariete',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/jUJHQuE.png',
    image: 'https://2img.net/i.imgur.com/aiTbRUR.jpeg',
    subtitle: 'CR 15',
    description: `O comportamento do Glaciossauro Ariete é dominado por um estado constante de frenesi cinético. Ele passa grande parte de sua existência em movimento retilíneo, cruzando os vales congelados de Terralém como uma avalanche viva. Ele não caça por espreita ou por fome biológica tradicional; seu núcleo elemental de gelo se alimenta da própria energia gerada pelos impactos que ele causa no ambiente.

A fera demonstra um desdém absoluto por fortificações ou magia de proteção. Quando confrontado por um grupo de aventureiros, o Glaciossauro escolhe a rota mais direta e acelera sem hesitação, utilizando o próprio peito nu e musculoso como a ponta de um aríete de cerco. Devido à sua densidade crítica, ele ignora completamente o cansaço ou tentativas mágicas de alterar seu curso, movendo-se com uma inércia incontrolável que só cessa quando o alvo colidido é completamente obliterado.`,
    type: 'Monstro Grande, Draco',
    ac: '22',
    hp: '+245 (22d10 + 124)',
    speed: '15 metros, escavação em neve ou gelo 15 metros',
    stats: {
      forca: '26 (+8)',
      destreza: '12 (+1)',
      constituicao: '24 (+7)',
      inteligencia: '6 (-2)',
      sabedoria: '14 (+2)',
      carisma: '9 (-1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Glaciossauro Ariete for alvo de dano Gélido, ele não sofre dano. Em vez disso, a energia criogênica compacta instantaneamente sua massa física, fazendo-o recuperar 40 Pontos de Vida e carregar seu núcleo estelar de gelo. Ele ganha uma Carga Cinética. Ele pode gastar uma Carga Cinética para triplicar seu deslocamento na próxima investida ou para fazer sua habilidade Investida de Obliteração Total recarregar automaticamente.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gélido, Força, Caído, Atordoado, Paralisado, Petrificado, Assustado, Enfeitiçado, Empurrado, Agarrado.',
      },
      {
        nome: 'Resistência',
        desc: 'Veneno, Ácido; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Fogo. (O calor extremo expande o permafrost interno de forma catastrófica).',
      },
      {
        nome: 'Anatomia da crueza',
        desc: 'O Glaciossauro ostenta placas de gelo negro indestrutível apenas ao longo de sua espinha traseira. Todo o resto da anatomia frontal (o peitoral largo, o abdômen e as coxas atléticas) é pura carne nua exposta, musculosa e hiper-vascularizada, desenhada com a precisão brutal do frio. O esterno e as costelas escuras aparecem visivelmente por baixo da carne fina do peito nu, revelando seu núcleo elemental de gelo brilhando intensamente através do torso suado. Qualquer ataque físico desferido diretamente contra a sua frente ignora a proteção das placas traseiras, reduzindo a CA do monstro para 15 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 14 (4 d6) de dano gélido pela proximidade com o núcleo de zero absoluto.',
      },
      {
        nome: 'Ariete de rompimento',
        desc: 'O foco biológico desta criatura é o esmagamento por impacto cinético frontal. Quando o Glaciossauro se move pelo menos 6 metros em linha reta em direção a um alvo e o atinge com um ataque físico, ele ignora e destrói instantaneamente qualquer barreira mágica protetora ativa no alvo (como Escudo da Fé, Pele de Árvore, Escudo Arcano ou muralhas de energia de magos do fórum). Se o alvo estiver utilizando um escudo físico, o escudo é partido em pedaços e inutilizado permanentemente.',
      },
      {
        nome: 'Massa de permafrost',
        desc: 'O Glaciossauro condensou sua massa física a um nível crítico, pesando tanto quanto um bloco maciço de geleira profunda. Ele é completamente imune a qualquer efeito mágico ou físico que tente alterar seu posicionamento, teleportá-lo contra a sua vontade ou reduzir sua velocidade de deslocamento por meios mundanos.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Glaciossauro Ariete realiza três ataques: dois de Pancada de Peito Cinético e um de Mordida Esmagadora de Armaduras.',
      },
      {
        nome: 'Pancada de peito',
        desc: 'Ataque Corpo a Corpo Físico: +13 para acertar, alcance 1m. Dano: 21 (3d8 + 8) de dano de concussão mais 7 (2d6) de dano gélido. O Glaciossauro choca seu torso nu e musculoso diretamente contra o alvo, empurrando-o 4 metros para trás.',
      },
      {
        nome: 'Mordida esmagadora',
        desc: 'Ataque Corpo a Corpo Físico: +13 para acertar, alcance 1m. Dano: 24 (3d10 + 8) de dano perfurante. Se o alvo vestir armadura pesada ou média, a peça é danificada estruturalmente, reduzindo permanentemente a CA fornecida pela armadura em -2 pontos até que seja consertada por um ferreiro em um interregno do fórum.',
      },
      {
        nome: 'Investida de obliteração (Recarga 5T)',
        desc: 'O Glaciossauro corre em linha reta por até 24 metros acumulando energia cinética extrema. Ele usa o próprio peito nu para atropelar tudo em seu caminho. Cada criatura na linha de avanço deve passar numa RES de Força (CD 21). Falha: Sofre 52 (8d10 + 8) de dano de concussão, é arremessada 9 metros para os lados e fica Caída e Atordoada por 1 rodada completa. No ponto de impacto final da investida, o choque gera uma onda de explosão de estilhaços de gelo afiados num raio de 6 metros; todas as criaturas nessa área sofrem 21 (6d6) de dano cortante. Sucesso: Metade do dano de concussão, é empurrada para o lado, não fica atordoada e evita os estilhaços de gelo.',
      },
      {
        nome: 'Arrancada terrestre',
        desc: 'O Glaciossauro move-se até metade de seu deslocamento terrestre em linha reta sem provocar ataques de oportunidade de qualquer oponente.',
      },
      {
        nome: 'Onda de choque de estilhaços',
        desc: 'O Glaciossauro bate seu torso nu contra uma parede ou contra o próprio chão congelado, liberando uma saraivada de lascas de gelo afiadas de seu peito. Inimigos a até 4 metros da sua frente devem passar numa RES de Destreza (CD 21) ou sofrerão 10 (3d6) de dano cortante.',
      },
      {
        nome: 'Pulsação do núcleo (2 ações)',
        desc: 'O núcleo elemental que brilha através das costelas visíveis do monstro emite um flash de luz azul ofuscante e frio opressor. Todos os inimigos a até 6 metros de sua frente devem passar numa RES de Constituição (CD 21) ou ficarão Cegos até o final do próximo turno do Glaciossauro devido ao brilho criogênico extremo.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Placa de Gelo Negro da Espinha',
      },
      {
        range: '2',
        item: 'Núcleo Elemental de Gelo Brilhante',
      },
      {
        range: '3',
        item: 'Osso do Esterno Hidrodinâmico',
      },
      {
        range: '4',
        item: 'Fragmento de Músculo Hiper-Vascularizado',
      },
    ],
  },
  nidhoggAncestral: {
    name: 'Nidhogg Ancestral',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/lkGwkfq.png',
    image: 'https://2img.net/i.imgur.com/KZqwFod.jpeg',
    subtitle: 'CR 20',
    description: `O comportamento do Nidhogg Ancestral é um exercício de pura devastação inercial. Ele se move rastejando rente ao solo, mas com uma velocidade que desafia seu tamanho colossal. A criatura não demonstra raiva, orgulho ou sadismo planejado; ela opera em um estado de fome e entropia perpétuas. Onde o Nidhogg caminha, o solo racha, a atmosfera colapsa e toda a energia térmica é violentamente sugada para dentro de seu núcleo, matando a vegetação e congelando o ar instantaneamente.

A besta exibe um horror anatômico que serve como aviso de morte para qualquer exército. Sem uma única escama para protegê-lo, ele confia na densidade absurda de seus feixes musculares expostos, que são tão compactados pelo frio que alcançaram uma blindagem superior ao ferro comum. O suor de seu esforço físico ferve e solidifica instantaneamente em sua pele, criando uma crosta de diamantes de gelo que brilha de forma hipnotizante enquanto ele se move. Ele não emite rugidos convencionais; seus botes corporais e investidas são tão violentos que quebram a barreira do som, gerando estalos cinéticos que ensurdecem e estilhaçam a espinha dos combatentes antes mesmo do impacto físico acontecer.`,
    type: 'Monstro Colossal, Draco',
    ac: '26',
    hp: '+462 (25d12 + 300)',
    speed: '18 metros, escavação em gelo ou neve 18 metros.',
    stats: {
      forca: '30 (+10)',
      destreza: '16 (+3)',
      constituicao: '30 (+10)',
      inteligencia: '6 (-2)',
      sabedoria: '16 (+3)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Nidhogg Ancestral for alvo de dano Gélido, ele não sofre dano. Em vez disso, o frio extremo regenera instantaneamente seu tecido em carne viva, fazendo-o recuperar 60 Pontos de Vida e carregar seu núcleo cardíaco. Ele ganha uma Carga Sônica. Ele pode gastar uma Carga Sônica para fazer com que seu próximo Bote de Ruptura Sônica seja executado imediatamente como uma reação, quebrando a iniciativa e a ordem de turnos do combate.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gélido, Força, Veneno, Ácido; Concussão, Perfurante e Cortante de ataques não-mágicos, Caído, Atordoado, Paralisado, Petrificado, Assustado, Enfeitiçado, Empurrado, Agarrado, Exaustão, Cego, Envenenado.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Trovão, Necrótico; Concussão, Perfurante e Cortante de armas mágicas. (A evolução muscular máxima mitigou a antiga vulnerabilidade ao fogo através da densidade absoluta da carne congelada).',
      },
      {
        nome: 'Aura de Zero Absoluto',
        desc: 'O corpo do Nidhogg é tão absurdamente frio que ele gera um campo de congelamento total ao seu redor. O ar congela e solidifica instantaneamente num raio de 12 metros do monstro. Qualquer equipamento mágico (armas, armaduras, anéis, escudos) carregado pelos jogadores nessa área sofre um choque térmico catastrófico. As armas mágicas perdem seus bônus de melhoria (+1, +2, +3) enquanto estiverem na área, e as armaduras mágicas têm sua eficácia reduzida, penalizando os jogadores com -3 na CA geral enquanto permanecerem perto do monstro devido ao congelamento dos elos arcanos.',
      },
      {
        nome: 'Horror Anatomico',
        desc: 'O Nidhogg não possui nenhuma escama em seu corpo. Seu tronco frontal, os peitorais largos, as coxas e o abdômen trincado são uma exibição chocante de feixes musculares hiper-definidos em carne viva azul-escura e pulsante. O suor ferve congelado em sua pele nua, criando uma crosta de diamantes de gelo translúcidos que desenha cada fibra de sua anatomia atlética e provocativa. No centro do peito nu, as costelas escuras estão expostas, protegendo um coração elemental que brilha em branco-azulado. Qualquer ataque físico desferido diretamente contra a sua frente ignora a crosta protetora, reduzindo a CA do monstro para 18 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 22 (4d10) de dano gélido puro pelo contato direto com a carne viva de zero absoluto.',
      },
      {
        nome: 'ápice da evolução muscular',
        desc: 'O Nidhogg Ancestral atingiu a perfeição física do caminho bestial. Ele não possui ou conjura qualquer magia ativa, confiando puramente em sua potência biológica insuperável. O monstro adiciona seu modificador de Força (+10) em todos os seus testes de resistência físicos (Força e Constituição) e em seus testes de iniciativa, quebrando o solo por onde passa.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Nidhogg Ancestral realiza três ataques físicos: dois de Pancada de Garras de Diamante e um de Mordida Devoradora de Raízes.',
      },
      {
        nome: 'Garras de diamante',
        desc: 'Ataque Corpo a Corpo Físico: +16 para acertar, alcance 3m. Dano: 23 (3d8 + 10) de dano de concussão mais 9 (2d8) de dano gélido. O impacto esmaga os ossos do alvo e o empurra 6 metros para trás em linha reta.',
      },
      {
        nome: 'Mordida devoradora',
        desc: 'Ataque Corpo a Corpo Físico: +16 para acertar, alcance 3m. Dano: 26 (3d10 + 10) de dano perfurante. O alvo deve passar numa RES de Constituição (CD 24) ou terá um de seus membros temporariamente congelado e inutilizado (o braço que segura a arma ou as pernas), reduzindo seu deslocamento a 0 metros por 1 rodada.',
      },
      {
        nome: 'Bote de ruptura sonica (Recarga 5T)',
        desc: 'O Nidhogg projeta seu pescoço e tronco muscular para a frente com uma velocidade que quebra a barreira do som, gerando um estalo cinético ensurdecedor. Ele avança em um alvo a até 18 metros. O alvo e todas as criatura a até 4 metros dele devem passar numa RES de Destreza (CD 24).  Falha: Sofre 65 (10d12) de dano de Força pura devido à onda de choque sônica, é arremessado 12 metros para trás e fica Atordoado por 1 rodada completa. O estalo sônico também deixa todos os alvos afetados sob a condição Surdo por 1 minuto.  Sucesso: Metade do dano de Força, é empurrado 3 metros para o lado e evita o atordoamento.',
      },
      {
        nome: 'Deslocamento sônico',
        desc: 'O Nidhogg move-se até seu deslocamento total rastejando baixo ao chão, quebrando obstáculos físicos do cenário sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Estalo cinético',
        desc: 'O Nidhogg flexiona seus peitorais de carne viva, fazendo a crosta de diamantes de gelo estalar. Um inimigo a até 9 metros deve passar numa RES de Força (CD 24) ou será derrubado Caído pela onda de choque invisível.',
      },
      {
        nome: 'Pulsação de zero absoluto',
        desc: 'O coração elemental branco-azulado visível através das costelas expostas do monstro emite uma onda de frio extremo. Todos os jogadores a até 6 metros de sua frente devem passar numa RES de Constituição (CD 24) ou sofrerão 27 (6d8) de dano gélido e terão suas ações de bônus bloqueadas em seu próximo turno.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Coração Elemental Branco-Azulado',
      },
      {
        range: '2',
        item: 'Crosta de Diamantes de Gelo Translúcidos',
      },
      {
        range: '3',
        item: 'Feixe de Músculo Vivo de Alta Densidade',
      },
      {
        range: '4',
        item: 'Fragmento de Costela Escura Exposta',
      },
    ],
  },
  glacisRunico: {
    name: 'Glacis Rúnico',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/B1gtqUN.png',
    image: 'https://2img.net/i.imgur.com/BDPTrZH.jpeg',
    subtitle: 'CR 5',
    description: `O comportamento do Glacis Rúnico é governado por uma frieza cirúrgica e um narcisismo intelectual absoluto. Ela não ataca por fúria; cada movimento, passo e conjuração no campo de batalha faz parte de uma equação tática meticulosamente calculada. A criatura adota uma postura andrógina e provocativa, exibindo traços belos e esguios que misturam a graciosidade delicada com uma estrutura nitidamente masculina, usando essa presença exótica e hipnótica de forma deliberada para desestabilizar o foco dos guerreiros da vanguarda.

Nos confrontos, o Glacis opera como um maestro do aprisionamento. Sente um prazer arrogante em ditar para onde os jogadores podem ou não andar, cercando-os com barreiras geométricas e assistindo com desdém o desespero dos combatentes físicos. Ela enxerga os arqueiros e conjuradores de projéteis como ameaças previsíveis e mundanas, divertindo-se ao anular os ataques do grupo com seus espelhos mágicos enquanto sussurra insultos lógicos através de sua postura soberana.`,
    type: 'Monstro Médio, Glacis',
    ac: '16',
    hp: '+82 (11d8 + 33)',
    speed: '9 metros, escalada 9 metros',
    stats: {
      forca: '10 (+0)',
      destreza: '16 (+3)',
      constituicao: '16 (+3)',
      inteligencia: '18 (+4)',
      sabedoria: '14 (+2)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Glacis Rúnico for alvo de dano Gélido, ela não sofre dano. Em vez disso, o frio estabiliza e expande seus cálculos arcanos, fazendo-a recuperar 15 Pontos de Vida e carregar seus circuitos rúnicos. Ela ganha uma Carga Rúnica, que pode ser gasta para conjurar a habilidade Círculo de Aprisionamento Criogênico instantaneamente como uma ação bônus, sem gastar sua recarga natural.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gélido, Psíquico.',
      },
      {
        nome: 'Resistência',
        desc: 'Veneno, Ácido',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Fogo',
      },
      {
        nome: 'Idiomas',
        desc: 'Dialeto Rúnico Ancestral, Comum.',
      },
      {
        nome: 'Runas indigo de exposição',
        desc: 'A Glacis Rúnico assume uma postura ereta, esguia e imponente, com traços sinuosos e sutilmente femininos. Para não obstruir a emanação de seu mana, ela não usa roupas, vestindo apenas faixas de couro abertas no peito para prender seus pergaminhos de cálculo. Seu torso largo, o abdômen trincado e as coxas reptilianas são de carne totalmente nua e lisa, em um tom azul-pálido. Runas profundas e índigo queimam diretamente em sua pele exposta. Qualquer ataque físico focado em sua frente ignora a barreira geométrica, reduzindo a CA do monstro para 12 contra aquele golpe específico. No entanto, o atacante em combate corpo a corpo deve passar numa RES de Sabedoria (CD 15) ou perderá a concentração devido à imposição geométrica e sedutora das runas, sofrendo 4 (1d8) de dano psíquico.',
      },
      {
        nome: 'Suor de diamantes',
        desc: 'O suor que escorre por sua musculatura hiper-definida congela em pequenas crostas de diamantes brilhantes, criando uma estética de poder letal. Quando ela conjura uma magia, essas crostas reluzem e refratam a luz ambiente. Projéteis físicos mundanos (como flechas e virotes comuns) disparados contra ela de uma distância maior que 6 metros sofrem desvantagem nas jogadas de ataque devido à distorção luminosa.',
      },
      {
        nome: 'Calculo Criogênico',
        desc: 'Devido ao seu intelecto superior focado nos padrões de congelamento da água, a Glacis consegue prever a trajetória das ações dos oponentes. Ela adiciona seu modificador de Inteligência (+4) em seus testes de iniciativa e em testes de resistência de Destreza.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Glacis Rúnico realiza dois ataques com sua Lâmina Geométrica de Gelo ou usa sua habilidade Círculo de Aprisionamento Criogênico.',
      },
      {
        nome: 'Lâmina geométrica de gelo',
        desc: 'Ataque Corpo a Corpo Mágico: +7 para acertar, alcance 1m. Dano: 9 (1d8 + 4) de dano de Força mais 4 (1d8) de dano gélido. A arma se materializa como uma projeção matemática afiada de gelo translúcido a partir de suas garras esguias.',
      },
      {
        nome: 'Circulo de aprisionamento criogênico (Recarga 5T)',
        desc: 'A Glacis desenha um círculo congelante místico com raio de 3 metros centralizado em um ponto que ela possa ver a até 12 metros. O solo na área se transforma em uma armadilha geométrica de gelo instantânea. Cada jogador na área deve fazer uma RES de Força (CD 15). Falha: O alvo sofre 9 (2d8) de dano gélido e fica sob a condição Preso (deslocamento zero) conforme o gelo espesso prende seus pés ao chão. O alvo pode usar sua ação para realizar um teste de Força (CD 15) para quebrar o gelo e encerrar o efeito. Sucesso: Metade do dano gélido e não fica preso, mas a área se torna terreno difícil para ele até o início do próximo turno da Glacis.',
      },
      {
        nome: 'Mudar espelho de gelo',
        desc: 'A Glacis gasta sua ação para moldar um espelho de gelo flutuante e translúcido em um espaço vazio a até 6 metros dela. O espelho ocupa um quadrado de 1 metros, possui CA 14 e 25 Pontos de Vida. Ele bloqueia completamente a trajetória de flechas, virotes e projéteis mágicos direcionados a ela ou a seus aliados que estejam posicionados diretamente atrás da barreira. A Glacis pode manter apenas um espelho ativo por vez através desta ação.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Pergaminho de Geometria Mística',
      },
      {
        range: '2',
        item: 'Fragmento de Pele Azul-Pálido Rúnica',
      },
      {
        range: '3',
        item: 'Lasca de Espelho Translúcido Intacto',
      },
      {
        range: '4',
        item: 'Crosta de Diamante de Suor Congelado',
      },
    ],
  },
  criolita: {
    name: 'Criolita',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/h0NVKwV.png',
    image: 'https://2img.net/i.imgur.com/Gdh2dti.jpeg',
    subtitle: 'CR 10',
    description: `O comportamento do Criolita é ditado por uma soberba intelectual absoluta. Ele flutua levemente acima do solo congelado, movendo-se com uma graciosidade quase hipnótica. O monstro adota uma estética andrógina marcante, assemelhando-se a um jovem homem de feições delicadas e femininas, mas com uma musculatura tensionada e densa. Ele usa essa aparência provocativa e exótica de forma consciente para ridicularizar e humilhar os guerreiros mortais, demonstrando total desprezo por qualquer esforço físico que os jogadores tentem exercer contra ele.

Em combate, o Criolita opera com uma mente dividida em correntes concorrentes. Ele possui a capacidade mental de moldar e disparar dois feitiços complexos de forma simultânea, atacando sem dar tempo para os suportes do grupo reagirem. Ele não foge do confronto direto; em vez disso, posiciona-se no centro do campo de batalha cercado por seus espelhos flutuantes, assistindo com um sorriso apático as magias dos jogadores serem absorvidas e voltarem contra o próprio grupo sob a forma de estilhaços de força molecular.`,
    type: 'Monstro Médio, Glacis',
    ac: '20',
    hp: '+157 (21d8 + 63)',
    speed: '12 metros, levitação mágica 6 metros.',
    stats: {
      forca: '10 (+0)',
      destreza: '18 (+4)',
      constituicao: '16 (+3)',
      inteligencia: '22 (+6)',
      sabedoria: '16 (+3)',
      carisma: '16 (+3)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Criolita for alvo de dano Gélido ou de Força, ele não sofre dano. Em vez disso, o excesso de mana herético estabiliza seus tecidos cristalizados, fazendo-o recuperar 25 Pontos de Vida e carregar seu núcleo místico com uma Carga de Sobrecarga. Ele pode gastar uma Carga de Sobrecarga para fazer com que sua próxima magia cause o dobro de dano ou para conjurar instantaneamente um Espelho de Absorção Translúcido sem gastar ações.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gélido, Psíquico, Força.',
      },
      {
        nome: 'Resistência',
        desc: 'Veneno, Ácido; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Fogo',
      },
      {
        nome: 'Idiomas',
        desc: 'Dialeto Rúnico, Comum',
      },
      {
        nome: 'Anatomia Vascularizada',
        desc: 'O Criolita exibe uma estrutura física esguia, esbelta e assustadoramente atlética, com traços andróginos masculinos marcantes. Como roupas ou armaduras comuns bloqueiam a emanação direta de seus portais e circuitos criogênicos, ele veste apenas joias antigas e fragmentos de cristais mágicos cravados diretamente nos ossos de seus ombros e quadris, sustentando uma tanga selvagem de seda mística. Todo o seu tronco largo e o abdômen trincado são de carne nua e lisa, com veias grossas que brilham em um tom branco-azulado pulsante. Qualquer ataque físico focado em sua frente ignora a barreira de cristal, reduzindo a CA do monstro para 14 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 10 (3d6) de dano gélido reativo pelo zero absoluto da pele exposta.',
      },
      {
        nome: 'Pelicula de névoa',
        desc: 'O suor que escorre por seu corpo nu congela instantaneamente em uma película de diamantes antes de evaporar em uma névoa brilhante. Essa névoa concede ao Criolita camuflagem leve constante contra ataques à distância. Além disso, a densidade molecular de seu gelo é tão refinada que todas as magias e ataques do Criolita ignoram completamente a Resistência a dano Gélido dos jogadores no fórum.',
      },
      {
        nome: 'Concorrência arcana dupla',
        desc: 'O intelecto do Criolita permite que ele processe duas correntes de mana simultaneamente. Em seu turno, ele pode conjurar duas magias ou usar duas ações mágicas diferentes sem sofrer penalidades, agindo como um canhão de feitiçaria puro.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Criolita realiza duas ações de Disparo de Lança Molecular ou usa sua Concorrência Arcana para desferir suas magias devastadoras.',
      },
      {
        nome: 'Disparo de lança molecular',
        desc: 'Ataque À Distância Mágico: +10 para acertar, alcance 27 metros. Dano: 19 (3d8 + 6) de dano de Força mais 10 (3d6) de dano gélido. O Criolita dispara um feixe de gelo hiper-compactado que perfura as defesas físicas do alvo.',
      },
      {
        nome: 'Espelho de absorção (Recarga 5T)',
        desc: 'O Criolita molda e invoca até dois espelhos flutuantes de gelo translúcido em espaços vazios a até 9 metros dele. Cada espelho ocupa um quadrado de 1,5 metros, possui CA 16 e 40 Pontos de Vida. Sempre que um jogador lançar uma magia de projétil ou ataque mágico que cruze a linha de visão do espelho, o espelho absorve completamente o feitiço, anulando o efeito no grupo e concedendo ao Criolita uma Carga de Sobrecarga instantânea. O Criolita pode manter no máximo três espelhos ativos ao mesmo tempo.',
      },
      {
        nome: 'Explosão de densidade (Gasta 1 sobrecarga)',
        desc: 'O Criolita estala os dedos, fazendo um de seus espelhos ativos explodir em uma chuva de estilhaços moleculares direcionados. Cada criatura a até 4 metros do espelho escolhido deve fazer uma RES de Destreza (CD 18).  Falha: Sofre 31 (7d8) de dano de Força e fica com o corpo vulnerável, sofrendo desvantagem em testes de resistência físicos até o início do próximo turno do Criolita.  Sucesso: Metade do dano e evita a desvantagem.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Fragmento de Cristal de Ombro Herético',
      },
      {
        range: '2',
        item: 'Joia de Quadril Refretora de Magia',
      },
      {
        range: '3',
        item: 'Fluido Vascular Branco-Azulado',
      },
      {
        range: '4',
        item: 'Película de Diamantes Evaporativos',
      },
    ],
  },
  vritra: {
    name: 'Vritra',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/ux4auJE.png',
    image: 'https://2img.net/i.imgur.com/Kw8W4mV.jpeg',
    subtitle: 'CR 15',
    description: `O comportamento do Vritra é marcado por uma vaidade fria e uma arrogância que beira a divindade. Ele flutua sobre o campo de batalha com uma indiferença assustadora, mantendo uma postura andrógina e esbelta. Ele exibe um corpo excessivamente magro, fibroso e desprovido de qualquer gordura, ostentando traços andróginos de extrema beleza que misturam feições delicadas com uma musculatura severamente definida e masculina. Ele usa essa presença exótica e provocativa como uma ferramenta de dominação psicológica, deleitando-se ao ver guerreiros mortais hesitarem diante de sua silhueta antes de serem dilacerados.

Em combate, o Vritra opera através do sadismo ilusório. Ele não possui pressa para desferir golpes físicos diretos. Em vez disso, prefere assistir os heróis golpeando o próprio ar ou, em casos mais trágicos, direcionando suas espadas e feitiços contra os próprios aliados devido às distorções térmicas que ele projeta na atmosfera. Ele enxerga a coordenação de um grupo de aventureiros como uma piada matemática, quebrando a confiança dos jogadores ao corromper e roubar suas magias de suporte.`,
    type: 'Monstro Médio (Humanoide Reptiliano), Glacis',
    ac: '22',
    hp: '+218 (23d8 + 115)',
    speed: '12 metros, voo 12 metros (levitação mágica)',
    stats: {
      forca: '12 (+1)',
      destreza: '22 (+6)',
      constituicao: '20 (+5)',
      inteligencia: '26 (+8)',
      sabedoria: '18 (+4)',
      carisma: '18 (+4)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Vritra for alvo de dano Gélido, Psíquico ou de Força, ele não sofre dano. Em vez disso, a energia alimenta os cristais de refração suspensos ao seu redor, fazendo-o recuperar 40 Pontos de Vida e ganhar uma Carga de Ilusão. Ele pode gastar uma Carga de Ilusão para forçar um jogador a refazer uma jogada de ataque bem-sucedida contra ele com desvantagem ou para teleportar-se a até 9 metros como uma reação imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Gélido, Psíquico, Força, Veneno, Cegado, Enfeitiçado, Aterrorizado, Atordoado, Paralisado, Caído.',
      },
      {
        nome: 'Resistência',
        desc: 'Ácido; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Fogo. (O calor extremo colapsa a estrutura óptica dos espelhos, anulando sua camuflagem).',
      },
      {
        nome: 'Idiomas',
        desc: 'Rúnico Ancestral, Comum',
      },
      {
        nome: 'Anatomia Cruel da Estrela de Inverno',
        desc: 'Qualquer ataque físico desferido diretamente contra a sua frente ignora as defesas de refração, reduzindo a CA do monstro para 16 contra aquele golpe. No entanto, o atacante em combate corpo a corpo sofre 14 (4d6) de dano gélido puro e deve passar numa RES de Sabedoria (CD 21) ou ficará Confuso por 1 rodada pela pulsação da estrela.',
      },
      {
        nome: 'Camuflagem Translúcida',
        desc: 'O Vritra usa a refração natural dos cristais de gelo suspensos no ar para dobrar a luz ao seu redor, permanecendo em um estado de quase invisibilidade translúcida. Todas as jogadas de ataque à distância (flechas, virotes e projéteis mágicos) direcionadas a ele sofrem desvantagem automática. Caso um ataque erre o Vritra por uma margem de 5 pontos ou mais na CA, o projétil é desviado diretamente para o aliado mais próximo do atirador devido ao desvio óptico.',
      },
      {
        nome: 'Mestre das Miragens',
        desc: 'Sempre que um jogador iniciar seu turno a até 18 metros do Vritra, deve passar numa RES de Inteligência (CD 21). Se falhar, sua percepção de espaço é invertida: o jogador enxerga seus aliados como se fossem duplicatas do Vritra e enxerga o Vritra como se fosse um aliado necessitando de ajuda, mantendo a ilusão até o final de seu turno.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até 3 ações lendárias por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Vritra realiza três ataques de Disparo de Força Refratada ou usa sua habilidade Feitiçaria de Espelhos Gêmeos.',
      },
      {
        nome: 'Disparo de Força Refratada',
        desc: 'Ataque À Distância Mágico: +13 para acertar, alcance 36 metros. Dano: 22 (4d6 + 8) de dano de Força mais 10 (3d6) de dano psíquico. O feixe de luz sólida se divide no ar, atingindo o alvo por ângulos impossíveis.',
      },
      {
        nome: 'Feitiçaria de Espelhos Gêmeos (Recarga 5T)',
        desc: 'O Vritra materializa dois espelhos de gelo gigantescos e perfeitamente polidos em espaços vazios a até 12 metros dele. Cada espelho possui CA 18 e 50 Pontos de Vida. Enquanto os espelhos estiverem ativos, o Vritra pode conjurar seus ataques de Disparo de Força Refratada a partir de qualquer um dos espelhos. Adicionalmente, se o Vritra for alvo de um ataque direto, ele pode trocar de posição com um dos espelhos instantaneamente como uma reação física, fazendo com que o espelho sofra o dano em seu lugar.',
      },
      {
        nome: 'Inversão Óptica Sombria (1/Dia)',
        desc: 'O Vritra foca seu olhar andrógino em um jogador que esteja sob efeito de uma magia de cura ou bônus benéfico de atributos. Ele força o tecido da realidade a se distorcer, fazendo com que o alvo e todos os aliados a até 4 metros dele realizem uma RES de Carisma (CD 21). Em caso de falha, todas as magias benéficas ativas neles mudam instantaneamente de alvo, transferindo os buffs diretamente para o Vritra por 1 minuto.',
      },
      {
        nome: 'Desvio Translúcido',
        desc: 'O Vritra move-se magneticamente por até 6 metros sem tocar o chão, aumentando sua camuflagem e não provocando ataques de oportunidade.',
      },
      {
        nome: 'Lampejo da Estrela Moribunda',
        desc: 'O Vritra contrai seu peito nu, fazendo com que o núcleo visível por trás de suas costelas emita um flash de luz fria. Um inimigo a até 15 metros deve passar numa RES de Inteligência (CD 21) ou atacará o próprio aliado na sua próxima ação de combate.',
      },
      {
        nome: 'Reflexo Estilhaçante (2 Ações)',
        desc: 'O Vritra comanda um de seus espelhos ativos a se quebrar. O espelho explode em uma saraivada de lâminas de vidro criogênico, causando 27 (6d8) de dano cortante a todas as criaturas em um raio de 4 metros do espelho destruído.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: 'Visão Verdadeira 24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo de Estrela Moribunda de Inverno',
      },
      {
        range: '2',
        item: 'Fragmento de Espelho de Refração Estável',
      },
      {
        range: '3',
        item: 'Elos de Ferro Congelado do Quadril',
      },
      {
        range: '4',
        item: 'Tecido Vascular Fibroso do Caos',
      },
    ],
  },
  shesha: {
    name: 'Shesha',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/AmmJhbM.png',
    image: 'https://2img.net/i.imgur.com/IwDGk29.jpeg',
    subtitle: 'CR20',
    description: `O comportamento do Shesha é pautado por um desdém aristocrático e uma apatia divina em relação aos seres mortais. Ele flutua permanentemente acima do solo em uma levitação graciosa, observando o esforço dos aventureiros com o olhar entediado de quem enxerga o tempo e o espaço como brinquedos geométricos. O monstro assume um aspecto assustadoramente andrógino, manifestando a beleza delicada e hipnotizante de um jovem efeminado, combinada com uma musculatura de peito e abdômen desenhada com definição vascularizada extrema.

Sua nudez provocativa não é um ato de selvageria, mas sim a demonstração máxima de sua invulnerabilidade: ele rejeita qualquer vestimenta ou armadura por considerar os metais e tecidos dos homens uma fraqueza fútil. Em combate, o Shesha destrói a coordenação dos jogadores quebrando a lógica geográfica do mapa. Ele tranca heróis em dimensões de bolso isoladas ou altera as coordenadas físicas dos combatentes no meio de seus ataques, fazendo com que o grupo se auto-destrua em um labirinto de espelhos infinitos.`,
    type: 'Monstro Grande, Glacis',
    ac: '26',
    hp: '+450 (28d10 + 252)',
    speed: 'Voando 18 metros',
    stats: {
      forca: '12 (+1)',
      destreza: '24 (+7)',
      constituicao: '28 (+9)',
      inteligencia: '30 (+10)',
      sabedoria: '22 (+6)',
      carisma: '22 (+6)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Shesha for alvo de dano Gélido, Psíquico ou de Força, ele não sofre dano. Em vez disso, o impacto altera as dobras dimensionais ao seu redor, fazendo-o recuperar 60 Pontos de Vida e carregar seu tecido de realidade. Ele ganha uma Carga de Tecelatura. Ele pode gastar uma Carga de Tecelatura para usar sua habilidade Inversão de Coordenadas Cósmicas imediatamente como uma reação livre, forçando a troca de posição dos jogadores no momento exato em que um ataque seria desferido.',
      },
      {
        nome: 'Imunidades',
        desc: 'Gélido, Psíquico, Força, Veneno, Ácido, Cegado, Enfeitiçado, Aterrorizado, Atordoado, Paralisado, Caído, Impedido, Exausto.',
      },
      {
        nome: 'Resistências',
        desc: 'Trovão, Elétrico, Necrótico; Concussão, Perfurante e Cortante de armas mágicas. (A mente eterna que congelou a própria mortalidade manipula as dobras de espaço para dissipar o calor e as forças físicas).',
      },
      {
        nome: 'Idiomas',
        desc: 'Dialeto Cósmico, Comum',
      },
      {
        nome: 'Nudez Aristocrática',
        desc: 'O Shesha flutua com uma postura de realeza e um aspecto assustadoramente andrógino. Sua pele possui um tom branco-índigo impecável, completamente lisa e nua, livre de escamas. Ele usa apenas joias pesadas feitas de gelo negro que são cravadas diretamente na carne de seus ombros e pélvis, presas por correntes translúcidas de puro espaço congelado. A musculatura de seu peito largo e abdômen é desenhada com uma definição vascularizada extrema. Qualquer ataque físico desferido diretamente contra a sua frente ignora suas defesas dimensionais, reduzindo a CA do monstro para 18 contra aquele golpe. No entanto, o atacante corpo a corpo sofre 22 (4d10) de dano gélido puro e deve passar numa RES de Carisma (CD 24) ou ficará Atordoado por 1 rodada, com a mente subjugada pelo desprezo absoluto e pela beleza herética do monstro.',
      },
      {
        nome: 'Desprezo pelas Armaduras Mortais',
        desc: 'O Shesha ignora completamente as barreiras físicas criadas por homens. Todos os ataques mágicos e habilidades do Shesha ignoram bônus de CA provenientes de armaduras pesadas, armaduras médias ou escudos físicos dos jogadores no fórum. O dano causado por ele é aplicado diretamente contra o vigor do personagem.',
      },
      {
        nome: 'Mente Congelada Eterna',
        desc: 'Sendo uma entidade cósmica que personifica o caos e o frio que antecedem a criação, o Shesha congelou sua própria linha temporal e mortalidade. Ele é imune a magias de morte instantânea, desintegração ou efeitos que tentem bani-lo de seu próprio domínio dimensional.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Shesha realiza três ataques de Ruptura de Espaço Sólido ou substitui dois deles para usar sua habilidade Prisão Espelhada de Bolso.',
      },
      {
        nome: 'Ruptura de Espaço Sólido',
        desc: 'Ataque À Distância Mágico: +16 para acertar, alcance 45 metros. Dano: 28 (4d8 + 10) de dano de Força mais 14 (4d6) de dano psíquico. O Shesha estala seus dedos esguios, fazendo com que o próprio espaço ao redor do alvo se estilhace como vidro congelado.',
      },
      {
        nome: 'Inversão de Coordenadas Cósmicas (Recarga 5T)',
        desc: 'O Shesha foca seu olhar andrógino em dois jogadores que ele possa ver no mapa. Os dois alvos devem realizar uma RES de Carisma (CD 24). Se pelo menos um deles falhar, o Shesha distorce o reflexo do espaço e troca as posições físicas dos dois heróis instantaneamente no cenário. Se essa habilidade for usada reativamente com uma Carga de Tecelatura, o herói trocado recebe o ataque inteiro, magia ou dano cataclísmico que estava originalmente direcionado ao seu aliado.',
      },
      {
        nome: 'Prisão Espelhada de Bolso (Gasta 1 Carga de Tecelatura)',
        desc: 'O Shesha invoca um espelho flutuante de cristal puro que avança contra um jogador a até 18 metros. O alvo deve passar numa RES de Inteligência (CD 24). Falha: O jogador é banido para dentro de uma dimensão de bolso congelada contida no reflexo do espelho. Enquanto estiver preso, o herói fica sob a condição Paralisado, não pode agir e sofre 18 (4d8) de dano gélido no início de cada um de seus turnos devido ao zero absoluto do vácuo. O espelho possui CA 20 e 60 Pontos de Vida. O jogador só se liberta se seus aliados destruírem o espelho no cenário do fórum. Sucesso: O jogador evita o banimento, mas sofre 18 (4d8) de dano psíquico pela tentativa de compressão dimensional.',
      },
      {
        nome: 'Dobra de Posicionamento',
        desc: 'O Shesha teleporta-se graciosamente por até 12 metros para qualquer espaço vazio visível, sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Estalo de Reflexo Distorcido',
        desc: 'O Shesha faz as joias de gelo negro de seus ombros brilharem. Um inimigo a até 15 metros deve passar numa RES de Sabedoria (CD 24) ou usará sua reação para desferir um ataque básico contra o aliado mais próximo devido à confusão óptica.',
      },
      {
        nome: 'Pulsação da Estrela de Índigo (2 Ações)',
        desc: 'O peito nu e vascularizado do monstro emite uma onda de choque de energia branco-índigo num raio de 9 metros. Todos os jogadores na área devem passar numa RES de Constituição (CD 24) ou perderão a capacidade de usar ações lendárias, reações ou habilidades ativas de suas classes até o final do próximo turno do Shesha.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '16',
      visaoEscuro: 'Visão Verdadeira 36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Joia Real de Gelo Negro Cravada',
      },
      {
        range: '2',
        item: 'Fragmento de Cristal da Realidade Pura',
      },
      {
        range: '3',
        item: 'Corrente de Espaço Translúcida',
      },
      {
        range: '4',
        item: 'Essência Vascular de Branco-Índigo',
      },
    ],
  },
  salamancerLuz: {
    name: 'Salamancer (Luz)',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/fReRcPd.png',
    image: 'https://2img.net/i.imgur.com/YW6bbjt.jpeg',
    subtitle: 'CR1',
    description:
      'O comportamento desta fera é ditado por um misto de territorialismo e hiperatividade biológica induzida pelo sol. O Salamancer Radiante é incapaz de realizar emboscadas sorrateiras na escuridão, pois a carapaça de rocha escura que cobre suas costas e sua longa cauda curvada é permanentemente cortada por fendas profundas que vazam uma luz dourada intensa. Sabendo disso, o monstro adota uma postura agressiva e direta; ao detectar intrusos em seu território, ele tenciona seus músculos e avança rapidamente, usando a própria iluminação gerada por seu corpo para ofuscar a visão das presas antes de desferir botes frenéticos. Eles são atraídos por feitiços de luz e tentam consumir o mana dessas fontes, tornando-se uma praga perigosa em templos arruinados ou minas profundas.',
    type: 'Monstro Pequeno, Draco',
    ac: '14',
    hp: '24 (5d6 + 7)',
    speed: '9 metros, escalada 9 metros',
    stats: {
      forca: '10 (+0)',
      destreza: '15 (+2)',
      constituicao: '13 (+1)',
      inteligencia: '4 (-3)',
      sabedoria: '12 (+1)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Salamancer Radiante for alvo de dano Radiante, ele não sofre dano. Em vez disso, a luz recarrega suas fendas de mana, fazendo-o recuperar 5 Pontos de Vida e reativar sua habilidade Clarão Cegante instantaneamente, sem precisar rolar dados de recarga.',
      },
      {
        nome: 'Imunidade',
        desc: 'Luz',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Trevas',
      },
      {
        nome: 'Peitoral Dourado',
        desc: 'O lagarto move-se rente ao solo sobre quatro patas curtas e robustas, mantendo uma postura baixa e flexível. Para maximizar a emanação de sua energia solar, ele perdeu quase todas as escamas da área frontal. Seu pescoço, peito largo e abdômen são compostos por feixes musculares hiper-definidos e expostos de um tom amarelo-ouro brilhante. Qualquer ataque físico focado em sua frente ignora a carapaça de pedra escura, reduzindo a CA do monstro para 11 contra aquele golpe específico. No entanto, o impacto na carne viva libera uma forte descarga fotônica, causando 2 (1d4) de dano radiante ao atacante corpo a corpo devido à proximidade.',
      },
      {
        nome: 'Rachaduras de Luminescência',
        desc: 'A carapaça de rocha negra que cobre suas costas e sua cauda grossa e curvada para cima é repleta de fendas profundas que brilham com uma luz dourada e radiante intensa. O Salamancer emite luz plena num raio de 6 metros e luz parcial por mais 6 metros de forma permanente, tornando impossível para o monstro se esconder em ambientes escuros.',
      },
      {
        nome: 'Olhar incandescente',
        desc: 'Os grandes e expressivos olhos brilhantes do lagarto acumulam energia luminosa de forma contínua. Ele possui vantagem em testes de Percepção que dependam da visão e é totalmente imune à condição Cegado.',
      },
    ],
    acoes: [
      {
        nome: 'Mordida centelhante',
        desc: 'Ataque Corpo a Corpo Físico: +4 para acertar, alcance 1m. Dano: 4 (1d4 + 2) de dano perfurante mais 2 (1d4) de dano radiante.',
      },
      {
        nome: 'Clarão cegante (Recarga 5T)',
        desc: 'O Salamancer contrai seus músculos e expele pelas fendas de seu peito exposto e de seus grandes olhos um feixe de luz super-concentrada em um cone de 4 metros. Cada criatura na área deve realizar uma RES de Constituição (CD 11).  Falha: Sofre 4 (1d6 + 1) de dano radiante e fica sob a condição Cegado até o início do próximo turno do Salamancer.  Sucesso: Metade do dano e evita a cegueira.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Fragmento de Carapaça de Rocha Negra',
      },
      {
        range: '2',
        item: 'Lente Ocular Incandescente',
      },
      {
        range: '3',
        item: 'Essência de Sangue Solar',
      },
      {
        range: '4',
        item: 'Filamento Muscular Dourado',
      },
    ],
  },
  camaleaoPrisma: {
    name: 'Camaleão Prisma',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/89duKDz.png',
    image: 'https://2img.net/i.imgur.com/88t0PP4.jpeg',
    subtitle: 'CR 5',
    description: `O comportamento do Camaleão-prisma é definido pela paciência cruel e pelo oportunismo mecânico. Ele não persegue suas presas ativamente; em vez disso, o monstro escala as superfícies de pedra ou se posiciona no centro de caminhos estratégicos, utilizando a capacidade celular de dobrar os raios de luz ao redor de sua pele para ficar completamente invisível a olho nu.

A criatura demonstra um instinto de caça altamente coordenado. Ela aguarda em silêncio absoluto que o grupo de aventureiros se aproxime de seu raio de ação. Quando os alvos estão a uma distância crítica, o monstro libera toda a energia luminosa acumulada em seus tecidos de uma única vez, gerando uma explosão fotônica avassaladora que incapacita o sistema óptico das presas antes de desferir botes corporais massivos com suas garras dianteiras.`,
    type: 'Monstro Médio, Draco',
    ac: '16',
    hp: '+91 (14d8 + 28)',
    speed: '12 metros, escalada 12 metros',
    stats: {
      forca: '16 (+3)',
      destreza: '18 (+4)',
      constituicao: '14 (+2)',
      inteligencia: '4 (-3)',
      sabedoria: '14 (+2)',
      carisma: '7 (-2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Camaleão-prisma for alvo de dano Raqueano ou Radiante, ele não sofre dano. Em vez disso, a luz estabiliza suas células e recarrega seus tecidos biológicos, fazendo-o recuperar 15 Pontos de Vida e carregar seu espectro luminoso. Ele ganha uma Carga Prismática. Ele pode gastar uma Carga Prismática para usar sua habilidade Flashbang Biológico imediatamente sem gastar sua recarga natural ou para se tornar Invisível instantaneamente como uma reação física.',
      },
      {
        nome: 'Imunidade',
        desc: 'Luz',
      },
      {
        nome: 'Resistência',
        desc: 'Veneno; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Trevas',
      },
      {
        nome: 'Película de carne exposta',
        desc: 'O Camaleão-prisma perdeu todas as escamas de seu tronco frontal, mantendo uma estrutura puramente bestial, rasteira e quadrúpede. Sua pele frontal é totalmente nua, lisa e semi-transparente. Por baixo dessa película de carne exposta, a musculatura peitoral e abdominal é hiper-definida e brilha em um tom dourado-neon constante, revelando o fluxo de mana luminoso correndo pelas veias vascularizadas. Qualquer ataque físico desferido diretamente contra a sua frente ignora a proteção de sua carapaça de refração, reduzindo a CA do monstro para 12 contra aquele golpe específico. No entanto, o atacante corpo a corpo é ofuscado pela proximidade da energia viva, sofrendo 4 (1d8) de dano radiante automático devido à irradiação fotônica da carne nua.',
      },
      {
        nome: 'Manto de ouro líquido',
        desc: 'O suor que escorre por seu torso nu reluz como ouro líquido sob qualquer claridade, criando um contraste marcante entre a beleza estatuária de seus músculos e a crueldade de suas garras. Esse suor permite que a criatura dobre perfeitamente os raios de luz ao redor de suas células corporais. Se o Camaleão-prisma iniciar seu turno sem ter se movido ou atacado na rodada anterior, ele fica completamente Invisível. A invisibilidade é quebrada imediatamente se ele realizar um ataque ou usar uma habilidade ofensiva.',
      },
      {
        nome: 'Predador de emboscada',
        desc: 'Camaleão-prisma é um mestre em se misturar ao cenário para caçar através de sua biologia baseada na refração absoluta. Ele possui vantagem em testes de Furtividade e, quando realiza um ataque físico ou habilidade enquanto está sob o efeito de invisibilidade, a jogada possui vantagem e causa 7 (2d6) de dano físico extra se o alvo estiver a até 3 metros de distância do ponto de origem do bote.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Camaleão-prisma realiza dois ataques: um de Mordida de Emboscada e um de Patada de Garras Cruéis.',
      },
      {
        nome: 'Mordida de emboscada',
        desc: 'Ataque Corpo a Corpo Físico: +7 para acertar, alcance 1m. Dano: 11 (2d6 + 4) de dano perfurante. Se o ataque for desferido enquanto o monstro estiver invisível, o alvo deve passar numa RES de Força (CD 14) ou será derrubado Caído pelo impacto surpresa.',
      },
      {
        nome: 'Patada de garras cruéis',
        desc: 'Ataque Corpo a Corpo Físico: +7 para acertar, alcance 1m. Dano: 13 (2d8 + 4) de dano cortante. As garras deixam lacerações severas na carne das presas.',
      },
      {
        nome: 'Flashbang biológico (Recarga 5T)',
        desc: 'O Camaleão-prisma tenciona violentamente seus peitorais expostos, liberando toda a luz acumulada em suas células de uma só vez em uma explosão fotônica avassaladora num raio de 6 metros. Cada criatura na área deve realizar uma RES de Constituição (CD 14). Falha: Sofre 14 (4d6) de dano radiante e fica sob a condição Cegado até o final do próximo turno do Camaleão-prisma. Se o monstro usar esta habilidade enquanto estiver sob o efeito de invisibilidade, os jogadores sofrem desvantagem no teste de resistência pelo choque óptico repentino. Sucesso: Metade do dano e evita a cegueira.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Película de Carne Semi-Transparente',
      },
      {
        range: '2',
        item: 'Amostra de Suor de Ouro Líquido',
      },
      {
        range: '3',
        item: 'Núcleo Vascular Dourado-Neon',
      },
      {
        range: '4',
        item: 'Par de Garras Cruéis de Emboscada',
      },
    ],
  },
  clamidossauroflash: {
    name: 'Clamidossauro-flash',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/2LVmCzn.png',
    image: 'https://2img.net/i.imgur.com/drqGuUZ.jpeg',
    subtitle: 'CR10',
    description: `O comportamento desta fera é marcado por uma agressividade territorial extrema e uma intolerância absoluta a intrusos. O Clamidossauro-flash não se esconde e não busca a sutileza das sombras; ele domina os vales abertos e as ruínas ensolaradas de Terralém através do poder de fogo puro. Quando provocado, o monstro firma suas quatro patas no solo com violência, abre sua gola membranosa e inicia um processo de contração muscular tão severo que sua temperatura corporal atinge níveis estelares em poucos segundos.

A criatura opera puramente sob o instinto de erradicação térmica. Ela enxerga guerreiros de armadura não como ameaças, mas como condutores de metal que precisam ser derretidos. O fluxo de mana luminoso que corre de sua barriga em direção à boca gera um som agudo e ensurdecedor de pressurização arcana, um aviso biológico de que a paisagem à frente está prestes a ser reduzida a cinzas e lava por seu feixe concentrado.`,
    type: 'Monstro Grande, Draco',
    ac: '18',
    hp: '+168 (16d10 + 80)',
    speed: '15 metros, escalada 12 metros.',
    stats: {
      forca: '20 (+5)',
      destreza: '22 (+6)',
      constituicao: '20 (+5)',
      inteligencia: '5 (-3)',
      sabedoria: '14 (+2)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Clamidossauro-flash for alvo de dano Radiante, ele não sofre dano. Em vez disso, a radiação luminosa alimenta diretamente suas células, fazendo-o recuperar 25 Pontos de Vida e recarregando instantaneamente seu Laser Biológico de Alta Intensidade, sem necessidade de rolar dados de recarga.',
      },
      {
        nome: 'Imunidade',
        desc: 'Luz',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Veneno; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Trevas',
      },
      {
        nome: 'Anatomia da fornalha corpórea',
        desc: 'O Clamidossauro-flash possui uma anatomia quadrúpede agressiva e muito atlética. Todo o peito largo e o abdômen são completamente nus, exibindo feixes musculares em carne viva de um tom vermelho-ouro pulsante. Quando ele começa a canalizar sua energia, os músculos de seu peitoral se contraem a um nível extremo, fazendo com que as costelas fiquem claramente visíveis por baixo da pele fina, enquanto o mana luminoso flui de sua barriga em direção ao pescoço, fazendo com que seu torso desprotegido e suado brilhe como uma fornalha acesa por dentro. Qualquer ataque físico focado em sua frente ignora as escamas traseiras, reduzindo a CA do monstro para 13 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 10 (3d6) de dano radiante automático pelo calor extremo expelido pela musculatura exposta.',
      },
      {
        nome: 'Gola parabólica amplificadora',
        desc: 'O monstro possui uma imensa gola de cartilagem e membranas reflexivas ao redor do pescoço que se abre de forma violenta. Essa estrutura funciona como uma antena parabólica biológica, projetada para focar, estabilizar e amplificar a luz absorvida pelo corpo. A gola garante que todas as habilidades de longo alcance do Clamidossauro-flash ignorem a Resistência a dano Radiante dos personagens, permitindo uma precisão cirúrgica de disparo.',
      },
      {
        nome: 'Foco dinâmico de retaguarda',
        desc: 'Embora sua frente seja vulnerável, as escamas de suas costas, cauda e membros traseiros são escuras, espessas e endurecidas por sedimentos minerais. O Clamidossauro-flash possui vantagem em testes de resistência de Destreza contra magias e efeitos de área que exijam reflexos rápidos.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Clamidossauro-flash realiza dois ataques de Patada de Garras Incandescentes ou usa sua ação para disparar o Laser Biológico de Alta Intensidade.',
      },
      {
        nome: 'Patada de garras incandescente',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 2m. Dano: 14 (2d8 + 5) de dano cortante mais 7 (2d6) de dano radiante. O impacto deixa marcas de queimadura profunda no ponto atingido.',
      },
      {
        nome: 'Laser biológico de Alta-intensidade (Recarga 5T)',
        desc: ' O Clamidossauro-flash firma suas quatro patas no chão, abre sua gola parabólica e contrai os peitorais de carne viva, canalizando todo o mana de sua fornalha interna. Ele dispara um feixe de luz concentrada de altíssima intensidade em uma linha de 30 metros de comprimento por 1 metros de largura. Cada criatura na linha deve fazer uma RES de Destreza (CD 18).  Falha: Sofre 45 (10d8) de dano radiante e o metal de sua armadura ou escudo começa a derreter instantaneamente em segundos. Se o alvo usar armadura pesada ou média, sua CA é reduzida permanentemente em -2 pontos. Se estiver usando um escudo físico, o escudo é destruído e inutilizado.  Sucesso: Metade do dano radiante e as defesas não são derretidas.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Gola Parabólica de Cartilagem Prismática',
      },
      {
        range: '2',
        item: 'Fragmento de Músculo de Vermelho-Ouro',
      },
      {
        range: '3',
        item: 'Núcleo da Fornalha Estomacal',
      },
      {
        range: '4',
        item: 'Par de Garras Incandescentes',
      },
    ],
  },
  basiliscoRadiante: {
    name: 'Basilisco Radiante',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/aKyz7Jo.png',
    image: 'https://2img.net/i.imgur.com/b5sB70L.jpeg',
    subtitle: 'CR 15',
    description: `O comportamento do Basilisco Radiante é governado por um estado de agitação e agressividade atômica instintiva. O monstro não precisa morder ou perseguir suas presas para iniciar a matança; sua mera presença no campo de batalha é um evento cataclísmico. Ele se move com uma imponência brutal, exalando ondas de distorção térmica e calor invisível que corrompem e deterioram a matéria orgânica ao seu redor em um nível subatômico.

A fera demonstra um sadismo puramente biológico. Ela avança contra exércitos e grupos de caça sabendo que o brilho emitido por sua estrutura interna sabota os sentidos dos guerreiros. O basilisco se posiciona estrategicamente para subjugar os combatentes através do desgaste, assistindo as linhas de frente colapsarem por exaustão celular e queimaduras internas antes mesmo de desferir seus botes físicos devastadores com suas garras e mandíbulas infectadas por isótopos.`,
    type: 'Monstro Enorme, Draco',
    ac: '22',
    hp: '+241 (21d12 + 105)',
    speed: '12 metros, escalada 12 metros.',
    stats: {
      forca: '25 (+7)',
      destreza: '20 (+5)',
      constituicao: '20 (+5)',
      inteligencia: '6 (-2)',
      sabedoria: '17 (+3)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Basilisco Radiante for alvo de dano Radiante, ele não sofre dano. Em vez disso, a energia atômica e luminosa alimenta o reator em seu estômago, fazendo-o recuperar 35 Pontos de Vida e gerando uma Carga Gama. Ele pode gastar uma Carga Gama para expandir instantaneamente o raio de sua Aura de Desgaste Térmico para 18 metros por 1 rodada ou para recarregar imediatamente seu Sopro de Radiação Ultravioleta sem rolar dados.',
      },
      {
        nome: 'Imunidades',
        desc: 'Radiante, Veneno.Cegado, Envenenado, Paralisado, Atordoado, Exausto',
      },
      {
        nome: 'Resistências',
        desc: 'Fogo, Ácido; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidades',
        desc: 'Necrótico. (Energias sombrias quebram a coesão das partículas atômicas em suas células).',
      },
      {
        nome: 'Fluido Fosforescente',
        desc: 'Um fluido corporal fosforescente e brilhante escorre constantemente por sua musculatura vascularizada. Qualquer ataque físico desferido diretamente contra sua frente ou flancos expostos ignora suas defesas ópticas, reduzindo a CA do monstro para 15 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 14 (4d6) de dano radiante e deve fazer uma RES de Constituição (CD 20) ou ficará sob o efeito de Cegueira Temporária por 1 rodada devido ao brilho das costelas expostas.',
      },
      {
        nome: 'Aura de Desgaste Térmico',
        desc: 'O corpo nu do Basilisco emite uma pulsação constante de radiação ultravioleta extrema em um raio de 9 metros. Qualquer jogador que iniciar seu turno dentro dessa área sofre 11 (2d10) de dano radiante automático e recebe o debuff de Queimação Celular. Enquanto estiver sob o efeito de Queimação Celular, as estruturas orgânicas do herói são danificadas a nível subatômico, fazendo com que qualquer magia de suporte, poção ou efeito de cura recebido pelo personagem recupere apenas metade dos Pontos de Vida originais. O debuff dura enquanto o jogador permanecer na área e por mais 1 rodada após sair dela.',
      },
      {
        nome: 'Olhar Radioativo Deformante',
        desc: 'A radiação emitida pelos olhos grandes e brilhantes do Basilisco satura o ar. Sempre que um jogador olhar diretamente para o monstro para realizar um ataque físico ou mágico focado a até 24 metros de distância, deve passar numa RES de Constituição (CD 20) ou sofrerá desvantagem na jogada devido à distorção visual e queimadura na retina.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Basilisco Radiante realiza três ataques físicos: uma Mordida Reatora e duas Patadas de Garras de Desgaste.',
      },
      {
        nome: 'Mordida Reatora',
        desc: 'Ataque Corpo a Corpo Físico: +12 para acertar, alcance 2m. Dano: 20 (3d8 + 7) de dano perfurante mais 14 (4d6) de dano radiante. O alvo deve passar numa RES de Constituição (CD 20) ou contrairá Envenenamento por Radiação, sofrendo 7 (2d6) de dano radiante no início de cada um de seus turnos por 1 minuto. O alvo pode repetir o teste no final de seus turnos para encerrar o efeito.',
      },
      {
        nome: 'Patada de Garras de Desgaste',
        desc: 'Ataque Corpo a Corpo Físico: +12 para acertar, alcance 2m. Dano: 16 (2d8 + 7) de dano cortante. O impacto rasga as defesas físicas e espalha o fluido fosforescente na armadura do alvo.',
      },
      {
        nome: 'Sopro de Radiação Ultravioleta (Recarga 5T)',
        desc: 'O Basilisco contrai severamente seu abdômen semi-transparente, fazendo o núcleo de seu estômago brilhar de forma insustentável. Ele expele um flash de alta intensidade combinado com um feixe gama em um cone de 12 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 20). Falha: Sofre 58 (13d8) de dano radiante, fica completamente Cegada por 1 minuto e seu equipamento sofre degradação, penalizando o jogador com -2 na CA até que a armadura seja reparada no interregno. Sucesso: Metade do dano radiante, evita a degradação e a cegueira dura apenas até o início do próximo turno do herói.',
      },
      {
        nome: 'Movimentação Fosforescente',
        desc: 'O monstro rasteja até seu deslocamento total sem provocar ataques de oportunidade, deixando um rastro de fluido brilhante no solo que funciona como terreno difícil para os jogadores por 1 rodada.',
      },
      {
        nome: 'Pulsação Gama Isotópica',
        desc: 'O Basilisco emite um pulso de seu esterno exposto. Um jogador a até 12 metros que esteja sob o efeito de Queimação Celular deve fazer uma RES de Constituição (CD 20) ou sofrerá 14 (4d6) de dano radiante extra de forma imediata.',
      },
      {
        nome: 'Clarão de Exposição Frontal (2 Ações)',
        desc: 'A criatura estufa o peito nu, emitindo um flash reativo de suas costelas brancas. Todos os heróis que estiverem em linha de visão direta a até 15 metros de sua frente devem passar numa RES de Sabedoria (CD 20) ou ficaram Assustados por 1 rodada devido ao horror anatômico e à dor óptica.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '30 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo Solar Estomacal Super-Aquecido',
      },
      {
        range: '2',
        item: 'Amostra de Fluido Corporal Fosforescente',
      },
      {
        range: '3',
        item: 'Fragmento de Pele Semi-Transparente Ultravioleta',
      },
      {
        range: '4',
        item: 'Costela de Luz Calcificada',
      },
    ],
  },
  quetzalcoatl: {
    name: 'Quetzalcoatl',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/XeUpyyM.png',
    image: 'https://2img.net/i.imgur.com/XTh7MLs.jpeg',
    subtitle: 'CR 20',
    description: `O Quetzalcoatl não possui malícia humana ou soberba intelectual; ele opera com a indiferença avassaladora de um cataclismo cósmico. Ele reivindica os céus e os campos abertos, transformando a atmosfera ao seu redor em um inferno de plasma de onde nenhuma sombra pode escapar. A velocidade de seus botes e deslocamentos é tão estúpida e violenta que a criatura literalmente racha os raios de luz ao redor de sua anatomia, distorcendo a realidade geográfica do mapa.

A entidade enxerga o campo de batalha como um sistema solar em colapso. Ela se move deixando pós-imagens sólidas de pura radiação que agem de forma independente, flanqueando e atacando os jogadores simultaneamente por múltiplos ângulos. O pavor instintivo que emana de seu rugido é capaz de congelar o sangue dos guerreiros mais veteranos, paralisando exércitos inteiros antes do disparo de seu canhão de ignição.`,
    type: 'Monstro Gargantuesco, Draco',
    ac: '25',
    hp: '+412 (25d20 + 150)',
    speed: '15 metros, voo 27 metros',
    stats: {
      forca: '28 (+9)',
      destreza: '26 (+8)',
      constituicao: '22 (+6)',
      inteligencia: '6 (-2)',
      sabedoria: '18 (+4)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Quetzalcoatl for alvo de dano Radiante ou de Fogo, ele não sofre dano. Em vez disso, a energia térmica e atômica alimenta seu núcleo, fazendo-o recuperar 50 Pontos de Vida e gerando uma Carga Solar. Ele pode gastar uma Carga Solar para fazer com que uma de suas pós-imagens execute um ataque extra imediato ou para recarregar instantaneamente a ação Incinerar Horizonte.',
      },
      {
        nome: 'Imunidades',
        desc: 'Radiante, Fogo, Veneno, Ácido, Cegado, Envenenado, Paralisado, Atordoado, Exausto, Caído, Impedido.',
      },
      {
        nome: 'Resistência',
        desc: 'Concussão, Perfurante e Cortante de ataques mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Necrótico, trevas',
      },
      {
        nome: 'Gaiola do coração estelar',
        desc: 'O Quetzalcoatl não possui escamas ou penas. Seu tronco frontal, os peitorais largos, o abdômen trincado e as coxas são uma exibição monumental de feixes musculares hiper-definidos em carne viva dourada e pulsante. Ele transpira um plasma solar espesso que escorre por sua musculatura nua, reluzindo como ouro derretido. No centro do peito largo, as costelas calcinadas estão totalmente à mostra, agindo como uma gaiola que expõe um coração elemental que brilha em um branco-puro cegante. Qualquer ataque físico focado em sua frente ignora a distorção óptica, reduzindo a CA do monstro para 16 contra aquele golpe. No entanto, o atacante corpo a corpo sofre 25 de dano radiante automático e deve passar numa RES de Constituição (CD 24) ou ficará sob Cegueira Absoluta (cuja recuperação é impossível por métodos mundanos) por 1 rodada.',
      },
      {
        nome: 'Ruptura taquiônica',
        desc: 'A velocidade de botes e movimentos do Quetzalcoatl é tão estúpida que ele racha os raios de luz ao redor de sua anatomia. Ele possui camuflagem total constante, fazendo com que todas as jogadas de ataque contra ele sofram desvantagem. Além disso, sempre que ele se move mais de 9 metros em um turno, ele deixa para trás uma Pós-Imagem Sólida de pura radiação no espaço anterior.',
      },
      {
        nome: 'Grito do ocaso',
        desc: 'O clamor do monstro ecoa como o colapso de uma estrela. O anúncio de que o julgamento térmico começou força todos os jogadores a até 30 metros a realizarem uma RES de Sabedoria (CD 24) no início de seus turnos. Se falharem, ficam Aterrorizados por 1 rodada e seu deslocamento cai para zero devido ao pavor instintivo da aniquilação total.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Quetzalcoatl realiza três ataques: um Bote Relativístico e duas Patadas de Plasma, ou ordena que suas Pós-Imagens Sólidas ataquem.',
      },
      {
        nome: 'Bote relativístico',
        desc: 'Ataque Corpo a Corpo Físico: +15 para acertar, alcance 4 metros. Dano: 27 (4d8 + 9) de dano perfurante mais 14 (4d6) de dano radiante. A velocidade do bote quebra a barreira do som e da luz simultaneamente.',
      },
      {
        nome: 'Patada de plasma',
        desc: 'Ataque Corpo a Corpo Físico: +15 para acertar, alcance 3 metros. Dano: 23 (4d6 + 9) de dano cortante. O golpe espalha plasma solar no alvo, reduzindo sua CA em -1 permanentemente até que a armadura seja reparada.',
      },
      {
        nome: 'Incinerar horizonte (Recarga 5T)',
        desc: 'O Quetzalcoatl abre suas mandíbulas e projeta a energia total de seu coração branco-puro. Ele dispara um laser apocalíptico em uma linha de 60 metros de comprimento por 3 metros de largura. Cada criatura na área deve fazer uma RES de Destreza (CD 24). Falha: Sofre 90 (20d8) de dano radiante e tem todas as suas resistências a elementos caloríficos anuladas. Armaduras metálicas e escudos arcanos são completamente evaporados, reduzindo a CA base do herói para 10 de forma permanente durante o evento. Sucesso: Metade do dano e as defesas sofrem apenas metade da degradação (-3 na CA).',
      },
      {
        nome: 'Gênese Radiante (2 cargas solar)',
        desc: 'O monstro racha a luz e solidifica duas Pós-Imagens Sólidas adicionais no campo de batalha. Cada pós-imagem possui CA 18, 50 Pontos de Vida, flutua no cenário e compartilha o bônus de ataque do Quetzalcoatl. Elas agem de forma independente no final do turno do monstro, desferindo uma Patada de Plasma cada uma. O Quetzalcoatl pode manter no máximo três pós-imagens ativas simultaneamente.',
      },
      {
        nome: 'Salto quântico',
        desc: 'O monstro teleporta-se instantaneamente por até 15 metros através da quebra de luz, sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Supernova biológica (2 ações)',
        desc: 'O coração elemental no peito nu do monstro pulsa violentamente. Todos os jogadores a até 12 metros devem passar numa RES de Constituição (CD 24). Se falharem, sofrem 36 (8d8) de dano radiante e não podem receber nenhum tipo de cura ou bônus de suporte por 1 rodada completa devido ao colapso molecular de seus corpos.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: 'Visão Verdadeira 36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Coração Elemental Branco-Puro',
      },
      {
        range: '2',
        item: 'Amostra de Plasma Solar Espesso',
      },
      {
        range: '3',
        item: 'Fragmento de Costela Calcinada',
      },
      {
        range: '4',
        item: 'Filamento de Carne Viva Dourada',
      },
    ],
  },
  luxisRunico: {
    name: 'Luxis Rúnico',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/rYf4kYK.png',
    image: 'https://2img.net/i.imgur.com/Xde1cNT.jpeg',
    subtitle: 'CR 5',
    description: `O comportamento do Luxis Rúnico é ditado por uma arrogância silenciosa e uma postura de realeza clerical. Ele não corre e não demonstra pressa; move-se com passos calmos e eretos, observando os aventureiros com o desdém de um juiz celestial.

Sua anatomia foge completamente dos padrões predatórios comuns: ele exibe uma silhueta robusta e nitidamente masculina, caracterizada por uma pele lisa de tom dourado-pálido e uma proeminente barriga arredondada. Longe de ser uma fraqueza orgânica, seu corpo gordinho atua como um imenso reservatório biológico. É dentro dessa estrutura macia que o mana radiante é condensado e mantido sob altíssima pressão, fazendo com que as runas geométricas gravadas em seu abdômen brilhem em um tom branco-neon ofuscante sempre que ele dita as regras do combate.`,
    type: 'Monstro Médio (Humanoide Reptiliano), Radiante',
    ac: '16',
    hp: '+78 (12d8 + 24)',
    speed: '9 metros',
    stats: {
      forca: '10 (+0)',
      destreza: '16 (+3)',
      constituicao: '14 (+2)',
      inteligencia: '22 (+6)',
      sabedoria: '16 (+3)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Luxis Rúnico for alvo de dano Radiante ou de Força, ele não sofre dano. A energia reconecta seus circuitos celestiais, fazendo-o recuperar 15 Pontos de Vida e concedendo uma Carga Rúnica. Ele pode gastar uma Carga Rúnica para estender instantaneamente a duração de sua Cúpula de Luz por 1 rodada ou para conjurar seu Espelho Fotônico sem gastar uma reação. Imunidades a Dano: Radiante.',
      },
      {
        nome: 'Resistências',
        desc: 'Psíquico; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Trevas',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Celestial Superior.',
      },
      {
        nome: 'Carne rúnica',
        desc: 'O Luxis Rúnico adota uma postura totalmente ereta, esguia, aristocrática e assustadoramente andrógina. Ele despreza roupas ordinárias, utilizando apenas tiras de couro branco nos ombros para prender pergaminhos sagrados. Todo o seu torso largo, o abdômen trincado e as pernas longas são compostos por uma pele totalmente nua, lisa e sem escamas, em um tom dourado-pálido. Runas geométricas profundas queimam em sua carne viva em um brilho branco-neon constante. Qualquer ataque físico desferido diretamente contra a sua frente ignora suas defesas mágicas, narrowing a CA do monstro para 12 contra aquele golpe específico. No entanto, o atacante em combate corpo a corpo sofre 4 (1d8) de dano radiante pela queimação das runas expostas.',
      },
      {
        nome: 'Névoa Evaporativa',
        desc: 'O suor que escorre por sua musculatura hiper-definida evapora instantaneamente em uma névoa brilhante e quente, criando uma estética de poder herética e altamente provocativa. Esta névoa cria uma zona de refração ao redor do monstro, impondo desvantagem automática em todas as jogadas de ataque à distância focadas nele.',
      },
      {
        nome: 'Eloquência herética',
        desc: 'O Luxis Rúnico utiliza a fala humana para recitar cantos arcanos. Ele não pode ter suas conjurações silenciadas por métodos normais e possui vantagem em testes de resistência contra magias que tentem controlar sua mente ou perturbar sua concentração espiritual.',
      },
    ],
    acoes: [
      {
        nome: 'Verbo herético',
        desc: 'Ataque À Distância Mágico: +9 para acertar, alcance 18 metros. Dano: 13 (2d6 + 6) de dano de Força mais 4 (1d8) de dano radiante. O monstro profere uma palavra de ordem que materializa um projétil de luz sólida diretamente contra o alvo.',
      },
      {
        nome: 'Cúpula de luz (Recarga 5T)',
        desc: 'O Luxis Rúnico recita um canto rúnico e projeta uma barreira hemisférica invisível de luz sólida com 3 metros de raio centrada em si mesmo. A cúpula possui 40 Pontos de Vida e CA 14. Nenhuma magia ou ataque físico pode atravessar a barreira (em nenhuma das direções) enquanto ela estiver ativa. A cúpula dura por 2 rodadas ou até ser destruída pelos jogadores.',
      },
      {
        nome: 'Espelho fotônico',
        desc: 'Como uma reação ao ser alvo de uma magia ofensiva de projétil ou de alvo único lançada por um jogador, o Luxis Rúnico ativa uma runa em seu abdômen nu. O feitiço inimigo é interceptado por um escudo de luz e refletido diretamente de volta para o conjurador original, utilizando o mesmo bônus de ataque e CD do jogador.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: 'Visão Verdadeira 18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Tira de Couro de Pergaminho Sagrado',
      },
      {
        range: '2',
        item: 'Fragmento de Carne Rúnica Dourada',
      },
      {
        range: '3',
        item: 'Essência de Névoa Quente Destilada',
      },
      {
        range: '4',
        item: 'Cristal de Geometria Celestial',
      },
    ],
  },
  seraf: {
    name: 'Seraf',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/K3hnK28.png',
    image: 'https://2img.net/i.imgur.com/aa1yyWv.jpeg',
    subtitle: 'CR10',
    description:
      'O comportamento do Seraf em combate é marcado por uma precisão cirúrgica e uma frieza intimidadora. Ele flutua e se desloca pelo cenário com uma elegância aristocrática, desferindo estocadas velozes enquanto utiliza a fala para ditar sentenças heréticas que quebram a estabilidade psicológica dos guerreiros na linha de frente.',
    type: 'Monstro Médio (Humanoide Reptiliano)',
    ac: '20',
    hp: '+152 (16d8 + 80)',
    speed: '12 metros, voo 18 metros',
    stats: {
      forca: '18 (+4)',
      destreza: '22 (+6)',
      constituicao: '20 (+5)',
      inteligencia: '24 (+7)',
      sabedoria: '16 (+3)',
      carisma: '16 (+3)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Seraf for alvo de dano Radiante ou de Força, ele não sofre dano. A energia é assimilada por sua derme, fazendo-o recuperar 25 Pontos de Vida e gerando uma Carga de Convergência. Ele pode gastar uma Carga de Convergência para realizar uma Estocada Elegante como uma reação livre ou para anular instantaneamente o tempo de recarga de suas Asas do Julgamento.',
      },
      {
        nome: 'Imunidades',
        desc: 'Radiante.',
      },
      {
        nome: 'Resistência',
        desc: 'Psíquico, Força; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Trevas',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Celestial.',
      },
      {
        nome: 'Anatomia Perolada',
        desc: 'O Seraf ostenta uma silhueta bípede incrivelmente rasgada, fibrosa e definida ao extremo, exibindo seus feixes musculares com precisão anatômica severa e intimidadora. Ele não utiliza vestimentas ou armaduras, exibindo uma pele de textura perolada inteiramente nua que reflete a claridade em padrões geométricos. Qualquer ataque físico focado diretamente contra o seu torso exposto ignora suas previsões táticas, reduzindo sua CA para 14 contra aquele golpe específico. No entanto, a flexão de sua musculatura irradia calor, causando 10 (3d6) de dano radiante automático a qualquer atacante que o atinja em combate corpo a corpo',
      },
      {
        nome: 'Calculo preditivo',
        desc: 'O Seraf utiliza sua inteligência superior para antecipar os movimentos do grupo de jogadores. Ele adiciona seu modificador de Inteligência em sua Classe de Armadura e em seus testes de iniciativa. Além disso, ele não pode ser flanqueado ou pego de surpresa enquanto estiver consciente.',
      },
      {
        nome: 'Rastro de fulgor',
        desc: 'A velocidade marcial mística do Seraf deixa pós-imagens de suor e luz pelo cenário do fórum. Qualquer criatura que realize um ataque à distância contra ele sofre desvantagem na jogada, a menos que possua visão verdadeira ou meios de rastreamento mágico ativos.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Seraf realiza três ataques de Estocada Elegante ou substitui um deles pela ação Verbo de Cisma.',
      },
      {
        nome: 'Estocada elegante',
        desc: 'Ataque Corpo a Corpo Mágico: +11 para acertar, alcance 2 metros. Dano: 15 (2d8 + 6) de dano perfurante mais 7 (2d6) de dano radiante. O Seraf materializa uma lâmina de luz sólida diretamente de seu braço nu e executa uma estocada precisa. Este ataque ignora completamente os bônus de CA fornecidos por armaduras físicas e escudos dos jogadores.',
      },
      {
        nome: 'Verbo de cisma',
        desc: 'O Seraf profere uma declaração herética em linguagem comum, focando em um conjurador ou guerreiro a até 15 metros. O alvo deve realizar uma RES de Sabedoria (CD 19). Se falhar, o personagem perde sua capacidade de usar reações e tem sua concentração mágica quebrada imediatamente devido à desestabilização psicológica.',
      },
      {
        nome: 'Asas do julgamento (Recarga 5T)',
        desc: 'O Seraf projeta majestosas asas de luz sólida de suas costas e realiza um batido violento, disparando uma rajada de penas cristalinas em um cone de 9 metros. Cada criatura na área deve passar numa RES de Destreza (CD 19). Falha: Sofre 35 (10d6) de dano radiante e fica sob a condição Impedido por linhas de luz que se fixam ao solo. Sucesso: Metade do dano e evita a restrição de movimento.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: 'Visão Verdadeira 24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Fragmento de Asa de Luz Sólida',
      },
      {
        range: '2',
        item: 'Amostra de Pele Perolada Íntegra',
      },
      {
        range: '3',
        item: 'Essência de Suor Luminoso Concentrado',
      },
      {
        range: '4',
        item: 'Runa do Cálculo Tático',
      },
    ],
  },
  rajaNaga: {
    name: 'Raja naga',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/etIFZm1.png',
    image: 'https://2img.net/i.imgur.com/A3YOm5P.jpeg',
    subtitle: 'CR 15',
    description: `A atitude do Raja Naga em combate é ditada por um sadismo intelectual refinado e uma arrogância imensurável. Ele se move pelo campo de batalha com uma graciosidade serpentina aterrorizante, deslizando entre as sombras e a luz com total desdém pelos guerreiros mortais. O monstro utiliza sua fala de forma constante e reverberante, não apenas para proferir seus cantos arcanos, mas para zombar abertamente das estratégias dos jogadores, destruindo a confiança do grupo antes mesmo de desferir o primeiro feitiço.

Sua conduta é focada na subversão da realidade. O Raja Naga sente um prazer genuíno em assistir a vanguarda do grupo hesitar, atacar o vazio ou se voltar contra os próprios aliados. Ele opera como um marionetista invisível que se esconde atrás de barreiras ópticas e miragens, manipulando o pânico e a desorientação dos heróis para que o próprio grupo execute a sua própria destruição.`,
    type: 'Monstro Enorme (Humanoide Serpentino)',
    ac: '22',
    hp: '+232 (25d12 + 75)',
    speed: '12 metros, escalada 12 metros.',
    stats: {
      forca: '12 (+1)',
      destreza: '22 (+6)',
      constituicao: '16 (+3)',
      inteligencia: '26 (+8)',
      sabedoria: '20 (+5)',
      carisma: '18 (+4)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Raja Naga for alvo de dano Radiante ou Psíquico, ele não sofre dano. A energia é assimilada por seu sistema nervoso, fazendo-o recuperar 35 Pontos de Vida e gerando uma Carga de Dominação. Ele pode gastar uma Carga de Dominação para forçar um jogador sob a condição Confuso a realizar um ataque contra o aliado mais próximo imediatamente, sem gastar ações.',
      },
      {
        nome: 'Imunidades',
        desc: 'Radiante, Psíquico, Cegado, Encantado, Amedrontado, Paralisado.',
      },
      {
        nome: 'Resistência',
        desc: 'Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Trevas',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Celestial',
      },
      {
        nome: 'Ventre do sacrilégio',
        desc: 'O Raja Naga exibe uma silhueta assustadoramente magra, tesa e extremamente flexível, movendo-se com uma graciosidade sensual e aterrorizante. Ele rejeita armaduras, usando apenas um manto translúcido e rasgado sobre um dos ombros. Seu peito largo, o ventre trincado ao extremo e toda a região pélvica ficam totalmente desprotegidos e à mostra. Runas heréticas estão cravadas diretamente na pele nua dourada e vascularizada de seu abdômen, pulsando em um brilho branco-neon sempre que ele conjura. Qualquer ataque físico focado em sua frente ignora suas miragens ópticas, reduzindo a CA do monstro para 14 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 14 (4d6) de dano psíquico devido ao choque mental gerado pelas runas expostas.',
      },
      {
        nome: 'Névoa do torso',
        desc: 'Um vapor constante e brilhante emana de sua musculatura exposta e suada durante o transe de conjuração. Essa névoa de calor distorce o ar ao redor do monstro, agindo como uma barreira óptica permanente. Todas as jogadas de ataque à distância (físicas ou mágicas) contra o Raja Naga sofrem desvantagem natural.',
      },
      {
        nome: 'Soberania verbal',
        desc: 'A fala arrogante e reverberante do monstro serve como canalizador para sua feitiçaria mental. O Raja Naga ignora os efeitos de silenciamento mágico mundano e adiciona seu modificador de Inteligência (+8) em todos os seus testes de resistência para manter a concentração de seus cantos.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Raja Naga realiza um ataque de Garras Prismáticas e usa sua Doutrina Herética.',
      },
      {
        nome: 'Garras prismáticas',
        desc: 'Ataque Corpo a Corpo Mágico: +13 para acertar, alcance 3 metros. Dano: 16 (3d6 + 6) de dano cortante mais 9 (2d6) de dano radiante. O monstro materializa extensões de luz sólida em suas garras para dilacerar o alvo.',
      },
      {
        nome: 'Doutrina herética (Recarga 5T)',
        desc: 'O Raja Naga recita um canto herético reverberante que penetra diretamente nas mentes dos jogadores em um raio de 12 metros. Cada criatura na área deve realizar uma RES de Sabedoria (CD 21). Falha: Sofre 27 (6d8) de dano psíquico e fica sob a condição Confuso por 1 rodada completa. Enquanto estiver confuso, o jogador gasta seu turno atacando o aliado mais próximo ou se debatendo às cegas. Sucesso: Metade do dano psíquico e evita a confusão.',
      },
      {
        nome: 'Miragem de geada (2/dia)',
        desc: 'O monstro manipula a refração da luz através do vapor de seu corpo e cria dois clones ilusórios perfeitos de si mesmo no cenário. Os clones imitam seus movimentos e possuem as mesmas estatísticas de CA. Sempre que o Raja Naga for alvo de um ataque, role um dado para determinar se o golpe atingiu o monstro real ou uma de suas miragens. Um clone se desfaz em partículas de luz brilhante ao receber qualquer quantidade de dano.',
      },
      {
        nome: 'Deslocamento sinuoso',
        desc: 'O monstro rasteja e desliza até metade de seu deslocamento sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Estalo cegante',
        desc: 'O Raja Naga faz as runas de seu abdômen trincado brilharem intensamente. Um jogador a até 9 metros deve passar numa RES de Constituição (CD 21) ou ficará sob a condição Cegado até o início do próximo turno do monstro.',
      },
      {
        nome: 'Comando herético (2 ações)',
        desc: 'O monstro sussurra uma ordem telepática para um personagem Confuso a até 18 metros, forçando-o a usar sua reação para conjurar um feitiço de suporte ou realizar um ataque básico contra um alvo escolhido pelo Raja Naga.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '15',
      visaoEscuro: 'Visão Verdadeira 30 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Manto Translúcido Rasgado',
      },
      {
        range: '2',
        item: 'Gema Ocular sem Pupila',
      },
      {
        range: '3',
        item: 'Fragmento de Pele Rúnica Vascularizada',
      },
      {
        range: '4',
        item: 'Essência de Vapor Neon',
      },
    ],
  },
  vasuki: {
    name: 'Vasuki',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/PsvuidA.png',
    image: 'https://2img.net/i.imgur.com/0Uozqyr.jpeg',
    subtitle: 'CR20',
    description: `A atitude de Vasuki em batalha é marcada por uma calma gélida, uma imponência monárquica e um desdém absoluto por qualquer forma de resistência. Ele não enxerga os aventureiros como adversários legítimos, mas como súditos insolentes que ousam profanar seu templo sagrado. O monstro se move flutuando com total serenidade, utilizando sua telepatia e sua voz estrondosa para subjugar o livre-arbítrio dos guerreiros, ditando ordens que devem ser obedecidas sob pena de aniquilação imediata.

Sua conduta de combate baseia-se na punição impiedosa da ousadia dos jogadores. Vasuki sente um prazer tirânico em ditar leis universais que proíbem os personagens de agirem livremente no fórum. Ele pune o uso de magias comuns, ataques mundanos ou estratégias convencionais, fazendo com que a própria realidade ricocheteie o dano contra os executores. Sua soberania psicológica é tão opressiva que ele joga abertamente com o desespero do grupo, assistindo com frieza aristocrática enquanto as linhas de frente entram em colapso mental ao perceberem que suas maiores bênçãos e melhorias arcanas foram apagadas com uma única palavra de ordem.`,
    type: 'Monstro Enorme (Humanoide Serpentino)',
    ac: '25',
    hp: '+420 (28d12 + 238)',
    speed: '12 metros, natação 12 metros',
    stats: {
      forca: '18 (+4)',
      destreza: '24 (+7)',
      constituicao: '26 (+8)',
      inteligencia: '30 (+10)',
      sabedoria: '22 (+6)',
      carisma: '20 (+5)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que Vasuki for alvo de dano Radiante ou Psíquico, ele não sofre dano. A energia reconstitui seu tecido celular, fazendo-o recuperar 50 Pontos de Vida e gerando uma Carga Dogmática. Ele pode gastar uma Carga Dogmática para forçar um jogador a falhar instantaneamente em um teste de concentração ou para estender o efeito de seu Anátema Absoluto por 1 rodada.',
      },
      {
        nome: 'Imunidade',
        desc: 'Radiante, Psíquico, Veneno, Ácido, Cegado, Encantado, Amedrontado, Paralisado, Atordoado, Exausto, Caído, Impedido.',
      },
      {
        nome: 'Resistências',
        desc: 'Fogo; Concussão, Perfurante e Cortante de ataques mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Necrótico',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Celestial',
      },
      {
        nome: 'Torso de marfim',
        desc: 'Vasuki ostenta uma silhueta bípede imperial com uma cauda longa e musculosa coberta por escamas de ouro fino. Todo o seu torso frontal (peitorais largos, flancos e o abdômen perfeitamente trincado) é composto por uma pele nua, lisa e de um tom branco-marfim. Veias de mana dourado-neon pulsam intensamente por seus braços nus e clavículas, enquanto o suor ferve em sua musculatura exposta, evaporando em um vapor de incenso dourado que desenha cada feixe de sua anatomia atlética e provocativa. Qualquer ataque físico focado em sua frente ignora suas defesas ópticas, reduzindo a CA do monstro para 16 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 25 de dano radiante automático pelo calor herético e deve passar numa RES de Constituição (CD 24) ou ficará sob a condição Cegado por 1 rodada.',
      },
      {
        nome: 'Edito do ricochete',
        desc: 'Vasuki reescreve as leis da causalidade no campo de batalha através de decretos falados. Sempre que um jogador realizar uma ação ativa que não seja de elemento Sagrado ou de cura pura (como desferir um ataque físico convencional, disparar armas mundanas ou conjurar feitiçaria elemental comum), a própria realidade pune a ousadia do herói. O jogador sofre 18 (4d8) de dano radiante reflexivo imediatamente após concluir sua ação.',
      },
      {
        nome: 'Auréola viva',
        desc: 'A nuca de Vasuki se expande em uma gola de cobra-rei que flutua como uma auréola viva de luz sólida. Essa estrutura projeta uma barreira conceitual que impede que o monstro seja alvo de magias de nível 5 ou inferior, a menos que ele decida permitir. Além disso, magias de dissipação ou contra-feitiços lançados pelos jogadores contra Vasuki falham automaticamente.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'Vasuki realiza três ataques: duas bofetadas de Palma Impura e um açoitamento de Cauda de Ouro Fino, ou utiliza sua ação para ditar o Anátema Absoluto.',
      },
      {
        nome: 'Palma impura',
        desc: 'Ataque Corpo a Corpo Mágico: +16 para acertar, alcance 3 metros. Dano: 20 (3d6 + 10) de dano de Força mais 14 (4d6) de dano psíquico. O impacto sobrecarrega a mente do alvo, forçando uma RES de Inteligência (CD 24) para não perder o uso de sua habilidade de classe de maior nível por 1 rodada.',
      },
      {
        nome: 'Cauda de ouro fino',
        desc: 'Ataque Corpo a Corpo Físico: +14 para acertar, alcance 4 metros. Dano: 22 (4d8 + 4) de dano de concussão. Se o alvo for uma criatura de tamanho Grande ou menor, ele é arremessado 6 metros para trás e fica Caído.',
      },
      {
        nome: 'Anátoma absoluto (Recarga 5T)',
        desc: 'Vasuki profere um decreto herético em tom arrogante e reverberante que joga um pânico imediato na mesa. Todos os buffs arcanos, poções, elixires, melhorias de atributos e proteções mágicas ativas em todos os jogadores a até 30 metros são instantaneamente banidos e dissipados. Cada jogador que teve pelo menos uma melhoria removida sofre 31 (7d8) de dano psíquico imediato pelo choque da ruptura mágica.',
      },
      {
        nome: 'Decreto de transpiração',
        desc: 'Vasuki faz o incenso dourado de seu suor ferver. Todos os jogadores a até 6 metros dele devem passar numa RES de Constituição (CD 24) ou sofrerão 13 (2d12) de dano radiante pela inalação do vapor místico.',
      },
      {
        nome: 'Chicote celestial',
        desc: 'Vasuki realiza um ataque de Cauda de Ouro Fino contra uma criatura ao seu alcance.',
      },
      {
        nome: 'Inversão de fluxo (2 ações)',
        desc: 'Vasuki escolhe um jogador que recuperou Pontos de Vida nesta rodada. O alvo deve passar numa RES de Carisma (CD 24) ou toda a cura recebida naquela rodada é instantaneamente convertida em dano radiante de igual valor.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '16',
      visaoEscuro: 'Visão Verdadeira 36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Coroa da Auréola de Luz Sólida',
      },
      {
        range: '2',
        item: 'Amostra de Incenso de Ouro Evaporado',
      },
      {
        range: '3',
        item: 'Escama de Ouro Fino Imperial',
      },
      {
        range: '4',
        item: 'Fragmento de Clavícula de Marfim',
      },
    ],
  },
  salamancerNecrotico: {
    name: 'Salamancer (Necrótico)',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/ekDORJZ.png',
    image: 'https://2img.net/i.imgur.com/7XLpotQ.jpeg',
    subtitle: 'CR1',
    description: `O comportamento do Salamancer Necrótico é definido pela paciência cruel e por uma covardia tática altamente funcional. Ele evita o confronto direto com guerreiros saudáveis ou em plena prontidão de combate. Em vez disso, o monstro esconde-se na lama e na água parada, aguardando pacientemente que o grupo de aventureiros seja enfraquecido por outras ameaças do cenário ou que algum herói se isole do restante da comitiva.

Sua conduta de caça é baseada no rancor e no assédio constante. Quando decide atacar, o Salamancer age de forma extremamente agressiva e rápida, desferindo botes rápidos e recuando imediatamente para a segurança do terreno úmido. Ele demonstra um instinto quase sádico ao focar suas ações contra alvos que já demonstram fadiga ou ferimentos, utilizando seu sopro poluído para cortar qualquer esperança de salvação e quebrar o moral dos sobreviventes.`,
    type: 'Monstro Pequeno, Draco',
    ac: '13',
    hp: '27 (5d6 + 10)',
    speed: '9 metros, natação 9 metros.',
    stats: {
      forca: '12 (+1)',
      destreza: '14 (+2)',
      constituicao: '14 (+2)',
      inteligencia: '10 (+0)',
      sabedoria: '12 (+1)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Salamancer Necrótico for alvo de dano Necrótico, ele não sofre dano. Em vez disso, a energia profana reconstitui seus tecidos, fazendo-o recuperar 5 Pontos de Vida.',
      },
      {
        nome: 'Imunidade',
        desc: 'Necrótico',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Radiante',
      },
      {
        nome: 'Bile Cadavérica',
        desc: ' A pele nua e viscosa desta salamandra secreta uma substância escura e corrosiva. Sempre que uma criatura atingir o Salamancer com um ataque corpo a corpo a até 1 metro de distância, a bile espirra, causando 2 de dano necrótico automático ao atacante.',
      },
      {
        nome: 'Umidade Profana',
        desc: 'O Salamancer prospera em ambientes lamacentos, pântanos e águas paradas. Enquanto estiver submerso ou em terreno úmido, ele ganha vantagem em testes de Furtividade e recupera 2 Pontos de Vida no início de seu turno, desde que tenha pelo menos 1 PV.',
      },
    ],
    acoes: [
      {
        nome: 'Mordida Tóxica',
        desc: 'Ataque Corpo a Corpo Físico: +4 para acertar, alcance 1m. Dano: 4 (1d4 + 2) de dano perfurante mais 3 (1d6) de dano necrótico.',
      },
      {
        nome: 'Sopro de cinzas (Recarga 5T)',
        desc: 'O Salamancer expele uma nuvem de fumaça cinzenta e putrefata em um cone de 4 metros. Cada criatura na área deve fazer uma RES de Constituição (CD 12).  Falha: Sofre 7 (2d6) de dano necrótico e não pode recuperar Pontos de Vida por qualquer meio até o início do próximo turno do Salamancer.  Sucesso: Metade do dano e sem bloqueio de cura.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Vesícula de Bile Negra',
      },
      {
        range: '2',
        item: 'Cauda Regenerativa Podre',
      },
      {
        range: '3',
        item: 'Glândula de Cinzas Decompostas',
      },
      {
        range: '4',
        item: 'Par de Presas Infectadas',
      },
    ],
  },
  ammit: {
    name: 'Ammit',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/b1VnYdT.png',
    image: 'https://2img.net/i.imgur.com/FBhhh3M.jpeg',
    subtitle: 'CR5',
    description: `O comportamento do Ammit é definido por uma paciência cruel e uma metodologia de caça extremamente sádica. O monstro ignora os padrões caóticos de feras menores que atacam o alvo mais próximo. Em vez disso, ele possui uma percepção extra-sensorial voltada para a debilidade, estabelecendo uma hierarquia de execução clara no campo de batalha: seus olhos ignoram completamente os guerreiros saudáveis para focar com exclusividade nos combatentes debilitados, feridos ou psicologicamente abalados.

Sua conduta é baseada no terror psicológico e na perseguição implacável. O Ammit avança com passos pesados e deliberados, utilizando sua presença opressiva para quebrar o moral da vanguarda. Ele demonstra um prazer biológico ao encurralar suas presas, agindo com a frieza de um carrasco do submundo que sabe exatamente quando a linha de defesa do grupo está prestes a colapsar, intensificando seus botes à medida que o vigor dos heróis se esvai.`,
    type: 'Monstro Grande, Draco',
    ac: '15',
    hp: '+90 (12d10 + 24)',
    speed: '12 metros, natação 12 metros',
    stats: {
      forca: '18 (+4)',
      destreza: '14 (+2)',
      constituicao: '15 (+2)',
      inteligencia: '5 (-3)',
      sabedoria: '14 (+2)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Ammit for alvo de dano Necrótico, ele não sofre dano. Em vez disso, a energia profana reconstitui seus tecidos musculares, fazendo-o recuperar 15 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'necrótico',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Radiante',
      },
      {
        nome: 'Anatomia da carnificina',
        desc: 'O Ammit possui uma silhueta quadrúpede atarracada e extremamente forte. Placas de osso calcinado e quebrado cobrem suas costas protetoras. No entanto, todo o seu pescoço, o peitoral largo e o abdômen trincado ao extremo são feitos de pele totalmente nua, lisa e de um tom roxo-acinzentado. A musculatura frontal é assustadoramente rasgada, exibindo veias negras e grossas que pulsam com sangue corrupto. O suor frio escorre por sua carne viva e brilha sob a luz sombria, destacando cada fibra de sua anatomia de predadora de forma agressiva. Qualquer ataque físico focado diretamente em sua frente ignora as placas traseiras, reduzindo a CA do monstro para 11 contra aquele golpe específico. No entanto, o atacante corpo a corpo que o atingir pela frente sofre 4 (1d8) de dano necrótico pelo respingo do suor gélido e sangue corrupto.',
      },
      {
        nome: 'Faro do ocaso',
        desc: 'O Ammit possui um instinto assassino refinado para detectar a fraqueza. Ele ganha vantagem em todas as jogadas de ataque contra qualquer criatura que esteja com menos da metade de seus Pontos de Vida máximos.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Ammit realiza dois ataques: uma Mordida Prensa e uma Patada Dilaceradora.',
      },
      {
        nome: 'Mordida Prensa',
        desc: 'Ataque Corpo a Corpo Físico: +7 para acertar, alcance 1 metros. Dano: 11 (2d6 + 4) de dano perfurante mais 4 (1d8) de dano necrótico. O alvo deve passar numa RES de Constituição (CD 14). Se falhar, contrai o status Murchar (Sap) por 1 minuto. No início de cada um de seus turnos, o jogador sob o status Murchar sofre 4 (1d8) de dano necrótico automático, e o Ammit drena essa força vital, recuperando a mesma quantidade de Pontos de Vida. O alvo pode repetir o teste de resistência no final de seus turnos para encerrar o efeito.',
      },
      {
        nome: 'Patada dilaceradora',
        desc: 'Ataque Corpo a Corpo Físico: +7 para acertar, alcance 1 metros. Dano: 9 (1d10 + 4) de dano cortante. O impacto rasga os tecidos e empurra o alvo 3 metros para trás caso ele seja de tamanho Médio ou menor.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Mandíbula de Crocodilo do Submundo',
      },
      {
        range: '2',
        item: 'Placa de Osso Calcinado Inteira',
      },
      {
        range: '3',
        item: 'Fragmento de Carne Roxo-Acinzentada',
      },
      {
        range: '4',
        item: 'Frasco de Sangue Corrupto Pulsante',
      },
    ],
  },
  ninkiNanka: {
    name: 'Ninki Nanka',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/5JuOn7A.png',
    image: 'https://2img.net/i.imgur.com/ayhDdSk.jpeg',
    subtitle: 'CR10',
    description: `A atitude do Ninki Nanka em combate é governada por uma perversidade tática fria e extremamente insistente. Ele não demonstra a pressa cega dos predadores famintos; ele opera através do cerco e do asfixiamento biológico do grupo. O monstro move-se de forma sinuosa, escolhendo deliberadamente caminhos que cortem as rotas de fuga dos aventureiros, contaminando o solo a cada investida para limitar o espaço de manobra da vanguarda.

Sua conduta psicológica é profundamente sádica. O Ninki Nanka possui a capacidade instintiva de reconhecer os elos de suporte do grupo de caça. Ele foca suas agressões físicas nos guerreiros da linha de frente com o objetivo claro de infectá-los com sua peste, deliciando-se ao assistir os curandeiros e magos da retaguarda entrarem em desespero ao perceberem que suas preces de cura e poções de regeneração estão, na verdade, apodrecendo e matando os próprios aliados.`,
    type: 'Monstro Grande, Draco',
    ac: '18',
    hp: '+161 (17d10 + 68)',
    speed: '12 metros, natação 12 metros.',
    stats: {
      forca: '22 (+6)',
      destreza: '16 (+3)',
      constituicao: '18 (+4)',
      inteligencia: '6 (-2)',
      sabedoria: '14 (+2)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Ninki Nanka for alvo de dano Necrótico, ele não sofre dano. Em vez disso, a energia cadavérica costura sua carne viva, fazendo-o recuperar 25 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Necrótico, Veneno, Envenenado, Exausto, Paralisado',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Radiante',
      },
      {
        nome: 'Carne Pesteada',
        desc: 'O Ninki Nanka exibe uma silhueta longa, anfíbia e assustadoramente musculosa. Ele perdeu completamente as escamas em toda a metade frontal. O peito largo, os peitorais e o abdômen trincados ao extremo são compostos de carne viva exposta em um tom roxo-escuro e pálido. Veias grossas e negras pulsam intensamente por suas clavículas, enquanto o suor frio e oleoso escorre por sua musculatura vascularizada, evaporando em um miasma cinzento constante. Qualquer ataque físico focado diretamente em sua frente ignora sua couraça traseira, reduzindo a CA do monstro para 13 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 9 (2d8) de dano necrótico automático pelo vapor tóxico da carne exposta.',
      },
      {
        nome: 'Rastro de podridão',
        desc: 'Sempre que o Ninki Nanka atingir um herói com qualquer ataque físico, ele espalha instantaneamente uma poça de lodo corrupto com 1 metros de raio no chão sob o alvo.',
      },
      {
        nome: 'Contágio Zumbi',
        desc: 'Qualquer jogador que iniciar seu turno ou entrar na área do lodo corrupto deve passar numa RES de Constituição (CD 19) ou receberá o status Zumbi por 1 minuto. Enquanto estiver sob o status Zumbi, o organismo do herói é invertido: qualquer feitiço de cura, poção ou efeito de suporte que deveria recuperar Pontos de Vida causa dano necrótico de igual valor ao personagem. O alvo pode repetir o teste no final de seus turnos para limpar a infecção.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Ninki Nanka realiza três ataques: uma Mordida Putrefata e duas Garras Infecciosas.',
      },
      {
        nome: 'Mordida putrefata',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 2 metros. Dano: 15 (2d8 + 6) de dano perfurante mais 7 (2d6) de dano necrótico. O alvo deve passar numa RES de Constituição (CD 19) ou seus tecidos musculares começam a apodrecer, sofrendo desvantagem em todas as jogadas de ataque físico por 1 rodada.',
      },
      {
        nome: 'Garras infecciosas',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 2 metros. Dano: 13 (2d6 + 6) de dano cortante mais 4 (1d8) de dano necrótico. Ativa a habilidade Rastro da Podridão no solo do alvo.',
      },
      {
        nome: 'Sopro de miasma (Recarga 5T)',
        desc: 'O monstro expele um jato de fumaça cinzenta e densa em um cone de 9 metros. Cada criatura na área deve fazer uma RES de Constituição (CD 19). Falha: Sofre 36 (8d8) de dano necrótico e fica sob a condição Cegado por 1 rodada devido à queimação ocular da peste. Sucesso: Metade do dano e evita a cegueira.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Coração de Carne Viva Roxo-Escuro',
      },
      {
        range: '2',
        item: 'Glândula de Lodo Infeccioso',
      },
      {
        range: '3',
        item: 'Couro Anfíbio Desprovido de Escamas',
      },
      {
        range: '4',
        item: 'Presa Espessa do Ocaso',
      },
    ],
  },
  guivre: {
    name: 'Guivre',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/r5DgXvH.png',
    image: 'https://2img.net/i.imgur.com/rXX2Z3a.jpeg',
    subtitle: 'CR15',
    description: `O comportamento da Guivre é pautado por uma malevolência fria, calculada e extremamente punitiva. Ao contrário de predadores comuns que se frustram ou se cansam ao enfrentar adversários ágeis, este monstro sente um prazer instintivo em caçar justamente os alvos que tentam ser evasivos. A Guivre demonstra uma intolerância absoluta contra heróis que utilizam saltos, acrobacias ou magias de deslocamento rápido; sua conduta muda instantaneamente para uma fúria focada ao detectar qualquer tentativa de esquiva, antecipando as trajetórias de fuga com botes implacáveis para esmagar a mobilidade do grupo.

Sua postura psicológica baseia-se na certeza do sufocamento. A Guivre opera com a consciência de que o tempo é seu maior aliado. Ela exala um hálito tão pestilento que sabota a vitalidade do ar ao seu redor, adotando uma atitude passiva e arrogante onde ela simplesmente observa as forças dos heróis murcharem sob sua proximidade. Ela não demonstra pressa em desferir golpes fatais logo no início, preferindo assistir a decadência gradual da vanguarda até que a resistência dos guerreiros colapse por completo.`,
    type: 'Monstro Enorme, Draco',
    ac: '22',
    hp: '+241 (22d12 + 98)',
    speed: '12 metros, natação 12 metros',
    stats: {
      forca: '24 (+7)',
      destreza: '20 (+5)',
      constituicao: '20 (+5)',
      inteligencia: '6 (-2)',
      sabedoria: '16 (+3)',
      carisma: '12 (+1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Guivre for alvo de dano Necrótico, ela não sofre dano. Em vez disso, a energia cadavérica costura instantaneamente seus tecidos musculares expostos, fazendo-o recuperar 35 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Necrótico, Veneno, Envenenado, Exausto, Paralisado, Impedido, Caído',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Ácido; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Radiante',
      },
      {
        nome: 'Derme da erosão exposta',
        desc: 'A Guivre ostenta uma silhueta longa, musculosa e de traços reptilianos ferozes. Ela não possui nenhuma escama na metade frontal do corpo. Todo o peito largo, os peitorais e o abdômen trincados ao extremo são de pura carne viva e lisa em um tom roxo-acinzentado pálido. Veias grossas e escuras saltam por suas clavículas e braços nus, mostrando a circulação ativa do fluido necrótico. O suor frio escorre em cascata por suas linhas abdominais perfeitamente desenhadas, brilhando sob a névoa escura que emana de sua pele nua de forma agressiva e provocativa. Qualquer ataque físico focado diretamente em sua frente ignora sua couraça traseira, reduzindo a CA do monstro para 14 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 14 de dano necrótico automático pelo refluxo do suor pestilento.',
      },
      {
        nome: 'Caçadora de reflexos',
        desc: 'A Guivre antecipa e pune os alvos que dependem de agilidade para escapar da morte. Sempre que um jogador tentar usar uma habilidade de esquiva, reação de movimento ou se mover para fora de seu alcance de engajamento, a Guivre ganha vantagem imediata em seu próximo ataque contra essa criatura e seu alcance de bote aumenta em 1 metros na rodada.',
      },
      {
        nome: 'Hálito da secura',
        desc: 'A mera presença física da Guivre exala um ar de decadência que drena a vitalidade do ambiente, simulando o hálito lendário que secava plantações inteiras. No início do turno de cada jogador a até 9 metros da criatura, o herói deve passar numa RES de Constituição (CD 21) ou sofrerá 9 de dano necrótico que não pode ser mitigado por escudos arcanos comuns.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Guivre realiza três ataques: uma Mordida Corrosiva e duas Chicotadas de Miasma.',
      },
      {
        nome: 'Mordida corrosiva',
        desc: 'Ataque Corpo a Corpo Físico: +12 para acertar, alcance 3 metros. Dano: 20 (3d8 + 7) de dano perfurante mais 10 (3d6) de dano necrótico. O alvo deve passar numa RES de Constituição (CD 21). Se falhar, contrai a Praga de Erosão. O herói perde 5% de seus Pontos de Vida Máximos permanentemente a cada rodada até o fim do combate, e o dano sofrido por essa perda cura a Guivre no mesmo valor.',
      },
      {
        nome: 'Chicotada de miasma',
        desc: 'Ataque Corpo a Corpo Físico: +12 para acertar, alcance 4 metros. Dano: 16 (2d8 + 7) de dano de concussão mais 7 (2d6) de dano necrótico. Se o alvo estiver sob o efeito da Praga de Erosão, ele é derrubado e recebe a condição Caído instantaneamente devido ao colapso muscular.',
      },
      {
        nome: 'Eflúvio pestilento (Recarga 5T)',
        desc: 'A Guivre expele uma lufada de fumaça podre e cinzenta em um cone de 12 metros. Cada criatura na área deve fazer uma RES de Constituição (CD 21). Falha: Sofre 45 (10d8) de dano necrótico e tem seus Pontos de Vida Máximos reduzidos pela metade até o fim do combate. Sucesso: Metade do dano e evita a redução de vida máxima.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Presa Pestilenta da Erosão',
      },
      {
        range: '2',
        item: 'Amostra de Suor Roxo-Acinzentado',
      },
      {
        range: '3',
        item: 'Glândula do Hálito Letal',
      },
      {
        range: '4',
        item: 'Fragmento de Tecido Vascularizado Escuro',
      },
    ],
  },
  apep: {
    name: 'Apep',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/dNrnprj.png',
    image: 'https://2img.net/i.imgur.com/XcRsv6P.jpeg',
    subtitle: 'CR20',
    description: `O comportamento de Apep em batalha é pautado por uma soberania esmagadora, uma malevolência cósmica e um sadismo silencioso. A criatura não demonstra raiva, pressa ou qualquer traço de selvageria irracional; ela age com a certeza matemática de que sua mera presença física é o suficiente para corromper a existência dos mortais. O monstro se move com uma lentidão calculada e imponente, arrastando o peso de sua escuridão pelo cenário enquanto observa o desespero dos heróis com um desdém absoluto.

Sua conduta psicológica visa a total desestruturação das leis de sobrevivência do grupo. Apep sente um prazer tirânico ao inverter as forças dos jogadores, sabotando a própria realidade para que o ar se torne irrespirável e a esperança se transforme em veneno. Ele adota uma postura de total isolamento tático, gerando um campo de necrose que engole o cenário e força o grupo a lutar às cegas, quebrando o moral e a coordenação dos defensores ao demonstrar que suas maiores virtudes e rezas não têm poder sob o seu domínio.`,
    type: 'Monstro Colossal, Draco',
    ac: '25',
    hp: '+462 (28d20 + 168)',
    speed: '12 metros, natação 12 metros, escavação 12 metros',
    stats: {
      forca: '28 (+9)',
      destreza: '18 (+4)',
      constituicao: '26 (+8)',
      inteligencia: '6 (-2)',
      sabedoria: '18 (+4)',
      carisma: '12 (+1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que Apep for alvo de dano Necrótico ou de Veneno, ele não sofre dano. A podridão regenera sua derme, fazendo-o recuperar 50 Pontos de Vida imediatamente.',
      },
      {
        nome: 'Imunidade',
        desc: 'Necrótico, Veneno, Ácido, Cegado, Encantado, Amedrontado, Paralisado, Atordoado, Exausto, Caído, Impedido, Envenenado',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Gelo, Força; Concussão, Perfurante e Cortante de ataques mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Radiante',
      },
      {
        nome: 'Nudez dominante',
        desc: 'Apep ostenta uma silhueta serpentina de longos espirais musculares e braços dianteiros fortes. Sem carapaça ou escamas em toda a metade frontal, ele exibe uma nudez imponente. Sua pele é de tom cinza-chumbo, áspera e totalmente desprovida de gordura. O suor oleoso e escuro escorre por seus peitorais largos e linhas pélvicas expostas, brilhando intensamente sob a luz sombria e destacando a crueza de seus feixes de carne se contraindo com precisão. Qualquer ataque físico focado em sua frente ignora sua couraça traseira, reduzindo a CA do monstro para 16 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 25 de dano necrótico automático pelo respingo do suor oleoso e corrupto.',
      },
      {
        nome: 'Véu do sol',
        desc: 'O corpo de Apep gera um campo permanente de escuridão necrótica em um raio de 9 metros ao seu redor. Nenhuma luz mágica de nível 5 ou inferior pode iluminar esta área. Qualquer criatura dentro desse raio recebe o status Zumbi: todo e qualquer efeito de cura mágica, poção ou regeneração é bloqueado e convertido em dano necrótico de igual valor.',
      },
      {
        nome: 'Sentença do coração murcho',
        desc: 'O miasma de Apep impõe um cronômetro biológico implacável. Qualquer jogador que iniciar seu turno dentro do Véu do Sol Extinto recebe acúmulos de Condenação. Ao atingir 3 acúmulos (3 rodadas na área), o coração do herói sofre um colapso molecular instantâneo, reduzindo seus Pontos de Vida a 0. Para interromper a sentença e zerar os acúmulos de Condenação de todo o grupo, os jogadores devem quebrar a postura do monstro causando um mínimo de 120 pontos de dano a Apep em uma única rodada. Isso atordoa a fera até o início de seu próximo turno.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'Apep realiza três ataques: duas Garras de Osso Preto e uma Fauce do Submundo',
      },
      {
        nome: 'Garras de Ossos',
        desc: 'Ataque Corpo a Corpo Físico: +15 para acertar, alcance 3 metros. Dano: 22 (3d8 + 9) de dano cortante mais 14 (4d6) de dano necrótico. O impacto dilacera a carne protetora e reduz o deslocamento do alvo pela metade na próxima rodada.',
      },
      {
        nome: 'Fauce do submundo',
        desc: 'Ataque Corpo a Corpo Físico: +15 para acertar, alcance 4 metros. Dano: 27 (4d8 + 9) de dano perfurante mais 18 (4d8) de dano necrótico. Se o alvo for uma criatura de tamanho Grande ou menor, ele fica Agarrado (CD 23 para escapar). Enquanto estiver agarrado, o alvo sofre o dano da mordida automaticamente no início dos turnos de Apep.',
      },
      {
        nome: 'Sopro do eclipse primordial (Recarga 5T)',
        desc: 'Apep expele uma rajada de escuridão absoluta e decomposição gasosa em um cone de 18 metros. Cada criatura na área deve fazer uma RES de Constituição (CD 22). Falha: Sofre 63 (14d8) de dano necrótico e recebe 1 acúmulo imediato da habilidade Sentença do Coração Murcho. Sucesso: Metade do dano e evita o acúmulo extra.',
      },
      {
        nome: 'Esmagamento por espirais',
        desc: 'Apep violenta o solo com sua cauda serpentina. Cada criatura a até 4 metros dele deve passar numa RES de Destreza (CD 23) ou sofrerá 16 (2d6 + 9) de dano de concussão e ficará sob a condição Caído.',
      },
      {
        nome: 'Pulsação macabra',
        desc: 'O monstro faz o suor oleoso de seu peito ferver, expandindo o miasma. Um jogador à escolha dentro do Véu do Sol Extinto deve passar numa RES de Sabedoria (CD 22) ou ficará sob a condição Amedrontado por 1 rodada.',
      },
      {
        nome: 'Aceleração celular (2 ações)',
        desc: 'Apep foca seu olhar caótico em um herói que já possua ao menos 1 acúmulo de Condenação. O alvo deve realizar uma RES de Constituição (CD 22). Se falhar, a necrose avança e ele recebe 1 acúmulo adicional de Condenação imediatamente.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: '60 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Presa do Sol Engolido',
      },
      {
        range: '2',
        item: 'Couro de Cinza-Chumbo Imperial',
      },
      {
        range: '3',
        item: 'Glândula do Eclipse Biológico',
      },
      {
        range: '4',
        item: 'Coração do Caos Primordial',
      },
    ],
  },
  necrisMalofiz: {
    name: 'Necris Malofiz',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/UvYqngW.png',
    image: 'https://2img.net/i.imgur.com/B0K9YJ6.jpeg',
    subtitle: 'CR5',
    description: `A conduta da Necris Malofiz em batalha é marcada por uma arrogância silenciosa e uma paciência sádica. Ela se move de forma ereta e majestosa, mas sem pressa, caminhando entre os combatentes com um desdém absoluto por suas armas. A criatura passa o combate inteiro recitando encantamentos em sussurros sibilantes e constantes. Essa fala não serve apenas para moldar o mana sombrio, mas para exercer uma opressão psicológica contínua, fazendo com que suas palavras penetrem na mente dos seres vivos como agulhas.

Ela monitora o uso de habilidades na arena e foca seus sortilégios nos guerreiros mais ativos, aplicando maldições que prolongam os tempos de reuso de suas técnicas e drenam sua vitalidade a cada segundo. Sua postura é de total dominação: ela adota uma atitude defensiva preditiva, antecipando as reações do grupo e forçando os seres vivos a escolherem entre gastar seus recursos sofrendo retaliações ou permanecerem estáticos enquanto sua vida se esvai.`,
    type: 'Monstro Médio (Humanoide Reptiliano)',
    ac: '15',
    hp: '+82 (11d8 + 33)',
    speed: '9 metros.',
    stats: {
      forca: '10 (+0)',
      destreza: '14 (+2)',
      constituicao: '16 (+3)',
      inteligencia: '20 (+5)',
      sabedoria: '14 (+2)',
      carisma: '12 (+1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Necris Malofiz for alvo de dano Necrótico, ele não sofre dano. Em vez disso, a energia profana reconstitui seus tecidos, fazendo-o recuperar 15 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Necrótico, Envenenado',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Radiante',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Dracônico',
      },
      {
        nome: 'Anatomia Sacrílega',
        desc: 'O Necris Malofiz ostenta uma postura ereta, esguia e majestosa, mantendo uma longa cauda reptiliana que arrasta pelo chão e olhos em fenda que brilham em um violeta doentio. Ele não usa roupas ou armaduras. Todo o seu peito largo, os peitorais definidos e o abdômen perfeitamente trincado são de pele totalmente nua e lisa, em um tom roxo-acinzentado muito pálido. Veias grossas e negras pulsam com sangue corrupto diretamente em sua carne viva. O suor frio escorre por sua musculatura hiper-definida, brilhando sob a luz sombria. Qualquer ataque físico focado diretamente em sua frente ignora suas defesas preditivas, reduzindo a CA do monstro para 11 contra aquele golpe específico. No entanto, o atacante corpo a corpo que o atingir pela frente sofre 4 (1d8) de dano necrótico devido ao magnetismo herético de seu sangue exposto.',
      },
      {
        nome: 'Gatilho sibilante',
        desc: 'A fala do Necris Malofiz flui em sussurros constantes. Ele é imune a efeitos de silêncio mundanos e adiciona seu modificador de Inteligência (+5) em seus testes para manter a concentração de seus feitiços de debuff.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Necris Malofiz realiza um ataque de Toque Decadente e utiliza uma de suas Heresias Faladas.',
      },
      {
        nome: 'Toque decadente',
        desc: 'Ataque Corpo a Corpo Mágico: +8 para acertar, alcance 1 metros. Dano: 7 (1d4 + 5) de dano psíquico mais 9 (2d6) de dano necrótico.',
      },
      {
        nome: 'Anátema do vazio',
        desc: 'O monstro profere uma sentença sibilante contra um jogador a até 18 metros. O alvo deve passar numa RES de Sabedoria (CD 16). Se falhar, recebe o status Curse (Maldição) por 1 minuto. Enquanto estiver amaldiçoado, a próxima habilidade marcial, técnica ou feitiço que o jogador utilizar que possua tempo de recarga terá essa recarga prolongada em 1 rodada extra, além de sofrer 4 (1d8) de dano necrótico no início de cada um de seus turnos. O alvo pode repetir a RES no final de seus turnos para encerrar o efeito.',
      },
      {
        nome: 'Manta obliterador (Recarga 5T)',
        desc: 'O Necris foca seus olhos violetas em uma criatura a até 18 metros e dita o murchar de sua carne. O alvo deve passar numa RES de Constituição (CD 16). Falha: Recebe o status Sap. O jogador perde 7 (2d6) de dano necrótico automático no início de cada um de seus turnos, e o Necris Malofiz absorve essa essência, recuperando a mesma quantidade de Pontos de Vida. O efeito dura 1 minuto e a RES pode ser repetida no fim dos turnos do alvo. Sucesso: Sofre apenas 7 (2d6) de dano necrótico imediato e evita o status contínuo.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Fragmento de Presa Violeta',
      },
      {
        range: '2',
        item: 'Amostra de Epiderme Pálida',
      },
      {
        range: '3',
        item: 'Frasco de Sangue Corrupto Coagulado',
      },
      {
        range: '4',
        item: 'Essência do Incenso Sibilante',
      },
    ],
  },
  zmey: {
    name: 'Zmey',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/fX0Vub7.png',
    image: 'https://2img.net/i.imgur.com/hRBDlKM.jpeg',
    subtitle: 'CR10',
    description: `A conduta da Zmey em batalha é ditada por uma calma gélida e uma pose de realeza tirânica. Ela caminha entre os destroços com passos medidos, arrastando sua longa cauda com total indiferença às armas adversárias. O comportamento desta criatura baseia-se na humilhação sistemática de magos e conjuradores. Em vez de manifestar magias elementais comuns, ela utiliza sussurros de alta frequência que distorcem o ar e quebram as barreiras místicas naturais das mentes mais treinadas.

Sua maior perversidade reside na capacidade de projetar filamentos acinzentados diretamente no núcleo de energia de seus oponentes. Através dessa conexão parasitária, a Zmey drena a reserva mágica das vítimas à distância, canalizando esse éter roubado para manifestar uma barreira flutuante de almas agonizantes ao redor de seu corpo. Essa atitude cria um ciclo desesperador: quanto mais magias são lançadas contra ela, mais energia ela extrai para anular por completo qualquer investida física ou corte de espada direcionado à sua carne viva, assistindo com deboche enquanto as frentes de ataque se esgotam.`,
    type: 'Monstro Grande (Humanoide Reptiliano)',
    ac: '18',
    hp: '+152 (16d10 + 64)',
    speed: '12 metros',
    stats: {
      forca: '12 (+1)',
      destreza: '18 (+4)',
      constituicao: '18 (+4)',
      inteligencia: '24 (+7)',
      sabedoria: '16 (+3)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Zmey for alvo de dano Necrótico, ela não sofre dano. Em vez disso, a podridão reconecta suas células, fazendo-a recuperar 25 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Necrótico, Veneno, Envenenado, Encantado, Silenciado',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Radiante',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Dracônico, Alta Frequência Sibilante',
      },
      {
        nome: 'Tensão corpórea',
        desc: 'A Zmey ostenta uma fisionomia bípede imponente e de postura aristocrática cruel. Seu rosto feminino é marcado por deformidades assimétricas e cicatrizes profundas, com olhos em fenda que brilham em um violeta doentio. Ela veste apenas uma capa de seda antiga esfarrapada e totalmente aberta na frente, mantendo todo o peitoral largo e o abdômen esculpidos à faca completamente expostos. Sua pele frontal é em carne viva cinza-chumbo, superaquecida pela voltagem de seu núcleo necrótico. Quando ela dita uma sentença, os feixes de carne de seu torso se contraem tanto que desenham cada fibra de sua anatomia atlética, criando um brilho úmido e dominante. Qualquer ataque físico focado diretamente em sua frente ignora sua capa, reduzindo a CA do monstro para 13 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 9 de dano necrótico automático pelo calor reativo de sua carne viva.',
      },
      {
        nome: 'Anatomia da sobrecarga',
        desc: 'O suor oleoso e escuro que ferve no torso exposto da Zmey atua como um condutor de feitiçaria. Sempre que a criatura sofrer dano físico vindo de armas mágicas, ela converte o impacto em estamina mental, ganhando vantagem em seu próximo teste de resistência para manter a concentração de seus feitiços.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Zmey realiza dois ataques de Garras Sombrias e utiliza seu Filamento Cinzento.',
      },
      {
        nome: 'Garras sombrias',
        desc: 'Ataque Corpo a Corpo Físico: +8 para acertar, alcance 2 metros. Dano: 11 (2d6 + 4) de dano cortante mais 7 (2d6) de dano necrótico.',
      },
      {
        nome: 'Filamento cinzento',
        desc: 'A Zmey emite um sussurro de alta frequência que quebra a barreira mística dos jogadores e projeta linhas de energia acinzentada em até dois conjuradores a até 18 metros. Cada alvo deve passar numa RES de Inteligência (CD 19). Falha: O jogador perde 30 Pontos de Mana (MP) imediatamente. A Zmey absorve essa energia e gera uma Barreira de Almas com 30 Pontos de Vida Temporários. Enquanto essa barreira estiver ativa, ela absorve 100% de qualquer dano físico subsequente recebido pela Zmey. Os pontos da barreira são cumulativos até um máximo de 90 PV. Sucesso: O jogador perde apenas 15 MP e a Zmey não ganha a barreira daquele alvo.',
      },
      {
        nome: 'Sopro de éter (Recarga 5T)',
        desc: 'A Zmey expele uma lufada de fumaça cáustica em um cone de 9 metros, murchando a energia do cenário. Cada criatura na área deve fazer uma RES de Constituição (CD 19). Falha: Sofre 35 (10d6) de dano necrótico e entra no status Sap, perdendo 5 MP no início de cada um de seus turnos por 1 minuto. Sucesso: Metade do dano e evita o status contínuo.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Véu de Seda Antiga Esfarrapada',
      },
      {
        range: '2',
        item: 'Fragmento de Núcleo Térmico Cinza',
      },
      {
        range: '3',
        item: 'Glândula de Alta Frequência',
      },
      {
        range: '4',
        item: 'Porção de Suor Oleoso Escuro',
      },
    ],
  },
  aziDahaka: {
    name: 'Azi Dahaka',
    rarity: 'Super Raro',
    icon: 'https://2img.net/i.imgur.com/1UadUao.png',
    image: 'https://2img.net/i.imgur.com/4GPQmA8.jpeg',
    subtitle: 'CR 15',
    description: `A conduta de Azi Dahaka em combate é descrita como uma exibição de tirania fria, silenciosa e cirúrgica. Ela não manifesta a ira caótica das feras irracionais; em vez disso, ela se posiciona na arena com uma imponência aristocrática, observando os combatentes com um desdém absoluto através de suas fendas oculares. A criatura opera através do estrangulamento de recursos, utilizando sussurros heréticos de alta frequência que colapsam a atmosfera e reescrevem o fluxo de energia ao redor.

Sua malícia psicológica foca na subversão da confiança das comitivas de assalto. Azi Dahaka monitora a conjuração de magias e o uso de técnicas de combate na sala, aplicando uma infecção de éter que sabota os canais de mana dos oponentes. Sob sua influência, qualquer esforço marcial ou feitiço consome o dobro de estamina e força vital do executor, provocando um curto-circuito interno que derrete os tecidos da vítima. Ela assiste impassível enquanto as vanguardas mais resistentes definham e se autodesintegram a cada tentativa de reação.`,
    type: 'Monstro Enorme (Humanoide Reptiliano)',
    ac: '22',
    hp: '+241 (22d12 + 98)',
    speed: '12 metros, natação 12 metros.',
    stats: {
      forca: '14 (+2)',
      destreza: '20 (+5)',
      constituicao: '20 (+5)',
      inteligencia: '26 (+8)',
      sabedoria: '18 (+4)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que Azi Dahaka for alvo de dano Necrótico ou de Veneno, ela não sofre dano. A podridão reconecta suas células instantaneamente, fazendo-a recuperar 35 Pontos de Vida.',
      },
      {
        nome: 'Imunidade',
        desc: 'Necrótico, Veneno, Ácido, Envenenado, Encantado, Silenciado, Paralisado.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Gelo; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Radiante',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Dracônico, Alta Frequência Sibilante',
      },
      {
        nome: 'Carne entrópica',
        desc: 'Azi Dahaka exibe uma silhueta bipedal majestosa com chifres de obsidiana. Sua face feminina é marcada por deformidades assimétricas profundas e imperfeições grotescas, com olhos em fenda que brilham em um violeta doentio. Ela rejeita roupas ou armaduras protetoras. Todo o seu peito largo, os peitorais e o abdômen esculpidos à faca são de carne totalmente nua, lisa e de um tom roxo-acinzentado escuro. Veias grossas e negras pulsam com sangue corrupto diretamente por sua carne viva, enquanto o suor frio escorre por suas linhas abdominais, brilhando sob o miasma. Suas costelas escuras ficam visíveis, protegendo um núcleo violeta de pura entropia. Qualquer ataque físico focado diretamente em sua frente ignora defesas preditivas, reduzindo a CA do monstro para 14 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 14 de dano necrótico automático pelo refluxo do suor de entropia.',
      },
      {
        nome: 'Infecção do éter',
        desc: 'Azi Dahaka corrompe o fluxo de energia do ambiente. Sempre que um oponente conjurar uma magia ou ativar uma habilidade marcial a até 18 metros dela, o fluxo entra em curto-circuito interno. O custo de recursos (como Mana, Estamina ou equivalentes) daquela ação é duplicado. Além disso, o executor sofre 9 de dano necrótico imediato que reduz permanentemente os seus Pontos de Vida Máximos na mesma quantidade até o fim do combate.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'Azi Dahaka realiza dois ataques de Garras de Osso Preto e utiliza uma de suas Pragas Faladas.',
      },
      {
        nome: 'Garras de Osso',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 3 metros. Dano: 15 (3d6 + 5) de dano cortante mais 9 de dano necrótico.',
      },
      {
        nome: 'Sussurro de vírus',
        desc: 'Azi Dahaka profere uma sentença de alta frequência em uma área de 6 metros de raio a até 18 metros de distância. Cada criatura na área deve passar numa RES de Inteligência (CD 21). Se falhar, contrai o status Vírus por 1 minuto. Enquanto estiver sob o status Vírus, o alvo não pode receber nenhuma melhoria de atributo, escudos mágicos ou buffs, e qualquer efeito benéfico ativo nele é congelado e anulado. O alvo pode repetir a RES no final de seus turnos.',
      },
      {
        nome: 'Pulsação Bio (Recarga 5T)',
        desc: 'Azi Dahaka dita a decomposição orgânica de um alvo a até 18 metros. O oponente deve passar numa RES de Constituição (CD 21). Falha: Recebe o status Bio. O alvo sofre 18 de dano necrótico automático no início de cada um de seus turnos por 1 minuto. Metade desse dano reduz os Pontos de Vida Máximos do alvo permanentemente até o fim do encontro. A RES pode ser repetida no fim dos turnos do afetado. Sucesso: Sofre apenas 18 de dano necrótico imediato e evita o status contínuo.',
      },
      {
        nome: 'Passo intangível',
        desc: 'O monstro flutua até metade de seu deslocamento sem provocar ataques de oportunidade, deixando um rastro de fumaça violeta.',
      },
      {
        nome: 'Olhar corrosivo',
        desc: 'Azi Dahaka foca sua fenda ocular em um alvo a até 12 metros. O oponente deve passar numa RES de Sabedoria (CD 21) ou sofrerá desvantagem em testes de resistência físicos até o início do próximo turno do monstro.',
      },
      {
        nome: 'Detonação atômica (2 ações)',
        desc: 'O monstro faz o núcleo de entropia em seu peito pulsar. Um alvo que esteja sob o efeito de Vírus ou Bio a até 15 metros sofre instantaneamente 22 de dano necrótico bruto devido à liquefação celular.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: '36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Par de Chifres de Obsidiana Entrópica',
      },
      {
        range: '2',
        item: 'Fragmento do Núcleo Violeta de Entropia',
      },
      {
        range: '3',
        item: 'Amostra de Sangue Corrupto Escuro',
      },
      {
        range: '4',
        item: 'Garra de Osso Preto Pesteada',
      },
    ],
  },
  jormungandr: {
    name: 'Jormungandr',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/56s9bnN.png',
    image: 'https://2img.net/i.imgur.com/16R4rI2.jpeg',
    subtitle: 'CR20',
    description: `A atitude de Jormungandr em batalha é de um desdém absoluto e uma calma aterrorizante. Ela não ruge, não demonstra raiva irracional; ela simplesmente dita sentenças em uma frequência sibilante que reescreve as leis da física ao seu redor. Relatos de batalhas lendárias mencionam que guerreiros equipados com as mais sagradas armaduras sentiram seus equipamentos derreterem como cera assim que entraram em sua presença. O ar ao seu redor torna-se ionizado com o Eiter Primordial, criando uma aura onde todas as defesas físicas e imunidades mágicas são instantaneamente anuladas, deixando os mais bravos defensores expostos e vulneráveis.

Sua conduta psicológica foca na subversão dos sistemas de suporte. Jormungandr compreende o fluxo da magia de cura e o acha ofensivo à sua obra de decomposição. Sua mera presença infecta os ventos arcanos de restauração. Relatos fragmentados alertam para o fato de que qualquer tentativa de usar magia regenerativa em sua proximidade resulta em um desastre biológico: a cura é convertida em um veneno necrótico devastador que não apenas consome o alvo original, mas explode em um choque de peste que se espalha para todos os aliados próximos, transformando a esperança de salvação em uma sentença de morte em cadeia.`,
    type: 'Monstro Colossal (Humanoide Serpentino)',
    ac: '26',
    hp: '+495 (30d20 + 180)',
    speed: '12 metros, natação 12 metros.',
    stats: {
      forca: '26 (+8)',
      destreza: '18 (+4)',
      constituicao: '26 (+8)',
      inteligencia: '30 (+10)',
      sabedoria: '22 (+6)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que Jormungandr for alvo de dano Necrótico ou de Veneno, ela não sofre dano. A podridão reconecta sua estrutura molecular instantaneamente, fazendo-a recuperar 60 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Necrótico, Veneno, Ácido, Psíquico, Cegado, Encantado, Amedrontado, Paralisado, Atordoado, Exausto, Caído, Impedido, Envenenado',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Gelo, Força, Elétrico; Concussão, Perfurante e Cortante de ataques mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Radiante',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Dracônico, Alta Frequência Sibilante',
      },
      {
        nome: 'Nudez dominante',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua couraça traseira, reduzindo a CA do monstro para 16 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 30 de dano necrótico automático pelo respingo do suor fosforescente.',
      },
      {
        nome: 'Atmosfera de Eiter',
        desc: ' O ar ao redor de Jormungandr é ionizado por seu veneno primordial. Ela projeta uma aura passiva permanente com raio de 12 metros. Qualquer oponente que entrar na área ou iniciar seu turno nela sofre o status Quebra Total. Sob este efeito, a Classe de Armadura básica do alvo é reduzida a 10 e todas as suas imunidades e resistências a dano são completamente destruídas enquanto ele permanecer no raio da aura.',
      },
      {
        nome: 'Inversão epidêmica',
        desc: 'O miasma de Jormungandr sabota a magia de cura. Sempre que um oponente dentro da Atmosfera de Eiter receber qualquer efeito de cura mística ou regeneração ativa, o efeito é bloqueado. Toda a cura que seria recebida é convertida em um veneno necrótico instantâneo de igual valor. Esse veneno então explode em um choque de peste em cadeia, saltando e causando o mesmo dano a todos os aliados que estejam a até 3 metros do alvo inicial.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até 3 ações lendárias por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'Jormungandr realiza três ataques: duas Garras de Diamante Negro e uma Fauce do Cataclismo.',
      },
      {
        nome: 'Garras de diamante negro',
        desc: 'Ataque Corpo a Corpo Físico: +14 para acertar, alcance 3 metros. Dano: 24 (3d10 + 8) de dano cortante mais 14 (4d6) de dano necrótico. Os cortes corroem os tendões, aplicando desvantagem em testes de reflexos por 1 rodada.',
      },
      {
        nome: 'Fauce do cataclismo',
        desc: 'Ataque Corpo a Corpo Físico: +14 para acertar, alcance 4 metros. Dano: 30 (4d10 + 8) de dano perfurante mais 22 (5d8) de dano de veneno. O alvo fica Agarrado (CD 24 para escapar). Enquanto estiver agarrado, ele sofre o status Quebra Total mesmo se conseguir sair do raio da aura principal.',
      },
      {
        nome: 'Sopro de dissolução (Recarga 5T)',
        desc: 'Jormungandr expele um jato concentrado de Eiter fosforescente em um cone de 18 metros, dissolvendo as leis da matéria. Cada criatura na área deve fazer uma RES de Constituição (CD 24). Falha: Sofre 72 (16d8) de dano necrótico e tem todos os seus buffs mágicos ativos permanentemente dissipados. Sucesso: Metade do dano e mantém as melhorias ativas.',
      },
      {
        nome: 'Chicotada Sísmica',
        desc: 'O monstro violenta o solo com sua cauda serpentina. Cada oponente a até 6 metros dela deve passar numa RES de Destreza (CD 24) ou sofrerá 18 (2d10 + 8) de dano de concussão e ficará sob a condição Caído.',
      },
      {
        nome: 'Sussurro ionizante',
        desc: 'Jormungandr emite uma frequência que sabota a mente de um conjurador a até 15 metros. O alvo deve passar numa RES de Inteligência (CD 24) ou perderá 40 pontos de mana de forma imediata.',
      },
      {
        nome: 'Choque de peste (Recarga 5T)',
        desc: 'O monstro estala os dedos e força o curto-circuito biológico. Todas as criaturas na arena que estejam sob o efeito de qualquer veneno ou status negativo sofrem instantaneamente 25 de dano necrótico bruto.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '16',
      visaoEscuro: '60 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Presa do Eiter Primordial',
      },
      {
        range: '2',
        item: 'Couro de Cinza-Chumbo Retorcido',
      },
      {
        range: '3',
        item: 'Glândula de Ionização Molecular',
      },
      {
        range: '4',
        item: 'Garra de Diamante Biológico Negro',
      },
    ],
  },
  salamancerEletrico: {
    name: 'Salamancer (Elétrico)',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/ORCseTM.png',
    image: 'https://2img.net/i.imgur.com/W82QVqJ.jpeg',
    subtitle: 'CR1',
    description: `A conduta do Salamancer Voltáico em combate é governada por movimentos rápidos, espasmódicos e imprevisíveis. A eletricidade que corre por sua carne nua atua como um estimulante perpétuo, fazendo com que o monstro morda e se desloque com uma velocidade surpreendente para um anfíbio. Ele demonstra uma preferência biológica por caçar em terrenos inundados, poças de lama e margens de rios, utilizando o ambiente úmido para ampliar o alcance e a precisão de suas descargas.

Sua postura tática baseia-se no atordoamento rápido para garantir a fuga ou o abate. O Salamancer não possui paciência para cercos prolongados; ele avança em linha reta expelindo faíscas concentradas que colapsam o sistema nervoso dos alvos atingidos. O verdadeiro perigo surge quando comitivas de assalto tentam encurralá-lo sem o devido preparo elemental: a criatura possui a capacidade de absorver relâmpagos e trovões direcionados contra ela, utilizando a energia inimiga para fechar suas feridas teciduais e sobrecarregar o cenário com novas centelhas.`,
    type: 'Monstro Pequeno, Draco',
    ac: '13',
    hp: '22 (5d6 + 5)',
    speed: '9 metros, natação 9 metros',
    stats: {
      forca: '11 (+0)',
      destreza: '16 (+3)',
      constituicao: '12 (+1)',
      inteligencia: '4 (-3)',
      sabedoria: '12 (+1)',
      carisma: '6 (-2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Salamancer Voltáico for alvo de dano Elétrico, ele não sofre dano. Em vez disso, a eletricidade energiza seus tecidos, fazendo-o recuperar 5 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Elétrico',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Terra',
      },
      {
        nome: 'Derme estática',
        desc: 'Qualquer ataque físico focado diretamente em sua frente reduz a CA do monstro para 11 contra aquele golpe específico. No entanto, o atacante corpo a corpo que o atingir pela frente sofre 2 de dano elétrico pelo refluxo da estática viva.',
      },
      {
        nome: 'Condutividade umida',
        desc: 'Enquanto estiver em terreno úmido, na lama ou na água, o Salamancer Voltáico ganha vantagem em suas jogadas de ataque que causam dano elétrico.',
      },
    ],
    acoes: [
      {
        nome: 'Mordida Condutora',
        desc: 'Ataque Corpo a Corpo Físico: +5 para acertar, alcance 1 metros. Dano: 5 (1d4 + 3) de dano perfurante mais 2 (1d4) de dano elétrico.',
      },
      {
        nome: 'Sopro de centelhas (Recarga 5T)',
        desc: 'O monstro expele um feixe de faíscas elétricas em uma linha de 6 metros por 1 metros de largura. Cada criatura na área deve fazer uma RES de Destreza (CD 13).  Falha: Sofre 7 (2d6) de dano elétrico e fica sob o status Choque por 1 rodada, impedindo o alvo de usar reações.  Sucesso: Metade do dano e evita o status.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: '18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Couro Anfíbio Estático',
      },
      {
        range: '2',
        item: 'Glândula de Centelhas',
      },
      {
        range: '3',
        item: 'Presa Condutora',
      },
      {
        range: '4',
        item: 'Frasco de Suor Voltáico',
      },
    ],
  },
  viperarelampago: {
    name: 'Vípera-relampago',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/EeaV83Q.png',
    image: 'https://2img.net/i.imgur.com/wxwVCud.jpeg',
    subtitle: 'CR5',
    description: `A conduta da Vípera-Relâmpago em combate é caracterizada por uma agressividade seletiva e altamente veloz. O ar ao seu redor é constantemente rachado por estalos violentos, resultado da fricção da estática gerada por sua musculatura. O sinal clássico de sua aproximação é o som do ar se partindo e a visão de linhas indigo-neon cruzando o mapa a velocidades alarmantes, deixando um rastro de faíscas azuladas que queimam o solo e limitam o tráfego dos combatentes.

Sua tática psicológica baseia-se no isolamento e na decapitação das defesas recuadas. A criatura ignora deliberadamente os guerreiros de escudo que tentam contê-la na vanguarda, utilizando seu arranco linear para desferir botes avassaladores contra os arqueiros, curandeiros e conjuradores posicionados ao fundo. O objetivo deste bote é desestruturar o suporte do grupo através de uma sobrecarga galvânica massiva nos feixes nervosos dos alvos, paralisando ou atordoados as vítimas instantaneamente e impedindo qualquer reação de defesa ou fuga.`,
    type: 'Monstro Médio, Draco',
    ac: '16',
    hp: '+82 (11d8 + 33)',
    speed: '15 metros, natação 12 metros',
    stats: {
      forca: '14 (+2)',
      destreza: '22 (+6)',
      constituicao: '16 (+3)',
      inteligencia: '4 (-3)',
      sabedoria: '14 (+2)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Vípera-Relâmpago for alvo de dano Elétrico, ela não sofre dano. Em vez disso, a alta voltagem reconecta seus tecidos musculares, fazendo-a recuperar 15 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Elétrico, Paralisado',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Terra',
      },
      {
        nome: 'Tensão-indigo',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua couraça traseira, reduzindo a CA do monstro para 12 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 4 de dano elétrico automático pelo refluxo dos arcos elétricos reativos.',
      },
      {
        nome: 'Rastro cinético',
        desc: 'A criatura se move gerando uma corrente estática tão alta que seu corpo racha o ar. Sempre que a Vípera-Relâmpago se mover pelo menos 6 metros em linha reta, ela deixa um rastro de faíscas azuladas no solo até o início de seu próximo turno. Qualquer criatura que cruzar esse rastro sofre 3 de dano elétrico automático. Além disso, o monstro ganha vantagem em seu próximo ataque físico na mesma rodada.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Vípera-Relâmpago realiza dois ataques: um Bote Cinético e uma Garra de Alta Voltagem.',
      },
      {
        nome: 'Bote cinético',
        desc: 'Ataque Corpo a Corpo Físico: +9 para acertar, alcance 4 metros. Dano: 11 (1d10 + 6) de dano perfurante mais 7 (2d6) de dano elétrico. O monstro se projeta em uma arrancada linear rápida contra um oponente na retaguarda. O alvo deve passar numa RES de Constituição (CD 15) ou seus músculos sofrem uma sobrecarga severa, aplicando o status Paralisado por 1 rodada completa.',
      },
      {
        nome: 'Garra de alta voltagem',
        desc: 'Ataque Corpo a Corpo Físico: +9 para acertar, alcance 1 metros. Dano: 9 (1d6 + 6) de dano cortante mais 4 (1d8) de dano elétrico.',
      },
      {
        nome: 'Centelha neuronal (Recarga 5T)',
        desc: 'O monstro dispara uma forte descarga elétrica focada no sistema nervoso de um oponente a até 15 metros. O alvo deve realizar uma RES de Sabedoria (CD 15). Falha: Sofre 18 (4d8) de dano elétrico e fica Atordoado por 1 rodada devido ao colapso de seus reflexos. Sucesso: Metade do dano e evita o atordoamento.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Glândula Indigo-Neon',
      },
      {
        range: '2',
        item: 'Couro Azul-Celeste Liso',
      },
      {
        range: '3',
        item: 'Garras de Diamante Estático',
      },
      {
        range: '4',
        item: 'Frasco de Suor Fosforescente',
      },
    ],
  },
  pythonsobrecarga: {
    name: 'Python-sobrecarga',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/PNepYzP.png',
    image: 'https://2img.net/i.imgur.com/YWlYS7I.jpeg',
    subtitle: 'CR10',
    description: `A conduta da Píton-Sobrecarga em batalha é pautada por uma agressividade territorial maciça e um domínio geográfico absoluto. O núcleo elétrico que ferve em seu peito gera uma distorção invisível na atmosfera: um campo magnético de alta intensidade que flutua ao redor de seus espirais. A aproximação desta besta é anunciada por uma força de atração gravitacional inescapável, que puxa os corpos, armaduras e equipamentos de metal diretamente em direção à sua derme, quebrando linhas defensivas e arrastando os invasores para o alcance de suas garras.

Sua postura psicológica baseia-se no massacre por proximidade. A píton compreende que a união das comitivas é sua maior vantagem; ela utiliza seu tronco superior musculoso para enlaçar e esmagar um alvo enquanto canaliza toda a voltagem de seu corpo através dele. O corpo da vítima passa a atuar como um condutor e a energia disparada se propaga automaticamente em arcos elétricos para todos os aliados que estiverem posicionados nos arredores, transformando o companheiro capturado em uma bomba de choque em cadeia.`,
    type: 'Monstro Grande, Draco',
    ac: '18',
    hp: '+152 (16d10 + 64)',
    speed: '12 metros, natação 12 metros, escalada 9 metros',
    stats: {
      forca: '22 (+6)',
      destreza: '16 (+3)',
      constituicao: '18 (+4)',
      inteligencia: '4 (-3)',
      sabedoria: '14 (+2)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Píton-Sobrecarga for alvo de dano Elétrico, ela não sofre dano. A alta voltagem reconecta seus tecidos de forma imediata, fazendo-o recuperar 25 Pontos de Vida.',
      },
      {
        nome: 'Imunidade',
        desc: 'Elétrico, Paralisado, Impedido, Agarrado',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Terra',
      },
      {
        nome: 'Malha de indução',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua couraça traseira, reduzindo a CA do monstro para 13 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 9 de dano elétrico automático pelo refluxo dos arcos reativos.',
      },
      {
        nome: 'Pulsação magnética',
        desc: 'O núcleo biológico da criatura gera um campo de atração inevitável. No início do turno da Píton-Sobrecarga, todas as criaturas a até 9 metros dela devem realizar uma RES de Força (CD 18). Se falharem, são magneticamente puxadas 3 metros em direção ao monstro, quebrando formações defensivas.',
      },
      {
        nome: 'Dispersão em cadeia',
        desc: 'A píton atua como uma bobina viva. Sempre que a criatura atingir um alvo com um ataque físico ou mantiver um oponente sob constrição, a corrente elétrica se propaga. Todos os aliados a até 3 metros do alvo inicial sofrem instantaneamente 7 (2d6) de dano elétrico bruto pelo choque em cadeia.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Píton-Sobrecarga realiza dois ataques: uma Mordida Condutora e um Abraço de Bobina.',
      },
      {
        nome: 'Mordida condutora',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 3 metros. Dano: 15 (2d8 + 6) de dano perfurante mais 7 (2d6) de dano elétrico.',
      },
      {
        nome: 'Abraço de bobina',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 3 metros. Dano: 19 (3d8 + 6) de dano de concussão. O alvo fica Agarrado e Impedido (CD 18 para escapar). Enquanto mantiver o alvo preso, a Píton-Sobrecarga não pode usar esta ação em outra criatura, e o status Dispersão em Cadeia é ativado automaticamente no início do turno do alvo afetado, eletrocutando quem estiver por perto.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Bobina Espiralada da Píton',
      },
      {
        range: '2',
        item: 'Ventre Terracota Eletrizado',
      },
      {
        range: '3',
        item: 'Glândula de Indução Magnética',
      },
      {
        range: '4',
        item: 'Essência de Suor Azul-Fluorescente',
      },
    ],
  },
  pitonsobrecarga: {
    name: 'Píton-sobrecarga',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/PNepYzP.png',
    image: 'https://2img.net/i.imgur.com/YWlYS7I.jpeg',
    subtitle: 'CR10',
    description: `A conduta da Píton-Sobrecarga em batalha é pautada por uma agressividade territorial maciça e um domínio geográfico absoluto. O núcleo elétrico que ferve em seu peito gera uma distorção invisível na atmosfera: um campo magnético de alta intensidade que flutua ao redor de seus espirais. A aproximação desta besta é anunciada por uma força de atração gravitacional inescapável, que puxa os corpos, armaduras e equipamentos de metal diretamente em direção à sua derme, quebrando linhas defensivas e arrastando os invasores para o alcance de suas garras.

Sua postura psicológica baseia-se no massacre por proximidade. A píton compreende que a união das comitivas é sua maior vantagem; ela utiliza seu tronco superior musculoso para enlaçar e esmagar um alvo enquanto canaliza toda a voltagem de seu corpo através dele. O corpo da vítima passa a atuar como um condutor e a energia disparada se propaga automaticamente em arcos elétricos para todos os aliados que estiverem posicionados nos arredores, transformando o companheiro capturado em uma bomba de choque em cadeia.`,
    type: 'Monstro Grande, Draco',
    ac: '18',
    hp: '+152 (16d10 + 64)',
    speed: '12 metros, natação 12 metros, escalada 9 metros',
    stats: {
      forca: '22 (+6)',
      destreza: '16 (+3)',
      constituicao: '18 (+4)',
      inteligencia: '4 (-3)',
      sabedoria: '14 (+2)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Píton-Sobrecarga for alvo de dano Elétrico, ela não sofre dano. A alta voltagem reconecta seus tecidos de forma imediata, fazendo-o recuperar 25 Pontos de Vida.',
      },
      {
        nome: 'Imunidade',
        desc: 'Elétrico, Paralisado, Impedido, Agarrado',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Terra',
      },
      {
        nome: 'Malha de indução',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua couraça traseira, reduzindo a CA do monstro para 13 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 9 de dano elétrico automático pelo refluxo dos arcos reativos.',
      },
      {
        nome: 'Pulsação magnética',
        desc: 'O núcleo biológico da criatura gera um campo de atração inevitável. No início do turno da Píton-Sobrecarga, todas as criaturas a até 9 metros dela devem realizar uma RES de Força (CD 18). Se falharem, são magneticamente puxadas 3 metros em direção ao monstro, quebrando formações defensivas.',
      },
      {
        nome: 'Dispersão em cadeia',
        desc: 'A píton atua como uma bobina viva. Sempre que a criatura atingir um alvo com um ataque físico ou mantiver um oponente sob constrição, a corrente elétrica se propaga. Todos os aliados a até 3 metros do alvo inicial sofrem instantaneamente 7 (2d6) de dano elétrico bruto pelo choque em cadeia.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Píton-Sobrecarga realiza dois ataques: uma Mordida Condutora e um Abraço de Bobina.',
      },
      {
        nome: 'Mordida condutora',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 3 metros. Dano: 15 (2d8 + 6) de dano perfurante mais 7 (2d6) de dano elétrico.',
      },
      {
        nome: 'Abraço de bobina',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 3 metros. Dano: 19 (3d8 + 6) de dano de concussão. O alvo fica Agarrado e Impedido (CD 18 para escapar). Enquanto mantiver o alvo preso, a Píton-Sobrecarga não pode usar esta ação em outra criatura, e o status Dispersão em Cadeia é ativado automaticamente no início do turno do alvo afetado, eletrocutando quem estiver por perto.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Bobina Espiralada da Píton',
      },
      {
        range: '2',
        item: 'Ventre Terracota Eletrizado',
      },
      {
        range: '3',
        item: 'Glândula de Indução Magnética',
      },
      {
        range: '4',
        item: 'Essência de Suor Azul-Fluorescente',
      },
    ],
  },
  mambaarco: {
    name: 'Mamba-arco',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/FTdbeQj.png',
    image: 'https://2img.net/i.imgur.com/pYzG9GD.jpeg',
    subtitle: 'CR15',
    description: `A conduta da Mamba-Arco em combate é caracterizada por uma velocidade assustadora que desafia os reflexos da visão mortal. A fera não conhece a hesitação; ela se move rachando o ar com estalos violentos, cruzando o cenário sem que as vanguardas pesadas consigam prever ou interceptar sua trajetória. Sua aproximação é silenciosa até o instante em que suas runas biológicas de pura estática acendem em seu peito azul-celeste, sinalizando o início de uma tempestade elétrica direcionada.

A inteligência instintiva desta criatura é refinada de forma cruel para desestruturar comitivas de exploração. A mamba ignora deliberadamente os guerreiros de escudo posicionados na linha de frente, utilizando sua agilidade para flanquear o perímetro e surgir diretamente no encalço de arqueiros, curandeiros e especialistas arcanos. O objetivo de suas investidas é paralisar por completo o suporte do grupo, utilizando suas garras e presas como eletrodos biológicos que descarregam arcos de plasma ramificados capazes de saltar de alvo em alvo com precisão cirúrgica.`,
    type: 'Monstro Enorme, Draco',
    ac: '21',
    hp: '+231 (22d12 + 88)',
    speed: '18 metros, natação 15 metros, escalada 15 metros.',
    stats: {
      forca: '18 (+4)',
      destreza: '26 (+8)',
      constituicao: '18 (+4)',
      inteligencia: '4 (-3)',
      sabedoria: '16 (+3)',
      carisma: '8 (-1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Mamba-Arco for alvo de dano Elétrico, ela não sofre dano. A alta voltagem reconecta sua estrutura celular instantaneamente, fazendo-a recuperar 35 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Elétrico, Veneno, Paralisado, Impedido, Agarrado, Envenenado.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Gelo; Concussão, Perfurante e Cortante de ataques não-mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Terra',
      },
      {
        nome: 'Runas de plasma',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua couraça traseira, reduzindo a CA do monstro para 14 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 14 de dano elétrico automático devido ao refluxo de plasma que emana de suas runas.',
      },
      {
        nome: 'Polarização de retaguarda',
        desc: 'A velocidade da mamba ignora as linhas de defesa. A criatura não provoca ataques de oportunidade ao se mover na direção de oponentes posicionados na retaguarda que possuam capacidades de conjuração ou ataques à distância.',
      },
      {
        nome: 'Eletrodos ramificados',
        desc: 'As garras e presas da criatura funcionam como eletrodos biológicos. Sempre que a Mamba-Arco acertar um ataque físico, a energia é descarregada. Um relâmpago ramificado salta automaticamente para o aliado mais próximo a até 6 metros do alvo inicial, infligindo 9 de dano elétrico bruto e drenando 15 pontos de Mana (MP) daquela criatura.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Mamba-Arco realiza três ataques: duas Garras Eletrodo e uma Mordida de Alta Tensão.',
      },
      {
        nome: 'Garras eletrodo',
        desc: 'Ataque Corpo a Corpo Físico: +13 para acertar, alcance 3 metros. Dano: 15 (2d6 + 8) de dano cortante mais 7 (2d6) de dano elétrico.',
      },
      {
        nome: 'Mordida de alta tensão',
        desc: 'Ataque Corpo a Corpo Físico: +13 para acertar, alcance 3 metros. Dano: 19 (2d10 + 8) de dano perfurante mais 14 (4d6) de dano elétrico. O alvo atingido perde instantaneamente 5 Slots (sacrifica 5 de 1º circulo, 2 de 2º e 1 de 1º ou 1 de 5º, enfim, tem que somar 5 slots) e deve passar numa RES de Constituição (CD 21) ou sofrerá uma paralisia muscular severa, ficando sob o status Paralisado por 1 rodada completa.',
      },
      {
        nome: 'Sibilado de Plasma (Recarga 5T)',
        desc: 'A mamba emite um estalo elétrico de alta frequência que dispara um raio em cadeia de alta precisão. O arco de plasma atinge um oponente a até 18 metros e salta consecutivamente para até três alvos a até 6 metros uns dos outros. Cada criatura atingida deve passar numa RES de Destreza (CD 21).  Falha: Sofre 45 (10d8) de dano elétrico, perde 4 slots e fica sob o status Choque, impedindo o uso de qualquer habilidade ou reação por 1 rodada.  Sucesso: Metade do dano, perde 2 slots e evita o status.',
      },
      {
        nome: 'Deslocamento de plasma',
        desc: 'A criatura move-se até metade de seu deslocamento em uma linha reta de pura estática, sem provocar ataques de oportunidade de qualquer oponente na arena.',
      },
      {
        nome: 'Fagulha drenante',
        desc: 'O monstro faz as runas de seu peito brilharem, disparando uma pequena centelha contra um alvo a até 12 metros. O oponente deve passar numa RES de Sabedoria (CD 21) ou perderá 2 slots imediatamente.',
      },
      {
        nome: 'Arco impulsivo (2 ações)',
        desc: 'A mamba desfecha uma chicotada rápida com sua cauda eletrificada contra uma criatura a até 4 metros. O alvo deve passar numa RES de Destreza (CD 21) ou sofrerá 14 de dano elétrico bruto e será empurrado 3 metros para trás, quebrando sua formação.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Presa de Plasma Ramificado',
      },
      {
        range: '2',
        item: 'Epiderme Celeste Rúnica',
      },
      {
        range: '3',
        item: 'Glândula de Alta Precisão',
      },
      {
        range: '4',
        item: 'Essência de Suor Fosforescente',
      },
    ],
  },
  ryujin: {
    name: 'Ryujin',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/i2qQoAm.png',
    image: 'https://2img.net/i.imgur.com/tNIJSwN.jpeg',
    subtitle: 'CR20',
    description: `A conduta do Ryujin em batalha evoca uma graciosidade sensual, silenciosa e profundamente dominante. Ele não rasteja como os répteis comuns, nem corre com a pressa dos predadores inferiores; a entidade flutua a poucos centímetros do solo, movendo sua silhueta longa e flexível com a soberba de um monarca absoluto. O ar ao redor de seu corpo perolado é constantemente saturado pelo cheiro de ozônio e por um zumbido magnético que faz as armas pesadas vibrarem nas mãos dos guerreiros antes mesmo do primeiro golpe.

A estratégia biológica do Ryujin baseia-se na manipulação da polaridade dos corpos. Ao atingir a guarda com seus ataques, a criatura injeta cargas elétricas opostas nos combatentes. Quando o cenário está polarizado, o regente executa uma alteração abrupta no campo magnético da arena, fazendo com que os membros de uma comitiva sejam atraídos violentamente uns contra os outros. O resultado é uma colisão catastrófica onde a linha de frente é esmagada contra a retaguarda, quebrando qualquer formação tática e deixando os sobreviventes atordoados pelo impacto da força bruta.`,
    type: 'Monstro Colossal, Dragão',
    ac: '25',
    hp: '+418 (28d20 + 124)',
    speed: '15 metros, natação 15 metros, voo 15 metros',
    stats: {
      forca: '24 (+7)',
      destreza: '28 (+9)',
      constituicao: '20 (+5)',
      inteligencia: '18 (+4)',
      sabedoria: '22 (+6)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Ryujin for alvo de dano Elétrico ou de Trovão, ele não sofre dano. A descarga reconstitui sua estrutura celular instantaneamente, fazendo-o recuperar 50 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Elétrico, Trovão, Veneno, Paralisado, Impedido, Agarrado, Envenenado, Atordoado, Caído.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Gelo; Concussão, Perfurante e Cortante de ataques mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Terra',
      },
      {
        nome: 'Idiomas',
        desc: 'Dialeto Dracônico, Primordial',
      },
      {
        nome: 'Malha cromática',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua resistência externa, reduzindo a CA do monstro para 16 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 20 de dano elétrico automático pelo refluxo do plasma energético.',
      },
      {
        nome: 'Condução infinita',
        desc: 'A bioeletricidade do Ryujin é tão alta que desafia o isolamento convencional. Sempre que a criatura disparar uma descarga elétrica (seja por ataques, habilidades ou sopro), o raio pula por todos os alvos presentes no mapa de forma sequencial e infinita. O fluxo de dano só cessa se um dos alvos utilizar uma habilidade ativa de aterramento (como magia de terra ou barreiras isolantes absolutas) para absorver o impacto e quebrar o circuito.',
      },
      {
        nome: 'Gatilho de colapso sombrio',
        desc: 'Sempre que uma criatura sofrer dano elétrico do Ryujin, o curto-circuito consome suas capacidades místicas e físicas. O alvo perde instantaneamente seu espaço de magia de menor nível disponível. Caso o alvo não seja um conjurador, ele perde 1 dado de superioridade, ponto de ki ou recurso marcial equivalente de sua classe.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Ryujin realiza três ataques: duas Lâminas de Plasma e uma Chicotada Magnética.',
      },
      {
        nome: 'Lâminas de plasma',
        desc: 'Ataque Corpo a Corpo Mágico: +15 para acertar, alcance 3 metros. Dano: 22 (3d8 + 9) de dano cortante mais 14 (4d6) de dano elétrico.',
      },
      {
        nome: 'Chicotada magnética',
        desc: 'Ataque Corpo a Corpo Físico: +15 para acertar, alcance 4 metros. Dano: 25 (3d10 + 9) de dano de concussão. O alvo deve passar numa RES de Força (CD 23) ou receberá a marca de Polaridade Positiva ou Negativa (determinada pelo monstro) por 1 minuto.',
      },
      {
        nome: 'Esmagamento de carga (Recarga 5T)',
        desc: 'O Ryujin altera abruptamente a polaridade de todos os corpos na arena. Duas ou mais criaturas que estejam carregando marcas de Polaridade opostas a até 18 metros de distância mútua são violentamente atraídas uma contra a outra. Os alvos colidem no ponto central, sofrendo 45 (10d8) de dano de concussão bruto e ficando sob a condição Caído e Atordoado por 1 rodada. Uma RES de Força (CD 23) reduz o dano à metade e evita o atordoamento.',
      },
      {
        nome: 'Centelha do caos',
        desc: 'O monstro expele um relâmpago globular condensado em um ponto a até 24 metros. O globo explode em um raio de 6 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 23). Falha: Sofre 63 (14d8) de dano elétrico e ativa imediatamente a Condução Infinita a partir daquele ponto. Sucesso: Metade do dano e o circuito não se propaga.',
      },
      {
        nome: 'Deslocamento sinuoso',
        desc: 'O monstro flutua até metade de seu deslocamento sem provocar ataques de oportunidade, deixando um rastro de ozônio no ar.',
      },
      {
        nome: 'Arco expulsivo (2 ações)',
        desc: 'O monstro faz o plasma de suas runas pélvicas brilhar, liberando uma onda de choque magnética a até 9 metros de raio. Todos os alvos na área sofrem 18 de dano de trovão e são empurrados 6 metros para trás.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '16',
      visaoEscuro: 'Visão Verdadeira 36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Coração de Plasma Fosforescente',
      },
      {
        range: '2',
        item: 'Membrana Perolada Rúnica',
      },
      {
        range: '3',
        item: 'Par de Garras de Condução Ápice',
      },
      {
        range: '4',
        item: 'Ampola de Fluido de Polaridade',
      },
    ],
  },
  fulgris: {
    name: 'Fulgris',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/U66BpMm.png',
    image: 'https://2img.net/i.imgur.com/ppUW5nT.jpeg',
    subtitle: 'CR5',
    description: `A conduta do Fulgris em combate é marcada por uma imobilidade arrogante e um sadismo intelectual. Ele raramente se move de forma brusca; prefere manter sua postura altiva enquanto sua cauda fina chicoteia o chão ritmicamente, como o ponteiro de um relógio ditando o tempo de vida de suas presas. Seus olhos elétricos mapeiam a sala constantemente, calculando a distância entre os invasores, a umidade do solo e a presença de armaduras de metal para garantir que suas descargas atinjam o ápice do potencial destrutivo.

Sua maior perversidade tática reside no isolamento e na punição de outros conjuradores. Através da feitiçaria de curto-circuito, o Fulgris ioniza o próprio solo, criando zonas persistentes de estática pura. Quando um especialista místico tenta moldar seus feitiços dentro dessas áreas, o fluxo de energia colapsa. A distorção força o conjurador a queimar muito mais energia do que o necessário, exigindo círculos de feitiçaria muito mais altos para conjurar magias simples, ou punindo o executor com um retrocesso elétrico doloroso que estilhaça seus canais de mana.`,
    type: 'Monstro Médio (Humanoide Reptiliano)',
    ac: '15',
    hp: '+78 (12d8 + 24)',
    speed: '9 metros, natação 9 metros',
    stats: {
      forca: '10 (+0)',
      destreza: '16 (+3)',
      constituicao: '14 (+2)',
      inteligencia: '20 (+5)',
      sabedoria: '14 (+2)',
      carisma: '12 (+1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Fulgris for alvo de dano Elétrico, ele não sofre dano. Em vez disso, a eletricidade energiza seus tecidos arcanos, fazendo-o recuperar 15 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Elétrico, Silenciado, Paralisado.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Terra',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Dracônico.',
      },
      {
        nome: 'Matriz Amarelo-Neon',
        desc: 'Qualquer ataque físico focado diretamente em sua frente reduz a CA do monstro para 12 contra aquele golpe específico. No entanto, o atacante corpo a corpo que o atingir pela frente sofre 5 de dano elétrico pelo refluxo da estática reativa.',
      },
      {
        nome: 'Cálculo de condutividade',
        desc: 'O Fulgris usa seu intelecto supremo para mapear a sala. Ele ganha um bônus de +2 na CD de suas habilidades se o alvo estiver vestindo armadura de metal ou estiver em terreno úmido.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Fulgris realiza um ataque de Chicotada Cadenciada e utiliza uma de suas Fórmulas Arcanas.',
      },
      {
        nome: 'Chicotada cadenciada',
        desc: 'Ataque Corpo a Corpo Físico: +6 para acertar, alcance 3 metros. Dano: 7 (1d8 + 3) de dano de concussão mais 4 (1d8) de dano elétrico.',
      },
      {
        nome: 'Sentença de gauss (Recarga 5T)',
        desc: 'O Fulgris recita uma fórmula matemática rápida em linguagem humana, invocando relâmpagos direcionados do teto em um ponto a até 18 metros. Cada criatura em um raio de 3 metros daquele ponto deve fazer uma RES de Destreza (CD 15). Falha: Sofre 22 (5d8) de dano elétrico e não pode usar reações até o início do próximo turno do Fulgris. Sucesso: Metade do dano e evita a perda de reações.',
      },
      {
        nome: 'Função de curto-circuito',
        desc: 'O Fulgris ioniza uma área de 3 metros de raio no solo a até 15 metros de distância, criando um campo de estática persistente por 1 minuto. Sempre que um conjurador tentar lançar uma magia de qualquer nível enquanto estiver dentro desse campo, o fluxo entra em colapso. O conjurador deve gastar um espaço de magia (Spell Slot) um nível acima do feitiço pretendido para conseguir conjurá-lo. Se não possuir o espaço adicional, a magia falha e o conjurador sofre 9 (2d8) de dano elétrico por retrocesso.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Núcleo Lógico Amarelo-Neon',
      },
      {
        range: '2',
        item: 'Membrana Celeste Lisa',
      },
      {
        range: '3',
        item: 'Filamento de Cauda Cadenciada',
      },
      {
        range: '4',
        item: 'Destilado de Suor Estático',
      },
    ],
  },
  taranis: {
    name: 'Taranis',
    rarity: 'incomum',
    icon: 'https://2img.net/i.imgur.com/AomTd4A.png',
    image: 'https://2img.net/i.imgur.com/Gyters5.jpeg',
    subtitle: 'CR10',
    description: `A conduta do Taranis em combate é descrita como um exercício de tirania calculada e arrogância silenciosa. Ele se posiciona na arena com imponência, utilizando estalos de alta frequência emitidos por sua garganta para estilhaçar instantaneamente qualquer barreira arcana, escudo místico ou feitiço de proteção protetora que os invasores ergam ao seu redor. Para o Taranis, a magia defensiva convencional é uma ilusão inútil.

Sua maior arma tática é o isolamento completo da retaguarda mágica. Ao tensionar sua musculatura cinza-chumbo, ele suga o ar do ambiente para criar uma esfera de vácuo acústico absoluto. Dentro deste perímetro, nenhum som se propaga. Os conjuradores que dependem de encantamentos falados ou palavras de ativação encontram-se completamente silenciados e indefesos. Qualquer tentativa de forçar a fala sob essa pressão resulta em um eco de retrocesso que explode os tímpanos do conjurador devido à violenta diferença de pressão atmosférica.`,
    type: 'Monstro Grande (Humanoide Reptiliano)',
    ac: '18',
    hp: '+152 (16d10 + 64)',
    speed: '12 metros, natação 9 metros',
    stats: {
      forca: '14 (+2)',
      destreza: '18 (+4)',
      constituicao: '18 (+4)',
      inteligencia: '24 (+7)',
      sabedoria: '16 (+3)',
      carisma: '12 (+1)',
    },
    habilidades: [
      {
        nome: 'Sucção harmonica',
        desc: 'Sempre que o Taranis for alvo de dano Elétrico ou de Trovão, ele não sofre dano. A vibração sônica reconecta sua estrutura de forma imediata, fazendo-o recuperar 25 Pontos de Vida.',
      },
      {
        nome: 'Imunidade',
        desc: 'Elétrico, Silenciado, Envenenado, Paralisado, Impedido.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Terra',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Dracônico',
      },
      {
        nome: 'Corrente de chumbo',
        desc: 'Qualquer ataque físico focado diretamente em sua frente reduz a CA do monstro para 13 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 8 de dano elétrico automático pelo choque dos arcos orbitais.',
      },
      {
        nome: 'Ruptura de barreira',
        desc: 'A fala arrogante e os estalos de alta frequência do Taranis desestabilizam a abjuração. Sempre que o monstro atinge uma criatura com um ataque ou habilidade, qualquer escudo mágico ativo, barreira arcana ou Pontos de Vida Temporários concedidos por feitiços no alvo são instantaneamente dissipados.',
      },
      {
        nome: 'Magnetismo de metais',
        desc: 'O Taranis possui vantagem em jogadas de ataque contra alvos que estejam empunhando armas de metal ou vestindo armaduras metálicas, manipulando a polaridade dos armamentos para atrair seus golpes.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Taranis realiza um ataque de Chicotada Sônica e utiliza um Acorde Estático.',
      },
      {
        nome: 'Chicotada sônica',
        desc: 'Ataque Corpo a Corpo Mágico: +11 para acertar, alcance 3 metros. Dano: 14 (2d6 + 7) de dano de trovão mais 7 (2d6) de dano elétrico.',
      },
      {
        nome: 'Acorde estático',
        desc: 'O Taranis emite um estalo sônico direcionado a um conjurador a até 18 metros. O alvo deve realizar uma RES de Sabedoria (CD 19). Se falhar, o curto-circuito consome sua mente e drena imediatamente o seu espaço de magia de menor nível disponível. Caso o alvo não seja um conjurador, ele perde 1 dado de superioridade, ponto de ki ou recurso marcial equivalente.',
      },
      {
        nome: 'Vácuo acústico (Recarga 5T)',
        desc: 'Taranis projeta uma distorção sônica que suga o ar em uma área esférica de 6 metros de raio a até 15 metros de distância. A zona de vácuo persiste por 1 minuto. Qualquer criatura dentro da área fica sob a condição Silenciado, tornando-se completamente incapaz de pronunciar palavras de ativação ou componentes verbais de magias.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: '24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Chifre de Fulgurita Ressonante',
      },
      {
        range: '2',
        item: 'Couro de Chumbo Condutor',
      },
      {
        range: '3',
        item: 'Glândula de Alta Frequência',
      },
      {
        range: '4',
        item: 'Essência de Suor Magnético',
      },
    ],
  },
  perun: {
    name: 'Perun',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/8KTdkAI.png',
    image: 'https://2img.net/i.imgur.com/nftLdYg.jpeg',
    subtitle: 'CR15',
    description: `A conduta de Perun no campo de batalha é descrita como um ato de tirania teatral e desdém absoluto. O monarca flutua e se posiciona com uma calma aterrorizante, emanando um zumbido eletromagnético que desestabiliza o metal dos invasores. Quando eleva sua voz humana, o núcleo que brilha como um relâmpago engolido em seu peito índigo-profundo expande-se, tornando suas costelas visíveis sob a derme fina e contraída, liberando ondas de choque que reescrevem as leis da física no cenário.

Sua maior demonstração de crueldade intelectual baseia-se no Érebo Sônico. Ao alterar a compressão do ar, Perun cria zonas de vácuo absoluto onde nenhum som consegue se propagar, silenciando completamente a retaguarda mágica e impedindo o uso de qualquer feitiço verbal. A ausência de atmosfera nessas áreas estabiliza a condutividade elétrica de uma forma nunca vista antes: qualquer faísca ou centelha que atinja um corpo dentro deste vácuo tem seu potencial destrutivo triplicado, incinerando as defesas biológicas das vítimas em segundos.`,
    type: 'Monstro Grande (Humanoide Reptiliano)',
    ac: '21',
    hp: '+231 (22d10 + 110)',
    speed: '12 metros, voo 12 metros',
    stats: {
      forca: '16 (+3)',
      destreza: '22 (+6)',
      constituicao: '20 (+5)',
      inteligencia: '26 (+8)',
      sabedoria: '18 (+4)',
      carisma: '14 (+2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Perun for alvo de dano Elétrico ou de Trovão, ele não sofre dano. A descarga alimenta seu núcleo molecular instantaneamente, fazendo-o recuperar 35 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Elétrico, Ácido, Silenciado, Envenenado, Paralisado, Atordoado, Impedido.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Gelo; Concussão, Perfurante e Cortante de ataques mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Terra',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Dracônico',
      },
      {
        nome: 'Manto real',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua couraça traseira, reduzindo sua CA para 14 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 15 de dano elétrico automático pelo refluxo do plasma energético.',
      },
      {
        nome: 'Magnetismo sideral',
        desc: 'O Perun manipula as forças metálicas ao seu redor. Ele possui vantagem em jogadas de ataque contra alvos que usem armaduras ou escudos de metal. Além disso, essas criaturas sofrem desvantagem em testes de resistência contra as habilidades magnéticas do monstro.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Perun realiza três ataques: duas Garras de Diamante Negro e uma Sentença Herética.',
      },
      {
        nome: 'Garras de diamante negro',
        desc: 'Ataque Corpo a Corpo Físico: +13 para acertar, alcance 3 metros. Dano: 17 (2d10 + 6) de dano cortante mais 9 (2d8) de dano elétrico.',
      },
      {
        nome: 'Sentença herética',
        desc: 'O Perun dita uma palavra de ordem que distorce o éter de um alvo a até 18 metros. O alvo deve fazer uma RES de Sabedoria (CD 21). Se falhar, sofre 14 de dano de trovão e perde imediatamente seu espaço de magia (Spell Slot) de menor nível disponível. Se o alvo não for um conjurador, ele perde um recurso marcial equivalente (como um dado de superioridade ou ponto de ki).',
      },
      {
        nome: 'Convergência polar',
        desc: 'O Perun magnetiza o metal de duas criaturas a até 18 metros de distância uma da outra. Ambos os alvos devem realizar uma RES de Força (CD 21). Se um ou ambos falharem, eles são atraídos violentamente na direção do outro, colidindo no ponto central. A colisão causa 27 (5d10) de dano de concussão bruto a ambos e os deixa sob o status Atordoado por 1 rodada.',
      },
      {
        nome: 'Érebo sônico (Recarga 5T)',
        desc: 'O Perun altera a pressão molecular do ar, criando uma zona de vácuo absoluto com 6 metros de raio em um ponto a até 21 metros. A área persiste por 1 minuto. Qualquer criatura dentro da zona fica sob a condição Silenciado. Além disso, a ausência de ar estabiliza a condutividade elétrica: qualquer dano elétrico sofrido por uma criatura dentro deste vácuo é amplificado em 200% (sofre o triplo do dano original).',
      },
    ],
    sentidos: {
      percepcaoPassiva: '14',
      visaoEscuro: '36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Cristal de Fulgurita Cósmica',
      },
      {
        range: '2',
        item: 'Manto Real do Ocaso',
      },
      {
        range: '3',
        item: 'Par de Eletrodos de Diamante Negro',
      },
      {
        range: '4',
        item: 'Plasma Fluido de Polaridade',
      },
    ],
  },
  teshub: {
    name: 'Teshub',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/98lvyPs.png',
    image: 'https://2img.net/i.imgur.com/mWXJ6Q8.jpeg',
    subtitle: 'CR20',
    description: `A conduta de Teshub em combate exala uma soberania fria e aterrorizante. Ele flutua na arena com os braços cruzados ou estendidos em desdém, ditando decretos em linguagem humana antiga. Sua mera presença altera instantaneamente a ionização do oxigênio ao redor de todos os seres vivos. O ar torna-se tão denso e carregado que a atmosfera de chumbo esmaga os corpos dos invasores, fragilizando ligas metálicas, quebrando a integridade estrutural de escudos de aço e evaporando instantaneamente qualquer barreira de proteção mística ou abjuração que tente se erguer contra ele.

Sua defesa mística é uma ofensa direta ao conhecimento dos conjuradores. O Soberano projeta uma blindagem eletrostática invisível que envolve sua carne cinza-chumbo. Qualquer feitiço direcionado contra o seu corpo é interceptado pela malha rúnica, sofrendo uma inversão de vetor de cem por cento. A barreira defletora não apenas anula a feitiçaria intrusa, mas a arremessa de volta com a mesma intensidade contra o conjurador original, punindo a ousadia das comitivas arcanas através de seus próprios feitiços.`,
    type: 'Monstro Colossal (Humanoide Reptiliano)',
    ac: '25',
    hp: '+418 (28d20 + 124)',
    speed: '12 metros, voo 15 metros',
    stats: {
      forca: '18 (+4)',
      destreza: '22 (+6)',
      constituicao: '22 (+6)',
      inteligencia: '28 (+9)',
      sabedoria: '20 (+5)',
      carisma: '16 (+3)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Teshub for alvo de dano Elétrico, Trovão ou Radiante, ele não sofre dano. A quebra molecular alimenta seu núcleo instantaneamente, fazendo-o recuperar 50 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Elétrico, Radiante, Ácido, Silenciado, Envenenado, Paralisado, Atordoado, Impedido, Caído.',
      },
      {
        nome: 'Resistência',
        desc: 'Fogo, Gelo; Concussão, Perfurante e Cortante de ataques mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Terra',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Dracônico',
      },
      {
        nome: 'Pulsar de chumbo',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua couraça traseira, reduzindo sua CA para 16 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 20 de dano elétrico automático pelo refluxo do plasma energético.',
      },
      {
        nome: 'Barreira Refletora',
        desc: 'O Teshub projeta uma blindagem eletrostática invisível ao redor de sua derme. Sempre que for alvo direto de uma magia de 1º a 7º nível que exija uma jogada de ataque ou um teste de referência individual, a barreira reflete 100% do efeito. A magia é completamente anulada contra o Teshub e redirecionada instantaneamente contra o conjurador original, utilizando a mesma CD e bônus de ataque do conjurador.',
      },
      {
        nome: 'Opressão de oxigênio',
        desc: 'A presença do Teshub altera a ionização do ar ao redor das criaturas. No início do turno do monstro, todas as criaturas a até 12 metros dele devem realizar uma RES de Constituição (CD 23). Se falharem, suas armas metálicas tornam-se frágeis (sofrendo uma penalidade de -2 nas jogadas de dano físico) e quaisquer escudos mágicos, barreiras arcanas ou Pontos de Vida Temporários ativos no alvo são instantaneamente derretidos e desfeitos.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Teshub realiza três ataques: duas Garras Incandescentes e um Decreto Supremo.',
      },
      {
        nome: 'Garras incandescentes',
        desc: 'Ataque Corpo a Corpo Físico: +15 para acertar, alcance 3 metros. Dano: 22 (3d8 + 9) de dano cortante mais 14 (4d6) de dano radiante devido ao superaquecimento das garras de diamante negro.',
      },
      {
        nome: 'Decreto supremo',
        desc: 'O Teshub emite uma ordem molecular focada em um alvo a até 24 metros. O alvo deve fazer uma RES de Inteligência (CD 23). Se falhar, sofre 20 de dano elétrico e perde imediatamente seu espaço de magia de maior nível disponível (até o 5º nível). Se o alvo não for um conjurador, ele perde 2 recursos marciais equivalentes de sua classe (como dados de superioridade ou pontos de ki).',
      },
      {
        nome: 'Éter superaquecido (Recarga 5T)',
        desc: 'O Teshub transforma o ar da arena em plasma combustível em uma área cilíndrica de 9 metros de raio por 12 metros de altura a até 30 metros de distância. Todas as criaturas na área sofrem 70 (20d6) de dano dividido igualmente entre Radiante e Elétrico. Além disso, as vítimas sofrem 10 de dano de plasma contínuo no início de cada um de seus turnos por 1 minuto. Uma RES de Destreza (CD 23) reduz o dano inicial à metade e evita o dano contínuo.',
      },
      {
        nome: 'Salto de pressão',
        desc: 'O monstro flutua e se desloca até metade de seu deslocamento sem provocar ataques de oportunidade, alterando instantaneamente a pressão do ar ao seu redor.',
      },
      {
        nome: 'Dreno ionizado',
        desc: 'O Teshub escolhe uma criatura a até 18 metros. O alvo deve passar em uma RES de Sabedoria (CD 23) ou perderá um espaço de magia de 3º nível ou inferior.',
      },
      {
        nome: 'Onda de choque térmica (2 ações)',
        desc: 'O monstro faz o coração elétrico de seu peito pulsar, liberando uma explosão de plasma em um raio de 6 metros a partir de si. Todos os alvos na área sofrem 21 de dano radiante e devem passar em uma RES de Força (CD 23) ou serão arremessados 6 metros para trás e ficarão sob a condição Caído.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '15',
      visaoEscuro: 'Visão Verdadeira 36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Coração de Relâmpago Azul',
      },
      {
        range: '2',
        item: 'Couro Imperial Cinza-Chumbo',
      },
      {
        range: '3',
        item: 'Par de Garras de Diamante Negro Supremo',
      },
      {
        range: '4',
        item: 'Essência de Plasma Superaquecido',
      },
    ],
  },
  salamancerTerra: {
    name: 'Salamancer (Terra)',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/Ikab8Zz.png',
    image: 'https://2img.net/i.imgur.com/onSoJYR.jpeg',
    subtitle: 'CR1',
    description: `A conduta do Salamancer Telúrico em combate é pautada pela paciência territorial e pelo soterramento. O espécime costuma se misturar perfeitamente aos paredões de pedra bruta das cavernas devido à carapaça basáltica que cobre suas costas. Sua aproximação raramente é vista, sendo anunciada pelo tremor característico do solo e pelo som de brita sendo esmagada sob suas patas atarracadas.

Sua tática defensiva baseia-se na ancoragem gravitacional de seu peso biológico. Uma vez fixado ao solo, o monstro torna-se uma estrutura praticamente imóvel, resistindo a empurrões, correntes de vento ou feitiços que tentem movê-lo de sua posição. A criatura golpeia o solo para gerar ondas de choque localizadas que arremessam os combatentes ao chão e estilhaçam a concentração dos conjuradores de retaguarda, impedindo a manutenção de barreiras mágicas enquanto ela avança para desferir sua mordida corrosiva.`,
    type: 'Monstro Pequeno, Draco',
    ac: '14',
    hp: '22 (4d6 + 8)',
    speed: '9 metros, escavação 6 metros.',
    stats: {
      forca: '14 (+2)',
      destreza: '10 (+0)',
      constituicao: '15 (+2)',
      inteligencia: '4 (-3)',
      sabedoria: '12 (+1)',
      carisma: '6 (-2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Salamancer Telúrico for alvo de dano causado por magias ou efeitos do elemento Terra (dano de Concussão mágico proveniente de pedras ou lama), ele não sofre dano. A matéria molda seus tecidos de forma imediata, fazendo-o recuperar 5 Pontos de Vida.',
      },
      {
        nome: 'Imunidade',
        desc: 'Petrificado, Caído.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Vento',
      },
      {
        nome: 'Placa de geodo',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua couraça traseira, reduzindo a CA do monstro para 10 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 2 de dano perfurante automático devido às farpas de cristal reativas que saltam de seu peito.',
      },
      {
        nome: 'Ancoragem gravitacional',
        desc: 'O peso biológico do monstro o prende firmemente ao solo. O Salamancer Telúrico possui imunidade contra qualquer efeito mágico ou físico que tente empurrá-lo, puxá-lo ou forçá-lo a ficar Caído, desde que esteja em contato com o chão de terra ou pedra.',
      },
    ],
    acoes: [
      {
        nome: 'Mordida de brita',
        desc: 'Ataque Corpo a Corpo Físico: +4 para acertar, alcance 1 metros. Dano: 5 (1d6 + 2) de dano de concussão mais 2 (1d4) de dano de ácido devido à saliva corrosiva que amacia as rochas que ele consome',
      },
      {
        nome: 'Pulsação sísmica (Recarga 5T)',
        desc: 'O monstro golpeia o solo com suas patas dianteiras, gerando uma onda de choque em um raio de 3 metros. Cada criatura na área deve passar em uma RES de Destreza (CD 12). Falha: Sofre 4 (1d8) de dano de concussão, fica Caída e sua velocidade é reduzida à metade até o início do próximo turno do monstro. Conjuradores que estejam concentrados em uma magia falham automaticamente no teste de concentração devido ao tremor. Sucesso: Metade do dano e evita as penalidades de movimento e queda.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '11',
      visaoEscuro: 'Sentido Sísmico 9 metros, Visão no Escuro 18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Lasca de Geodo Pulsante',
      },
      {
        range: '2',
        item: 'Couro de Argila Maleável',
      },
      {
        range: '3',
        item: 'Glândula de Lama Densa',
      },
      {
        range: '4',
        item: 'Presa de Quartzo Bruto',
      },
    ],
  },
  dracoSismico: {
    name: 'Draco sísmico',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/NY0miyj.png',
    image: 'https://2img.net/i.imgur.com/gx4i07e.jpeg',
    subtitle: 'CR5',
    description: `A conduta do Draco Sísmico em combate é pautada pelo esmagamento por posicionamento e pela negação de mobilidade. A fera move-se com uma lentidão calculada, mas cada passo de suas patas atarracadas descarrega toneladas de força cinética na rocha. Esse peso absurdo faz com que o solo ao redor de seu perímetro rache, colapse e se transforme instantaneamente em terreno difícil e instável, sabotando a capacidade de esquiva e o deslocamento rápido dos invasores.

Sua agressividade manifesta-se através de patadas brutais voltadas para quebrar a estabilidade das linhas avançadas. Ao erguer seus membros dianteiros e golpear a rocha, o draco abre fendas moleculares que viajam pela terra. O impacto dessa ruptura projeta uma onda de choque severa que arremessa os combatentes ao chão e gera um abalo tão violento no organismo das vítimas que cinde instantaneamente seus canais de estamina e quebra o foco de conjuração dos especialistas mágicos, destruindo suas defesas antes mesmo do avanço físico da besta.`,
    type: 'Monstro Grande, Draco',
    ac: '16',
    hp: '95 (10d10 + 40)',
    speed: '9 metros, escavação 9 metros.',
    stats: {
      forca: '20 (+5)',
      destreza: '12 (+1)',
      constituicao: '19 (+4)',
      inteligencia: '4 (-3)',
      sabedoria: '14 (+2)',
      carisma: '6 (-2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Draco Sísmico for alvo de dano causado por magias ou efeitos do elemento Terra, ele não sofre dano. A matéria reconstitui seus tecidos de forma imediata, fazendo-o recuperar 15 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Petrificado, Caído, Agarrado.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Vento',
      },
      {
        nome: 'Matriz terracota',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua couraça traseira, reduzindo a CA do monstro para 11 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 6 de dano perfurante automático pelas farpas de rocha reativas de seu peito.',
      },
      {
        nome: 'Epicentro corporal',
        desc: 'O peso absurdo do corpo do monstro quebra a estabilidade do solo. Sempre que o Draco Sísmico se mover ou desferir um ataque, a área a até 3 metros dele se transforma instantaneamente em Terreno Difícil devido ao estofamento e estilhaçamento da pedra ao redor, limitando a capacidade de esquiva das criaturas.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Draco Sísmico realiza dois ataques: uma Patada Esmagadora e uma Mordida Sólida.',
      },
      {
        nome: 'Patada esmagadora',
        desc: 'Ataque Corpo a Corpo Físico: +8 para acertar, alcance 1 metros. Dano: 14 (2d8 + 5) de dano de concussão. O alvo deve passar em uma RES de Força (CD 15) ou ficará sob a condição Caído.',
      },
      {
        nome: 'Mordida sólida',
        desc: 'Ataque Corpo a Corpo Físico: +8 para acertar, alcance 1 metros. Dano: 12 (2d6 + 5) de dano perfurante mais 4 (1d8) de dano de ácido.',
      },
      {
        nome: 'Ruptura de falha (Recarga 5T)',
        desc: 'O Draco desfere uma patada brutal no solo, abrindo rachaduras moleculares em um cone de 6 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 15).  Falha: Sofre 22 (5d8) de dano de concussão e perde instantaneamente seu espaço de magia de menor nível disponível devido ao choque violento que abala sua estabilidade. Se o alvo não for um conjurador, perde 1 dado de superioridade ou recurso marcial equivalente de sua classe.  Sucesso: Metade do dano e evita a perda de recursos.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: 'Sentido Sísmico 12 metros, Visão no Escuro 18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Placa de Granito Maciço',
      },
      {
        range: '2',
        item: 'Couro Terracota Estriado',
      },
      {
        range: '3',
        item: 'Núcleo Sísmico Compacto',
      },
      {
        range: '4',
        item: 'Sangue de Argila Concentrado',
      },
    ],
  },
  megalania: {
    name: 'Megalania',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/dZPKYaA.png',
    image: 'https://2img.net/i.imgur.com/CFJPhgd.jpeg',
    subtitle: 'CR10',
    description: `A conduta da Megalania em caçadas é assustadoramente metódica. Ela exibe um corpo teso, magro e desprovido de qualquer gordura, movendo-se com uma graciosidade sinuosa que desafia a rigidez do elemento terra. A fera possui a capacidade única de se misturar e rastejar por baixo de detritos, terra solta e pedregulhos sem perder sua aceleração, utilizando essa camuflagem mineral para obter cobertura total contra ataques e flanquear a retaguarda dos conjuradores de surpresa.

Suas ferramentas de caça mais letais são suas garras de diamante negro orgânico. Essas estruturas indestrutíveis são capazes de rasgar a rocha sólida como se fosse argila mole. A Megalania abre fendas profundas na terra com um único golpe, criando armadilhas geográficas instantâneas que engolem os membros dos combatentes e quebram a formação das linhas de defesa.`,
    type: 'Monstro Grande, Draco',
    ac: '18',
    hp: '+152 (16d10 + 64)',
    speed: '15 metros, escavação 12 metros, escalada 12 metros.',
    stats: {
      forca: '22 (+6)',
      destreza: '18 (+4)',
      constituicao: '18 (+4)',
      inteligencia: '4 (-3)',
      sabedoria: '14 (+2)',
      carisma: '6 (-2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Megalania for alvo de dano causado por magias ou efeitos do elemento Terra, ela não sofre dano. A matéria rochosa reconstitui seus tecidos instantaneamente, fazendo-a recuperar 25 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Caído, Impedido, Petrificado.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Vento',
      },
      {
        nome: 'Firmeza terracota',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua couraça, reduzindo a CA do monstro para 13 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 10 de dano perfurante automático devido às farpas de quartzo cristalizadas que saltam de sua derme.',
      },
      {
        nome: 'Fluidez de escombros',
        desc: 'A Megalania ignora completamente penalidades de Terreno Difícil provocado por pedras, terra ou desabamentos. Além disso, ela pode utilizar sua velocidade de escavação para se mover por baixo de detritos e rochas soltas sem perder aceleração. Enquanto estiver submersa nos escombros, ela ganha Cobertura Total contra ataques vindos de cima.',
      },
      {
        nome: 'Garras tectonicidade',
        desc: 'As garras da Megalania são compostas por diamante negro orgânico. Os ataques físicos da criatura ignoram qualquer resistência a danos não-mágicos e causam o dobro de dano contra estruturas, barreiras de pedra ou alvos sob a condição Caído.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Megalania realiza três ataques: duas Garras de Diamante e uma Mordida Mutiladora.',
      },
      {
        nome: 'Garras de diamante',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 1 metros. Dano: 15 (2d8 + 6) de dano cortante. Se o alvo já estiver sob a condição Caído ou Impedido, o dano aumenta para 24 (4d8 + 6).',
      },
      {
        nome: 'Mordida mutiladora',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 1 metros. Dano: 17 (2d10 + 6) de dano perfurante. O alvo deve passar em uma RES de Força (CD 18) ou será jogado ao chão, recebendo a condição Caído.',
      },
      {
        nome: 'Fenda aprisionadora (Recarga 5T)',
        desc: 'A Megalania crava suas garras de diamante no solo e rasga a rocha sólida em velocidade impressionante, abrindo fendas profundas em uma linha de 9 metros de comprimento por 1 metros de largura. Cada criatura na área deve fazer uma RES de Destreza (CD 18).  Falha: Sofre 27 (6d8) de dano de concussão, tem suas pernas engolidas pela fenda, ficando sob as condições Caído e Impedido. O impacto violento e o esmagamento dos membros fazem com que o alvo perca instantaneamente seu espaço de magia (Spell Slot) de menor nível disponível. Se não for um conjurador, perde 1 recurso marcial de classe.  Sucesso: Metade do dano e evita as condições e a perda de recursos.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: 'Sentido Sísmico 18 metros, Visão no Escuro 24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Garra de Diamante Negro Orgânico',
      },
      {
        range: '2',
        item: 'Couro Terracota Cristalizado',
      },
      {
        range: '3',
        item: 'Glândula de Aceleração Sísmica',
      },
      {
        range: '4',
        item: 'Cristais de Quartzo de Suor Condensado',
      },
    ],
  },
  titanoboa: {
    name: 'Titanoboa',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/urBdEl7.png',
    image: 'https://2img.net/i.imgur.com/oYz1zpe.jpeg',
    subtitle: 'CR15',
    description: `A conduta da Titanoboa em combate é descrita como um evento de pânico sísmico inevitável. Graças à sua biologia única, ela desliza pelo subsolo rochoso com a mesma facilidade com que uma criatura marinha cruza as águas, movendo suas toneladas de peso sem sofrer desaceleração pela solidez da pedra. A serpente costuma circular por baixo das estruturas de vanguarda, desestabilizando as fundações do solo até criar imensas crateras de subsidência que engolem os combatentes de surpresa.

Quando emerge do solo devastado, seu método de execução é puramente físico e asfixiante. A fera fecha seu bote envolvendo as vítimas em espirais concêntricas, aplicando uma pressão esmagadora de toneladas por centímetro quadrado. Essa constrição biológica é tão violenta que colapsa instantaneamente barreiras místicas protetoras, tritura a integridade de armaduras de aço e obstrui as vias respiratórias das presas, impedindo qualquer reação física ou mística enquanto os ossos são pulverizados.`,
    type: 'Monstro Grande (Compacto), Draco',
    ac: '20',
    hp: '+230 (20d10 + 120)',
    speed: '12 metros, escavação 12 metros.',
    stats: {
      forca: '26 (+8)',
      destreza: '14 (+2)',
      constituicao: '22 (+6)',
      inteligencia: '4 (-3)',
      sabedoria: '16 (+3)',
      carisma: '6 (-2)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Titanoboa for alvo de dano causado por magias ou efeitos do elemento Terra, ela não sofre dano. A matéria molda seus tecidos imediatamente, fazendo-a recuperar 35 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Veneno, Caído, Impedido, Agarrado, Petrificado, Envenenado.',
      },
      {
        nome: 'Resistência',
        desc: 'Concussão, Perfurante e Cortante de ataques mágicos.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Vento',
      },
      {
        nome: 'Derme de âmbar',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua couraça, reduzindo a CA do monstro para 14 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 12 de dano de concussão automático pela retaliação da densidade muscular da fera.',
      },
      {
        nome: 'Fluidez litofágica',
        desc: 'A Titanoboa consegue deslizar pelo subsolo rochoso como se a pedra fosse água pura. Ela não sofre penalidades por terreno difícil baseado em rochas ou terra e não provoca ataques de oportunidade ao submergir ou emergir do solo.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'pode realizar até três ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Titanoboa realiza dois ataques: uma Mordida Calcária e um Bote Envolvente.',
      },
      {
        nome: 'Mordida calcária',
        desc: 'Ataque Corpo a Corpo Físico: +13 para acertar, alcance 3 metros. Dano: 19 (2d10 + 8) de dano perfurante mais 9 (2d8) de dano de terra.',
      },
      {
        nome: 'Bote envolvente',
        desc: 'Ataque Corpo a Corpo Físico: +13 para acertar, alcance 3 metros. Dano: 15 (2d6 + 8) de dano de concussão. Se o alvo for uma criatura de porte Grande ou menor, ele é agarrado (CD 21 para escapar). Até o agarre terminar, o alvo fica sob a condição Impedido, começa a sufocar por falta de ar e a Titanoboa não pode usar o Bote Envolvente em outra criatura.',
      },
      {
        nome: 'Prensa biológica',
        desc: 'O monstro aplica uma pressão de toneladas por centímetro quadrado contra uma criatura que já esteja agarrada por seu Bote Envolvente. O alvo sofre 35 (6d8 + 8) de dano de concussão bruto. Quaisquer escudos mágicos, barreiras arcanas ou Pontos de Vida Temporários ativos no alvo são instantaneamente destruídos. O impacto violento força o alvo a perder seu espaço de magia de menor nível disponível. Se não for um conjurador, perde 1 dado de superioridade, ponto de ki ou recurso marcial equivalente de sua classe.',
      },
      {
        nome: 'Subsidência subterrânea (Recarga 5T)',
        desc: 'A Titanoboa escava rapidamente em círculos sob o solo rochoso abaixo de um ponto a até 15 metros, criando uma cratera de subsidência com 4 metros de raio. O chão desaba instantaneamente. Cada criatura na área deve fazer uma RES de Destreza (CD 21).  Falha: Sofre 45 (10d8) de dano de concussão, cai em uma fenda de 3 metros de profundidade (ficando sob as condições Caído e Impedido) e perde um espaço de magia (Spell Slot) de menor nível disponível devido ao colapso molecular do impacto.  Sucesso: Metade do dano e evita as condições de queda e aprisionamento.',
      },
      {
        nome: 'Deslizar rochoso',
        desc: 'O monstro move-se até metade de seu deslocamento de escavação através da pedra sólida sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Constrição progressiva',
        desc: 'A Titanoboa contrai seus músculos de âmbar, causando 15 de dano de concussão bruto automático a uma criatura agarrada por suas espirais.',
      },
      {
        nome: 'Abalo de cauda (2 ações)',
        desc: 'A serpente golpeia sua cauda de obsidiana contra o solo. Todas as criaturas a até 3 metros dela devem passar em uma RES de Força (CD 21) ou ficarão sob a condição Caído.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: 'Sentido Sísmico 24 metros, Visão no Escuro 24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Placa Dorsal de Obsidiana',
      },
      {
        range: '2',
        item: 'Couro Marrom Vascularizado',
      },
      {
        range: '3',
        item: 'Coração de Âmbar Sísmico',
      },
      {
        range: '4',
        item: 'Ampola de Plasma Fluido Âmbar',
      },
    ],
  },
  tarasca: {
    name: 'Tarasca',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/EdZAxJw.png',
    image: 'https://2img.net/i.imgur.com/zD6kmS8.jpeg',
    subtitle: 'CR20',
    description: `A conduta da Tarasca em combate é de uma brutalidade imponente e inevitável. Ela rasteja rente ao solo com suas quatro patas titânicas, utilizando seu imenso peso para moer a pedra sob seu ventre terracota nu. O aspecto mais aterrorizante de sua fisiologia é a capacidade de absorver cem por cento do impacto dos ataques físicos desferidos contra ela. Sempre que lâminas ou martelos atingem seu corpo, a energia do golpe é armazenada; seus feixes musculares frontais expandem-se, a derme endurece e o sangue de ouro fluido ferve nas fissuras da carne viva, aumentando de forma devastadora a potência de seus próximos botes.

Para sustentar essa massa muscular absurda em tempo real, a Tarasca pratica a litofagia de combate. Caso sofra ferimentos profundos em sua derme exposta, a fera simplesmente abre sua mandíbula de proporções colossais e arranca pedaços inteiros do cenário, engolindo rochas, pilares de pedra ou escombros do ambiente. O estômago da criatura processa os minerais de forma instantânea, canalizando a densidade da terra para fechar feridas abertas e regenerar seus tecidos biológicos em segundos, prolongando o confronto indefinidamente.`,
    type: 'Monstro Colossal, Draco',
    ac: '25',
    hp: '+418 (28d20 + 124)',
    speed: '15 metros, escavação 12 metros.',
    stats: {
      forca: '28 (+9)',
      destreza: '14 (+2)',
      constituicao: '26 (+8)',
      inteligencia: '5 (-3)',
      sabedoria: '16 (+3)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que a Tarasca for alvo de dano causado por magias ou efeitos do elemento Terra, ela não sofre dano. A matéria molda seus tecidos imediatamente, fazendo-a recuperar 50 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Concussão, Perfurante e Cortante de ataques não-mágicos; Fogo, Veneno, Caído, Impedido, Agarrado, Petrificado, Atordoado, Envenenado, Paralisado.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Vento',
      },
      {
        nome: 'Vascularização áurea',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua blindagem traseira, reduzindo a CA do monstro para 16 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 20 de dano radiante automático pelo refluxo do sangue áureo incandescente.',
      },
      {
        nome: 'Reciclagem cinética',
        desc: 'A biologia da Tarasca armazena a energia dos impactos recebidos. Sempre que o monstro sofrer dano físico (Concussão, Perfurante ou Cortante), 100% desse valor é convertido em Pontos de Carga Cinética. Para cada 50 pontos acumulados, a musculatura frontal da criatura se expande e endurece, concedendo um bônus de +2 em sua próxima jogada de dano corporal e aumentando sua CA frontal em +1. Toda a energia acumulada é descarregada logo após o seu próximo ataque bem-sucedido.',
      },
      {
        nome: 'Ações lendárias',
        desc: 'Pode realizar até 3 ações por rodada',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'A Tarasca realiza três ataques: uma Mandíbula Terrestre e dois Impactos de Massa.',
      },
      {
        nome: 'Mandíbula terrestre',
        desc: 'Ataque Corpo a Corpo Físico: +15 para acertar, alcance 3 metros. Dano: 24 (3d10 + 9) de dano perfurante. O monstro pode optar por direcionar este ataque contra uma estrutura ou pedaço do cenário de pedra; ao engolir a matéria do ambiente, a Tarasca regenera 40 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Impacto de massa',
        desc: 'Ataque Corpo a Corpo Físico: +15 para acertar, alcance 3 metros. Dano: 19 (3d6 + 9) de dano de concussão. O alvo deve passar em uma RES de Força (CD 23) ou ficará sob a condição Caído.',
      },
      {
        nome: 'Rugido de ruptura (Recarga 5T)',
        desc: 'A Tarasca emite um brado ensurdecedor que distorce a gravidade ao seu redor. Todas as criaturas a até 9 metros devem realizar uma RES de Constituição (CD 23).  Falha: Sofre 45 (10d8) de dano de trovão, tem todos os seus escudos mágicos, barreiras arcanas ou Pontos de Vida Temporários instantaneamente estilhaçados e destruídos. Além disso, o colapso drena o espaço de magia de maior nível disponível do alvo (até o 5º nível). Se a vítima não for um conjurador, perde 2 recursos marciais de sua classe (como dados de superioridade ou pontos de ki).  Sucesso: Metade do dano e evita o estilhaçamento e a perda de recursos.',
      },
      {
        nome: 'Avanço sinuoso',
        desc: 'O monstro move-se até metade de seu deslocamento terrestre sem provocar ataques de oportunidade.',
      },
      {
        nome: 'Contração reativa',
        desc: 'A Tarasca tensiona seus músculos trincados, gerando instantaneamente 25 Pontos de Carga Cinética para a sua habilidade passiva.',
      },
      {
        nome: 'Triturar solo (2 ações)',
        desc: 'A criatura executa um ataque rápido de Mandíbula Terrestre contra o solo ou escombros ao seu alcance para ativar sua regeneração tecidual.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: 'Sentido Sísmico 36 metros, Visão no Escuro 24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Placa de Rocha Matriz Indestrutível',
      },
      {
        range: '2',
        item: 'Coração de Ouro Fluido',
      },
      {
        range: '3',
        item: 'Presa de Apetite Cataclísmico',
      },
      {
        range: '4',
        item: 'Ampola de Plasma Áureo Regenerativo',
      },
    ],
  },
  terris: {
    name: 'Terris',
    rarity: 'Comum',
    icon: 'https://2img.net/i.imgur.com/N4rRFm6.png',
    image: 'https://2img.net/i.imgur.com/pKQnoWq.jpeg',
    subtitle: 'CR 5',
    description: `A conduta da Terris em combate afasta-se completamente da selvageria mundana. Ela se posiciona na arena mantendo sua cauda pesada firmemente ancorada, exibindo uma derme marrom-terracota totalmente nua na região frontal, rasgada por linhas geométricas alaranjadas que brilham à medida que seu intelecto processa o ambiente. O suor que ferve em seus músculos tensionados mistura-se a uma poeira dourada suspensa, indicando o estresse cinético de sua manipulação geomântica.

Sua principal função tática é o controle absoluto do perímetro e a sabotagem da retaguarda. Através da leitura de mana, a criatura ignora qualquer barreira física ou obstrução de pedra para conjurar seus feitiços. Com uma única sentença, ela transmuta blocos de rocha sólida em sorvedouros de areia movediça densa, prendendo os combatentes em um aprisionamento imóvel e doloroso. Aqueles que permanecem nessas zonas têm suas forças exauridas continuamente enquanto a areia tenta tragá-los para o subsolo.`,
    type: 'Monstro Médio (Humanoide Reptiliano)',
    ac: '15',
    hp: '+82 (11d8 + 33)',
    speed: '9 metros, escavação 6 metros.',
    stats: {
      forca: '12 (+1)',
      destreza: '14 (+2)',
      constituicao: '16 (+3)',
      inteligencia: '20 (+5)',
      sabedoria: '14 (+2)',
      carisma: '10 (+0)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Terris for alvo de dano do elemento Terra, ele não sofre dano. Em vez disso, a energia telúrica reconstitui seus canais de energia, fazendo-o recuperar 15 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Terra, Petrificado, Caído',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Vento',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Dracônico.',
      },
      {
        nome: 'Matriz terracota',
        desc: 'Qualquer ataque físico focado diretamente em sua frente reduz a CA do monstro para 12 contra aquele golpe específico. No entanto, o atacante corpo a corpo que o atingir pela frente sofre 5 de dano de terra pelo contra-choque da energia geomântica reativa.',
      },
      {
        nome: 'Leitura de mana',
        desc: 'O Terris lê as linhas de poder do campo de batalha. Ele ganha um bônus de +2 em seus testes de iniciativa e todas as suas habilidades e feitiços ignoram modificadores de cobertura de meio ou três quartos fornecidos por rochas, muros ou elevações do solo.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Terris realiza um ataque de Garra Geomântica e utiliza uma de suas Linhas de Comando.',
      },
      {
        nome: 'Garra geomantica',
        desc: 'Ataque Corpo a Corpo Mágico: +8 para acertar, alcance 1 metros. Dano: 8 (1d6 + 5) de dano cortante mais 4 (1d8) de dano de terra.',
      },
      {
        nome: 'Sorvedouro (Recarga 5T)',
        desc: 'O Terris dita um encantamento em linguagem humana, transmutando a rocha sólida em areia movediça em uma área com 3 metros de raio a até 18 metros de distância. Cada criatura na área deve fazer uma RES de Força (CD 15). Falha: Sofre 13 (3d8) de dano de terra e fica sob a condição Enraizado até o início do próximo turno do Terris. Sucesso: Metade do dano e evita a perda de movimento.',
      },
      {
        nome: 'Ejeção rúnica',
        desc: 'O Terris ergue um pilar de rocha afiada diretamente abaixo dos pés de um alvo a até 15 metros de distância. Se o alvo for um conjurador, a pressão quebra seu foco. O alvo deve realizar uma RES de Destreza (CD 15).  Falha: Sofre 18 (4d8) de dano perfurante, é erguido 3 metros no ar e perde instantaneamente seu espaço de magia de menor nível disponível devido ao colapso de sua conexão rúnica. Se não for um conjurador, perde 1 dado de superioridade ou recurso marcial equivalente.  Sucesso: Metade do dano e evita a perda do espaço de magia ou recurso.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '12',
      visaoEscuro: 'Sentido Sísmico 12 metros, Visão no Escuro 18 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Cristal Geomântico Alaranjado',
      },
      {
        range: '2',
        item: 'Couro Terracota Polvilhado',
      },
      {
        range: '3',
        item: 'Fragmento de Cauda Pesada',
      },
      {
        range: '4',
        item: 'Destilado de Suor Áureo',
      },
    ],
  },
  gorgone: {
    name: 'Gorgone',
    rarity: 'Incomum',
    icon: 'https://2img.net/i.imgur.com/raMDTv2.png',
    image: 'https://2img.net/i.imgur.com/j4VmAVH.jpeg',
    subtitle: 'CR 10',
    description: `A conduta do Gorgone em combate é marcada por uma paciência sádica e soberana. O espécime flutua ou caminha lentamente pela arena, utilizando placas de pedra bruta para cobrir suas regiões vitais enquanto exibe seus feixes musculares expostos à estase. O suor que ferve em sua carne viva solidifica-se em padrões geométricos de jaspe reativo, uma resposta biológica direta ao estresse da manipulação molecular.

Sua principal arma tática é a exalação da Bruma de Calcário. O Gorgone inunda o perímetro com uma névoa cinzenta espessa que ataca as articulações e a respiração dos invasores. Aqueles que respiram ou entram em contato com essa poeira sofrem uma desaceleração imediata de suas funções motoras, iniciando um processo de calcificação celular. Se a exposição persistir sem a intervenção de purificações místicas ou elixires de cura rápidos, a carne da vítima endurece por completo, transformando o indivíduo permanentemente em uma estátua de pedra sem vida.`,
    type: 'Monstro Médio (Humanoide Reptiliano)',
    ac: '18',
    hp: '+152 (16d8 + 80)',
    speed: '9 metros, natação 9 metros.',
    stats: {
      forca: '14 (+2)',
      destreza: '16 (+3)',
      constituicao: '20 (+5)',
      inteligencia: '22 (+6)',
      sabedoria: '16 (+3)',
      carisma: '12 (+1)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Gorgone for alvo de dano do elemento Terra, ele não sofre dano. A matéria mineral reconecta sua estrutura imediatamente, fazendo-o recuperar 25 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Terra, Veneno, Petrificado, Envenenado, Paralisado, Atordoado.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Vento',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Dracônico',
      },
      {
        nome: 'Jaspe geométrico',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora a armadura principal, reduzindo a CA para 14 contra aquele golpe específico. No entanto, o agressor corpo a corpo sofre 8 de dano de terra automático pelo estilhaço dos cristais de jaspe reativos.',
      },
      {
        nome: 'Voto de calcário',
        desc: 'A fala humana fria e calculada do Gorgone interfere no fluxo biológico e rúnico ao redor. Criaturas sob a condição Desacelerado ou que estejam com partes do corpo petrificadas sofrem desvantagem em testes de resistência de Inteligência, Sabedoria e Carisma.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Gorgone realiza um ataque de Chicotada de Obsidiana e utiliza o Estalo Estático.',
      },
      {
        nome: 'Chicotada de obsidiana',
        desc: 'Ataque Corpo a Corpo Físico: +10 para acertar, alcance 3 metros. Dano: 13 (2d6 + 6) de dano de concussão mais 7 (2d6) de dano de terra.',
      },
      {
        nome: 'Estalo estático',
        desc: 'O Gorgone dita uma heresia temporal focada em um alvo a até 18 metros. O alvo deve fazer uma RES de Sabedoria (CD 18). Se falhar, sofre 14 de dano de terra e perde seu espaço de magia de menor nível disponível devido ao endurecimento mental. Se não for um conjurador, perde 1 recurso marcial equivalente (como dado de superioridade ou ponto de ki).',
      },
      {
        nome: 'Bruma de calcário (Recarga 5T)',
        desc: 'O Gorgone exala uma densa névoa cinzenta em uma área esférica de 6 metros de raio a até 15 metros de distância. A névoa permanece por 1 minuto. Qualquer criatura que entrar ou iniciar o turno na área deve realizar uma RES de Constituição (CD 18). Falha: Sua velocidade é reduzida à metade (status Desacelerado) e inicia a calcificação. Se falhar por 5 ou mais pontos, fica sob o status Petrificação Progressiva: a criatura deve repetir o teste no fim de seu próximo turno; uma nova falha a transforma permanentemente em pedra (Petrificado). Sucesso: Evita os efeitos.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: 'Sentido Sísmico 18 metros, Visão no Escuro 24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Coração de Cristal Verde',
      },
      {
        range: '2',
        item: 'Placa de Pedra Marrom-Escura',
      },
      {
        range: '3',
        item: 'Mecha de Cabelo de Serpente',
      },
      {
        range: '4',
        item: 'Fragmento de Jaspe Geométrico',
      },
    ],
  },
  catoblepas: {
    name: 'Catoblepas',
    rarity: 'Raro',
    icon: 'https://2img.net/i.imgur.com/sM3gT6R.png',
    image: 'https://2img.net/i.imgur.com/XVtfSpF.jpeg',
    subtitle: 'CR 15',
    description: `A mera proximidade com o Catoblepas testa os limites da sanidade das comitivas avançadas. A região frontal de seu corpo é uma fusão exposta e grotesca de carne-viva cinza-escura e rocha, rasgada por veias grossas que pulsam com uma energia esmeralda doentia. O impacto visual dessa anatomia corrompida emana uma aura de náusea e horror tão severa que paralisa os músculos e drena o vigor dos exploradores que ousam encará-la de frente, deixando-os subjugados pelo medo antes mesmo do início das hostilidades.

Sua ferramenta mais temida é o Olhar de Calcificação Absoluta. Ao fixar suas fendas oculares em uma presa, o monstro inicia uma reação molecular em cadeia. O membro focado—seja o braço que empunha uma espada ou as pernas responsáveis pela fuga—começa a endurecer instantaneamente, transformando-se em calcário cinzento. Se o alvo permanecer sob o foco visual da besta sem a intervenção de magias de purificação de alta linhagem, o endurecimento expande-se por todo o organismo, convertendo o indivíduo em uma estátua permanente de pedra destinada ao esquecimento.`,
    type: 'Monstro Grande, draco',
    ac: '21',
    hp: '+230 (20d10 + 100)',
    speed: '12 metros.',
    stats: {
      forca: '20 (+5)',
      destreza: '14 (+2)',
      constituicao: '20 (+5)',
      inteligencia: '22 (+6)',
      sabedoria: '16 (+3)',
      carisma: '18 (+4)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Catoblepas for alvo de dano do elemento Terra, ele não sofre dano. A matéria mineral reconecta sua estrutura imediatamente, fazendo-o recuperar 35 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Terra, Veneno, Necrótico, Petrificado, Envenenado, Paralisado, Atordoado, Impedido.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'vento',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dialeto Dracônico',
      },
      {
        nome: 'Anatotmia exposta',
        desc: 'Qualquer criatura que inicie seu turno a até 9 metros do Catoblepas e possa vê-lo deve passar em uma RES de Constituição (CD 19) ou ficará sob a condição Envenenada até o início de seu próximo turno devido à náusea e ao horror visceral da visão. Se o teste falhar por 5 ou mais pontos, o alvo também ficará sob a condição Amedrontada pelo mesmo período.',
      },
      {
        nome: 'Ocaso mineral',
        desc: 'O metal das armaduras e escudos de alvos atingidos pelas habilidades ou ataques do Catoblepas é transmutado temporariamente em pedra frágil. Sempre que uma criatura sofrer dano de terra vindo deste monstro, sua CA é reduzida em 2 cumulativamente até o fim de seu próximo turno. Além disso, qualquer dano físico de concussão desferido contra um alvo sob este efeito é dobrado devido à fragilidade da estrutura calcificada.',
      },
      {
        nome: 'Conjurador de elite',
        desc: 'O Catoblepas canaliza suas magias através de slots de energia molecular, utilizando Inteligência como seu atributo de conjuração (CD de resistência 19, +11 para acertar com ataques mágicos). Ele conhece e pode conjurar as seguintes magias temáticas, sem necessidade de componentes materiais, podendo utilizar qualquer magia de elemento terra',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Catoblepas realiza dois ataques de Lâmina de Obsidiana Transmutada ou utiliza uma de suas Linhas de Comando.',
      },
      {
        nome: 'Lâmina de obsidiana',
        desc: 'Ataque Corpo a Corpo Físico: +11 para acertar, alcance 3 metros. Dano: 18 (3d8 + 5) de dano cortante mais 9 (2d8) de dano de terra.',
      },
      {
        nome: 'Olhar de calcificação',
        desc: 'O Catoblepas foca seus olhos brilhantes em uma criatura a até 18 metros. O alvo deve realizar uma RES de Constituição (CD 19). Falha: Membros específicos se calcificam, aplicando instantaneamente as condições Desacelerado e Impedido à presa. O alvo deve repetir o teste no fim de seu próximo turno; uma nova falha o transforma permanentemente em pedra (status Petrificado). Conjuradores afetados perdem a capacidade de usar componentes gestuais de suas magias enquanto o efeito persistir. Falha por 5 ou mais: O alvo pula a etapa progressiva e fica sob a condição Petrificado de forma instantânea.',
      },
      {
        nome: 'Punição de membro',
        desc: 'O Catoblepas aponta para uma criatura Impedida ou Petrificada a até 18 metros e profere uma palavra de quebra. O alvo deve passar em uma RES de Força (CD 19) ou sofrerá 27 (6d8) de dano de concussão bruto à medida que suas articulações de pedra se estilhaçam. Se for um conjurador, ele perde instantaneamente seu espaço de magia (Spell Slot) de menor nível disponível. Se não for um conjurador, perde 2 dados de superioridade, pontos de ki ou recursos marciais equivalentes.',
      },
      {
        nome: 'Prisão de areia movediça (Recarga 5T)',
        desc: 'O Catoblepas dita uma ordem em linguagem humana pausada, transmutando o solo em uma área esférica de 6 metros de raio a até 18 metros de distância. A área torna-se terreno difícil por 1 minuto. Qualquer criatura que entrar ou iniciar o turno na área deve passar em uma RES de Força (CD 19) ou ficará sob a condição Impedida. Uma criatura pode usar sua ação para repetir o teste e tentar escapar.',
      },
      {
        nome: 'Transmutação reativa (Ação bônus Recarga 2T)',
        desc: 'Quando o Catoblepas conjura uma magia de 1º nível ou superior que alveje uma criatura Envenenada ou Impedida, ele pode usar sua ação bônus para fragilizar a armadura do alvo, reduzindo a CA do indivíduo em 1 ponto de forma cumulativa até o final do próximo turno do alvo.',
      },
      {
        nome: 'Contra-choque (Reação)',
        desc: 'Quando uma criatura atinge o Catoblepas com um ataque corpo a corpo pela frente, o monstro libera uma onda de choque de energia telúrica. O atacante deve passar em uma RES de Constituição (CD 19) ou sofrerá 10 de dano de terra e será empurrado 3 metros para trás. Se a criatura atacante já estiver Envenenada ou Impedida por seus efeitos, ela sofre 10 de dano necrótico adicional e cai sob a condição Caído.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '13',
      visaoEscuro: 'Sentido Sísmico 24 metros, Visão no Escuro 24 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Coroa de Chifres Cristalinos',
      },
      {
        range: '2',
        item: 'Escama de Obsidiana Maciça',
      },
      {
        range: '3',
        item: 'Veia Esmeralda Pulsante',
      },
      {
        range: '4',
        item: 'Fragmento de Coração de Cristal Verde',
      },
    ],
  },
  huanglong: {
    name: 'Huanglong',
    rarity: 'Lendário',
    icon: 'https://2img.net/i.imgur.com/ss6afes.png',
    image: 'https://2img.net/i.imgur.com/U7GmDGx.jpeg',
    subtitle: 'CR20',
    description: `A presença da Huanglong reescreve as leis da física na arena de combate. Enquanto bate suas asas colossais de pedra e flutua acima do solo, a névoa de poeira dourada gerada pela evaporação de seu suor mineral indica a compressão atmosférica ao seu redor. Através de sua habilidade passiva de colapso de inércia, o monstro anula completamente quaisquer defesas baseadas em esquivas automáticas ou agilidade sobrenatural das presas, forçando todos a enfrentarem o peso bruto de sua autoridade.

Sua ação mais devastadora manifesta-se através do Decreto de Graviga. Ao proferir uma ordem imperial, a Huanglong eleva a densidade molecular de um perímetro inteiro de forma instantânea. O impacto desta força esmaga o solo rochoso, fratura a estrutura óssea dos combatentes e os arremessa sob a condição de caídos, bloqueando suas reações nervosas. Complementando sua soberania, a fera é capaz de convocar o Cataclismo de Meteoros, fazendo chover blocos de minério comprimido que ignoram barreiras místicas e proteções arcanas, pulverizando os alvos sem encontrar resistência.`,
    type: 'Monstro Colossal, draco',
    ac: '24',
    hp: '+444 (24d20 + 192)',
    speed: '12 metros, vôo 18 metros (asas de pedra), escavação 12 metros',
    stats: {
      forca: '24 (+7)',
      destreza: '16 (+3)',
      constituicao: '26 (+8)',
      inteligencia: '28 (+9)',
      sabedoria: '18 (+4)',
      carisma: '22 (+6)',
    },
    habilidades: [
      {
        nome: 'Absorção',
        desc: 'Sempre que o Huanglong for alvo de dano do elemento Terra, não sofre dano. A matéria molda seus tecidos imediatamente, fazendo-o recuperar 50 Pontos de Vida de forma imediata.',
      },
      {
        nome: 'Imunidade',
        desc: 'Terra, Veneno, Necrótico; Concussão, Perfurante e Cortante de ataques não-mágicos, Petrificado, Envenenado, Paralisado, Atordoado, Impedido, Caído, Encantado.',
      },
      {
        nome: 'Vulnerabilidade',
        desc: 'Vento',
      },
      {
        nome: 'Idiomas',
        desc: 'Comum, Dracônico, Dialeto Cósmico',
      },
      {
        nome: 'Soberania imperial',
        desc: 'Qualquer ataque físico focado diretamente em sua frente ignora sua blindagem traseira de rocha, reduzindo a CA do monstro para 16 contra aquele golpe específico. No entanto, o atacante corpo a corpo sofre 20 de dano de força automático pelo refluxo da compressão gravitacional reativa de seu torso.',
      },
      {
        nome: 'Colapso de inércia',
        desc: 'O Huanglong manipula a gravidade a nível atômico. Todas as suas habilidades baseadas em esmagamento, terra ou flutuação gravitacional ignoram completamente imunidades a danos de alvos inimigos, tratando-as como resistências simples. Além disso, as criaturas na arena não se beneficiam de esquivas automáticas ou vantagens em testes de Destreza causadas por habilidades de classe enquanto estiverem a até 18 metros do monstro.',
      },
    ],
    acoes: [
      {
        nome: 'Multiataque',
        desc: 'O Huanglong realiza três ataques: um Golpe de Garra Áurea e dois Decretos Universais, ou substitui os Decretos pelo Cataclismo de Meteoros.',
      },
      {
        nome: 'Golpe de garra áurea',
        desc: 'Ataque Corpo a Corpo Mágico: +15 para acertar, alcance 3 metros. Dano: 20 (3d8 + 7) de dano cortante mais 9 (2d8) de dano de força. O impacto altera a massa da armadura do alvo, reduzindo sua velocidade de deslocamento em 3 metros cumulativamente até o fim do combate.',
      },
      {
        nome: 'Decreto de graviga',
        desc: 'O Huanglong profere uma ordem imperial em linguagem cósmica, aumentando o peso molecular de todas as criaturas em uma área esférica de 9 metros de raio a até 27 metros de distância. Cada alvo na área deve realizar uma RES de Constituição (CD 23). Falha: Sofre 45 (10d8) de dano de força bruto pelo esmagamento e fratura dos ossos, cai sob a condição Caído e fica impossibilitado de usar reações ou a característica Evasão até o final de seu próximo turno. Sucesso: Metade do dano e evita a queda e as restrições de reação.',
      },
      {
        nome: 'Cataclismo de meteoros',
        desc: 'O Huanglong ergue as mãos e faz chover meteoros de minério comprimido do teto da arena em três pontos distintos de 3 metros de raio a até 36 metros de distância. Cada criatura nas áreas escolhidas deve fazer uma RES de Destreza (CD 23). Falha: Sofre 54 (12d8) de dano de concussão tectônica. Este ataque ignora completamente quaisquer escudos mágicos, barreiras arcanas ou Pontos de Vida Temporários ativos nas presas. Sucesso: Metade do dano.',
      },
      {
        nome: 'Ancoragem atômica (Ação bônus, recarga 2T)',
        desc: 'O Huanglong altera a gravidade de um oponente que ele possa ver a até 18 metros. O alvo deve passar em uma RES de Força (CD 23) ou será puxado abruptamente contra o solo rochoso. Se o alvo for um conjurador e estiver se concentrando em uma magia, a flutuação desfaz sua estabilidade molecular, destruindo instantaneamente o seu espaço de magia (Spell Slot) de menor nível disponível.',
      },
      {
        nome: 'Refluxo de densidade (reação)',
        desc: 'Quando uma criatura terminar seu deslocamento voluntário a até 9 metros do Huanglong, o monstro pode reagir intensificando a gravidade local. O alvo deve ter sucesso em uma RES de Força (CD 23) ou sua velocidade de deslocamento será reduzida a 0 metros de forma imediata até o início de seu próximo turno.',
      },
    ],
    sentidos: {
      percepcaoPassiva: '20',
      visaoEscuro: 'Sentido Sísmico 36 metros, Visão no Escuro 36 metros',
    },
    drops: [
      {
        range: '1',
        item: 'Coração de Diamante Bruto Pulsante',
      },
      {
        range: '2',
        item: 'Escama de Rubi Imperial',
      },
      {
        range: '3',
        item: 'Fragmento de Asa de Pedra Cósmica',
      },
      {
        range: '4',
        item: 'Essência de Poeira Dourada Evaporada',
      },
    ],
  },
};

export default CreatureDB;
