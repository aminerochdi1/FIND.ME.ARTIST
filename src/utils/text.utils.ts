export default class TextUtils {
  public static truncateString(str: string, maxLength: number) {
    if (str.length <= maxLength) {
      return str;
    }

    const truncatedStr = str.substr(0, maxLength);
    const lastSpaceIndex = truncatedStr.lastIndexOf(' ');

    if (lastSpaceIndex !== -1) {
      return truncatedStr.substr(0, lastSpaceIndex);
    }

    return truncatedStr;
  }

  public static stringifyArray(strings: string[]) {
    let string = "";
    for(let i = 0; i < strings.length; i++){
      string += (i == 0 ? "" : ", ") + strings[i];
    }
    return string;
  }

  public static capitalizeFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}