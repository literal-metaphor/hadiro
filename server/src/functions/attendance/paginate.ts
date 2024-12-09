import { attendancePrisma } from "../../../prisma/clients.js"

export default async function paginate(body: {
    page?: number,
}) {
    const [result, totalCount] = await Promise.all([
        attendancePrisma.findMany({
            skip: ((body.page || 1) - 1) * 10,
            take: 10,
            orderBy: {
                created_at: "asc"
            },
            include: {
                student: {
                    select: {
                        name: true
                    }
                }
            }
        }),
        attendancePrisma.count()
    ]);
    
    return {
        result,
        totalPages: Math.ceil(totalCount / 10)
    };        
}