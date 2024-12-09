import { attendancePrisma } from "../../../prisma/clients.js"

// TODO:
export default async function insight(body: {
    ascending?: true
}) {
    // const [result, totalCount] = await Promise.all([
    //     attendancePrisma.findMany({
    //         skip: ((body.page || 1) - 1) * 10,
    //         take: 10,
    //         orderBy: {
    //             created_at: "asc"
    //         },
    //         include: {
    //             student: {}
    //         }
    //     }),
    //     attendancePrisma.count()
    // ]); 
    
    // return {};
}