import { XMLParser } from "fast-xml-parser";

const options = {
  parseTagValue: false,     
};

function convertToJSON(data) {
  const parser = new XMLParser(options);
  return parser.parse(data);
}

export default convertToJSON;

