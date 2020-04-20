const links = {
  voteURL: 'https://gshow.globo.com/realities/bbb/bbb20/votacao/paredao-bbb20-quem-voce-quer-eliminar-babu-manu-ou-mari-ef6b3f8d-6cd8-4418-9f63-ca6702323cde.ghtml',
  globoLoginURL: "https://minhaconta.globo.com",
  captchaURL: "https://captcha.globo.com/api/challenge/generate",
  challengeAcceptedURL: "https://royale.globo.com/polls/",
};

const getPosition = name => {
  // console.log('Nome: '+name);
  name = name ? name.toLowerCase() : '';
  switch (name) {
    case 'babu':
      return 1;
    case 'manu':
      return 2;
    case 'mari':
      return 3;
  }

  throw new Error('candidato invalido, use babu | manu | mari');

};


const config = {
  participantPosition: getPosition(process.argv[2] || process.env.PARTICIPANTE),  // [1,2, 3] are the possible options.
  timeoutClick: 5 * 1000,  // in MS
  waitClick: 2 * 1000, // in milisseconds
  captchaCenter: 28,
  captchaIndividualSize: 53,
};

BASE_XPATH = "/html/body/div[2]/div[4]/div";

const xpaths = {
  captcha: 'img[class="gc__3_EfD"]',
  reloadCaptcha: 'button[class="gc__1JSqe"]',
  captchaTextClassName: '.gc__2e8f-',
  captchaErrorMsg: '.gc__2b3Aq',
  userDiv: `${BASE_XPATH}/div[1]/div[4]/div[${config.participantPosition}]/div`,
};


const credentials = {
  username: process.argv[3] || process.env.GLOBO_USERNAME,
  password: process.argv[4] || process.env.GLOBO_PASSWORD,
};

module.exports = {
  config,
  credentials,
  links,
  xpaths
};
