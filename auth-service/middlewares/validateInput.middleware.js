import { errorParams, validateUserInput } from "../utils/config.js";

export const validateInputMiddleware = (requiredFields) => {
  return (req, res, next) => {
    try {
        if (requiredFields?.body) {
            for (const field of requiredFields.body) {
              if (!req.body[field]) {
                return res.status(400).json({
                  error: errorParams.errors.dataNotError,
                });
              }
            }
      
            const validatedBodyFields = {};
            for (const field of requiredFields.body) {
              validatedBodyFields[field] = validateUserInput(req.body[field]);
              if (validatedBodyFields[field] === null) {
                return res.status(400).json({
                  error: errorParams.errors.dataIncorrectError,
                });
              }
            }
      
            req.body = { ...req.body, ...validatedBodyFields };
          }
          
        if (requiredFields?.query) {
            for (const field of requiredFields.query) {
                if (!req.query[field]) {
                  return res.status(400).json({
                    error: errorParams.errors.dataNotError,
                  });
                }
              }
        
              const validatedQueryFields = {};
              for (const field of requiredFields.query) {
                validatedQueryFields[field] = validateUserInput(req.query[field]);
                if (validatedQueryFields[field] === null) {
                  return res.status(400).json({
                    error: errorParams.errors.dataIncorrectError,
                  });
                }
              }
        
              req.query = { ...req.query, ...validatedQueryFields };
        }
        
        next();
    } catch(error) {
        res.status(400).json({
            error: errorParams.errors.validateError,
        });
    }
  };
};
