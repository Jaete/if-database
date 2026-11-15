# Itens — preview da Fase 0

> Gerado por `scripts/importItems.ts`. **Nada foi gravado no banco.**

## Resumo

| Fonte                | Categorias | Itens                          |
| -------------------- | ---------- | ------------------------------ |
| Loja de Armas (t17)  | 19         | 155                            |
| Armaduras (t18)      | 4          | 32                             |
| Itens (t20)          | 6          | 75                             |
| Lojas Diversas (t24) | 4          | 102                            |
| Livraria (t53)       | 1          | 6                              |
| Efeitos (t280)       | 5 seções   | 282 entradas, 226 nomes únicos |
| Itens do app         | —          | 1                              |
| **Avisos**           |            | 28                             |

## Loja de Armas (t17)

### Arcos — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem43.png

> Arcos curtos ou longos requerem força e paciência para serem dominados com maestria, mas assim que o personagem aprende seus dentros e foras, sua habilidade de causar dano à distância pode se provar muito valoroso em muitas situações. Os Arcos ocupam ambos os Slots para Arma e Escudos e são considerados como sendo Ataque à Distância.

tipo: weapon · duas mãos (ocupa ambos os slots): sim · propriedades: Distância: 45m a 182m; Acuidade

| Nome         | Slug           | Tipo   | Tier (raw) | Preço | Disp. | Dano           | CA  | Alvo | Duas mãos | Extra             | Efeitos                                                                                                                          | Texto do efeito | Descrição / conteúdo |
| ------------ | -------------- | ------ | ---------- | ----- | ----- | -------------- | --- | ---- | --------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------- |
| Longbow      | `longbow`      | weapon | F          | 150   | 93%   | 1d12 + dex     | —   | —    | sim       | —                 | —                                                                                                                                | —               | —                    |
| Silver Bow   | `silver-bow`   | weapon | E          | 550   | 87%   | 1d12 + dex + 1 | —   | —    | sim       | alcanceExtra: +1m | —                                                                                                                                | —               | —                    |
| Thorn Bow    | `thorn-bow`    | weapon | D          | 1100  | 81%   | 1d12 + dex + 2 | —   | —    | sim       | alcanceExtra: +2m | —                                                                                                                                | —               | —                    |
| Nail Bow     | `nail-bow`     | weapon | C          | 1450  | 72%   | 1d12 + dex + 3 | —   | —    | sim       | alcanceExtra: +3m | —                                                                                                                                | —               | —                    |
| Power Bow    | `power-bow`    | weapon | B          | 3700  | 62%   | 1d12 + dex + 4 | —   | —    | sim       | alcanceExtra: +4m | **Estrondosa** `efeitosRanged.estrondosa` → Em acertos críticos, causa 1d8 de dano não elemental adicional (2d8 se o multip…     | Estrondosa      | —                    |
| Fey Bow      | `fey-bow`      | weapon | A          | 4700  | 53%   | 1d12 + dex + 5 | —   | —    | sim       | alcanceExtra: +5m | **Caótica** `efeitosRanged.caotica` → É considerada alinhada com o Caos. Causa +2d6 de dano adicional contra criatura…           | Caótica         | —                    |
| Crescent Bow | `crescent-bow` | weapon | S          | 6600  | 44%   | 1d12 + dex + 6 | —   | —    | sim       | alcanceExtra: +6m | **Caçadora** `efeitosRanged.cacadora` → Adiciona o bônus de aprimoramento em testes de Sobrevivência para rastrear cria…         | Caçadora        | —                    |
| Killer Bow   | `killer-bow`   | weapon | S          | 6600  | 44%   | 1d12 + dex + 6 | —   | —    | sim       | alcanceExtra: +6m | **Perseguidora** `efeitosRanged.perseguidora` → Permite estudar um alvo com uma ação padrão. A cada rodada estudando, adiciona … | Perseguidora    | —                    |

### Armas de Haste — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem44.png

> O princípio básico por trás de uma Arma de Haste é a habilidade de infligir dano a uma distância razoável em um combate corpo a corpo. Para este fim, as Armas de Haste consistem em uma extensão de madeira ou metal de 1,5 a 2m de comprimento, com uma pesada lâmina na sua extremidade. Ocupam ambos os Slots para Arma e Escudo. Alcance: Todos os ranks tem alcance de 2m

tipo: weapon · duas mãos (ocupa ambos os slots): sim · propriedades: Alcance; Duas Mãos; Pesada

| Nome          | Slug            | Tipo   | Tier (raw) | Preço | Disp. | Dano          | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                                      | Texto do efeito     | Descrição / conteúdo |
| ------------- | --------------- | ------ | ---------- | ----- | ----- | ------------- | --- | ---- | --------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | -------------------- |
| Iron Spear    | `iron-spear`    | weapon | F          | 150   | 93%   | 2d9 + str     | —   | —    | sim       | —     | —                                                                                                                                            | —                   | —                    |
| Slash Lance   | `slash-lance`   | weapon | E          | 550   | 87%   | 2d9 + str + 1 | —   | —    | sim       | —     | —                                                                                                                                            | —                   | —                    |
| Mythril Pike  | `mythril-pike`  | weapon | D          | 1100  | 81%   | 2d9 + str + 2 | —   | —    | sim       | —     | —                                                                                                                                            | —                   | —                    |
| Gold Lance    | `gold-lance`    | weapon | C          | 1450  | 72%   | 2d9 + str + 3 | —   | —    | sim       | —     | —                                                                                                                                            | —                   | —                    |
| Shout Spear   | `shout-spear`   | weapon | B          | 3700  | 62%   | 2d9 + str + 4 | —   | —    | sim       | —     | **Explosão Trovejante** `efeitosMelee.explosaoTrovejante` → A arma causa +1d6 de dano de vento normalmente e +1d10 de dano de vento em acer… | Explosão Trovejante | —                    |
| Viper Halberd | `viper-halberd` | weapon | A          | 4700  | 53%   | 2d9 + str + 5 | —   | —    | sim       | —     | **Injetora** `efeitosMelee.injetora` → Armazena até 3 doses de veneno de contato. Pode aplicar 1 dose como ação bônus.                       | Injetora            | —                    |
| Javelin       | `javelin`       | weapon | S          | 6600  | 44%   | 2d9 + str + 6 | —   | —    | sim       | —     | **Arremesso** `efeitosMelee.arremesso` → Concede à arma corpo a corpo um alcance de 3 metros, podendo ser arremessada po…                    | Arremesso           | —                    |
| Partisan      | `partisan`      | weapon | S          | 6600  | 44%   | 2d9 + str + 6 | —   | —    | sim       | —     | **Corajosa** `efeitosMelee.corajosa` → Essa habilidade só pode ser adicionada a armas corpo a corpo. Uma arma corajosa…                      | Corajosa            | —                    |

### Bastardas — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem45.png

> Conhecida normalmente como as Espadas dos Cavaleiros, elas são maiores e mais pesadas que as demais espadas. Bastardas não são tão elegantes, mas são poderosas armas cujo peso exige um considerável esforço por parte do manejador para utilizá-las com algum sucesso. As Bastardas ocupam ambos os Slots para Armas e Escudos. Alcance: Todos os ranks tem alcance de 2m

tipo: weapon · duas mãos (ocupa ambos os slots): sim · propriedades: Alcance; Duas mãos; Pesada

| Nome           | Slug             | Tipo   | Tier (raw) | Preço | Disp. | Dano          | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                             | Texto do efeito | Descrição / conteúdo |
| -------------- | ---------------- | ------ | ---------- | ----- | ----- | ------------- | --- | ---- | --------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------- |
| Iron Sword     | `iron-sword`     | weapon | F          | 150   | 93%   | 3d6 + str     | —   | —    | sim       | —     | —                                                                                                                                   | —               | —                    |
| Buster Sword   | `buster-sword`   | weapon | E          | 550   | 87%   | 3d6 + str + 1 | —   | —    | sim       | —     | —                                                                                                                                   | —               | —                    |
| Mythril Blade  | `mythril-blade`  | weapon | D          | 1100  | 81%   | 3d6 + str + 2 | —   | —    | sim       | —     | —                                                                                                                                   | —               | —                    |
| Hard Edge      | `hard-edge`      | weapon | C          | 1450  | 72%   | 3d6 + str + 3 | —   | —    | sim       | —     | —                                                                                                                                   | —               | —                    |
| Butterfly Edge | `butterfly-edge` | weapon | B          | 3700  | 62%   | 3d6 + str + 4 | —   | —    | sim       | —     | **Desconcertador** `efeitosMelee.desconcertador` → Em um crítico, o usuário pode tentar desarmar, reposicionar, quebrar ou derruba… | Desconcertador  | —                    |
| Ogre Nix       | `ogre-nix`       | weapon | A          | 4700  | 53%   | 3d6 + str + 5 | —   | —    | sim       | —     | **Furioso** `efeitosMelee.furioso` → Enquanto estiver em fúria, a arma conta como se tivesse bônus de aprimoramento …               | Furioso         | —                    |
| Defender       | `defender`       | weapon | S          | 6600  | 44%   | 3d6 + str + 6 | —   | —    | sim       | —     | **Guardião** `efeitosMelee.guardiao` → Permite transferir o bônus de aprimoramento da arma para os testes de resistênc…             | Guardião        | —                    |
| Crystal Sword  | `crystal-sword`  | weapon | S          | 6600  | 44%   | 3d6 + str + 6 | —   | —    | sim       | —     | **Planar** `efeitosMelee.planar` → Ignora 5 pontos de Redução de Dano de criaturas extraplanares.                                   | Planar          | —                    |

### Bastões — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem49.png

> A arma preferida dos Magos Negros. Bastões são menores que Cajados e podem ser manejados com uma única mão, sendo que o peso de sua extremidade atua como uma sólida e esmagadora arma. Como os Cajados, a maioria dos Bastões contêm propriedades mágicas inatas que podem ser focalizadas e liberadas por um adepto da magia bem treinado.

tipo: weapon · duas mãos (ocupa ambos os slots): não · propriedades: Mágico; Duas Mãos

| Nome            | Slug              | Tipo   | Tier (raw) | Preço | Disp. | Dano          | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                           | Texto do efeito | Descrição / conteúdo |
| --------------- | ----------------- | ------ | ---------- | ----- | ----- | ------------- | --- | ---- | --------- | ----- | --------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------- |
| Rod of Darkness | `rod-of-darkness` | weapon | F          | 150   | 93%   | 2d6 + str     | —   | —    | não       | —     | —                                                                                                                                 | —               | —                    |
| Rune Rod        | `rune-rod`        | weapon | E          | 550   | 87%   | 2d6 + str + 1 | —   | —    | não       | —     | —                                                                                                                                 | —               | —                    |
| Rod of silence  | `rod-of-silence`  | weapon | D          | 1100  | 81%   | 2d6 + str + 2 | —   | —    | não       | —     | —                                                                                                                                 | —               | —                    |
| Firewheel Rod   | `firewheel-rod`   | weapon | C          | 1450  | 72%   | 2d6 + str + 3 | —   | —    | não       | —     | —                                                                                                                                 | —               | —                    |
| Entangling Rod  | `entangling-rod`  | weapon | B          | 3700  | 62%   | 2d6 + str + 4 | —   | —    | não       | —     | **Ancoradora** `efeitosMelee.ancoradora` → Permite prender o alvo no lugar, impedindo que ele se mova.                            | Ancoradora      | —                    |
| Water Rod       | `water-rod`       | weapon | A          | 4700  | 53%   | 2d6 + str + 5 | —   | —    | não       | —     | **Jato d’Água** `efeitosRanged.jatoDagua` → A arma causa +1d6 de dano de água.                                                    | Jato d’Água     | —                    |
| Death Wand      | `death-wand`      | weapon | S          | 6600  | 44%   | 2d6 + str + 6 | —   | —    | não       | —     | **Cruel** `efeitosMelee.cruel` → Faz com que criaturas sob efeito de medo fiquem enjoadas por 1 rodada. O portad…                 | Cruel           | —                    |
| Gravity Rod     | `gravity-rod`     | weapon | S          | 6600  | 44%   | 2d6 + str + 6 | —   | —    | não       | —     | **Gravitacional** `efeitosMelee.gravitacional` → A arma com este encantamento pode causar um aumento de peso gravitacional em se… | Gravitacional   | —                    |

### Bestas — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem47.png

> As bestas trocam o poder do músculo de suas compatriotas de menos tecnologia pela força mecânica, disparando uma simples seta com velocidade suficiente para penetrar uma armadura. Embora compacta, o tempo do procedimento de recarga torna esta arma mais adequada a experts. Bestas são consideradas como arma de ataque à distância.

tipo: weapon · duas mãos (ocupa ambos os slots): não · propriedades: Distância: 9m a 36m; Leve; Recarga: Após 1 disparo; Munição

| Nome           | Slug             | Tipo   | Tier (raw) | Preço | Disp. | Dano           | CA  | Alvo | Duas mãos | Extra             | Efeitos                                                                                                                                                  | Texto do efeito           | Descrição / conteúdo |
| -------------- | ---------------- | ------ | ---------- | ----- | ----- | -------------- | --- | ---- | --------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | -------------------- |
| Bow Gun        | `bow-gun`        | weapon | F          | 150   | 93%   | 1d10 + dex     | —   | —    | não       | —                 | —                                                                                                                                                        | —                         | —                    |
| Power Crossbow | `power-crossbow` | weapon | E          | 550   | 87%   | 1d10 + dex + 1 | —   | —    | não       | alcanceExtra: +1m | —                                                                                                                                                        | —                         | —                    |
| Night Killer   | `night-killer`   | weapon | D          | 1100  | 81%   | 1d10 + dex + 2 | —   | —    | não       | alcanceExtra: +2m | —                                                                                                                                                        | —                         | —                    |
| Hunting Bow    | `hunting-bow`    | weapon | C          | 1450  | 72%   | 1d10 + dex + 3 | —   | —    | não       | alcanceExtra: +3m | —                                                                                                                                                        | —                         | —                    |
| Cranequin      | `cranequin`      | weapon | B          | 3700  | 62%   | 1d10 + dex + 4 | —   | —    | não       | alcanceExtra: +4m | **Confiável** `efeitosRanged.confiavel` → Ao conseguir uma falha critica com a arma, rola 1d6, se tirar 5 ou mais a falha…                               | Confiável                 | —                    |
| Gale Bow       | `gale-bow`       | weapon | A          | 4700  | 53%   | 1d10 + dex + 5 | —   | —    | não       | alcanceExtra: +5m | **Tempestade** `efeitosRanged.tempestade` → Causa +1d6 de dano de vento para cada nível de aprimoramento da arma                                         | Tempestade                | —                    |
| Zamburak       | `zamburak`       | weapon | S          | 6600  | 44%   | 1d10 + dex + 6 | —   | —    | não       | alcanceExtra: +6m | **Ameaça Crítica Aprimorada** `efeitosGerais.ameacaCriticaAprimorada` → Aumenta a margem de ameaça crítica da arma em 1(19 = critico). Pode ser selecio… | Ameaça Crítica Aprimorada | —                    |
| Marduk         | `marduk`         | weapon | S          | 6600  | 44%   | 1d10 + dex + 6 | —   | —    | não       | alcanceExtra: +6m | **Redimida** `efeitosRanged.redimida` → Funciona como uma arma sagrada, causando +2d6 de dano contra criaturas malignas…                                 | Redimida                  | —                    |

### Boomerang — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem48.png

> Chackrans, boomerangs e todo tipo de shurikens são excelentes armas de arremesso, com bom alcance e com a vantagem de sempre retornam para seu lançador não importa a distância atirada. Boomerangs são considerados como armas de ataque a distancia. Se uma ação de ataque com este tipo de arma falha, o atacante pode tentar rolar novamente para ver se o boomerang acerta seu alvo quando ele for retorna…

tipo: weapon · duas mãos (ocupa ambos os slots): não · propriedades: Distância: 9m a 36m; Especial (Bumerangue)

| Nome            | Slug              | Tipo   | Tier (raw) | Preço | Disp. | Dano          | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                               | Texto do efeito   | Descrição / conteúdo |
| --------------- | ----------------- | ------ | ---------- | ----- | ----- | ------------- | --- | ---- | --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------- |
| Boomerang       | `boomerang`       | weapon | F          | 150   | 93%   | 1d8 + str     | —   | —    | não       | —     | —                                                                                                                                     | —                 | —                    |
| Platoon Edge    | `platoon-edge`    | weapon | E          | 550   | 87%   | 1d8 + str + 1 | —   | —    | não       | —     | —                                                                                                                                     | —                 | —                    |
| Chakram         | `chakram`         | weapon | D          | 1100  | 81%   | 1d8 + str + 2 | —   | —    | não       | —     | —                                                                                                                                     | —                 | —                    |
| Full Moon       | `full-moon`       | weapon | C          | 1450  | 72%   | 1d8 + str + 3 | —   | —    | não       | —     | —                                                                                                                                     | —                 | —                    |
| Pinwheel        | `pinwheel`        | weapon | B          | 3700  | 62%   | 1d8 + str + 4 | —   | —    | não       | —     | **Vento Favorável** `efeitosRanged.ventoFavoravel` → Funciona de forma semelhante ao feitiço rajada de vento. Anula penalidades de a… | Vento Favorável   | —                    |
| Hawkeye         | `hawkeye`         | weapon | A          | 4700  | 53%   | 1d8 + str + 5 | —   | —    | não       | —     | **Desviadora** `efeitosRanged.desviadora` → Ignora o bônus de CA do alvo proveniente de cobertura parcial e reduz em 2 o bô…          | Desviadora        | —                    |
| Crescent        | `crescent`        | weapon | S          | 6600  | 44%   | 1d8 + str + 6 | —   | —    | não       | —     | **Alcance Estendido** `efeitosRanged.alcanceEstendido` → Dobra o incremento de alcance da arma.                                       | Alcance Estendido | —                    |
| Spiral Shuriken | `spiral-shuriken` | weapon | S          | 6600  | 44%   | 1d8 + str + 6 | —   | —    | não       | —     | **Furacão** `efeitosRanged.furacao` → Causa +1d6 de dano de vento adicional. Em caso de acerto crítico, causa +1d10 d…                | Furacão           | —                    |

### Cajados — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem46.png

> Feito de Madeira ou metal, um Cajado pode infligir uma quantia de dano considerável se utilizado por um usuário treinado. Na sua maioria contêm uma pequena quantia de magia que pode ser liberada por um mago. Quando calculando o dano para Cajados, usa-se o valor de Força ou Sabedoria, aquele que for mais alto. Cajados utilizam ambos os Slots para Armas e Escudos.

tipo: weapon · duas mãos (ocupa ambos os slots): sim · propriedades: Mágico

| Nome           | Slug             | Tipo   | Tier (raw) | Preço | Disp. | Dano                       | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                               | Texto do efeito  | Descrição / conteúdo |
| -------------- | ---------------- | ------ | ---------- | ----- | ----- | -------------------------- | --- | ---- | --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | -------------------- |
| Oak Staff      | `oak-staff`      | weapon | F          | 150   | 93%   | 1d8 + str\|wis (maior)     | —   | —    | sim       | —     | —                                                                                                                                     | —                | —                    |
| Battle Staff   | `battle-staff`   | weapon | E          | 550   | 87%   | 1d8 + str\|wis (maior) + 1 | —   | —    | sim       | —     | —                                                                                                                                     | —                | —                    |
| Mythril Staff  | `mythril-staff`  | weapon | D          | 1100  | 81%   | 1d8 + str\|wis (maior) + 2 | —   | —    | sim       | —     | —                                                                                                                                     | —                | —                    |
| Gold Staff     | `gold-staff`     | weapon | C          | 1450  | 72%   | 1d8 + str\|wis (maior) + 3 | —   | —    | sim       | —     | —                                                                                                                                     | —                | —                    |
| Power Staff    | `power-staff`    | weapon | B          | 3700  | 62%   | 1d8 + str\|wis (maior) + 4 | —   | —    | sim       | —     | **Esmagadora** `efeitosMelee.esmagadora` → A arma causa +2d6 de dano adicional a objetos inanimados, inclusive ao realizar…           | Esmagadora       | —                    |
| Striking Staff | `striking-staff` | weapon | A          | 4700  | 53%   | 1d8 + str\|wis (maior) + 5 | —   | —    | sim       | —     | **Nascida da Fúria** `efeitosMelee.nascidaDaFuria` → A cada vez que o usuário causa dano a um oponente, o bônus de aprimoramento da … | Nascida da Fúria | —                    |
| White Staff    | `white-staff`    | weapon | S          | 6600  | 44%   | 1d8 + str\|wis (maior) + 6 | —   | —    | sim       | —     | **Surto Vital** `efeitosMelee.surtoVital` → Concede o bônus de aprimoramento nos testes de resistência contra efeitos necró…          | Surto Vital      | —                    |
| Prism Staff    | `prism-staff`    | weapon | S          | 6600  | 44%   | 1d8 + str\|wis (maior) + 6 | —   | —    | sim       | —     | **Invisível** `efeitosMelee.invisivel` → Torna a arma invisível. O primeiro ataque em combate nega o bônus de Destreza à…             | Invisível        | —                    |

### Espadas — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem50.png

> A arma escolhida pelos aventureiros de todos os lugares. Embora elas possam aparecer de várias formas e tamanhos, a humilde Espada Longa é com certeza a mais utilizada; a penetrante lâmina e a versatilidade destas armas contam muito na sua popularidade.

tipo: weapon · duas mãos (ocupa ambos os slots): não · propriedades: Versátil (2d6)

| Nome           | Slug             | Tipo   | Tier (raw) | Preço | Disp. | Dano           | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                         | Texto do efeito | Descrição / conteúdo |
| -------------- | ---------------- | ------ | ---------- | ----- | ----- | -------------- | --- | ---- | --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------- |
| Short Sword    | `short-sword`    | weapon | F          | 150   | 93%   | 1d10 + str     | —   | —    | não       | —     | —                                                                                                                               | —               | —                    |
| Long Sword     | `long-sword`     | weapon | E          | 550   | 87%   | 1d10 + str + 1 | —   | —    | não       | —     | —                                                                                                                               | —               | —                    |
| Mythril Sword  | `mythril-sword`  | weapon | D          | 1100  | 81%   | 1d10 + str + 2 | —   | —    | não       | —     | —                                                                                                                               | —               | —                    |
| Regal Cutlass  | `regal-cutlass`  | weapon | C          | 1450  | 72%   | 1d10 + str + 3 | —   | —    | não       | —     | —                                                                                                                               | —               | —                    |
| Vigilante      | `vigilante`      | weapon | B          | 3700  | 62%   | 1d10 + str + 4 | —   | —    | não       | —     | **Defensiva** `efeitosMelee.defensiva` → Permite transferir o bônus de aprimoramento da arma para a CA como ação livre, …       | Defensiva       | —                    |
| Falchion       | `falchion`       | weapon | A          | 4700  | 53%   | 1d10 + str + 5 | —   | —    | não       | —     | **Sangrenta** `efeitosMelee.sangrenta` → Aplica o status de Sangramento a cada golpe, de forma cumulativa a cada acerto …       | Sangrenta       | —                    |
| Diamond Sword  | `diamond-sword`  | weapon | S          | 6600  | 44%   | 1d10 + str + 6 | —   | —    | não       | —     | **Impenetrável** `efeitosMelee.impenetravel` → Uma arma impenetrável é protegida contra danos e deterioração. Armas metálicas … | Impenetrável    | —                    |
| Platinum Sword | `platinum-sword` | weapon | S          | 6600  | 44%   | 1d10 + str + 6 | —   | —    | não       | —     | **Fortuito** `efeitosMelee.fortuito` → Quando essa arma acerta um inimigo com um ataque de oportunidade, o usuário pod…         | Fortuito        | —                    |

### Facas — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem51.png

> As facas medem entre 20 a 38 cm e podem ser facilmente escondidas em uma manga ou embaixo de um manto para dar a seu usuário uma vantagem inesperada em combate. Quando calculando o dano para Facas, usa-se o valor de FOR ou DEX, aquele que for mais alto.

tipo: weapon · duas mãos (ocupa ambos os slots): não · propriedades: Arremesso 6m a 18m; Leve; Acuidade

| Nome           | Slug             | Tipo   | Tier (raw) | Preço | Disp. | Dano                       | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                             | Texto do efeito | Descrição / conteúdo |
| -------------- | ---------------- | ------ | ---------- | ----- | ----- | -------------------------- | --- | ---- | --------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------- |
| Dirk           | `dirk`           | weapon | F          | 150   | 93%   | 1d8 + str\|dex (maior)     | —   | —    | não       | —     | —                                                                                                                                   | —               | —                    |
| Baselard       | `baselard`       | weapon | E          | 550   | 87%   | 1d8 + str\|dex (maior) + 1 | —   | —    | não       | —     | —                                                                                                                                   | —               | —                    |
| Mythril Knife  | `mythril-knife`  | weapon | D          | 1100  | 81%   | 1d8 + str\|dex (maior) + 2 | —   | —    | não       | —     | —                                                                                                                                   | —               | —                    |
| Main Gauche    | `main-gauche`    | weapon | C          | 1450  | 72%   | 1d8 + str\|dex (maior) + 3 | —   | —    | não       | —     | —                                                                                                                                   | —               | —                    |
| Rondell Dagger | `rondell-dagger` | weapon | B          | 3700  | 62%   | 1d8 + str\|dex (maior) + 4 | —   | —    | não       | —     | **Avanço** `efeitosMelee.avanco` → Ao causar dano a uma criatura, o usuário pode avançar 1 metro em qualquer direç…                 | Avanço          | —                    |
| Zorlin Shape   | `zorlin-shape`   | weapon | A          | 4700  | 53%   | 1d8 + str\|dex (maior) + 5 | —   | —    | não       | —     | **Desconcertador** `efeitosMelee.desconcertador` → Em um crítico, o usuário pode tentar desarmar, reposicionar, quebrar ou derruba… | Desconcertador  | —                    |
| Platina Dagger | `platina-dagger` | weapon | S          | 6600  | 44%   | 1d8 + str\|dex (maior) + 6 | —   | —    | não       | —     | **Fortuito** `efeitosMelee.fortuito` → Quando essa arma acerta um inimigo com um ataque de oportunidade, o usuário pod…             | Fortuito        | —                    |
| Cinquedea      | `cinquedea`      | weapon | S          | 6600  | 44%   | 1d8 + str\|dex (maior) + 6 | —   | —    | não       | —     | **Impactante** `efeitosMelee.impactante` → A arma é tratada como se fosse de uma categoria de tamanho maior. Além disso, a…         | Impactante      | —                    |

### Garras — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem52.png

> A evolução lógica do velho soco com espinhos, as Garras são adotadas por Monges e Ninjas para propósitos de combate a curta distância. Consiste em reforçadas lâminas fixadas nos nós dos dedos do usuário, sendo a maioria construída em uma luva criada para confortavelmente se encaixar nas mãos do usuário. As Garras são vendidas em pares e utilizam ambos os Slots para Armas e Escudo.

tipo: weapon · duas mãos (ocupa ambos os slots): sim · propriedades: Especial (Garras)

| Nome          | Slug            | Tipo   | Tier (raw) | Preço | Disp. | Dano          | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                     | Texto do efeito | Descrição / conteúdo |
| ------------- | --------------- | ------ | ---------- | ----- | ----- | ------------- | --- | ---- | --------- | ----- | --------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------- |
| Iron Claws    | `iron-claws`    | weapon | F          | 150   | 93%   | 1d8 + str     | —   | —    | sim       | —     | —                                                                                                                           | —               | —                    |
| Cat's Claws   | `cat-s-claws`   | weapon | E          | 550   | 87%   | 1d8 + str + 1 | —   | —    | sim       | —     | —                                                                                                                           | —               | —                    |
| Mythril Claws | `mythril-claws` | weapon | D          | 1100  | 81%   | 1d8 + str + 2 | —   | —    | sim       | —     | —                                                                                                                           | —               | —                    |
| Hell Claws    | `hell-claws`    | weapon | C          | 1450  | 72%   | 1d8 + str + 3 | —   | —    | sim       | —     | —                                                                                                                           | —               | —                    |
| Prism Claws   | `prism-claws`   | weapon | B          | 3700  | 62%   | 1d8 + str + 4 | —   | —    | sim       | —     | **Dispersora** `efeitosMelee.dispersora` → Permite armazenar uma magia de dissipar na arma para ativar com um ataque bem-s… | Dispersora      | —                    |
| Mirage Claws  | `mirage-claws`  | weapon | A          | 4700  | 53%   | 1d8 + str + 5 | —   | —    | sim       | —     | **Toque Fantasma** `efeitosMelee.toqueFantasma` → A arma é tratada como se fosse corporal e incorpórea ao mesmo tempo.      | Toque Fantasma  | —                    |
| Tiger Fangs   | `tiger-fangs`   | weapon | S          | 6600  | 44%   | 1d8 + str + 6 | —   | —    | sim       | —     | **Caçador** `efeitosMelee.cacador` → Adiciona o bônus de aprimoramento nos testes de Sobrevivência para rastrear qua…       | Caçador         | —                    |
| Kaiser Claws  | `kaiser-claws`  | weapon | S          | 6600  | 44%   | 1d8 + str + 6 | —   | —    | sim       | —     | **Dominadora** `efeitosMelee.dominadora` → Uma arma com este encantamento, ao atingir um acerto crítico, imediatamente faz… | Dominadora      | —                    |

### Instrumentos — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem53.png

> Arma símbolo dos Bardos. Todos os instrumentos possuem pelo menos um pouco de magia nele e a maioria inflige dano quando sintonizam certa frequência para projetar uma poderosa rajada de energia sônica. O [x] na lista deve ser substituído pelo instrumento de preferência do personagem, sendo que os tipos mais comuns são Flautas, Harpas e Sinos, mas existem muitas outras possibilidades. Por exemplo,…

tipo: weapon · duas mãos (ocupa ambos os slots): sim · propriedades: Distância: 6m a 12m; Projétil Mágico; Mágico

| Nome         | Slug         | Tipo   | Tier (raw) | Preço | Disp. | Dano           | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                                   | Texto do efeito   | Descrição / conteúdo |
| ------------ | ------------ | ------ | ---------- | ----- | ----- | -------------- | --- | ---- | --------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------- |
| Old [x]      | `old-x`      | weapon | F          | 150   | 93%   | 1d10 + cha     | —   | —    | sim       | —     | —                                                                                                                                         | —                 | —                    |
| Silver [x]   | `silver-x`   | weapon | E          | 550   | 87%   | 1d10 + cha + 1 | —   | —    | sim       | —     | —                                                                                                                                         | —                 | —                    |
| Mythril [x]  | `mythril-x`  | weapon | D          | 1100  | 81%   | 1d10 + cha + 2 | —   | —    | sim       | —     | —                                                                                                                                         | —                 | —                    |
| Battle [x]   | `battle-x`   | weapon | C          | 1450  | 72%   | 1d10 + cha + 3 | —   | —    | sim       | —     | —                                                                                                                                         | —                 | —                    |
| Fairy [x]    | `fairy-x`    | weapon | B          | 3700  | 62%   | 1d10 + cha + 4 | —   | —    | sim       | —     | **Energia Brilhante** `efeitosRanged.energiaBrilhante` → A arma ignora bônus de armadura e escudo na CA do inimigo. Não pode causar dano… | Energia Brilhante | —                    |
| Diamond [x]  | `diamond-x`  | weapon | A          | 4700  | 53%   | 1d10 + cha + 5 | —   | —    | sim       | —     | **Impenetrável** `efeitosRanged.impenetravel` → Uma arma impenetrável é protegida contra dano e deterioração. Armas metálicas n…          | Impenetrável      | —                    |
| Platinum [x] | `platinum-x` | weapon | S          | 6600  | 44%   | 1d10 + cha + 6 | —   | —    | sim       | —     | **Explosão Elétrica** `efeitosRanged.explosaoEletrica` → Causa +1d6 de dano elétrico adicional. Em caso de acerto crítico, causa +1d10 d… | Explosão Elétrica | —                    |
| Crystal [x]  | `crystal-x`  | weapon | S          | 6600  | 44%   | 1d10 + cha + 6 | —   | —    | sim       | —     | **Libertadora** `efeitosRanged.libertadora` → Como ação padrão, o usuário pode realizar um teste de manobra para remover efei…            | Libertadora       | —                    |

### Machados — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem54.png

> Pesado e ameaçador nas mãos de um guerreiro treinado, os Machados são especialmente escolhidos pelos Anões, que os usam com efeitos devastadores nas suas casas subterrâneas. Machados utilizam ambos os Slots para Arma e Escudo. Alcance: 1m

tipo: weapon · duas mãos (ocupa ambos os slots): sim · propriedades: Duas Mãos; Pesado

| Nome        | Slug          | Tipo   | Tier (raw) | Preço | Disp. | Dano           | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                                                  | Texto do efeito           | Descrição / conteúdo |
| ----------- | ------------- | ------ | ---------- | ----- | ----- | -------------- | --- | ---- | --------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | -------------------- |
| Light Axe   | `light-axe`   | weapon | F          | 150   | 93%   | 2d9 + str      | —   | —    | sim       | —     | —                                                                                                                                                        | —                         | —                    |
| Battleaxe   | `battleaxe`   | weapon | E          | 550   | 87%   | 2d9 + str + 1  | —   | —    | sim       | —     | —                                                                                                                                                        | —                         | —                    |
| Mythril Axe | `mythril-axe` | weapon | D          | 1100  | 81%   | 2d9 + str + 2  | —   | —    | sim       | —     | —                                                                                                                                                        | —                         | —                    |
| Bone Axe    | `bone-axe`    | weapon | C          | 1450  | 72%   | 2d12 + str + 3 | —   | —    | sim       | —     | —                                                                                                                                                        | —                         | —                    |
| Tabar       | `tabar`       | weapon | B          | 3700  | 62%   | 2d9 + str + 4  | —   | —    | sim       | —     | **Execução** `efeitosMelee.execucao` → Causa +2d6 de dano adicional quando usada contra inimigos com menos de 20% do HP                                  | Execução                  | —                    |
| Heavy Axe   | `heavy-axe`   | weapon | A          | 4700  | 53%   | 2d9 + str + 5  | —   | —    | sim       | —     | **Desconcertador** `efeitosMelee.desconcertador` → Em um crítico, o usuário pode tentar desarmar, reposicionar, quebrar ou derruba…                      | Desconcertador            | —                    |
| Great Axe   | `great-axe`   | weapon | S          | 6600  | 44%   | 2d9 + str + 6  | —   | —    | sim       | —     | **Ameaça Crítica Aprimorada** `efeitosGerais.ameacaCriticaAprimorada` → Aumenta a margem de ameaça crítica da arma em 1(19 = critico). Pode ser selecio… | Ameaça Crítica Aprimorada | —                    |
| Kheten      | `kheten`      | weapon | S          | 6600  | 44%   | 2d9 + str + 6  | —   | —    | sim       | —     | **Redimida** `efeitosRanged.redimida` → Funciona como uma arma sagrada, causando +2d6 de dano contra criaturas malignas…                                 | Redimida                  | —                    |

### Rifles — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem55.png

> Complexos e poderosos, os Rifles representam o máximo em capacidade ofensiva à longa distância, capaz de disparar uma única bala através de grande distância com uma ótima precisão através do cano da arma. Rifles utilizam ambos os Slots para Armas e Escudo e são considerados como armas de Ataque à Distância, porém, o player só consegue realizar seu ataque turno sim e turno não (pois precisa recarr…

tipo: weapon · duas mãos (ocupa ambos os slots): sim · propriedades: Distância: 24m a 73m; Especial (Rifle); Duas Mãos; Pesado; Recarrega: Após 5 disparos

| Nome         | Slug             | Tipo   | Tier (raw) | Preço | Disp. | Dano   | CA  | Alvo | Duas mãos | Extra | Efeitos | Texto do efeito | Descrição / conteúdo |
| ------------ | ---------------- | ------ | ---------- | ----- | ----- | ------ | --- | ---- | --------- | ----- | ------- | --------------- | -------------------- |
| Valiant      | `valiant-rifle`  | weapon | F          | 150   | 93%   | 12     | —   | —    | sim       | —     | —       | —               | —                    |
| Silver Rifle | `silver-rifle`   | weapon | E          | 550   | 87%   | 12 + 1 | —   | —    | sim       | —     | —       | —               | —                    |
| Ulysses      | `ulysses`        | weapon | D          | 1100  | 81%   | 12 + 2 | —   | —    | sim       | —     | —       | —               | —                    |
| Hellfire     | `hellfire`       | weapon | C          | 4800  | 72%   | 12 + 3 | —   | —    | sim       | —     | —       | —               | —                    |
| Bismarck     | `bismarck-rifle` | weapon | B          | 3700  | 62%   | 12 + 4 | —   | —    | sim       | —     | —       | —               | —                    |
| Coffinmaker  | `coffinmaker`    | weapon | A          | 4700  | 53%   | 12 + 5 | —   | —    | sim       | —     | —       | —               | —                    |
| Bindsnipe    | `bindsnipe`      | weapon | S          | 6600  | 44%   | 12 + 6 | —   | —    | sim       | —     | —       | —               | —                    |
| Martial Gun  | `martial-gun`    | weapon | S          | 6600  | 44%   | 12 + 6 | —   | —    | sim       | —     | —       | —               | —                    |

### Foices — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/image110.png

> As foices são armas pesadas e intimidantes que podem cortar através de múltiplos inimigos em um único golpe. Projetadas para ataques de varredura em larga escala, essas armas podem atingir uma largura de até 2 metros. Ocupam ambos os Slots para Arma e Escudo. Alcance: Todos os ranks têm alcance de 2m de largura.

tipo: weapon · duas mãos (ocupa ambos os slots): sim

| Nome            | Slug              | Tipo   | Tier (raw) | Preço | Disp. | Dano          | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                                              | Texto do efeito         | Descrição / conteúdo |
| --------------- | ----------------- | ------ | ---------- | ----- | ----- | ------------- | --- | ---- | --------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------------- |
| Iron Scythe     | `iron-scythe`     | weapon | F          | 160   | 92%   | 2d9 + str     | —   | —    | sim       | —     | —                                                                                                                                                    | —                       | —                    |
| Reaper's Scythe | `reaper-s-scythe` | weapon | E          | 950   | 85%   | 2d9 + str + 1 | —   | —    | sim       | —     | —                                                                                                                                                    | —                       | —                    |
| Mythril Scythe  | `mythril-scythe`  | weapon | D          | 2100  | 79%   | 2d9 + str + 2 | —   | —    | sim       | —     | —                                                                                                                                                    | —                       | —                    |
| Golden Scythe   | `golden-scythe`   | weapon | C          | 4200  | 70%   | 2d9 + str + 3 | —   | —    | sim       | —     | —                                                                                                                                                    | —                       | —                    |
| Soul Harvester  | `soul-harvester`  | weapon | B          | 5500  | 60%   | 2d9 + str + 4 | —   | —    | sim       | —     | **Exaustiva** `efeitosMelee.exaustiva` → Em um acerto crítico, o usuário pode abrir mão do dano adicional para deixar o …                            | Exaustiva               | —                    |
| Viper Scythe    | `viper-scythe`    | weapon | A          | 9800  | 52%   | 2d9 + str + 5 | —   | —    | sim       | —     | **Injetora** `efeitosMelee.injetora` → Armazena até 3 doses de veneno de contato. Pode aplicar 1 dose como ação bônus.                               | Injetora                | —                    |
| Phantom Scythe  | `phantom-scythe`  | weapon | S          | 13500 | 44%   | 2d9 + str + 6 | —   | —    | sim       | —     | **Invocada** `efeitosRanged.invocada` → A arma se teleporta para a mão do usuário (dentro de até 30 metros) como uma aç…                             | Invocada                | —                    |
| Death's Reaver  | `death-s-reaver`  | weapon | S          | 17500 | 32%   | 2d9 + str + 6 | —   | —    | sim       | —     | **Perfuradora de Corações** `efeitosRanged.perfuradoraDeCoracoes` → Funciona como uma arma vorpal, mas direcionada ao coração. Um 20 natural seguid… | Perfuradora de Corações | —                    |

### Caneleiras — 8 itens — IGNORADA por ora

Banner: https://i.servimg.com/u/f49/20/51/48/95/image111.png

> As caneleiras são armaduras defensivas adaptadas para o combate corpo a corpo, onde as pernas são usadas como principal meio de ataque. Ideais para guerreiros que usam golpes poderosos com chutes, essas caneleiras são vendidas em pares e ocupam ambos os Slots para Armas e Escudo. Alcance: Todos os ranks têm alcance de 1m.

tipo: weapon · duas mãos (ocupa ambos os slots): sim

| Nome              | Slug                | Tipo   | Tier (raw) | Preço | Disp. | Dano       | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                                         | Texto do efeito       | Descrição / conteúdo |
| ----------------- | ------------------- | ------ | ---------- | ----- | ----- | ---------- | --- | ---- | --------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------------- |
| Iron Greaves      | `iron-greaves`      | weapon | F          | 120   | 95%   | 1d10 + dex | —   | —    | sim       | —     | —                                                                                                                                               | —                     | —                    |
| Steel Greaves     | `steel-greaves`     | weapon | E          | 750   | 88%   | 1d10 + dex | —   | —    | sim       | —     | —                                                                                                                                               | —                     | —                    |
| Mythril Greaves   | `mythril-greaves`   | weapon | D          | 1600  | 82%   | 1d10 + dex | —   | —    | sim       | —     | —                                                                                                                                               | —                     | —                    |
| Titanium Greaves  | `titanium-greaves`  | weapon | C          | 3200  | 73%   | 1d10 + dex | —   | —    | sim       | —     | —                                                                                                                                               | —                     | —                    |
| Dragon Greaves    | `dragon-greaves`    | weapon | B          | 5000  | 64%   | 1d10 + dex | —   | —    | sim       | —     | **Flamejante** `efeitosRanged.flamejante` → A arma causa +1d6 de dano de fogo.                                                                  | Flamejante            | —                    |
| Shadow Greaves    | `shadow-greaves`    | weapon | A          | 7500  | 54%   | 1d10 + dex | —   | —    | sim       | —     | **Explosão Abissal** `efeitosRanged.explosaoAbissal` → Causa +1d6 de dano sombrio adicional. Em caso de acerto crítico, causa +1d10 de…         | Explosão Abissal      | —                    |
| Phoenix Greaves   | `phoenix-greaves`   | weapon | S          | 10000 | 46%   | 1d10 + dex | —   | —    | sim       | —     | **Intensificação de Chi** `efeitosMelee.intensificacaoDeChi` → Permite que monges usem seus ataques de chi ou o talento Golpe Atordoante com e… | Intensificação de Chi | —                    |
| Celestial Greaves | `celestial-greaves` | weapon | S          | 13500 | 35%   | 1d10 + dex | —   | —    | sim       | —     | **Redimida** `efeitosMelee.redimida` → Funciona como uma arma Sagrada, causando +2d6 de dano contra criaturas malignas…                         | Redimida              | —                    |

### Rapieras — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/image112.png

> As Rapieras são espadas de perfuração elegantes e rápidas, preferidas por duelistas e aventureiros que priorizam a precisão e a velocidade. Essas armas são leves, permitindo movimentos rápidos e precisos, ideais para combates táticos e elegantes. Alcance: Todos os ranks têm alcance de 1m.

tipo: weapon · duas mãos (ocupa ambos os slots): não · propriedades: Acuidade

| Nome             | Slug               | Tipo   | Tier (raw) | Preço | Disp. | Dano       | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                                  | Texto do efeito   | Descrição / conteúdo |
| ---------------- | ------------------ | ------ | ---------- | ----- | ----- | ---------- | --- | ---- | --------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------- |
| Iron Rapier      | `iron-rapier`      | weapon | F          | 130   | 93%   | 1d10 + dex | —   | —    | não       | —     | —                                                                                                                                        | —                 | —                    |
| Swift Rapier     | `swift-rapier`     | weapon | E          | 800   | 87%   | 1d10 + dex | —   | —    | não       | —     | —                                                                                                                                        | —                 | —                    |
| Mythril Rapier   | `mythril-rapier`   | weapon | D          | 1800  | 80%   | 1d10 + dex | —   | —    | não       | —     | —                                                                                                                                        | —                 | —                    |
| Dueling Rapier   | `dueling-rapier`   | weapon | C          | 3500  | 70%   | 1d10 + dex | —   | —    | não       | —     | —                                                                                                                                        | —                 | —                    |
| Venomous Rapier  | `venomous-rapier`  | weapon | B          | 5300  | 61%   | 1d10 + dex | —   | —    | não       | —     | **Injetora** `efeitosMelee.injetora` → Armazena até 3 doses de veneno de contato. Pode aplicar 1 dose como ação bônus.                   | Injetora          | —                    |
| Thunder Rapier   | `thunder-rapier`   | weapon | A          | 8000  | 52%   | 1d10 + dex | —   | —    | não       | —     | **Explosão Elétrica** `efeitosMelee.explosaoEletrica` → A arma causa +1d6 de dano elétrico normalmente e +1d10 de dano elétrico em acer… | Explosão Elétrica | —                    |
| Dragon's Fang    | `dragon-s-fang`    | weapon | S          | 11000 | 43%   | 1d10 + dex | —   | —    | não       | —     | **Sangrenta** `efeitosMelee.sangrenta` → Aplica o status de Sangramento a cada golpe, de forma cumulativa a cada acerto …                | Sangrenta         | —                    |
| Celestial Rapier | `celestial-rapier` | weapon | S          | 14500 | 36%   | 1d10 + dex | —   | —    | não       | —     | **Surto Vital** `efeitosMelee.surtoVital` → Concede o bônus de aprimoramento nos testes de resistência contra efeitos necró…             | Surto Vital       | —                    |

### Armas de fogo antigas e modernas — 11 itens

tipo: weapon · duas mãos (ocupa ambos os slots): não

| Nome                      | Slug                        | Tipo   | Tier (raw) | Preço | Disp. | Dano                       | CA  | Alvo | Duas mãos | Extra                                                  | Efeitos | Texto do efeito | Descrição / conteúdo |
| ------------------------- | --------------------------- | ------ | ---------- | ----- | ----- | -------------------------- | --- | ---- | --------- | ------------------------------------------------------ | ------- | --------------- | -------------------- |
| Espingarda de Treinamento | `espingarda-de-treinamento` | weapon | —          | 150   | —     | 1d8 perfurante             | —   | —    | não       | categoria: Espingarda; alcance: 3m; tiros: 2           | —       | —               | —                    |
| Bacamarte                 | `bacamarte`                 | weapon | —          | 400   | —     | 1d10 perfurante            | —   | —    | não       | categoria: Espingarda (Antiga); alcance: 4m; tiros: 1  | —       | —               | —                    |
| Espingarda                | `espingarda`                | weapon | —          | 400   | —     | 1d8 perfurante             | —   | —    | não       | categoria: Espingarda (Moderna); alcance: 6m; tiros: 6 | —       | —               | —                    |
| Espingarda de Caça        | `espingarda-de-caca`        | weapon | —          | 600   | —     | 2d4 perfurante             | —   | —    | não       | categoria: Espingarda (Antiga); alcance: 7m; tiros: 1  | —       | —               | —                    |
| Espingarda Serrada        | `espingarda-serrada`        | weapon | —          | 350   | —     | 2d4 perfurante             | —   | —    | não       | categoria: Espingarda (Moderna); alcance: 3m; tiros: 2 | —       | —               | —                    |
| Espingarda Machina        | `espingarda-machina`        | weapon | —          | 800   | —     | 1d10 perfurante            | —   | —    | não       | categoria: Espingarda (Moderna); alcance: 6m; tiros: 5 | —       | —               | —                    |
| Mosquete                  | `mosquete`                  | weapon | —          | 750   | —     | 1d10 perfurante            | —   | —    | não       | categoria: Rifle (Antigo); alcance: 18m; tiros: 1      | —       | —               | —                    |
| Mosquete Dragoon          | `mosquete-dragoon`          | weapon | —          | 800   | —     | 1d10 perfurante            | —   | —    | não       | categoria: Rifle (Antigo); alcance: 15m; tiros: 1      | —       | —               | —                    |
| Mosquete Híbrido          | `mosquete-hibrido`          | weapon | —          | 800   | —     | 1d8 perfurante/contundente | —   | —    | não       | categoria: Rifle (Antigo); alcance: 15m; tiros: 1      | —       | —               | —                    |
| Fuzil de Batalha          | `fuzil-de-batalha`          | weapon | —          | 1200  | —     | 1d10 perfurante            | —   | —    | não       | categoria: Rifle (Moderno); alcance: 24m; tiros: 8     | —       | —               | —                    |
| Lança-Chamas              | `lanca-chamas`              | weapon | —          | 100   | —     | 1d8 perfurante (crít. x4)  | —   | —    | não       | categoria: Rifle (Antigo); alcance: 4m; tiros: 1       | —       | —               | —                    |

### Pistolas — 8 itens

> Pistolas exigem precisão, sangue-frio e um bom controle do tempo para serem usadas com eficácia. Diferente de armas de longo alcance tradicionais, seu poder reside na rapidez do disparo e na facilidade de manuseio em espaços confinados. Quando o personagem domina seus mecanismos, recarga e cadência, a pistola se torna uma ferramenta letal e confiável em confrontos repentinos.

tipo: weapon · duas mãos (ocupa ambos os slots): não · propriedades: Distância: 9m a 27m; Leve; Munição; Recarga: Após 6 disparos

| Nome           | Slug               | Tipo   | Tier (raw) | Preço | Disp. | Dano          | CA  | Alvo | Duas mãos | Extra | Efeitos | Texto do efeito | Descrição / conteúdo |
| -------------- | ------------------ | ------ | ---------- | ----- | ----- | ------------- | --- | ---- | --------- | ----- | ------- | --------------- | -------------------- |
| Valiant        | `valiant-pistola`  | weapon | F          | 150   | 93%   | 1d8 + dex     | —   | —    | não       | —     | —       | —               | —                    |
| Bismarck       | `bismarck-pistola` | weapon | E          | 550   | 87%   | 1d8 + dex + 1 | —   | —    | não       | —     | —       | —               | —                    |
| Enterprise     | `enterprise`       | weapon | D          | 1100  | 81%   | 1d8 + dex + 2 | —   | —    | não       | —     | —       | —               | —                    |
| Rigels         | `rigels`           | weapon | C          | 1450  | 72%   | 1d8 + dex + 3 | —   | —    | não       | —     | —       | —               | —                    |
| Vega           | `vega`             | weapon | B          | 3700  | 62%   | 1d8 + dex + 4 | —   | —    | não       | —     | —       | —               | —                    |
| Mithuna        | `mithuna`          | weapon | A          | 4700  | 53%   | 1d8 + dex + 5 | —   | —    | não       | —     | —       | —               | —                    |
| Shining Bracer | `shining-bracer`   | weapon | S          | 6600  | 44%   | 1d8 + dex + 6 | —   | —    | não       | —     | —       | —               | —                    |
| Lion Heart     | `lion-heart`       | weapon | S          | 6600  | 44%   | 1d8 + dex + 6 | —   | —    | não       | —     | —       | —               | —                    |

### Fuzil — 8 itens

> Fuzis exigem treinamento, disciplina e bom posicionamento para serem usados em todo o seu potencial. Seu alcance superior e poder de fogo consistente fazem deles armas ideais para controlar o campo de batalha e atingir alvos a longas distâncias com precisão letal. Quando o personagem compreende seus mecanismos, recuo e ritmo de disparo, o fuzil se torna uma ferramenta extremamente eficaz tanto em…

tipo: weapon · duas mãos (ocupa ambos os slots): sim · propriedades: Distância: 24m a 73m; Pesado; Munição; Recarga: Após 30 disparos; Especial (Fuzil)

| Nome         | Slug           | Tipo   | Tier (raw) | Preço | Disp. | Dano   | CA  | Alvo | Duas mãos | Extra | Efeitos | Texto do efeito | Descrição / conteúdo |
| ------------ | -------------- | ------ | ---------- | ----- | ----- | ------ | --- | ---- | --------- | ----- | ------- | --------------- | -------------------- |
| Cerberus     | `cerberus`     | weapon | F          | 150   | 93%   | 10     | —   | —    | sim       | —     | —       | —               | —                    |
| Executioner  | `executioner`  | weapon | E          | 550   | 87%   | 10 + 1 | —   | —    | sim       | —     | —       | —               | —                    |
| Capella      | `capella`      | weapon | D          | 1100  | 81%   | 10 + 2 | —   | —    | sim       | —     | —       | —               | —                    |
| Fomalhaut    | `fomalhaut`    | weapon | C          | 1450  | 72%   | 10 + 3 | —   | —    | sim       | —     | —       | —               | —                    |
| Procyon      | `procyon`      | weapon | B          | 3700  | 62%   | 10 + 4 | —   | —    | sim       | —     | —       | —               | —                    |
| Aldebaran    | `aldebaran`    | weapon | A          | 4700  | 53%   | 10 + 5 | —   | —    | sim       | —     | —       | —               | —                    |
| Ras Algethi  | `ras-algethi`  | weapon | S          | 6600  | 44%   | 10 + 6 | —   | —    | sim       | —     | —       | —               | —                    |
| Deneb Algedi | `deneb-algedi` | weapon | S          | 6600  | 44%   | 10 + 6 | —   | —    | sim       | —     | —       | —               | —                    |

## Armaduras (t18)

### Escudos — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem56.png

> Construídos com madeira reforçada, metal ou qualquer outra substância durável, escudos são mais frequentemente utilizados por personagens que sigam o Job Guerreiro. Diferentemente dos outros tipos de armaduras, os escudos costumam dar mais "buffs" do que apenas defesa do personagem.

tipo: shield · duas mãos (ocupa ambos os slots): não

| Nome           | Slug             | Tipo   | Tier (raw) | Preço | Disp. | Dano | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                                     | Texto do efeito    | Descrição / conteúdo |
| -------------- | ---------------- | ------ | ---------- | ----- | ----- | ---- | --- | ---- | --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------- |
| Buckler        | `buckler`        | shield | F          | 150   | 94%   | —    | +2  | —    | não       | —     | —                                                                                                                                           | —                  | —                    |
| Bronze Shield  | `bronze-shield`  | shield | E          | 550   | 88%   | —    | +2  | —    | não       | —     | —                                                                                                                                           | —                  | —                    |
| Heavy Shield   | `heavy-shield`   | shield | D          | 1100  | 82%   | —    | +2  | —    | não       | —     | —                                                                                                                                           | —                  | —                    |
| Silver Shield  | `silver-shield`  | shield | C          | 1450  | 73%   | —    | +2  | —    | não       | —     | —                                                                                                                                           | —                  | —                    |
| Mythril Shield | `mythril-shield` | shield | B          | 3700  | 64%   | —    | +2  | —    | não       | —     | **Toque Fantasma** `efeitosEscudos.toqueFantasma` → Esta armadura ou escudo parece quase translúcido. Tanto seu bônus de aprimorame…        | Toque Fantasma     | —                    |
| Gold Shield    | `gold-shield`    | shield | A          | 4700  | 54%   | —    | +2  | —    | não       | —     | **Radiante** `efeitosEscudos.radiante` → Armaduras e escudos com essa habilidade especial brilham com a intensidade de u…                   | Radiante           | —                    |
| Diamond Shield | `diamond-shield` | shield | S          | 6600  | 46%   | —    | +2  | —    | não       | —     | **Impenetrável** `efeitosEscudos.impenetravel` → Uma armadura ou escudo com esta habilidade especial é extremamente resistente. …           | Impenetrável       | —                    |
| Platina Shield | `platina-shield` | shield | S          | 6600  | 35%   | —    | +2  | —    | não       | —     | **Atração de Flechas** `efeitosEscudos.atracaoDeFlechas` → Um escudo com esta habilidade atrai ataques de armas à distância para si. Ele c… | Atração de Flechas | —                    |

### Armaduras Pesadas — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem57.png

> As Armaduras é o tipo de armadura para o corpo mais pesada, consistindo em uma sólida sobreposição de placas ou outro material igualmente durável para uma proteção eficiente contra os ataques físicos.

tipo: armor · duas mãos (ocupa ambos os slots): não

| Nome          | Slug            | Tipo  | Tier (raw) | Preço | Disp. | Dano | CA     | Alvo | Duas mãos | Extra | Efeitos                                                                                                                              | Texto do efeito | Descrição / conteúdo |
| ------------- | --------------- | ----- | ---------- | ----- | ----- | ---- | ------ | ---- | --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------- | -------------------- |
| Chain Mail    | `chain-mail`    | armor | F          | 150   | 94%   | —    | 16     | —    | não       | —     | —                                                                                                                                    | —               | —                    |
| Bronze Armor  | `bronze-armor`  | armor | E          | 550   | 87%   | —    | 16 + 1 | —    | não       | —     | —                                                                                                                                    | —               | —                    |
| Plate Mail    | `plate-mail`    | armor | D          | 1100  | 81%   | —    | 16 + 2 | —    | não       | —     | —                                                                                                                                    | —               | —                    |
| Silver Mail   | `silver-mail`   | armor | C          | 1450  | 72%   | —    | 16 + 3 | —    | não       | —     | —                                                                                                                                    | —               | —                    |
| Mythril Armor | `mythril-armor` | armor | B          | 3700  | 63%   | —    | 16 + 4 | —    | não       | —     | **Toque Fantasma** `efeitosEscudos.toqueFantasma` → Esta armadura ou escudo parece quase translúcido. Tanto seu bônus de aprimorame… | Toque Fantasma  | —                    |
| Gold Armor    | `gold-armor`    | armor | A          | 4700  | 53%   | —    | 16 + 5 | —    | não       | —     | **Radiante** `efeitosEscudos.radiante` → Armaduras e escudos com essa habilidade especial brilham com a intensidade de u…            | Radiante        | —                    |
| Diamond Armor | `diamond-armor` | armor | S          | 6600  | 45%   | —    | 16 + 6 | —    | não       | —     | **Impenetrável** `efeitosEscudos.impenetravel` → Uma armadura ou escudo com esta habilidade especial é extremamente resistente. …    | Impenetrável    | —                    |
| Platina Armor | `platina-armor` | armor | S          | 6600  | 34%   | —    | 16 + 6 | —    | não       | —     | **Justa** `efeitosArmaduras.justa` → Essa armadura geralmente é adornada com símbolos religiosos gravados ou esmalta…                | Justa           | —                    |

### Vestes — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem58.png

> Uma categoria abrangente que cobre uma vasta e eclética variedade de roupas. Vestes incluem os trajes ninjas, roupas convencionais e vestidos.

tipo: armor · duas mãos (ocupa ambos os slots): não

| Nome           | Slug             | Tipo  | Tier (raw) | Preço | Disp. | Dano | CA                   | Alvo | Duas mãos | Extra | Efeitos | Texto do efeito | Descrição / conteúdo |
| -------------- | ---------------- | ----- | ---------- | ----- | ----- | ---- | -------------------- | ---- | --------- | ----- | ------- | --------------- | -------------------- |
| Leather Outfit | `leather-outfit` | armor | F          | 150   | 93%   | —    | 12 + Dex (máx 2)     | —    | não       | —     | —       | —               | —                    |
| Bronze Vest    | `bronze-vest`    | armor | E          | 550   | 87%   | —    | 12 + Dex (máx 2) + 1 | —    | não       | —     | —       | —               | —                    |
| Chain Vest     | `chain-vest`     | armor | D          | 1100  | 81%   | —    | 12 + Dex (máx 2) + 2 | —    | não       | —     | —       | —               | —                    |
| Survival Vest  | `survival-vest`  | armor | C          | 1450  | 72%   | —    | 12 + Dex (máx 2) + 3 | —    | não       | —     | —       | —               | —                    |
| Mythril Vest   | `mythril-vest`   | armor | B          | 3700  | 62%   | —    | 12 + Dex (máx 2) + 4 | —    | não       | —     | —       | —               | —                    |
| Brigadine      | `brigadine`      | armor | A          | 4700  | 53%   | —    | 14 + Dex (máx 2) + 5 | —    | não       | —     | —       | —               | —                    |
| Diamond Vest   | `diamond-vest`   | armor | S          | 6600  | 44%   | —    | 15 + Dex (máx 2) + 6 | —    | não       | —     | —       | —               | —                    |
| Platina Vest   | `platina-vest`   | armor | S          | 6600  | 44%   | —    | 15 + Dex (máx 2) + 6 | —    | não       | —     | —       | —               | —                    |

### Robes — 8 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem59.png

> Robes são característicos dos Jobs Magos, leves o suficiente para serem utilizados sem impedir a habilidade de lançamento de magia dos Magos. As Robes conferem uma resistência mágica superior, mas oferecem limitada proteção contra ataques físicos.

tipo: armor · duas mãos (ocupa ambos os slots): não

| Nome         | Slug           | Tipo  | Tier (raw) | Preço | Disp. | Dano | CA           | Alvo | Duas mãos | Extra | Efeitos | Texto do efeito | Descrição / conteúdo |
| ------------ | -------------- | ----- | ---------- | ----- | ----- | ---- | ------------ | ---- | --------- | ----- | ------- | --------------- | -------------------- |
| Cotton Robe  | `cotton-robe`  | armor | F          | 150   | 93%   | —    | 10 + Dex     | —    | não       | —     | —       | —               | —                    |
| Leather Robe | `leather-robe` | armor | E          | 550   | 87%   | —    | 10 + Dex + 1 | —    | não       | —     | —       | —               | —                    |
| Linen Robe   | `linen-robe`   | armor | D          | 1100  | 81%   | —    | 10 + Dex + 2 | —    | não       | —     | —       | —               | —                    |
| Silk Robe    | `silk-robe`    | armor | C          | 1450  | 72%   | —    | 10 + Dex + 3 | —    | não       | —     | —       | —               | —                    |
| Poet Robe    | `poet-robe`    | armor | B          | 3700  | 62%   | —    | 10 + Dex + 4 | —    | não       | —     | —       | —               | —                    |
| Scholar Robe | `scholar-robe` | armor | A          | 4700  | 53%   | —    | 10 + Dex + 5 | —    | não       | —     | —       | —               | —                    |
| Tao Robe     | `tao-robe`     | armor | S          | 6600  | 44%   | —    | 10 + Dex + 6 | —    | não       | —     | —       | —               | —                    |
| Light Robe   | `light-robe`   | armor | S          | 6600  | 44%   | —    | 10 + Dex + 6 | —    | não       | —     | —       | —               | —                    |

## Itens (t20)

### Itens de Recuperação — 17 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem64.png

> Desde uma simples Potion até uma pena da cauda da lendária Fênix, os Itens de Recuperação oferecem muitas opções de curativos para qualquer tipo de doença do mundo. A maioria das lojas estará sempre pronta para vender as poções de cura mais fracas e os antídotos para a maioria das Condições de Status. Aventureiros precavidos sempre estocam uma boa quantidade desdes itens preciosos para as suas lo…

tipo: consumable · duas mãos (ocupa ambos os slots): não

| Nome          | Slug            | Tipo       | Tier (raw) | Preço | Disp. | Dano | CA  | Alvo  | Duas mãos | Extra | Efeitos                                                                | Texto do efeito                                   | Descrição / conteúdo |
| ------------- | --------------- | ---------- | ---------- | ----- | ----- | ---- | --- | ----- | --------- | ----- | ---------------------------------------------------------------------- | ------------------------------------------------- | -------------------- |
| Tonic         | `tonic`         | consumable | F (1)      | 25    | 99%   | —    | —   | Único | não       | —     | restaura 2d3 HP                                                        | Restaura 2d3HP                                    | —                    |
| Potion        | `potion`        | consumable | F (1)      | 50    | 99%   | —    | —   | Único | não       | —     | restaura 2d5 HP                                                        | Restaura 2d5HP                                    | —                    |
| Hi-potion     | `hi-potion`     | consumable | F (1)      | 150   | 86%   | —    | —   | Único | não       | —     | restaura 12 HP                                                         | Restaura 12HP                                     | —                    |
| Tincture      | `tincture`      | consumable | F (1)      | 75    | 93%   | —    | —   | Único | não       | —     | restaura 1 slot nv 1                                                   | Restaura 1 slot nivel 1                           | —                    |
| Ether         | `ether`         | consumable | D (3)      | 150   | 70%   | —    | —   | Único | não       | —     | restaura 1 slot nv 2; ou restaura 2 slot nv 1                          | Restaura 1 slot nivel 2 ou 2 nivel 1              | —                    |
| Hi-ether      | `hi-ether`      | consumable | C (4)      | 325   | 67%   | —    | —   | Único | não       | —     | restaura 1 slot nv 3; ou restaura 2 slot nv 2; ou restaura 3 slot nv 1 | Restaura 1 slot nivel 3 ou 2 nivel 2 ou 3 nivel 1 | —                    |
| Antidote      | `antidote`      | consumable | F (1)      | 50    | 93%   | —    | —   | Único | não       | —     | cura poison                                                            | Cancela a Condição de Status Poison               | —                    |
| Eye Drops     | `eye-drops`     | consumable | F (1)      | 50    | 93%   | —    | —   | Único | não       | —     | cura blind                                                             | Cancela a Condição de Status Cegueira             | —                    |
| Echo Screen   | `echo-screen`   | consumable | E (2)      | 100   | 87%   | —    | —   | Único | não       | —     | cura silence                                                           | Cancela a Condição de Status Silence.             | —                    |
| Tranquilizer  | `tranquilizer`  | consumable | D (3)      | 150   | 81%   | —    | —   | Único | não       | —     | cura berserk                                                           | Cancela a Condição de Status Berserk.             | —                    |
| Bandage       | `bandage`       | consumable | C (4)      | 200   | 76%   | —    | —   | Único | não       | —     | cura immobilize                                                        | Cancela a Condição de Status Immobilize           | —                    |
| Alarm Clock   | `alarm-clock`   | consumable | C (4)      | 200   | 75%   | —    | —   | Único | não       | —     | cura sleep                                                             | Cancela a Condição de Status Sleep.               | —                    |
| Cornucopia    | `cornucopia`    | consumable | C (4)      | 250   | 75%   | —    | —   | Único | não       | —     | cura mini                                                              | Cancela a Condição de Status Mini.                | —                    |
| Maiden's Kiss | `maiden-s-kiss` | consumable | C (4)      | 250   | 75%   | —    | —   | Único | não       | —     | cura toad                                                              | Cancela a Condição de Status Toad.                | —                    |
| Soft          | `soft`          | consumable | C (4)      | 400   | 75%   | —    | —   | Único | não       | —     | cura petrify                                                           | Cancela as Condições de Status Petrify            | —                    |
| Holy Water    | `holy-water`    | consumable | C (4)      | 500   | 75%   | —    | —   | Único | não       | —     | cura zombie                                                            | Cancela a Condição de Status Zombie.              | —                    |
| Chronos Tear  | `chronos-tear`  | consumable | C (4)      | 600   | 75%   | —    | —   | Único | não       | —     | cura slow; cura stop                                                   | Cancela as Condições de Status Slow e Stop.       | —                    |

### Balas — 11 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem65.png

> Diferente das demais armas, o verdadeiro poder dos Arcos, Bestas e Rifles vem daquilo que é disparado delas. Um personagem esperto aprende rapidamente sobre a vantagem de se carregar uma grande variedade de munições específicas para uma batalha, como as Ice Arrows para apagar grandes Bombs, AP Ammo é ótima para ultrapassar a forte concha dos Adamantoise, as Holy Bolts colocam medo em um senhor Ar…

tipo: ammo · duas mãos (ocupa ambos os slots): não

- nota: Utilizada por: Rifles
- nota: x10 por compra
- nota: Fast Ammo: Se usado para realizar um ataque, Fast Ammo confere ao atirador um bônus de +3 à sua Iniciativa no próximo turno. Esse bônus só é aplicado uma única vez.

| Nome            | Slug              | Tipo | Tier (raw) | Preço | Disp. | Dano | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                                                                                                 | Texto do efeito           | Descrição / conteúdo |
| --------------- | ----------------- | ---- | ---------- | ----- | ----- | ---- | --- | ---- | --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | -------------------- |
| Fire Ammo       | `fire-ammo`       | ammo | F (1)      | 100   | 88%   | —    | —   | —    | não       | —     | fogo (ataque)                                                                                                                                                                                           | Fogo Ataque               | —                    |
| Stone Ammo      | `stone-ammo`      | ammo | F (1)      | 100   | 88%   | —    | —   | —    | não       | —     | terra (ataque)                                                                                                                                                                                          | Terra Ataque              | —                    |
| Dark Ammo       | `dark-ammo`       | ammo | E (2)      | 150   | 85%   | —    | —   | —    | não       | —     | aplica blind                                                                                                                                                                                            | Blind                     | —                    |
| Pulse Ammo      | `pulse-ammo`      | ammo | C (4)      | 500   | 78%   | —    | —   | —    | não       | —     | +2 damage                                                                                                                                                                                               | +2 Dano                   | —                    |
| Shadow Ammo     | `shadow-ammo`     | ammo | C (4)      | 150   | 74%   | —    | —   | —    | não       | —     | trevas (ataque)                                                                                                                                                                                         | Trevas Ataque             | —                    |
| AP Ammo         | `ap-ammo`         | ammo | B (5)      | 500   | 68%   | —    | —   | —    | não       | —     | +2 ignoreDef                                                                                                                                                                                            | ignora 2 DEF              | —                    |
| Fast Ammo       | `fast-ammo`       | ammo | B (5)      | 200   | 66%   | —    | —   | —    | não       | —     | texto: "Veja notas abaixo" ⟶ nota: Fast Ammo: Se usado para realizar um ataque, Fast Ammo confere ao atirador um bônus de +3 à sua Iniciativa no próximo turno. Esse bônus só é aplicado uma única vez. | Veja notas abaixo         | —                    |
| Tainted Ammo    | `tainted-ammo`    | ammo | B (5)      | 400   | 66%   | —    | —   | —    | não       | —     | aplica zombie (toque)                                                                                                                                                                                   | Zombie Toque              | —                    |
| Spartan Ammo    | `spartan-ammo`    | ammo | B (5)      | 450   | 63%   | —    | —   | —    | não       | —     | aplica silence (toque)                                                                                                                                                                                  | Silence Toque             | —                    |
| Shotgun Ammo    | `shotgun-ammo`    | ammo | A (6)      | 900   | 55%   | —    | —   | —    | não       | —     | -25% damage; texto: "Alvo: cone 3m"                                                                                                                                                                     | -25% Dano e Alvo: cone 3m | —                    |
| Demolition Ammo | `demolition-ammo` | ammo | S (7)      | 1200  | 44%   | —    | —   | —    | não       | —     | gelo (ataque)                                                                                                                                                                                           | Dano de Gelo              | —                    |

### Flechas — 18 itens

tipo: ammo · duas mãos (ocupa ambos os slots): não

- nota: Utilizada por: Arcos
- nota: x10 por compra
- nota: Matador de Morto-vivo: causa mais 3 de dano em morto vivo

| Nome             | Slug               | Tipo | Tier (raw) | Preço | Disp. | Dano | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                          | Texto do efeito        | Descrição / conteúdo |
| ---------------- | ------------------ | ---- | ---------- | ----- | ----- | ---- | --- | ---- | --------- | ----- | ------------------------------------------------------------------------------------------------ | ---------------------- | -------------------- |
| Fire Arrow       | `fire-arrow`       | ammo | F (1)      | 100   | 88%   | —    | —   | —    | não       | —     | fogo (ataque)                                                                                    | Fogo Ataque            | —                    |
| Ice Arrow        | `ice-arrow`        | ammo | F (1)      | 100   | 88%   | —    | —   | —    | não       | —     | gelo (ataque)                                                                                    | Gelo Ataque            | —                    |
| Lightning Arrow  | `lightning-arrow`  | ammo | F (1)      | 100   | 85%   | —    | —   | —    | não       | —     | eletricidade (ataque)                                                                            | Eletricidade Ataque    | —                    |
| Wind Arrow       | `wind-arrow`       | ammo | F (1)      | 100   | 85%   | —    | —   | —    | não       | —     | ar (ataque)                                                                                      | Ar Ataque              | —                    |
| Water Arrow      | `water-arrow`      | ammo | F (1)      | 100   | 85%   | —    | —   | —    | não       | —     | agua (ataque)                                                                                    | Água Ataque            | —                    |
| Earth Arrow      | `earth-arrow`      | ammo | F (1)      | 100   | 85%   | —    | —   | —    | não       | —     | terra (ataque)                                                                                   | Terra Ataque           | —                    |
| Holy Arrow       | `holy-arrow`       | ammo | F (1)      | 100   | 85%   | —    | —   | —    | não       | —     | luz (ataque)                                                                                     | Luz Ataque             | —                    |
| Darkness Arrow   | `darkness-arrow`   | ammo | E (2)      | 125   | 75%   | —    | —   | —    | não       | —     | aplica blind                                                                                     | Blind                  | —                    |
| Poison Arrow     | `poison-arrow`     | ammo | E (2)      | 200   | 75%   | —    | —   | —    | não       | —     | aplica poison                                                                                    | Poison                 | —                    |
| Sleep Arrow      | `sleep-arrow`      | ammo | D (3)      | 250   | 70%   | —    | —   | —    | não       | —     | aplica sleep                                                                                     | Sleep*                 | —                    |
| Silver Arrow     | `silver-arrow`     | ammo | D (3)      | 400   | 70%   | —    | —   | —    | não       | —     | texto: "Matador de Morto-Vivo" ⟶ nota: Matador de Morto-vivo: causa mais 3 de dano em morto vivo | Matador de Morto-Vivo* | —                    |
| Artemis Arrow    | `artemis-arrow`    | ammo | C (4)      | 400   | 67%   | —    | —   | —    | não       | —     | +2 damage                                                                                        | +2 de Dano             | —                    |
| Yoichi Arrow     | `yoichi-arrow`     | ammo | B (5)      | 500   | 62%   | —    | —   | —    | não       | —     | +2 ignoreDef                                                                                     | Ignora 2 DEF           | —                    |
| Mute Arrow       | `mute-arrow`       | ammo | B (5)      | 250   | 70%   | —    | —   | —    | não       | —     | aplica silence                                                                                   | Silence                | —                    |
| Angel Arrow      | `angel-arrow`      | ammo | B (5)      | 600   | 70%   | —    | —   | —    | não       | —     | aplica confuse                                                                                   | Confusão               | —                    |
| Demon Arrow      | `demon-arrow`      | ammo | B (5)      | 750   | 58%   | —    | —   | —    | não       | —     | texto: "Power Down"                                                                              | Power Down*            | —                    |
| Medusa Arrow     | `medusa-arrow`     | ammo | S (7)      | 1500  | 48%   | —    | —   | —    | não       | —     | aplica petrify                                                                                   | Petrify                | —                    |
| Assassin's Arrow | `assassin-s-arrow` | ammo | S (7)      | 1500  | 48%   | —    | —   | —    | não       | —     | aplica death (toque)                                                                             | Death Touch            | —                    |

### Setas — 14 itens

tipo: ammo · duas mãos (ocupa ambos os slots): não

- nota: Utilizado por: Bestas
- nota: x10 por compra
- nota: HP Dreno: restaura 1dx do dano causado (se sua arma causa 1d8 de dano, então recupere 1d8) recupera sua vida

| Nome          | Slug            | Tipo | Tier (raw) | Preço | Disp. | Dano | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                                                                | Texto do efeito | Descrição / conteúdo |
| ------------- | --------------- | ---- | ---------- | ----- | ----- | ---- | --- | ---- | --------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------- |
| Hydro Bolt    | `hydro-bolt`    | ammo | F (1)      | 100   | 88%   | —    | —   | —    | não       | —     | agua (ataque)                                                                                                                          | Água Ataque     | —                    |
| Black Bolt    | `black-bolt`    | ammo | E (2)      | 100   | 88%   | —    | —   | —    | não       | —     | aplica blind                                                                                                                           | Blind           | —                    |
| Venom Bolt    | `venom-bolt`    | ammo | E (2)      | 200   | 85%   | —    | —   | —    | não       | —     | aplica poison                                                                                                                          | Poison          | —                    |
| Lead Bolt     | `lead-bolt`     | ammo | E (2)      | 200   | 85%   | —    | —   | —    | não       | —     | aplica immobilize                                                                                                                      | Immobilize      | —                    |
| Dogbolt       | `dogbolt`       | ammo | E (2)      | 200   | 85%   | —    | —   | —    | não       | —     | +1 damage                                                                                                                              | +1 de Dano      | —                    |
| Gold Bolt     | `gold-bolt`     | ammo | E (2)      | 150   | 85%   | —    | —   | —    | não       | —     | +2 attack                                                                                                                              | +2 Acerto       | —                    |
| Sleep Bolt    | `sleep-bolt`    | ammo | D (3)      | 250   | 85%   | —    | —   | —    | não       | —     | aplica sleep                                                                                                                           | Sleep*          | —                    |
| Long Bolt     | `long-bolt`     | ammo | C (4)      | 300   | 75%   | —    | —   | —    | não       | —     | aplica slow                                                                                                                            | Slow*           | —                    |
| Grand Bolt    | `grand-bolt`    | ammo | C (4)      | 400   | 75%   | —    | —   | —    | não       | —     | +2 damage                                                                                                                              | +2 de Dano      | —                    |
| Stone Bolt    | `stone-bolt`    | ammo | C (4)      | 450   | 70%   | —    | —   | —    | não       | —     | aplica disable                                                                                                                         | Disable*        | —                    |
| Sapping Bolt  | `sapping-bolt`  | ammo | C (4)      | 450   | 70%   | —    | —   | —    | não       | —     | aplica toad                                                                                                                            | Toad            | —                    |
| Acid Bolt     | `acid-bolt`     | ammo | B (5)      | 500   | 67%   | —    | —   | —    | não       | —     | texto: "Quebra Armadura"                                                                                                               | Quebra Armadura | —                    |
| Blood Bolt    | `blood-bolt`    | ammo | B (5)      | 500   | 62%   | —    | —   | —    | não       | —     | texto: "HP Dreno" ⟶ nota: HP Dreno: restaura 1dx do dano causado (se sua arma causa 1d8 de dano, então recupere 1d8) recupera sua vida | HP Dreno*       | —                    |
| Critical Bolt | `critical-bolt` | ammo | S (7)      | 1200  | 70%   | —    | —   | —    | não       | —     | texto: "+ Crítico"                                                                                                                     | + Crítico       | —                    |

### Bombas — 9 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem66.png

> Armas de Arremesso são projéteis criados para dar aos personagens uma ofensiva adicional nos combates. Um ataque com uma Arma de Arremesso requer uma Ação de Item, e é realizada da mesma maneira que uma Ação de Ataque seria. Independente se o ataque falha ou atinge, a Arma é consumida e removida do Slot de Inventário após o ataque ser finalizado. Preços dados abaixo correspondem a uma única arma.…

tipo: thrown · duas mãos (ocupa ambos os slots): não

| Nome            | Slug              | Tipo   | Tier (raw) | Preço | Disp. | Dano | CA  | Alvo | Duas mãos | Extra | Efeitos                                                   | Texto do efeito                       | Descrição / conteúdo |
| --------------- | ----------------- | ------ | ---------- | ----- | ----- | ---- | --- | ---- | --------- | ----- | --------------------------------------------------------- | ------------------------------------- | -------------------- |
| Smoke Bomb      | `smoke-bomb`      | thrown | F (1)      | 40    | 90%   | —    | —   | —    | não       | —     | aplica blind; texto: "Perda de Olfato"; texto: "Área 4x4" | Cegueira / Perda de Olfato - Área 4x4 | —                    |
| Snowmelt Bomb   | `snowmelt-bomb`   | thrown | F (1)      | 95    | 90%   | 2d6  | —   | —    | não       | —     | gelo (ataque)                                             | Gelo Ataque                           | —                    |
| Tremor Bomb     | `tremor-bomb`     | thrown | E (2)      | 95    | 85%   | 2d6  | —   | —    | não       | —     | terra (ataque)                                            | Terra Ataque                          | —                    |
| Poison Bomb     | `poison-bomb`     | thrown | E (2)      | 110   | 82%   | 2d6  | —   | —    | não       | —     | aplica poison (toque)                                     | Poison Toque                          | —                    |
| Aero Bomb       | `aero-bomb`       | thrown | C (4)      | 95    | 74%   | 2d6  | —   | —    | não       | —     | ar (ataque)                                               | Ar Ataque                             | —                    |
| Spark Bomb      | `spark-bomb`      | thrown | B (5)      | 95    | 65%   | 2d6  | —   | —    | não       | —     | eletricidade (ataque)                                     | Eletricidade Ataque                   | —                    |
| Water Bomb      | `water-bomb`      | thrown | A (6)      | 95    | 56%   | 2d6  | —   | —    | não       | —     | agua (ataque)                                             | Água Ataque                           | —                    |
| Flameburst Bomb | `flameburst-bomb` | thrown | S (7)      | 95    | 47%   | 2d6  | —   | —    | não       | —     | fogo (ataque)                                             | Fogo Ataque                           | —                    |
| Super Ball      | `super-ball`      | thrown | S (8)      | 200   | 37%   | 2d6  | —   | —    | não       | —     | texto: "Alvo: 5m²"                                        | Alvo: 5m²                             | —                    |

### Dardos — 6 itens

Banner: https://i.servimg.com/u/f49/20/51/48/95/imagem66.png

> Uma prática comum associada a venenos, os Dardos exigem um considerável pontaria por parte do atirador para infligir qualquer dano significante, apesar de peso relativamente baixo e seu preço barato pesarem a seu favor

tipo: thrown · duas mãos (ocupa ambos os slots): não

- nota: Venom: ao contrario do poison que causa 1d6 por turno, o Venom causa 2d6

| Nome         | Slug           | Tipo   | Tier (raw) | Preço | Disp. | Dano | CA  | Alvo | Duas mãos | Extra | Efeitos                                                                                               | Texto do efeito | Descrição / conteúdo |
| ------------ | -------------- | ------ | ---------- | ----- | ----- | ---- | --- | ---- | --------- | ----- | ----------------------------------------------------------------------------------------------------- | --------------- | -------------------- |
| Darts        | `darts`        | thrown | F (1)      | 30    | 96%   | 1d6  | —   | —    | não       | —     | —                                                                                                     | —               | —                    |
| Poison Darts | `poison-darts` | thrown | E (2)      | 95    | 87%   | 1d6  | —   | —    | não       | —     | aplica poison                                                                                         | Poison          | —                    |
| Dream Darts  | `dream-darts`  | thrown | D (3)      | 150   | 82%   | 1d6  | —   | —    | não       | —     | aplica sleep                                                                                          | Sleep           | —                    |
| Stun Darts   | `stun-darts`   | thrown | C (4)      | 210   | 74%   | 1d6  | —   | —    | não       | —     | aplica stop (toque)                                                                                   | Stop Toque      | —                    |
| Venom Darts  | `venom-darts`  | thrown | B (5)      | 265   | 65%   | 1d6  | —   | —    | não       | —     | aplica venom (toque) ⟶ nota: Venom: ao contrario do poison que causa 1d6 por turno, o Venom causa 2d6 | Venom Toque*    | —                    |
| Doom Darts   | `doom-darts`   | thrown | A (6)      | 315   | 56%   | 1d6  | —   | —    | não       | —     | aplica death (toque)                                                                                  | Death Touch     | —                    |

## Lojas Diversas (t24)

### Custos Diversos — 13 itens

tipo: misc · duas mãos (ocupa ambos os slots): não

- nota: Atente que estes valores servem apenas como
- nota: pontos iniciais, e não regras rígidas. Um grande
- nota: número de fatores pode afetar o preço final.

| Nome                                  | Slug                                   | Tipo    | Tier (raw) | Preço | Disp. | Dano | CA  | Alvo | Duas mãos | Extra | Efeitos | Texto do efeito | Descrição / conteúdo |
| ------------------------------------- | -------------------------------------- | ------- | ---------- | ----- | ----- | ---- | --- | ---- | --------- | ----- | ------- | --------------- | -------------------- |
| Refeição barata                       | `refeicao-barata`                      | service | —          | 10    | 99%   | —    | —   | —    | não       | —     | —       | —               | —                    |
| passagem de navio, curta distância    | `passagem-de-navio-curta-distancia`    | service | —          | 30    | 85%   | —    | —   | —    | não       | —     | —       | —               | —                    |
| Mapa de um local explorado            | `mapa-de-um-local-explorado`           | gear    | —          | 30    | 85%   | —    | —   | —    | não       | —     | —       | —               | —                    |
| Mapa mundo                            | `mapa-mundo`                           | gear    | —          | 50    | 70%   | —    | —   | —    | não       | —     | —       | —               | —                    |
| Refeição especial                     | `refeicao-especial`                    | service | —          | 70    | 70%   | —    | —   | —    | não       | —     | —       | —               | —                    |
| Bateria elétrica poderosa             | `bateria-eletrica-poderosa`            | gear    | —          | 100   | 60%   | —    | —   | —    | não       | —     | —       | —               | —                    |
| Chocobo Amarelo (diária)              | `chocobo-amarelo-diaria`               | service | —          | 125   | 60%   | —    | —   | —    | não       | —     | —       | —               | —                    |
| Chocobo Negro (diária)                | `chocobo-negro-diaria`                 | service | —          | 200   | 50%   | —    | —   | —    | não       | —     | —       | —               | —                    |
| Passagem de aeronave, curta distância | `passagem-de-aeronave-curta-distancia` | service | —          | 200   | 60%   | —    | —   | —    | não       | —     | —       | —               | —                    |
| Passagem de aeronave, distância média | `passagem-de-aeronave-distancia-media` | service | —          | 400   | 60%   | —    | —   | —    | não       | —     | —       | —               | —                    |
| Mapa, local obscuro ou perigoso       | `mapa-local-obscuro-ou-perigoso`       | gear    | —          | 500   | 40%   | —    | —   | —    | não       | —     | —       | —               | —                    |
| Carro, aluguel diário                 | `carro-aluguel-diario`                 | service | —          | 500   | 60%   | —    | —   | —    | não       | —     | —       | —               | —                    |
| Pequena mala                          | `pequena-mala`                         | gear    | —          | 500   | 70%   | —    | —   | —    | não       | —     | —       | —               | —                    |

### Inns e Hotéis — 4 itens

> Depois de um longo dia de compras, os jogadores podem querem uma cama em um Inn ou Hotel. Mas para saber quão prazeroso os resultados da noite de sono podem ser, vai depender da qualidade dos alojamentos. Todos os quartos se encaixam em um dos seguintes quatro índices. Quartos Miseráveis são os piores – barulhentos, sujos e com chances dos pertences sumirem durante a noite. Quartos Pobres são um …

tipo: service · duas mãos (ocupa ambos os slots): não

- nota: Apesar dos recursos disponíveis do grupo e condições poderem afetar qual tipo de alojamento eles pretendem ficar, o local também influencia na escolha. Cidades maiores frequentemente oferecem um núme…
- nota: Algumas vezes o grupo pode receber um quarto de aliados, conhecidos ou de um Personagem que resida no local. Neste caso, os custos são nulos. Para fins de simplificação, as despesas diárias estão inc…

| Nome      | Slug        | Tipo    | Tier (raw) | Preço | Disp. | Dano | CA  | Alvo | Duas mãos | Extra                       | Efeitos | Texto do efeito | Descrição / conteúdo |
| --------- | ----------- | ------- | ---------- | ----- | ----- | ---- | --- | ---- | --------- | --------------------------- | ------- | --------------- | -------------------- |
| Miserável | `miseravel` | service | —          | 10    | —     | —    | —   | —    | não       | tipoDeDescanso: Conveniente | —       | —               | —                    |
| Pobre     | `pobre`     | service | —          | 25    | —     | —    | —   | —    | não       | tipoDeDescanso: Viagem      | —       | —               | —                    |
| Normal    | `normal`    | service | —          | 100   | —     | —    | —   | —    | não       | tipoDeDescanso: Completo    | —       | —               | —                    |
| Luxuoso   | `luxuoso`   | service | —          | 500   | —     | —    | —   | —    | não       | tipoDeDescanso: Intensivo   | —       | —               | —                    |

### Kits — 14 itens

tipo: kit · duas mãos (ocupa ambos os slots): não

| Nome                 | Slug                   | Tipo | Tier (raw) | Preço | Disp. | Dano | CA  | Alvo | Duas mãos | Extra | Efeitos | Texto do efeito | Descrição / conteúdo                                                                                                                                                                |
| -------------------- | ---------------------- | ---- | ---------- | ----- | ----- | ---- | --- | ---- | --------- | ----- | ------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kit de Aventureiro   | `kit-de-aventureiro`   | kit  | —          | 50    | —     | —    | —   | —    | não       | —     | —       | —               | Uma mochila, uma corda de 15 metros, uma lanterna, um frasco de óleo, uma ração de viagem (10 dias), e um kit de primeiros socorros.                                                |
| Kit de Explorador    | `kit-de-explorador`    | kit  | —          | 100   | —     | —    | —   | —    | não       | —     | —       | —               | Uma mochila, uma corda de 15 metros, uma lanterna, 10 rações de viagem, um saco de dormir, uma capa de chuva, um mapa e uma bússola.                                                |
| Kit de Alquimista    | `kit-de-alquimista`    | kit  | —          | 200   | —     | —    | —   | —    | não       | —     | —       | —               | Um frasco de reagentes químicos, um caldeirão pequeno, uma bolsa de ervas, um livro de receitas e um frasco de veneno.                                                              |
| Kit de Ferreiro      | `kit-de-ferreiro`      | kit  | —          | 250   | —     | —    | —   | —    | não       | —     | —       | —               | Um martelo de ferreiro, uma bigorna, um conjunto de ferramentas de ferreiro, e um saco de carvão.                                                                                   |
| Kit de Armeiro       | `kit-de-armeiro`       | kit  | —          | 200   | —     | —    | —   | —    | não       | —     | —       | —               | Um conjunto de ferramentas de precisão para desmontagem e ajuste de armas, instrumentos de inspeção e acabamento de canos que permitem fabricar, modificar e reparar armas de fogo. |
| Kit de Cozinheiro    | `kit-de-cozinheiro`    | kit  | —          | 80    | —     | —    | —   | —    | não       | —     | —       | —               | Um conjunto de panelas e utensílios de cozinha, uma bolsa de especiarias, um livro de receitas e 10 rações de viagem.                                                               |
| Kit de Sobrevivência | `kit-de-sobrevivencia` | kit  | —          | 75    | —     | —    | —   | —    | não       | —     | —       | —               | Uma mochila, uma corda de 15 metros, um saco de dormir, um abrigo improvisado, uma lanterna, e um frasco de água potável.                                                           |
| Kit de Ladrão        | `kit-de-ladrao`        | kit  | —          | 120   | —     | —    | —   | —    | não       | —     | —       | —               | Um conjunto de ferramentas de ladrão, um manto escuro, um par de luvas, uma pequena lâmina e um frasco de óleo.                                                                     |
| Kit de Diplomata     | `kit-de-diplomata`     | kit  | —          | 200   | —     | —    | —   | —    | não       | —     | —       | —               | Um conjunto de documentos oficiais, uma pena e tinta, um livro de etiqueta, e uma capa elegante.                                                                                    |
| Kit de Sacerdote     | `kit-de-sacerdote`     | kit  | —          | 150   | —     | —    | —   | —    | não       | —     | —       | —               | Um livro de orações, uma túnica sagrada, um símbolo religioso, um frasco de água benta, e um conjunto de velas.                                                                     |
| Kit de Estudioso     | `kit-de-estudioso`     | kit  | —          | 180   | —     | —    | —   | —    | não       | —     | —       | —               | Um conjunto de livros acadêmicos, um caderno de anotações, uma pena e tinta, um par de óculos de leitura, e uma pequena bolsa de pergaminhos.                                       |
| Kit de Disfarce      | `kit-de-disfarce`      | kit  | —          | 130   | —     | —    | —   | —    | não       | —     | —       | —               | Um conjunto de roupas variadas, um chapéu, uma máscara, uma bolsa de maquiagem, e um livro de truques e disfarces.                                                                  |
| Kit de Artista       | `kit-de-artista`       | kit  | —          | 90    | —     | —    | —   | —    | não       | —     | —       | —               | Um conjunto de tintas, pincéis, um bloco de esboços, uma tela e um conjunto de lápis e carvão.                                                                                      |
| Kit de Eremita       | `kit-de-eremita`       | kit  | —          | 170   | —     | —    | —   | —    | não       | —     | —       | —               | Um manto de pele, um cajado, um livro de sabedoria antiga, um saco de ervas curativas, e uma pequena cabana portátil.                                                               |

### Kits a parte — 71 itens

tipo: gear · duas mãos (ocupa ambos os slots): não

| Nome                      | Slug                        | Tipo | Tier (raw) | Preço | Disp. | Dano | CA  | Alvo | Duas mãos | Extra | Efeitos | Texto do efeito | Descrição / conteúdo                                                     |
| ------------------------- | --------------------------- | ---- | ---------- | ----- | ----- | ---- | --- | ---- | --------- | ----- | ------- | --------------- | ------------------------------------------------------------------------ |
| Ferramentas de Ladrão     | `ferramentas-de-ladrao`     | gear | —          | 60    | —     | —    | —   | —    | não       | —     | —       | —               | Conjunto de ferramentas para abrir fechaduras e desarmar armadilhas.     |
| Manto Escuro              | `manto-escuro`              | gear | —          | 40    | —     | —    | —   | —    | não       | —     | —       | —               | Manto que ajuda a se esconder nas sombras e se misturar com a escuridão. |
| Luvas de Ladrão           | `luvas-de-ladrao`           | gear | —          | 30    | —     | —    | —   | —    | não       | —     | —       | —               | Luvas que aumentam a destreza e a habilidade de manipulação.             |
| Pequena Lâmina            | `pequena-lamina`            | gear | —          | 25    | —     | —    | —   | —    | não       | —     | —       | —               | Lâmina afiada, útil para combate e situações de emergência.              |
| Frasco de Óleo            | `frasco-de-oleo`            | gear | —          | 15    | —     | —    | —   | —    | não       | —     | —       | —               | Óleo que pode ser usado para lubrificar fechaduras ou disfarçar rastros. |
| Documentos Oficiais       | `documentos-oficiais`       | gear | —          | 70    | —     | —    | —   | —    | não       | —     | —       | —               | Papéis que conferem autoridade e credibilidade diplomática.              |
| Pena e Tinta              | `pena-e-tinta`              | gear | —          | 20    | —     | —    | —   | —    | não       | —     | —       | —               | Material para redigir documentos e correspondências importantes.         |
| Selos de Cera             | `selos-de-cera`             | gear | —          | 10    | —     | —    | —   | —    | não       | —     | —       | —               | Selos usados para autenticar documentos e correspondências.              |
| Roupas Elegantes          | `roupas-elegantes`          | gear | —          | 50    | —     | —    | —   | —    | não       | —     | —       | —               | Vestimentas formais que conferem um ar de nobreza e respeito.            |
| Dicionário de Línguas     | `dicionario-de-linguas`     | gear | —          | 40    | —     | —    | —   | —    | não       | —     | —       | —               | Livro para ajudar na tradução e comunicação com diferentes culturas.     |
| Símbolo Sagrado           | `simbolo-sagrado`           | gear | —          | 60    | —     | —    | —   | —    | não       | —     | —       | —               | Objeto religioso usado para práticas e rituais de fé.                    |
| Vestimentas Sacerdotais   | `vestimentas-sacerdotais`   | gear | —          | 50    | —     | —    | —   | —    | não       | —     | —       | —               | Roupas cerimoniais usadas em serviços religiosos e rituais.              |
| Livros de Oração          | `livros-de-oracao`          | gear | —          | 25    | —     | —    | —   | —    | não       | —     | —       | —               | Livros contendo orações e preces para uso em rituais.                    |
| Incenso                   | `incenso`                   | gear | —          | 15    | —     | —    | —   | —    | não       | —     | —       | —               | Usado para criar um ambiente sagrado durante os rituais.                 |
| Cálice Ritual             | `calice-ritual`             | gear | —          | 30    | —     | —    | —   | —    | não       | —     | —       | —               | Cálice utilizado para cerimônias e rituais sagrados.                     |
| Livros de Referência      | `livros-de-referencia`      | gear | —          | 80    | —     | —    | —   | —    | não       | —     | —       | —               | Livros sobre diversas matérias e áreas de estudo.                        |
| Caneta e Tinteiro         | `caneta-e-tinteiro`         | gear | —          | 20    | —     | —    | —   | —    | não       | —     | —       | —               | Material para fazer anotações e redigir textos acadêmicos.               |
| Lupa                      | `lupa`                      | gear | —          | 15    | —     | —    | —   | —    | não       | —     | —       | —               | Óptica para examinar textos e objetos pequenos com detalhe.              |
| Roupas de Estudo          | `roupas-de-estudo`          | gear | —          | 30    | —     | —    | —   | —    | não       | —     | —       | —               | Roupas confortáveis para longas sessões de leitura e pesquisa.           |
| Mapa e Diagramas          | `mapa-e-diagramas`          | gear | —          | 25    | —     | —    | —   | —    | não       | —     | —       | —               | Mapas e diagramas para estudo e pesquisa de locais e fenômenos.          |
| Máscaras de Disfarce      | `mascaras-de-disfarce`      | gear | —          | 60    | —     | —    | —   | —    | não       | —     | —       | —               | Máscaras que alteram a aparência do usuário.                             |
| Roupas de Disfarce        | `roupas-de-disfarce`        | gear | —          | 40    | —     | —    | —   | —    | não       | —     | —       | —               | Roupas que ajudam a mudar a aparência e identidade do usuário.           |
| Pós e Maquiagem           | `pos-e-maquiagem`           | gear | —          | 20    | —     | —    | —   | —    | não       | —     | —       | —               | Produtos para alterar características faciais e corporais.               |
| Peruca                    | `peruca`                    | gear | —          | 15    | —     | —    | —   | —    | não       | —     | —       | —               | Peruca para mudar a cor e estilo do cabelo.                              |
| Kit de Falsificação       | `kit-de-falsificacao`       | gear | —          | 35    | —     | —    | —   | —    | não       | —     | —       | —               | Ferramentas para criar documentos e identidades falsas.                  |
| Material de Pintura       | `material-de-pintura`       | gear | —          | 50    | —     | —    | —   | —    | não       | —     | —       | —               | Tintas e pincéis para criar obras de arte.                               |
| Caderno de Desenho        | `caderno-de-desenho`        | gear | —          | 20    | —     | —    | —   | —    | não       | —     | —       | —               | Caderno para esboçar e planejar trabalhos artísticos.                    |
| Escultura em Pedra        | `escultura-em-pedra`        | gear | —          | 70    | —     | —    | —   | —    | não       | —     | —       | —               | Ferramentas para esculpir e criar obras de arte em pedra.                |
| Paleta de Cores           | `paleta-de-cores`           | gear | —          | 15    | —     | —    | —   | —    | não       | —     | —       | —               | Paleta para misturar e aplicar cores.                                    |
| Roupas de Pintura         | `roupas-de-pintura`         | gear | —          | 25    | —     | —    | —   | —    | não       | —     | —       | —               | Roupas usadas para proteger a vestimenta durante a pintura.              |
| Altar Pessoal             | `altar-pessoal`             | gear | —          | 80    | —     | —    | —   | —    | não       | —     | —       | —               | Espaço sagrado para meditação e práticas solitárias.                     |
| Roupas de Eremita         | `roupas-de-eremita`         | gear | —          | 30    | —     | —    | —   | —    | não       | —     | —       | —               | Vestimentas simples e práticas para vida em isolamento.                  |
| Diário de Meditação       | `diario-de-meditacao`       | gear | —          | 20    | —     | —    | —   | —    | não       | —     | —       | —               | Livro para registrar pensamentos e experiências espirituais.             |
| Kit de Herbologia         | `kit-de-herbologia`         | gear | —          | 40    | —     | —    | —   | —    | não       | —     | —       | —               | Ferramentas e materiais para cultivo e uso de ervas medicinais.          |
| Cesta de Provisões        | `cesta-de-provisoes`        | gear | —          | 35    | —     | —    | —   | —    | não       | —     | —       | —               | Cesta com alimentos e itens essenciais para sobrevivência.               |
| Espada Curta              | `espada-curta`              | gear | —          | 50    | —     | —    | —   | —    | não       | —     | —       | —               | Arma leve e versátil, ideal para combate rápido.                         |
| Escudo Pequeno            | `escudo-pequeno`            | gear | —          | 40    | —     | —    | —   | —    | não       | —     | —       | —               | Escudo leve para proteção básica em combate.                             |
| Roupas de Aventura        | `roupas-de-aventura`        | gear | —          | 30    | —     | —    | —   | —    | não       | —     | —       | —               | Roupas resistentes e práticas para exploração e combate.                 |
| Kit de Primeiros Socorros | `kit-de-primeiros-socorros` | gear | —          | 25    | —     | —    | —   | —    | não       | —     | —       | —               | Material básico para tratar ferimentos e lesões.                         |
| Lanterna                  | `lanterna`                  | gear | —          | 20    | —     | —    | —   | —    | não       | —     | —       | —               | Fonte de luz portátil para iluminar o caminho.                           |
| Corda de 10m              | `corda-de-10m`              | gear | —          | 15    | —     | —    | —   | —    | não       | —     | —       | —               | Corda robusta para escalar ou prender objetos.                           |
| Mapa e Compasso           | `mapa-e-compasso`           | gear | —          | 60    | —     | —    | —   | —    | não       | —     | —       | —               | Equipamento essencial para navegação e orientação.                       |
| Corda de 30m              | `corda-de-30m`              | gear | —          | 25    | —     | —    | —   | —    | não       | —     | —       | —               | Corda longa e resistente para exploração e escalada.                     |
| Roupas Resistentes        | `roupas-resistentes`        | gear | —          | 40    | —     | —    | —   | —    | não       | —     | —       | —               | Roupas duráveis para suportar diversos ambientes.                        |
| Kit de Escalada           | `kit-de-escalada`           | gear | —          | 35    | —     | —    | —   | —    | não       | —     | —       | —               | Equipamentos para escalada e travessia de terrenos difíceis.             |
| Binóculos                 | `binoculos`                 | gear | —          | 30    | —     | —    | —   | —    | não       | —     | —       | —               | Lentes para observar e analisar a distância.                             |
| Ração de Emergência       | `racao-de-emergencia`       | gear | —          | 20    | —     | —    | —   | —    | não       | —     | —       | —               | Alimentos não perecíveis para situações de emergência.                   |
| Frascos de Reagentes      | `frascos-de-reagentes`      | gear | —          | 70    | —     | —    | —   | —    | não       | —     | —       | —               | Frascos contendo diversos reagentes para poções e elixires.              |
| Caleidoscópio de Vidro    | `caleidoscopio-de-vidro`    | gear | —          | 25    | —     | —    | —   | —    | não       | —     | —       | —               | Instrumento para observar e misturar substâncias.                        |
| Livro de Fórmulas         | `livro-de-formulas`         | gear | —          | 50    | —     | —    | —   | —    | não       | —     | —       | —               | Livro com receitas e fórmulas para poções e elixires.                    |
| Kit de Mistura            | `kit-de-mistura`            | gear | —          | 30    | —     | —    | —   | —    | não       | —     | —       | —               | Utensílios para misturar e preparar ingredientes.                        |
| Recipientes Vários        | `recipientes-varios`        | gear | —          | 20    | —     | —    | —   | —    | não       | —     | —       | —               | Frascos e potes para armazenar substâncias e poções.                     |
| Proteção de Vidro         | `protecao-de-vidro`         | gear | —          | 40    | —     | —    | —   | —    | não       | —     | —       | —               | Equipamento de segurança para proteger contra vapores e reações.         |
| Martelo de Ferreiro       | `martelo-de-ferreiro`       | gear | —          | 80    | —     | —    | —   | —    | não       | —     | —       | —               | Martelo robusto para forjar e modelar metais.                            |
| Bigorna                   | `bigorna`                   | gear | —          | 100   | —     | —    | —   | —    | não       | —     | —       | —               | Plataforma resistente para trabalhar metais.                             |
| Torno de Ferreiro         | `torno-de-ferreiro`         | gear | —          | 120   | —     | —    | —   | —    | não       | —     | —       | —               | Equipamento para girar e moldar peças de metal.                          |
| Carvão e Forno            | `carvao-e-forno`            | gear | —          | 60    | —     | —    | —   | —    | não       | —     | —       | —               | Carvão para aquecer e derreter metais.                                   |
| Pinças e Ferramentas      | `pincas-e-ferramentas`      | gear | —          | 30    | —     | —    | —   | —    | não       | —     | —       | —               | Ferramentas essenciais para manusear metais quentes.                     |
| Roupas de Proteção        | `roupas-de-protecao`        | gear | —          | 40    | —     | —    | —   | —    | não       | —     | —       | —               | Roupas resistentes ao calor e faíscas do ferreiro.                       |
| Facas de Cozinha          | `facas-de-cozinha`          | gear | —          | 30    | —     | —    | —   | —    | não       | —     | —       | —               | Facas afiadas para preparar e cortar alimentos.                          |
| Panelas e Caçarolas       | `panelas-e-cacarolas`       | gear | —          | 50    | —     | —    | —   | —    | não       | —     | —       | —               | Utensílios essenciais para cozinhar e preparar pratos.                   |
| Roupas de Cozinheiro      | `roupas-de-cozinheiro`      | gear | —          | 25    | —     | —    | —   | —    | não       | —     | —       | —               | Roupas práticas e limpas para cozinhar.                                  |
| Tempero e Especiarias     | `tempero-e-especiarias`     | gear | —          | 20    | —     | —    | —   | —    | não       | —     | —       | —               | Conjunto de temperos para dar sabor aos pratos.                          |
| Cesta de Ingredientes     | `cesta-de-ingredientes`     | gear | —          | 35    | —     | —    | —   | —    | não       | —     | —       | —               | Ingredientes básicos e frescos para cozinhar.                            |
| Livro de Receitas         | `livro-de-receitas`         | gear | —          | 30    | —     | —    | —   | —    | não       | —     | —       | —               | Livro com diversas receitas e métodos de preparação.                     |
| Corda de 20m              | `corda-de-20m`              | gear | —          | 25    | —     | —    | —   | —    | não       | —     | —       | —               | Corda robusta para várias utilidades de sobrevivência.                   |
| Kit de Primeiro Socorros  | `kit-de-primeiro-socorros`  | gear | —          | 30    | —     | —    | —   | —    | não       | —     | —       | —               | Material para tratar ferimentos e lesões.                                |
| Faca de Sobrevivência     | `faca-de-sobrevivencia`     | gear | —          | 40    | —     | —    | —   | —    | não       | —     | —       | —               | Faca resistente para cortar e preparar materiais.                        |
| Roupas de Proteção        | `roupas-de-protecao-2`      | gear | —          | 35    | —     | —    | —   | —    | não       | —     | —       | —               | Roupas resistentes e práticas para ambientes hostis.                     |
| Ração de Emergência       | `racao-de-emergencia-2`     | gear | —          | 20    | —     | —    | —   | —    | não       | —     | —       | —               | Alimentos duráveis para situações de emergência.                         |
| Abridor de Fogo           | `abridor-de-fogo`           | gear | —          | 15    | —     | —    | —   | —    | não       | —     | —       | —               | Ferramenta para acender fogo em qualquer condição.                       |

## Livraria (t53)

### Grimórios / Livro de Magia — 6 itens

> O que é um Grimório? Um grimório é um livro ou tom que contém uma coleção de feitiçarias, encantamentos e rituais mágicos. O grimório é crucial para qualquer personagem que use magia de forma estruturada, especialmente os magos. Os feitiços contidos no grimório só podem ser usados com o grimório em mãos, ou seja, não são feitiços aprendíveis

tipo: grimoire · duas mãos (ocupa ambos os slots): não

| Nome                                 | Slug                                   | Tipo     | Tier (raw) | Preço | Disp. | Dano | CA  | Alvo | Duas mãos | Extra                       | Efeitos | Texto do efeito | Descrição / conteúdo |
| ------------------------------------ | -------------------------------------- | -------- | ---------- | ----- | ----- | ---- | --- | ---- | --------- | --------------------------- | ------- | --------------- | -------------------- |
| Grimório do Mago Iniciante           | `grimorio-do-mago-iniciante`           | grimoire | —          | 500   | —     | —    | —   | —    | não       | formatoTabela: html-table   | —       | —               | 10 magias            |
| Grimório do Mago Branco Iniciante    | `grimorio-do-mago-branco-iniciante`    | grimoire | —          | 500   | —     | —    | —   | —    | não       | formatoTabela: html-table   | —       | —               | 10 magias            |
| Grimório do Mago do tempo Iniciante  | `grimorio-do-mago-do-tempo-iniciante`  | grimoire | —          | 500   | —     | —    | —   | —    | não       | formatoTabela: html-table   | —       | —               | 10 magias            |
| Grimório do Espiritualista Iniciante | `grimorio-do-espiritualista-iniciante` | grimoire | —          | 500   | —     | —    | —   | —    | não       | formatoTabela: line-grid    | —       | —               | 10 magias            |
| Grimório do Necromante Iniciante     | `grimorio-do-necromante-iniciante`     | grimoire | —          | 500   | —     | —    | —   | —    | não       | formatoTabela: html-table   | —       | —               | 10 magias            |
| Grimório do Invocador Iniciante      | `grimorio-do-invocador-iniciante`      | grimoire | —          | 500   | —     | —    | —   | —    | não       | formatoTabela: bbcode-table | —       | —               | 10 magias            |

#### Grimório do Mago Iniciante — 500 Gil (10 magias)

| Magia           | Custo de mana | Círculo       | Extra | Descrição                                                                                  |
| --------------- | ------------- | ------------- | ----- | ------------------------------------------------------------------------------------------ |
| Corda Mágica    | 5             | null (manual) | —     | Cria uma corda de 15 metros que pode ser usada para amarrar ou subir.                      |
| Luz             | 3             | null (manual) | —     | Cria uma esfera de luz mágica que ilumina uma área de 6 metros de raio.                    |
| Míssil Mágico   | 6             | null (manual) | —     | Lança um projétil mágico que causa 1d4 + 1 de dano.                                        |
| Escudo Arcano   | 8             | null (manual) | —     | Cria um campo de força que confere +2 de bônus na CA até o início do próximo turno.        |
| Identificar     | 4             | null (manual) | —     | Revela propriedades mágicas e características de um item ou objeto.                        |
| Compreensão     | 5             | null (manual) | —     | Permite entender e falar uma língua desconhecida por 1 hora.                               |
| Sono            | 7             | null (manual) | —     | Coloca um grupo de criaturas em um sono mágico por 1 minuto ou até serem acordadas.        |
| Armadura Mágica | 6             | null (manual) | —     | Cria uma armadura mágica que concede +1 de bônus na CA por 1 hora.                         |
| Ray of Frost    | 6             | null (manual) | —     | Lança um raio de gelo que causa 1d8 de dano e reduz a velocidade do alvo em 3 metros por … |
| Missiva Mágica  | 4             | null (manual) | —     | Permite enviar uma mensagem de até 25 palavras para qualquer criatura que você possa ver … |

#### Grimório do Mago Branco Iniciante — 500 Gil (10 magias)

| Magia                   | Custo de mana | Círculo       | Extra | Descrição                                                                                  |
| ----------------------- | ------------- | ------------- | ----- | ------------------------------------------------------------------------------------------ |
| Escudo de Luz           | 6             | null (manual) | —     | Cria uma barreira de luz mágica que confere +2 de bônus na CA até o início do próximo tur… |
| Proteção contra Energia | 7             | null (manual) | —     | Concede resistência a um tipo de dano (fogo, gelo, eletricidade, etc.) por 1 hora.         |
| Escudo da Fé            | 6             | null (manual) | —     | Cria um escudo mágico que concede +2 de bônus na CA por 1 hora.                            |
| Barreira Mágica         | 9             | null (manual) | —     | Cria uma parede de força que dura 10 minutos e bloqueia o caminho de inimigos.             |
| Repelir Inimigos        | 8             | null (manual) | —     | Cria uma aura de energia que afasta criaturas hostis em um raio de 3 metros, forçando-as … |
| Manto Protetor          | 7             | null (manual) | —     | Concede uma proteção mágica que dá resistência a dano de energia (fogo, gelo, eletricidad… |
| Círculo de Proteção     | 10            | null (manual) | —     | Cria um círculo mágico com 2 metros de diâmetro que impede o ingresso de criaturas malign… |
| Campo de Força          | 11            | null (manual) | —     | Cria um campo de força que confere cobertura total em uma área de 1 metro quadrado, bloqu… |
| Escudo de Energia       | 8             | null (manual) | —     | Cria um escudo que absorve até 1d10 pontos de dano mágico direcionado ao conjurador ou a … |
| Aura de Proteção        | 9             | null (manual) | —     | Concede +1 de bônus na CA e em todos os testes de resistência para todos os aliados em um… |

#### Grimório do Mago do tempo Iniciante — 500 Gil (10 magias)

| Magia              | Custo de mana | Círculo       | Extra | Descrição                                                                                  |
| ------------------ | ------------- | ------------- | ----- | ------------------------------------------------------------------------------------------ |
| Visão do Futuro    | 7             | null (manual) | —     | Permite ao conjurador ver brevemente eventos que ocorrerão nos próximos 10 minutos, forne… |
| Reversão Breve     | 10            | null (manual) | —     | Permite reverter os últimos 6 segundos de eventos em um raio de 3 metros, corrigindo açõe… |
| Espelho do Passado | 7             | null (manual) | —     | Cria uma imagem do passado recente (até 10 minutos) que pode ser observada para obter inf… |
| Alterar Fluxo      | 9             | null (manual) | —     | Permite alterar a iniciativa de uma criatura, fazendo-a agir antes ou depois de outro per… |
| Desvio Temporal    | 8             | null (manual) | —     | Cria uma brecha temporal que desvia um ataque direcionado a você ou um aliado, com 50% de… |
| Veloz Reflexo      | 7             | null (manual) | —     | Concede vantagem em testes de Destreza e saves contra efeitos que exigem reações rápidas … |
| Cápsula Temporal   | 10            | null (manual) | —     | Cria uma pequena esfera de tempo que protege um item ou criatura de qualquer dano ou efei… |
| Salto Temporal     | 12            | null (manual) | —     | Permite ao conjurador se teletransportar até 10 metros para um local que tenha visto rece… |
| Reparo Instantâneo | 8             | null (manual) | —     | Repara pequenos danos em objetos e estruturas em um raio de 3 metros, como se eles tivess… |
| Retorno à Ordem    | 9             | null (manual) | —     | Corrige pequenas disrupções temporais, como a desorganização de documentos ou itens, rest… |

#### Grimório do Espiritualista Iniciante — 500 Gil (10 magias)

| Magia                  | Custo de mana | Círculo       | Extra | Descrição                                                                                  |
| ---------------------- | ------------- | ------------- | ----- | ------------------------------------------------------------------------------------------ |
| Oráculo de Almas       | 8             | null (manual) | —     | Permite ao conjurador realizar uma leitura do futuro próximo ou dos eventos passados, rev… |
| Campo de Claridade     | 9             | null (manual) | —     | Cria uma área de claridade espiritual que revela ilusões e enganos, permitindo ver a verd… |
| Invocação de Aura      | 10            | null (manual) | —     | Permite ao conjurador invocar uma aura espiritual ao seu redor, conferindo resistência a … |
| Espectro Protetor      | 10            | null (manual) | —     | Invoca um espectro protetor que flutua ao redor do conjurador, absorvendo uma quantidade … |
| Proteção de Espírito   | 8             | null (manual) | —     | Concede um bônus de +2 na CA contra ataques de criaturas sobrenaturais e espirituais por … |
| Visão do Destino       | 9             | null (manual) | —     | Permite ao conjurador obter uma visão geral das consequências possíveis de uma decisão im… |
| Comunicação Espiritual | 7             | null (manual) | —     | Facilita a comunicação com espíritos específicos ou entidades espirituais, permitindo ao … |
| Escudo Espiritual      | 10            | null (manual) | —     | Cria um escudo espiritual ao redor do conjurador ou de um aliado, oferecendo proteção con… |
| Luz Espiritual         | 8             | null (manual) | —     | Emite uma luz suave e espiritual que revela a presença de espíritos e seres sobrenaturais… |
| Visão de Presença      | 7             | null (manual) | —     | Permite ao conjurador perceber a presença de entidades espirituais em um raio de 30 metro… |

#### Grimório do Necromante Iniciante — 500 Gil (10 magias)

| Magia                     | Custo de mana | Círculo       | Extra | Descrição                                                                                  |
| ------------------------- | ------------- | ------------- | ----- | ------------------------------------------------------------------------------------------ |
| Invocação de Alma Perdida | 12            | null (manual) | —     | Permite ao necromante invocar e interrogar uma alma perdida para obter informações sobre … |
| Visão do Além             | 10            | null (manual) | —     | Permite ao necromante ver através de ilusões e detectar presenças ocultas, como espíritos… |
| Necrose                   | 11            | null (manual) | —     | Aumenta a velocidade de deterioração de materiais não-mágicos, como madeira e tecido, tor… |
| Enxergar Almas            | 12            | null (manual) | —     | Permite ao necromante ver e identificar almas e entidades não-mortas em uma área ao seu r… |
| Cadáver Espectral         | 11            | null (manual) | —     | Reanima um cadáver em um estado etéreo, permitindo que o necromante use o corpo para real… |
| Miasma de Desolação       | 12            | null (manual) | —     | Cria uma nuvem de energia necromântica que enfraquece as defesas dos inimigos e reduz sua… |
| Olho de Fantasma          | 10            | null (manual) | —     | Permite ao necromante enviar uma pequena projeção de energia necromântica para explorar á… |
| Ressurreição Breve        | 12            | null (manual) | —     | Reanima um cadáver para realizar uma tarefa específica ou responder a uma pergunta simple… |
| Caminho das Almas         | 11            | null (manual) | —     | Cria um caminho visível para almas perdidas ou entidades não-mortas, facilitando a sua mo… |
| Escudo de Ossos           | 12            | null (manual) | —     | Cria uma barreira temporária de ossos que absorve parte do dano recebido e protege o necr… |

#### Grimório do Invocador Iniciante — 500 Gil (10 magias)

| Magia                     | Custo de mana | Círculo       | Extra                                                                               | Descrição                                                                                  |
| ------------------------- | ------------- | ------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Chamado do Importuno      | 10            | null (manual) | dano: 2d6 de dano espectral                                                         | Invoca um espírito de pequena dimensão para atacar um inimigo com um golpe etéreo, causan… |
| Garras do Demônio Menor   | 12            | null (manual) | dano: 2d6 de dano de fogo                                                           | Convoca um demônio de pequeno porte que ataca com garras flamejantes. O demônio realiza o… |
| Lança do Arconte          | 11            | null (manual) | dano: 2d8 de dano radiante                                                          | Invoca uma lâmina de luz celestial que é arremessada contra o inimigo, causando dano radi… |
| Beijo da Serpente         | 12            | null (manual) | dano: 2d6 de dano venenoso (e 1d4 de dano venenoso adicional por 1d4 turnos)        | Chama uma serpente espectral que dá uma mordida venenosa no alvo. A serpente se dissipa l… |
| Raios de Fogo Infernal    | 13            | null (manual) | dano: 3d6 de dano de fogo (1d6 por raio, 3 raios no total)                          | Invoca pequenos raios de fogo que atacam o inimigo em rápida sucessão. Após o ataque, o f… |
| Arremesso de Pedra Mágica | 11            | null (manual) | dano: 2d6 de dano de impacto                                                        | Convoca uma pedra mágica que é lançada contra o inimigo, causando dano de impacto. A pedr… |
| Rugido do Guardião        | 12            | null (manual) | dano: 2d6 de dano psíquico                                                          | Invoca uma manifestação fantasmagórica que emite um rugido aterrorizante e causa dano psí… |
| Espada Etérea             | 11            | null (manual) | dano: 2d8 de dano de energia                                                        | Cria uma espada de energia que é usada para um golpe direto no inimigo. A espada desapare… |
| Fúria do Elemental Menor  | 13            | null (manual) | dano: 2d6 de dano elemental (especificar o tipo de elemento)                        | Invoca um elemental pequeno que realiza um ataque elemental (fogo, água, terra ou ar) e s… |
| Lança de Gelo             | 12            | null (manual) | dano: 2d6 de dano de gelo (e -1 de penalidade na velocidade do alvo por 1d4 turnos) | Convoca uma lança de gelo que é lançada contra o inimigo, causando dano de gelo e uma bre… |

## Itens do app (candidatos)

### Dado Oogie Boogie

- origem: `app` · tipo: event · slug: `dado-oogie-boogie`
- imagem: https://media.discordapp.net/attachments/809553569464320030/1441550953689124874/ChatGPT_Image_21_de_nov._de_2025_19_07_55.png — ⚠ link do Discord, expira: marcado `needs-image-reupload` (não baixada)
- descrição: Um dado verde de 12 lados que é lançado em meio ao campo, seu resultado é um completo mistério até que seu número seja revelado. Efeito: Uma vez por dia, o jogador pode rolar o Dado do Oogie Boogie. O efeito será um dos mesmos que ocorreu durante o evento, mas todos voltados ao jogador que o utilizou, podendo ser uma sorte grande ou um azar infortuno

## Propriedades (glossário do t280)

- **Acuidade** — Quando realizar um ataque com uma arma com a propriedade acuidade, você pode escolher usar seu modificador de Força ou de Destreza para realizar a jogada de at…
- **Alcance** — Essa arma adiciona 1 metro ao seu alcance quando você a usa para atacar. Essa propriedade também determina seu alcance ao realizar ataques de oportunidade com …
- **Arremesso** — Se uma arma possuir a propriedade arremesso, você pode arremessar a arma para realizar um ataque à distância. Se essa arma for uma arma de ataque corpo a corpo…
- **Distância** — Uma arma que pode ser usada para realizar ataques à distância possui a distância especificada na categoria da arma. O alcance lista dois números: o primeiro é …
- **Duas Mãos** — Essa arma requer as duas mãos para ser usada. Essa propriedade só é relevante quando você ataca com a arma, não enquanto apenas a segura.
- **Leve** — Uma arma leve é pequena e de fácil manuseio, tornando-a ideal para usar quando você está combatendo com duas armas. Quando você realiza a ação de Ataque e atac…
- **Munição** — Você pode usar uma arma que tenha a propriedade munição para realizar um ataque à distância, apenas se possuir munição para disparar a arma. Cada vez que você …
- **Pesada** — Criaturas pequenas têm desvantagem nas jogadas de ataque com estas armas. O tamanho e o peso de uma arma pesada tornam-na muito grande para ser empunhada efici…
- **Recarga** — Devido ao tempo necessário para recarregar essa arma, você pode disparar apenas uma peça de munição da arma quando usa uma ação, ação bônus ou reação para disp…
- **Versátil** — Essa arma pode ser usada com uma ou duas mãos. Um valor de dano aparece entre parênteses com a propriedade — é o dano da arma quando usada com as duas mãos par…
- **Projétil Mágico** — Essa arma possui um projétil mágico, que para efeitos de resistência de dano, é considerado como um golpe de arma mágica. Esse projétil também é infinito, não …
- **Mágico** — Essa arma também aplica o bônus de refinamento para acerto e dano de magias conjuradas pelo portador da arma.
- **Especial** — Uma arma com a propriedade especial possui regras diferenciadas que detalham seu uso, explicado na descrição da arma (veja "Especiais" mais adiante).

Refinamento: máximo +9, +1 por nível, armas à distância +1m de alcance por nível.

## Efeitos (282)

| Escopo           | Seção           | Nome                             | Chave                            | Mecânica estruturada                                 | Observação             | Texto                                                                                                                                        |
| ---------------- | --------------- | -------------------------------- | -------------------------------- | ---------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| efeitosEscudos   | Escudos         | Resistência a Venenos            | `resistenciaAVenenos`            | —                                                    | —                      | Uma armadura ou escudo com esta habilidade especial concede ao usuário um bônus de +2 em testes de resistência contra venenos.               |
| efeitosEscudos   | Escudos         | Atração de Flechas               | `atracaoDeFlechas`               | —                                                    | —                      | Um escudo com esta habilidade atrai ataques de armas à distância para si. Ele concede um bônus de CA de +1 contra armas à distância (por ní… |
| efeitosEscudos   | Escudos         | Escudo de Impacto                | `escudoDeImpacto`                | —                                                    | —                      | Um escudo com esta habilidade especial é projetado para realizar investidas com escudo. Ele causa dano como se fosse uma arma de impacto um… |
| efeitosEscudos   | Escudos         | Ofuscante                        | `ofuscante`                      | —                                                    | —                      | Um escudo com esta habilidade emite um clarão de luz intensa até duas vezes por dia, por comando do portador. Exceto pelo portador, qualque… |
| efeitosEscudos   | Escudos         | Retumbante                       | `retumbante`                     | —                                                    | —                      | Um escudo com esta habilidade emite um som estrondoso quando é atingido em combate. Como uma reação, ao ser acertado por um ataque contunde… |
| efeitosEscudos   | Escudos         | Desafiante                       | `desafiante`                     | —                                                    | —                      | Armaduras e escudos com esta habilidade especial são especialmente eficazes contra certos tipos de criaturas, de forma semelhante a uma arm… |
| efeitosEscudos   | Escudos         | Fortificação                     | `fortificacao`                   | —                                                    | —                      | Esta armadura ou escudo gera uma força mágica que protege com mais eficácia as áreas vitais do usuário. Quando o portador sofre um ataque f… |
| efeitosEscudos   | Escudos         | Esmagadora                       | `esmagadora`                     | —                                                    | —                      | Uma armadura ou escudo com esta habilidade especial é coberto de farpas e serrilhas afiadas que serram e rasgam qualquer criatura que tente… |
| efeitosEscudos   | Escudos         | Impenetrável                     | `impenetravel`                   | —                                                    | —                      | Uma armadura ou escudo com esta habilidade especial é extremamente resistente. Seu bônus de aprimoramento é dobrado para fins de determinar… |
| efeitosEscudos   | Escudos         | Espelhada                        | `espelhada`                      | —                                                    | —                      | A superfície polida de uma armadura ou escudo com esta habilidade reflete como um espelho comum. Além disso, ela auxilia o usuário contra c… |
| efeitosEscudos   | Escudos         | Investida                        | `investida`                      | —                                                    | —                      | Esses escudos são robustamente construídos e frequentemente exibem o símbolo de um carneiro ou touro. Quando o portador de um escudo com es… |
| efeitosEscudos   | Escudos         | Estimulante                      | `estimulante`                    | —                                                    | —                      | Essa armadura ou escudo tem acabamento altamente polido, com uma superfície brilhante como um espelho, e é magicamente imbuído com a capaci… |
| efeitosEscudos   | Escudos         | Sopro do Dragão                  | `soproDoDragao`                  | —                                                    | —                      | Um escudo com essa habilidade geralmente apresenta a imagem de uma boca de dragão aberta em sua parte frontal. Ele é associado a um tipo es… |
| efeitosEscudos   | Escudos         | Animado                          | `animado`                        | —                                                    | —                      | Como uma ação de movimento, um escudo com essa habilidade pode ser solto para se defender sozinho. Pelos próximos 4 turnos, impede ataques … |
| efeitosEscudos   | Escudos         | Desviar Flechas                  | `desviarFlechas`                 | —                                                    | —                      | Este escudo protege o portador como se ele possuísse o talento Desviar Flechas. Uma vez por rodada, quando seria normalmente atingido por u… |
| efeitosEscudos   | Escudos         | Resistência à Magia              | `resistenciaAMagia`              | —                                                    | —                      | Esta habilidade concede resistência 2 (+1 por aprimoramento) à magia ao portador da armadura ou escudo enquanto estiver usando o item.       |
| efeitosEscudos   | Escudos         | Refúgio Vivo                     | `refugioVivo`                    | —                                                    | —                      | Uma armadura ou escudo com essa habilidade especial pode abrigar animais vivos em sua iconografia mágica para protegê-los. O portador pode … |
| efeitosEscudos   | Escudos         | Radiante                         | `radiante`                       | —                                                    | —                      | Armaduras e escudos com essa habilidade especial brilham com a intensidade de uma tocha enquanto estiverem sendo usados. Essa luz pode ser … |
| efeitosEscudos   | Escudos         | Toque Fantasma                   | `toqueFantasma`                  | —                                                    | —                      | Esta armadura ou escudo parece quase translúcido. Tanto seu bônus de aprimoramento quanto seu bônus de armadura aplicam-se contra ataques d… |
| efeitosEscudos   | Escudos         | Selvagem                         | `selvagem`                       | —                                                    | —                      | Armaduras com essa habilidade costumam ser feitas de couro animal magicamente endurecido. O portador de uma armadura ou escudo com essa hab… |
| efeitosEscudos   | Escudos         | Resistência à Energia            | `resistenciaAEnergia`            | —                                                    | —                      | Uma armadura ou escudo com essa habilidade especial protege contra um tipo específico de energia (ácido, frio, eletricidade, fogo ou sônica… |
| efeitosEscudos   | Escudos         | Determinação                     | `determinacao`                   | —                                                    | —                      | Um escudo ou armadura com essa habilidade especial permite que o portador continue lutando mesmo em situações desesperadoras. Uma vez por d… |
| efeitosEscudos   | Escudos         | Controle de Mortos-Vivos         | `controleDeMortosVivos`          | —                                                    | —                      | Armaduras e escudos com essa habilidade frequentemente apresentam decorações esqueléticas ou macabras. Permitem ao portador controlar um nú… |
| efeitosArmaduras | Armadura        | Benigna                          | `benigna`                        | —                                                    | —                      | Essa armadura é ideal para quem se dedica a proteger e ajudar os aliados. Normalmente decorada com símbolos de prosperidade, abundância e g… |
| efeitosArmaduras | Armadura        | Resistência a Venenos            | `resistenciaAVenenos`            | —                                                    | —                      | Uma armadura ou escudo com esta habilidade especial concede ao usuário um bônus de +2 em testes de resistência contra venenos.               |
| efeitosArmaduras | Armadura        | Equilibrada                      | `equilibrada`                    | —                                                    | —                      | Essa armadura reage contra qualquer tentativa de derrubar o usuário. O portador recebe +4 na Defesa Contra Manobras de Combate, contra inve… |
| efeitosArmaduras | Armadura        | Amarga                           | `amarga`                         | —                                                    | —                      | Essa armadura exala um sabor extremamente desagradável e amargo quando algo tenta morder ou engolir o usuário. Qualquer criatura que tente … |
| efeitosArmaduras | Armadura        | Fortificante                     | `fortificante`                   | —                                                    | —                      | Sempre que o usuário desta armadura causa dano a uma criatura com um ataque corpo a corpo ou à distância, ele recebe +2 de bônus de competê… |
| efeitosArmaduras | Armadura        | Campeã                           | `campea`                         | —                                                    | —                      | Essa propriedade funciona apenas para criaturas de alinhamento bom que possuam a habilidade de desafio (como cavaleiros) ou a habilidade de… |
| efeitosArmaduras | Armadura        | Covarde                          | `covarde`                        | —                                                    | —                      | Essa propriedade funciona apenas para criaturas malignas que possuam a habilidade de desafio (como cavaleiros) ou a habilidade de punir o b… |
| efeitosArmaduras | Armadura        | Desafiante                       | `desafiante`                     | —                                                    | —                      | Armaduras e escudos com esta habilidade especial são especialmente eficazes contra certos tipos de criaturas, de forma semelhante a uma arm… |
| efeitosArmaduras | Armadura        | Fortificação                     | `fortificacao`                   | —                                                    | —                      | Esta armadura ou escudo gera uma força mágica que protege com mais eficácia as áreas vitais do usuário. Quando o portador sofre um ataque f… |
| efeitosArmaduras | Armadura        | Esmagadora                       | `esmagadora`                     | —                                                    | —                      | Uma armadura ou escudo com esta habilidade especial é coberto de farpas e serrilhas afiadas que serram e rasgam qualquer criatura que tente… |
| efeitosArmaduras | Armadura        | Impenetrável                     | `impenetravel`                   | —                                                    | —                      | Uma armadura ou escudo com esta habilidade especial é extremamente resistente. Seu bônus de aprimoramento é dobrado para fins de determinar… |
| efeitosArmaduras | Armadura        | Espelhada                        | `espelhada`                      | —                                                    | —                      | A superfície polida de uma armadura ou escudo com esta habilidade reflete como um espelho comum. Além disso, ela auxilia o usuário contra c… |
| efeitosArmaduras | Armadura        | Armazenadora de Magia            | `armazenadoraDeMagia`            | —                                                    | —                      | Esta armadura permite que um conjurador armazene nela uma magia corpo-a-corpo que ele saiba conjurar de até 3º círculo. Sempre que uma cria… |
| efeitosArmaduras | Armadura        | Estancadora                      | `estancadora`                    | —                                                    | —                      | Esta armadura ajuda a estancar o sangue dos ferimentos do usuário, apertando-se automaticamente como um torniquete nos pontos apropriados e… |
| efeitosArmaduras | Armadura        | Protetora                        | `protetora`                      | —                                                    | —                      | Uma vez por dia, como ação imediata, o usuário pode ativar esta armadura para encerrar todos os efeitos ativos de desafio, julgamento e pun… |
| efeitosArmaduras | Armadura        | Ilusória                         | `ilusoria`                       | —                                                    | —                      | Mediante comando, esta armadura muda sua forma e aparência para parecer uma roupa comum. Apesar da mudança visual, ela mantém todas as suas… |
| efeitosArmaduras | Armadura        | De Justa                         | `deJusta`                        | —                                                    | —                      | Esta armadura auxilia o cavaleiro a manter-se montado e no controle de sua montaria e o usuário recebe +5 de bônus de perícia em testes da … |
| efeitosArmaduras | Armadura        | Sombria                          | `sombria`                        | —                                                    | —                      | Esta armadura desfoca a imagem do usuário sempre que ele tenta se esconder, além de abafar os sons ao seu redor, concedendo vantagem testes… |
| efeitosArmaduras | Armadura        | Escorregadia                     | `escorregadia`                   | —                                                    | —                      | Esta armadura parece sempre estar coberta por uma leve camada de óleo escorregadio. Ela concede +2 de bônus de perícia nos testes de Fuga d… |
| efeitosArmaduras | Armadura        | Veloz                            | `veloz`                          | —                                                    | —                      | Três vezes por dia, como uma ação bônus, o usuário pode invocar um surto de velocidade e recebe um bônus de aprimoramento de +3 metros em t… |
| efeitosArmaduras | Armadura        | Silenciosa                       | `silenciosa`                     | —                                                    | —                      | Esta armadura é feita para tornar os movimentos do usuário discretos. Sua penalidade por testes de perícia não se aplica a testes de Furtiv… |
| efeitosArmaduras | Armadura        | Estimulante                      | `estimulante`                    | —                                                    | —                      | Essa armadura ou escudo tem acabamento altamente polido, com uma superfície brilhante como um espelho, e é magicamente imbuído com a capaci… |
| efeitosArmaduras | Armadura        | Resistência a Magia              | `resistenciaAMagia`              | —                                                    | —                      | Esta habilidade concede resistência 2 (+1 por aprimoramento) à magia ao portador da armadura ou escudo enquanto estiver usando o item.       |
| efeitosArmaduras | Armadura        | Adesiva                          | `adesiva`                        | —                                                    | —                      | Ao comando, as mãos e pés do usuário tornam-se extremamente pegajosos, concedendo a ele deslocamento de escalada de 6 metros. Essa aderênci… |
| efeitosArmaduras | Armadura        | Cocaminhante                     | `cocaminhante`                   | —                                                    | —                      | Esta armadura é decorada com uma espiral de cinco braços bordada, cada braço podendo ser sintonizado com uma criatura voluntária. Enquanto … |
| efeitosArmaduras | Armadura        | Brigona                          | `brigona`                        | —                                                    | —                      | O usuário dessa armadura recebe +2 de bônus em jogadas de ataque e dano com ataques desarmados, incluindo testes de manobra de combate para… |
| efeitosArmaduras | Armadura        | Radiante                         | `radiante`                       | —                                                    | —                      | Esta armadura ou escudo emite luz como uma tocha enquanto está sendo usada. Essa luz pode ser ativada ou desativada com um comando. Mesmo q… |
| efeitosArmaduras | Armadura        | Escavadora                       | `escavadora`                     | —                                                    | —                      | Esta armadura concede ao usuário uma velocidade de escavação de 3 metros, permitindo que ele cave túneis através de qualquer tipo de solo, … |
| efeitosArmaduras | Armadura        | Pútrida                          | `putrida`                        | —                                                    | —                      | Esta armadura exala um fedor nauseante e repulsivo. Toda criatura viva a até 3 metros do usuário deve passar em um teste de Constituição (C… |
| efeitosArmaduras | Armadura        | Toque Fantasma                   | `toqueFantasma`                  | —                                                    | —                      | Esta armadura ou escudo parece quase translúcida. Tanto seu bônus de aprimoramento quanto seu bônus de armadura são válidos contra ataques … |
| efeitosArmaduras | Armadura        | Invulnerável                     | `invulneravel`                   | —                                                    | —                      | Esta armadura concede ao usuário redução de dano 5/físico, protegendo-o contra ataques comuns a menos que sejam mágicos. Armaduras invulner… |
| efeitosArmaduras | Armadura        | Titânica                         | `titanica`                       | —                                                    | —                      | Esta armadura é exageradamente grande e imponente, embora essa aparência seja superficial. Internamente, ela se ajusta perfeitamente ao cor… |
| efeitosArmaduras | Armadura        | Selvagem                         | `selvagem`                       | —                                                    | —                      | Essa armadura geralmente parece ser feita de peles animais magicamente enrijecidas. O usuário de uma armadura ou escudo com essa habilidade… |
| efeitosArmaduras | Armadura        | Harmonizante                     | `harmonizante`                   | —                                                    | —                      | Cada passo dado com essa armadura cria uma sinfonia de sons. A armadura entra em harmonia com músicas tocadas, letras cantadas ou palavras … |
| efeitosArmaduras | Armadura        | Resistência a energia            | `resistenciaAEnergia`            | —                                                    | —                      | Uma armadura ou escudo com essa habilidade especial protege contra um tipo específico de energia (ácido, frio, eletricidade, fogo ou som) e… |
| efeitosArmaduras | Armadura        | Martírio                         | `martirio`                       | —                                                    | —                      | Essa armadura permite que o usuário transforme sua dor em cura para os aliados. Uma vez por dia, como reação, quando um inimigo confirma um… |
| efeitosArmaduras | Armadura        | Justa                            | `justa`                          | —                                                    | —                      | Essa armadura geralmente é adornada com símbolos religiosos gravados ou esmaltados. Uma vez por dia, mediante comando, o usuário pode ativa… |
| efeitosArmaduras | Armadura        | Desvinculada                     | `desvinculada`                   | —                                                    | —                      | Essa armadura é frequentemente decorada com símbolos religiosos caóticos. Uma vez por dia, mediante comando, o usuário pode ativar um efeit… |
| efeitosArmaduras | Armadura        | Profana                          | `profana`                        | —                                                    | —                      | Essa armadura costuma ser esculpida com símbolos profanos ou impuros. Uma vez por dia, mediante comando, o usuário pode ativar um efeito se… |
| efeitosArmaduras | Armadura        | Vigilante                        | `vigilante`                      | —                                                    | —                      | Essa armadura é frequentemente gravada com símbolos religiosos ligados à ordem e à lei. Uma vez por dia, mediante comando, o usuário pode a… |
| efeitosArmaduras | Armadura        | Determinação                     | `determinacao`                   | —                                                    | —                      | Um escudo ou armadura com a habilidade especial de determinação permite que o portador continue lutando mesmo diante de probabilidades apar… |
| efeitosArmaduras | Armadura        | Eterealidade                     | `eterealidade`                   | —                                                    | —                      | Sob comando, esta habilidade permite ao usuário da armadura tornar-se etéreo (como na magia salto etéreo) uma vez por dia). O personagem po… |
| efeitosArmaduras | Armadura        | Controle de Mortos-Vivos         | `controleDeMortosVivos`          | —                                                    | —                      | Armaduras e escudos com essa habilidade frequentemente apresentam decorações esqueléticas ou macabras. Permitem ao portador controlar um nú… |
| efeitosRanged    | Armas de Ranged | Aliada                           | `aliada`                         | —                                                    | —                      | Permite transferir parte ou todo o bônus de aprimoramento da arma do portador para uma arma usada por um aliado.                             |
| efeitosRanged    | Armas de Ranged | Abissal                          | `abissal`                        | dano 1d6 trevas                                      | —                      | A arma causa +1d6 de dano sombrio.                                                                                                           |
| efeitosRanged    | Armas de Ranged | Emboscada                        | `emboscada`                      | —                                                    | —                      | Após ficar escondido por 1 minuto, o usuário adiciona o bônus de aprimoramento como bônus de competência em testes de Furtividade. No prime… |
| efeitosRanged    | Armas de Ranged | Flagelo                          | `flagelo`                        | —                                                    | —                      | Trata o bônus de aprimoramento da arma como +2 e causa +2d6 de dano adicional contra um tipo específico de criatura.                         |
| efeitosRanged    | Armas de Ranged | Radiante                         | `radiante`                       | —                                                    | —                      | Uma vez por dia, cria orbes brilhantes iguais ao bônus de aprimoramento da arma. Esses orbes podem ser usados em ataques para agir como a m… |
| efeitosRanged    | Armas de Ranged | Desorientadora                   | `desorientadora`                 | —                                                    | —                      | Três vezes por dia, ao atingir uma criatura, pode aplicar a condição de Confuso (CD 13 de Con para negar).                                   |
| efeitosRanged    | Armas de Ranged | Invocada                         | `invocada`                       | —                                                    | —                      | A arma se teleporta para a mão do usuário (dentro de até 30 metros) como uma ação bônus.                                                     |
| efeitosRanged    | Armas de Ranged | Compassiva                       | `compassiva`                     | —                                                    | —                      | Quando uma criatura é reduzida a -1 HP ou menos, ela é automaticamente estabilizada, desde que não esteja morta.                             |
| efeitosRanged    | Armas de Ranged | Condutora                        | `condutora`                      | —                                                    | —                      | Permite canalizar uma habilidade sobrenatural ou poder especial do usuário através da arma, uma vez por rodada, ao custo de 2 usos da habil… |
| efeitosRanged    | Armas de Ranged | Conservadora                     | `conservadora`                   | —                                                    | —                      | Projeteis disparados se teleportam de volta para seu recipiente (ex.: aljava).                                                               |
| efeitosRanged    | Armas de Ranged | Cruel                            | `cruel`                          | —                                                    | —                      | Inimigos sob efeitos de medo ficam enjoados por 1 rodada ao serem atingidos. O usuário recebe 5 pontos de vida temporários ao derrotar um i… |
| efeitosRanged    | Armas de Ranged | Astuta                           | `astuta`                         | —                                                    | —                      | Concede +4 de bônus nos acertos críticos se o usuário tiver perícia associada à arma.                                                        |
| efeitosRanged    | Armas de Ranged | Enganadora                       | `enganadora`                     | —                                                    | —                      | Adiciona o bônus de aprimoramento da arma em testes de Enganar (Blefe) para fintar. Acertos críticos concedem uma tentativa de fintar como … |
| efeitosRanged    | Armas de Ranged | Alcance Estendido                | `alcanceEstendido`               | —                                                    | —                      | Dobra o incremento de alcance da arma.                                                                                                       |
| efeitosRanged    | Armas de Ranged | Terrena                          | `terrena`                        | dano 1d6 terra                                       | —                      | A arma causa +1d6 de dano de terra.                                                                                                          |
| efeitosRanged    | Armas de Ranged | Flamejante                       | `flamejante`                     | dano 1d6 fogo                                        | —                      | A arma causa +1d6 de dano de fogo.                                                                                                           |
| efeitosRanged    | Armas de Ranged | Gélida                           | `gelida`                         | dano 1d6 gelo                                        | —                      | A arma causa +1d6 de dano de gelo.                                                                                                           |
| efeitosRanged    | Armas de Ranged | Caçadora                         | `cacadora`                       | —                                                    | —                      | Adiciona o bônus de aprimoramento em testes de Sobrevivência para rastrear criaturas que foram feridas pela arma nas últimas 24 horas. Caus… |
| efeitosRanged    | Armas de Ranged | Jaete d’Água                     | `jaeteDAgua`                     | dano 1d6 agua                                        | —                      | A arma causa +1d6 de dano de água.                                                                                                           |
| efeitosRanged    | Armas de Ranged | Juiz                             | `juiz`                           | —                                                    | —                      | Adiciona o bônus de aprimoramento em testes de Percepção e na Defesa contra Manobras de Combate quando o usuário estiver usando a habilidad… |
| efeitosRanged    | Armas de Ranged | Matadora de Parentes             | `matadoraDeParentes`             | —                                                    | —                      | Trata o bônus de aprimoramento da arma como +2 maior e causa +2d6 de dano adicional contra alvos que tenham parentesco com o usuário.        |
| efeitosRanged    | Armas de Ranged | Reveladora                       | `reveladora`                     | —                                                    | —                      | Ao acertar, aplica o efeito de fogo-fátuo por 1 rodada no alvo.                                                                              |
| efeitosRanged    | Armas de Ranged | Sortuda                          | `sortuda`                        | —                                                    | —                      | A arma possui chance de rolar os dados novamente, que pode ser usado para manobras do usuário ou para repetir uma jogada de ataque em caso … |
| efeitosRanged    | Armas de Ranged | Piedosa                          | `piedosa`                        | —                                                    | —                      | A arma causa +1d6 de dano, mas todo o dano é não letal.                                                                                      |
| efeitosRanged    | Armas de Ranged | Miserável                        | `miseravel`                      | —                                                    | —                      | Reduz pela metade as resistências elementais dos inimigos atingidos. Afeta tipos de criatura da mesma forma que a propriedade Flagelo.       |
| efeitosRanged    | Armas de Ranged | Patriótica                       | `patriotica`                     | —                                                    | —                      | Concede +4 de bônus de intuição em Blefar, Disfarce e Mãos Leves para esconder a arma de membros de outras nacionalidades. Contra inimigos … |
| efeitosRanged    | Armas de Ranged | Planar                           | `planar`                         | —                                                    | —                      | Ignora 5 pontos de Redução de Dano (RD) de criaturas extraplanares.                                                                          |
| efeitosRanged    | Armas de Ranged | Queda Forçada                    | `quedaForcada`                   | —                                                    | —                      | Criaturas aladas atingidas devem passar em um teste de Voo com CD 11 + 1 por aprimoramento da arma ou caem 3 metros. Se falharem totalmente… |
| efeitosRanged    | Armas de Ranged | Confiável                        | `confiavel`                      | —                                                    | —                      | Ao conseguir uma falha critica com a arma, rola 1d6, se tirar 5 ou mais a falha critica é ignorada. Útil para armas de fogo ou instáveis.    |
| efeitosRanged    | Armas de Ranged | Retornável                       | `retornavel`                     | —                                                    | —                      | Armas arremessadas retornam automaticamente à mão do usuário no início do seu próximo turno.                                                 |
| efeitosRanged    | Armas de Ranged | Perfuradora de Ilusões           | `perfuradoraDeIlusoes`           | —                                                    | —                      | Armas à distância ignoram camuflagem.                                                                                                        |
| efeitosRanged    | Armas de Ranged | Tempestade                       | `tempestade`                     | —                                                    | —                      | Causa +1d6 de dano de vento para cada nível de aprimoramento da arma                                                                         |
| efeitosRanged    | Armas de Ranged | Drenadora                        | `drenadora`                      | —                                                    | —                      | Armas de dano não letal causam +2d6 de dano extra. Críticos fatigam o alvo por 5 rodadas.                                                    |
| efeitosRanged    | Armas de Ranged | Sagrada                          | `sagrada`                        | dano 1d6 luz                                         | —                      | Causa +1d6 de dano sagrado.                                                                                                                  |
| efeitosRanged    | Armas de Ranged | Elétrica                         | `eletrica`                       | dano 1d6 eletricidade                                | —                      | Causa +1d6 de dano elétrico.                                                                                                                 |
| efeitosRanged    | Armas de Ranged | Arremesso Mágico                 | `arremessoMagico`                | —                                                    | —                      | Permite que o usuário canalize magias ofensivas através de armas arremessáveis (como se fosse um ataque com magia).                          |
| efeitosRanged    | Armas de Ranged | Flagelo de Invocações            | `flageloDeInvocacoes`            | —                                                    | —                      | Trata o bônus de aprimoramento como +2 maior e causa +2d6 de dano adicional contra qualquer criatura conjurada por magias de invocação, ava… |
| efeitosRanged    | Armas de Ranged | Estrondosa                       | `estrondosa`                     | —                                                    | —                      | Em acertos críticos, causa 1d8 de dano não elemental adicional (2d8 se o multiplicador for x3, 3d8 se for x4). O alvo deve passar em um tes… |
| efeitosRanged    | Armas de Ranged | Treinamento                      | `treinamento`                    | —                                                    | —                      | Armazena 1 talento de combate que o usuário pode usar, desde que cumpra os pré-requisitos normalmente.                                       |
| efeitosRanged    | Armas de Ranged | Vampírica                        | `vampirica`                      | —                                                    | —                      | Cura o portador em metade do dano causado, até um máximo de 2 vezes do usuário por dia. aumenta em 1 a cada 2 aprimoramentos.                |
| efeitosRanged    | Armas de Ranged | Desviadora                       | `desviadora`                     | —                                                    | —                      | Ignora o bônus de CA do alvo proveniente de cobertura parcial e reduz em 2 o bônus de CA concedido por cobertura total e cobertura suave (c… |
| efeitosRanged    | Armas de Ranged | Explosão Abissal                 | `explosaoAbissal`                | dano 1d6 trevas; dano 1d10 trevas (crit)             | —                      | Causa +1d6 de dano sombrio adicional. Em caso de acerto crítico, causa +1d10 de dano sombrio.                                                |
| efeitosRanged    | Armas de Ranged | Caótica                          | `caotica`                        | —                                                    | —                      | É considerada alinhada com o Caos. Causa +2d6 de dano adicional contra criaturas ordeiras.                                                   |
| efeitosRanged    | Armas de Ranged | Âncora                           | `ancora`                         | —                                                    | —                      | Fixa o alvo no lugar, impedindo-o de se mover.                                                                                               |
| efeitosRanged    | Armas de Ranged | Ordeira                          | `ordeira`                        | —                                                    | —                      | É considerada alinhada com a Ordem. Causa +2d6 de dano adicional contra criaturas caóticas.                                                  |
| efeitosRanged    | Armas de Ranged | Ciclônica                        | `ciclonica`                      | —                                                    | —                      | Impede que ataques à distância sejam prejudicados por vento, água ou outros fatores ambientais gasosos ou líquidos.                          |
| efeitosRanged    | Armas de Ranged | Ofuscante                        | `ofuscante`                      | —                                                    | —                      | Ofusca todos os inimigos adjacentes ao trajeto do projétil ou dentro/próximos do cone de um disparo espalhado.                               |
| efeitosRanged    | Armas de Ranged | Marcadora Menor                  | `marcadoraMenor`                 | —                                                    | —                      | Criaturas atingidas são marcadas. Aliados recebem +2 de bônus de moral em ataques corpo a corpo e dano corpo a corpo contra o alvo marcado … |
| efeitosRanged    | Armas de Ranged | Explosão Terrestre               | `explosaoTerrestre`              | dano 1d6 terra; dano 1d10 terra (crit)               | —                      | Causa +1d6 de dano de terra adicional. Em caso de acerto crítico, causa +1d10 de dano de terra.                                              |
| efeitosRanged    | Armas de Ranged | Explosão Flamejante              | `explosaoFlamejante`             | dano 1d6 fogo; dano 1d10 fogo (crit)                 | —                      | Causa +1d6 de dano de fogo adicional. Em caso de acerto crítico, causa +1d10 de dano de fogo.                                                |
| efeitosRanged    | Armas de Ranged | Sagrada                          | `sagrada`                        | —                                                    | duplicado na seção     | É considerada alinhada com o Bem. Causa +2d6 de dano adicional contra criaturas malignas.                                                    |
| efeitosRanged    | Armas de Ranged | Explosão Gélida                  | `explosaoGelida`                 | dano 1d6 gelo; dano 1d10 gelo (crit)                 | —                      | Causa +1d6 de dano de gelo adicional. Em caso de acerto crítico, causa +1d10 de dano de gelo.                                                |
| efeitosRanged    | Armas de Ranged | Explosão de Correnteza           | `explosaoDeCorrenteza`           | dano 1d6 agua; dano 1d10 agua (crit)                 | —                      | Causa +1d6 de dano de água adicional. Em caso de acerto crítico, causa +1d10 de dano de água.                                                |
| efeitosRanged    | Armas de Ranged | Incendiária                      | `incendiaria`                    | dano 1d6 fogo                                        | —                      | Funciona como uma arma flamejante. Causa +1d6 de dano de fogo e aplica o efeito de queimando no alvo.                                        |
| efeitosRanged    | Armas de Ranged | Pacífica                         | `pacifica`                       | —                                                    | —                      | Se atingir com dano não letal, a criatura fica abalada por 1 rodada cada vez que causar dano letal a outra criatura viva.                    |
| efeitosRanged    | Armas de Ranged | Trava de Fase                    | `travaDeFase`                    | —                                                    | —                      | A criatura atingida não pode usar teletransporte por 1 rodada.                                                                               |
| efeitosRanged    | Armas de Ranged | Furacão                          | `furacao`                        | dano 1d6 ar; dano 1d10 ar (crit)                     | —                      | Causa +1d6 de dano de vento adicional. Em caso de acerto crítico, causa +1d10 de dano de vento.                                              |
| efeitosRanged    | Armas de Ranged | Fragmentadora                    | `fragmentadora`                  | —                                                    | —                      | Permite lançar uma duplicata da arma como ataque à distância com alcance incremental de 3 metros.                                            |
| efeitosRanged    | Armas de Ranged | Explosão Brilhante               | `explosaoBrilhante`              | dano 1d6 luz; dano 1d10 luz (crit)                   | —                      | Causa +1d6 de dano sagrado adicional. Em caso de acerto crítico, causa +1d10 de dano sagrado.                                                |
| efeitosRanged    | Armas de Ranged | Explosão Elétrica                | `explosaoEletrica`               | dano 1d6 eletricidade; dano 1d10 eletricidade (crit) | —                      | Causa +1d6 de dano elétrico adicional. Em caso de acerto crítico, causa +1d10 de dano elétrico.                                              |
| efeitosRanged    | Armas de Ranged | Silenciosa                       | `silenciosa`                     | —                                                    | —                      | A arma não faz barulho ao ser usada, silencia o alvo e o deixa abafado. Alvo deve passar em teste de Cons. CD 13 para resistir. Multiplicad… |
| efeitosRanged    | Armas de Ranged | Perseguidora                     | `perseguidora`                   | —                                                    | —                      | Permite estudar um alvo com uma ação padrão. A cada rodada estudando, adiciona +1d6 de dano no primeiro ataque contra o alvo, até um máximo… |
| efeitosRanged    | Armas de Ranged | Traiçoeira                       | `traicoeira`                     | —                                                    | —                      | Funciona como uma arma patriótica, mas quando usada contra alguém da nacionalidade sintonizada, o bônus de aprimoramento é +2 maior e causa… |
| efeitosRanged    | Armas de Ranged | Profana                          | `profana`                        | —                                                    | —                      | É considerada alinhada com o Mal. Causa +2d6 de dano adicional contra criaturas boas.                                                        |
| efeitosRanged    | Armas de Ranged | Redimida                         | `redimida`                       | —                                                    | —                      | Funciona como uma arma sagrada, causando +2d6 de dano contra criaturas malignas. Concede também um bônus em testes de resistência contra ma… |
| efeitosRanged    | Armas de Ranged | Velocidade                       | `velocidade`                     | —                                                    | —                      | Concede 1 ataque adicional usando o maior bônus base de ataque do usuário, como o feitiço aceleração. Não é cumulativo com efeitos semelhan… |
| efeitosRanged    | Armas de Ranged | Vento Favorável                  | `ventoFavoravel`                 | —                                                    | —                      | Funciona de forma semelhante ao feitiço rajada de vento. Anula penalidades de alcance até 18 metros.                                         |
| efeitosRanged    | Armas de Ranged | Energia Brilhante                | `energiaBrilhante`               | —                                                    | —                      | A arma ignora bônus de armadura e escudo na CA do inimigo. Não pode causar dano a mortos-vivos, construtos ou objetos.                       |
| efeitosRanged    | Armas de Ranged | Marcadora Maior                  | `marcadoraMaior`                 | —                                                    | —                      | Criaturas atingidas por essa arma ou munição são marcadas, concedendo aos aliados +4 de bônus de moral em ataques corpo a corpo e +6 de bôn… |
| efeitosRanged    | Armas de Ranged | Segunda Chance                   | `segundaChance`                  | —                                                    | —                      | Uma vez por luta, como ação livre, se errar um ataque, o usuário pode rerrolar o ataque.                                                     |
| efeitosRanged    | Armas de Ranged | Perfuradora de Corações          | `perfuradoraDeCoracoes`          | —                                                    | —                      | Funciona como uma arma vorpal, mas direcionada ao coração. Um 20 natural seguido de um dano critico mata o alvo instantaneamente (desde que… |
| efeitosRanged    | Armas de Ranged | Exclusiva                        | `exclusiva`                      | —                                                    | —                      | Alvos atingidos pela arma podem ser ignorados pelo usuário ao canalizar energia por 1 minuto.                                                |
| efeitosRanged    | Armas de Ranged | Libertadora                      | `libertadora`                    | —                                                    | —                      | Como ação padrão, o usuário pode realizar um teste de manobra para remover efeitos que dificultam movimento, como lentidão ou teia.          |
| efeitosRanged    | Armas de Ranged | Munição Fantasma                 | `municaoFantasma`                | —                                                    | —                      | A munição disparada se desfaz 1 rodada após o disparo.                                                                                       |
| efeitosRanged    | Armas de Ranged | Furtividade de Precisão          | `furtividadeDePrecisao`          | —                                                    | —                      | A arma concede +5 de bônus de competência em testes de Furtividade para permanecer escondido após um ataque de precisão.                     |
| efeitosRanged    | Armas de Ranged | Adaptável                        | `adaptavel`                      | —                                                    | —                      | Requisito: Esta habilidade só pode ser colocada em arcos compostos. Um arco adaptável responde à força de quem o empunha, funcionando como … |
| efeitosRanged    | Armas de Ranged | Impenetrável                     | `impenetravel`                   | —                                                    | —                      | Uma arma impenetrável é protegida contra dano e deterioração. Armas metálicas não enferrujam, e armas de madeira não apodrecem nem empenam,… |
| efeitosRanged    | Armas de Ranged | Ilusória                         | `ilusoria`                       | —                                                    | —                      | Uma arma ilusória pode, por comando, mudar sua forma e aparência para assumir a forma de outro objeto de tamanho semelhante. A arma mantém … |
| efeitosMelee     | Armas Melee     | Aliado                           | `aliado`                         | —                                                    | —                      | Permite transferir parte ou todo o bônus de aprimoramento da arma do portador para uma arma usada por um aliado                              |
| efeitosMelee     | Armas Melee     | Abissal                          | `abissal`                        | dano 1d6 trevas                                      | —                      | A arma causa +1d6 de dano sombrio.                                                                                                           |
| efeitosMelee     | Armas Melee     | Arma Versátil                    | `armaVersatil`                   | —                                                    | —                      | Armas versáteis, quando empunhadas com as 2 mãos, recebem bônus de 2x sua força, arredondado pra baixo, com limite de +4. Armas normais rec… |
| efeitosMelee     | Armas Melee     | Respondente                      | `respondente`                    | —                                                    | —                      | Conta como se tivesse bônus de aprimoramento +4 (máximo +5) para a manobra oportuna de aparar e contra-atacar.                               |
| efeitosMelee     | Armas Melee     | Aniquiladora                     | `aniquiladora`                   | —                                                    | —                      | Trata o bônus da arma como +2 superior e causa +2d6 de dano adicional contra um tipo de criatura escolhido.                                  |
| efeitosMelee     | Armas Melee     | Benevolente                      | `benevolente`                    | —                                                    | —                      | Adiciona o bônus de aprimoramento da arma às ações de "ajudar outro", concedendo bônus em jogadas de ataque.                                 |
| efeitosMelee     | Armas Melee     | Desconcertante                   | `desconcertante`                 | —                                                    | —                      | Três vezes por dia pode causar a condição Confuso ao atingir o alvo (CD 13 de Constituição para resistir).                                   |
| efeitosMelee     | Armas Melee     | Canção de Sangue                 | `cancaoDeSangue`                 | —                                                    | —                      | Ganha a propriedade Cortante quando sob efeito de Canção de Fúria. Acertos críticos concedem 1d10 pontos de vida temporários                 |
| efeitosMelee     | Armas Melee     | Briguento                        | `briguento`                      | —                                                    | —                      | Concede bônus de aprimoramento em testes de manobras de combate igual ao bônus da arma, quando usada com soqueiras, cacetete ou armas leves… |
| efeitosMelee     | Armas Melee     | Compassivo                       | `compassivo`                     | —                                                    | —                      | Quando uma criatura é reduzida a -1 ponto de vida ou menos, ela é automaticamente estabilizada se ainda não estiver morta.                   |
| efeitosMelee     | Armas Melee     | Condutor                         | `condutor`                       | —                                                    | —                      | Permite canalizar uma magia ou habilidade através da arma uma vez por rodada, gastando 2 usos dessa habilidade.                              |
| efeitosMelee     | Armas Melee     | Desconcertador                   | `desconcertador`                 | —                                                    | —                      | Em um crítico, o usuário pode tentar desarmar, reposicionar, quebrar ou derrubar como reação. Recebe bônus igual ao bônus da arma.           |
| efeitosMelee     | Armas Melee     | Reativo                          | `reativo`                        | —                                                    | —                      | Concede +2 contra manobras de desarme e destruição. Se o inimigo falhar ao tentar essas manobras, o portador pode realizar a mesma manobra … |
| efeitosMelee     | Armas Melee     | Corajoso                         | `corajoso`                       | —                                                    | —                      | Concede bônus de aprimoramento como bônus moral contra medo. Se o usuário já tiver bônus moral contra medo, adiciona metade do bônus da arm… |
| efeitosMelee     | Armas Melee     | Cruel                            | `cruel`                          | —                                                    | —                      | Faz com que criaturas sob efeito de medo fiquem enjoadas por 1 rodada. O portador recebe 5 pontos de vida temporários ao derrotar um inimig… |
| efeitosMelee     | Armas Melee     | Astuta                           | `astuta`                         | —                                                    | —                      | Concede +4 de bônus nos acertos críticos se o usuário tiver perícia associada à arma.                                                        |
| efeitosMelee     | Armas Melee     | Letal                            | `letal`                          | —                                                    | —                      | Permite que armas não letais causem dano letal, e permite que chicotes e similares causem dano mesmo em criaturas com armadura ou armadura … |
| efeitosMelee     | Armas Melee     | Debilitante                      | `debilitante`                    | —                                                    | —                      | Ataques contra inimigos que estejam sem bônus de Destreza na CA impõem penalidade de -1 no ataque ou na CA. Ataques furtivos melhoram os ef… |
| efeitosMelee     | Armas Melee     | Enganosa                         | `enganosa`                       | —                                                    | —                      | Adiciona o bônus da arma nos testes de enganar. Acertos críticos permitem realizar uma tentativa de enganar como ação imediata.              |
| efeitosMelee     | Armas Melee     | Defensiva                        | `defensiva`                      | —                                                    | —                      | Permite transferir o bônus de aprimoramento da arma para a CA como ação livre, durando até o próximo turno do portador.                      |
| efeitosMelee     | Armas Melee     | Dispersora                       | `dispersora`                     | —                                                    | —                      | Permite armazenar uma magia de dissipar na arma para ativar com um ataque bem-sucedido, ou fornece bônus em manobras de dissipação.          |
| efeitosMelee     | Armas Melee     | Terrena                          | `terrena`                        | dano 1d6 terra                                       | —                      | A arma causa +1d6 de dano de terra.                                                                                                          |
| efeitosMelee     | Armas Melee     | Flamejante                       | `flamejante`                     | dano 1d6 fogo                                        | —                      | A arma causa +1d6 de dano de fogo.                                                                                                           |
| efeitosMelee     | Armas Melee     | Gélida                           | `gelida`                         | dano 1d6 gelo                                        | —                      | A arma causa +1d6 de dano de gelo.                                                                                                           |
| efeitosMelee     | Armas Melee     | Furioso                          | `furioso`                        | —                                                    | —                      | Enquanto estiver em fúria, a arma conta como se tivesse bônus de aprimoramento +2 superior. Concede bônus a poderes de fúria que melhoram c… |
| efeitosMelee     | Armas Melee     | Flamboyant                       | `flamboyant`                     | —                                                    | —                      | Pode rerrolar um ataque ao tirar 1 natural.                                                                                                  |
| efeitosMelee     | Armas Melee     | Fortuito                         | `fortuito`                       | —                                                    | —                      | Quando essa arma acerta um inimigo com um ataque de oportunidade, o usuário pode fazer um segundo ataque de oportunidade com desvantagem.    |
| efeitosMelee     | Armas Melee     | Toque Fantasma                   | `toqueFantasma`                  | —                                                    | —                      | A arma é tratada como se fosse corporal e incorpórea ao mesmo tempo.                                                                         |
| efeitosMelee     | Armas Melee     | Aterramento                      | `aterramento`                    | —                                                    | —                      | Causa +1d6 de dano contra criaturas do subtipo vento. Concede +2 de bônus de competência em testes de resistência contra efeitos de vento o… |
| efeitosMelee     | Armas Melee     | Crescimento                      | `crescimento`                    | —                                                    | —                      | A arma aumenta uma categoria de tamanho por 1 minuto, uma vez por dia.                                                                       |
| efeitosMelee     | Armas Melee     | Guardião                         | `guardiao`                       | —                                                    | —                      | Permite transferir o bônus de aprimoramento da arma para os testes de resistência como ação livre, até o próximo turno do portador.          |
| efeitosMelee     | Armas Melee     | Caçador de Corações              | `cacadorDeCoracoes`              | —                                                    | —                      | Ignora a chance de erro por camuflagem contra a maioria dos alvos vivos, desde que possuam um coração.                                       |
| efeitosMelee     | Armas Melee     | Caçador                          | `cacador`                        | —                                                    | —                      | Adiciona o bônus de aprimoramento nos testes de Sobrevivência para rastrear qualquer criatura ferida pela arma nas últimas 24 horas. Causa … |
| efeitosMelee     | Armas Melee     | Injetora                         | `injetora`                       | —                                                    | —                      | Armazena até 3 doses de veneno de contato. Pode aplicar 1 dose como ação bônus.                                                              |
| efeitosMelee     | Armas Melee     | Jaete d’Água                     | `jaeteDAgua`                     | —                                                    | —                      | O objeto causa 1d6 para cada nível de aprimoramento da arma.                                                                                 |
| efeitosMelee     | Armas Melee     | Cortante                         | `cortante`                       | —                                                    | —                      | Todos os ataques com arma cortante causam o efeito de sangramento.                                                                           |
| efeitosMelee     | Armas Melee     | Foco de Chi                      | `focoDeChi`                      | —                                                    | —                      | Permite que monges usem seus ataques com chi ou o talento Golpe Atordoante com essa arma como se fosse um ataque desarmado.                  |
| efeitosMelee     | Armas Melee     | Matador de Parentes              | `matadorDeParentes`              | —                                                    | —                      | Causa +2d6 de dano contra alvos aparentados com o portador.                                                                                  |
| efeitosMelee     | Armas Melee     | Aproveitamento                   | `aproveitamento`                 | —                                                    | —                      | Adiciona o bônus de aprimoramento à Defesa contra Manobras de Combate contra empurrar, arrastar, reposicionar e derrubar. Dobra o bônus da … |
| efeitosMelee     | Armas Melee     | Luminosidade Fada                | `luminosidadeFada`               | —                                                    | —                      | Ao acertar, impõe o efeito de “Queimando” por 1 rodada.                                                                                      |
| efeitosMelee     | Armas Melee     | Ameaçadora                       | `ameacadora`                     | —                                                    | —                      | Concede +2 de bônus de flanqueamento para aliados que estejam flanqueando o mesmo inimigo que o portador esteja adjacente.                   |
| efeitosMelee     | Armas Melee     | Misericordiosa                   | `misericordiosa`                 | —                                                    | —                      | A arma causa +1d6 de dano adicional, mas todo o dano é não letal.                                                                            |
| efeitosMelee     | Armas Melee     | Mimética                         | `mimetica`                       | —                                                    | —                      | Cada golpe concede resistência 5 a um tipo de energia ao qual o alvo é resistente ou imune, por 1 rodada. é cumulativa conforme o atinja at… |
| efeitosMelee     | Armas Melee     | Miserável                        | `miseravel`                      | —                                                    | —                      | Reduz pela metade as resistências a elementos de inimigos atingidos. Funciona como uma versão do efeito "Aniquiladora", afetando tipos de c… |
| efeitosMelee     | Armas Melee     | Neutralizadora                   | `neutralizadora`                 | —                                                    | —                      | Purifica água. Causa +1d6 de dano contra criaturas do subtipo terra. Concede +2 de bônus de competência contra efeitos baseados em terra. A… |
| efeitosMelee     | Armas Melee     | Ominosa                          | `ominosa`                        | —                                                    | —                      | Adiciona o bônus de aprimoramento nos testes de Intimidar. Acertos críticos impõem a condição Amedrontado por 1 minuto (CD 13 de Constituiç… |
| efeitosMelee     | Armas Melee     | Patriótica                       | `patriotica`                     | —                                                    | —                      | Concede +4 de bônus de intuição em testes de Enganação, Disfarce e Mãos Leves para esconder a arma de membros de outras nacionalidades. Con… |
| efeitosMelee     | Armas Melee     | Planar                           | `planar`                         | —                                                    | —                      | Ignora 5 pontos de Redução de Dano de criaturas extraplanares.                                                                               |
| efeitosMelee     | Armas Melee     | Extintora                        | `extintora`                      | —                                                    | —                      | Apaga fogo não mágico. Causa +1d6 de dano contra criaturas do subtipo fogo. Concede +2 de bônus de competência contra efeitos de fogo. A ar… |
| efeitosMelee     | Armas Melee     | Rugido                           | `rugido`                         | dano 1d6 ar                                          | —                      | A arma causa +1d6 de dano de vento.                                                                                                          |
| efeitosMelee     | Armas Melee     | Drenadora                        | `drenadora`                      | —                                                    | —                      | Armas não letais causam +2d6 de dano adicional. Acertos críticos deixam o alvo Fatigado por 5 rodadas.                                       |
| efeitosMelee     | Armas Melee     | Marinha                          | `marinha`                        | —                                                    | —                      | Concede bônus em Natação igual ao dobro do bônus da arma. Remove penalidades para ataque e dano com a arma debaixo d’água.                   |
| efeitosMelee     | Armas Melee     | Brilhante                        | `brilhante`                      | dano 1d6 luz                                         | —                      | A arma causa +1d6 de dano sagrado.                                                                                                           |
| efeitosMelee     | Armas Melee     | Choque                           | `choque`                         | dano 1d6 eletricidade                                | —                      | A arma causa +1d6 de dano elétrico.                                                                                                          |
| efeitosMelee     | Armas Melee     | Serpenteante                     | `serpenteante`                   | —                                                    | —                      | Reduz pela metade o bônus de cobertura dos inimigos. Adiciona o bônus da arma na Defesa contra Manobras de Combate contra desarme ou destru… |
| efeitosMelee     | Armas Melee     | Esmagadora                       | `esmagadora`                     | —                                                    | —                      | A arma causa +2d6 de dano adicional a objetos inanimados, inclusive ao realizar manobras para quebrar armaduras e armas.                     |
| efeitosMelee     | Armas Melee     | Armazenadora de Magia            | `armazenadoraDeMagia`            | —                                                    | —                      | Esta arma permite que um conjurador armazene nela uma magia corpo-a-corpo que ele saiba conjurar de até 3º círculo. Sempre que uma criatura… |
| efeitosMelee     | Armas Melee     | Pegajosa                         | `pegajosa`                       | —                                                    | —                      | Acertos críticos permitem ao usuário realizar uma tentativa de roubo como Manobra de Combate.                                                |
| efeitosMelee     | Armas Melee     | Aniquiladora de Invocações       | `aniquiladoraDeInvocacoes`       | —                                                    | —                      | Conta como se tivesse +2 de bônus de aprimoramento superior e causa +2d6 de dano adicional contra qualquer criatura invocada por magia, ava… |
| efeitosMelee     | Armas Melee     | Degelo                           | `degelo`                         | —                                                    | —                      | Derrete gelo não mágico. Causa +1d6 de dano contra criaturas do subtipo gelo. Concede +2 de bônus de competência contra efeitos de gelo. A … |
| efeitosMelee     | Armas Melee     | Trovejante                       | `trovejante`                     | —                                                    | —                      | Em acertos críticos, causa 1d8 de dano adicional (não elemental). Se o multiplicador for x3, o dano é 2d8; se for x4, 3d8. CD 14 de Constit… |
| efeitosMelee     | Armas Melee     | Treinamento                      | `treinamento`                    | —                                                    | —                      | Armazena um talento de combate que o usuário pode usar, desde que cumpra os pré-requisitos.                                                  |
| efeitosMelee     | Armas Melee     | Arremesso                        | `arremesso`                      | —                                                    | —                      | Concede à arma corpo a corpo um alcance de 3 metros, podendo ser arremessada por alguém proficiente com ela.                                 |
| efeitosMelee     | Armas Melee     | Valente                          | `valente`                        | —                                                    | —                      | Concede a um cavaleiro +1d6 de dano contra inimigos sob efeito de montaria. +2 em manobras de desarmar ou destruir contra tal inimigo, +4 n… |
| efeitosMelee     | Armas Melee     | Vampírica                        | `vampirica`                      | —                                                    | —                      | Cura o portador em metade do dano causado, até um máximo de 2 vezes do usuário por dia. Aumenta em 1 a cada 2 aprimoramentos.                |
| efeitosMelee     | Armas Melee     | Viciosa                          | `viciosa`                        | —                                                    | —                      | A arma causa +2d6 de dano extra, mas o usuário sofre 1d6 de dano a cada ataque bem-sucedido.                                                 |
| efeitosMelee     | Armas Melee     | Explosão Abissal                 | `explosaoAbissal`                | dano 1d6 trevas; dano 1d10 trevas                    | —                      | A arma causa +1d6 de dano sombrio normalmente e +1d10 de dano sombrio adicional em acertos críticos.                                         |
| efeitosMelee     | Armas Melee     | Avanço                           | `avanco`                         | —                                                    | —                      | Ao causar dano a uma criatura, o usuário pode avançar 1 metro em qualquer direção com uma ação livre, movimentação esta que não faz parte d… |
| efeitosMelee     | Armas Melee     | Ancoradora                       | `ancoradora`                     | —                                                    | —                      | Permite prender o alvo no lugar, impedindo que ele se mova.                                                                                  |
| efeitosMelee     | Armas Melee     | Execução                         | `execucao`                       | —                                                    | —                      | Causa +2d6 de dano adicional quando usada contra inimigos com menos de 20% do HP                                                             |
| efeitosMelee     | Armas Melee     | Explosão Dissipadora             | `explosaoDissipadora`            | —                                                    | —                      | Funciona como uma arma com a propriedade Dissipadora. Se descarregada em um acerto crítico, a rolagem para dissipar ganha bônus igual ao bô… |
| efeitosMelee     | Armas Melee     | Disruptiva                       | `disruptiva`                     | —                                                    | —                      | Qualquer ataque bem-sucedido contra mortos-vivos exige que eles passem em um teste de Constituição (CD 14) ou sejam destruídos.              |
| efeitosMelee     | Armas Melee     | Explosão Terrena                 | `explosaoTerrena`                | dano 1d6 terra; dano 1d10 terra                      | —                      | Causa +1d6 de dano de terra normalmente e +1d10 de dano de terra em acertos críticos.                                                        |
| efeitosMelee     | Armas Melee     | Explosão Flamejante              | `explosaoFlamejante`             | dano 1d6 fogo; dano 1d10 fogo                        | —                      | Causa +1d6 de dano de fogo normalmente e +1d10 de dano de fogo em acertos críticos.                                                          |
| efeitosMelee     | Armas Melee     | Nascida da Fúria                 | `nascidaDaFuria`                 | —                                                    | —                      | A cada vez que o usuário causa dano a um oponente, o bônus de aprimoramento da arma contra esse alvo aumenta em +1, até o máximo de +5.      |
| efeitosMelee     | Armas Melee     | Sagrada                          | `sagrada`                        | —                                                    | —                      | A arma é considerada de alinhamento bom e causa +2d6 de dano contra criaturas malignas.                                                      |
| efeitosMelee     | Armas Melee     | Incendiária                      | `incendiaria`                    | dano 1d6 fogo                                        | —                      | Funciona como uma arma flamejante (+1d6 de dano de fogo) e ainda impõe a condição de queimando no alvo atingido.                             |
| efeitosMelee     | Armas Melee     | Impactante                       | `impactante`                     | —                                                    | —                      | A arma é tratada como se fosse de uma categoria de tamanho maior. Além disso, aplica seu bônus de aprimoramento nos testes de Manobra de Em… |
| efeitosMelee     | Armas Melee     | Explosão Gélida                  | `explosaoGelida`                 | dano 1d6 gelo; dano 1d10 gelo                        | —                      | A arma causa +1d6 de dano de gelo normalmente e +1d10 de dano de gelo em acertos críticos.                                                   |
| efeitosMelee     | Armas Melee     | Explosão de Jaete d’Água         | `explosaoDeJaeteDAgua`           | dano 1d6 agua; dano 1d10 agua                        | —                      | A arma causa +1d6 de dano de água normalmente e +1d10 de dano de água em acertos críticos.                                                   |
| efeitosMelee     | Armas Melee     | Intensificação de Chi            | `intensificacaoDeChi`            | —                                                    | —                      | Permite que monges usem seus ataques de chi ou o talento Golpe Atordoante com essa arma como se fosse um ataque desarmado. A CD para habili… |
| efeitosMelee     | Armas Melee     | Surto Vital                      | `surtoVital`                     | —                                                    | —                      | Concede o bônus de aprimoramento nos testes de resistência contra efeitos necróticos e poderes de mortos-vivos. Adiciona o bônus ao total d… |
| efeitosMelee     | Armas Melee     | Negadora                         | `negadora`                       | —                                                    | —                      | Ao atingir com sucesso, reduz a Redução de Dano baseada em alinhamento (como DR/maligno) em 5 pontos por 1 rodada.                           |
| efeitosMelee     | Armas Melee     | Pacífica                         | `pacifica`                       | —                                                    | —                      | Quando atinge uma criatura com dano não letal, essa criatura fica amedrontada por 1 rodada toda vez que causar dano letal a outra criatura … |
| efeitosMelee     | Armas Melee     | Trava de Fase                    | `travaDeFase`                    | —                                                    | —                      | Uma criatura atingida não pode usar teletransporte por 1 rodada.                                                                             |
| efeitosMelee     | Armas Melee     | Explosão Trovejante              | `explosaoTrovejante`             | dano 1d6 ar; dano 1d10 ar                            | —                      | A arma causa +1d6 de dano de vento normalmente e +1d10 de dano de vento em acertos críticos.                                                 |
| efeitosMelee     | Armas Melee     | Fragmentação                     | `fragmentacao`                   | —                                                    | —                      | Permite lançar uma duplicata da arma como um projétil, com incrementos de alcance de 3 metros.                                               |
| efeitosMelee     | Armas Melee     | Explosão Brilhante               | `explosaoBrilhante`              | dano 1d6 luz; dano 1d10 luz                          | —                      | A arma causa +1d6 de dano sagrado normalmente e +1d10 de dano sagrado em acertos críticos.                                                   |
| efeitosMelee     | Armas Melee     | Explosão Elétrica                | `explosaoEletrica`               | dano 1d6 eletricidade; dano 1d10 eletricidade        | —                      | A arma causa +1d6 de dano elétrico normalmente e +1d10 de dano elétrico em acertos críticos.                                                 |
| efeitosMelee     | Armas Melee     | Silenciosa                       | `silenciosa`                     | —                                                    | —                      | A arma não faz som ao ser usada, abafa o som ao redor do alvo e pode silenciá-lo (CD 13 de Constituição para negar). Armas com multiplicado… |
| efeitosMelee     | Armas Melee     | Tóxica                           | `toxica`                         | —                                                    | —                      | Aumenta a CD de venenos aplicados pela arma em +2. Possui 1d10 (6+) de chance de não consumir uma dose de veneno por ataque                  |
| efeitosMelee     | Armas Melee     | Traiçoeira                       | `traicoeira`                     | —                                                    | —                      | Funciona como uma arma Patriótica, mas quando usada contra um membro da mesma nacionalidade à qual está sintonizada, seu bônus de aprimoram… |
| efeitosMelee     | Armas Melee     | Profana                          | `profana`                        | —                                                    | —                      | A arma é considerada de alinhamento maligno e causa +2d6 de dano contra criaturas de alinhamento bom.                                        |
| efeitosMelee     | Armas Melee     | Invisível                        | `invisivel`                      | —                                                    | —                      | Torna a arma invisível. O primeiro ataque em combate nega o bônus de Destreza à CA do alvo. É fácil de esconder visualmente. A arma possui … |
| efeitosMelee     | Armas Melee     | Exaustiva                        | `exaustiva`                      | —                                                    | —                      | Em um acerto crítico, o usuário pode abrir mão do dano adicional para deixar o alvo exausto.                                                 |
| efeitosMelee     | Armas Melee     | Sangrenta                        | `sangrenta`                      | —                                                    | —                      | Aplica o status de Sangramento a cada golpe, de forma cumulativa a cada acerto subsequente. O efeito de Sangramento causado por esta arma é… |
| efeitosMelee     | Armas Melee     | Anuladora                        | `anuladora`                      | —                                                    | —                      | Cada ataque bem-sucedido que causa dano reduz a Resistência à Magia do alvo em 1 por 1 minuto. Este efeito se acumula com outros.            |
| efeitosMelee     | Armas Melee     | Reposicionadora                  | `reposicionadora`                | —                                                    | —                      | Concede +2 de bônus de aprimoramento para realizar a manobra de reposicionar o inimigo. Acertos críticos permitem realizar a reposição como… |
| efeitosMelee     | Armas Melee     | Redimida                         | `redimida`                       | —                                                    | —                      | Funciona como uma arma Sagrada, causando +2d6 de dano contra criaturas malignas. Concede bônus sagrado em testes de resistência igual ao bô… |
| efeitosMelee     | Armas Melee     | Velocidade                       | `velocidade`                     | —                                                    | —                      | Concede um ataque adicional com o maior bônus base de ataque do usuário, como se estivesse sob o efeito da magia Aceleração. Não se acumula… |
| efeitosMelee     | Armas Melee     | Sombria                          | `sombria`                        | —                                                    | —                      | Concede camuflagem à arma. Pode criar uma área de escuridão com 6 metros de raio, reduzindo o nível de iluminação em 1 grau.                 |
| efeitosMelee     | Armas Melee     | Dançarina                        | `dancarina`                      | —                                                    | —                      | A arma pode flutuar ao redor do usuário por 4 rodadas, atacando sozinha a cada turno.                                                        |
| efeitosMelee     | Armas Melee     | Voadora                          | `voadora`                        | —                                                    | —                      | Funciona como uma arma Dançarina, mas pode se mover até 9 metros de distância do usuário.                                                    |
| efeitosMelee     | Armas Melee     | Perfuradora de Corações          | `perfuradoraDeCoracoes`          | —                                                    | —                      | Funciona como uma arma vorpal, mas direcionada ao coração. Um 20 natural seguido de um dano critico mata o alvo instantaneamente (desde que… |
| efeitosMelee     | Armas Melee     | Oculta Menor                     | `ocultaMenor`                    | —                                                    | —                      | A arma pode se transformar em um objeto mundano do mesmo tamanho e forma. Ideal para esconder a arma em plena vista.                         |
| efeitosMelee     | Armas Melee     | Oculta                           | `oculta`                         | —                                                    | —                      | Permite transformar a arma em um objeto que não seja uma arma, de tamanho igual ou menor. Isso torna a camuflagem ainda mais versátil.       |
| efeitosMelee     | Armas Melee     | Duelo                            | `duelo`                          | —                                                    | —                      | Ao sacar essa arma, o portador recebe +4 de bônus de aprimoramento em testes de iniciativa. Concede +2 em testes de Desarmar e Enganar, alé… |
| efeitosMelee     | Armas Melee     | Excludente                       | `excludente`                     | —                                                    | —                      | Criaturas atingidas pela arma não podem receber cura por 1d4 turnos                                                                          |
| efeitosMelee     | Armas Melee     | Ilusória                         | `ilusoria`                       | —                                                    | —                      | Uma arma ilusória pode, por comando, mudar sua forma e aparência para assumir a forma de outro objeto de tamanho semelhante. A arma mantém … |
| efeitosMelee     | Armas Melee     | Libertadora                      | `libertadora`                    | —                                                    | —                      | Como ação padrão, o usuário pode realizar um teste de manobra de combate para remover efeitos que inibam o movimento, como lento ou teia.    |
| efeitosMelee     | Armas Melee     | Furtiva                          | `furtiva`                        | —                                                    | —                      | Uma vez por dia, o usuário pode usar seu ataque furtivo sem precisar cumprir os requisitos normalmente exigidos (como flanquear ou pegar de… |
| efeitosMelee     | Armas Melee     | Transformadora                   | `transformadora`                 | —                                                    | —                      | Permite que a arma se transforme em qualquer outra arma corpo a corpo que tenha forma geral e empunhadura semelhante (ex: de espada longa p… |
| efeitosMelee     | Armas Melee     | Impenetrável                     | `impenetravel`                   | —                                                    | —                      | Uma arma impenetrável é protegida contra danos e deterioração. Armas metálicas não enferrujam, e armas de madeira não apodrecem nem empenam… |
| efeitosMelee     | Armas Melee     | Cooperativa                      | `cooperativa`                    | —                                                    | —                      | Uma arma cooperativa permite ao portador transferir parte ou todo o seu bônus de aprimoramento para uma arma usada por um aliado. O portado… |
| efeitosMelee     | Armas Melee     | Corrosiva                        | `corrosiva`                      | —                                                    | —                      | Ao comando, uma arma corrosiva fica revestida com ácido, causando 1d6 pontos extras de dano por ácido em um ataque bem-sucedido. O ácido nã… |
| efeitosMelee     | Armas Melee     | Corajosa                         | `corajosa`                       | —                                                    | —                      | Essa habilidade só pode ser adicionada a armas corpo a corpo. Uma arma corajosa fortalece a coragem e o moral do portador em combate. O por… |
| efeitosMelee     | Armas Melee     | Gravitacional                    | `gravitacional`                  | —                                                    | —                      | A arma com este encantamento pode causar um aumento de peso gravitacional em seus alvos. Toda vez que um ataque for acertado, o alvo do ata… |
| efeitosMelee     | Armas Melee     | Dominadora                       | `dominadora`                     | —                                                    | —                      | Uma arma com este encantamento, ao atingir um acerto crítico, imediatamente faz com que o oponente atingido tenha um impulso extremamente f… |
| efeitosMelee     | Armas Melee     | Parar todas as ações             | `pararTodasAsAcoes`              | —                                                    | sub-item de Dominadora | Em essência, o oponente perderá uma rodada. Não poderá usar ação, ação bônus nem ação de movimento, apenas ações livres.                     |
| efeitosMelee     | Armas Melee     | Descartar sua arma               | `descartarSuaArma`               | —                                                    | sub-item de Dominadora | O oponente jogará sua arma ao chão, próxima aos seus pés. Precisará gastar uma ação padrão para recuperar e empunhar sua arma.               |
| efeitosMelee     | Armas Melee     | Fugir                            | `fugir`                          | —                                                    | sub-item de Dominadora | O oponente é compelido a fugir, sendo obrigado a se afastar do portador da arma.                                                             |
| efeitosMelee     | Armas Melee     | Se ajoelhar                      | `seAjoelhar`                     | —                                                    | sub-item de Dominadora | O oponente se ajoelha, reduzindo seu deslocamento pela metade no próximo turno, representando a ação de levantar-se novamente.               |
| efeitosMelee     | Armas Melee     | Se aproximar                     | `seAproximar`                    | —                                                    | sub-item de Dominadora | O oponente é compelido a se aproximar, sendo obrigado a aproximar-se do portador da arma, mesmo que isso represente risco ao oponente, como… |
| efeitosMelee     | Armas Melee     | Resistir                         | `resistir`                       | —                                                    | sub-item de Dominadora | O oponente resiste ao efeito e nada acontece.                                                                                                |
| efeitosGerais    | Armas Gerais    | Ponto de Projeto Adicional       | `pontoDeProjetoAdicional`        | —                                                    | —                      | Aumenta em 1 a quantidade de aprimoramento que a arma pode receber. Pode ser selecionada duas vezes para armas de uma mão ou à distância, e… |
| efeitosGerais    | Armas Gerais    | Tipo de Dano Adicional           | `tipoDeDanoAdicional`            | —                                                    | —                      | Escolha um tipo de dano adicional (Contundente, Perfurante ou Cortante). A arma pode causar o tipo de dano escolhido de forma separada (ex.… |
| efeitosGerais    | Armas Gerais    | Aerodinâmica                     | `aerodinamica`                   | —                                                    | —                      | A arma ganha alcance de 3 metros e pode ser arremessada até 5 metros de alcance. Apenas armas corpo a corpo podem ter essa qualidade.        |
| efeitosGerais    | Armas Gerais    | Acoplada                         | `acoplada`                       | —                                                    | —                      | A arma fica presa ao braço do usuário e não pode ser desarmada. O usuário ainda pode empunhar ou carregar itens na mão à qual a arma está p… |
| efeitosGerais    | Armas Gerais    | Empunhadura Facilitada           | `empunhaduraFacilitada`          | —                                                    | —                      | Permite que a arma seja usada como arma marcial de duas mãos. Aplicável apenas a armas exóticas de uma mão.                                  |
| efeitosGerais    | Armas Gerais    | Incremento de Alcance Expandido  | `incrementoDeAlcanceExpandido`   | —                                                    | —                      | Aumenta o incremento de alcance da arma em 3 metros. Para armas arremessadas, o alcance máximo é de 9 metros; para armas de projétil ou fun… |
| efeitosGerais    | Armas Gerais    | Frágil                           | `fragil`                         | —                                                    | —                      | A arma adquire a propriedade especial “frágil” tendo 1d10 (5+) de chance de quebrar ao sofrer uma falha critica                              |
| efeitosGerais    | Armas Gerais    | Multiplicador Crítico Aprimorado | `multiplicadorCriticoAprimorado` | —                                                    | —                      | Aumenta o multiplicador de crítico da arma em 1. Pode ser selecionado duas vezes. Se a arma já possui ameaça crítica aprimorada, só pode se… |
| efeitosGerais    | Armas Gerais    | Ameaça Crítica Aprimorada        | `ameacaCriticaAprimorada`        | —                                                    | —                      | Aumenta a margem de ameaça crítica da arma em 1(19 = critico). Pode ser selecionado duas vezes.                                              |
| efeitosGerais    | Armas Gerais    | Dano Aprimorado                  | `danoAprimorado`                 | —                                                    | —                      | Aumenta o dado de dano da arma em um passo (ex.: 1d4 para 1d6, 1d6 para 1d8, etc.). Pode ser selecionado até três vezes para armas leves, q… |
| efeitosGerais    | Armas Gerais    | Dano Reduzido                    | `danoReduzido`                   | —                                                    | —                      | Reduz o dado de dano da arma em um passo (ex.: 1d3 para 1d2). Incompatível com a qualidade de dano aprimorado.                               |
| efeitosGerais    | Armas Gerais    | Escudo                           | `escudo`                         | —                                                    | —                      | A arma conta como um escudo leve de madeira ou metal, podendo possuir espinhos (à escolha) concedendo +1 na CA do usuário. O custo do escud… |
| efeitosGerais    | Armas Gerais    | Reforçada                        | `reforcada`                      | —                                                    | —                      | Concede +2 na Defesa Contra Manobras de Combate para resistir a tentativas de quebrar a arma.                                                |
| efeitosGerais    | Armas Gerais    | Ferramenta                       | `ferramenta`                     | —                                                    | —                      | A arma também funciona como uma ferramenta mundana específica. Adiciona-se ao custo final o triplo do preço e o dobro do peso da ferramenta. |

## Avisos (28)

| Tipo              | Quantidade |
| ----------------- | ---------- |
| hands-conflict    | 1          |
| placeholder-name  | 1          |
| die-anomaly       | 1          |
| price-anomaly     | 1          |
| ignored-category  | 1          |
| missing-bonus     | 2          |
| untitled-category | 1          |
| asterisk-note     | 5          |
| grimoire-format   | 2          |
| duplicate-effect  | 1          |
| sub-entry         | 6          |
| app-item          | 1          |
| duplicate-name    | 2          |
| slug-collision    | 2          |
| effect-alias      | 1          |

### hands-conflict (1)

- [t17] Bastões: a descrição diz uma mão, mas as propriedades listam "Duas Mãos".

### placeholder-name (1)

- [t17] Instrumentos: 8 nomes com "[x]" (Old [x], Silver [x], Mythril [x], Battle [x], Fairy [x], Diamond [x], Platinum [x], Crystal [x]); o jogador escolhe o instrumento.

### die-anomaly (1)

- [t17] Bone Axe causa 2d12; o resto de Machados usa 2d9.

### price-anomaly (1)

- [t17] Hellfire (C) custa 4800, mais que Bismarck (B, 3700): preço fora da progressão.

### ignored-category (1)

- [t17] Caneleiras ignoradas por ora (decisão do usuário); lidas e marcadas ignored.

### missing-bonus (2)

- [t17] Caneleiras: nenhum item tem o +N de dano por tier (todos iguais).
- [t17] Rapieras: nenhum item tem o +N de dano por tier (todos iguais).

### untitled-category (1)

- [t17] Tabela sem título no t17; usado o nome "Armas de fogo antigas e modernas".

### asterisk-note (5)

- [t20] Sleep Arrow: "Sleep*" tem asterisco, mas o post não traz a nota correspondente.
- [t20] Demon Arrow: "Power Down*" tem asterisco, mas o post não traz a nota correspondente.
- [t20] Sleep Bolt: "Sleep*" tem asterisco, mas o post não traz a nota correspondente.
- [t20] Long Bolt: "Slow*" tem asterisco, mas o post não traz a nota correspondente.
- [t20] Stone Bolt: "Disable*" tem asterisco, mas o post não traz a nota correspondente.

### grimoire-format (2)

- [t53] Grimório do Espiritualista Iniciante: magias sem <table> do fórum (line-grid); lidas por linhas.
- [t53] Grimório do Invocador Iniciante: magias sem <table> do fórum (bbcode-table); lidas por linhas.

### duplicate-effect (1)

- [t280] Efeito "Sagrada" aparece mais de uma vez na seção Armas de Ranged; o primeiro vale para a resolução.

### sub-entry (6)

- [t280] "Parar todas as ações" é item de lista aninhada malformada dentro de "Dominadora"; foi contado como efeito próprio.
- [t280] "Descartar sua arma" é item de lista aninhada malformada dentro de "Dominadora"; foi contado como efeito próprio.
- [t280] "Fugir" é item de lista aninhada malformada dentro de "Dominadora"; foi contado como efeito próprio.
- [t280] "Se ajoelhar" é item de lista aninhada malformada dentro de "Dominadora"; foi contado como efeito próprio.
- [t280] "Se aproximar" é item de lista aninhada malformada dentro de "Dominadora"; foi contado como efeito próprio.
- [t280] "Resistir" é item de lista aninhada malformada dentro de "Dominadora"; foi contado como efeito próprio.

### app-item (1)

- [app] Dado Oogie Boogie: a imagem é um link do Discord que expira; reenviar para o storage do app (não foi baixada).

### duplicate-name (2)

- [t24] "Roupas de Proteção" aparece mais de uma vez em Kits a parte; a repetição vira "roupas-de-protecao-2".
- [t24] "Ração de Emergência" aparece mais de uma vez em Kits a parte; a repetição vira "racao-de-emergencia-2".

### slug-collision (2)

- "Valiant" existe em Rifles, Pistolas; slugs: valiant-rifle, valiant-pistola.
- "Bismarck" existe em Rifles, Pistolas; slugs: bismarck-rifle, bismarck-pistola.

### effect-alias (1)

- [t17] efeitosRanged.jatoDagua ("Jato d’Água") ligado a "Jaete d’Água" do t280 por alias.
