const messageElement = document.getElementById("message");
const form = document.getElementById("requestForm");
const nameInput = document.getElementById("name");
const reasonInput = document.getElementById("reason");
const submitButton = document.getElementById("submitButton");
const statusElement = document.getElementById("status");


// ==========================================
// LOAD MESSAGE.JSON
// ==========================================

async function loadMessage() {

    try {

        const response = await fetch("MESSAGE.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Δεν ήταν δυνατή η φόρτωση του MESSAGE.json.");
        }

        const data = await response.json();

        if (!data.message) {
            throw new Error("Το MESSAGE.json δεν περιέχει message.");
        }

        messageElement.textContent = data.message;

    } catch (error) {

        console.error(error);

        messageElement.textContent =
            "Δεν ήταν δυνατή η φόρτωση του μηνύματος.";
    }
}


// ==========================================
// GET SAVED RESPONSES
// ==========================================

function getResponses() {

    const saved = localStorage.getItem("Response.json");

    if (!saved) {
        return [];
    }

    try {

        const responses = JSON.parse(saved);

        if (!Array.isArray(responses)) {
            return [];
        }

        return responses;

    } catch (error) {

        console.error(error);

        return [];
    }
}


// ==========================================
// SAVE RESPONSE
// ==========================================

function saveResponse(name, reason) {

    const responses = getResponses();

    const newResponse = {
        name: name,
        reason: reason,
        date: new Date().toISOString()
    };

    responses.push(newResponse);

    localStorage.setItem(
        "Response.json",
        JSON.stringify(responses, null, 4)
    );

    return newResponse;
}


// ==========================================
// DOWNLOAD RESPONSE.JSON
// ==========================================

function downloadResponses() {

    const responses = getResponses();

    const json = JSON.stringify(
        responses,
        null,
        4
    );

    const blob = new Blob(
        [json],
        {
            type: "application/json"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "Response.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


// ==========================================
// FORM SUBMISSION
// ==========================================

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = nameInput.value.trim();
    const reason = reasonInput.value.trim();


    // NAME REQUIRED
    if (!name) {

        statusElement.textContent =
            "Το όνομα είναι υποχρεωτικό.";

        nameInput.focus();

        return;
    }


    // REASON REQUIRED
    if (!reason) {

        statusElement.textContent =
            "Η αιτιολογία είναι υποχρεωτική.";

        reasonInput.focus();

        return;
    }


    submitButton.disabled = true;

    statusElement.textContent =
        "Αποθήκευση...";


    try {

        saveResponse(
            name,
            reason
        );


        // CLEAR FIELDS

        nameInput.value = "";
        reasonInput.value = "";


        statusElement.textContent =
            "Η απάντηση αποθηκεύτηκε.";


        // DOWNLOAD UPDATED RESPONSE.JSON

        downloadResponses();


    } catch (error) {

        console.error(error);

        statusElement.textContent =
            "Παρουσιάστηκε σφάλμα κατά την αποθήκευση.";

    } finally {

        submitButton.disabled = false;
    }

});


// ==========================================
// LOAD PAGE
// ==========================================

loadMessage();
