import { studentPrisma } from "../../../prisma/clients.js";

const labeledDescriptors = (await studentPrisma.findMany()).map(val => {
    return {
        label: val.name,
        grade: val.grade,
        department: val.department,
        class_code: val.class_code,
        descriptor: new Float32Array(val.descriptor.split(',').map(Number))
    }
});

function euclideanDistance(descriptor1: Float32Array, descriptor2: Float32Array) {

    if (descriptor1.length !== descriptor2.length) {
        throw new Error("Descriptors must have the same length");
    }

    let sum = 0;

    for (let i = 0; i < descriptor1.length; i++) {
        const diff = descriptor1[i] - descriptor2[i];
        sum += diff * diff;
    }

    return Math.sqrt(sum);

}

export default async function findClosestMatches(data: {
    descriptor: Float32Array,
    grade: string,
    department: string,
    class_code: string
}) {

    const topN = 1;

    let { descriptor, grade, department, class_code } = data;

    let descriptorArray = new Float32Array(Object.values(descriptor));

    // Filter labeledDescriptors based on grade, department, and class_code
    const filteredDescriptors = labeledDescriptors.filter(labeledDescriptor => {
        return labeledDescriptor.grade === grade &&
               labeledDescriptor.department === department &&
               labeledDescriptor.class_code === class_code;
    });

    // Calculate the distances
    const matches = filteredDescriptors.map(labeledDescriptor => {
        const distance = euclideanDistance(labeledDescriptor.descriptor, descriptorArray);
        return { 
            label: labeledDescriptor.label,
            grade: labeledDescriptor.grade,
            department: labeledDescriptor.department,
            class_code: labeledDescriptor.class_code,
            distance: distance 
        };
    });

    // Sort matches by distance (ascending)
    matches.sort((a, b) => a.distance - b.distance);

    // Return the top N closest match(es)
    return {
        closestMatches: matches.slice(0, topN)
    }

}
