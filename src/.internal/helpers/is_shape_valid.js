
export const isShapeValid = (obj, shape) => shape.every((property) => obj.hasOwnProperty(property)); 