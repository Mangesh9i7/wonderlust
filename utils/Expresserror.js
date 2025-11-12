class Expresserror extends Error {
    constructor(statusCode, message) {
        super();
        this.ststusCode = statusCode;
        this.message = message;
    }
}

module.exports = Expresserror; 