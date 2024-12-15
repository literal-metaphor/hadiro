import Joi, { object } from "joi";
import { StudentGradeEnum } from "../../enums/StudentGrade.js";
import { StudentDepartmentEnum } from "../../enums/StudentDepartment.js";

export default function schema() {
    return Joi.object({
        descriptor: Joi.array().required(),
        grade: Joi.string().required().valid(...Object.keys(StudentGradeEnum)),
        department: Joi.string().required().valid(...Object.keys(StudentDepartmentEnum)),
        class_code: Joi.string().required(),
    });
}