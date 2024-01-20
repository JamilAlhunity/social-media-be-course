/* DO NOT EDIT, file generated by nestjs-i18n */

import { Path } from "nestjs-i18n";
export type I18nTranslations = {
    "auth": {
        "errors": {
            "unauthorized": string;
            "loginFirst": string;
            "wrongCredentials": string;
            "register": string;
            "login": string;
            "ability": {
                "create": string;
                "read": string;
                "update": string;
                "delete": string;
            };
        };
        "success": {
            "login": string;
            "logout": string;
        };
    };
    "entities": {
        "user": string;
        "admin": string;
        "room": string;
        "message": string;
        "email": string;
        "notification": string;
        "post": string;
    };
    "shared": {
        "success": {
            "create": string;
            "update": string;
            "delete": string;
            "reject": string;
            "approve": string;
            "findOne": string;
            "findAll": string;
        };
        "errors": {
            "create": string;
            "update": string;
            "delete": string;
            "readAll": string;
            "readOne": string;
            "reject": string;
            "approve": string;
        };
    };
    "validation": {
        "isNotEmpty": string;
        "min": string;
        "isString": string;
        "isInt": string;
        "max": string;
        "email": string;
        "minLength": string;
        "phoneNumber": string;
        "maxLength": string;
        "uniqueProperty": string;
        "passwordContains": {
            "uppercase": string;
            "lowercase": string;
            "number": string;
            "specialCharacter": string;
        };
        "confirmPasswordContains": {
            "uppercase": string;
            "lowercase": string;
            "number": string;
            "specialCharacter": string;
        };
        "date": string;
        "confirmPasswordMatch": string;
        "invalidMongoDBID": string;
        "throttlerError": string;
        "fileType": string;
        "fileSize": string;
        "isInvalidPost": string;
    };
};
export type I18nPath = Path<I18nTranslations>;
