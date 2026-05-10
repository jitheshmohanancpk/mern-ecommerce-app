const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // 1. മംഗോഡിബിയിലെ തെറ്റായ ID (CastError)
    if (err.name === 'CastError') {
        statusCode = 404;
        message = `Resource not found. Invalid: ${err.path}`;
    }

    // 2. മംഗോഡിബി Validation Error (നിങ്ങൾക്ക് ഇപ്പോൾ കിട്ടുന്ന എറർ)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };