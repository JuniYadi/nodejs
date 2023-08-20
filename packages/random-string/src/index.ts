import { randomInt } from "crypto";

export interface IRandomPassword {
  lowercase?: number | boolean;
  uppercase?: number | boolean;
  numbers?: number | boolean;
  symbols?: number | boolean;
  ambiguous?: boolean;
}

/**
 * Returns a random character from the given string
 * @param characters
 * @returns {string}
 */
export const getRandomCharacter = (characters: string): string => {
  const randomIndex = randomInt(0, characters.length);
  return characters[randomIndex];
};

/**
 * Checks if the given options is a number or boolean
 * @param options
 * @returns {number}
 */
export const typeCheck = (options?: number | boolean) : number => {
  if (options) {
    if (typeof options === "boolean") {
      if (options) {
        return 1;
      }
    } else if (typeof options === "number") {
      if (options < 0) {
        throw new Error("Number of characters cannot be negative.");
      }
      return options;
    }
  }

  return 0;
};

/**
 * Generates a random password with the given length and options
 * @param length
 * @param opts
 * @returns {string}
 * @throws Error
 * @example
 * const password = random(8, { lowercase: 2, uppercase: 2, numbers: 2, symbols: 2 });
 * console.log(password)
 */
export const generate = (length = 8, opts?: IRandomPassword): string => {
  const lowercase = typeCheck(opts?.lowercase) || 1;
  const uppercase = typeCheck(opts?.uppercase) || 0;
  const numbers = typeCheck(opts?.numbers) || 0;
  const symbols = typeCheck(opts?.symbols) || 0;
  const ambiguous = opts?.ambiguous || true;

  let symbolChars = "!@#$%^&*()_+[]{};:,.<>?";
  let lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  let uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let numberChars = "0123456789";

  const categoryCounts = symbols + lowercase + uppercase + numbers;

  if (length < categoryCounts) {
    throw new Error("Total length is smaller than the required characters.");
  }

  let password = "";
  let allChars = "";

  if (symbols) {
    if (ambiguous) {
      symbolChars = symbolChars.replace(/[{}[\]()/\\'"`~,;:.<>]/g, "");
    }

    for (let i = 0; i < symbols; i++) {
      password += getRandomCharacter(symbolChars);
    }
  }

  if (lowercase) {
    if (ambiguous) {
      lowercaseChars = lowercaseChars.replace(/[ilo]/g, "");
    }

    for (let i = 0; i < lowercase; i++) {
      password += getRandomCharacter(lowercaseChars);
    }

    // push lowercase to allChars so that they are also included in the random shuffle
    allChars += lowercaseChars;
  }

  if (uppercase) {
    if (ambiguous) {
      uppercaseChars = uppercaseChars.replace(/[IO]/g, "");
    }

    for (let i = 0; i < uppercase; i++) {
      password += getRandomCharacter(uppercaseChars);
    }

    // push uppercase to allChars so that they are also included in the random shuffle
    allChars += uppercaseChars;
  }

  if (numbers) {
    if (ambiguous) {
      numberChars = numberChars.replace(/[01]/g, "");
    }

    for (let i = 0; i < numbers; i++) {
      password += getRandomCharacter(numberChars);
    }

    // push numbers to allChars so that they are also included in the random shuffle
    allChars += numberChars;
  }

  // Fill up the remaining length with random characters from all categories
  while (password.length < length) {
    const category = getRandomCharacter(allChars);
    password += category;
  }

  // Convert the password string to an array and shuffle it using randomInt
  const passwordArray = password.split("");
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  password = passwordArray.join("");

  return password;
};
