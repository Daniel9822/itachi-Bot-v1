class WarningError extends Error {
  constructor(message) {
    super(message);
    this.name = "warningError";
  }
}

export default WarningError;
