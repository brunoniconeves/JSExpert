const { readFile} = require('fs/promises');
const User = require('./user.js');

const {error} = require('./constants.js');

const DEFAULT_OPTION = { 
  maxLines: 3, 
  fields: ["id", "name", "profession", "age"] 
};

class file {
  static async csvToJson(filePath) {
    const content = await file.getFileContent(filePath);
    const validation = file.isValid(content);

    if(!validation.valid) {
      throw new Error(validation.error);
    }

    const users = file.parseCSVToJSON(content);

    return users;
  }

  static async getFileContent(filePath) {
    return (await readFile(filePath)).toString('utf8');
  }

  static isValid(csvString, options = DEFAULT_OPTION) {
    const [header, ...fileWithoutHeader] = csvString.split('\r\n');
    const isHeaderValid = header === options.fields.join(',');

    if (header == '' && fileWithoutHeader.length == 0) {
      return {
        error: error.FILE_EMPTY_ERROR_MESSAGE,
        valid: false
      };
    }

    if (fileWithoutHeader.length == 0) {
      return {
        error: error.FILE_WITHOUT_RECORDS,
        valid: false
      };
    }
    
    if (!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false
      };
    }

    const isContentLengthAccepted = (
      fileWithoutHeader.length > 0 &&
      fileWithoutHeader.length <= options.maxLines
    )

    if(!isContentLengthAccepted) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false
      };
    }

    return { valid: true };
  }

  static parseCSVToJSON(csvString) {
    const lines = csvString.split('\r\n');
    //remove o primeiro item e joga na variável
    const firstLine = lines.shift();
    const header = firstLine.split(',');
    const users = lines.map(line => {
      const columns = line.split(',');
      let user = {};
      for(const index in columns) {
        user[header[index]] = columns[index];
      }
      return new User(user);
    });
    return users;
  }
}

module.exports = file;