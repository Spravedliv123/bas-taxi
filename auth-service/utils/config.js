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