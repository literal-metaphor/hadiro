import { studentPrisma } from "../../../prisma/clients.js"

export default async function paginate(body: {
    page?: number,

    // Filter
    grade?: string,
    class_code?: string,
    department?: string,
}) {
    const { page,
        grade, class_code, department } = body;

    const [result, totalCount] = await Promise.all([
        studentPrisma.findMany({
            where: {
                grade,
                class_code,
                department,
            },
            skip: ((page || 1) - 1) * 10,
            take: 10,
            orderBy: {
                name: "desc"
            }
        }).then(val => val.map(({ descriptor, ...rest }) => rest)),
        studentPrisma.count({
            where: {
                grade,
                class_code,
                department,
            },
        })
    ]);
    
    return {
        result,
        totalPages: Math.ceil(totalCount / 10)
    };        
}