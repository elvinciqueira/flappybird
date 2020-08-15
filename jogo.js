console.log('[ElvinCiqueira] Flappy Bird');

const som_HIT = new Audio();
som_HIT.src = './audio/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha: function () {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0, 0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

/// [mensagemGetReady]
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.h
    );
  }
}

// [Chao]
const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
  desenha: function () {
    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.largura, chao.altura,
    );

    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      (chao.x + chao.largura), chao.y,
      chao.largura, chao.altura,
    );
  },
};

function fazColisoes(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY) {
    return true;
  }

  return false;
}

function criaFlappyBird() {
  const flappyBird = {
    sourceX: 0,
    sourceY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula: function () {
      flappyBird.velocidade = -flappyBird.pulo;
    },
    velocidade: 0,
    gravidade: 0.25,
    atualiza: function () {
      if (fazColisoes(flappyBird, chao)) {
        som_HIT.play();

        setTimeout(() => {
          mudaParaTela(Telas.INICIO);
        }, 500);

        return;
      }


      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    desenha: function () {
      contexto.drawImage(
        sprites,
        flappyBird.sourceX, flappyBird.sourceY, //source x, source Y
        flappyBird.largura, flappyBird.altura,
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    }
  };

  return flappyBird;
}

const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

  if (telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

/// [Telas]
const Telas = {
  INICIO: {
    inicializa: function () {
      globais.flappyBird = criaFlappyBird();
    },
    desenha: function () {
      planoDeFundo.desenha();
      chao.desenha();

      globais.flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click: function () {
      mudaParaTela(Telas.JOGO);
    },
    atualiza: function () {

    }
  }
}

Telas.JOGO = {
  desenha: function () {
    planoDeFundo.desenha();
    chao.desenha();
    globais.flappyBird.desenha();
  },
  click: function () {
    globais.flappyBird.pula();
  },
  atualiza: function () {
    globais.flappyBird.atualiza();
  }
}

function loop() {

  telaAtiva.desenha();
  telaAtiva.atualiza();

  requestAnimationFrame(loop);
}

window.addEventListener('click', () => {
  if (telaAtiva.click) telaAtiva.click();
})

mudaParaTela(Telas.INICIO);
loop();