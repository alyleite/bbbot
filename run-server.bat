SET /P GLOBO_USERNAME= Digite o e-mail da Globo:
SET /P GLOBO_PASSWORD= Digite a senha da Globo:
SET /P PARTICIPANTE= Digite o participante que vc quer votar [babu, flay ou marcela]:

node ./src/vote.js %voto% %email% %senha%
