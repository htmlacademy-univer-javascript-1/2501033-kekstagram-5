const isStringLongerThan = (string, maxLength) => String(string).length <= maxLength;

// // Cтрока короче 20 символов
// console.log(isStringLongerThan('проверяемая строка', 20)); // true
// // Длина строки ровно 18 символов
// console.log(isStringLongerThan('проверяемая строка', 18)); // true
// // Строка длиннее 10 символов
// console.log(isStringLongerThan('проверяемая строка', 10)); // false

function isPalindrome(string) {
  const normalizedString = string.replaceAll(' ', '').toLowerCase();
  let reversedString = '';
  for (let i = normalizedString.length - 1; i >= 0; i--){
    reversedString += normalizedString[i];
  }
  return normalizedString === reversedString;
}

// // Строка является палиндромом
// console.log(isPalindrome('топот')); // true
// // Несмотря на разный регистр, тоже палиндром
// console.log(isPalindrome('ДовОд')); // true
// // Это не палиндром
// console.log(isPalindrome('Кекс'));  // false
