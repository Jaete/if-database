const MonsterDB = {
    slimeAcido: {
        name: "Slime Ácido",
        rarity: "Comum",
        icon: "https://i.imgur.com/zGM1Mlv.png",
        image: "https://i.imgur.com/272z0Ne.jpeg",
        subtitle: "CR 1/6",
        description: "Os Slimes são criaturas básicas e instintivas, movidas apenas pela necessidade de se alimentar e sobreviver. Não possuem inteligência real e reagem de forma automática ao ambiente. Costumam ser lentos e inofensivos se não forem provocados, mas atacarão qualquer coisa que percebam como alimento. Sua agressividade é mínima, e geralmente só atacam quando se deparam com algo metálico ou que toque diretamente sua substância gelatinosa. Por serem resilientes e adaptáveis, podem ser encontrados em diversos ambientes, desde florestas úmidas até cavernas escuras.",
        type: "Monstro Médio, Gosma",
        ac: "9 (Pele Maleável)",
        hp: "9 (2d6 + 2)",
        speed: "6m",
        stats: {
            forca: "10 (+0)",
            destreza: "8 (-1)",
            constituicao: "12 (+1)",
            inteligencia: "1 (-5)",
            sabedoria: "6 (-2)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência à concussão",
                desc: "Danos de impacto são absorvidos pela gelatina"
            },
            {
                nome: "Corpo Amorfo",
                desc: "O slime pode se mover através de um espaço de até 2,5 cm de largura sem se espremer."
            },
            {
                nome: "Aderência Superficial",
                desc: "Pode escalar superfícies difíceis, inclusive teto, sem precisar de teste de habilidade."
            },
            {
                nome: "Natureza Reativa",
                desc: "Se o slime sofrer dano de um ataque corpo a corpo, o atacante recebe 1 de dano ácido residual que espirra da criatura."
            }
        ],
        acoes: [
            {
                nome: "Pancada Ácida",
                desc: "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1m. Dano: 4 (1d4 + 2) de dano ácido."
            }
        ],
        sentidos: {
            percepcaoPassiva: "8",
            visaoEscuro: "0"
        },
        drops: [
            {
                range: "1",
                item: "Nada."
            },
            {
                range: "2",
                item: "Núcleo de Gelatina Estável"
            },
            {
                range: "3",
                item: "Resíduo Viscoso"
            },
            {
                range: "4",
                item: "Restos Metálicos Corroídos"
            }
        ]
    },
    slimeDeFogo: {
        name: "Slime de Fogo",
        rarity: "Comum",
        icon: "https://i.imgur.com/YLZDdxQ.png",
        image: "https://i.imgur.com/b2Z9ogm.jpeg",
        subtitle: "CR 1/6",
        description: "Os Slimes de Fogo são criaturas instintivamente agressivas, movidas por um desejo irracional de queimar tudo ao seu redor. Diferente dos Slimes comuns, eles tendem a se mover de forma errática e inquieta, sendo atraídos por calor e materiais inflamáveis. São imprevisíveis e podem atacar qualquer coisa que se aproxime, seja por instinto de defesa ou simplesmente por contato. Apesar de sua natureza destrutiva, não possuem verdadeira malícia, apenas um comportamento caótico e impulsivo. Evitam corpos d’água e recuam instintivamente diante de ameaças aquáticas.",
        type: "Monstro médio, gosma",
        ac: "9",
        hp: "9 (2d6 + 2)",
        speed: "6m",
        stats: {
            forca: "10 (+0)",
            destreza: "8 (-1)",
            constituicao: "12 (+1)",
            inteligencia: "1 (-5)",
            sabedoria: "6 (-2)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "fogo"
            },
            {
                nome: "Vulnerabilidade",
                desc: "Água"
            },
            {
                nome: "Brilho Próprio",
                desc: "O slime emite luz plena em um raio de 1m e luz penumbra por mais 1m."
            },
            {
                nome: "Corpo Amorfo",
                desc: "Pode passar por frestas de até 2,5 cm"
            },
            {
                nome: "Combustão espontânea",
                desc: "Qualquer criatura que toque o slime ou o atinja com um ataque corpo a corpo a menos de 1m recebe 1 de dano de fogo (as fagulhas saltam no atacante)."
            },
            {
                nome: "Trilha de cinzas",
                desc: "O slime deixa uma marca de queimado por onde passa. Materiais inflamáveis (palha, papel, óleo) que ele toque se incendeiam instantaneamente."
            }
        ],
        acoes: [
            {
                nome: "Toque incandescente",
                desc: "Ataque Corpo a Corpo: +2 para acertar, alcance 1m. Dano: 4 (1d4 + 2) de dano de fogo."
            }
        ],
        sentidos: {
            percepcaoPassiva: "8",
            visaoEscuro: "4m"
        },
        drops: [
            {
                range: "1",
                item: "Nada"
            },
            {
                range: "2",
                item: "Essência ignea"
            },
            {
                range: "3",
                item: "Carvão Eterno"
            },
            {
                range: "4",
                item: "Cinza Vulcânica"
            }
        ]
    },
    slimeDeAgua: {
        name: "Slime de água",
        rarity: "Comum",
        icon: "https://i.imgur.com/oklGGWG.png",
        image: "https://i.imgur.com/Pawnr5T.jpeg",
        subtitle: "Bestiário de Salazar",
        description: "Os Slimes de Água são criaturas passivas e fluídas, geralmente evitando conflitos diretos, a menos que se sintam ameaçados. Sua natureza os torna mais adaptáveis ao ambiente, muitas vezes se camuflando em corpos d’água como lagos, rios ou até mesmo poças. São curiosos e podem seguir viajantes sem intenção hostil, movidos por estímulos externos como vibrações ou presença de umidade. No entanto, quando atacados, respondem com jatos de água, tentando desestabilizar seus oponentes em vez de causar dano letal. Apesar de sua aparência tranquila, são vulneráveis a eletricidade, recuando instintivamente diante de ameaças desse tipo.",
        type: "Monstro médio, gosma",
        ac: "10",
        hp: "9 (2d6 + 2)",
        speed: "6m",
        stats: {
            forca: "10 (+0)",
            destreza: "10 (+0)",
            constituicao: "12 (+1)",
            inteligencia: "1 (-5)",
            sabedoria: "8 (-1)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistências",
                desc: "Ácido e Fogo"
            },
            {
                nome: "Vulnerabilidade",
                desc: "Raio"
            },
            {
                nome: "Anfibio",
                desc: "O slime pode respirar tanto no ar quanto na água."
            },
            {
                nome: "Corpo Amorfo",
                desc: "Pode passar por frestas de até 2,5 cm"
            },
            {
                nome: "Trasnparência",
                desc: "Enquanto estiver submerso em água, o slime é invisível para criaturas que não tenham visão verdadeira ou sentido cego. No seco, ele concede Desvantagem em ataques à distância contra ele."
            },
            {
                nome: "Diluição",
                desc: "Se o slime sofrer dano de um ataque de concussão, ele se divide momentaneamente, reduzindo o dano em 1 (mínimo 1)."
            }
        ],
        acoes: [
            {
                nome: "Jato de Pressão",
                desc: "Ataque à Distância/Corpo a Corpo: +2 para acertar, alcance 4m. Dano: 4 (1d4 + 2) de dano de impacto."
            }
        ],
        sentidos: {
            percepcaoPassiva: "9",
            visaoEscuro: "0"
        },
        drops: [
            {
                range: "1",
                item: "Nada"
            },
            {
                range: "2",
                item: "Água Destilada Mágica"
            },
            {
                range: "3",
                item: "Vesícula de Ar"
            },
            {
                range: "4",
                item: "Limo Hidrofóbico"
            }
        ]
    },
    slimeDeGelo: {
        name: "Slime de Gelo",
        rarity: "Incomum",
        icon: "https://i.imgur.com/zHDBUjr.png",
        image: "https://i.imgur.com/4DuEjEI.jpeg",
        subtitle: "Bestiário de Salazar",
        description: "Os Slimes de Gelo são criaturas silenciosas e metódicas, movendo-se de maneira lenta, porém constante. Diferente de seus primos elementais mais agitados, eles tendem a permanecer imóveis por longos períodos, quase como se estivessem hibernando, e só reagem quando algo entra em seu território. Sua defesa natural os torna difíceis de enfrentar em combates corpo a corpo, pois qualquer toque prolongado pode resultar em congelamento. Apesar de não serem naturalmente agressivos, eles atacam qualquer fonte de calor que percebam como uma ameaça, tentando extinguir o que poderia derretê-los. Em ambientes frios, podem se esconder entre o gelo e a neve, esperando pacientemente por presas desavisadas.",
        type: "Monstro médio, Gosma",
        ac: "11",
        hp: "10 (2d6 + 4)",
        speed: "6m (9m se estiver sobre gelo ou neve)",
        stats: {
            forca: "10 (+0)",
            destreza: "6 (-2)",
            constituicao: "14 (+2)",
            inteligencia: "1 (-5)",
            sabedoria: "6 (-2)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Gelo"
            },
            {
                nome: "Absorção",
                desc: "Água"
            },
            {
                nome: "Vulnerabilidade",
                desc: "Fogo"
            },
            {
                nome: "Corpo Amorfo",
                desc: "Devido à rigidez, ele só passa por frestas de até 5 cm (em vez de 2,5 cm)"
            },
            {
                nome: "Gelo Escorregadio",
                desc: "O chão em um raio de 1m ao redor do slime é considerado Terreno Difícil. Criaturas que entrarem nessa área devem passar num teste de DES (CD 10) ou ficam Caídas."
            },
            {
                nome: "Toque Congelante",
                desc: "Qualquer criatura que atinja o slime com um ataque corpo a corpo a menos de 1m recebe 1 de dano de frio."
            }
        ],
        acoes: [
            {
                nome: "Estilhaço de gelo",
                desc: "Ataque Corpo a Corpo: +2 para acertar, alcance 1m. Dano: 4 (1d4 + 2) de dano de frio."
            }
        ],
        sentidos: {
            percepcaoPassiva: "8",
            visaoEscuro: "0"
        },
        drops: [
            {
                range: "1",
                item: "Nada"
            },
            {
                range: "2",
                item: "Gelo Eterno"
            },
            {
                range: "3",
                item: "Líquido Antifrio"
            },
            {
                range: "4",
                item: "Cristal de Geada"
            }
        ]
    },
    slimeDeTerra: {
        name: "Slime de terra",
        rarity: "Comum",
        icon: "https://i.imgur.com/x516uMj.png",
        image: "https://i.imgur.com/bc1ahcy.jpeg",
        subtitle: "Bestiário de Salazar",
        description: "Os Slimes de Terra são criaturas pacientes e resilientes, movendo-se de forma lenta, mas implacável. Diferente de outros Slimes, eles possuem um instinto territorial mais desenvolvido, muitas vezes se enterrando no solo ou se fundindo com rochas para emboscar invasores. Não costumam atacar sem motivo, mas reagem de maneira agressiva a qualquer ameaça percebida, utilizando sua força bruta para afastar o perigo. Apesar de sua aparência pesada, podem se mover de maneira surpreendentemente furtiva ao se misturarem com o terreno. São criaturas de hábitos simples, preferindo permanecer em cavernas, montanhas ou regiões áridas onde possam se camuflar facilmente.",
        type: "Monstro Médio, Gosma",
        ac: "11",
        hp: "11 (2d6 + 4)",
        speed: "5m",
        stats: {
            forca: "12 (+1)",
            destreza: "6 (-2)",
            constituicao: "14 (+2)",
            inteligencia: "1 (-5)",
            sabedoria: "8 (-1)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistências",
                desc: "Veneno e Perfuração"
            },
            {
                nome: "Vulnerabilidade",
                desc: "Água/Ácido"
            },
            {
                nome: "Sentidos",
                desc: "Sentido Sísmico 9m"
            },
            {
                nome: "Corpo Amorfo",
                desc: "Devido às pedras internas, ele só passa por frestas de até 5 cm."
            },
            {
                nome: "Firmeza rochosa",
                desc: "O slime tem Vantagem em testes de resistência para não ser empurrado ou derrubado (caído)."
            },
            {
                nome: "Camuflagem terrosa",
                desc: "Enquanto estiver parado em terreno de terra, lama ou pedra, o slime tem Vantagem em testes de Furtividade para se esconder."
            }
        ],
        acoes: [
            {
                nome: "Pancada de cascalho",
                desc: "Ataque Corpo a Corpo: +3 para acertar, alcance 1m. Dano: 4 ($1d4 + 2$) de dano de concussão."
            }
        ],
        sentidos: {
            percepcaoPassiva: "9",
            visaoEscuro: "0"
        },
        drops: [
            {
                range: "1",
                item: "Nada."
            },
            {
                range: "2",
                item: "Argila Primordial"
            },
            {
                range: "3",
                item: "Fragmento de Minério"
            },
            {
                range: "4",
                item: "Lodo Adesivo de Solo"
            }
        ]
    },
    slimeEletrico: {
        name: "Slime Elétrico",
        rarity: "Incomum",
        icon: "https://i.imgur.com/alN7S8P.png",
        image: "https://i.imgur.com/p7heenj.jpeg",
        subtitle: "CR 1",
        description: "Os Slimes Elétricos são criaturas hiperativas e imprevisíveis, movendo-se com agilidade e emitindo pequenos estalos de eletricidade a todo momento. Frequentemente encontrados em áreas de tempestades, ruínas com resquícios de energia mágica ou perto de fontes naturais de eletricidade, esses Slimes são altamente instáveis e podem descarregar energia de forma espontânea. Seu corpo constantemente gera faíscas, tornando-os perigosos para quem se aproxima sem proteção adequada. Apesar de sua aparência instável, eles tendem a ser curiosos e podem perseguir alvos sem necessariamente atacá-los, como se fossem atraídos pela energia vital de outros seres.",
        type: "Monstro médio, gosma",
        ac: "12",
        hp: "22 (5d6 + 5)",
        speed: "9m",
        stats: {
            forca: "8 (-1)",
            destreza: "14 (+2)",
            constituicao: "12 (+1)",
            inteligencia: "1 (-5)",
            sabedoria: "10 (+0)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Luminosidade",
                desc: "Emite uma luz azulada pulsante em um raio de 3m."
            },
            {
                nome: "Corpo amorfo",
                desc: "Pode passar por frestas de até 2,5 cm."
            },
            {
                nome: "Curto-circuito",
                desc: "Qualquer criatura que atinja o slime com um ataque corpo a corpo usando uma arma de metal recebe 2 de dano elétrico e não pode usar Reações até o início do seu próximo turno (o choque trava os reflexos)."
            },
            {
                nome: "Sobrecarga",
                desc: "Se o slime sofrer dano elétrico de uma fonte externa, ele não recebe dano e seu próximo ataque terá Vantagem."
            },
            {
                nome: "Resistência",
                desc: "Elétrico"
            }
        ],
        acoes: [
            {
                nome: "Toque voltaico",
                desc: "Ataque Corpo a Corpo: +4 para acertar, alcance 1.5m. Dano: 9 ($2d6 + 2$) de dano elétrico. Se o alvo estiver usando armadura de metal, o Slime tem Vantagem no teste de ataque."
            }
        ],
        sentidos: {
            percepcaoPassiva: "10",
            visaoEscuro: "18"
        },
        drops: [
            {
                range: "1",
                item: "Nada."
            },
            {
                range: "2",
                item: "Condensador de Gel"
            },
            {
                range: "3",
                item: "Fluido Condutor"
            },
            {
                range: "4",
                item: "Núcleo de Magnetita"
            }
        ]
    },
    slimeMetalico: {
        name: "Slime Metálico",
        rarity: "Incomum",
        icon: "https://i.imgur.com/Zse4dFy.png",
        image: "https://i.imgur.com/XuKuMpC.jpeg",
        subtitle: "CR 1",
        description: "Os Slimes Metálicos são considerados uma das variantes mais resistentes e perigosas da família dos Slimes elementais. Seu corpo possui uma estrutura altamente densa e maleável, capaz de endurecer instantaneamente para repelir ataques ou se transformar em lâminas afiadas para atacar. Esses Slimes são frequentemente encontrados em minas antigas, forjas abandonadas ou locais com alta concentração de metais naturais. Seu comportamento é mais defensivo do que ofensivo, atacando apenas quando ameaçados. No entanto, sua resistência excepcional e capacidade de refletir golpes os tornam adversários formidáveis, especialmente para guerreiros que dependem de armas físicas.",
        type: "Monstro médio, Gosma",
        ac: "15",
        hp: "18 (4d6 + 4)",
        speed: "4m",
        stats: {
            forca: "14 (+2)",
            destreza: "6 (-2)",
            constituicao: "12 (+1)",
            inteligencia: "1 (-5)",
            sabedoria: "10 (+0)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Cortante, Perfurante e Concussão de armas não mágicas."
            },
            {
                nome: "Imunidade",
                desc: "Veneno."
            },
            {
                nome: "Corpo amorfo",
                desc: "Devido à densidade metálica, ele passa por frestas de até 5 cm."
            },
            {
                nome: "Corrosão de metal",
                desc: "Qualquer arma feita de metal que atinja o slime sofre uma penalidade permanente e cumulativa de -1 nas jogadas de dano. Se a penalidade chegar a -5, a arma é destruída. (Armas mágicas ignoram este efeito)."
            },
            {
                nome: "Peso esmagador",
                desc: "O slime não pode ser empurrado ou derrubado por criaturas de tamanho Médio ou menor."
            }
        ],
        acoes: [
            {
                nome: "Pancada pesada",
                desc: "Ataque Corpo a Corpo: +4 para acertar, alcance 1m. Dano: 7 (1d10 + 2) de dano de concussão. Se o alvo estiver usando armadura de metal, ele deve ter sucesso em uma RES de FOR (CD 12) ou será empurrado 1m para trás e ficará Caído."
            }
        ],
        sentidos: {
            percepcaoPassiva: "10",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Nada."
            },
            {
                range: "2",
                item: "Mercúrio Estável"
            },
            {
                range: "3",
                item: "Limalha de Aço Nobre"
            },
            {
                range: "4",
                item: "Núcleo Cromado"
            }
        ]
    },
    slimeNecrotico: {
        name: "Slime necrótico",
        rarity: "Incomum",
        icon: "https://i.imgur.com/k7Jp5u8.png",
        image: "https://i.imgur.com/AkTcE0A.jpeg",
        subtitle: "CR 1/6",
        description: "Os Slimes Necróticos são manifestações corrompidas de gosmas elementais, imbuídas com a essência da morte e da decomposição. Encontrados em cemitérios profanados, criptas abandonadas e locais onde a energia sombria se acumula, esses Slimes parecem pulsar com uma energia negativa incessante. Seu corpo translúcido exala uma névoa escura, drenando a vitalidade de qualquer ser vivo próximo. Criaturas que enfrentam um Slime Necrótico podem sentir sua força vital sendo lentamente drenada, e seus ataques necróticos podem enfraquecer até os guerreiros mais robustos. Por sua conexão com forças profanas, esses Slimes são especialmente vulneráveis à luz radiante e feitiços sagrados.",
        type: "Monstro médio, gosma",
        ac: "10",
        hp: "27 (5d6 + 10)",
        speed: "6m",
        stats: {
            forca: "12 (+1)",
            destreza: "8 (-1)",
            constituicao: "14 (+2)",
            inteligencia: "1 (-5)",
            sabedoria: "10 (+0)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Necrótico e Veneno."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Radiante"
            },
            {
                nome: "Aura de quietude",
                desc: "Animais pequenos (insetos, pássaros) morrem instantaneamente ao entrar em um raio de 1m do slime."
            },
            {
                nome: "Corpo amorfo",
                desc: "Pode passar por frestas de até 2,5 cm."
            },
            {
                nome: "Miasma de decomposição",
                desc: "Qualquer criatura que comece seu turno a até 1m do slime deve ter sucesso em uma RES de CON (CD 12) ou sofrerá 2 de dano necrótico. Além disso, enquanto estiver nesta área, qualquer cura recebida pela criatura é reduzida pela metade."
            },
            {
                nome: "Presença profana",
                desc: "O slime é detectado por habilidades que sentem mortos-vivos, embora tecnicamente ainda seja uma gosma."
            }
        ],
        acoes: [
            {
                nome: "Toque putrefato",
                desc: "Ataque Corpo a Corpo: +3 para acertar, alcance 1m. Dano: 8 (2d6 + 1) de dano necrótico. O alvo deve ter sucesso em uma RES de CON (CD 11) ou seu HP máximo será reduzido em um valor igual ao dano sofrido. Essa redução dura até um descanso longo."
            }
        ],
        sentidos: {
            percepcaoPassiva: "10",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Nada."
            },
            {
                range: "2",
                item: "Essência de Miasma"
            },
            {
                range: "3",
                item: "Ectoplasma Negro"
            },
            {
                range: "4",
                item: "Fragmento de Osso Antigo"
            }
        ]
    },
    slimeVoraz: {
        name: "Slime voraz",
        rarity: "Comum",
        icon: "https://i.imgur.com/6EqAKpG.png",
        image: "https://i.imgur.com/Hefv5za.jpeg",
        subtitle: "CR 3",
        description: "Os Slimes Vorazes são o ápice da evolução instintiva, onde a simples necessidade de se alimentar transformou-se em uma fúria predatória incontrolável. Ao contrário de suas formas juvenis, o Slime Voraz não flutua calmamente; ele se move com uma massa pesada e deliberada, impulsionado por uma musculatura gelatinosa que se assemelha a tendões vivos. Sua substância, agora densa e turva, exala um vapor acre que queima os pulmões e dissolve o metal antes mesmo do contato.",
        type: "Monstro médio, gosma",
        ac: "13",
        hp: "+68 (8d8 + 32)",
        speed: "9m escalar 9m",
        stats: {
            forca: "16 (+3)",
            destreza: "10 (+0)",
            constituicao: "18 (+4)",
            inteligencia: "3 (-4)",
            sabedoria: "10 (+0)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Ácido; Concussão, Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Corpo corrosivo",
                desc: "Uma criatura que toque o slime ou o atinja com um ataque corpo a corpo a menos de 1m sofre 1d6$de dano ácido. Armas não-mágicas de metal que atinjam o slime recebem uma penalidade permanente de -1 no dano após o ataque."
            },
            {
                nome: "Frenesi de sangue",
                desc: "O slime tem Vantagem em jogadas de ataque contra qualquer criatura que não esteja com seus Pontos de Vida máximos."
            }
        ],
        acoes: [
            {
                nome: "Multi-ataque",
                desc: "O Slime realiza dois ataques de Pancada Ácida ou um de Pancada e um de Bote Voraz."
            },
            {
                nome: "Pancada ácida",
                desc: "Ataque Corpo a Corpo: +5 para acertar. Dano: 10 (2d6 + 3) de dano ácido."
            },
            {
                nome: "Bote voraz",
                desc: "taque Corpo a Corpo: +5 para acertar. Dano: 7 (1d8 + 3) de dano ácido. Se o alvo for uma criatura Média ou menor, ela fica Agarrada (CD 13 para escapar). Enquanto estiver agarrada, a criatura está Impedida e sofre 2d6 de dano ácido no início de cada turno do slime."
            }
        ],
        sentidos: {
            percepcaoPassiva: "10",
            visaoEscuro: "18"
        },
        drops: [
            {
                range: "1",
                item: "Suco Gástrico Concentrado"
            },
            {
                range: "2",
                item: "Membrana Resistente"
            },
            {
                range: "3",
                item: "Glândula de Frenesi"
            },
            {
                range: "4",
                item: "Fragmentos de Equipamento"
            }
        ]
    },
    slimeExplosivo: {
        name: "Slime explosivo",
        rarity: "Comum",
        icon: "https://i.imgur.com/6nTRXpV.png",
        image: "https://i.imgur.com/WhCICB0.jpeg",
        subtitle: "CR 3",
        description: "Se o Slime de Fogo é uma chama que busca combustível, o Slime Explosivo é um incêndio que aprendeu a odiar. Ao trilhar o Caminho Bestial, essa criatura deixa de apenas exalar calor para se tornar uma caldeira biológica de alta pressão. Seu instinto de sobrevivência foi substituído por uma agressividade reativa: cada golpe que recebe não o intimida, mas sim acelera a vibração de seu núcleo, transformando a dor em detonação.",
        type: "Monstro médio, gosma",
        ac: "12",
        hp: "+60 (8d8 + 24)",
        speed: "9m",
        stats: {
            forca: "14 (+2)",
            destreza: "14 (+2)",
            constituicao: "16 (+3)",
            inteligencia: "3 (-4)",
            sabedoria: "10 (+0)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Fogo."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Gelo"
            },
            {
                nome: "Reação instável",
                desc: "Sempre que o slime sofrer dano de um ataque crítico, todas as criaturas a 1m sofrem 2d6 de dano de fogo devido ao vazamento de plasma."
            },
            {
                nome: "Corpo incandescente",
                desc: "Uma criatura que toque o slime ou o atinja com um ataque corpo a corpo a menos de 1m recebe 3 de dano de fogo. Materiais inflamáveis que ele toque se incendeiam."
            }
        ],
        acoes: [
            {
                nome: "Multi-ataque",
                desc: "O Slime realiza dois ataques de Pancada Árdente."
            },
            {
                nome: "Pancada ardente",
                desc: "Ataque Corpo a Corpo: +4 para acertar. Dano: 9 (2d6 + 2) de dano de fogo + 1d4 de dano de impacto."
            },
            {
                nome: "Detonação controlada (Recarga 5-6 turnos)",
                desc: "O slime contrai seu corpo e libera uma explosão em um raio de 4 metros. Cada criatura na área deve fazer um teste de resistência de Destreza (CD 13). Sofre 4d6 de dano de fogo em uma falha, ou metade em um sucesso."
            }
        ],
        sentidos: {
            percepcaoPassiva: "10",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Nada"
            },
            {
                range: "2",
                item: "Coração de Magma"
            },
            {
                range: "3",
                item: "Fuligem Explosiva"
            },
            {
                range: "4",
                item: "Gema de Ignis	"
            }
        ]
    },
    slimeDaCorrenteza: {
        name: "Slime da correnteza",
        rarity: "Comum",
        icon: "https://i.imgur.com/k5YcVtc.png",
        image: "https://i.imgur.com/bO4uvVp.jpeg",
        subtitle: "CR 3",
        description: "O Slime de Correnteza é a prova de que a água, em sua forma mais pura e selvagem, pode ser tão devastadora quanto o aço. Ao evoluir pelo Caminho Bestial, ele deixa de ser uma massa informe para se tornar um sistema de propulsão biológica. Ele não apenas flui sobre o solo; ele ruge como uma inundação confinada em um corpo físico.",
        type: "Monstro médio, gosma",
        ac: "14",
        hp: "+64 (8d8 + 28)",
        speed: "9m, 15m natação",
        stats: {
            forca: "16 (+3)",
            destreza: "14 (+2)",
            constituicao: "16 (+3)",
            inteligencia: "3 (-4)",
            sabedoria: "10 (+0)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Ácido e Fogo; Concussão, Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Raio"
            },
            {
                nome: "Forma fluida",
                desc: "O slime pode se mover através do espaço de uma criatura hostil e vice-versa. Ele não provoca ataques de oportunidade ao sair do alcance de um inimigo se estiver se movendo em direção à água ou terreno molhado."
            },
            {
                nome: "Pressão interna",
                desc: "Quando o slime sofre dano de concussão, ele libera um jato de água reativo. O atacante deve passar em uma RES de FOR (CD 13) ou será empurrado 1m para trás."
            }
        ],
        acoes: [
            {
                nome: "Multi-ataque",
                desc: "O Slime realiza dois ataques de Chicote de Alta Pressão."
            },
            {
                nome: "Chicote de alta pressão",
                desc: "Ataque Corpo a Corpo: +5 para acertar, alcance 3m. Dano: 10 (2d6 + 3) de dano de impacto."
            },
            {
                nome: "Vórtice de sucção (Recarga 5t)",
                desc: "O slime gira violentamente. Cada criatura a até 3 metros deve fazer um teste de resistência de Força (CD 13). Em uma falha, a criatura sofre 3d6 de dano de impacto, é puxada para um espaço adjacente ao slime e fica Caída."
            }
        ],
        sentidos: {
            percepcaoPassiva: "10",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Água Pesada"
            },
            {
                range: "2",
                item: "Vesícula de Ar Puro"
            },
            {
                range: "3",
                item: "Essência de Correnteza"
            },
            {
                range: "4",
                item: "Lodo Hidrostático"
            }
        ]
    },
    slimeDeEstalactite: {
        name: "Slime de estalactite",
        rarity: "Incomum",
        icon: "https://i.imgur.com/GxPZiSm.png",
        image: "https://i.imgur.com/P02n4Al.jpeg",
        subtitle: "CR 3",
        description: "O Slime de Estalactite é uma visão aterrorizante de beleza letal. Diferente das gosmas comuns, ele possui uma estrutura semi-rígida que brilha com um azul neon intenso vindo de seu núcleo profundo. Ele se move com estalos de gelo quebrando e se reformando instantaneamente.",
        type: "Monstro médio, gosma",
        ac: "15",
        hp: "+72 (9d8 + 31)",
        speed: "9m, escalar 9m",
        stats: {
            forca: "16 (+3)",
            destreza: "12 (+1)",
            constituicao: "16 (+3)",
            inteligencia: "3 (-4)",
            sabedoria: "10 (+0)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Frio; Concussão e Cortante de armas não-mágicas."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Fogo"
            },
            {
                nome: "Geometria perfurante",
                desc: "Qualquer criatura que tente agarrar o slime ou o atinja com um ataque desarmado sofre 2d4 de dano perfurante devido aos espinhos de cristal."
            },
            {
                nome: "Aura de zero absoluto",
                desc: "No início do turno do slime, cada criatura a 1m dele deve passar em uma RES de CON (CD 13) ou terá seu deslocamento reduzido em 3 metros até o início do próximo turno."
            }
        ],
        acoes: [
            {
                nome: "Multi-ataque",
                desc: "O Slime realiza dois ataques de Estocada Glacial."
            },
            {
                nome: "Estocada Glacial",
                desc: "Ataque Corpo a Corpo: +5 para acertar, alcance 3m (ele estende um espigão). Dano: 10 (2d6 + 3) de dano perfurante + 1d4 de dano de frio."
            },
            {
                nome: "Chuva de estalactite (Recarga 5t)",
                desc: "O slime dispara estilhaços de si mesmo para cima que caem em um círculo de 3m de raio. Cada criatura na área deve fazer uma RES de Destreza (CD 13). Sofre 4d6 de dano perfurante e fica Impedida por agulhas de gelo presas ao chão (pode escapar com uma ação e teste de FOR CD 13)."
            }
        ],
        sentidos: {
            percepcaoPassiva: "10",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Fragmento de Gelo Negro"
            },
            {
                range: "2",
                item: "Ponta de Estalactite Perfeita"
            },
            {
                range: "3",
                item: "Fluido Criogênico Puro"
            },
            {
                range: "4",
                item: "Núcleo Hexagonal de Mana"
            }
        ]
    },
    slimeDeCascalho: {
        name: "Slime de cascalho",
        rarity: "Comum",
        icon: "https://i.imgur.com/Jj6tHaz.png",
        image: "https://i.imgur.com/PKKkc3V.jpeg",
        subtitle: "CR 3",
        description: `Relatos de viajantes e mineiros frequentemente mencionam 'encostas que se movem'. O Slime de Cascalho é a prova viva de que a terra não é apenas um palco para a vida, mas pode se tornar o próprio predador. Evoluídos de simples poças de barro, essas criaturas consomem minerais preciosos para construir uma carapaça de rocha quase impenetrável.

Diferente de outros Slimes que tentam dissolver a presa, o de Cascalho prefere o método da força bruta: ele soterra seus oponentes sob centenas de quilos de brita e granito, esperando que o fôlego acabe para então absorver os nutrientes dos restos esmagados. Sua paciência é geológica; ele pode permanecer imóvel por décadas, parecendo apenas um amontoado de detritos em uma caverna, até que o som de passos humanos ative seu núcleo de mana. Atacar um Slime de Cascalho com aço comum é como tentar derrubar uma montanha com um talher: inútil e perigoso para a integridade da sua lâmina.`,
        type: "Monstro médio, gosma",
        ac: "16",
        hp: "+85 (10d8 + 40)",
        speed: "6m, escavação 6m",
        stats: {
            forca: "18 (+4)",
            destreza: "6 (-2)",
            constituicao: "18 (+4)",
            inteligencia: "3 (-4)",
            sabedoria: "12 (+1)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Veneno; Concussão, Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Imunidade",
                desc: "Condição Caído e Empurrado (por criaturas de tamanho Médio ou menor)."
            },
            {
                nome: "Núcleo gravitacional",
                desc: "O Slime de Cascalho gera um campo de atração. Qualquer criatura que comece o turno a 1m dele tem seu deslocamento reduzido em 4m."
            },
            {
                nome: "Camuflagem de pedregulh",
                desc: "Enquanto estiver imóvel, o slime é indistinguível de um amontoado de rochas naturais (Teste de Investigação CD 16 para perceber)."
            }
        ],
        acoes: [
            {
                nome: "Multi-ataque",
                desc: "O Slime realiza dois ataques de Esmagamento de Brita."
            },
            {
                nome: "Esmagamento de brita",
                desc: "Ataque Corpo a Corpo: +6 para acertar. Dano: 11 (2d6 + 4) de dano de concussão."
            },
            {
                nome: "Sepultamento vivo (Recarga 5t)",
                desc: "O slime explode sua massa de pedras sobre uma criatura a até 3m. O alvo deve fazer uma RES de Força (CD 14). Se falhar, sofre 4d6 de dano de concussão e fica Impedido (soterrado). Uma criatura pode usar uma ação para fazer um teste de FOR (CD 14) e libertar a si mesma ou a outra pessoa."
            }
        ],
        sentidos: {
            percepcaoPassiva: "11",
            visaoEscuro: "sentido sismico 18m"
        },
        drops: [
            {
                range: "1",
                item: "Areia Abrasiva Rara"
            },
            {
                range: "2",
                item: "Coração de Geodo"
            },
            {
                range: "3",
                item: "Essência de Gravidade"
            },
            {
                range: "4",
                item: "Placa de Granito Vivo"
            }
        ]
    },
    slimeCentelha: {
        name: "Slime centelha",
        rarity: "Incomum",
        icon: "https://i.imgur.com/bS9DcxR.png",
        image: "https://i.imgur.com/5YIGw2l.jpeg",
        subtitle: "CR 3",
        description: `Os estudiosos costumam dizer que o Slime Centelha não viaja através do espaço, ele o perfura. Evoluído de slimes expostos a tempestades de mana ou máquinas antigas de civilizações perdidas, esta criatura é a personificação da energia cinética indomável.

Diferente de seus parentes mais lentos, o Centelha possui um sistema nervoso hiper-estimulado que o mantém em um estado de vibração perpétua. No campo de batalha, ele ignora as leis da fricção, deslizando por paredes e tetos como um raio vivo. O maior perigo não é apenas o seu toque letal, mas a sua capacidade de paralisar o sistema nervoso de suas vítimas com um simples pulso de sua aura.

Relatos de sobreviventes descrevem a luta contra um bando desses monstros como 'tentar golpear o relâmpago'. Aqueles que usam armaduras de metal tornam-se para-raios vivos, servindo como condutores para a fome elétrica da criatura. Para derrotá-lo, é necessário mais do que força; é preciso prever onde a luz atingirá antes mesmo de ela brilhar.`,
        type: "Monstro médio, gosma",
        ac: "15",
        hp: "60 (10d8 + 15)",
        speed: "15m (pode andar por paredes e tetos)",
        stats: {
            forca: "10 (+0)",
            destreza: "20 (+5)",
            constituicao: "13 (+1)",
            inteligencia: "3 (-4)",
            sabedoria: "12 (+1)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Elétrico; Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Imunidade",
                desc: "Condição Impedido e Paralisado."
            },
            {
                nome: "Aceleração Sinaptica",
                desc: "O Slime Centelha pode realizar a ação de Desengajar ou Disparar como uma Ação Bónus em cada um dos seus turnos."
            },
            {
                nome: "Corpo eletrizado",
                desc: "Uma criatura que atinja o slime com um ataque corpo a corpo usando uma arma de metal sofre 4 (1d8) de dano elétrico e não pode realizar reações até o início do seu próximo turno."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Slime realiza três ataques de Chicote de Plasma."
            },
            {
                nome: "Chicote de plasma",
                desc: "Ataque Corpo a Corpo: +7 para acertar, alcance 3m. Dano: 8 (1d6 + 5) de dano elétrico."
            },
            {
                nome: "Descarga de sobrecarga (Recarga 5t)",
                desc: "O Slime liberta um pulso de 6 metros. Cada criatura na área deve fazer uma RES de Constituição (CD 13). Se falhar, sofre 3d8 de dano elétrico e fica Paralizada até o final do seu próximo turno."
            }
        ],
        sentidos: {
            percepcaoPassiva: "11",
            visaoEscuro: "18"
        },
        drops: [
            {
                range: "1",
                item: "Bateria de Gel Azul"
            },
            {
                range: "2",
                item: "Fio Condutor de Nervos"
            },
            {
                range: "3",
                item: "Estímulo de Adrenalina"
            },
            {
                range: "4",
                item: "Núcleo de Singularidade Elétrica"
            }
        ]
    },
    slimeDeEstilhacos: {
        name: "Slime de estilhaços",
        rarity: "Incomum",
        icon: "https://i.imgur.com/jowgJ6x.png",
        image: "https://i.imgur.com/XHDuZoY.jpeg",
        subtitle: "CR 3",
        description: `Entre os aventureiros de Rank B, o Slime de Estilhaços é conhecido como o 'Devorador de Espadas'. Esta evolução bestial do metal ocorre quando uma gosma metálica consome uma quantidade massiva de armas mágicas ou restos de campos de batalha sangrentos, assimilando não apenas o aço, mas a sede de sangue das lâminas.

Diferente de outros slimes que tentam engolfar suas presas, o de Estilhaços as retalha. Ele utiliza magnetismo interno para converter seu corpo em uma centrífuga de estilhaços ultra-afiados que podem rasgar couro, cota de malha e até placas de aço temperado em segundos. É uma criatura de pura agressão mecânica; não há diplomacia ou fuga fácil quando os chicotes de lâminas começam a girar.

Estrategistas recomendam o uso de magias de calor intenso para fundir suas articulações ou ataques de impacto pesado para desestabilizar sua coesão. No entanto, o maior erro que um guerreiro pode cometer é acreditar que sua armadura o protegerá, pois, para o Slime de Estilhaços, sua armadura é apenas mais matéria-prima para ser mastigada e cuspida de volta contra seus aliados.`,
        type: "Monstro médio, gosma",
        ac: "17",
        hp: "75 (10d8 + 30)",
        speed: "9m",
        stats: {
            forca: "16 (+3)",
            destreza: "14 (+2)",
            constituicao: "16 (+3)",
            inteligencia: "3 (-4)",
            sabedoria: "10 (+0)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Cortante, Perfurante e Concussão de armas não-mágicas"
            },
            {
                nome: "Imunidade",
                desc: "Veneno"
            },
            {
                nome: "Defesa espinhosa",
                desc: "Qualquer criatura que atinja o slime com um ataque corpo a corpo a menos de 1m sofre 5 (2d4) de dano cortante devido aos estilhaços que saltam da carapaça."
            },
            {
                nome: "Corpo de estilhaços",
                desc: "O slime ignora terreno difícil feito de escombros ou metal. Além disso, ele tem vantagem em testes de agarrar contra criaturas que não estejam usando armadura pesada (as farpas prendem na carne/roupa)."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Slime realiza dois ataques de Chicote de Lâminas."
            },
            {
                nome: "Chicote de lâminas",
                desc: "Ataque Corpo a Corpo: +5 para acertar, alcance 3m. Dano: 10 (2d6 + 3) de dano cortante. Se o alvo estiver usando armadura não-mágica, ele recebe uma penalidade de -1 na CA até o fim do combate (acumula até -3)."
            },
            {
                nome: "Tormenta de ferro (Recarga 5t)",
                desc: "O slime gira seu corpo, disparando centenas de estilhaços em um raio de 4metros. Cada criatura na área deve fazer uma RES de Destreza (CD 14). Sofre 4d6 de dano cortante em uma falha, ou metade em um sucesso."
            }
        ],
        sentidos: {
            percepcaoPassiva: "10",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Sucata de Aço Temperado"
            },
            {
                range: "2",
                item: "Óleo de Afiação Natural"
            },
            {
                range: "3",
                item: "Estilhaço de Tungstênio"
            },
            {
                range: "4",
                item: "Núcleo de Mercúrio Sólido"
            }
        ]
    },
    slimeDeCarnica: {
        name: "Slime de carniça",
        rarity: "Incomum",
        icon: "https://i.imgur.com/PWJOva3.png",
        image: "https://i.imgur.com/9SqH0fp.jpeg",
        subtitle: "CR 3",
        description: "O Slime de Carniça não é apenas um monstro, é uma tumba ambulante. Ele nasce onde a morte foi esquecida e o sagrado foi profanado. Dizem os guias de aventureiros que o primeiro sinal de sua presença não é visual, mas o cheiro: um fedor tão insuportável que pode desorientar o guerreiro mais veterano. Ele não busca apenas se alimentar, ele busca converter toda a vida em decomposição, aumentando sua massa com cada cadáver que consome. Lutar contra um Slime de Carniça é uma corrida contra a exaustão, pois cada ferida que ele inflige drena não apenas o sangue, mas a própria vontade de continuar vivo.",
        type: "Monstro médio, gosma",
        ac: "11",
        hp: "80 (10d8 + 35)",
        speed: "6 metros, escalar 6 metros.",
        stats: {
            forca: "14 (+2)",
            destreza: "8 (-1)",
            constituicao: "17 (+3)",
            inteligencia: "3 (-4)",
            sabedoria: "12 (+1)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Necrótico e Veneno."
            },
            {
                nome: "Imunidade",
                desc: "Condição Envenenado e Exaustão."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Radiante"
            },
            {
                nome: "Fedor de cadáver",
                desc: "Qualquer criatura que comece seu turno a até 1m do slime deve ter sucesso em uma RES de Constituição (CD 13) ou ficará Envenenada até o início de seu próximo turno. Em caso de falha por 5 ou mais, a criatura fica paralisada pelo nojo até o final do turno dela."
            },
            {
                nome: "Sifão de vitalidade",
                desc: "Sempre que o slime causar dano necrótico a uma criatura envenenada, ele recupera PV iguais a metade do dano causado."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Slime realiza dois ataques de Pancada Pútrida."
            },
            {
                nome: "Pancada Pútrida",
                desc: "Ataque Corpo a Corpo: +4 para acertar. Dano: 7 (1d10 + 2) de dano de impacto + 7 (2d6) de dano necrótico. O HP máximo do alvo é reduzido em um valor igual ao dano necrótico sofrido."
            },
            {
                nome: "Explosão gastromaníaca",
                desc: "O slime expele uma nuvem de gases e fluídos fétidos em um cone de 6 metros. Cada criatura na área deve fazer uma RES de Constituição (CD 13). Se falhar, sofre 4d6 de dano necrótico e fica Cega até o fim do seu próximo turno."
            }
        ],
        sentidos: {
            percepcaoPassiva: "11",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Bile Corrupta"
            },
            {
                range: "2",
                item: "Vértebra Fossilizada"
            },
            {
                range: "3",
                item: "Óleo de Embalsamar Sombrio"
            },
            {
                range: "4",
                item: "Coração Putrefato Pulsação"
            }
        ]
    },
    oozeGigante: {
        name: "Ooze gigante",
        rarity: "Comum",
        icon: "https://i.imgur.com/DpLdxkf.png",
        image: "https://i.imgur.com/NLF1xdP.jpeg",
        subtitle: "CR 8",
        description: `O Ooze Gigante é o estágio final da gula elemental. Nos anais das grandes guildas, ele é classificado como uma 'Entidade de Erradicação Local'. Diferente de suas formas menores, o Ooze Gigante desenvolveu uma consciência celular coletiva que lhe permite processar e dissolver não apenas matéria orgânica, mas também o próprio mana presente no ambiente.

Relatos de sobreviventes descrevem o encontro com essa criatura como lutar contra uma inundação senciante. Sua densidade é tamanha que flechas e feitiços de baixo nível são simplesmente engolidos e neutralizados por suas enzimas gástricas antes de atingirem qualquer ponto vital. O maior perigo reside em sua capacidade de 'Engolfar Total'; uma vez dentro da criatura, a morte não vem pelo esmagamento, mas pela desintegração molecular acelerada.

Em termos estratégicos, o Ooze Gigante é considerado um cerco vivo. Ele não para diante de muralhas ou portões de ferro; ele os consome. A única esperança contra tal abominação é a destruição total e simultânea de seu núcleo de mana, pois qualquer fragmento que escape da erradicação pode, com tempo e alimento suficiente, reiniciar o ciclo de crescimento e retornar como uma nova calamidade.`,
        type: "Monstro enorme, gosma",
        ac: "15",
        hp: "161 (14d12 + 70)",
        speed: "12m, escalar 12m",
        stats: {
            forca: "22 (+6)",
            destreza: "10 (+0)",
            constituicao: "20 (+5)",
            inteligencia: "5 (-3)",
            sabedoria: "12 (+1)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Ácido; Concussão, Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Imunidade",
                desc: "Ácido, Condição Caído, Agarrado, Impedido."
            },
            {
                nome: "Natureza Colossal",
                desc: "O Ooze pode ocupar o mesmo espaço que criaturas Médias ou menores. Ele ignora terreno difícil."
            },
            {
                nome: "Núvem de vapor ácido",
                desc: "No início de cada um dos turnos do Ooze, qualquer criatura a até 3 metros dele sofre 7 (2d6) de dano ácido devido aos gases corrosivos que exalam de sua massa."
            },
            {
                nome: "Divisão reativa",
                desc: "Sempre que o Ooze Gigante sofrer 30 de dano ou mais em um único turno de um ataque cortante ou elétrico, ele expele um Slime voraz em um espaço adjacente."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Ooze realiza três ataques: um de Esmagamento e dois de Tentáculos Ácidos."
            },
            {
                nome: "Esmagamento",
                desc: "Ataque Corpo a Corpo: +9 para acertar, alcance 1m. Dano: 19 (3d8 + 6) de dano de concussão + 9 (2d8) de dano ácido. O alvo deve passar em uma RES de FOR (CD 17) ou ficará Caído."
            },
            {
                nome: "Tentáculo ácido",
                desc: "Ataque Corpo a Corpo: +9 para acertar, alcance 6m. Dano: 13 (2d6 + 6) de dano ácido."
            },
            {
                nome: "Engolfar total",
                desc: " O Ooze se move até seu deslocamento. Ele pode passar por criaturas Grandes ou menores. Cada criatura deve passar em uma RES de Destreza (CD 17).  Sucesso: A criatura é empurrada para o lado.  Falha: A criatura é engolida. Enquanto engolida, ela está Impedida, tem cobertura total contra ataques externos e sofre 21 (6d6) de dano ácido no início de cada turno do Ooze. O Ooze pode carregar até 2 criaturas Grandes ou 8 Médias simultaneamente."
            }
        ],
        sentidos: {
            percepcaoPassiva: "11",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: "Bile de Dragão Falso"
            },
            {
                range: "2",
                item: "Núcleo de Geleia Primordial"
            },
            {
                range: "3",
                item: "Enzima Dissolvente"
            },
            {
                range: "4",
                item: "Olho de Ooze Cristalizado"
            }
        ]
    },
    lodoDeMagma: {
        name: "Lodo de magma",
        rarity: "Comum",
        icon: "https://i.imgur.com/HujK2KV.png",
        image: "https://i.imgur.com/X4x3ggR.jpeg",
        subtitle: "CR 8",
        description: `O Lodo de Magma é a encarnação da fúria da terra, uma abominação geológica que só desperta quando as veias de mana do mundo tocam o núcleo de um vulcão ativo. Nos registros das Grandes Guildas, ele é descrito como um 'Titã Fluido', capaz de ignorar as defesas físicas mais robustas simplesmente por derreter o solo e o aço à sua volta.

Diferente das evoluções anteriores, o Lodo de Magma possui uma densidade absurda; sua massa não é composta apenas de lodo, mas de minerais fundidos e energia elemental comprimida. Ele não consome presas para saciar a fome, mas sim para aumentar sua massa mineral, assimilando metais e rochas raras em sua carapaça de obsidiana.

O ar em sua presença é descrito como 'fogo líquido', onde um único suspiro pode incinerar os pulmões de um aventureiro desprotegido. Ele é o senhor absoluto dos domínios ígneos, e sua mera presença transforma ecossistemas inteiros em desertos de lava em questão de dias. Enfrentá-lo é entrar em um combate contra a própria natureza; um esforço que geralmente termina com os heróis e suas lendas sendo reduzidos a cinzas e silêncio.`,
        type: "Monstro enorme, gosma",
        ac: "17",
        hp: " 175 (14d12 + 84)",
        speed: "6m, natação (magma) 18m",
        stats: {
            forca: "14 (+2)",
            destreza: "8 (-1)",
            constituicao: "22 (+6)",
            inteligencia: "5 (-3)",
            sabedoria: "12 (+1)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Concussão, Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Imunidade",
                desc: "Fogo, Veneno, Condição Caído, Agarrado, Impedido."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Frio (O choque térmico racha sua crosta, reduzindo sua CA em -4 até o fim do próximo turno)."
            },
            {
                nome: "Aura de convecção",
                desc: "Qualquer criatura que comece seu turno a até 4m do Lodo sofre 10 (3d6) de dano de fogo. Projéteis de madeira ou flechas comuns que entrem nessa área são incinerados instantaneamente."
            },
            {
                nome: "Corpo de magma viscoso",
                desc: "Criaturas que atingirem o Lodo com ataques corpo a corpo a menos de 1m devem passar em uma RES de FOR (CD 17). Em uma falha, a arma fica presa na massa viscosa e o atacante é desarmado. É necessária uma ação e um teste de FOR para recuperar a arma."
            },
            {
                nome: "Sopro de enxofre",
                desc: "O ar num raio de 9 metros ao redor do slime é considerado fumaça pesada (visão obscurecida) e criaturas que precisem respirar têm desvantagem em testes de resistência de Constituição."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Lodo realiza dois ataques de Pancada de Lava e usa seu Arremesso de Rocha Ardente."
            },
            {
                nome: "Pancada de lava",
                desc: "Ataque Corpo a Corpo: +10 para acertar, alcance 3m. Dano: 16 (2d8 + 7) de impacto + 14 (4d6) de fogo. O alvo fica em chamas (sofre 1d10 de dano de fogo por turno até usar uma ação para apagar)."
            },
            {
                nome: "Arremesso de rocha ardente",
                desc: "Ataque à Distância: +10 para acertar, alcance a partir de 18m a até 36m. Dano: 20 (3d8 + 7) de impacto + 10 (3d6) de fogo."
            },
            {
                nome: "Erupção geométrica (Recarga 5t)",
                desc: "O Lodo golpeia o chão, criando 3 pilares de magma que irrompem sob criaturas que ele possa ver em um raio de 18m. Cada alvo deve fazer uma RES de Destreza (CD 17). Sofre 35 (10d6)$ de dano de fogo em uma falha, ou metade em um sucesso. O local do pilar torna-se terreno difícil (magma) por 1 minuto."
            }
        ],
        sentidos: {
            percepcaoPassiva: "11",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: "Coração Vulcanizado"
            },
            {
                range: "2",
                item: "Placa de Obsidiana Primordial"
            },
            {
                range: "3",
                item: "Essência de Ignis Concentrada"
            },
            {
                range: "4",
                item: "Fragmento Tectônico"
            }
        ]
    },
    oozeDasProfundezas: {
        name: "Ooze das profundezas",
        rarity: "Incomum",
        icon: "https://i.imgur.com/dW0B4Hj.png",
        image: "https://i.imgur.com/f4axnno.jpeg",
        subtitle: "CR 8",
        description: `Nos registros das expedições abissais, o Ooze das Profundezas é classificado não como uma criatura, mas como uma 'Anomalia Tectônica Senciante'. Ele é a prova de que a água, sob pressão suficiente e imbuída de mana primordial, pode desenvolver uma vontade própria e predatória. Esta entidade não habita apenas o oceano; ela é o oceano em sua forma mais hostil e esmagadora.

Diferente de suas evoluções anteriores, o Ooze das Profundezas possui uma densidade molecular que desafia a compreensão. Sua massa é tão compacta que pode repelir lâminas e feitiços como se fosse aço temperado, mantendo a fluidez necessária para engolfar e triturar suas vítimas. Ele manipula a gravidade hidrostática ao seu redor, criando zonas onde o ar se torna tão pesado quanto chumbo, imitando a pressão implacável de uma fossa oceânica.

Relatos de sobreviventes (raros e geralmente traumatizados) descrevem o encontro com esta criatura como 'ser abraçado pelo vazio'. Ele não caça por fome física, mas para assimilar o mana e o conhecimento de seres complexos, adicionando suas essências ao vasto e silencioso arquivo de morte que reside em seu núcleo. Enfrentá-lo sem preparação para combate subaquático ou resistência à escuridão mágica é aceitar o afogamento não apenas físico, mas existencial, nas profundezas impiedosas de seu corpo.`,
        type: "Monstro enorme, gosma",
        ac: "16",
        hp: "168 (16d12 + 64)",
        speed: "9m, natação 24m",
        stats: {
            forca: "22 (+6)",
            destreza: "12 (+1)",
            constituicao: "18 (+4)",
            inteligencia: "5 (-3)",
            sabedoria: "14 (+2)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Ácido, Fogo, Frio; Concussão, Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Imunidade",
                desc: "Condição Caído, Agarrado, Impedido, Sufocado."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Raio (A água abissal é um supercondutor, o dano é dobrado e o monstro fica Atordoado por 1 rodada)."
            },
            {
                nome: "Pressão Hidrostática",
                desc: "O ar num raio de 6 metros ao redor do Ooze é tão denso que parece água profunda. Criaturas inimigas nesta área consideram o terreno como Terreno Difícil e têm Desvantagem em testes de Força e Atletismo."
            },
            {
                nome: "Corpo de água pesada",
                desc: "O Ooze pode entrar no espaço de uma criatura e parar ali. Criaturas Médias ou menores dentro do seu espaço estão automaticamente Agarradas (CD 17 para escapar) e começam a Sufocar."
            },
            {
                nome: "Escuridão das fossas",
                desc: "O corpo do Ooze emite uma aura de escuridão mágica num raio de 3 metros que apenas ele consegue ver através."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Ooze realiza três ataques de Chicote de Alta Pressão"
            },
            {
                nome: "Chicote de alta pressão",
                desc: "Ataque Corpo a Corpo: +9 para acertar, alcance 6m. Dano: 15 (2d8 + 6) de dano de impacto + 7 (2d6) de dano de frio. Se o alvo for Médio ou menor, é puxado 3 metros em direção ao Ooze."
            },
            {
                nome: "Jato de trincheira (Recarga 5t)",
                desc: " O Ooze dispara um jato de água negra em linha reta de 18 metros. Cada criatura no caminho deve fazer uma RES de Força (CD 17).  Falha: Sofre 40 (9d8) de dano de impacto, é empurrada 6 metros e fica Caída.  Sucesso: Metade do dano e não é empurrada."
            },
            {
                nome: "Vórtice abissal",
                desc: "O Ooze gira a sua massa, puxando todas as criaturas num raio de 9 metros. Cada criatura deve fazer uma RES de Força (CD 17) ou ser puxada para o centro e ficar Impedida pela pressão."
            }
        ],
        sentidos: {
            percepcaoPassiva: "12",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: "Pérola de Pressão Negra"
            },
            {
                range: "2",
                item: "Fluido de Regeneração Oceânica"
            },
            {
                range: "3",
                item: "Membrana Hidrostática"
            },
            {
                range: "4",
                item: "Coração do Abismo"
            }
        ]
    },
    colossoDeNeve: {
        name: "Colosso de neve",
        rarity: "incomum",
        icon: "https://i.imgur.com/vYaJGsJ.png",
        image: "https://i.imgur.com/mGeDSC4.jpeg",
        subtitle: "CR 8",
        description: `O Colosso de Neve é a manifestação física da ira do inverno, uma abominação elemental classificada como uma 'Calamidade Marchante'. Ele é o estágio evolutivo final do Caminho Bestial do Gelo no Nível 10, onde a criatura deixa de ser um mero predador para se tornar uma força de terraformação senciante. Nos registros antigos, ele é descrito como o 'Arauto do Zero Absoluto'.

Diferente de suas formas anteriores, o Colosso de Neve possui uma estrutura híbrida única. Sua massa é composta por gelo permafrost, que absorveu tanto mana que sua dureza supera o aço temperado, e neve compactada, que lhe confere uma resiliência surpreendente contra impactos. Ele não apenas habita regiões geladas; ele cria o inverno eterno por onde passa, congelando o próprio ar ao redor com sua mera presença.

Relatos de batalhas descrevem o encontro com esta criatura como 'lutar contra uma avalanche com uma espada'. Ele pode remodelar seus membros instantaneamente para criar armas de cerco ou escudos impenetráveis. O maior perigo, no entanto, é seu 'Caixão de Diamante', uma habilidade capaz de congelar campeões instantaneamente em estátuas de gelo eterno. Enfrentá-lo sem magias de fogo de Rank S ou armas lendárias é aceitar uma morte rápida e silenciosa, tornando-se apenas mais um ornamento congelado em seu domínio de gelo`,
        type: "Monstro enorme, Gosma",
        ac: "18",
        hp: "184 (16d12 + 80)",
        speed: "9 metros, escalar 9 metros.",
        stats: {
            forca: "24 (+7)",
            destreza: "8 (-1)",
            constituicao: "20 (+5)",
            inteligencia: "5 (-3)",
            sabedoria: "12 (+1)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Concussão, Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Imunidade",
                desc: "Frio, Veneno, Condição Caído, Exaustão."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Fogo"
            },
            {
                nome: "Aura de zero absoluto",
                desc: "O ar em um raio de 9 metros ao redor do Colosso é uma nevasca mágica. Criaturas que terminarem seu turno na área sofrem 10 (3d6) de dano de frio e têm seu deslocamento reduzido pela metade."
            },
            {
                nome: "Pele de estalactite",
                desc: "Qualquer criatura que atinja o Colosso com um ataque corpo a corpo a menos de 1m sofre 9 (2d8) de dano perfurante conforme os espinhos de gelo em sua superfície se projetam reativamente."
            },
            {
                nome: "Caminhante do gelo",
                desc: "O Colosso ignora terreno difícil causado por neve ou gelo e pode escalar superfícies congeladas sem precisar de teste de atributo."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Colosso realiza três ataques: um de Impacto Glacial e dois de Lança de Estalactite."
            },
            {
                nome: "Impacto glacial",
                desc: "Ataque Corpo a Corpo: +10 para acertar, alcance 3m. Dano: 20 (3d8 + 7) de concussão + 7 (2d6) de frio. O alvo deve passar em uma RES de FOR (CD 18) ou ficará Caído e Impedido por blocos de neve."
            },
            {
                nome: "Lança de estalactite",
                desc: "Ataque Corpo a Corpo ou à Distância: +10 para acertar, alcance 6m/18m (ele dispara uma parte de si). Dano: 16 (2d8 + 7) de perfurante + 4 (1d8) de frio."
            },
            {
                nome: "Sepulcro de neve (Recarga 5t)",
                desc: "O Colosso expele uma massa de neve e gelo em um círculo de 6 metros de raio a até 18 metros de distância. Cada criatura na área deve fazer uma RES de Destreza (CD 18).  Falha: Sofre 36 (8d8) de dano de frio e fica Paralizada (congelada) até o final do seu próximo turno.  Sucesso: Metade do dano e não fica paralisada."
            }
        ],
        sentidos: {
            percepcaoPassiva: "11",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: "Gelo que Nunca Derrete"
            },
            {
                range: "2",
                item: "Lança do Rei do Inverno"
            },
            {
                range: "3",
                item: "Essência de Geada Pura"
            },
            {
                range: "4",
                item: "Núcleo de Cristal Glacial"
            }
        ]
    },
    oozeDeRocha: {
        name: "Ooze de rocha",
        rarity: "Comum",
        icon: "https://i.imgur.com/1JM3iSR.png",
        image: "https://i.imgur.com/BNNZXWM.jpeg",
        subtitle: "CR 8",
        description: `O Ooze de Rocha é conhecido entre os mineradores e aventureiros veteranos como o Guardião do Centro da Terra. Classificado como uma Calamidade de Classe Terrestre, esta criatura é o resultado final de séculos de compressão de mana em camadas profundas de sedimentos e minerais raros. Ele não é apenas um monstro; é uma peça do próprio planeta que decidiu se defender.

Diferente de suas formas anteriores, o Ooze de Rocha não depende apenas de sua massa física para lutar. Ele desenvolveu um controle primitivo, porém devastador, sobre a gravidade. O ar ao seu redor é tão denso que os pulmões de um humano comum podem entrar em colapso apenas por estarem por perto. Sua paciência é lendária; ele pode permanecer imóvel por décadas, sendo confundido com uma formação rochosa natural, até que o primeiro passo de um invasor desperte seu núcleo gravitacional.

Relatos de sobreviventes indicam que armas comuns são totalmente inúteis contra sua couraça de granito temperado. Golpear o Ooze de Rocha é como tentar cortar uma montanha com uma faca de cozinha. A única estratégia viável é o uso de vibrações de alta frequência ou magias de som poderosas que possam rachar sua estrutura molecular antes que o monstro use sua força tectônica para reduzir o grupo de aventureiros a pó e fragmentos ósseos.`,
        type: "Monstro enorme, gosma",
        ac: "19",
        hp: "195 (17d12 + 85)",
        speed: "6 metros, escavação 9 metros.",
        stats: {
            forca: "24 (+7)",
            destreza: "6 (-2)",
            constituicao: "22 (+6)",
            inteligencia: "5 (-3)",
            sabedoria: "12 (+1)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Veneno; Concussão, Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Imunidade",
                desc: "Condição Caído, Petrificado, Exaustão."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Raio"
            },
            {
                nome: "Núcleo de massa critica",
                desc: "O Ooze gera um campo gravitacional intenso. O terreno em um raio de 9 metros ao redor dele é considerado Terreno Difícil para inimigos. Criaturas voadoras que entrem nessa área devem passar em uma RES de Força (CD 17) ou cairão imediatamente."
            },
            {
                nome: "Armadura de reação",
                desc: "Sempre que o Ooze receber dano de concussão ou cortante, ele libera estilhaços de pedra. Criaturas a 1 metro dele sofrem 7 (2d6) de dano perfurante."
            },
            {
                nome: "Estabilidade tectonica",
                desc: "O Ooze não pode ser movido contra sua vontade por nenhuma habilidade de nível ou CR inferior ao dele."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Ooze realiza dois ataques de Esmagamento de Granito e usa sua Onda de Choque."
            },
            {
                nome: "Esmagamento de granito",
                desc: "Ataque Corpo a Corpo: +10 para acertar, alcance 3m. Dano: 20 (3d8 + 7) de dano de concussão. Se o alvo for uma criatura, ele deve passar em uma RES de Força (CD 17) ou ficará Agarrado e Impedido (soterrado pela massa do ooze)."
            },
            {
                nome: "Arremesso de monólito",
                desc: "Ataque à Distância: +10 para acertar, alcance 18/36m. Dano: 25 (4d8 + 7) de dano de concussão. O alvo deve passar em uma RES de Destreza (CD 17) ou ficará Caído."
            },
            {
                nome: "Onda de choque (Recarga 5t)",
                desc: "O Ooze golpeia o solo com sua massa total. Todas as criaturas em um raio de 12 metros devem fazer uma RES de Destreza (CD 17). Falha: Sofre 36 (8d8) de dano de concussão e fica Atordoado até o fim do próximo turno do Ooze. Sucesso: Metade do dano e não fica atordoado."
            }
        ],
        sentidos: {
            percepcaoPassiva: "11",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: "Coração de Magnetita"
            },
            {
                range: "2",
                item: "Fragmento de Diamante Bruto"
            },
            {
                range: "3",
                item: "Essência de Gravidade Estagnada"
            },
            {
                range: "4",
                item: "Placa de Rocha Senciante"
            }
        ]
    },
    enguiaDePlasma: {
        name: "Enguia de plasma",
        rarity: "Incomum",
        icon: "https://i.imgur.com/O1B5A4t.png",
        image: "https://i.imgur.com/bhZ3ecz.jpeg",
        subtitle: "CR 8",
        description: `A Enguia de Plasma é classificada nos registros reais como uma Anomalia de Alta Tensão. Ela representa o ponto onde a biologia das gosmas deixa de seguir as leis da matéria sólida ou líquida para habitar o estado de plasma. Habitante de picos atingidos por tempestades perpétuas ou fendas de mana instáveis, esta criatura é a personificação da velocidade divina e do calor estelar.

Diferente de suas formas inferiores que dependiam de contato físico para eletrocutar, a Enguia de Plasma ioniza o próprio ar ao seu redor, transformando o ambiente em um condutor mortal. Sua mera presença altera a pressão atmosférica e faz com que o cabelo dos seres próximos se erice antes de serem atingidos por um ataque que se move à velocidade da luz. Ela não possui predadores naturais, pois qualquer criatura que tente mordê-la é instantaneamente vaporizada pelo calor de milhares de graus Celsius que emana de seu corpo de quarta matéria.

Relatos de heróis lendários afirmam que lutar contra uma Enguia de Plasma não é um teste de força, mas um teste de reflexos e resistência mágica. Ela não ataca com estratégia convencional; ela flui pelo campo de batalha como um pensamento, atingindo múltiplos alvos simultaneamente através de arcos de corrente contínua. Para os estudiosos do sistema, ela é o lembrete de que a energia, quando atinge um nível crítico de concentração, desenvolve uma vontade própria e faminta.`,
        type: "Monstro enorme, gosma",
        ac: "18",
        hp: "152 (16d12 + 48)",
        speed: "15 metros, voo 18 metros (flutuar).",
        stats: {
            forca: "16 (+3)",
            destreza: "24 (+7)",
            constituicao: "16 (+3)",
            inteligencia: "6 (-2)",
            sabedoria: "14 (+2)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Fogo; Concussão, Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Imunidades",
                desc: "Elétrico, Veneno, Condição Caído, Agarrado, Impedido."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Frio (O frio estabiliza o plasma, tornando-o sólido e reduzindo sua DES para 10 por 1 rodada)."
            },
            {
                nome: "Rastro de íons",
                desc: "Onde a Enguia se move, ela deixa um rastro de ar ionizado que dura até o início do seu próximo turno. Qualquer criatura que atravesse esse rastro sofre 7 (2d6) de dano elétrico."
            },
            {
                nome: "Corpo de quarta matéria",
                desc: "A Enguia é feita de gás superaquecido e eletricidade. Ataques corpo a corpo que a atinjam fazem com que o atacante sofra 5 (1d10) de dano elétrico e 5 (1d10) de dano de fogo devido ao calor extremo do plasma."
            },
            {
                nome: "Hiper aceleração",
                desc: "A Enguia pode usar a ação de Disparada como uma Ação Bónus. Além disso, ela não provoca ataques de oportunidade ao sair do alcance de um inimigo."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "A Enguia realiza três ataques: um de Bote de Plasma e dois de Chicote de Arco."
            },
            {
                nome: "Bote de plasma",
                desc: "Ataque Corpo a Corpo: +10 para acertar, alcance 3m. Dano: 14 (2d6 + 7) de dano elétrico + 7 (2d6) de dano de fogo. O alvo deve passar em uma RES de Constituição (CD 18) ou ficará Atordoado até o fim do turno dele."
            },
            {
                nome: "Chicote de arco",
                desc: "Ataque Corpo a Corpo: +10 para acertar, alcance 6m. Dano: 17 (3d6 + 7) de dano elétrico. Se houver outra criatura a até 3 metros do alvo, o raio salta para ela, causando 10 (3d6) de dano elétrico."
            },
            {
                nome: "Sobrecarga de ionização (Recarga 5t)",
                desc: "A Enguia brilha intensamente e libera uma explosão de plasma em um raio de 9 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 18). Falha: Sofre 42 (12d6) de dano elétrico e fica Cega por 1 rodada. Sucesso: Metade do dano e não fica cega."
            }
        ],
        sentidos: {
            percepcaoPassiva: "12",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: "Núcleo de Fusão Instável"
            },
            {
                range: "2",
                item: "Filamento de Condutividade Infinita"
            },
            {
                range: "3",
                item: "Óleo de Ozono Purificado"
            },
            {
                range: "4",
                item: "Pele de Plasma Solidificada"
            }
        ]
    },
    oozeDeMetal: {
        name: "Ooze de metal",
        rarity: "Incomum",
        icon: "https://i.imgur.com/3ZZrRKZ.png",
        image: "https://i.imgur.com/hmt6pPC.jpeg",
        subtitle: "CR 8",
        description: `O Ooze de Ferro é conhecido entre os engenheiros de cerco e aventureiros veteranos como a Sentinela do Arsenal Ancestral. Classificado nos registros reais como uma Calamidade Marchante de Rank S, esta entidade é o ápice da evolução mecânica e física no Caminho Bestial. Ele representa o ponto onde a biologia das gosmas assimila completamente a dureza e a complexidade do metal forjado, tornando-se uma fortaleza de lâminas e bigornas senciante.

Diferente de suas formas anteriores, o Ooze de Ferro não é apenas uma massa de metal; ele é uma inteligência coloidal que manipula o magnetismo e a física molecular. Ele não habita apenas cavernas ou masmorras; ele remodela o próprio ambiente, transformando rochas em sucata metálica e metais raros em parte de sua carapaça impenetrável. Sua mera presença altera os campos magnéticos locais, fazendo com que as bússolas falhem e as armaduras de metal dos oponentes se tornem pesadas e restritivas.

Relatos de batalhas lendárias descrevem o encontro com esta criatura como 'lutar contra uma fábrica de guerra viva'. Ele pode moldar seus membros instantaneamente para criar armas de cerco complexas, escudos impenetráveis ou milhares de agulhas metálicas que ele dispara como uma tempestade. O maior perigo, no entanto, é seu 'Magnetismo Inverso', uma habilidade capaz de arrancar as armas e armaduras dos campeões instantaneamente. Enfrentá-lo sem magias de calor intenso de Rank S, armas de adamante ou habilidades que ignorem a densidade física é aceitar uma morte rápida e esmagadora, tornando-se apenas mais uma matéria-prima para ser mastigada e integrada à sua massa metálica.`,
        type: "Monstro enorme, gosma",
        ac: "20",
        hp: "170 (15d12 + 75)",
        speed: "9 metros, escalar 9 metros.",
        stats: {
            forca: "22 (+6)",
            destreza: "14 (+2)",
            constituicao: "20 (+5)",
            inteligencia: "6 (-2)",
            sabedoria: "12 (+1)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Psíquico; Concussão, Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Imunidades",
                desc: "Veneno, Condição Caído, Agarrado, Impedido, Exaustão."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Fogo (O calor amolece sua estrutura, reduzindo sua CA em 2 por 1 rodada)."
            },
            {
                nome: "Magnetismo inverso",
                desc: "Projéteis de metal disparados contra o Ooze têm Desvantagem no ataque. Criaturas usando armaduras de metal que comecem o turno a até 3 metros do Ooze têm seu deslocamento reduzido pela metade devido à atração magnética."
            },
            {
                nome: "Corpo de lâminas reativas",
                desc: "Qualquer criatura que atinja o Ooze com um ataque corpo a corpo a menos de 1 metro sofre 9 (2d8) de dano cortante, conforme espinhos de metal saltam da superfície do monstro."
            },
            {
                nome: "Devorador de aço",
                desc: "Sempre que uma arma não-mágica de metal atingir o Ooze, ela recebe uma penalidade de -1 permanente no dano. Se a penalidade chegar a -5, a arma quebra. Se o Ooze destruir uma arma desta forma, ele recupera 10 PV."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Ooze realiza três ataques: dois de Lâmina de Mercúrio e um de Pancada de Bigorna."
            },
            {
                nome: "Lâmina de mercurio",
                desc: "Ataque Corpo a Corpo: +9 para acertar, alcance 4m. Dano: 15 (2d8 + 6) de dano cortante. Se o alvo for uma criatura, ela deve passar em uma RES de Destreza (CD 17) ou sofrerá um sangramento que causa 5 (1d10) de dano no início de cada um dos seus turnos por 1 minuto."
            },
            {
                nome: "Pancada de bigorna",
                desc: "Ataque Corpo a Corpo: +9 para acertar, alcance 1m. Dano: 19 (3d8 + 6) de dano de concussão. O alvo deve passar em uma RES de Força (CD 17) ou ficará Caído e Atordoado até o fim do próximo turno do Ooze."
            },
            {
                nome: "Tormenta de estilhaços (Recarga 5t)",
                desc: "O Ooze gira sua massa e dispara milhares de agulhas metálicas em um raio de 9 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 17). Falha: Sofre 35 (10d6) de dano perfurante e fica Envenenada (contaminação por metal pesado). Sucesso: Metade do dano e não fica envenenada."
            }
        ],
        sentidos: {
            percepcaoPassiva: "11",
            visaoEscuro: "36m sentido sismico"
        },
        drops: [
            {
                range: "1",
                item: "Núcleo de Ferro Líquido"
            },
            {
                range: "2",
                item: "Placa de Aço Orgânico"
            },
            {
                range: "3",
                item: "Poeira de Magnetite Pura"
            },
            {
                range: "4",
                item: "Fragmento de Lâmina Senciante"
            }
        ]
    },
    oozeDaPeste: {
        name: "Ooze da peste",
        rarity: "Incomum",
        icon: "https://i.imgur.com/RNoWwam.png",
        image: "https://i.imgur.com/TWbOrJD.jpeg",
        subtitle: "CR 8",
        description: `O Ooze da Peste é conhecido entre os clérigos e estudiosos da necromancia como a Calamidade da Entropia. Classificado nos registros reais como uma Anomalia de Erradicação Local de Rank S, esta entidade é o estágio final da decomposição no Caminho Bestial no Nível 10. Ele representa o ponto onde a biologia das gosmas assimila completamente o mana necrótico, tornando-se uma força de terraformação senciante voltada para a morte.

Diferente de suas formas anteriores, o Ooze da Peste não depende apenas de sua massa física para lutar. Ele desenvolveu um controle primitivo, porém devastador, sobre patógenos mágicos e gases necrosantes. O ar ao seu redor é tão denso que os pulmões de um humano comum podem entrar em colapso apenas por estarem por perto. Sua paciência é lendária; ele pode permanecer imóvel por décadas, sendo confundido com um pântano natural, até que o primeiro passo de um invasor desperte seu núcleo de peste.

Relatos de batalhas lendárias descrevem o encontro com esta criatura como 'lutar contra uma pandemia senciante'. Ele não ataca com estratégia convencional; ele flui pelo campo de batalha como um gás tóxico, atingindo múltiplos alvos simultaneamente através de seu miasma. O maior perigo, no entanto, é sua 'Pandemia Final', uma habilidade capaz de liquefazer e explodir em uma névoa negra que cobre um raio de 30 metros, espalhando morte instantânea. Enfrentá-lo sem magias de cura mágica de Rank S, armas radiantes ou habilidades que ignorem a densidade física é aceitar uma morte rápida e silenciosa, tornando-se apenas mais uma matéria-prima para ser mastigada e integrada à sua massa necrótica.`,
        type: "Monstro enorme, gosma",
        ac: "14",
        hp: "+190 (20d12 + 60)",
        speed: "9m, escalar 9m",
        stats: {
            forca: "20 (+5)",
            destreza: "8 (-1)",
            constituicao: "22 (+6)",
            inteligencia: "6 (-2)",
            sabedoria: "14 (+2)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Concussão, Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Imunidade",
                desc: "Necrótico, Veneno, Condição Envenenado, Exaustão, Caído."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Luz, Sagrado"
            },
            {
                nome: "Miasma de Decomposição",
                desc: "O Ooze exala uma nuvem de esporos negros em um raio de 9 metros. Qualquer criatura que comece seu turno na área deve passar em uma RES de Constituição (CD 17). Em uma falha, sofre 10 (3d6) de dano necrótico e fica Envenenada. Enquanto estiver envenenada desta forma, a criatura não pode recuperar Pontos de Vida."
            },
            {
                nome: "Corpo Parasitário",
                desc: "Sempre que o Ooze for atingido por um ataque corpo a corpo, o atacante deve passar em uma RES de Destreza (CD 17) ou uma parte da gosma infectada saltará em sua pele, causando 7 (2d6) de dano necrótico no início de cada um de seus turnos. O efeito pode ser removido com uma ação e um teste de Medicina ou cura mágica."
            },
            {
                nome: "Banquete de Almas",
                desc: "Sempre que uma criatura a até 18 metros do Ooze morrer, ele recupera 20 PV e ganha Vantagem em seu próximo ataque."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Ooze realiza três ataques: dois de Tentáculo de Carne e um de Esmagamento Pútrido."
            },
            {
                nome: "Tentáculo de Carne",
                desc: "Ataque Corpo a Corpo: +8 para acertar, alcance 6m. Dano: 12 (2d6 + 5) de impacto + 10 (3d6) de necrótico. O alvo deve passar em uma RES de Constituição (CD 17) ou terá sua Força reduzida em 1d4. A criatura morre se sua Força chegar a 0."
            },
            {
                nome: "Esmagamento Pútrido",
                desc: "Ataque Corpo a Corpo: +8 para acertar, alcance 1,5m. Dano: 18 (3d8 + 5) de impacto + 14 (4d6) de necrótico. O alvo fica Agarrado (CD 17 para escapar). No início de cada turno que estiver agarrado, o alvo sofre 20 de dano necrótico."
            },
            {
                nome: "Vomitar Peste (Recarga 5t)",
                desc: "O Ooze expele uma torrente de fluidos infecciosos em um cone de 12 metros. Cada criatura na área deve fazer uma RES de Constituição (CD 17). Falha: Sofre 45 (10d8) de dano necrótico e contrai a Peste do Ooze (Reduz o máximo de PV em 10 a cada hora até ser curado). Sucesso: Metade do dano e não contrai a peste."
            }
        ],
        sentidos: {
            percepcaoPassiva: "12",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: " Glândula de Toxina Absoluta"
            },
            {
                range: "2",
                item: "Fragmento de Osso Infectado"
            },
            {
                range: "3",
                item: "Essência de Peste Destilada"
            },
            {
                range: "4",
                item: "Manto de Carne de Ooze"
            }
        ]
    },
    abominacaoViscosa: {
        name: "Abominação Viscosa",
        rarity: "Incomum",
        icon: "https://i.imgur.com/DnWdbL5.png",
        image: "https://i.imgur.com/Icloj41.jpeg",
        subtitle: "CR 14",
        description: `Nos anais das Grandes Calamidades, poucos nomes evocam tanto terror quanto a Abominação Viscosa. Classificada como uma Entidade de Erradicação Global de Rank SS, ela representa o ápice bizarro e aterrorizante da evolução das gosmas. Seus registros datam de eras onde biomas inteiros simplesmente desapareceram do mapa, restando apenas planícies de rocha derretida e silêncio.

A Abominação não é apenas um monstro; ela é um ecossistema digestivo senciante de escala Gargantua. Relatos de heróis lendários que sobreviveram ao encontro descrevem sua massa como uma 'montanha translúcida de ódio e ácido'. Sua biologia desafia a lógica mágica: ela desenvolveu a capacidade de Absorver Ácido, o que significa que tentativas de combatê-la com feitiços corrosivos apenas a tornam maior, mais forte e regeneram seu núcleo vital instantaneamente.

O ar ao seu redor é uma sentença de morte, saturado por um Miasma Corrosivo que derrete carne e aço antes mesmo do combate físico começar. Sua tática mais aterrorizante é o 'Engolfar', onde ela simplesmente avança e assimila exércitos inteiros para dentro de seu corpo, onde a morte não vem pelo esmagamento, mas por uma desintegração molecular lenta e dolorosa à vista de todos, através de sua pele translúcida.

Enfrentar uma Abominação Viscosa requer poder de fogo de Rank Épico (Nível 15+) e, acima de tudo, a compreensão de que cada golpe desferido contra ela pode causar uma Divisão Celular, criando novos Slimes Ácidos menores para proteger o núcleo principal. Ela é a prova viva de que a forma de vida mais simples, quando alimentada por mana infinito e gula insaciável, pode se tornar o predador supremo de um mundo.`,
        type: "Monstro imenso (gargantua), gosma",
        ac: "16",
        hp: "+290 (20d20 + 80)",
        speed: "12m, escalar 12m, natação 12m",
        stats: {
            forca: "26 (+8)",
            destreza: "10 (+0)",
            constituicao: "26 (+8)",
            inteligencia: "8 (-1)",
            sabedoria: "16 (+3)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que a Abominação Viscosa for alvo de dano de ácido, ela não sofre dano. Em vez disso, ela recupera uma quantidade de Pontos de Vida igual a metade do dano que seria causado."
            },
            {
                nome: "Imunidades",
                desc: "Veneno, Psíquico. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado."
            },
            {
                nome: "Aura de vapor corrosivo",
                desc: "No início de cada turno da Abominação, todas as criaturas a até 6 metros dela devem passar em uma RES de Constituição (CD 21). Se falharem, sofrem 14 (4d6) de dano de ácido e ficam envenenadas pela fumaça tóxica. Objetos não-mágicos na área sofrem dano corrosivo contínuo."
            },
            {
                nome: "Divisão celular reativa",
                desc: "Sempre que a Abominação sofrer 50 de dano ou mais em um único turno, ela expele um Slime Ácido (CR 2) em um espaço adjacente. Esse slime age na iniciativa da Abominação e ataca o inimigo mais próximo."
            },
            {
                nome: "Amorfo e inescapável",
                desc: "A Abominação pode passar por espaços de até 2 centímetros de largura sem se espremer. Além disso, ela tem vantagem em testes de agarrar e pode manter até 4 criaturas Médias ou 2 Grandes presas em seu corpo simultaneamente."
            },
            {
                nome: "Ação lendária",
                desc: "Pode executar 3 ações por rodada"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "A Abominação realiza três ataques: dois de Pancada Ácida e um de Engolfar."
            },
            {
                nome: "Pancada ácida",
                desc: "Ataque Corpo a Corpo: +13 para acertar, alcance 6m. Dano: 21 (3d8 + 8) de impacto + 18 (4d8) de ácido. Se o alvo estiver usando uma armadura não-mágica, ela sofre uma penalidade permanente de -1 na CA."
            },
            {
                nome: "Engolfar",
                desc: "A Abominação tenta envolver uma criatura a até 3 metros. O alvo deve passar em uma RES de Destreza (CD 21).  Sucesso: O alvo é empurrado 1,5m para fora do espaço da Abominação.  Falha: O alvo entra no corpo da Abominação, fica Impedido e começa a sufocar. No início de cada turno da criatura presa, ela sofre 36 (8d8) de dano de ácido."
            },
            {
                nome: "Dilúvio de Enzimas (Recarga 5t)",
                desc: "A Abominação expele um jato de ácido concentrado em um cone de 18 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 21). Falha: Sofre 63 (14d8) de dano de ácido. Sucesso: Metade do dano."
            },
            {
                nome: "Deslocamento fluido",
                desc: "A Abominação se move até metade de seu deslocamento sem provocar ataques de oportunidade."
            },
            {
                nome: "Jato ocular",
                desc: "A Abominação dispara um feixe de ácido em uma criatura a até 18 metros. +13 para acertar. Dano: 18 (4d8) de ácido."
            },
            {
                nome: "Pulso Repulsivo (custa 2 ações)",
                desc: "A Abominação expande sua massa violentamente. Todas as criaturas a até 6 metros devem passar em uma RES de Força (CD 21) ou serão empurradas 9 metros para trás e ficarão Caídas."
            }
        ],
        sentidos: {
            percepcaoPassiva: "13",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: "Enzima Universal Destilada"
            },
            {
                range: "2",
                item: "Membrana de Proteção Ácida"
            },
            {
                range: "3",
                item: "Núcleo da Abominação"
            },
            {
                range: "4",
                item: "Vesícula de Gás Tóxico"
            }
        ]
    },
    hidraDeLava: {
        name: "Hidra de lava",
        rarity: "Incomum",
        icon: "https://i.imgur.com/2vfq5pZ.png",
        image: "https://i.imgur.com/CXe2xg4.jpeg",
        subtitle: "CR 14",
        description: `A Hidra de Lava é conhecida nos textos antigos como o Vulcão que Caminha. Classificada como uma Entidade de Erradicação Biológica de Rank SS, ela representa o estágio onde o lodo de magma deixa de ser uma simples massa rastejante para se tornar um predador alfa multicefálico. Ela não habita apenas vulcões; ela é a própria consciência do núcleo terrestre manifestada em uma forma de vida coloidal.

A anatomia da Hidra de Lava é um milagre de horror geológico. Suas cinco cabeças não são membros fixos, mas extensões fluidas de um núcleo de mana superaquecido. Isso permite que ela regenere cabeças perdidas em questão de segundos, utilizando a fusão térmica para selar feridas e criar novos apêndices. Sua habilidade de Absorção de Fogo torna qualquer tentativa de ataque piromântico um erro fatal, pois a criatura consome a energia do feitiço para aumentar sua própria massa e temperatura, atingindo estados de calor que podem derreter o aço lendário em segundos.

O perigo da Hidra de Lava não reside apenas em suas mordidas ou em seu sopro piroclástico, mas em sua influência no ecossistema. Por onde ela passa, a crosta terrestre se rompe e o ar se torna uma sopa tóxica de cinzas e enxofre. Ela é uma força da natureza que não possui predadores, pois qualquer criatura que tente tocá-la é instantaneamente consumida pelo seu Corpo de Convecção. Enfrentá-la exige não apenas força bruta, mas o uso estratégico de magias de congelamento absoluto de Rank Épico para desacelerar sua regeneração molecular, antes que ela transforme o continente inteiro em um deserto de vidro e cinzas.`,
        type: "Monstro imenso, gosma",
        ac: "18",
        hp: "275 (19d20 + 76)",
        speed: "9m, natação (lava) 18m",
        stats: {
            forca: "26 (+8)",
            destreza: "8 (-1)",
            constituicao: "24 (+7)",
            inteligencia: "7 (-2)",
            sabedoria: "15 (+2)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que a Hidra de Lava for alvo de dano de fogo, ela não sofre dano. Em vez disso, ela recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se a cura exceder seu máximo, ela ganha o restante como Pontos de Vida Temporários."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Concussão, Cortante e Perfurante de armas não-mágicas. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado."
            },
            {
                nome: "Múltiplas Cabeças",
                desc: "A Hidra começa com 5 cabeças. Enquanto tiver mais de uma cabeça, ela tem vantagem em testes de resistência contra ser cega, surda ou atordoada. Sempre que a Hidra sofrer 40 de dano em um único turno, uma cabeça morre. No início do turno dela, duas cabeças crescem para cada uma que morreu, a menos que ela tenha recebido dano de frio no último turno."
            },
            {
                nome: "Corpo de convecção",
                desc: "Qualquer criatura que comece seu turno a até 6 metros da Hidra sofre 10 (3d6) de dano de fogo devido ao calor irradiado. Criaturas que tocarem a Hidra ou a atingirem com um ataque corpo a corpo a 1 metro sofrem 14 (4d6) de dano de fogo."
            },
            {
                nome: "Rastro de Magma",
                desc: "O solo por onde a Hidra passa se torna lava por 1 minuto. Criaturas que entrarem ou terminarem o turno nessa área sofrem 10 (3d6) de dano de fogo e têm seu deslocamento reduzido pela metade."
            },
            {
                nome: "Ações Lendárias",
                desc: "pode realizar até 3 ações por rodada"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "A Hidra realiza um ataque de mordida para cada cabeça que possuir (máximo de 5 no multiataque)."
            },
            {
                nome: "Mordida de Magma",
                desc: "Ataque Corpo a Corpo: +13 para acertar, alcance 6m. Dano: 15 (2d6 + 8) de impacto + 10 (3d6) de fogo. O alvo deve passar em uma RES de Força (CD 21) ou ficará Agarrado pela mandíbula viscosa."
            },
            {
                nome: "Sopro de Piroclasto (Recarga 5t)",
                desc: "Todas as cabeças expelem uma rajada combinada de lava e cinzas em um cone de 18 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 21). Falha: Sofre 56 (16d6) de dano de fogo e fica Cega por 1 rodada pelas cinzas. Sucesso: Metade do dano e não fica cega."
            },
            {
                nome: "Chicote de Lava",
                desc: "Uma das cabeças golpeia em área. Criaturas em uma linha de 9 metros devem passar em uma RES de Destreza (CD 21) ou sofrem 14 (4d6) de dano de fogo e ficam caídas."
            },
            {
                nome: "Regeneração Térmica",
                desc: "A Hidra consome parte do magma ao seu redor, recuperando 20 PV."
            },
            {
                nome: "Explosão de Vapor (custa 2 ações)",
                desc: "Se a Hidra estiver em contato com água ou gelo, ela gera uma explosão de vapor. Criaturas a até 9 metros sofrem 21 (6d6) de dano de fogo (escaldante) e são empurradas 6 metros."
            }
        ],
        sentidos: {
            percepcaoPassiva: "12",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: "Coração do Vulcão"
            },
            {
                range: "2",
                item: "Couro de Basalto Flexível"
            },
            {
                range: "3",
                item: "Presas de Obsidiana Eterna"
            },
            {
                range: "4",
                item: "Sangue de Magma Estabilizado"
            }
        ]
    },
    krakenHidrologico: {
        name: "Kraken Hidrológico",
        rarity: "Incomum",
        icon: "https://i.imgur.com/aDkmVEK.png",
        image: "https://i.imgur.com/nmH3SNG.jpeg",
        subtitle: "CR 14",
        description: `Nos registros das Grandes Calamidades Marítimas, o Kraken Hidrológico é listado não como um monstro, mas como um evento teocrático senciante. Classificada como uma Entidade de Erradicação Naval de Rank SS, ela representa o estágio onde o Caminho Bestial da Água atinge a Singularidade Hidrostática. Ela não é uma criatura que vive no oceano; ela é a própria fúria das profundezas abissais manifestada em uma forma coloidal.

A anatomia do Kraken Hidrológico desafia as leis físicas do mundo de superfície. Composta inteiramente de água super-pressionada e mana criogênico, ela não possui órgãos ou estrutura óssea. Seus oito tentáculos são, na verdade, correntes marítimas independentes, moldadas pela sua vontade molecular para possuírem a densidade do aço e a flexibilidade da seda. Sua habilidade de Absorção de Água e Frio torna-a praticamente imortal em seu bioma nativo, pois qualquer tentativa de combatê-la com seu próprio elemento ou magias de congelamento apenas a torna mais densa, maior e regenera seu núcleo vital instantaneamente.

O maior perigo da Hidra de Lava não reside apenas em seus ataques físicos, mas na sua influência no ecossistema. A mera presença da criatura distorce o ambiente ao seu redor, criando uma Aura de Pressão Abissal que esmaga os pulmões e os cascos dos navios muito antes do combate começar. Enfrentar um Kraken Hidrológico sem magias de eletricidade de Rank Épico ou habilidades que possam desestabilizar a coesão molecular da água é aceitar uma morte por afogamento ou esmagamento, tornando-se apenas mais uma gota em sua massa líquida infinita.`,
        type: "Monstro imenso, gosma",
        ac: "17",
        hp: "285 (19d20 + 86)",
        speed: "6m, natação 24m",
        stats: {
            forca: "26 (+8)",
            destreza: "14 (+2)",
            constituicao: "24 (+7)",
            inteligencia: "10 (+0)",
            sabedoria: "18 (+4)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Kraken Hidrológico for alvo de dano de frio ou ataques baseados em água, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se ele estiver submerso, recupera 20 PV no início de cada um dos seus turnos."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Ácido; Concussão, Cortante e Perfurante de armas não-mágicas. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado."
            },
            {
                nome: "Aura de pressão abissal",
                desc: "O ar ao redor do Kraken (raio de 9 metros) torna-se denso como se estivesse a quilómetros de profundidade. Criaturas na área têm o seu deslocamento reduzido a metade e sofrem 7 (2d6) de dano de concussão no início de cada um dos seus turnos devido à pressão."
            },
            {
                nome: "Corpo de fluidez infinita",
                desc: "O Kraken pode ocupar o espaço de outra criatura e vice-versa. Ele pode passar por aberturas de até 1 centímetro sem se espremer. Ataques à distância contra ele têm Desvantagem, pois os projéteis são desviados pela sua massa líquida em movimento."
            },
            {
                nome: "Tentáculos de corrente",
                desc: "O Kraken possui 8 tentáculos líquidos independentes. Ele pode usar cada um deles para agarrar uma criatura diferente. Enquanto uma criatura estiver agarrada, ela está Sufocando (mesmo fora da água), pois o lodo aquático invade as suas vias respiratórias."
            },
            {
                nome: "Ações Lendárias",
                desc: "Pode realizar 3 ações por turno"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Kraken realiza três ataques de Tentáculo Esmagador. Ele pode substituir um destes ataques pelo uso do seu Jato de Pressão."
            },
            {
                nome: "Tentáculo esmagador",
                desc: "Ataque Corpo a Corpo: +13 para acertar, alcance 12m. Dano: 19 (3d6 + 8) de dano de concussão + 10 (3d6) de dano de frio. O alvo deve passar numa RES de Força (CD 21) ou ficará Agarrado e Impedido."
            },
            {
                nome: "Jato de pressão (Recarga 5t)",
                desc: "O Kraken dispara um canhão de água concentrada numa linha de 30 metros de comprimento por 3 metros de largura. Cada criatura na linha deve fazer uma RES de Destreza (CD 21). Falha: Sofre 54 (12d8) de dano de concussão e é empurrada 15 metros para trás. Sucesso: Metade do dano e não é empurrada."
            },
            {
                nome: "Vórtice aprisionador",
                desc: "O Kraken gira a sua massa líquida, criando um redemoinho num raio de 12 metros centrado em si mesmo. Todas as criaturas na área devem fazer uma RES de Força (CD 21) ou serão puxadas para o centro, ficando Agarradas e sofrendo 21 (6d6) de dano de frio."
            },
            {
                nome: "Chicote de corrente",
                desc: "O Kraken ataca com um tentáculo a uma criatura a até 12 metros."
            },
            {
                nome: "Mudança de estado",
                desc: "O Kraken torna-se momentaneamente vaporoso. Ele move-se até ao seu deslocamento de natação sem provocar ataques de oportunidade e pode atravessar o espaço de inimigos."
            },
            {
                nome: "Explosão de Maré (custa 2 ações)",
                desc: "O Kraken liberta uma onda de choque de água. Todas as criaturas a até 6 metros devem passar numa RES de Força (CD 21) ou cairão Caídas e sofrerão 14 (4d6) de dano de concussão."
            }
        ],
        sentidos: {
            percepcaoPassiva: "14",
            visaoEscuro: "60m (sentido sismo na água)"
        },
        drops: [
            {
                range: "1",
                item: "Coração do Oceano Infinito"
            },
            {
                range: "2",
                item: "Membrana Hidrostática"
            },
            {
                range: "3",
                item: "Tinta de Abismo Concentrada"
            },
            {
                range: "4",
                item: "Núcleo de Pressão"
            }
        ]
    },
    devoradorDeNeve: {
        name: "Devorador de Neve",
        rarity: "Incomum",
        icon: "https://i.imgur.com/QZ9vIIE.png",
        image: "https://i.imgur.com/fAGGmvk.jpeg",
        subtitle: "CR 14",
        description: `Nos tomos das Grandes Calamidades Climatológicas, o Devorador de Neve é descrito não como uma criatura, mas como uma entropia ambulante. Classificada como uma Entidade de Erradicação Geográfica de Rank SS, ela representa o estágio onde o Caminho Bestial do Gelo deixa de ser uma simples massa de gelo para se tornar a própria vontade do inverno eterno manifestada. Ela não apenas habita regiões geladas; ela consome ativamente o calor do mundo, transformando ecossistemas vibrantes em desertos brancos e sem vida em questão de dias.

A anatomia do Devorador de Neve é um milagre de horror criogênico. Composta inteiramente de neve compactada e gelo glacial senciante, ela possui uma densidade que rivaliza com o aço mítico. Sua habilidade de Absorção de Frio torna-a praticamente invulnerável em seu bioma nativo, pois qualquer tentativa de combatê-la com seu próprio elemento apenas a torna maior, mais forte e regenera seu núcleo vital instantaneamente. Ela não consome matéria orgânica; ela consome entropia, drenando a energia térmica de tudo ao seu redor, incluindo a força vital de seres vivos.

O maior perigo do Devorador de Neve não reside apenas em seus ataques físicos devastadores, mas na sua influência no ambiente. A mera presença da criatura distorce as leis da física, criando um Campo de Zero Absoluto onde o movimento torna-se lento e o próprio ar torna-se uma lâmina mortal de gelo. Enfrentar um Devorador de Neve sem magias de fogo de Rank Épico ou habilidades que possam desestabilizar a coesão molecular do gelo é aceitar uma morte por congelamento instantâneo, tornando-se apenas mais uma estátua de gelo em seu domínio eterno.`,
        type: "Monstro enorme, gosma",
        ac: "19",
        hp: "280 (18d20 + 90)",
        speed: "12m, escalar 12m",
        stats: {
            forca: "24 (+7)",
            destreza: "10 (+0)",
            constituicao: "20 (+5)",
            inteligencia: "8 (-1)",
            sabedoria: "16 (+3)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Devorador de Neve for alvo de dano de frio, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Além disso, se ele estiver em um ambiente com neve ou gelo, recupera 15 PV no início de cada um de seus turnos."
            },
            {
                nome: "Imunidade",
                desc: "Veneno; Concussão, Cortante e Perfurante de armas não-mágicas. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Fogo."
            },
            {
                nome: "Campo de zero absoluto",
                desc: "Uma aura de frio extremo emana da criatura em um raio de 12 metros. Criaturas que entrem ou comecem o turno na área sofrem 14 (4d6) de dano de frio e têm sua velocidade reduzida em 3 metros (acumulativo até o alvo parar). Se a velocidade de uma criatura chegar a 0 devido a este efeito, ela fica Petrificada (congelada em gelo sólido)."
            },
            {
                nome: "Massa de neve compacta",
                desc: "Ataques de projéteis (flechas, virotes) que atingem o Devorador ficam presos em sua massa. Ele pode usar uma ação bônus para disparar todos os projéteis presos de volta em um cone de 9 metros, causando 2d10 de dano perfurante."
            },
            {
                nome: "Caminhada de nevasca",
                desc: "O Devorador de Neve é invisível enquanto estiver dentro de uma nevasca ou área de neve pesada."
            },
            {
                nome: "Ação lendária",
                desc: "Pode realizar 3 ações por rodada"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Devorador realiza três ataques: dois de Esmagamento Glacial e um de Sorvedouro de Calor."
            },
            {
                nome: "Esmagamento glacial",
                desc: "Ataque Corpo a Corpo: +12 para acertar, alcance 4m. Dano: 20 (3d8 + 7) de impacto + 10 (3d6) de frio. O alvo deve passar em uma RES de Força (CD 20) ou ficará Caído sob o peso da neve."
            },
            {
                nome: "Sorvedouro de calor",
                desc: "Ataque Corpo a Corpo: +12 para acertar, alcance 1m. Dano: 24 (7d6) de frio. O Devorador drena a energia térmica do alvo. O alvo deve passar em uma RES de Constituição (CD 20) ou receberá um nível de Exaustão. O Devorador recupera PV igual ao dano causado."
            },
            {
                nome: "Avalanche viva (Recarga 5t)",
                desc: "O Devorador se projeta para frente em uma linha de 18 metros. Todas as criaturas no caminho devem fazer uma RES de Destreza (CD 20). Falha: Sofre 45 (10d8) de dano de impacto, é empurrada para o fim da linha e fica Enterrada (Impedida e Sufocando, CD 20 de Força para sair). Sucesso: Metade do dano e é movida para o espaço seguro mais próximo."
            },
            {
                nome: "Flash de gelo",
                desc: "Uma criatura a até 12 metros deve passar em uma RES de Constituição (CD 20) ou ficará Cega até o final do próximo turno devido ao brilho da neve."
            },
            {
                nome: "Solidificar",
                desc: "O Devorador endurece sua pele de neve, ganhando +2 de CA até o início do seu próximo turno."
            },
            {
                nome: "Tempestade de granizo (custa 2 ações)",
                desc: "Pedras de gelo caem em um raio de 9 metros. Criaturas na área sofrem 14 (4d6) de dano de impacto e 7 (2d6) de frio."
            }
        ],
        sentidos: {
            percepcaoPassiva: "13",
            visaoEscuro: "36m (sensor de calor)"
        },
        drops: [
            {
                range: "1",
                item: "Coração de Gelo Eterno"
            },
            {
                range: "2",
                item: "Essência de Frio Absoluto"
            },
            {
                range: "3",
                item: "Manto de Neve Senciente"
            },
            {
                range: "4",
                item: "Fragmento de Presa Glacial"
            }
        ]
    },
    serpenteTectonica: {
        name: "Serpente Tectonica",
        rarity: "Incomum",
        icon: "https://i.imgur.com/gZEMNXA.png",
        image: "https://i.imgur.com/nLS34Nc.jpeg",
        subtitle: "CR 14",
        description: `Nos tomos sagrados que registram as Grandes Calamidades Planetárias, a Serpente Tectônica é listada não como um ser vivo, mas como uma falha geológica senciante. Classificada como uma Entidade de Erradicação Geográfica de Rank SS, ela representa o estágio final onde o Caminho Bestial da Terra deixa de ser apenas rocha e lama para se tornar a própria vontade esmagadora do núcleo do planeta. Ela não habita montanhas ou cavernas; ela é o movimento que as demole.

A anatomia da Serpente Tectônica é uma maravilha de horror geológico. Composta por segmentos independentes de diamantes negros e granito arcaico, sua densidade é tão absurda que ela gera seu próprio Campo Gravitacional Intenso. Essa aura distorce o espaço ao seu redor, impedindo que inimigos fujam enquanto o solo ao redor é puxado e compactado em sua massa. Sua habilidade de Absorção de Terra torna-a praticamente invulnerável em seu bioma nativo, pois tentativas de atacá-la com pedras ou magias terrestres apenas preenchem as rachaduras em sua armadura, regenerando seu núcleo vital instantaneamente.

O maior perigo da Serpente Tectônica reside em sua fome por estruturas compactas. Para ela, fortalezas de Rank Lendário são apenas concentrações de minerais prontos para serem mastigados e assimilados. Enfrentá-la exige poder de fogo de Rank Épico e, acima de tudo, o uso estratégico de magias de som (dano trovejante) para tentar rachar sua estrutura interna de diamante, antes que ela desencadeie um Pulso Tectônico e soterre o continente inteiro em um deserto de escombros e cinzas.`,
        type: "Monstro imenso, gosma",
        ac: "21",
        hp: "310 (20d20 + 100)",
        speed: "12m, escavação 18m",
        stats: {
            forca: "28 (+9)",
            destreza: "6 (-2)",
            constituicao: "26 (+8)",
            inteligencia: "8 (-1)",
            sabedoria: "16 (+3)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que a Serpente Tectônica for alvo de dano de terra, pedra ou magias que manipulem o solo, ela não sofre dano. Em vez disso, ela recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se ela estiver em contato direto com solo rochoso, recupera 15 PV no início de cada um de seus turnos."
            },
            {
                nome: "Imunidades",
                desc: "Veneno, Psíquico; Concussão, Cortante e Perfurante de armas não-mágicas. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Raio"
            },
            {
                nome: "Campo gravitacional intenso",
                desc: "A massa da Serpente é tão densa que ela gera seu próprio campo de gravidade. Qualquer criatura que comece seu turno a até 9 metros dela deve passar em uma RES de Força (CD 21). Em uma falha, o deslocamento da criatura é reduzido a zero e ela fica Impedida até o início de seu próximo turno."
            },
            {
                nome: "Segmento reativo",
                desc: "O corpo da Serpente é composto por 12 segmentos independentes. Sempre que sofrer um acerto crítico, um dos segmentos se quebra, mas a Serpente anula o dano extra do crítico. Ela recupera um segmento sempre que utilizar sua Absorção de Terra."
            },
            {
                nome: "Escavadora de desastres",
                desc: "Ao escavar, a Serpente não deixa túneis, mas causa um colapso imediato no solo acima dela. Qualquer estrutura em cima do caminho escavado pela Serpente sofre o dobro de dano de impacto."
            },
            {
                nome: "Ações Lendárias",
                desc: "Pode realizar três ações por turno"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "A Serpente realiza dois ataques: um de Bote Tectônico e um de Constrição Geológica."
            },
            {
                nome: "Bote Tectônico",
                desc: "Ataque Corpo a Corpo: +14 para acertar, alcance 9m. Dano: 22 (3d8 + 9) de impacto + 13 (3d8) de dano de terra. O alvo deve passar em uma RES de Força (CD 21) ou será arremessado 6 metros para trás e ficará Caído."
            },
            {
                nome: "Constrição Geológica",
                desc: "Ataque Corpo a Corpo: +14 para acertar, alcance 3m. Dano: 27 (4d8 + 9) de impacto. O alvo fica Agarrado (CD 21 para escapar). Enquanto estiver agarrado, o alvo sofre o efeito de esmagamento, recebendo 30 de dano de impacto no início de cada um de seus turnos."
            },
            {
                nome: "Pulso Tectônico (Recarga 5t)",
                desc: "A Serpente golpeia o solo com sua cauda, liberando uma onda de choque em um raio de 18 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 21). Falha: Sofre 65 (10d12) de dano de impacto e fica Petrificada (presa em rocha sólida) por 1 rodada. Sucesso: Metade do dano e não fica petrificada."
            },
            {
                nome: "Deslocamento Subterrâneo",
                desc: "A Serpente usa sua velocidade de escavação sem provocar ataques de oportunidade."
            },
            {
                nome: "Endurecer Placas",
                desc: "A Serpente ganha +2 de CA até o início do seu próximo turno."
            },
            {
                nome: "Chuva de detritos (custa 2 ações)",
                desc: "Pedras caem do teto ou surgem do chão. Criaturas em um círculo de 6 metros a até 18 metros sofrem 18 (4d8) de dano de impacto e a área torna-se terreno difícil."
            }
        ],
        sentidos: {
            percepcaoPassiva: "13",
            visaoEscuro: "120m (sentido sismico)"
        },
        drops: [
            {
                range: "1",
                item: "Coração Geodésico"
            },
            {
                range: "2",
                item: "Placa de Escama de Diamante Negro"
            },
            {
                range: "3",
                item: "Essência de Gravidade Destilada"
            },
            {
                range: "4",
                item: "Olho de Obsidiana Senciante"
            }
        ]
    },
    bestaDeRaios: {
        name: "Besta de raios",
        rarity: "Incomum",
        icon: "https://i.imgur.com/Bgbr9Fv.png",
        image: "https://i.imgur.com/a9iYGNQ.jpeg",
        subtitle: "CR 14",
        description: `A Besta de Raios é classificada nos registros reais como um Fenômeno Atmosférico Senciante de Rank SS. Ela representa o estágio final onde o Caminho Bestial Elétrico deixa de ser uma simples gosma para se tornar a própria vontade de uma tempestade destruidora manifestada em forma de plasma. Ela não apenas manipula a eletricidade; ela habita o limiar entre a matéria e a energia pura, gerando uma singularidade elétrica em seu núcleo que distorce as leis do magnetismo e da gravidade ao seu redor.

A anatomia da Besta de Raios desafia a lógica biológica do mundo de superfície. Composta inteiramente por plasma de quarta matéria e campos magnéticos instáveis, ela possui uma densidade de energia que a torna praticamente intocável. Sua habilidade de Absorção de Eletricidade torna-a imortal em qualquer ambiente eletrificado ou contra magias de seu elemento, pois qualquer energia elétrica desferida contra ela apenas alimenta seu núcleo vital, regenerando-a instantaneamente e potencializando seus ataques futuros. Ela não consome matéria orgânica; ela consome voltagem, drenando a energia estática do ambiente e a força vital de seres vivos.

O maior perigo da Besta de Raios não reside apenas em seus ataques físicos de plasma devastadores ou em suas descargas em arco que saltam entre exércitos, mas em sua influência passiva no ambiente. A mera presença da criatura distorce os campos magnéticos através de sua Atração Magnética Devastadora, tornando armaduras e armas de metal armadilhas mortais para seus portadores. Enfrentar uma Besta de Raios sem proteção isolante mágica de Rank Épico ou habilidades que possam aterrar sua energia é aceitar a aniquilação instantânea, onde o próprio sistema nervoso do oponente é usado como um condutor para a sobrecarga final da besta.`,
        type: "Monstro imenso, gosma",
        ac: "18",
        hp: "260 (20d20 + 50)",
        speed: "18m, flutuar 18m",
        stats: {
            forca: "18 (+4)",
            destreza: "26 (+8)",
            constituicao: "20 (+5)",
            inteligencia: "10 (+0)",
            sabedoria: "16 (+3)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que a Besta de Raios for alvo de dano elétrico, ela não sofre dano. Em vez disso, ela recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Além disso, após ser atingida por eletricidade, seu próximo ataque causa 14 (4d6) de dano elétrico extra."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Trovão; Concussão, Cortante e Perfurante de armas não-mágicas. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado."
            },
            {
                nome: "Atração magnética devastadora",
                desc: "Criaturas usando armaduras de metal ou empunhando armas de metal a até 9 metros da Besta têm seu deslocamento reduzido pela metade e sofrem Desvantagem em jogadas de ataque contra qualquer alvo que não seja a Besta de Raios, devido à força de tração magnética."
            },
            {
                nome: "Corpo de plasma instável",
                desc: "Qualquer criatura que atingir a Besta com um ataque corpo a corpo a menos de 1 metro sofre 10 (3d6) de dano elétrico. Se a arma utilizada for de metal, o dano aumenta para 17 (5d6)."
            },
            {
                nome: "Movimentação de corrente",
                desc: "A Besta de Raios não provoca ataques de oportunidade ao se mover de uma área eletrificada para outra, ou ao se mover através do espaço de uma criatura que esteja usando metal."
            },
            {
                nome: "Ações Lendárias",
                desc: "Pode realizar 3 ações por turno"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "A Besta realiza três ataques: dois de Chicote de Plasma e um de Descarga de Arco."
            },
            {
                nome: "Chicote de plasma",
                desc: "Ataque Corpo a Corpo: +13 para acertar, alcance 9m. Dano: 14 (2d6 + 7) de impacto + 14 (4d6) de dano elétrico. O alvo deve passar em uma RES de Constituição (CD 21) ou ficará Paralisado até o fim do seu próximo turno."
            },
            {
                nome: "Descarga de arco",
                desc: "Ataque à Distância: +13 para acertar, alcance 18m. Dano: 28 (8d6) de dano elétrico. O raio salta para até dois alvos adicionais a 6 metros do alvo original. Cada alvo extra deve fazer uma RES de Destreza (CD 21) para sofrer apenas metade do dano."
            },
            {
                nome: "Sobrecarga de sistema (Recarga 5t)",
                desc: "A Besta explode em um clarão azul intenso. Todas as criaturas em um raio de 12 metros devem fazer uma RES de Constituição (CD 21). Falha: Sofre 55 (10d10) de dano elétrico e fica Cega por 1 minuto. A criatura pode repetir o teste no final de cada turno. Sucesso: Metade do dano e não fica cega."
            },
            {
                nome: "Teletransporte de faísca",
                desc: "A Besta se transforma em um raio e se teletransporta para um ponto vazio que possa ver a até 18 metros."
            },
            {
                nome: "Revestimento estático",
                desc: "A Besta cria uma camada de íons. Ela ganha 20 Pontos de Vida Temporários. Enquanto tiver esses PV, qualquer um que a toque fica atordoado até o início do próximo turno da criatura."
            },
            {
                nome: "Pulso eletromagnético (consome 2 ações)",
                desc: "Todos os itens mágicos de metal em um raio de 6 metros perdem suas propriedades mágicas até o início do próximo turno da Besta."
            }
        ],
        sentidos: {
            percepcaoPassiva: "13",
            visaoEscuro: "36 (decção de impulsos nervosos e elétricos)"
        },
        drops: [
            {
                range: "1",
                item: "Núcleo de Plasma Estabilizado"
            },
            {
                range: "2",
                item: "Nervo de Cobre Místico"
            },
            {
                range: "3",
                item: "Essência de Ozônio Destilada"
            },
            {
                range: "4",
                item: "Fragmento de Carapaça de Vidro"
            }
        ]
    },
    quimeraDeLaminas: {
        name: "Quimera de Lâminas",
        rarity: "Raro",
        icon: "https://i.imgur.com/NnHp0yf.png",
        image: "https://i.imgur.com/D8PwRiv.jpeg",
        subtitle: "CR 14",
        description: `A Quimera de Lâminas é classificada nos anais de guerra como uma Calamidade Mecânica de Rank SS. Ela representa o ponto em que o Caminho Bestial do Metal abandona a forma de lodo inerte para abraçar uma complexidade geométrica predatória. Ela não é um monstro biológico, mas uma simulação perfeita de um predador alfa, construída inteiramente com as armas e armaduras de todos os guerreiros que ousaram enfrentá-la.

A biologia desta criatura é um paradoxo de engenharia mística. Seu corpo alterna constantemente entre o estado sólido do aço temperado e a fluidez do mercúrio senciante, permitindo que ela mimetize qualquer arma consumida. Sua habilidade de Absorção Metálica e de Força faz dela o pesadelo de qualquer paladino ou cavaleiro, pois cada golpe desferido contra ela não apenas falha em causar dano, como também é assimilado, servindo como material para que a criatura se reconstrua e aumente sua própria letalidade.

O maior perigo da Quimera não é sua força bruta, mas sua Tormenta de Fragmentos. Ela emite um zumbido ensurdecedor de metal moendo metal, enquanto uma nuvem de micro-lâminas orbita seu corpo, retalhando tudo o que se aproxima em nível celular. Enfrentar uma Quimera de Lâminas sem magias que possam corroer o metal ou ataques que desestabilizem seu Núcleo Magnético é uma sentença de morte certa. Ela não busca território ou comida; ela busca o refinamento, caçando ativamente metais raros e itens lendários para atingir a perfeição de sua forma final.`,
        type: "Monstro imenso, gosma",
        ac: "22",
        hp: "300 (20d20 + 90)",
        speed: "15m, escalar 12m",
        stats: {
            forca: "26 (+8)",
            destreza: "18 (+4)",
            constituicao: "24 (+7)",
            inteligencia: "12 (+1)",
            sabedoria: "14 (+2)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que a Quimera de Lâminas for alvo de dano de Força ou dano físico (Cortante, Perfurante, Concussão) causado por armas de metal, ela não sofre dano. Em vez disso, ela recupera uma quantidade de Pontos de Vida igual a metade do dano que seria causado. Armas não-mágicas de metal que a atinjam têm uma chance de 50% de serem absorvidas e destruídas, aumentando o dano da Quimera em +2 permanentemente (até um máximo de +10)."
            },
            {
                nome: "Imunidades",
                desc: "Veneno, Psíquico. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado."
            },
            {
                nome: "Tormenta de fragmentos",
                desc: "Uma nuvem de micro-lâminas orbita a Quimera em um raio de 6 metros. Qualquer criatura que comece seu turno na área ou entre nela pela primeira vez no turno sofre 14 (4d6) de dano cortante. A área é considerada Terreno Difícil para inimigos."
            },
            {
                nome: "Mimetismo de Arsenal",
                desc: "A Quimera pode moldar seus apêndices para mimetizar qualquer arma de metal que já tenha consumido. Ela pode alternar entre dano Cortante, Perfurante ou de Concussão a cada ataque sem custo de ação."
            },
            {
                nome: "Núcleo Magnético",
                desc: "Projéteis metálicos (flechas, virotes) disparados contra a Quimera são atraídos para sua massa e absorvidos automaticamente, não causando dano e curando a criatura em 2 PV por projétil."
            },
            {
                nome: "Ações Lendárias",
                desc: "Pode realizar 3 ações por turno"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "A Quimera realiza três ataques: dois de Patas de Lâminas e um de Mordida de Guilhotina."
            },
            {
                nome: "Patas de Lâminas",
                desc: "Ataque Corpo a Corpo: +13 para acertar, alcance 6m. Dano: 21 (3d8 + 8) de dano cortante. Se o alvo for uma criatura, ele deve passar em uma RES de Destreza (CD 21) ou sofrerá uma ferida sangrenta, recebendo 10 (3d6) de dano cortante no início de cada um de seus turnos."
            },
            {
                nome: "Mordida de guilhotina",
                desc: "Ataque Corpo a Corpo: +13 para acertar, alcance 3m. Dano: 27 (3d12 + 8) de dano perfurante. Se o alvo for reduzido a 0 PV por este ataque, ele é decapitado ou partido ao meio instantaneamente."
            },
            {
                nome: "Ciclone de aço (Recarga 5t)",
                desc: "A Quimera gira violentamente, disparando centenas de lâminas em um raio de 12 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 21). Falha: Sofre 55 (10d10) de dano cortante. Sucesso: Metade do dano."
            },
            {
                nome: "Reconfigurar",
                desc: "A Quimera altera sua forma para se adaptar ao último ataque recebido, ganhando resistência a um tipo de dano elemental até o início do seu próximo turno."
            },
            {
                nome: "Chicote de correntes",
                desc: "A Quimera estende um tentáculo de metal a até 12 metros. O alvo deve passar em uma RES de Força (CD 21) ou será puxado para dentro da Tormenta de Fragmentos."
            },
            {
                nome: "Explosão de estilhaços (custa 2 ações)",
                desc: "A Quimera ejeta parte de sua massa. Criaturas a até 6 metros sofrem 18 (4d8) de dano perfurante e devem passar em uma RES de Constituição (CD 21) ou ficarão Cegas pelo brilho do metal polido até o fim do próximo turno."
            }
        ],
        sentidos: {
            percepcaoPassiva: "12",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: "Mercúrio Senciente"
            },
            {
                range: "2",
                item: "Nervo de Aço Místico"
            },
            {
                range: "3",
                item: "Coração da Forja Eterna"
            },
            {
                range: "4",
                item: "Fragmento de Lâmina Dimensional"
            }
        ]
    },
    colossoDeOssos: {
        name: "Colosso de ossos",
        rarity: "Raro",
        icon: "https://i.imgur.com/NW2oCRU.png",
        image: "https://i.imgur.com/cVJoOWA.jpeg",
        subtitle: "CR 14",
        description: `Nos tomos de necromancia proibida e registros de desastres reais, o Colosso de Ossos é listado como uma Calamidade de Rank SS de Erradicação Biológica. Ele representa o ápice bizarro da evolução das gosmas necróticas. Ele deixa de ser um lodo rastejante para se tornar uma arquitetura ambulante de morte, uma fusão senciante de lodo viral e ossada calcificada que atua como um buraco negro de energia vital.

A anatomia do Colosso é um paradoxo de engenharia macabra. Sua "pele" externa é uma armadura impenetrável composta por milhares de ossos fundidos de suas vítimas, possuindo a densidade do aço místico. Internamente, ele é preenchido pelo ooze necrótico original, que atua como medula e sistema nervoso, mantendo a coesão da estrutura através de pura magia negra. Sua habilidade de Absorção Necrótica faz dele o predador final em campos de batalha, pois qualquer magia de morte desferida contra ele, ou qualquer criatura que morra em sua presença, apenas serve para regenerar sua massa e aumentar seu poder.

O maior perigo do Colosso não reside apenas em sua força titânica capaz de esmagar muralhas, mas em sua influência passiva. Ele emana um Miasma de Putrefação que derrete a carne e impede a cura, enquanto sua Aura de Desesperança quebra o espírito dos guerreiros mais corajosos antes mesmo do combate começar. Enfrentar um Colosso de Ossos sem magias radiantes de Rank Épico (sua única vulnerabilidade) é aceitar a aniquilação instantânea, onde sua alma será absorvida para alimentar a medula eterna da criatura, e seus ossos se tornarão apenas mais uma placa em sua armadura infinita.`,
        type: "Monstro imenso, gosma",
        ac: "20",
        hp: "320 (20d20 + 110)",
        speed: "9m",
        stats: {
            forca: "26 (+8)",
            destreza: "6 (-2)",
            constituicao: "26 (+8)",
            inteligencia: "12 (+1)",
            sabedoria: "16 (+3)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Absorção necrótica",
                desc: "Sempre que o Colosso de Ossos for alvo de dano necrótico, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Além disso, qualquer criatura morta em um raio de 18 metros cura o Colosso em 20 PV no início do turno dele."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Psíquico; Concussão, Cortante e Perfurante de armas não-mágicas. Agarrado, Atordoado, Caído, Cego, Envenenado, Exaustão, Impedido, Paralisado, Petrificado, Amedrontado."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Luz, Sagrado"
            },
            {
                nome: "Miasma de putrefação",
                desc: "O ar ao redor do Colosso em um raio de 9 metros é infestado de esporos necróticos. Criaturas vivas que comecem seu turno na área sofrem 14 (4d6) de dano necrótico e não podem recuperar pontos de vida até o início de seu próximo turno."
            },
            {
                nome: "Arquitetura de cadáveres",
                desc: "O corpo do Colosso é um amontoado de restos mortais. Sempre que ele sofrer mais de 40 de dano em um único turno, uma parte de sua massa se desprende, criando um Ooze de Peste (HP 30) em um espaço adjacente."
            },
            {
                nome: "Aura de desesperança",
                desc: "Criaturas a até 18 metros do Colosso devem passar em uma RES de Sabedoria (CD 21) ou ficarão Amedrontadas por 1 minuto. Enquanto amedrontadas dessa forma, o dano necrótico que recebem é dobrado."
            },
            {
                nome: "Ações Lendárias",
                desc: "Pode realizar 3 ações por rodada"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Colosso realiza dois ataques de Esmagamento de Marfim e usa seu Grito da Agonia (se disponível)."
            },
            {
                nome: "Esmagamento de marfim",
                desc: "Ataque Corpo a Corpo: +13 para acertar, alcance 6m. Dano: 22 (3d8 + 8) de impacto + 13 (3d8) de dano necrótico. O alvo deve passar em uma RES de Força (CD 21) ou será enterrado sob uma pilha de ossos (Impedido, CD 21 para sair)."
            },
            {
                nome: "Chuva de estilhaços (Recarga 5t)",
                desc: "O Colosso explode parte de sua armadura óssea em um cone de 18 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 21).Falha: Sofre 54 (12d8) de dano perfurante e contrai a Peste Óssea (Dano necrótico contínuo de 10 por turno até ser curado magicamente).Sucesso: Metade do dano e não contrai a peste."
            },
            {
                nome: "Grito de agonia (recarga 6t)",
                desc: "As milhares de almas presas na medula do Colosso gritam em uníssono. Todas as criaturas em um raio de 18 metros devem passar em uma RES de Sabedoria (CD 21) ou sofrerão 35 (10d6) de dano psíquico e ficarão Atordoadas por 1 rodada."
            },
            {
                nome: "Reanimar ossos",
                desc: "O Colosso faz com que estacas de ossos surjam do chão. Uma criatura a até 18 metros deve passar em uma RES de Destreza (CD 21) ou sofrerá 14 (4d6) de dano perfurante e ficará Agarrada."
            },
            {
                nome: "Sugar vitalidade",
                desc: "O Colosso drena a vida de uma criatura Agarrada ou Impedida por ele. O alvo sofre 21 (6d6) de dano necrótico e o Colosso recupera a mesma quantidade de PV."
            },
            {
                nome: "Parede de falanges (Custa 2 ações)",
                desc: "O Colosso ergue uma barreira de ossos de 3 metros de altura e 6 metros de largura que bloqueia linha de visão e movimento. A parede tem 50 PV."
            }
        ],
        sentidos: {
            percepcaoPassiva: "13",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: "Núcleo de Medula Negra"
            },
            {
                range: "2",
                item: "Costela de Titã de Sangue"
            },
            {
                range: "3",
                item: "Essência de Peste Destilada"
            },
            {
                range: "4",
                item: "Crânio do Rei Esquecido"
            }
        ]
    },
    glutao: {
        name: "Glutão",
        rarity: "Super raro",
        icon: "https://i.imgur.com/wmTt8hS.png",
        image: "https://i.imgur.com/mog32MC.jpeg",
        subtitle: "CR 20",
        description: `Nos registros divinos e anais de calamidades mundiais, o Glutão é listado não como um monstro, mas como um evento de extinção existencial de Nível 20+. Classificado como uma Calamidade de Rank X (Deidade Menor), ele representa o ponto onde a biologia dos slimes cessa e se torna um paradoxo físico senciante. Ele não é mais uma criatura que consome para sobreviver; ele é o consumo tornado carne, um estômago dimensional que existe apenas para converter o universo em sua própria massa visceral.

A anatomia do Glutão desafia todas as leis da física e da magia. Composta inteiramente por slime super-pressionado e energia dimensional, ele é praticamente imune a danos físicos e de força. Internamente, ele abriga um Estômago Dimensional, uma dimensão de bolso de ácido puro que atua como um buraco negro existencial. Sua característica mais aterrorizante é o Mimetismo de Habilidade (Blue Magic), permitindo que ele aprenda instantaneamente e replique qualquer habilidade, feitiço ou ação das criaturas que ele engole, usando o poder de seus inimigos contra eles mesmos.

O maior perigo do Glutão não reside apenas em seu tamanho colossal ou em seu ácido que dissolve metais lendários, mas em sua natureza predatória irracional. Ele gera uma Atração Magnética Devastadora que suga matéria e energia em sua direção, degradando o equipamento dos guerreiros antes mesmo de atacá-los. Enfrentar um Glutão sem magias de Rank Divino (como Desejo ou Milagre) ou habilidades que ignorem a densidade física é aceitar a aniquilação total, onde sua existência, alma e memórias serão mastigadas, digeridas e apagadas de todas as realidades.`,
        type: "Monstro colossal",
        ac: "20",
        hp: "520 (20d20 + 310)",
        speed: "15m, escalar 15m, natação 15m",
        stats: {
            forca: "30 (+10)",
            destreza: "10 (+0)",
            constituicao: "30 (+10)",
            inteligencia: "14 (+2)",
            sabedoria: "20 (+5)",
            carisma: "1 (-5)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Glutão for alvo de dano de ácido ou veneno, ele não sofre dano. Em vez disso, ele recupera uma quantidade de PV igual ao dano que seria causado. Se a cura exceder seu máximo, ele ganha PV temporários."
            },
            {
                nome: "Imunidade",
                desc: "Concussão, Cortante e Perfurante (Mesmo de armas mágicas); Psíquico, Força. imunidade a todas as manobras de combate"
            },
            {
                nome: "Estômago dimensional",
                desc: "O interior do Glutão é uma dimensão de bolso de ácido puro. Ele pode carregar até 10 criaturas imensas dentro de si. No início de cada turno do Glutão, criaturas engolidas sofrem 35 (10d6) de dano de ácido. Se uma criatura morrer lá dentro, ela é completamente apagada da existência."
            },
            {
                nome: "Mimetismo de habilidade",
                desc: "Sempre que o Glutão \"Engolir\" uma criatura, ele ganha temporariamente uma habilidade de classe ou ação daquela criatura (Ex: se engolir um Mago, pode usar Bola de Fogo). Ele pode manter até 3 habilidades mimetizadas simultaneamente."
            },
            {
                nome: "Degradação de equipamento",
                desc: "Qualquer arma que atinja o Glutão sofre uma penalidade permanente e cumulativa de -1 nas jogadas de ataque e dano. Se o bônus chegar a -5, a arma é dissolvida. Armaduras de quem for agarrado sofrem o mesmo efeito na CA."
            },
            {
                nome: "Ações Lendárias",
                desc: "Pode realizar até 3 ações por rodada"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Glutão realiza quatro ataques de Pseudópode e usa seu \"Vácuo de Matéria\"."
            },
            {
                nome: "Pseudópode devorador",
                desc: "Ataque Corpo a Corpo: +16 para acertar, alcance 12m. Dano: 24 (4d6 + 10) de impacto + 21 (6d6) de ácido. O alvo deve passar em uma RES de Força (CD 24) ou ficará Agarrado."
            },
            {
                nome: "Vácuo de matéria (Recarga 5t)",
                desc: "O Glutão abre uma fenda em sua massa que suga tudo em um cone de 20 metros. Criaturas na área devem passar em uma RES de Força (CD 24). Falha: São puxadas para o centro do Glutão e Engolidas instantaneamente. Sucesso: São apenas puxadas 10 metros e ficam Impedidas pelo lodo."
            },
            {
                nome: "Dilúvio do lodo corrosivo",
                desc: "O Glutão expele uma onda de ácido em um raio de 30 metros. Todas as criaturas devem fazer uma RES de Destreza (CD 24).Falha: 70 (20d6) de dano de ácido e sofrem o debuff (CA reduzida em 5 por 1 minuto).Sucesso: Metade do dano e sem o debuff."
            },
            {
                nome: "Pulsação metabolica",
                desc: "O Glutão se cura em 50 PV e remove qualquer debuff de estado negativo (como Lentidão ou Silencio)."
            },
            {
                nome: "Digestão acelerada (custa 2 ações)",
                desc: "Todas as criaturas engolidas sofrem o dano de ácido do estômago imediatamente. O Glutão ganha um bônus de +2 em todos os atributos até o fim da rodada para cada criatura que sofrer esse dano."
            }
        ],
        sentidos: {
            percepcaoPassiva: "15",
            visaoEscuro: "180m"
        },
        drops: [
            {
                range: "1",
                item: "Núcleo da Singularidade Viscosa"
            },
            {
                range: "2",
                item: "Estômago de Bolso Infinito"
            },
            {
                range: "3",
                item: "Concentrado de Ácido Real"
            },
            {
                range: "4",
                item: "Fragmento de Memória Genética"
            }
        ]
    },
    ifritmagma: {
        name: "Ifrit-magma",
        rarity: "Super raro",
        icon: "https://i.imgur.com/GYZdDhb.png",
        image: "https://i.imgur.com/OAYj052.jpeg",
        subtitle: "CR 20",
        description: `Nos registros sagrados das Calamidades Mundiais e tomos proibidos de necromancia biológica, Ifrit-Magma é classificado como uma Calamidade de Rank X (Entidade de Extinção Continental) de Nível 20+. Ele representa o ponto de singularidade onde a linhagem dos slimes de fogo deixa de ser uma criatura biológica para se tornar a própria vontade de uma estrela em colapso, manifestada em uma forma viscosa de rocha fundida. Ele não apenas habita vulcões; ele é a consciência do núcleo planetário.

A anatomia do Ifrit-Magma é um paradoxo físico mantido por mana de Rank Divino. Seu corpo é um amálgama hiper-pressionado de magma superaquecido, revestido por uma couraça de obsidiana ancestral que se quebra e regenera constantemente para conter a pressão interna. Sua habilidade de Absorção de Fogo torna qualquer ataque piromântico contra ele um erro fatal, pois ele consome a energia do feitiço para aumentar sua própria massa e temperatura, regenerando feridas em segundos. Ele não consome matéria orgânica; ele consome entropia, drenando o calor do ambiente e a força vital de seres vivos através do seu Campo de Calor Absoluto.

O perigo do Ifrit-Magma não reside apenas em seus tentáculos de lava ou em seu sopro piroclástico, mas em sua natureza predatória geopolítica. Por onde ele passa, o solo se torna lava permanente, remodelando o mapa e tornando continentes inteiros inabitáveis em dias. Sua habilidade máxima, a Giga-Labareda, libera o clarão branco do núcleo estelar, incinerando a carne e cegando os sobreviventes em um raio de quilômetros. Enfrentar um Ifrit-Magma exige o ápice da força militar, magias deRank SSS de congelamento absoluto ou a intervenção direta de divindades, pois ele é, em essência, o fim de todas as coisas.`,
        type: "Monstro colossal, gosma",
        ac: "22",
        hp: "480 (20d20 + 280)",
        speed: "12m, natação (magma) 24m",
        stats: {
            forca: "30 (+10)",
            destreza: "6 (-2)",
            constituicao: "28 (+9)",
            inteligencia: "12 (+1)",
            sabedoria: "20 (+5)",
            carisma: "22 (+6)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Ifrit-Magma for alvo de dano de fogo, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se ele estiver em um ambiente vulcânico, recupera 30 PV no início de cada um de seus turnos."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Psíquico; Concussão, Cortante e Perfurante (mesmo de armas mágicas). imune a todas as condições (exceto banimento e cegueira)"
            },
            {
                nome: "Vulnerabilidade",
                desc: "Frio (Porém, ao receber dano de frio, ele libera uma nuvem de vapor que causa 4d6 de dano de fogo em quem estiver a 3 metros)."
            },
            {
                nome: "Campo de calor absoluto",
                desc: "Uma aura de calor intenso emana da criatura em um raio de 18 metros. No início de cada um dos seus turnos, qualquer criatura na área sofre 21 (6d6) de dano de fogo. Itens não-mágicos inflamáveis na área incendeiam-se instantaneamente."
            },
            {
                nome: "Sangue de supernova",
                desc: "Sempre que o Ifrit-Magma recebe um ataque corpo a corpo, o atacante recebe 14 (4d6) de dano de fogo pelo respingo de magma pressurizado."
            },
            {
                nome: "Pulso vulcânico",
                desc: "Onde o Ifrit-Magma pisa, o chão se torna lava permanente. O terreno torna-se terreno difícil e qualquer um que termine o turno sobre ele sofre 21 (6d6) de dano de fogo."
            },
            {
                nome: "Ações Lendárias",
                desc: "Pode realizar até 3 ações por rodada"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Ifrit-Magma realiza quatro ataques de Tentáculo de Lava e usa seu Sopro de Magma (se disponível)."
            },
            {
                nome: "Tentáculo de lava",
                desc: "Ataque Corpo a Corpo: +16 para acertar, alcance 15m. Dano: 24 (4d6 + 10) de impacto + 21 (6d6) de fogo. O alvo fica Agarrado (CD 24 para escapar). Enquanto estiver agarrado, o alvo sofre o dano de fogo da aura e do tentáculo no início de seus turnos."
            },
            {
                nome: "Sopro de magma (Recarga 5t)",
                desc: "O Ifrit-Magma expele uma torrente de rocha líquida em um cone de 27 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 24). Falha: Sofre 91 (26d6) de dano de fogo e fica Incendiada (sofre 3d6 de fogo por turno até alguém usar uma ação para apagar). Sucesso: Metade do dano."
            },
            {
                nome: "Giga-labareda (Recarga 6t)",
                desc: "O núcleo do monstro brilha com luz branca. Todas as criaturas em um raio de 30 metros devem passar em uma RES de Constituição (CD 24).Falha: Sofre 100 de dano de fogo e fica Cego permanentemente por causa do clarão.Sucesso: Metade do dano e não fica cego."
            },
            {
                nome: "Erupção geotérmica",
                desc: "Faz com que um pilar de fogo surja sob uma criatura a até 36 metros. O alvo deve passar em uma RES de Destreza (CD 24) ou sofrerá 28 (8d6) de dano de fogo e será arremessado 6 metros para cima."
            },
            {
                nome: "Solidificar superficie",
                desc: "O Ifrit-Magma endurece parte de sua massa, ganhando 40 Pontos de Vida Temporários e +2 de CA até o início do seu próximo turno."
            },
            {
                nome: "Explosão de vapor (custa 2 ações)",
                desc: "Se houver qualquer fonte de água ou gelo por perto (ou se ele tiver recebido dano de frio), ele libera uma explosão de vapor. Todos a até 9 metros ficam Incapacitados pela dor da queimadura de vapor até o fim do próximo turno."
            }
        ],
        sentidos: {
            percepcaoPassiva: "15",
            visaoEscuro: "150m (sentido sismico)"
        },
        drops: [
            {
                range: "1",
                item: "Coração do Vulcão Eterno"
            },
            {
                range: "2",
                item: "Placas de Obsidiana Real"
            },
            {
                range: "3",
                item: "Essência de Sol Engarrafada"
            },
            {
                range: "4",
                item: "Nada"
            }
        ]
    },
    leviataDasMares: {
        name: "Leviatã das marés",
        rarity: "Super raro",
        icon: "https://i.imgur.com/jGd9it6.png",
        image: "https://i.imgur.com/bfanekF.jpeg",
        subtitle: "CR 20",
        description: `Nos registros sagrados das Grandes Calamidades Planetárias e tomos de alta magia hidro-genética, o Leviatã da Maré é classificado como uma Calamidade de Rank X (Entidade de Extinção Geográfica) de Nível 20+. Ele representa o ponto de singularidade onde a linhagem dos slimes de água deixa de ser uma criatura biológica para se tornar a própria consciência senciante do oceano primordial, compactada em uma forma viscosa de alta pressão. Ele não habita os mares; ele é a vontade do oceano.

A anatomia do Leviatã da Maré é um paradoxo físico mantido por mana de Rank Divino. Seu corpo é composto inteiramente por água abissal super-pressionada, revestida por uma tensão superficial tão absoluta que repele ataques como a armadura mais lendária. Sua habilidade de Absorção de Água torna qualquer ataque hidromântico ou criomântico contra ele um erro fatal, pois ele consome a energia do feitiço para aumentar sua própria massa e densidade, regenerando feridas em segundos. Ele não consome matéria orgânica; ele consome hidro-estabilidade, drenando a coesão de qualquer líquido no ambiente e a força vital de seres vivos através do seu Domínio de Alta Pressão.

O perigo do Leviatã da Maré não reside apenas em seus tentáculos de água diamondinos ou em seu esmagamento abissal, mas em sua natureza predatória irracional de remodelagem planetária. Por onde ele passa, o nível do mar sobe permanentemente e as correntes marítimas são alteradas, tornando continentes inteiros inabitáveis através de inundações constantes. Sua habilidade máxima, o Tsunami Diluvial, libera a pressão de quilômetros de profundidade em uma única explosão, incinerando a carne e destruindo fortalezas em um raio de quilômetros. Enfrentar um Leviatã da Maré exige o ápice da força militar, magias de Rank SSS de isolamento ou a intervenção direta de divindades, pois ele é, em essência, o dilúvio final de todas as coisas.`,
        type: "Monstro colossal, gosma",
        ac: "20",
        hp: "550 (20d20 + 350)",
        speed: "12m, natação 36m",
        stats: {
            forca: "28 (+9)",
            destreza: "14 (+2)",
            constituicao: "30 (+10)",
            inteligencia: "12 (+1)",
            sabedoria: "22 (+6)",
            carisma: "10 (+0)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Leviatã da Maré for alvo de dano de água ou gelo, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se ele estiver submerso ou sob chuva pesada, recupera 40 PV no início de cada um de seus turnos."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Ácido; Concussão, Cortante e Perfurante de armas não-mágicas. imune a todas as condições (exceto banimento)"
            },
            {
                nome: "Resistência",
                desc: "Fogo (a água se regenera instantaneamente), Elétrico (a massa é tão vasta que o choque se dissipa)."
            },
            {
                nome: "Domínio de alta pressão",
                desc: "Uma aura de pressão esmagadora emana do Leviatã em um raio de 18 metros. Criaturas que comecem o turno na área devem passar em uma RES de Força (CD 24). Em uma falha, sofrem 21 (6d6) de dano de impacto e ficam Impedidas. Em um sucesso, sofrem apenas metade do dano e não ficam impedidas."
            },
            {
                nome: "Fluidez absoluta",
                desc: "Ataques à distância (flechas, magias de projétil) têm Desvantagem contra o Leviatã, pois seu corpo de água desvia a trajetória dos projéteis antes do impacto."
            },
            {
                nome: "Manto de névoa perpétua",
                desc: "O Leviatã está sempre cercado por uma névoa densa em um raio de 30 metros. A área é considerada de visibilidade nula para todos, exceto para o Leviatã."
            },
            {
                nome: "Ações lendárias",
                desc: "Pode realizar até 3 ações por rodada"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Leviatã realiza três ataques: dois de Tentáculo de Jato de Água e um de Esmagamento Abissal."
            },
            {
                nome: "Tentáculo de jato d'água",
                desc: "Ataque Corpo a Corpo: +15 para acertar, alcance 18m. Dano: 22 (3d8 + 9) de impacto + 14 (4d6) de dano de água. O alvo deve passar em uma RES de Força (CD 24) ou será puxado 9 metros em direção ao centro do Leviatã."
            },
            {
                nome: "Esmagamento abissal",
                desc: "Ataque Corpo a Corpo: +15 para acertar, alcance 3m. Dano: 35 (4d12 + 9) de impacto. O alvo fica Agarrado (CD 24 para escapar). Enquanto estiver agarrado, o alvo começa a Sufocar e sofre 30 de dano de impacto no início de cada um de seus turnos."
            },
            {
                nome: "Tsunami diluvial (Recarga 5t)",
                desc: "O Leviatã colapsa sua forma e explode em uma onda massiva em um raio de 30 metros. Todas as criaturas na área devem fazer uma RES de Força (CD 24). Falha: Sofre 78 (12d12) de dano de impacto, é empurrada 18 metros e fica Caída. Sucesso: Metade do dano e não é empurrada."
            },
            {
                nome: "Bolha de estase",
                desc: "O Leviatã envolve uma criatura a até 18 metros em uma esfera de água de alta densidade. O alvo deve passar em uma RES de Destreza (CD 24) ou ficará Paralisado e flutuando até o fim do próximo turno do Leviatã."
            },
            {
                nome: "Corrente reversa",
                desc: "Todas as criaturas em um raio de 12 metros são puxadas ou empurradas 6 metros (escolha do Leviatã)."
            },
            {
                nome: "Hidro-cura (custa 2 ações)",
                desc: "O Leviatã condensa a umidade do ar, recuperando 60 PV e removendo uma condição negativa."
            }
        ],
        sentidos: {
            percepcaoPassiva: "16",
            visaoEscuro: "120m"
        },
        drops: [
            {
                range: "1",
                item: "Coração do Oceano Primordial"
            },
            {
                range: "2",
                item: "Membrana de Fluidez Eterna"
            },
            {
                range: "3",
                item: "Icor de Maré Alta"
            },
            {
                range: "4",
                item: "Fragmento de Tridente de Cristal"
            }
        ]
    },
    invernoEterno: {
        name: "Inverno Eterno",
        rarity: "super raro",
        icon: "https://i.imgur.com/6Av3Z6Z.png",
        image: "https://i.imgur.com/hhYnT5B.jpeg",
        subtitle: "CR 20",
        description: `Nos registros sagrados das Grandes Calamidades Planetárias e tomos de alta magia criogênica, o Inverno Eterno é classificado como uma Calamidade de Rank X (Entidade de Extinção Geográfica) de Nível 20+. Ele representa o ponto de singularidade onde a linhagem dos slimes de gelo deixa de ser uma criatura biológica para se tornar a própria consciência senciante da entropia térmica, a vontade do universo em atingir o repouso absoluto. Ele não traz a neve; ele é o fim de todo o movimento molecular.

A anatomia do Inverno Eterno é um paradoxo físico mantido por mana de Rank Divino. Seu corpo é composto inteiramente por gelo adamantino super-pressionado, revestido por uma tensão superficial tão absoluta que repele ataques físicos como a armadura mais lendária. Sua habilidade de Absorção de Frio torna qualquer ataque criomântico contra ele um erro fatal, pois ele consome a energia do feitiço para aumentar sua própria massa e densidade, regenerando feridas em segundos. Ele não consome matéria orgânica; ele consome energia cinética, drenando a coesão de qualquer material e a força vital de seres vivos através de sua Aura de Zero Absoluto.

O perigo do Inverno Eterno não reside apenas em suas pancadas glaciais ou em suas prisões criogênicas, mas em sua natureza predatória irracional de remodelagem planetária. Por onde ele passa, a temperatura cai permanentemente abaixo do ponto onde a vida é possível, e a própria atmosfera se condensa, tornando continentes inteiros inabitáveis em dias. Sua habilidade máxima, a Expiração de Gelo Estelar, libera poeira estelar congelada que impõe o estado de Parar (stop), congelando o tempo e o movimento de qualquer criatura atingida. Enfrentar um Inverno Eterno exige o ápice da força militar, magias de Rank SSS de calor estelar ou a intervenção direta de divindades, pois ele é, em essência, o silêncio final de todas as coisas.`,
        type: "Monstro colossal, gosma",
        ac: "22",
        hp: "530 (20d20 + 330)",
        speed: "12m, escalar 12m",
        stats: {
            forca: "26 (+8)",
            destreza: "4 (-3)",
            constituicao: "30 (+10)",
            inteligencia: "14 (+2)",
            sabedoria: "24 (+7)",
            carisma: "10 (+0)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Inverno Eterno for alvo de dano de frio, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se a cura exceder seu máximo, o excesso se torna pontos de vida temporários."
            },
            {
                nome: "Imunidade",
                desc: "Psíquico, Necrótico; Concussão, Cortante e Perfurante de armas não-mágicas. Imune a todas as condições (exceto banimento)"
            },
            {
                nome: "Resistência",
                desc: "Fogo (Sua massa é tão fria que o fogo se apaga antes de derretê-lo), Elétrico."
            },
            {
                nome: "Aura de zero absoluto",
                desc: "Uma aura de frio impossível emana da criatura em um raio de 18 metros. Qualquer criatura que comece seu turno na área sofre 28 (8d6) de dano de frio e tem seu deslocamento reduzido a zero até o início de seu próximo turno. Criaturas imunes a dano de frio sofrem metade desse dano e não têm o deslocamento reduzido."
            },
            {
                nome: "Armadura reativa de cristais",
                desc: "Sempre que uma criatura atinge o Inverno Eterno com um ataque corpo a corpo, estilhaços de gelo explodem. O atacante sofre 14 (4d6) de dano perfurante e 14 (4d6) de dano de frio."
            },
            {
                nome: "Campo de paralisia térmica",
                desc: "O Inverno Eterno absorve o calor de magias de fogo lançadas a até 30 metros dele. Qualquer magia de fogo tem 50% de chance de falhar totalmente, e o Inverno Eterno recupera PV como se tivesse sido alvo de Absorção de Frio."
            },
            {
                nome: "Ações Lendarias",
                desc: "Pode realizar até 3 ações por rodada"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Inverno Eterno realiza três ataques: dois de Pancada Glacial e um de Prisão Criogênica."
            },
            {
                nome: "Pancada Glacial",
                desc: "Ataque Corpo a Corpo: +14 para acertar, alcance 9m. Dano: 21 (3d8 + 8) de impacto + 21 (6d6) de frio. O alvo deve passar em uma RES de Constituição (CD 24) ou ficará Petrificado (em gelo) até o fim do próximo turno do Inverno Eterno."
            },
            {
                nome: "Prisão criogênica",
                desc: "O Inverno Eterno lança uma esfera de gelo em um ponto a até 24 metros. Cada criatura em um raio de 6 metros do ponto deve passar em uma RES de Destreza (CD 24) ou ficará Agarrada e Impedida por correntes de gelo (CD 24 de Força para escapar). No início de cada turno em que estiver presa, a criatura sofre 35 (10d6) de dano de frio."
            },
            {
                nome: "Expiração de gelo estelar (Recarga 5t)",
                desc: "O Inverno Eterno expele um sopro de poeira estelar congelada em um cone de 27 metros. Todas as criaturas na área devem fazer uma RES de Constituição (CD 24).Falha: Sofre 90 (20d8) de dano de frio e sofre o status Parar, ficando incapaz de realizar ações, reações ou se mover por 1 rodada.Sucesso: Metade do dano e não sofre Parar."
            },
            {
                nome: "Flash de nevasca",
                desc: "O Inverno Eterno brilha intensamente. Todas as criaturas a até 12 metros devem passar em uma RES de Constituição (CD 24) ou ficarão Cegas até o fim do próximo turno."
            },
            {
                nome: "Estalactite Cadente",
                desc: "O Inverno Eterno faz com que o teto ou o próprio ar condense em gelo sobre um inimigo. O alvo sofre 22 (4d10) de dano perfurante (CD 24 de Destreza para metade)."
            },
            {
                nome: "Reestruturação molecular (custa 2 ações)",
                desc: "O Inverno Eterno condensa sua massa, recuperando 70 PV e aumentando sua CA em +2 até o início do seu próximo turno."
            }
        ],
        sentidos: {
            percepcaoPassiva: "17",
            visaoEscuro: "120m"
        },
        drops: [
            {
                range: "1",
                item: "Coração do Zero Absoluto"
            },
            {
                range: "2",
                item: "Essência de Geada Primordial"
            },
            {
                range: "3",
                item: "Casca Glacial Reforçada"
            },
            {
                range: "4",
                item: "Olho da Nevasca"
            }
        ]
    },
    geomonolito: {
        name: "Geo-monólito",
        rarity: "Super raro",
        icon: "https://i.imgur.com/gC1qYk0.png",
        image: "https://i.imgur.com/ZXd9Uem.jpeg",
        subtitle: "CR 20",
        description: `O Geo-Monólito transcende a definição de monstro para se tornar um fenômeno físico senciante. Classificado como uma Calamidade de Rank X (Ponto de Ruptura Gravitacional), ele é o estágio onde o slime de terra atinge tamanha densidade que começa a colapsar o espaço ao seu redor. Ele não caminha sobre o mundo; ele flutua acima dele, agindo como um novo centro de gravidade que despedaça a crosta terrestre por onde passa.

Sua forma é uma estrutura geométrica perfeita de minerais ancestrais, mantida coesa por um núcleo de lodo metálico de densidade infinita. A habilidade de Absorção de Terra e Impacto aqui atinge um nível celular: qualquer objeto sólido que tente atingi-lo é instantaneamente atraído para sua órbita e assimilado à sua massa, tornando o Geo-Monólito maior e mais pesado a cada ataque recebido. Ele não caça presas; ele simplesmente atrai toda a matéria em um raio de quilômetros para o seu centro, processando minerais e energia em um ciclo eterno de auto-reconstrução.

Enfrentar o Pilar Absoluto é lutar contra a própria física. Sua Aura de Gravidade Esmagadora pode achatar exércitos inteiros contra o chão em segundos, enquanto seu Pulso Geodésico envia ondas de choque que não apenas quebram ossos, mas desintegram a estrutura molecular de materiais não-mágicos. Ele é o guardião silencioso das profundezas, uma entidade que acredita que o mundo deve ser reconduzido ao seu estado original de rocha e silêncio.`,
        type: "Monstro colossal, gosma",
        ac: "24",
        hp: "580 (20d20 + 380)",
        speed: "12m, escavação 24m",
        stats: {
            forca: "30 (+10)",
            destreza: "4 (-3)",
            constituicao: "30 (+10)",
            inteligencia: "10 (+0)",
            sabedoria: "20 (+5)",
            carisma: "10 (+0)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Geo-Monólito for alvo de dano de terra (como magias de pedra) ou dano de Concussão (mesmo de armas mágicas), ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se ele estiver em contato com o solo natural, recupera 40 PV no início de cada um de seus turnos."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Ácido, Cortante e Perfurante (de armas não-mágicas). Imune a todas as condições (exceto banimento)"
            },
            {
                nome: "Resistência",
                desc: "Radiante, Elétrico"
            },
            {
                nome: "Aura de gravidade esmagadora",
                desc: "O Geo-Monólito distorce o peso ao seu redor em um raio de 18 metros. Criaturas na área consideram o terreno como Terreno Difícil e têm sua altura de salto reduzida a zero. Além disso, projéteis físicos (flechas, lanças) têm Desvantagem para atingir qualquer alvo dentro desta aura."
            },
            {
                nome: "Inércia planetária",
                desc: "O Geo-Monólito não pode ser movido contra sua vontade por nenhuma magia ou efeito físico de nível inferior a 9, a menos que ele decida se mover."
            },
            {
                nome: "Ruptura tectonica permanente",
                desc: "O solo em um raio de 30 metros ao redor do Geo-Monólito está em constante mutação. No início de cada rodada, o Mestre pode alterar a elevação do terreno em até 6 metros, criando paredes de pedra ou fendas profundas como uma ação gratuita da criatura."
            },
            {
                nome: "Ações lendárias",
                desc: "Pode realizar até 3 ações por rodada"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Geo-Monólito realiza três ataques: dois de Esmagamento de Placa e um de Canhão de Detritos."
            },
            {
                nome: "Esmagamento de placa",
                desc: "Ataque Corpo a Corpo: +16 para acertar, alcance 12m. Dano: 32 (4d10 + 10) de impacto. O alvo deve passar em uma RES de Força (CD 24) ou será enterrado vivo, ficando Caído e Impedido (CD 24 para escapar)."
            },
            {
                nome: "Canhão de detritos",
                desc: "Ataque à Distância: +16 para acertar, alcance 30/120m. Dano: 36 (4d12 + 10) de impacto. Este ataque ignora coberturas que não sejam de metal mágico ou energia."
            },
            {
                nome: "Pulso Geodésico",
                desc: "O Geo-Monólito bate sua massa no chão, liberando uma onda de choque de alta frequência. Todas as criaturas em um raio de 30 metros devem fazer uma RES de Constituição (CD 24). Falha: Sofre 80 (10d10 + 25) de dano de impacto e fica Atordoado por 1 rodada devido à vibração dos ossos e órgãos. Sucesso: Metade do dano e não fica atordoado."
            },
            {
                nome: "Deslocamento de Falla",
                desc: "O Geo-Monólito se funde ao solo e ressurge em qualquer ponto que possa \"sentir\" via sentido sísmico a até 24 metros."
            },
            {
                nome: "Prisão de quartzo",
                desc: "Uma criatura a até 18 metros deve passar em uma RES de Destreza (CD 24) ou será envolta em cristais de crescimento rápido, ficando Petrificada até o fim do próximo turno do Geo-Monólito."
            },
            {
                nome: "Reconstrução mineral (custa 2 ações)",
                desc: "O Geo-Monólito absorve minerais do solo, recuperando 80 PV e restaurando qualquer parte do corpo que tenha sido \"destruída\"."
            }
        ],
        sentidos: {
            percepcaoPassiva: "15",
            visaoEscuro: "300m (sentido sismico)"
        },
        drops: [
            {
                range: "1",
                item: "Núcleo de Gravidade Concentrada"
            },
            {
                range: "2",
                item: "Fragmento de Adamantino Primordial"
            },
            {
                range: "3",
                item: "Geoda de Mana Infinito"
            },
            {
                range: "4",
                item: "Placa Tectônica em Miniatura"
            }
        ]
    },
    tempestadeViva: {
        name: "Tempestade Viva",
        rarity: "Super raro",
        icon: "https://i.imgur.com/qMvHvIo.png",
        image: "https://i.imgur.com/LyicfQq.jpeg",
        subtitle: "CR 20",
        description: `Nos registros sagrados das Grandes Calamidades Planetárias e tomos de alta magia eletromagnética, a Tempestade Viva é classificada como uma Calamidade de Rank X (Entidade de Extinção Atmosférica) de Nível 20+. Ela representa o ponto de singularidade onde a linhagem dos slimes elétricos deixa de ser uma criatura biológica rastejante para se tornar a própria consciência senciante de um evento climático apocalíptico, a vontade do céu em atingir a purificação total através do plasma. Ela não traz a tempestade; ela é a vontade do trovão.

A anatomia da Tempestade Viva é um paradoxo físico mantido por mana de Rank Divino. Seu corpo é composto inteiramente por plasma superaquecido e nuvens jônicas pressurizadas, revestido por um campo eletromagnético tão absoluto que repele ataques físicos e desvia projéteis mágicos como se fossem nada. Sua habilidade de Absorção Elétrica torna qualquer ataque piromântico ou eletromântico contra ela um erro fatal, pois ela consome a energia do feitiço para aumentar sua própria massa, temperatura e velocidade, regenerando feridas em segundos e acelerando seu metabolismo a níveis superluminais. Ela não consome matéria orgânica; ela consome coerência, drenando a estabilidade molecular de qualquer material e os impulsos nervosos de seres vivos através de sua Atmosfera Ionizada.

O perigo da Tempestade Viva não reside apenas em seus chicotes de plasma ou em suas trovoadas, mas em sua natureza predatória de remodelagem atmosférica. Por onde ela passa, o céu se torna uma zona de guerra permanente de raios, e a composição do ar é alterada, tornando continentes inteiros inabitáveis em dias. Sua habilidade máxima, a Trovoada Final, libera a voltagem de um sistema de tempestades inteiro em uma única explosão, incinerando a carne e ensurdecendo os sobreviventes em um raio de quilômetros. Enfrentar uma Tempestade Viva exige o ápice da força militar, magias de Rank SSS de isolamento ou terraformação, ou a intervenção direta de divindades, pois ela é, em essência, o curto-circuito final de todas as coisas.`,
        type: "Monstro colossal, gosma",
        ac: "22",
        hp: "460 (20d20 + 260)",
        speed: "36m (voo)",
        stats: {
            forca: "18 (+4)",
            destreza: "30 (+10)",
            constituicao: "26 (+8)",
            inteligencia: "16 (+3)",
            sabedoria: "22 (+6)",
            carisma: "18 (+4)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que a Tempestade Viva for alvo de dano elétrico, ela não sofre dano. Em vez disso, ela recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se a cura exceder o máximo, ela ganha o status (Acelerar) por 1 rodada."
            },
            {
                nome: "Imunidade",
                desc: "Trovão, Veneno, Psíquico; Concussão, Cortante e Perfurante de armas não-mágicas. Todas as condições (exceto banimento)"
            },
            {
                nome: "Resistência",
                desc: "Fogo, Radiante."
            },
            {
                nome: "Atmosfera Ionizada",
                desc: "Uma aura de estática extrema emana da criatura em um raio de 18 metros. No início de cada um dos seus turnos, qualquer criatura na área deve passar em uma RES de Constituição (CD 24) ou ficará sob o efeito de Paralisia até o início do seu próximo turno. Mesmo em um sucesso, a criatura sofre 14 (4d6) de dano elétrico."
            },
            {
                nome: "Velocidade superluminal",
                desc: "A Tempestade Viva não provoca ataques de oportunidade ao se mover. Além disso, ela pode realizar a ação de Disparada como uma ação bônus em cada um de seus turnos."
            },
            {
                nome: "Corpo de plasma",
                desc: "Qualquer criatura que atinja a Tempestade Viva com um ataque corpo a corpo sofre 14 (4d6) de dano elétrico e 14 (4d6) de dano de trovão devido à detonação sonora do plasma."
            },
            {
                nome: "Ações lendárias",
                desc: "Pode realizar até 3 ações por rodada"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "A Tempestade Viva realiza quatro ataques de Chicote de Plasma e usa seu Salto de Frequência."
            },
            {
                nome: "Chicote de plasma",
                desc: "Ataque Corpo a Corpo: +16 para acertar, alcance 15m. Dano: 20 (3d6 + 10) de impacto + 14 (4d6) de dano elétrico. O alvo deve passar em uma RES de Constituição (CD 24) ou sofrerá o status (Lentidão) por 1 minuto."
            },
            {
                nome: "Salto de frequência",
                desc: "A Tempestade Viva se transforma em um raio e se teletransporta para um espaço vazio a até 30 metros. Criaturas no caminho entre o ponto de origem e o destino devem passar em uma RES de Destreza (CD 24) ou sofrerão 21 (6d6) de dano elétrico."
            },
            {
                nome: "Trovoada final (Recarga 5t)",
                desc: "A criatura libera uma descarga massiva em um raio de 30 metros. Todas as criaturas devem fazer uma RES de Constituição (CD 24). Falha: 84 (24d6) de dano elétrico e fica Surda permanentemente. Sucesso: Metade do dano e não fica surda."
            },
            {
                nome: "Flash eletrostático",
                desc: "Todas as criaturas a até 9 metros devem passar em uma RES de Constituição (CD 24) ou ficarão Cegas até o fim do próximo turno da Tempestade Viva."
            },
            {
                nome: "Sobrecarga sináptica",
                desc: "O monstro força o sistema nervoso de uma criatura que ele possa ver a até 18 metros. O alvo deve passar em uma RES de Sabedoria (CD 24) ou usará sua reação para realizar um ataque contra a criatura mais próxima."
            },
            {
                nome: "Reenergizar (custa 2 ações)",
                desc: "A Tempestade Viva brilha intensamente, recuperando 60 PV e recarregando instantaneamente sua habilidade Trovoada Final."
            }
        ],
        sentidos: {
            percepcaoPassiva: "16",
            visaoEscuro: "180m (pulsos eletromagnéticos)"
        },
        drops: [
            {
                range: "1",
                item: "Núcleo de Plasma Estabilizado"
            },
            {
                range: "2",
                item: "Membrana de Nuvens Jônicas"
            },
            {
                range: "3",
                item: "Icor de Relâmpago Líquido"
            },
            {
                range: "4",
                item: "Garra de Trovão Petrificado"
            }
        ]
    },
    omniarsenal: {
        name: "Omni-Arsenal",
        rarity: "Super raro",
        icon: "https://i.imgur.com/UunITwa.png",
        image: "https://i.imgur.com/0ZIYocb.jpeg",
        subtitle: "CR 20",
        description: `Nos tomos proibidos de alta engenharia bélica e registros das Grandes Calamidades Planetárias, o Omni-Arsenal é classificado como uma Calamidade de Rank X (Ponto de Singularidade Bélica) de Nível 20+. Ele representa o estágio onde a linhagem dos slimes de metal deixa de ser uma criatura biológica rastejante para se tornar a própria consciência senciante de uma fábrica de armas infinita, o conceito de "guerra" manifestado em metal líquido auto-replicante. Ele não usa armas; ele é a arma.

A anatomia do Omni-Arsenal é um paradoxo físico mantido por mana de Rank Divino e mecânica teórica. Seu corpo é composto inteiramente por mercúrio denso e ligas metálicas desconhecidas que flutuam sob pressão magnética severa. Sua habilidade de Absorção de Metal e Aço torna qualquer ataque de lâmina ou projétil físico contra ele um erro fatal, pois ele consome o material do ataque para aumentar sua própria massa, densidade e complexidade, regenerando feridas em segundos e analisando a estrutura do ataque inimigo. Ele não consome matéria orgânica; ele consome conflito, drenando a energia cinética e a intenção de matar do ambiente para alimentar sua Singularidade Magnética.

O perigo do Omni-Arsenal não reside apenas em suas mil lâminas ou em sua reconfiguração, mas em sua natureza predatória irracional de desarmamento geopolítico. Por onde ele passa, todo o metal refinado em um raio de quilômetros é extraído do solo e das construções, tornando continentes inteiros inabitáveis em dias devido ao colapso estrutural e tecnológico. Sua habilidade máxima, o Arsenal de Blue Magic, analisa e replica permanentemente as propriedades de armas lendárias que o atingem, tornando-o cada vez mais poderoso à medida que sobrevive a heróis. Enfrentar o Omni-Arsenal exige o ápice da força militar, magias de Rank SSS de desintegração ou calor estelar, ou a intervenção direta de divindades, pois ele é, em essência, o curto-circuito final de todas as forjas.`,
        type: "Monstro colossal, gosma",
        ac: "25",
        hp: "500 (20d20 + 300)",
        speed: "15m, voo 15m",
        stats: {
            forca: "30 (+10)",
            destreza: "22 (+6)",
            constituicao: "28 (+9)",
            inteligencia: "18 (+4)",
            sabedoria: "16 (+3)",
            carisma: "10 (+0)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Omni-Arsenal for alvo de dano Cortante ou Perfurante (mesmo de armas mágicas ou artefatos), ele não sofre dano. Em vez disso, ele incorpora o metal à sua massa e recupera uma quantidade de Pontos de Vida igual ao dano que seria causado."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Psíquico, Radiante; Concussão de armas não-mágicas. imune a todas as condições (exceto banimento)"
            },
            {
                nome: "Resistência",
                desc: "Fogo, Frio, Elétrico"
            },
            {
                nome: "Campo magnético soberano",
                desc: "O Omni-Arsenal emana uma aura magnética em um raio de 30 metros. Qualquer criatura usando armadura de metal ou segurando uma arma de metal tem Desvantagem em jogadas de ataque e testes de Destreza. Além disso, projéteis de metal (flechas, balas) disparados contra ele são automaticamente desviados."
            },
            {
                nome: "Massa infinitamente afiada",
                desc: "Qualquer criatura que toque o Omni-Arsenal ou o atinja com um ataque corpo a corpo a menos de 1 metro sofre 21 (6d6) de dano cortante, conforme o metal líquido se transforma em micro-lâminas instantâneas."
            },
            {
                nome: "Arsenal de Blue Magic",
                desc: "O Omni-Arsenal pode \"analisar\" qualquer arma mágica que o atinja. Se ele sobreviver ao ataque, ele pode replicar as propriedades daquela arma em seus próprios ataques no próximo turno."
            },
            {
                nome: "Ações Lendárias",
                desc: "Pode realizar até 3 ações por rodada"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Omni-Arsenal realiza cinco ataques: três de Lâmina Transmutável e dois de Chicote de Corrente Serrilhada."
            },
            {
                nome: "Lâmina transmutável",
                desc: "Ataque Corpo a Corpo: +16 para acertar, alcance 15m. Dano: 28 (4d8 + 10) de dano cortante. Este ataque ignora qualquer resistência a dano físico."
            },
            {
                nome: "Chicote de corrente serrilhada",
                desc: "Ataque Corpo a Corpo: +16 para acertar, alcance 20m. Dano: 24 (4d6 + 10) de dano perfurante. O alvo deve passar em uma RES de Força (CD 24) ou será puxado para junto da criatura e ficará Agarrado."
            },
            {
                nome: "Chuva de mil lâminas (Recarga 5t)",
                desc: "O Omni-Arsenal expele milhares de fragmentos metálicos de seu corpo em um raio de 30 metros. Cada criatura na área deve fazer uma RES de Destreza (CD 24).Falha: Sofre 91 (26d6) de dano cortante e fica sob o status Sangramento (Sangramento), sofrendo 10 de dano necrótico no início de cada turno até ser curado magicamente.Sucesso: Metade do dano e sem sangramento."
            },
            {
                nome: "Reconfiguração defensiva",
                desc: "O Omni-Arsenal muda sua densidade, ganhando +2 de CA ou resistência a um tipo de dano específico (como Fogo ou Elétrico) até o início de seu próximo turno."
            },
            {
                nome: "Disparo de estilhaço",
                desc: "Realiza um ataque de Lâmina Transmutável à distância (alcance 36m)."
            },
            {
                nome: "Singularidade magnética (custa 2 ações)",
                desc: "Todas as criaturas usando metal a até 18 metros são puxadas 6 metros em direção ao Omni-Arsenal e sofrem 22 (4d10) de dano de concussão pelo impacto."
            }
        ],
        sentidos: {
            percepcaoPassiva: "13",
            visaoEscuro: "120m"
        },
        drops: [
            {
                range: "1",
                item: "Mercúrio Real Estabilizado"
            },
            {
                range: "2",
                item: "Núcleo do Arsenal Infinito"
            },
            {
                range: "3",
                item: "Lente Magnética Polarizada"
            },
            {
                range: "4",
                item: "Icor de Platina Pura"
            }
        ]
    },
    necromonarca: {
        name: "Necro-monarca",
        rarity: "Super Raro",
        icon: "https://i.imgur.com/yQy6316.png",
        image: "https://i.imgur.com/WNRH9Pb.jpeg",
        subtitle: "CR 20",
        description: `Nos registros proibidos das Calamidades de Rank X, o Necro-Monarca é descrito não como um ser vivo, mas como o estágio final da entropia biológica. Ele é o ponto onde a linhagem dos slimes necróticos deixa de ser uma massa de ossos desorganizada para se tornar um nexo senciante que governa o conceito da morte. Ele não habita cemitérios; ele é uma necrópole ambulante que busca "arquivar" toda a vida existente em sua estrutura de marfim.

A anatomia do Necro-Monarca é mantida por uma vontade maligna e mana de Rank Divino. Seu corpo é uma malha hiper-densa de ossos de heróis e feras de eras passadas, fundidos por um lodo necrótico que atua como o tecido conjuntivo mais forte do mundo. Sua habilidade de Absorção Necrótica torna qualquer tentativa de usar magia de morte ou trevas contra ele um ato de fortalecimento, pois ele assimila a energia negativa para reconstruir sua couraça de ossos instantaneamente. Ele não consome carne; ele consome a existência, drenando a força vital e as memórias de seres vivos através de sua Aura de Expurgo da Vida.

O perigo do Necro-Monarca reside na sua capacidade de anular a esperança. Por onde ele passa, a terra se torna estéril e o ciclo da reencarnação é interrompido, pois as almas são presas dentro de sua massa de lodo para servirem de combustível eterno. Sua habilidade máxima, o Rugido das Almas Perdidas, libera um grito que não é ouvido pelos ouvidos, mas pelas almas, capaz de desintegrar o sistema nervoso e transformar exércitos inteiros em estátuas de cinzas em segundos. Enfrentar o Ossuário Infinito exige magias de Rank SSS de luz purificadora ou o sacrifício de artefatos divinos, pois ele é, em essência, o fim silencioso de todos os legados.`,
        type: "Monstro colossal, gosma",
        ac: "23",
        hp: "560 (20d20 + 360)",
        speed: "12m, 12m (levitação)",
        stats: {
            forca: "28 (+9)",
            destreza: "12 (+1)",
            constituicao: "30 (+10)",
            inteligencia: "18 (+4)",
            sabedoria: "20 (+5)",
            carisma: "26 (+8)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Necro-Monarca for alvo de dano necrótico, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se ele estiver em um local onde muitas mortes ocorreram recentemente, recupera 40 PV no início de cada um de seus turnos."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Psíquico, Necrótico; Concussão, Cortante e Perfurante de armas não-mágicas. Imune a todas as condições (exceto banimento)"
            },
            {
                nome: "Resistência",
                desc: "Radiante"
            },
            {
                nome: "Aura de expurgo da vida",
                desc: "Uma névoa cinzenta emana do monstro em um raio de 18 metros. Qualquer criatura viva que comece o turno na área sofre 21 (6d6) de dano necrótico e seu valor de Pontos de Vida Máximos é reduzido em um valor igual ao dano sofrido. Essa redução dura até um descanso longo."
            },
            {
                nome: "Comandante do vazio",
                desc: "Mortos-vivos num raio de 30 metros do Necro-Monarca recebem vantagem em jogadas de ataque e não podem ser expulsos por clérigos ou paladinos."
            },
            {
                nome: "Corpo de marfim reativo",
                desc: "Quando o Necro-Monarca recebe dano físico de uma arma mágica, estilhaços de osso amaldiçoado explodem. O atacante deve passar em uma RES de Destreza (CD 24) ou sofrerá 14 (4d6) de dano perfurante e ficará Envenenado."
            },
            {
                nome: "Ações lendárias",
                desc: "Pode realizar até 3 ações por turno"
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Necro-Monarca realiza três ataques: dois de Maça de Marfim e um de Toque do Esquecimento."
            },
            {
                nome: "Maça de marfim",
                desc: "Ataque Corpo a Corpo: +15 para acertar, alcance 12m. Dano: 27 (4d8 + 9) de impacto + 18 (4d8) necrótico. O alvo deve passar em uma RES de Força (CD 24) ou será arremessado 6 metros e ficará Caído."
            },
            {
                nome: "Toque de esquecimento",
                desc: "Ataque Corpo a Corpo: +15 para acertar, alcance 3m. Dano: 40 (6d10 + 7) necrótico. O alvo deve passar em uma RES de Sabedoria (CD 24). Em uma falha, o alvo esquece como usar sua habilidade de classe mais poderosa (ou magia de maior nível) por 1 minuto."
            },
            {
                nome: "Rugido das almas perdidas (Recarga 5t)",
                desc: "O monstro abre suas múltiplas mandíbulas em um grito excruciante. Todas as criaturas em um raio de 27 metros devem fazer uma RES de Constituição (CD 24). Falha: Sofre 88 (16d10) de dano necrótico e fica Amedrontado por 1 minuto. Sucesso: Metade do dano e não fica amedrontado."
            },
            {
                nome: "Erguimento instantâneo",
                desc: "O Necro-Monarca faz com que 1d4 Esqueletos Guerreiros (Nível 15) surjam de sua própria massa para lutar ao seu lado."
            },
            {
                nome: "Passo sombrio",
                desc: "O monstro se dissolve em fumaça e reaparece em um ponto vazio que ele possa ver a até 24 metros."
            },
            {
                nome: "Drenar vitalidade (custa 2 ações)",
                desc: "Cada criatura Amedrontada a até 18 metros sofre 22 (4d10) de dano necrótico, e o Necro-Monarca recupera essa mesma quantidade de PV."
            }
        ],
        sentidos: {
            percepcaoPassiva: "15",
            visaoEscuro: "150m, 150m (sentir vivos)"
        },
        drops: [
            {
                range: "1",
                item: "Coroa de Ossos de Érebo"
            },
            {
                range: "2",
                item: "Medula do Vazio Destilada"
            },
            {
                range: "3",
                item: "Costela do Soberano do Ocaso"
            },
            {
                range: "4",
                item: "Pó de Alma Fragmentada"
            }
        ]
    },
    slimeMimico: {
        name: "Slime Mimico",
        rarity: "Incomum",
        icon: "https://i.imgur.com/l92yvRN.png",
        image: "https://i.imgur.com/BSiggQ1.jpeg",
        subtitle: "CR 3",
        description: `O Slime Mímico de Nível 5 é o primeiro sinal de que a linhagem de lodo desenvolveu uma mente capaz de abstração. Ele não é mais guiado apenas pela fome, mas pela observação. Classificado como uma Ameaça de Infiltração Incipiente, esta criatura marca o início do Caminho Intelectual. Ele ainda não consegue replicar um humano perfeitamente; em vez disso, ele cria um "esqueleto" de pressão hidrostática que imita a postura das raças civilizadas, resultando em uma figura instável e levemente perturbadora que se esconde nas sombras para estudar suas presas.

A anatomia nesta fase é fascinante e grotesca. O slime desenvolveu um núcleo central mais denso que funciona como um cérebro primitivo, permitindo que ele processe linguagens e tente mimetizar sons, embora sua voz ainda soe como bolhas estourando em um pântano. Sua habilidade de Mimetismo de Forma é limitada: ele consegue copiar o tamanho e a silhueta geral, mas detalhes como cabelo, dentes ou textura de pele real ainda estão além de sua capacidade. Ele frequentemente usa roupas e equipamentos roubados de aventureiros caídos para esconder sua natureza translúcida e as partes de seu corpo que insistem em derreter.

Em combate, o Mímico demonstra uma crueldade tática que seus primos bestiais não possuem. Ele usa o ambiente a seu favor, fingindo ser uma poça de lodo ou um cadáver coberto por uma capa antes de desferir o ataque. Ele entende o valor das ferramentas humanas, frequentemente incorporando armas de metal diretamente em sua massa ácida para ganhar alcance e letalidade. O maior perigo do Slime Mímico não é sua força, mas sua Toxina Social — um gás feromonal que confunde os sentidos, fazendo com que as vítimas hesitem ao verem aquela forma quase humana, permitindo que o monstro aproveite esse segundo de dúvida para atacar.`,
        type: "Monstro médio, gosma",
        ac: "14",
        hp: "52 (8d8 + 16)",
        speed: "9m",
        stats: {
            forca: "12 (+1)",
            destreza: "16 (+3)",
            constituicao: "14 (+2)",
            inteligencia: "14 (+2)",
            sabedoria: "12 (+1)",
            carisma: "16 (+3)"
        },
        habilidades: [
            {
                nome: "Resistência",
                desc: "Ácido."
            },
            {
                nome: "Imunidade",
                desc: "Cego, Surdo, Caído."
            },
            {
                nome: "Idiomas",
                desc: "Comum e uma língua adicional (geralmente a da região onde infiltra)."
            },
            {
                nome: "Mimetismo de forma",
                desc: "O Slime Mímico pode usar sua ação para se transformar em uma criatura humanoide de tamanho Médio que ele tenha visto. Suas estatísticas permanecem as mesmas, mas ele ganha as características visuais e a voz do alvo. Ele recebe Vantagem em testes de Carisma (Enganação) para manter o disfarce."
            },
            {
                nome: "Núcleo Flexível",
                desc: "Devido à sua inteligência e controle molecular, ele pode passar por frestas de até 2 centímetros sem reduzir seu deslocamento, mesmo carregando equipamentos leves."
            },
            {
                nome: "Voz sedutora",
                desc: "O slime pode mimetizar perfeitamente sons e vozes que ouviu nas últimas 24 horas. Um teste de Sabedoria (Intuição) CD 15 é necessário para perceber que a voz é artificial."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Slime Mímico realiza dois ataques de Pancada Ácida ou um ataque de Adaga Escondida."
            },
            {
                nome: "Pancada ácida",
                desc: "Ataque Corpo a Corpo: +5 para acertar, alcance 1m. Dano: 7 (1d8 + 3) de impacto + 4 (1d8) de dano ácido."
            },
            {
                nome: "Adaga escondida",
                desc: "Ataque Corpo a Corpo: +5 para acertar, alcance 1m. Dano: 5 (1d4 + 3) perfurante + 7 (2d6) de dano ácido. Se o Slime estiver disfarçado e o alvo estiver surpreso, o ataque causa 10 (3d6) de dano ácido extra."
            },
            {
                nome: "Injeção de toxina social (Recarga 5t)",
                desc: "O Slime expele um gás invisível em um cone de 4 metros. Criaturas na área devem passar em uma RES de Sabedoria (CD 13).Falha: A criatura fica Encantada pelo Slime por 1 minuto e o vê como um aliado confiável.Sucesso: A criatura resiste e fica imune a este efeito por 24 horas."
            }
        ],
        sentidos: {
            percepcaoPassiva: "11",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Membrana Camaleônica"
            },
            {
                range: "2",
                item: "Essência de Cordas Vocais"
            },
            {
                range: "3",
                item: "Núcleo Intelectual Instável"
            },
            {
                range: "4",
                item: "Fluido Ácido Concentrado"
            }
        ]
    },
    slimeLanterna: {
        name: "Slime Lanterna",
        rarity: "Incomum",
        icon: "https://i.imgur.com/cYRYhtI.png",
        image: "https://i.imgur.com/sx3CrkL.jpeg",
        subtitle: "CR3",
        description: `O Slime Lanterna é a prova de que o fogo, quando guiado pelo intelecto, é mais perigoso do que quando deixado à solta. Classificado como uma Entidade de Manipulação de Rank B, esta criatura marca uma transição sofisticada no Caminho Intelectual. Diferente de seus ancestrais que apenas queimavam tudo o que tocavam, o Lanterna aprendeu que a luz atrai presas. Ele frequentemente se posiciona em florestas escuras ou masmorras profundas, imitando a luz de uma tocha ou lanterna de um aventureiro para atrair os incautos para armadilhas ou penhascos.

Sua anatomia é única: ele secreta um mineral translúcido que endurece rapidamente, criando uma carapaça protetora que canaliza seu calor interno. Isso permite que ele manipule a temperatura do ar com precisão, criando ilusões auditivas ou térmicas. No Nível 5, ele demonstra uma personalidade neutra, porém curiosa; alguns Slimes Lanterna foram relatados "guiando" viajantes perdidos em troca de pedras raras ou fontes de mana, enquanto outros levam exércitos inteiros à perdição por puro divertimento intelectual.

Em combate, ele não é um guerreiro de linha de frente, mas um controlador. Ele usa seu Calor Hipnótico para paralisar oponentes com a beleza de suas chamas antes de desferir ataques de chicote à distância. Seus estalos rítmicos são, na verdade, uma forma de linguagem complexa, e acredita-se que Slimes Lanterna em diferentes partes do mundo estejam em constante comunicação através de flashes de luz que viajam pelas montanhas à noite.`,
        type: "Monstro médio, gosma",
        ac: "15",
        hp: "52 (8d8 + 16)",
        speed: "9m",
        stats: {
            forca: "10 (+0)",
            destreza: "14 (+2)",
            constituicao: "16 (+3)",
            inteligencia: "16 (+3)",
            sabedoria: "14 (+2)",
            carisma: "18 (+4)"
        },
        habilidades: [
            {
                nome: "Imunidade",
                desc: "Fogo"
            },
            {
                nome: "Imunidade",
                desc: "Cego, Envenenado, Exaustão."
            },
            {
                nome: "Resistência",
                desc: "Frio (devido ao seu núcleo constante), Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Idiomas",
                desc: "Entende Comum e Ígneo, comunica-se por flashes de luz e estalos."
            },
            {
                nome: "Iluminação controlada",
                desc: "O slime emite luz clara em um raio de 9 metros e luz plena por mais 9 metros. Ele pode reduzir essa luz para um brilho tênue como uma ação bônus, mas nunca apagá-la totalmente."
            },
            {
                nome: "Calor Hipnótico",
                desc: "Criaturas que comecem o turno a até 1 metro do Slime Lanterna devem passar em uma RES de Sabedoria (CD 14) ou ficarão Encantadas pela beleza da chama interior até o início do próximo turno da criatura."
            },
            {
                nome: "Ventriloquismo térmico",
                desc: "O slime pode aquecer o ar ao redor para simular vozes humanas sussurrantes ou sons ambientes. Um teste de Sabedoria (Intuição) CD 15 percebe que o som vem da distorção do calor."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Slime Lanterna realiza dois ataques de Chicote de Plasma ou um de Lampejo Ofuscante."
            },
            {
                nome: "Chicote de plasma",
                desc: "Ataque Corpo a Corpo: +5 para acertar, alcance 3m. Dano: 6 (1d8 + 2) de impacto + 7 (2d6) de dano de fogo."
            },
            {
                nome: "Lampejo ofuscante (Recarga 5t)",
                desc: "O Slime libera uma explosão de luz intensa. Todas as criaturas em um cone de 6 metros devem passar em uma RES de Constituição (CD 14) ou ficarão Cegas por 1 minuto. A criatura pode repetir o teste no fim de cada um de seus turnos."
            }
        ],
        sentidos: {
            percepcaoPassiva: "12",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: "Lente de Vidro Vulcânico"
            },
            {
                range: "2",
                item: "Fragmento de Pavio Mental"
            },
            {
                range: "3",
                item: "Óleo de Lanterna Etéreo"
            },
            {
                range: "4",
                item: "Núcleo de Chama Fria"
            }
        ]
    },
    slimeEspelhado: {
        name: "Slime Espelhado",
        rarity: "Incomum",
        icon: "https://i.imgur.com/IDYNqvy.png",
        image: "https://i.imgur.com/yY9q0Zf.jpeg",
        subtitle: "CR 3",
        description: `O Slime Espelhado é o ápice da sofisticação cognitiva na fase incipiente do Caminho Intelectual. Classificado como uma Ameaça de Infiltração e Mimetismo Arcano de Rank B, esta criatura marca a transição onde o lodo deixa de ser uma criatura instintiva para se tornar um observador calculista e manipulador. Ele é frequentemente confundido com uma poça de mercúrio puro ou uma escultura de prata antiga, até o momento em que se ergue e molda sua massa para imitar a forma de seus observadores.

A anatomia do Slime Espelhado é composta por uma liga complexa de água de alta pressão e mercúrio senciante, mantida coesa por um núcleo de mana prismático. No Nível 5, sua inteligência é comparável à de um humano adulto experiente, embora ele tenha dificuldades em replicar emoções ou a anatomia orgânica perfeita (diferente do Slime Mímico). Sua principal característica é a Análise de Fluxo (Magia Azul); ele não devora para crescer em tamanho, mas "consome" conhecimento visual, gravando e replicando instantaneamente habilidades de combate e magias que observa em campo. Ele comunica-se por telepatia visual, projetando imagens simbólicas ou previsões de eventos futuros diretamente em sua pele espelhada.`,
        type: "Monstro médio, gosma",
        ac: "17",
        hp: "37 (5d8 + 15)",
        speed: "9m, natação 12m",
        stats: {
            forca: "10 (+0)",
            destreza: "18 (+4)",
            constituicao: "16 (+3)",
            inteligencia: "18 (+4)",
            sabedoria: "14 (+2)",
            carisma: "14 (+2)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Slime Espelhado for alvo de dano de Água ou Gelo, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado."
            },
            {
                nome: "Imunidade",
                desc: "Radiante (ele reflete a luz perfeitamente), Psíquico (sua mente é fluida e mutável). Cego, Caído, Preso."
            },
            {
                nome: "Resistência",
                desc: "Fogo (a camada externa se vaporiza e se renova instantaneamente), Concussão."
            },
            {
                nome: "Idiomas",
                desc: "Entende Comum e Aquan, comunica-se por telepatia visual (projeção de imagens na própria pele)."
            },
            {
                nome: "Superficie de contra-ataque",
                desc: "Se uma magia de projétil (como Míssil Mágico ou Raio de Fogo) errar o Slime Espelhado por causa da sua CA, o Slime pode usar sua Reação para redirecionar o feitiço. O atacante original deve fazer uma salvaguarda de Destreza (CD 14) ou sofrerá o efeito da própria magia."
            },
            {
                nome: "Análise de fluxo (Magia Azul)",
                desc: "O Slime Espelhado observa os padrões de combate. Se ele vir uma habilidade de classe ou magia sendo usada a até 18 metros, ele pode \"gravar\" essa técnica. No turno seguinte, ele pode usar uma versão de água dessa habilidade (usando Inteligência como atributo). Ele só pode manter uma técnica gravada por vez."
            },
            {
                nome: "Fluidez Cognitiva",
                desc: "Por pertencer ao Caminho Intelectual, ele pode moldar partes de sua massa para formar mãos funcionais ou ferramentas simples, permitindo que ele use itens mágicos, como cajados ou pergaminhos."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Slime Espelhado realiza dois ataques de Lâmina de Mercúrio ou usa sua habilidade Duplicata Refletida."
            },
            {
                nome: "Lâmina de Mercurio",
                desc: "Ataque Corpo a Corpo: +6 para acertar, alcance 3m. Dano: 8 (1d8 + 4) cortante + 4 (1d8) de dano de frio. A lâmina é formada por água sob altíssima pressão e mercúrio denso."
            },
            {
                nome: "Duplicata Refletida (Recarga 5t)",
                desc: "O Slime se divide em três formas idênticas de água. Isso funciona como a magia Reflexos. Enquanto houver pelo menos uma duplicata ativa, o Slime tem vantagem em jogadas de ataque."
            }
        ],
        sentidos: {
            percepcaoPassiva: "12",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Lente de Água Eterna"
            },
            {
                range: "2",
                item: "Mercúrio Cognitivo"
            },
            {
                range: "3",
                item: "Núcleo Prateado de Memória"
            },
            {
                range: "4",
                item: "Fragmento de Pele Prismática"
            }
        ]
    },
    slimeDePrisma: {
        name: "Slime de Prisma",
        rarity: "Incomum",
        icon: "https://i.imgur.com/sqzHcSQ.png",
        image: "https://i.imgur.com/UQM8B2f.jpeg",
        subtitle: "CR3",
        description: `O Slime de Prisma representa uma evolução sofisticada e intelectual na linhagem do gelo, abandonando a força bruta em favor da geometria arcana e da óptica arcana. Classificado como uma Ameaça de Infiltração e Manipulação de Rank B, esta criatura marca o estágio onde o lodo de água de alta pressão deixa de ser uma criatura instintiva para se tornar um observador calculista e manipulador. Ele é frequentemente confundido com uma poça de mercúrio puro ou uma escultura de prata antiga, até o momento em que se ergue e molda sua massa para imitar a forma de seus observadores.

A anatomia do Slime de Prisma é composta por uma liga complexa de água de alta pressão e mercúrio senciante, mantida coesa por um núcleo de mana prismático. No Nível 5, sua inteligência é comparável à de um humano adulto experiente, embora ele tenha dificuldades em replicar emoções ou a anatomia orgânica perfeita. Sua principal característica é a Análise de Fluxo (Magia Azul); ele não devora para crescer em tamanho, mas "consome" conhecimento visual, gravando e replicando instantaneamente habilidades de combate e magias que observa em campo. Ele comunica-se por telepatia visual simbólica e rudimentar, projetando imagens de conflitos passados ou previsões fragmentadas em sua pele espelhada.`,
        type: "Monstro médio, gosma",
        ac: "17",
        hp: "45 (5d8 + 20)",
        speed: "9m",
        stats: {
            forca: "12 (+1)",
            destreza: "14 (+2)",
            constituicao: "18 (+4)",
            inteligencia: "20 (+5)",
            sabedoria: "16 (+3)",
            carisma: "12 (+1)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Slime de Prisma for alvo de dano de Gelo, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Além disso, sua CA aumenta em +1 até o início de seu próximo turno devido ao reforço da estrutura."
            },
            {
                nome: "Imunidade",
                desc: "Radiante (ele refrata a luz), Psíquico (mente de padrão geométrico fixo). Cego, Envenenado, Exaustão, Caído."
            },
            {
                nome: "Resistência",
                desc: "Cortante e Perfurante de armas não-mágicas; Fogo (o gelo prismático é denso demais para derreter rápido)."
            },
            {
                nome: "Idiomas",
                desc: "Entende Comum e Dialeto Primordial, comunica-se através de ressonâncias harmônicas e luzes coloridas."
            },
            {
                nome: "Aura de refração",
                desc: "O corpo do slime desvia a luz ao redor. Ataques à distância contra ele têm Desvantagem. Se um ataque de luz ou laser atingir o Slime, ele é automaticamente refletido para uma criatura à escolha do monstro dentro de 9 metros."
            },
            {
                nome: "Lógica de cristal",
                desc: "O Slime de Prisma pode usar sua Inteligência em vez de Destreza para testes de iniciativa e salvaguardas de Reflexos."
            },
            {
                nome: "Congelamento por contato",
                desc: "Qualquer criatura que toque o Slime ou o atinja com um ataque corpo a corpo a até 1 metro deve passar em uma RES de Constituição (CD 15) ou terá seu deslocamento reduzido em 3 metros até o fim do próximo turno dela."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Slime de Prisma realiza dois ataques de Estaca de Vidro ou usa sua habilidade Geometria Aprisionante."
            },
            {
                nome: "Estaca de vidro",
                desc: "Ataque Corpo a Corpo ou à Distância: +7 para acertar, alcance 1m ou 18m. Dano: 9 (1d8 + 5) perfurante + 4 (1d8) de dano de frio."
            },
            {
                nome: "Geometria Aprisionante (Recarga 5t)",
                desc: "O Slime projeta uma rede de luz sólida em uma área de 6 metros quadrados. Criaturas na área devem passar em uma RES de Força (CD 15). Falha: A criatura fica Presa em uma estrutura de gelo geométrico e sofre 10 (3d6) de dano de frio no início de cada um de seus turnos. A estrutura pode ser quebrada (CA 15, 20 PV)."
            }
        ],
        sentidos: {
            percepcaoPassiva: "13",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Fragmento de Lente Perfeita"
            },
            {
                range: "2",
                item: "Essência de Zero Absoluto"
            },
            {
                range: "3",
                item: "Geoda Arpão"
            },
            {
                range: "4",
                item: "Coração de Cristal Harmônico"
            }
        ]
    },
    slimeDeGeodo: {
        name: "Slime de Geodo",
        rarity: "Incomum",
        icon: "https://i.imgur.com/0TFrl3S.png",
        image: "https://i.imgur.com/p5oB6G9.jpeg",
        subtitle: "CR3",
        description: `O Slime de Geodo é a prova de que a terra não é apenas bruta, mas também calculista. Enquanto os slimes comuns de terra são massas disformes de lama, o Geodo é um ser de Pulsão Geométrica. Classificado como uma Ameaça de Controle Tectônico de Rank B, ele não caça por velocidade, mas por estratégia. Ele não vê o campo de batalha como um lugar, mas como um tabuleiro de vibrações onde ele é o mestre das regras físicas.

A anatomia desta criatura é um prodígio de bio-geologia. Seu núcleo não é líquido, mas um aglomerado de Quartzo Cognitivo que pulsa em frequências subsônicas, permitindo que ele "pense" através de ressonâncias minerais. Sua camada externa é composta por basalto denso e placas de granito que ele molda para imitar, de forma rústica e pesada, a silhueta de um antigo sentinela ou um monge encapuzado. O Slime de Geodo não respira; ele absorve os minerais do solo para reconstruir sua carapaça em tempo real, tornando-o quase indestrutível em terrenos rochosos. Sua comunicação é feita através da Mente Tectônica, enviando mensagens diretamente para os ossos de quem pisa em seu domínio, o que causa uma sensação de pavor ancestral nos viajantes.

Em combate, o Slime de Geodo é o mestre do Pulso Gravitacional. Ele manipula a densidade do ar e do solo ao seu redor, tornando cada passo dos inimigos uma tarefa hercúlea. Ele não usa espadas comuns; ele projeta lâminas de cristal de pressão que vibram de tal forma que podem estilhaçar aço por fadiga de metal antes mesmo do toque. O maior perigo ao enfrentar um Geodo não é o seu soco esmagador, mas sua Ressonância de Cristal, que interfere nas ondas cerebrais dos magos, desfazendo feitiços complexos apenas com sua presença vibratória. Ele é o arquiteto que molda a morte sob os pés daqueles que profanam suas cavernas.`,
        type: "Monstro médio, gosma",
        ac: "18",
        hp: "52 (7d8 + 21)",
        speed: "6m, escavar 6m",
        stats: {
            forca: "16 (+3)",
            destreza: "8 (-1)",
            constituicao: "16 (+3)",
            inteligencia: "18 (+4)",
            sabedoria: "14 (+2)",
            carisma: "10 (+0)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Slime de Geodo for alvo de dano de terra ou pedra (concussão de fontes terrosas), ele não sofre dano. Em vez disso, ele regenera sua carapaça, recuperando uma quantidade de PV igual ao dano que seria causado."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Trovão (ele absorve vibrações). Cego, Envenenado, Exaustão, Caído, Petrificado."
            },
            {
                nome: "Resistência",
                desc: "Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Idiomas",
                desc: "Entende Comum e Terran, comunica-se através de vibrações de baixa frequência que \"ecoam\" na mente de quem toca o solo."
            },
            {
                nome: "Ressonância de Cristal",
                desc: "O Slime emite um zumbido constante. Criaturas a até 3 metros dele que tentarem conjurar magias que exijam concentração devem passar em uma RES de Constituição (CD 14) ou perderão a magia devido à interferência vibracional."
            },
            {
                nome: "Mente Tectônica",
                desc: "O Slime de Geodo pode usar sua Inteligência em testes de Salvaguarda de Força, calculando os pontos de pressão exatos para resistir a empurrões ou efeitos de deslocamento."
            },
            {
                nome: "Armadura de Geodo",
                desc: "Se for atingido por um ataque crítico, a camada externa de pedra se quebra, mas revela cristais afiados. O atacante sofre 1d10 de dano perfurante e a CA do Slime diminui em 1 até o fim do combate (acumula até -2)."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Slime de Geodo realiza dois ataques de Esmagamento de Quartzo ou usa sua habilidade Pulso Gravitacional."
            },
            {
                nome: "Esmagamento de Quartzo",
                desc: "Ataque Corpo a Corpo: +6 para acertar, alcance 1m. Dano: 10 (2d6 + 3) de impacto + 3 (1d6) de dano de trovão."
            },
            {
                nome: "Pulso Gravitacional (Recarga 5t)",
                desc: "O Slime aumenta a gravidade em um raio de 6 metros. Todas as criaturas na área devem passar em uma RES de Força (CD 14). Falha: Ficam Caídas e têm seu deslocamento reduzido a 0 até o início do próximo turno do Slime. Sucesso: Apenas metade do deslocamento é reduzido."
            }
        ],
        sentidos: {
            percepcaoPassiva: "12",
            visaoEscuro: "18m (sismico)"
        },
        drops: [
            {
                range: "1",
                item: "Drusa de Quartzo Cognitivo"
            },
            {
                range: "2",
                item: "Núcleo Gravitacional"
            },
            {
                range: "3",
                item: "Pó de Diamante Terroso"
            },
            {
                range: "4",
                item: "Membrana de Sílica"
            }
        ]
    },
    slimeMagnetico: {
        name: "Slime Magnético",
        rarity: "Incomum",
        icon: "https://i.imgur.com/ffWYOWn.png",
        image: "https://i.imgur.com/7LrTUDE.jpeg",
        subtitle: "CR3",
        description: `O Slime Magnético é o ápice da computação biológica no Caminho Intelectual. Enquanto slimes elétricos comuns são apenas baterias vivas que descarregam energia sem controle, o Magnético é um Manipulador de Fluxo. Classificado como uma Ameaça de Indução Eletromagnética de Rank B, ele não caça por fome física, mas sim por necessidade de "processamento". Ele habita ruínas de antigas civilizações tecnológicas ou laboratórios abandonados, onde pode se alimentar de correntes residuais e metais raros.

A anatomia desta criatura é uma maravilha da engenharia orgânica. Seu corpo é composto por um Ferrofluido Senciante de cor índigo profundo, que reage instantaneamente a campos magnéticos. Seu núcleo não é uma gema, mas um Célula de Processamento Sináptico que brilha em um azul neon intenso. No Nível 5, ele desenvolveu a capacidade de "vestir" o ambiente: ele atrai fragmentos de metal, engrenagens e fios, moldando-os ao redor de sua massa líquida para criar uma carapaça que imita a silhueta de um humano encapuzado. Ele não se comunica por sons, mas por Estática Modulada; quem chega perto ouve um zumbido de rádio antigo, e magos relatam que seus pensamentos parecem "pixelados" na presença da criatura.

Em combate, o Slime Magnético é um pesadelo para guerreiros de armadura. Ele utiliza sua Singularidade Metálica para transformar o equipamento do adversário em uma prisão, puxando-os para o seu centro gravitacional. Ele não desfere golpes físicos comuns, mas usa Aceleração de Lorentz para disparar estilhaços de metal em velocidades supersônicas, como um canhão elétrico orgânico. O maior perigo ao enfrentá-lo é o Feedback Sináptico: ao ser tocado, ele envia uma descarga diretamente para o sistema nervoso do atacante, fritando sinapses e causando desorientação mental severa. Ele é o fantasma na máquina, a inteligência fria que reina sobre o metal e o raio.`,
        type: "Monstro médio, gosma",
        ac: "16",
        hp: "37 (5d8 + 15)",
        speed: "9m, voo 6m",
        stats: {
            forca: "10 (+0)",
            destreza: "18 (+4)",
            constituicao: "16 (+3)",
            inteligencia: "20 (+5)",
            sabedoria: "14 (+2)",
            carisma: "12 (+1)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Slime Magnético for alvo de dano Elétrico, ele não sofre dano. Em vez disso, ele recupera uma quantidade de Pontos de Vida igual ao dano que seria causado. Se o HP estiver cheio, ele fica \"Sobrecarregado\", ganhando vantagem no próximo ataque."
            },
            {
                nome: "Imunidade",
                desc: "Trovão, Veneno. Cego, Envenenado, Paralisado, Caído."
            },
            {
                nome: "Resistência",
                desc: "Perfurante e Cortante (as armas são desviadas por micro-campos magnéticos)."
            },
            {
                nome: "Idiomas",
                desc: "Entende Comum e Binário Arcano, comunica-se através de estática modulada que soa como rádio antigo."
            },
            {
                nome: "Campo de atração",
                desc: "Criaturas vestindo armadura de metal ou carregando armas de metal a até 3 metros do Slime têm seu deslocamento reduzido em 3 metros e sofrem Desvantagem em testes de Destreza."
            },
            {
                nome: "Processamento de combate",
                desc: "O Slime usa sua Inteligência (+5) em vez de Destreza para sua Classe de Armadura e iniciativa. Ele \"calcula\" a trajetória dos ataques antes mesmo de ocorrerem."
            },
            {
                nome: "Feedback Sináptico",
                desc: "Sempre que uma criatura atingir o Slime com um ataque corpo a corpo, ela deve passar em uma RES de Inteligência (CD 15) ou sofrerá 1d6 de dano psíquico devido à interferência elétrica nos neurônios."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Slime Magnético realiza dois ataques de Chicote Voltaico ou usa sua habilidade Singularidade Metálica."
            },
            {
                nome: "Chicote Voltaico",
                desc: "Ataque Corpo a Corpo: +7 para acertar, alcance 3m. Dano: 7 (1d4 + 5) de impacto + 7 (2d6) de dano elétrico. Se o alvo estiver usando metal, o ataque tem Vantagem."
            },
            {
                nome: "Singularidade metalica (Recarga 5t)",
                desc: "O Slime inverte sua polaridade. Todas as criaturas em um raio de 6 metros usando metal devem passar em uma RES de Força (CD 15) ou serão puxadas para um espaço adjacente ao Slime e ficarão Impedidas até o início do próximo turno do Slime."
            }
        ],
        sentidos: {
            percepcaoPassiva: "12",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Núcleo de Silício Arcano"
            },
            {
                range: "2",
                item: "Bobina de Cobre Perpétua"
            },
            {
                range: "3",
                item: "Lodo Ferrofluido"
            },
            {
                range: "4",
                item: "Imã de Evento Singular"
            }
        ]
    },
    slimeDeLatao: {
        name: "Slime de latão",
        rarity: "Incomum",
        icon: "https://i.imgur.com/30vkBlP.png",
        image: "https://i.imgur.com/mje7MSm.jpeg",
        subtitle: "CR3",
        description: `O Slime de Latão representa a ápice da lógica mecânica na linhagem do metal, abandonando a força bruta em favor da geometria sagrada e da óptica arcana. Classificado como uma Ameaça de Infiltração e Mimetismo Arcano de Rank B, esta criatura marca o estágio onde o lodo de água de alta pressão deixa de ser uma criatura instintiva para se tornar um observador calculista e manipulador. Ele é frequentemente confundido com uma poça de mercúrio puro ou uma escultura de prata antiga, até o momento em que se ergue e molda sua massa para imitar a forma de seus observadores.

A anatomia do Slime de Latão é composta por uma liga complexa de água de alta pressão e mercúrio senciante, mantida coesa por um núcleo de mana prismático. No Nível 5, sua inteligência é comparável à de um humano adulto experiente, embora ele tenha dificuldades em replicar emoções ou a anatomia orgânica perfeita. Sua principal característica é a Análise de Fluxo (Magia Azul); ele não devora para crescer em tamanho, mas "consome" conhecimento visual, gravando e replicando instantaneamente habilidades de combate e magias que observa em campo. Ele comunica-se por telepatia visual simbólica e rudimentar, projetando imagens de conflitos passados ou previsões fragmentadas em sua pele espelhada.

O perigo do Slime de Latão reside em sua natureza reativa e imprevisível. Em combate, ele usa sua Superfície de Contra-Ataque (Reflect) para devolver projéteis mágicos aos atacantes, enquanto sua Lâmina de Mercúrio corta com a precisão de um mestre espadachim. Se encurralado, ele usa sua Duplicata Refletida (Recarga 5-6), criando cópias de água para confundir oponentes enquanto o núcleo original se teletransporta através de reflexos em superfícies molhadas. Ele é o guardião silencioso das verdades ocultas, uma entidade que acredita que o mundo é apenas um reflexo de uma realidade mais profunda e perigosa.`,
        type: "Monstro médio, gosma",
        ac: "18",
        hp: "42 (5d8 + 20)",
        speed: "6m",
        stats: {
            forca: "14 (+2)",
            destreza: "10 (+0)",
            constituicao: "18 (+4)",
            inteligencia: "20 (+5)",
            sabedoria: "16 (+3)",
            carisma: "10 (+0)"
        },
        habilidades: [
            {
                nome: "Imunidade",
                desc: "Veneno, Psíquico. Cego, Envenenado, Exaustão, Amedrontado"
            },
            {
                nome: "Resistência",
                desc: "Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Idiomas",
                desc: "Entende Comum e Dialeto das Máquinas, comunica-se através de cliques, assobios de vapor e bips rítmicos."
            },
            {
                nome: "Analise de ponto fraco",
                desc: "Como uma ação bônus, o Slime analisa uma criatura que ele possa ver a até 18 metros. Ele identifica instantaneamente a CA da criatura e qualquer resistência a dano que ela possua. Até o fim do combate, o Slime e seus aliados têm +1 nas jogadas de ataque contra esse alvo específico."
            },
            {
                nome: "Núcleo de Relógio",
                desc: "O Slime não pode ser surpreendido e possui vantagem em testes de iniciativa. Sua mente processa o tempo de forma segmentada, permitindo reações precisas."
            },
            {
                nome: "Tensão superficial metálica",
                desc: "O Slime pode se achatar até 2 centímetros de espessura, permitindo que ele passe por frestas de portas ou engrenagens de máquinas sem sofrer penalidades, apesar de sua carapaça rígida."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Slime de Latão realiza dois ataques de Lâmina de Pistão ou usa sua habilidade Descarga de Vapor."
            },
            {
                nome: "Lâmina de pistão",
                desc: "Ataque Corpo a Corpo: +5 para acertar, alcance 1m. Dano: 11 (2d8 + 2) de dano perfurante. O Slime projeta uma lâmina oculta que é disparada por um pistão hidráulico."
            },
            {
                nome: "Descarga de vapor (Recarga 5t)",
                desc: "O Slime libera uma nuvem de vapor escaldante em um cone de 4 metros. Cada criatura na área deve fazer uma salvaguarda de Constituição (CD 15).  Falha: 14 (4d6) de dano de fogo e a criatura fica Cega até o final do próximo turno dela.  Sucesso: Metade do dano e não fica cega."
            }
        ],
        sentidos: {
            percepcaoPassiva: "13",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Engrenagem Mestra de Latão"
            },
            {
                range: "2",
                item: "Óleo Hidráulico Senciante"
            },
            {
                range: "3",
                item: "Placa de Latão Térmica"
            },
            {
                range: "4",
                item: "Chip de Memória Analógico"
            }
        ]
    },
    slimeDasSombras: {
        name: "Slime das sombras",
        rarity: "Incomum",
        icon: "https://i.imgur.com/52iUTsX.png",
        image: "https://i.imgur.com/OrIp6vQ.jpeg",
        subtitle: "CR3",
        description: `O Slime das Sombras é a personificação da entropia e do silêncio no Caminho Intelectual. Enquanto outros slimes evoluem para manipular elementos físicos, este ser evoluiu para processar a "não-existência". Classificado como uma Ameaça de Infiltração e Pavor Psicológico de Rank B, ele é o predador definitivo de locais onde a luz foi esquecida, como catacumbas reais ou fendas para o Plano Negativo.

A anatomia desta criatura é um paradoxo biológico. Seu corpo é feito de uma substância que os alquimistas chamam de Piche Abissal, um fluido que não reflete a luz, mas a devora. Seu núcleo não é físico, mas uma Singularidade Necrótica que pulsa com uma inteligência fria e calculista. No Nível 5, ele não tenta ser um humano perfeito; ele prefere ser uma silhueta aterrorizante, uma "falha" visual que causa desconforto imediato em seres vivos. Ele não emite sons orgânicos; ele utiliza a Lógica do Vazio para projetar sussurros diretamente no córtex auditivo de suas vítimas, repetindo seus piores medos com vozes de entes queridos falecidos.

Em combate, enfrentar um Slime das Sombras é lutar contra a própria escuridão. Ele utiliza seu Mergulho na Escuridão para se fundir ao chão, tornando-se uma poça de vácuo que paralisa e cega quem pisar nele. Sua Garra de Evento Horizonte não corta apenas a carne; ela drena a própria força vital e a vontade de lutar, deixando o alvo debilitado e fraco. O maior perigo reside na sua natureza intangível: ele pode atravessar frestas e se esconder em sombras tão pequenas quanto a de uma moeda, esperando o momento exato para envolver sua presa em um abraço de frio absoluto. Ele não é apenas um monstro; ele é a sombra que olha de volta para você.`,
        type: "Monstro médio, gosma",
        ac: "16",
        hp: "32 (5d8 + 10)",
        speed: "9m, escalada 9m",
        stats: {
            forca: "8 (-1)",
            destreza: "18 (+4)",
            constituicao: "14 (+2)",
            inteligencia: "20 (+5)",
            sabedoria: "16 (+3)",
            carisma: "14 (+2)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Slime das Sombras for alvo de dano Necrótico, ele não sofre dano. Em vez disso, ele se torna invisível até o final do seu próximo turno e recupera uma quantidade de Pontos de Vida igual ao dano que seria causado."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Necrótico. Cego, Envenenado, Exaustão, Caído, Preso, Agarrado."
            },
            {
                nome: "Resistência",
                desc: "Ácido, Fogo, Frio, Trovão; Cortante, Perfurante e Concussão de armas não-mágicas."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Radiante."
            },
            {
                nome: "Idiomas",
                desc: "Entende Comum e Abissal, comunica-se através de sussurros que parecem vir de dentro da mente do interlocutor."
            },
            {
                nome: "Mimetismo de sombra",
                desc: "Enquanto estiver em iluminação meia-luz ou escuridão, o Slime pode usar a ação de Esconder-se como uma ação bônus. Ele é indistinguível de uma sombra comum enquanto estiver parado."
            },
            {
                nome: "Lógica do vazio",
                desc: "O Slime pode ocupar o mesmo espaço que outra criatura. Além disso, ele ignora terreno difícil se houver qualquer sombra no local."
            },
            {
                nome: "Corpo de piche mental",
                desc: "Criaturas que tentarem ler a mente do Slime ou causar dano Psíquico devem passar em uma RES de Inteligência (CD 15) ou ficarão Amedrontadas por 1 minuto, vendo visões de sua própria morte."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Slime das Sombras realiza dois ataques de Garra de Evento Horizonte ou usa sua habilidade Mergulho na Escuridão."
            },
            {
                nome: "Garra de evento horizonte",
                desc: "Ataque Corpo a Corpo: +7 para acertar, alcance 1m. Dano: 7 (1d6 + 4) de dano necrótico. O alvo deve passar em uma RES de Força (CD 15) ou terá sua força reduzida em 1d4 até o fim de um descanso curto. Se a força chegar a 0, o alvo morre."
            },
            {
                nome: "Mergulho na escuridão (Recarga 5t)",
                desc: "O Slime se expande no chão em um raio de 3 metros. Cada criatura na área deve passar em uma RES de Destreza (CD 15). Falha: 14 (4d6) de dano necrótico e a criatura fica Cega e Impedida enquanto o Slime permanecer sob seus pés. Sucesso: Metade do dano e não sofre condições."
            }
        ],
        sentidos: {
            percepcaoPassiva: "13",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: "Resíduo de Escuridão Sólida"
            },
            {
                range: "2",
                item: "Glândula de Medo Destilado"
            },
            {
                range: "3",
                item: "Membrana de Espaço Negativo"
            },
            {
                range: "4",
                item: "Olho de Obsidiana Senciente"
            }
        ]
    },
    homunculoDeGel: {
        name: "Homunculo de Gel",
        rarity: "Raro",
        icon: "https://i.imgur.com/iLf5zcu.png",
        image: "https://i.imgur.com/MA9acHi.jpeg",
        subtitle: "CR 8",
        description: `O Homúnculo de Gel é a prova de que a evolução necrótica e alquímica pode transformar a mais simples das poças em um estrategista brilhante. Diferente do Slime Mímico, que usa o engano para caçar por instinto, o Homúnculo possui uma consciência plena e uma curiosidade mórbida sobre a biologia das raças civilizadas.

Sua forma é uma tentativa deliberada de imitar a estrutura humanoide, o que lhe permite gesticular e até utilizar ferramentas alquímicas. O que mais impressiona (e aterroriza) os estudiosos é a sua capacidade de comando. Ele atua como uma unidade de processamento central para colônias de slimes, emitindo sinais químicos e vibratórios que coordenam ataques complexos que slimes selvagens seriam incapazes de executar sozinhos.

Em combate, ele não se comporta como uma besta faminta. Ele observa, identifica o elo mais fraco do grupo de aventureiros e utiliza seu ácido altamente corrosivo para desarmar ou destruir equipamentos vitais antes de desferir o golpe final. Sua presença em uma masmorra indica que os slimes locais não são mais um problema ambiental, mas sim um exército organizado.`,
        type: "Monstro médio, gosma",
        ac: "17",
        hp: "126 (12d10 + 60)",
        speed: "9m, natação 9m",
        stats: {
            forca: "14 (+2)",
            destreza: "14 (+2)",
            constituicao: "20 (+5)",
            inteligencia: "20 (+5)",
            sabedoria: "16 (+3)",
            carisma: "16 (+3)"
        },
        habilidades: [
            {
                nome: "Imunidade",
                desc: "Ácido, Veneno. Cego, Envenenado, Exaustão, Caído, Preso, Agarrado."
            },
            {
                nome: "Resistência",
                desc: "Cortante, Perfurante e Concussão de armas não-mágicas."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Frio (O gel se torna quebradiço)."
            },
            {
                nome: "Idiomas",
                desc: "Comum, Dracônico e Dialeto das Sombras. Consegue falar com clareza, embora sua voz soe borbulhante."
            },
            {
                nome: "Presença de comando",
                desc: "Criaturas do Caminho Selvagem (Bestial) em um raio de 18 metros do Homúnculo de Gel ganham um bônus de +2 em suas jogadas de ataque e não podem ser amedrontadas."
            },
            {
                nome: "Corpo semisólido",
                desc: "O Homúnculo pode passar por espaços de até 2,5 centímetros de largura sem se espremer. Além disso, ele tem vantagem em testes de resistência para não ser empurrado ou movido contra sua vontade."
            },
            {
                nome: "Mente analítica",
                desc: "O Homúnculo adiciona seu bônus de Inteligência (+5) em seus testes de Iniciativa. Ele pode usar a ação de Ajuda como uma ação bônus para um aliado a até 9 metros."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Homúnculo de Gel realiza três ataques de Punho de Vitríolo ou usa sua habilidade Pulso Corrosivo."
            },
            {
                nome: "Punho de Vitríolo",
                desc: "Ataque Corpo a Corpo: +8 para acertar, alcance 1m. Dano: 12 (2d6 + 5) de dano de concussão mais 10 (3d6) de dano ácido. Se o alvo estiver usando uma armadura não-mágica, ela sofre uma penalidade permanente e cumulativa de -1 na CA. Se a CA da armadura chegar a 10, ela é destruída."
            },
            {
                nome: "Pulso Corrosivo (Recarga 5t)",
                desc: "O Homúnculo expele uma nuvem de gás ácido em um cone de 9 metros. Cada criatura na área deve passar em uma RES de Constituição (CD 16). Falha: 35 (10d6) de dano ácido e a criatura fica Envenenada pela dor da corrosão até o início do próximo turno do Homúnculo. Sucesso: Metade do dano e não fica envenenada."
            }
        ],
        sentidos: {
            percepcaoPassiva: "13",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Núcleo de Gel Cristalizado"
            },
            {
                range: "2",
                item: "Solvente Universal Concentrado"
            },
            {
                range: "3",
                item: "Tecido de Homúnculo Maleável"
            },
            {
                range: "4",
                item: "Cérebro Alquímico Preservado"
            }
        ]
    },
    artificeDeVidro: {
        name: "Artifice de vidro",
        rarity: "Raro",
        icon: "https://i.imgur.com/6m2iMTk.png",
        image: "https://i.imgur.com/jIaz3fk.jpeg",
        subtitle: "CR 8",
        description: `O Artífice de Vidro representa o ápice da maestria elemental sobre o fogo e a forma. Enquanto seus ancestrais, os Slimes Lanterna, eram meras fontes de luz passivas, o Artífice é um mestre da geometria e da termodinâmica. Ele não apenas gera calor; ele o manipula com precisão cirúrgica para fundir o ambiente ao seu redor, transformando areia e rocha em complexas estruturas de cristal e vidro temperado.

Sua aparência é hipnotizante e perigosa. O corpo é uma carapaça de vidro resiliente que abriga um núcleo de magma em constante movimento, criando um efeito visual de luz e sombra que confunde os atacantes. O Artífice de Vidro raramente luta sozinho ou de forma desorganizada. Ele utiliza suas lentes flutuantes para focar raios de calor intenso e criar coberturas defensivas para seus aliados de nível inferior, geralmente slimes do caminho selvagem que ele trata como ferramentas.

Encontrar um Artífice de Vidro em uma mina ou caverna vulcânica significa que o local foi transformado em uma oficina. Eles são conhecidos por decorar seus territórios com esculturas de vidro de suas vítimas, que servem tanto como troféus quanto como amplificadores para suas habilidades ópticas. Sua inteligência é fria e calculista, vendo o mundo não como algo a ser queimado, mas como matéria-prima a ser moldada em sua própria imagem cristalina.`,
        type: "Monstro médio, gosma",
        ac: "18",
        hp: "136 (16d8 + 64)",
        speed: "9m, escalada 9m",
        stats: {
            forca: "12 (+1)",
            destreza: "16 (+3)",
            constituicao: "18 (+4)",
            inteligencia: "22 (+6)",
            sabedoria: "14 (+2)",
            carisma: "14 (+2)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Artífice de Vidro for alvo de dano de Fogo, ele não sofre dano. Em vez disso, sua carapaça brilha intensamente, concedendo-lhe vantagem em todos os ataques até o final do seu próximo turno e recuperando 15 Pontos de Vida."
            },
            {
                nome: "Imunidade",
                desc: "Fogo, Veneno, Cego, Envenenado, Exaustão, Caído, Preso, Agarrado."
            },
            {
                nome: "Resistência",
                desc: "Cortante e Perfurante de armas não-mágicas."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Concussão, Trovão (Vibrações quebram sua estrutura)."
            },
            {
                nome: "Idiomas",
                desc: "Comum, Ígneo e Celestial. Fala com uma voz que soa como cristais batendo uns nos outros."
            },
            {
                nome: "Aura de fundição",
                desc: "Criaturas que comecem o turno a até 1 metro do Artífice sofrem 7 (2d6) de dano de fogo devido ao calor extremo que ele emana para manter sua forma vítrea."
            },
            {
                nome: "Refração defensiva",
                desc: "Enquanto estiver em luz brilhante, ataques à distância contra o Artífice têm desvantagem, pois sua carapaça distorce a imagem de sua localização real."
            },
            {
                nome: "Arquitetura de cristal",
                desc: "O Artífice pode gastar 1 metro de movimento para criar um pequeno pilar ou parede de vidro de 1m em um espaço adjacente. Esse vidro tem CA 15 e 10 PV, servindo como cobertura meia ou total."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Artífice de Vidro realiza dois ataques de Lâmina de Sílica ou usa seu Raio Prismático."
            },
            {
                nome: "Lâmina de sílica",
                desc: "Ataque Corpo a Corpo: +9 para acertar, alcance 3m (o braço se estende como vidro derretido). Dano: 13 (2d6 + 6) de dano cortante mais 7 (2d6) de dano de fogo. Se o ataque for um acerto crítico, o alvo fica sangrando, sofrendo 1d6 de dano cortante no início de cada um de seus turnos até receber cura mágica."
            },
            {
                nome: "Raio prismático (Recarga 5t)",
                desc: "O Artífice concentra luz através de seu núcleo. Ele dispara um feixe de energia em uma linha de 18 metros. Cada criatura na linha deve passar em uma RES de Destreza (CD 17). Falha: 36 (8d8) de dano radiante e a criatura fica Cega por 1 minuto. A criatura pode repetir a RES no final de cada um de seus turnos. Sucesso: Metade do dano e não fica cega."
            }
        ],
        sentidos: {
            percepcaoPassiva: "12",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Lente de Foco Perfeito"
            },
            {
                range: "2",
                item: "Areia Vulcânica Alquímica"
            },
            {
                range: "3",
                item: "Fragmento de Carapaça Refrativa"
            },
            {
                range: "4",
                item: "Essência de Sílica Líquida"
            }
        ]
    },
    misticoDasBrumas: {
        name: "Mistico das brumas",
        rarity: "Raro",
        icon: "https://i.imgur.com/k54tSCj.png",
        image: "https://i.imgur.com/HVBeKa6.jpeg",
        subtitle: "CR 8",
        description: `O Místico das Brumas é a manifestação da perfeição biológica e mágica dos slimes aquáticos. Ao atingir este estágio de evolução intelectual, a criatura deixa para trás a massa informe e assume uma silhueta feminina humanoide, esculpida em água e névoa condensada. Essa forma não é apenas estética; é uma ferramenta psicológica utilizada para desarmar ou fascinar oponentes antes que percebam que estão presos em sua armadilha de ilusões.

Sua aparência é marcada por curvas fluidas e uma elegância sobrenatural, com cabelos que parecem nuvens de tempestade em constante movimento. No entanto, sua natureza permanece profundamente predatória. Como líder tática, ela comanda o campo de batalha com movimentos graciosos que ocultam ataques devastadores. O Místico das Brumas entende a vaidade e o desejo das raças humanas, usando sua forma para se infiltrar em lendas e contos como uma divindade das águas, quando na verdade é uma mente fria focada na expansão de seu domínio.

Diferente de outras evoluções, ela possui uma vaidade intelectual única, decorando seu território com reflexos de si mesma. Aventureiros que entram em sua névoa frequentemente relatam ver uma figura feminina divina entre as árvores ou sob a superfície da água, apenas para serem atraídos para áreas onde o ar é rarefeito e a realidade é distorcida por sua vontade absoluta.`,
        type: "Monstro médio, gosma",
        ac: "16",
        hp: "112 (15d8 + 45)",
        speed: "9m, natação 12m",
        stats: {
            forca: "10 (+0)",
            destreza: "18 (+4)",
            constituicao: "16 (+3)",
            inteligencia: "20 (+5)",
            sabedoria: "18 (+4)",
            carisma: "16 (+3)"
        },
        habilidades: [
            {
                nome: "Imunidade",
                desc: "Frio, Veneno, Cego, Envenenado, Exaustão, Caído, Preso, Agarrado."
            },
            {
                nome: "Resistência",
                desc: "Ácido; Cortante, Perfurante e Concussão de armas não-mágicas."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Elétrico (A eletricidade se dispersa na névoa e sobrecarrega seu núcleo)."
            },
            {
                nome: "Idiomas",
                desc: "Comum, Aquan e Telepatia 18 metros. Sua voz parece ecoar de todas as direções ao mesmo tempo."
            },
            {
                nome: "Aura de miragem",
                desc: "Uma névoa constante de 6 metros de raio rodeia o Místico. Essa área é considerada de cobertura leve para aliados e terreno difícil para inimigos. Além disso, qualquer criatura que atacar o Místico enquanto estiver na névoa tem desvantagem no ataque, a menos que possua visão verdadeira."
            },
            {
                nome: "Reflexo psiquico",
                desc: "Quando o Místico for alvo de um ataque que cause dano Psíquico ou tente ler sua mente, o conjurador deve passar em uma RES de Inteligência (CD 16). Se falhar, sofre o dano em vez do Místico e fica Atordoado até o final do próximo turno dele."
            },
            {
                nome: "Comandante do nevoeiro",
                desc: "Slimes do Caminho Selvagem a até 18 metros ganham a habilidade de usar a ação de Esconder-se como uma ação bônus enquanto estiverem dentro de qualquer tipo de névoa ou fumaça."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Místico das Brumas realiza dois ataques de Jato de Pressão Mental ou usa sua habilidade Fractais de Névoa."
            },
            {
                nome: "Jato de pressão mental",
                desc: "Ataque à Distância Mágico: +9 para acertar, alcance 18m. Dano: 14 (2d8 + 5) de dano de frio mais 7 (2d6) de dano psíquico. O alvo deve passar em uma RES de Sabedoria (CD 16) ou perderá a reação até o início do próximo turno do Místico."
            },
            {
                nome: "Fractais de névoa (Recarga 5t)",
                desc: "O Místico cria 3 duplicatas ilusórias de si mesmo ou de um aliado em pontos que ele possa ver dentro de sua Aura de Miragem. As duplicatas têm 1 PV, a mesma CA do Místico e podem realizar um ataque visual que causa 2d6 de dano psíquico (RES de Inteligência CD 16 para anular) antes de desaparecerem."
            }
        ],
        sentidos: {
            percepcaoPassiva: "14",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Núcleo de Água Argentada"
            },
            {
                range: "2",
                item: "Fragmento de Lente Astral"
            },
            {
                range: "3",
                item: "Essência de Névoa Estática"
            },
            {
                range: "4",
                item: "Véu do Esquecimento"
            }
        ]
    },
    escultorDeFrio: {
        name: "Escultor de frio",
        rarity: "Raro",
        icon: "https://i.imgur.com/fH3uIJO.png",
        image: "https://i.imgur.com/yTKkuJW.jpeg",
        subtitle: "CR 8",
        description: `A Escultora de Frio representa o ápice da sofisticação entre as criaturas gélidas do caminho intelectual. Ao atingir o nível 10, esta entidade transcende sua forma amorfa para assumir uma silhueta feminina de elegância arrebatadora, esculpida em gelo cristalino e neve compactada. Sua aparência é cativante e perigosa, parecendo uma deusa do inverno saída direto de uma lenda isekai, usando sua beleza gelada como uma distração fatal.

Sua inteligência superior não é voltada apenas para a destruição, mas para a perfeição estética. A Escultora de Frio não vê seus inimigos como ameaças, mas como matéria-prima para sua arte mórbida. Ela utiliza suas habilidades táticas para encurralar e congelar oponentes em poses de angústia, transformando-os em estátuas eternas para decorar seu domínio glacial. Sua obsessão pela beleza fria é tão grande que ela comanda grupos de slimes selvagens para organizar o campo de batalha antes do confronto final, garantindo que o cenário seja digno de sua intervenção.

Aqueles que encontram uma Escultora de Frio são frequentemente atraídos por sua forma magnífica e brilho prismático, apenas para serem vítimas de sua aura de zero absoluto. Elas são as governantes incontestáveis dos picos gelados e das masmorras de cristal, onde a beleza e a morte caminham de mãos dadas sob a luz refletida em seus corpos impecáveis.`,
        type: "Monstro médio, gosma",
        ac: "18",
        hp: "120 (16d8 + 48)",
        speed: "9m, escalada 9m",
        stats: {
            forca: "10 (+0)",
            destreza: "16 (+3)",
            constituicao: "16 (+3)",
            inteligencia: "22 (+6)",
            sabedoria: "16 (+3)",
            carisma: "14 (+2)"
        },
        habilidades: [
            {
                nome: "Imunidade",
                desc: "Frio, Veneno, Cego, Envenenado, Exaustão, Caído, Preso, Agarrado."
            },
            {
                nome: "Absorção",
                desc: "Sempre que o Escultor de Frio for alvo de dano de Frio, ele não sofre dano. Em vez disso, ele pode criar instantaneamente uma escultura de gelo de si mesmo em um espaço adjacente (atuando como a magia Imagem Espelhada para um ataque) e recupera 15 Pontos de Vida."
            },
            {
                nome: "Resistência",
                desc: "Cortante, Perfurante e Concussão de armas não-mágicas."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Fogo, Concussão (Impactos pesados quebram sua estrutura)."
            },
            {
                nome: "Idiomas",
                desc: "Comum, Dialeto Glacial e Telepatia 18 metros. Sua comunicação é precisa e soa como o estalar de gelo fino."
            },
            {
                nome: "Aura de zero absoluto",
                desc: "O ar ao redor do Escultor é tão frio que o chão em um raio de 6 metros é considerado terreno difícil. Criaturas inimigas que começarem o turno na aura têm sua velocidade reduzida em 3 metros até o início do próximo turno."
            },
            {
                nome: "Fractais Defensivo",
                desc: "O corpo do Escultor é composto por milhares de facetas de gelo prismático. Se um ataque à distância errar o Escultor por 5 ou mais, o projétil (ou raio) é refletido de volta para o atacante, usando o mesmo bônus de acerto do ataque original."
            },
            {
                nome: "Arquiteto de cristais",
                desc: "O Escultor pode manipular o gelo no campo de batalha. Ele pode usar uma ação bônus para erguer uma parede de gelo (1,5m de largura por 3m de altura) em qualquer lugar dentro de sua Aura de Zero Absoluto. A parede tem CA 12 e 15 PV."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Escultor de Frio realiza três ataques de Estalactite Prismática ou usa sua habilidade Esculpir Prisão."
            },
            {
                nome: "Estalactite prismática",
                desc: "Ataque à Distância Mágico: +9 para acertar, alcance 18m. Dano: 10 (1d8 + 6) de dano de frio mais 7 (2d6) de dano perfurante. Se o alvo for atingido por dois desses ataques no mesmo turno, ele fica Incapacitado pelo frio extremo até o fim do próximo turno do Escultor."
            },
            {
                nome: "Esculpir prisão (Recarga 5t)",
                desc: "O Escultor foca sua vontade em uma criatura que ele possa ver a até 12 metros. O gelo começa a crescer rapidamente ao redor do alvo. O alvo deve fazer uma RES de Destreza (CD 17). Falha: 32 (8d6 + 4) de dano de frio e a criatura fica Impedida e Atordoada dentro de um bloco de gelo sólido. A criatura (ou um aliado) pode usar uma ação para fazer um teste de Força (CD 17) para quebrar o gelo. Sucesso: Metade do dano e não sofre as condições."
            }
        ],
        sentidos: {
            percepcaoPassiva: "13",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Cinzel de Gelo Eterno"
            },
            {
                range: "2",
                item: "Fragmento de Lente Glacial"
            },
            {
                range: "3",
                item: "Coração de Inverno Condensado"
            },
            {
                range: "4",
                item: "Pó de Diamante Refratário"
            }
        ]
    },
    arquitetoDeBarro: {
        name: "Arquiteto de barro",
        rarity: "Raro",
        icon: "https://i.imgur.com/tYTAk9u.png",
        image: "https://i.imgur.com/Q9H80hR.jpeg",
        subtitle: "CR 8",
        description: `O Arquiteto de Barro é a personificação da ordem e da construção dentro do ecossistema dos slimes. Enquanto o Slime de Geodo apenas acumulava minerais de forma caótica, o Arquiteto utiliza sua inteligência superior para transmutar seu próprio corpo e o solo ao redor em cerâmica temperada e estruturas arquitetônicas complexas. Sua forma masculina e imponente projeta uma aura de autoridade inabalável, agindo como o pilar central de qualquer colônia de criaturas terrestres.

Sua mente funciona como a de um engenheiro militar. Ele não apenas ataca; ele fortifica. Em batalha, o Arquiteto de Barro molda o campo para garantir vantagem tática, erguendo barreiras e pilares que isolam os inimigos enquanto protege seus aliados menos inteligentes com armaduras de argila. Ele vê o campo de batalha como uma planta baixa que precisa ser corrigida, e os invasores como detritos que devem ser removidos ou soterrados.

Extremamente territoriais, esses seres costumam construir verdadeiras cidadelas subterrâneas ou templos de barro em locais ricos em mana telúrica. Sua presença é frequentemente confundida com a de divindades da terra por tribos locais, devido à sua capacidade de erguer estruturas permanentes em questão de segundos. No entanto, sua natureza é puramente pragmática: ele constrói para dominar, e sua força física é tão avassaladora quanto a própria terra que ele comanda.`,
        type: "Monstro médio, gosma",
        ac: "19",
        hp: "142 (15d10 + 60)",
        speed: "9m, escavação 6m",
        stats: {
            forca: "20 (+5)",
            destreza: "8 (-1)",
            constituicao: "18 (+4)",
            inteligencia: "20 (+5)",
            sabedoria: "14 (+2)",
            carisma: "12 (+1)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Arquiteto de Barro for alvo de dano de Terra ou Esmagamento de origem mágica telúrica, ele não sofre dano. Em vez disso, ele pode restaurar sua armadura natural (ganhando 15 PV temporários) ou recuperar 15 Pontos de Vida."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Elétrico (O barro o aterra), Cego, Envenenado, Exaustão, Caído, Preso, Agarrado."
            },
            {
                nome: "Resistência",
                desc: "Perfurante e Cortante de armas não-mágicas."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Ácido (Corrói a estrutura da argila)."
            },
            {
                nome: "Idiomas",
                desc: "Comum, Terran e Dialeto das Montanhas. Sua voz é profunda e ressoa como pedras se chocando."
            },
            {
                nome: "Mestre de fortificações",
                desc: "Aliados do Caminho Selvagem em um raio de 9 metros do Arquiteto ganham +2 na CA e vantagem em testes de resistência de Força, pois o Arquiteto molda o solo sob seus pés para dar estabilidade."
            },
            {
                nome: "Corpo de ceramica temperada",
                desc: "Sempre que o Arquiteto sofrer dano de Fogo, sua CA aumenta em +1 (máximo de +3) até o final do combate, conforme seu corpo de barro é cozido e endurecido."
            },
            {
                nome: "Monstro de cerco",
                desc: "O Arquiteto causa o dobro de dano a objetos e estruturas."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Arquiteto de Barro realiza dois ataques de Martelo de Terracota ou usa sua habilidade Reestruturação Tectônica."
            },
            {
                nome: "Martelo de terracota",
                desc: "Ataque Corpo a Corpo: +8 para acertar, alcance 3m. Dano: 18 (3d8 + 5) de dano de concussão. O alvo deve passar em uma RES de Força (CD 16) ou será empurrado 3 metros e ficará Caído."
            },
            {
                nome: "Reestruturação Tectonica (Recarga 5t)",
                desc: "O Arquiteto golpeia o solo, fazendo com que pilares de argila endurecida surjam sob seus inimigos em um raio de 9 metros. Até 3 criaturas à escolha do Arquiteto devem passar em uma RES de Destreza (CD 16). Falha: 32 (6d8 + 5) de dano de concussão e a criatura é lançada 4,5 metros para cima, ficando Presa em um pilar de barro que surge do chão. Sucesso: Metade do dano e não fica presa."
            }
        ],
        sentidos: {
            percepcaoPassiva: "12",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Pedra Angular Senciente"
            },
            {
                range: "2",
                item: "Geodo Coração da Terra"
            },
            {
                range: "3",
                item: "Selo do Construtor Alquímico"
            },
            {
                range: "4",
                item: "Pó de Barro Primordial"
            }
        ]
    },
    pulsoDeSilicio: {
        name: "Pulso de silício",
        rarity: "Raro",
        icon: "https://i.imgur.com/FmRF7WT.png",
        image: "https://i.imgur.com/jr9eunN.jpeg",
        subtitle: "CR 8",
        description: `O Pulso de Silício é o ápice da evolução tática e cognitiva entre as criaturas elementais. Ao atingir o nível 10, o antigo Slime Magnético deixa de ser um simples condutor de energia para se tornar um computador biológico vivo. Sua forma assume uma silhueta humanoide atlética e imponente, envolta em placas de silício flutuantes que funcionam tanto como armadura quanto como unidades de processamento externo para sua mente vasta.

A inteligência de um Pulso de Silício é fria, lógica e extremamente rápida. Ele não apenas comanda grupos de slimes selvagens; ele os conecta em uma rede neural, agindo como o núcleo de processamento que coordena cada movimento com precisão de milissegundos. No campo de batalha, ele é capaz de ler os impulsos elétricos nos nervos de seus oponentes, antecipando golpes antes mesmo que o atacante os execute.

Ele prefere locais com alta concentração de minerais condutores ou ruínas de civilizações antigas que possuam tecnologia esquecida. Onde um Pulso de Silício se estabelece, o ambiente se torna hostil para qualquer coisa metálica: armas são arrancadas das mãos, armaduras se tornam prisões magnéticas e a própria eletricidade estática no ar se torna uma arma mortal. Enfrentar um Pulso de Silício é como tentar lutar contra um sistema operacional que já calculou todas as suas chances de vitória e as reduziu a zero.`,
        type: "Monstro médio, gosma",
        ac: "17",
        hp: "110 (17d8 + 34)",
        speed: "9m, flutuar 12m",
        stats: {
            forca: "8 (-1)",
            destreza: "20 (+5)",
            constituicao: "14 (+2)",
            inteligencia: "24 (+7)",
            sabedoria: "16 (+3)",
            carisma: "14 (+2)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Pulso de Silício for alvo de dano Elétrico, ele não sofre dano. Em vez disso, ele processa essa energia para sobrecarregar seus circuitos, ganhando uma ação bônus adicional em seu próximo turno e recuperando 15 Pontos de Vida."
            },
            {
                nome: "Imunidade",
                desc: "Elétrico, Veneno, Psíquico (Sua mente é digitalizada), Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Enfeitiçado."
            },
            {
                nome: "Resistência",
                desc: "Cortante, Perfurante e Concussão de armas não-mágicas."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Terra (O aterramento dissipa sua coesão)."
            },
            {
                nome: "Idiomas",
                desc: "Todos os idiomas conhecidos pelas criaturas em um raio de 18 metros, Telepatia Digital 36 metros."
            },
            {
                nome: "Rede neural de comando",
                desc: "Slimes do Caminho Selvagem a até 18 metros do Pulso de Silício compartilham seus sentidos com ele. Se um deles vir um inimigo, o Pulso de Silício também o vê. Além disso, esses slimes podem usar o modificador de Inteligência do Pulso de Silício para seus testes de resistência mentais."
            },
            {
                nome: "Campo de distorção estática",
                desc: "Projéteis metálicos (flechas com ponta de ferro, facas, etc.) que entrarem em um raio de 3 metros do Pulso de Silício têm desvantagem nas jogadas de ataque devido à forte repelência magnética."
            },
            {
                nome: "Processamento paralelo",
                desc: "O Pulso de Silício pode manter a concentração em duas magias ou habilidades diferentes simultaneamente. Se ele sofrer dano, faz apenas um teste de resistência de Constituição para manter ambas."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Pulso de Silício realiza três ataques de Descarga de Fótons ou usa sua habilidade Sobrecarga Sináptica."
            },
            {
                nome: "Descarga de fótons",
                desc: "Ataque à Distância Mágico: +10 para acertar, alcance 27m. Dano: 16 (2d8 + 7) de dano elétrico. Se o alvo estiver usando armadura de metal, a jogada de ataque tem vantagem."
            },
            {
                nome: "Sobrecarga Sináptica (Recarga 5t)",
                desc: "O Pulso envia um código de erro diretamente para o sistema nervoso de até 3 criaturas que ele possa ver a até 18 metros. Os alvos devem passar em uma RES de Inteligência (CD 18). Falha: 31 (7d8) de dano psíquico e a criatura fica Atordoada até o final do próximo turno do Pulso de Silício. Sucesso: Metade do dano e não fica atordoada."
            }
        ],
        sentidos: {
            percepcaoPassiva: "13",
            visaoEscuro: "36m"
        },
        drops: [
            {
                range: "1",
                item: "Placa de Circuito Orgânico"
            },
            {
                range: "2",
                item: "Filamento de Cobre Vivo"
            },
            {
                range: "3",
                item: "Núcleo de Processamento Vítreo"
            },
            {
                range: "4",
                item: "Capacitor de Estática Pura"
            }
        ]
    },
    automatoFluido: {
        name: "Autômato fluído",
        rarity: "Raro",
        icon: "https://i.imgur.com/xdMsPd9.png",
        image: "https://i.imgur.com/pS195eL.jpeg",
        subtitle: "CR 8",
        description: `O Autômato Fluído é a culminação da maestria sobre a forma física e a lógica de combate. Diferente do Slime de Latão, que possuía uma estrutura mais rígida e limitada, o Autômato atingiu um estado de metal líquido perfeitamente controlado por uma mente processadora superior. Sua aparência lembra uma escultura de mercúrio vivo adornada com veios de latão polido, movendo-se com uma graça silenciosa que desmente seu peso massivo e densidade molecular.

Como um líder nato do caminho intelectual, ele não luta por instinto, mas por pura eficiência tática. Ele é capaz de analisar o estilo de combate de um oponente em frações de segundo, moldando seus membros em lâminas perfeitamente equilibradas ou martelos de impacto pesado para explorar fraquezas específicas na armadura ou na guarda do inimigo. Sua presença em uma colônia de slimes metálicos transforma um grupo desorganizado em uma falange coordenada e impenetrável, onde ele atua como o oficial comandante.

Aventureiros que sobrevivem a um encontro com um Autômato Fluído descrevem a sensação aterrorizante de lutar contra um oponente que não pode ser cortado ou quebrado, pois o metal líquido simplesmente flui ao redor das armas e se regenera instantaneamente. Ele não demonstra emoção, fúria ou cansaço, mantendo uma determinação fria e calculista até que o objetivo seja alcançado ou a ameaça seja totalmente eliminada.`,
        type: "Monstro médio, constructo",
        ac: "20",
        hp: "136 (16d8 + 64)",
        speed: "9m, natação 9m",
        stats: {
            forca: "20 (+5)",
            destreza: "14 (+2)",
            constituicao: "18 (+4)",
            inteligencia: "22 (+6)",
            sabedoria: "14 (+2)",
            carisma: "12 (+1)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Autômato Fluído for alvo de dano de Concussão, ele não sofre dano. Em vez disso, ele absorve a energia do impacto, ganhando vantagem em sua próxima jogada de ataque e recuperando 15 Pontos de Vida."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Psíquico, Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Petrificado, Paralisado."
            },
            {
                nome: "Resistência",
                desc: "Cortante e Perfurante de armas não-mágicas; Fogo, Frio, Elétrico."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Ácido (Corrói a liga metálica)."
            },
            {
                nome: "Idiomas",
                desc: "Comum, Dialeto das Máquinas e Telepatia 18 metros. Sua voz soa como o atrito de metais polidos."
            },
            {
                nome: "Forma de mercurio",
                desc: "O Autômato pode se mover através de um espaço de até 2,5 centímetros de largura sem se espremer. Ele não provoca ataques de oportunidade ao se mover, pois sua forma flui ao redor das armas inimigas."
            },
            {
                nome: "Arsenal integrado",
                desc: "O Autômato pode transformar seus membros em qualquer ferramenta artesanal ou arma simples/marcial como uma ação bônus. Ele é considerado proficiente com qualquer arma que crie desta forma."
            },
            {
                nome: "Cálculo de trajetória",
                desc: "Aliados do Caminho Selvagem a até 9 metros do Autômato recebem um bônus de +2 em suas jogadas de dano, pois o Autômato emite sinais sonoros que indicam os pontos vitais dos inimigos."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Autômato Fluído realiza três ataques de Lâmina de Liga ou usa sua habilidade Esmagamento Hidráulico."
            },
            {
                nome: "Lâmina de liga",
                desc: "Ataque Corpo a Corpo: +9 para acertar, alcance 3m. Dano: 14 (2d8 + 5) de dano cortante. Se o alvo for uma criatura, ela deve passar em uma RES de Constituição (CD 17) ou sofrerá 3 (1d6) de dano extra no início de cada um de seus turnos por sangramento metálico (feridas que não fecham facilmente)."
            },
            {
                nome: "Esmagamento hidraulico (Recarga 5t)",
                desc: "O Autômato transforma parte de seu corpo em uma prensa maciça e golpeia o chão. Cada criatura em um raio de 4,5 metros deve passar em uma RES de Força (CD 17). Falha: 36 (8d8) de dano de concussão e a criatura fica Caída e Atordoada até o final do próximo turno do Autômato. Sucesso: Metade do dano e não sofre as condições."
            }
        ],
        sentidos: {
            percepcaoPassiva: "12",
            visaoEscuro: "18m"
        },
        drops: [
            {
                range: "1",
                item: "Núcleo de Mercúrio Estável"
            },
            {
                range: "2",
                item: "Pistão Alquímico de Latão"
            },
            {
                range: "3",
                item: "Óleo de Transmissão Pensante"
            },
            {
                range: "4",
                item: "Placa de Aço Líquido Temperado"
            }
        ]
    },
    espectroDeEctoplasma: {
        name: "Espectro de ectoplasma",
        rarity: "Raro",
        icon: "https://i.imgur.com/1EMfnpe.png",
        image: "https://i.imgur.com/MrJ2muE.jpeg",
        subtitle: "CR 8",
        description: `O Espectro de Ectoplasma é o ápice da ascensão de um Slime das Sombras que abandonou completamente a necessidade de uma âncora material. Ao atingir o nível 10, esta entidade transcende o plano físico, tornando-se uma criatura puramente espiritual composta de ectoplasma de alta densidade e pura energia abissal. No caminho intelectual, ela assume uma silhueta feminina imponente e espectral, quase como uma rainha esquecida de um reino de desolação, usando sua aparência para exalar autoridade e medo.

Sua inteligência é vasta, fria e focada na dominação tática através da necromancia e do terror. Ela atua como a Tecelã de Almas, coordenando vastas hordas de slimes selvagens e outros mortos-vivos menores como uma mente de colmeia. Onde ela flutua, a temperatura cai instantaneamente para níveis congelantes, e o próprio ar se torna pesado com os sussurros psíquicos de suas vítimas passadas, cujos rostos angunstiados podem ser vistos vagando dentro de sua forma translúcida.

Em combate, ela é uma estrategista implacável que prefere manipular o campo de batalha de uma posição segura. Ela utiliza suas correntes etéreas para imobilizar e drenar a vida dos guerreiros mais fortes, enquanto sua presença desoladora quebra a moral dos conjuradores. Ela não deseja apenas a morte de seus oponentes, mas a erradicação de sua existência e a adição de suas almas à sua legião fantasma pessoal.`,
        type: "Monstro médio, espectro",
        ac: "16",
        hp: "110 (17d8 + 34)",
        speed: "0m, voo 12m",
        stats: {
            forca: "6 (-2)",
            destreza: "18 (+4)",
            constituicao: "14 (+2)",
            inteligencia: "22 (+6)",
            sabedoria: "18 (+4)",
            carisma: "20 (+5)"
        },
        habilidades: [
            {
                nome: "Absorção",
                desc: "Sempre que o Espectro de Ectoplasma for alvo de dano Necrótico ou Gélido, ele não sofre dano. Em vez disso, ele pode usar sua reação para se tornar invisível até o final do seu próximo turno e recuperar 15 Pontos de Vida."
            },
            {
                nome: "Imunidade",
                desc: "Veneno, Necrótico, Gélido; Concussão, Perfurante e Cortante de ataques não-mágicos, Cego, Envenenado, Exaustão, Caído, Preso, Agarrado, Paralisado, Petrificado."
            },
            {
                nome: "Resistência",
                desc: "Ácido, Fogo, Trovão; Psíquico."
            },
            {
                nome: "Vulnerabilidade",
                desc: "Radiante."
            },
            {
                nome: "Idiomas",
                desc: "Entende todos os idiomas, mas se comunica apenas via Telepatia Sombria (18 metros). Sua voz mental soa como múltiplos sussurros sobrepostos."
            },
            {
                nome: "Mestre de marionetes etéreas",
                desc: "Slimes do Caminho Selvagem a até 18 metros do Espectro ganham a habilidade de Movimento Incorpóreo (podem passar por criaturas e objetos como se fossem terreno difícil). Além disso, eles causam 1d6 de dano necrótico adicional em seus ataques."
            },
            {
                nome: "Presença desoladora",
                desc: "Criaturas inimigas que comecem o turno a até 6 metros do Espectro devem passar em uma RES de Sabedoria (CD 16) ou ficarão Aterrorizadas até o início do próximo turno do Espectro. Enquanto aterrorizadas, a velocidade delas é reduzida a 0."
            },
            {
                nome: "Vazio cognitivo",
                desc: "O Espectro é imune a qualquer efeito que tente ler suas emoções ou pensamentos. Qualquer criatura que tente contato mental com o Espectro sofre 10 (3d6) de dano psíquico."
            }
        ],
        acoes: [
            {
                nome: "Multiataque",
                desc: "O Espectro de Ectoplasma realiza dois ataques de Toque do Além ou usa sua habilidade Corrente de Almas."
            },
            {
                nome: "Toque do além",
                desc: "Corpo a Corpo Mágico: +9 para acertar, alcance 1m. Dano: 13 (2d6 + 6) de dano necrótico mais 7 (2d6) de dano gélido. O alvo deve passar em uma RES de Constituição (CD 16) ou terá seu máximo de Pontos de Vida reduzido em um valor igual ao dano necrótico sofrido. Esta redução dura até um descanso longo."
            },
            {
                nome: "Corrente de almas (Recarga 5t)",
                desc: "O Espectro dispara correntes de ectoplasma translúcido em até 3 criaturas a até 9 metros. Cada alvo deve passar em uma RES de Carisma (CD 16). Falha: 28 (8d6) de dano necrótico e o Espectro drena a energia vital, ganhando 10 pontos de vida temporários por cada falha. A criatura fica Impedida enquanto a corrente persistir (o Espectro deve manter concentração). Sucesso: Metade do dano e não fica impedida."
            }
        ],
        sentidos: {
            percepcaoPassiva: "14",
            visaoEscuro: "36m, visão etérea 9m"
        },
        drops: [
            {
                range: "1",
                item: "Ectoplasma Estabilizado"
            },
            {
                range: "2",
                item: "Fragmento de Núcleo de Alma"
            },
            {
                range: "3",
                item: "Manto de Névoa Funesta"
            },
            {
                range: "4",
                item: "Olho de Observador Espectral"
            }
        ]
    }
};

export default MonsterDB;
