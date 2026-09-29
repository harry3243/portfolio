/* ==========================================================================
   Harryson Portfolio - main.js
   1. Footer year   2. Missing-image fallback   3. Contact form
   ========================================================================== */

/* Settings - change the email here if it ever changes */
const CONFIG = {
  contactEmail: "jonieedrake@gmail.com",
};

/* 1. Footer year ---------------------------------------------------------- */
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

/* 2. Hide broken images so the page still looks tidy ---------------------- */
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => { img.style.visibility = "hidden"; });
});

/* 3. Contact form --------------------------------------------------------- */
/* Uses FormSubmit (formsubmit.co), a free service that forwards the form to
   your inbox. FIRST TIME ONLY: after the first test message, FormSubmit emails
   you an activation link - click it once and every later message arrives. */
const form = document.getElementById("contact-form");

if (form) {
  const status = document.getElementById("form-status");
  const button = form.querySelector("button[type='submit']");

  const showStatus = (message, type) => {
    status.textContent = message;
    status.className = `form__status is-${type}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    data._subject = `Portfolio message from ${data.name}`;
    data._template = "table";

    button.disabled = true;
    showStatus("Sending...", "success");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONFIG.contactEmail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok || result.success === "false") throw new Error("Request failed");

      form.reset();
      showStatus("Thanks! Your message has been sent.", "success");
    } catch (error) {
      showStatus(`Couldn't send right now. Please email me at ${CONFIG.contactEmail}.`, "error");
    } finally {
      button.disabled = false;
    }
  });
}
