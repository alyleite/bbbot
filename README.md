BBBot + OpenCV
===============

Paredão dessa semana:
Babu, Flayslane e Marcela


Você precisa exportar duas variáveis para poder logar no site da Globo e uma para o participante que vai ser votado:

Linux / Mac

```
export GLOBO_USERNAME='your-email@globo.com'
export GLOBO_PASSWORD='xxxxxxxxx'
export PARTICIPANTE=marcela
```

Windows PowerShell

```
$env:GLOBO_USERNAME='your-email@globo.com'
$env:GLOBO_PASSWORD='xxxxxxxxx'
$env:PARTICIPANTE=marcela
```

Ou pode executar diretamente via node

```
node ./src/vote.js gabi your-email@globo.com xxxxxxxxx
```

INSTALAÇÃO NO WINDOWS
=====================

1) Instale a versão mais nova do node.js https://nodejs.org/en/download/
2) Instale a versão 3.7.1 do Python https://www.python.org/downloads/release/python-371/
3) Rode o arquivo `install.bat` para instalação de programas auxiliares
4) Rode o bot com `run-server.bat`. Um prompt será mostrado perguntando suas informações (conta/senha globo, participante que quer votar)
5) Caso o bot dê problema, tente votar manualmente primeiro com sua conta só pra depois tentar utilizar o bot.

INSTALAÇÃO EM MAC E LINUX
=========================

Instale o Python3 e o Node.JS

Depois de instalar essas duas dependências, rode os seguinte comandos:

```
pip3 install -r requirements.txt
npm install
```

Normalmente o Python2 já vem instalado nessas máquinas, então você precisa instalar o Python3 e ficar com as duas instalações.

Rodando o bot:

```
npm start
```

TREINAMENTO DO ALGORITMO
========================

Esse bot é feito utilizando o SIFT do OpenCV. Algumas captchas não vão funcionar corretamente pois não temos todas as imagens do banco. Para ajudar nesse mapeamento, faça o seguinte:

1) Ele vai baixar um captcha com um nome. Esse arquivo vai ser salvo em `images/<simbolo>.png`
2) O programa vai cortar o captcha em 5 pedaços e renomear cada pra: images/<simbolo>_numero.png
3) É só puxar a versão correta pra images_individual como <simbolo>_numero.png que o programa vai identificar esse ícone
4) Abra um pull request para atualizarmos aqui :)

TODO
=====

  - Precisa melhorar em condições adversas (clique errado, dois cliques no captcha);
  - Colocar no docker.hub;
  - Cleanup das pastas de imagens;

Inspirado no https://github.com/diofeher/bbbot porém acabei não fazendo o fork
