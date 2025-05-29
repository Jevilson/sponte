function createError(message, data = []) {
  return { error: true, message, data };
}

function validateParams(params, rules) {
  for (const { field, validate, message, optional = false } of rules) {
    const value = params[field];

    if (optional && (value === undefined || value === null || value === "")) {
      continue;
    }

    if (!validate(value)) {
      return createError(message);
    }
  }
  return null;
}


module.exports =  validateParams