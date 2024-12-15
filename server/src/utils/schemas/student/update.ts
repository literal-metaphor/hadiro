import Joi from "joi";
import { StudentGradeEnum } from "../../enums/StudentGrade.js";
import { StudentDepartmentEnum } from "../../enums/StudentDepartment.js";

export default function schema() {
    return Joi.object({
        id: Joi.string()
            .required()
        ,
        name: Joi.string()
            .required()
        ,
        grade: Joi.string()
            .required()
            .valid(...Object.keys(StudentGradeEnum))
        ,
        class_code: Joi.string()
            .required()
        ,
        department: Joi.string()
            .required()
            .valid(...Object.keys(StudentDepartmentEnum))
        ,
        descriptor: Joi.string()
            .required()
        ,
        photo_path: Joi.string()
            .required()
        ,
    }); 
}