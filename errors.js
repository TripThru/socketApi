
var errors = {
  ERROR_UNKNOWN: 'Unknown error',
  ERROR_CREATING_USER: 'Error creating user',
  ERROR_INVALID_LOGIN: 'Invalid username or password',
  ERROR_REQUIRED_PARAMETER_MISSING: 'Required parameter is missing',
  ERROR_NOT_IMPLEMENTED: 'Method not implemented',
  ERROR_CREATING_TRIP: 'Error creating trip'
};

function getError(code) {
  if (!errors[code])
    return getError('ERROR_UNKNOWN')
  
  return {
    code: code,
    message: errors[code]
  };
}


for (var e in errors)
  module.exports[e] = getError(e);

module.exports.errors = errors;
module.exports.getError = getError;