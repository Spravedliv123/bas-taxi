import { errorParams, validateUserInput } from "../utils/config.js";

export const validateInputMiddleware = (requiredFields) => {
  return (req, res, next) => {
    try {
        if (requiredFields?.body) {
            for (const field of requiredFields.body) {
              if (!req.body[field]) {
                return res.status(400).json({
                  error: errorParams.errors.dataNot,
                });
              }
            }
      
            const validatedBodyFields = {};
            for (const field of requiredFields.body) {
              validatedBodyFields[field] = validateUserInput(req.body[field]);
              if (validatedBodyFields[field] === null) {
                return res.status(400).json({
                  error: errorParams.errors.dataIncorrect,
                });
              }
            }
      
            req.body = { ...req.body, ...validatedBodyFields };
          }
      
        if (requiredFields?.params) {
            for (const field of requiredFields.params) {
              if (!req.params[field]) {
                return res.status(400).json({
                  error: errorParams.errors.dataNot,
                });
              }
            }
      
            const validatedParamFields = {};
            for (const field of requiredFields.params) {
              validatedParamFields[field] = validateUserInput(req.params[field]);
              if (validatedParamFields[field] === null) {
                return res.status(400).json({
                  error: errorParams.errors.dataIncorrect,
                });
              }
            }
      
            req.params = { ...req.params, ...validatedParamFields };
          }
      
        next();
    } catch(error) {
        res.status(400).json({
            error: errorParams.errors.validate,
        });
    }
  };
};
