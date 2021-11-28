import { Router } from "express";
import type { Request, Response } from "express";
import validator from "validator";

import User from "@/models/User";
import { sendJSONStatus } from "@/util";

const router = Router();

async function handler(req: Request, res: Response) {
  const registerBody: ApiAccountRegisterRequest = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordRepeat: req.body.passwordRepeat,
  };

  const registerValidateResult = localValidation.checkRegistrationFields(registerBody);

  if (!registerValidateResult.isValid)
    return sendJSONStatus<ApiAccountRegisterRespond>(res, {
      code: 1,
      message: "failed",
      errors: registerValidateResult.errors,
    });

  const isNameDuplicate = await User.exists({ NameForLocate: registerBody.name });
  if (isNameDuplicate)
    return sendJSONStatus<ApiAccountRegisterRespond>(res, {
      code: 1,
      message: "username duplicate",
    });

  try {
    const newDocument = new User({
      NameForView: registerBody.email,
      NameForLocate: registerBody.name,
      Password: registerBody.password,
    });
    await newDocument.save();
    return sendJSONStatus<ApiAccountRegisterRespond>(res, { code: 0, message: "success" });
  } catch (error) {
    console.log(req.baseUrl, error);
    return sendJSONStatus<ApiAccountRegisterRespond>(res, { code: 2, message: "error" });
  }
}

router.post("/", handler);
export default router;

namespace localValidation {
  const REGISTER__CONFIG = {
    NAME__MIN__LENGTH: 4,
    NAME__MAX__LENGTH: 12,
    NICKNAME__MIN__LENGTH: 4,
    NICKNAME__MAX__LENGTH: 12,
    PASSWORD__MIN__LENGTH: 8,
    PASSWORD__MAX__LENGTH: 16,
  };
  const isEmpty = (field) => {
    try {
      let result = false;

      if (
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim().length === 0) ||
        (typeof field === "object" && Object.keys(field).length === 0)
      )
        result = true;

      return result;
    } catch (err) {
      return err;
    }
  };
  export function checkRegistrationFields(data: ApiAccountRegisterRequest): validationResult {
    const errors: Array<validationError> = [];
    const onlyLetterNumberUndescore = /^\w+$/;
    const containSpace = /\s/;

    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.passwordRepeat = !isEmpty(data.passwordRepeat) ? data.passwordRepeat : "";

    if (validator.isEmpty(data.name)) {
      errors.push({ field: "name", message: "name is required" });
    }
    if (
      !validator.isLength(data.name, {
        min: REGISTER__CONFIG.NAME__MIN__LENGTH,
        max: REGISTER__CONFIG.NAME__MAX__LENGTH,
      })
    ) {
      errors.push({
        field: "name",
        message: `name length must between ${REGISTER__CONFIG.NAME__MIN__LENGTH} to ${REGISTER__CONFIG.NAME__MAX__LENGTH}`,
      });
    }
    if (containSpace.test(data.name)) {
      errors.push({ field: "name", message: "name can not contain space" });
    }
    if (!onlyLetterNumberUndescore.test(data.name)) {
      errors.push({
        field: "name",
        message: "name can only contain letters,numbers and underscore",
      });
    }

    if (validator.isEmpty(data.email)) {
      errors.push({ field: "nickname", message: "nickname is required" });
    }
    if (
      !validator.isLength(data.email, {
        min: REGISTER__CONFIG.NICKNAME__MIN__LENGTH,
        max: REGISTER__CONFIG.NICKNAME__MAX__LENGTH,
      })
    ) {
      errors.push({
        field: "nickname",
        message: `email length must between ${REGISTER__CONFIG.NICKNAME__MIN__LENGTH} to ${REGISTER__CONFIG.NICKNAME__MAX__LENGTH}`,
      });
    }
    if (containSpace.test(data.email)) {
      errors.push({ field: "nickname", message: "nickname can not contain space" });
    }

    if (validator.isEmpty(data.password)) {
      errors.push({ field: "password", message: "password is required" });
    }
    if (containSpace.test(data.password)) {
      errors.push({ field: "password", message: "password can not contain space" });
    }
    if (!onlyLetterNumberUndescore.test(data.password)) {
      errors.push({
        field: "password",
        message: "password can only contain letters,numbers and underscore",
      });
    }
    if (
      !validator.isLength(data.password, {
        min: REGISTER__CONFIG.PASSWORD__MIN__LENGTH,
        max: REGISTER__CONFIG.PASSWORD__MAX__LENGTH,
      })
    ) {
      errors.push({
        field: "password",
        message: `password length must between ${REGISTER__CONFIG.PASSWORD__MIN__LENGTH} to ${REGISTER__CONFIG.PASSWORD__MAX__LENGTH}`,
      });
    }

    if (validator.isEmpty(data.passwordRepeat)) {
      errors.push({ field: "passwordRepeat", message: "confirmation of password is required" });
    }
    if (!validator.equals(data.password, data.passwordRepeat)) {
      errors.push({ field: "passwordRepeat", message: "password not match" });
    }

    return {
      errors,
      isValid: errors.length === 0,
    };
  }
}
