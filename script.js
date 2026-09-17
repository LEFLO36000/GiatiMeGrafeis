const WORKER_URL = "https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev";

const messageElement = document.getElementById("message");
const form = document.getElementById("requestForm");
const nameInput = document.getElementById("name");
const reasonInput = document.getElementById("reason");
const submitButton = document.getElementById("submitButton");
const statusElement = document.getElementById("status");


async function loadMessage() {

    try {

        const response = await fetch("MESSAGE.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Δεν ήταν δυνατή η φόρτωση του MESSAGE.json");
        }

        const data = await response.json();

        if (!data.message) {
            throw new Error("Το MESSAGE.json δεν περιέχει message.");
        }

        messageElement.textContent = data.message;

    } catch (error) {

        console.error(error);

        messageElement.textContent = "Δεν ήταν δυνατή η φόρτωση του μηνύματος.";
    }
}


form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = nameInput.value.trim();
    const reason = reasonInput.value.trim();

    if (!name) {

        statusElement.textContent = "Συμπλήρωσε το όνομα.";

        nameInput.focus();

        return;
    }

    if (!reason) {

        statusElement.textContent = "Συμπλήρωσε την αιτιολογία.";

        reasonInput.focus();

        return;
    }

    submitButton.disabled = true;

    statusElement.textContent = "Αποστολή...";

    try {

        const response = await fetch(WORKER_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                reason: reason
            })

        });

        const data = await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.error || "Η αποστολή απέτυχε."
            );
        }

        statusElement.textContent = "Το μήνυμα στάλθηκε επιτυχώς.";

        nameInput.value = "";
        reasonInput.value = "";

    } catch (error) {

        console.error(error);

        statusElement.textContent =
            "Παρουσιάστηκε σφάλμα κατά την αποστολή.";

    } finally {

        submitButton.disabled = false;
    }

});


loadMessage();
