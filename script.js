const form = document.getElementById("pedidoForm");
const bebidaSelect = document.querySelector(".bebida-select");
const bebidasContainer = document.getElementById("bebidas");
const eventoSelect = document.getElementById("evento");

// URLs da planilha
const SHEET_ID = "1h8qsgQqYYPNg9gW9_Y5ublwBLwGA3H099MoTQgsC2Ic";
const BASE_URL = `https://opensheet.elk.sh/${SHEET_ID}`;

// Carrega eventos ativos
fetch(`${BASE_URL}/Eventos`)
  .then(res => res.json())
  .then(data => {
    eventoSelect.innerHTML = '<option value="">Selecione</option>';
    data.filter(e => e["Ativo?"] === "Sim").forEach(e => {
      const opt = document.createElement("option");
      opt.value = e["Nome do Evento"];
      opt.textContent = `${e["Nome do Evento"]} (${e.Empresa})`;
      eventoSelect.appendChild(opt);
    });
  });

// Carrega bebidas
function loadBebidas(selectEl) {
  fetch(`${BASE_URL}/Cadastro de Bebidas`)
    .then(res => res.json())
    .then(data => {
      selectEl.innerHTML = '<option value="">Selecione</option>';
      data.filter(b => b.Ativa === "Sim").forEach(b => {
        const opt = document.createElement("option");
        opt.value = b["Nome da Bebida"];
        opt.textContent = b["Nome da Bebida"];
        selectEl.appendChild(opt);
      });
    });
}

// Aplica no primeiro select
loadBebidas(bebidaSelect);

// Adiciona novo par bebida + quantidade
document.getElementById("addBebida").addEventListener("click", () => {
  const div = document.createElement("div");
  div.classList.add("bebida-item");
  div.innerHTML = `
    <label>Bebida Solicitada</label>
    <select name="bebida[]" class="bebida-select" required></select>
    <label>Quantidade</label>
    <input type="number" name="quantidade[]" required />
  `;
  bebidasContainer.appendChild(div);
  loadBebidas(div.querySelector("select"));
});

// Envia formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  const bebidas = data.getAll("bebida[]");
  const quantidades = data.getAll("quantidade[]");

  const pedidos = bebidas.map((b, i) => ({
    empresa: data.get("empresa"),
    evento: data.get("evento"),
    data_evento: data.get("data_evento"),
    produtor: data.get("produtor"),
    bebida: b,
    quantidade: quantidades[i],
    obs: data.get("obs")
  }));

  const webhook = "https://script.google.com/macros/s/AKfycbwN99_eLFn7pfuEmT5yD-y5VjXxZEQmHS9owrl31QtF_e9FN7hIhQD1iiXmdFhF-dkA/exec";

  try {
    const res = await fetch(webhook, {
      method: "POST",
      body: JSON.stringify(pedidos),
      headers: { "Content-Type": "application/json" }
    });

    const msg = document.getElementById("mensagem");
    if (res.ok) {
      msg.innerText = "✅ Pedido enviado com sucesso!";
      form.reset();
    } else {
      msg.innerText = "❌ Erro no envio. Tente novamente.";
    }
  } catch (err) {
    document.getElementById("mensagem").innerText = "❌ Erro de rede.";
  }
});
