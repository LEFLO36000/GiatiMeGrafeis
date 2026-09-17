document.addEventListener("DOMContentLoaded", function () {

    const messageElement = document.getElementById("message");

    fetch("./MESSAGE.json?time=" + Date.now())
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "HTTP " + response.status
                );
            }

            return response.json();
        })
        .then(function (data) {

            if (
                !data ||
                typeof data.message !== "string"
            ) {
                throw new Error(
                    "Το MESSAGE.json δεν έχει σωστό format."
                );
            }

            messageElement.textContent = data.message;
        })
        .catch(function (error) {

            console.error(
                "MESSAGE.json ERROR:",
                error
            );

            messageElement.textContent =
                "ERROR: " + error.message;
        });

});
