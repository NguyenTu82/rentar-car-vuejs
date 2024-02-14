import { plainToClass } from 'class-transformer'
import { 
  validateOrReject, 
  ValidationError,
  registerDecorator, 
  ValidationOptions, 
  ValidationArguments,
} from 'class-validator'

export async function validateInput(dtoInput:any, input: any) {
  try {
    await validateOrReject(plainToClass(dtoInput, input))
    return { errors: null }
  } catch (err) {
    const validationErrors = err as ValidationError[];
    const errorsList: Record<string, string> = validationErrors.reduce(
    (prevError, currError) => {
      const property = currError.property
      const message = Object.values(currError.constraints!)[0]
      return {...prevError, [property]: message }
    },{})
    return { errors: errorsList }
  }
}

export function IsTheSameAs(compareWithProperty: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTheSameAs',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [compareWithProperty],
      options: { message: `"${propertyName}" and "${compareWithProperty}" must match`, ...validationOptions },
      validator: {
        validate(targetValue: any, args: ValidationArguments) {
          const [propertyConstraint] = args.constraints;
          const compareWithValue = (args.object as any)[propertyConstraint];
          return targetValue === compareWithValue;
        },
      },
    });
  };
}
