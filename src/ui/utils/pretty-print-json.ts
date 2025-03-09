export function prettyPrintJson(json: object, indent: number = 0): string {
  let result = '';
  const indentation = '  '.repeat(indent); // Indentation using 2 spaces per level

  if (typeof json === 'object' && json !== null) {
    result += '{\n';
    for (const key in json) {
      if (Object.hasOwnProperty.call(json, key)) {
        result += `${indentation}  "${key}": ${prettyPrintJson(
          json[key],
          indent + 1,
        )},\n`;
      }
    }
    result = result.replace(/,\n$/, '\n'); // Remove the last comma and newline
    result += `${indentation}}`;
  } else {
    result += `"${json}"`;
  }

  return result;
}
