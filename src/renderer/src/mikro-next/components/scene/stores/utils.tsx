
import { type DataType } from "zarrita";







export const mapDTypeToMinMax = (dtype: DataType): [number, number] => {
  switch (dtype) {
    case "uint8":
      return [0, 255];
    case "uint16":
      return [0, 65535];
    case "uint32":
      return [0, 4294967295];
    case "int8":
      return [-128, 127];
    case "int16":
      return [0, 65535];
    case "int32":
      return [-2147483648, 2147483647];
    case "float32":
      return [0, 1];
    case "float64":
      return [0, 1];
    case "bool":
      return [0, 1];

    default:
      throw new Error(`Unsupported dtype: ${dtype}`);
  }
};