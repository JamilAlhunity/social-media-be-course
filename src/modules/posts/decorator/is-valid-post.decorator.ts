/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { DynamicObjectI } from 'shared/interfaces/general/dynamic-object.interface';

@ValidatorConstraint({ name: 'IsValidPost', async: false })
class IsValidPostValidator implements ValidatorConstraintInterface {
    validate(_value: unknown, args: ValidationArguments): boolean {
        const { text, image, video } = args.object as DynamicObjectI;

        if ((image && video) || (!image && !video && !text)) {
            throw new HttpException(
                'Post must have at least one of the following: text, image, or video.',
                HttpStatus.BAD_REQUEST,
            );
        }

        return true;
    }
}

export const IsValidPost = (validationOptions: ValidationOptions) => {
    return (object: Object, propertyName: string) =>
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsValidPostValidator,
        });
};