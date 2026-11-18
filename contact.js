const form = document.querySelector(".form");
const submitButton = form.querySelector('button[type="submit"]');
const status = form.querySelector(".form-status");

form.addEventListener("submit", async event => {
  event.preventDefault();
  submitButton.disabled = true;
  status.textContent = "Отправляем заявку…";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (!response.ok) {
      status.textContent = response.status === 400
        ? "Проверьте имя, телефон и описание проекта."
        : "Заявку не удалось отправить. Попробуйте ещё раз или напишите нам в Telegram.";
      return;
    }

    form.reset();
    status.textContent = "Заявка отправлена. Мы свяжемся с вами.";
  } catch {
    status.textContent = "Связь прервалась. Попробуйте ещё раз или напишите нам в Telegram.";
  } finally {
    submitButton.disabled = false;
  }
});
