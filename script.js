async function loadMessage() {

    const messageElement =
        document.getElementById("message");

    try {

        const response = await fetch(
            "MESSAGE.json",
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {

            throw new Error(
                "Δεν ήταν δυνατή η φόρτωση του MESSAGE.json."
            );
        }

        const data =
            await response.json();

        if (
            !data ||
            typeof data.message !== "string"
        ) {

            throw new Error(
                "Το MESSAGE.json δεν περιέχει έγκυρο μήνυμα."
            );
        }

        messageElement.textContent =
            data.message;

    } catch (error) {

        console.error(
            "Σφάλμα:",
            error
        );

        messageElement.textContent =
            "Δεν ήταν δυνατή η φόρτωση του μηνύματος.";
    }
}

loadMessage();
