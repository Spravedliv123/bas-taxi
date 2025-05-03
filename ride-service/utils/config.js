import dotenv from 'dotenv';

dotenv.config();

export const errorParams = {
    errors: {
        validateError: 'Ошибка при валидации данных',
        dataNotError: 'Переданных данных недостаточно',
        dataIncorrectError: 'Введенные вами данные некорректны'
    }
}

export const validateUserInput = input => {
  if (input === null || input === undefined || Number.isNaN(input) || input.length === 0 || input.length > 1024) {
    return null
  }

  return input
}

const config = {
    port: process.env.PORT || 5000,
    rabbitmq: {
        url: process.env.RABBITMQ_URL
    },
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379
    },
    swagger: {
        path: process.env.SWAGGER_PATH || '/api-docs'
    }
};

export default config;
