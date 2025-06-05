const form = document.getElementById("pedidoForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => data[key] = value);

  const webhook = "https://script.google.com/macros/s/AKfycby1h7iYNV1R0TqNo1ZRwGAd1h01-GrcyXPDn4M_G0FfvN7Jl-RXfTPdGDrX4cbqb7O4/exec";

  const res = await fetch(webhook, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  });

  const msg = document.getElementById("mensagem");
  if (res.ok) {
    msg.innerText = "✅ Pedido enviado com sucesso!";
    form.reset();
  } else {
    msg.innerText = "❌ Erro ao enviar. Tente novamente.";
  }
});
