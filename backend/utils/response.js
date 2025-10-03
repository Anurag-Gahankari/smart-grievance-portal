export const sendResponse = (res ,success, message, data = null, error = null, statuscode = 200) => {
    return res.status(statuscode).json({
        success,
        message,
        data, 
        error
    });
};