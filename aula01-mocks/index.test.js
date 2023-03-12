const { rejects, deepStrictEqual } = require('assert');
const { error } = require('./src/constants.js');
const File = require('./src/file.js');

(async () => {
  {
    const filePath = './mocks/emptyFile-invalid.csv';
    const rejection = new Error(error.FILE_EMPTY_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);
    await rejects(result, rejection);
  };
  {
    const filePath = './mocks/fourItems-invalid.csv';
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);
    await rejects(result, rejection);
  };
  {
    const filePath = './mocks/threeItems-valid.csv';
    const result = await File.csvToJson(filePath);
    const expected = [
      {
        "name": "Bruno Bastos",
        "id": 123,        
        "profession": "Javascript Specialist",
        "birthDay": 1990
      },
      {
        "name": "Erick Wendel",
        "id": 321,        
        "profession": "Javascript Instructor",
        "birthDay": 1998
      },
      {
        "name": "Mariazinha",
        "id": 231,        
        "profession": "Javascript Developer",
        "birthDay": 1993
      }
    ];

    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  };
})();