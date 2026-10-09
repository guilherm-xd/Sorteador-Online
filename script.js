const formulario = document.querySelector("#sorteadorForm");
const listaEntrada = document.querySelector("#listaEntrada");
const resultadoBox = document.querySelector("#resultadoBox");
const resultado = document.querySelector("#resultado");
const btnLimpar = document.querySelector("#btnLimpar");
const btnSortear = document.querySelector("#btnSortear");
const status = document.querySelector("#status");
const historico = document.querySelector("#historico");

let disponiveis = [];
let relogio = null;

function obterItens() {
  return listaEntrada.value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

function sortear(itens) {
  const indiceSorteado = Math.floor(Math.random() * itens.length);
  return itens[indiceSorteado];
}

function exibirResultado(vencedor) {
  resultado.textContent = vencedor;
  resultadoBox.classList.remove("hidden");

  resultado.classList.remove("revelar");
  void resultado.offsetWidth;
  resultado.classList.add("revelar");
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  status.textContent = "";

  if (disponiveis.length === 0) {
    disponiveis = obterItens();
  }

  if (disponiveis.length === 0) {
    resultadoBox.classList.add("hidden");
    status.textContent = "⚠️ Atenção: digite pelo menos um nome ou item para sortear.";
    listaEntrada.focus();
    return;
  }

  let contador = 3;
  btnSortear.disabled = true;
  resultado.textContent = contador;
  resultadoBox.classList.remove("hidden");

  relogio = setInterval(() => {
    contador = contador - 1;

    if (contador > 0) {
      resultado.textContent = contador;
    } else {
      clearInterval(relogio);
      relogio = null;
      btnSortear.disabled = false;

      const vencedor = sortear(disponiveis);
      exibirResultado(vencedor);

      const posicao = disponiveis.indexOf(vencedor);
      disponiveis.splice(posicao, 1);

      const li = document.createElement("li");
      li.textContent = vencedor;
      historico.appendChild(li);

      if (typeof confetti === "function") {
        confetti();
      }
    }
  }, 1000);
});

btnLimpar.addEventListener("click", () => {
  clearInterval(relogio);
  relogio = null;
  btnSortear.disabled = false;

  historico.innerHTML = "";
  listaEntrada.value = "";
  resultado.textContent = "---";
  resultadoBox.classList.add("hidden");
  status.textContent = "";
  disponiveis = [];
  listaEntrada.focus();
});