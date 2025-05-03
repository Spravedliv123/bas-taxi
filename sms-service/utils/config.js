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

export default {
    port: process.env.PORT || 3000,
    smsc: {
        login: process.env.SMSC_LOGIN,
        password: process.env.SMSC_PASSWORD,
        ssl: process.env.SMSC_SSL === 'false',
        charset: process.env.SMSC_CHARSET || 'utf-8',
        host: process.env.SMSC_HOST || 'api.smsc.kz',
        def_fmt: 3
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL
    }
};
