/********************/
/* Helper Functions */
/********************/

// Throws TypeError if not well formed
function validateURL(url) {
    try {
        new URL(url);
    } catch (e) {
        throw new TypeError(`${url} is not a valid URL.`);
    }
}

export { validateURL };