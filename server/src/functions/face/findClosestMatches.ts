import { studentPrisma } from "../../../prisma/clients.js";

const labeledDescriptors = (await studentPrisma.findMany()).map((val: { name: any; descriptor: string; }) => {
    return {
        label: val.name,
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

};

export default async function findClosestMatches(data: {descriptor: Float32Array}) {

    let { descriptor } = data;

    let descriptorArray = new Float32Array(Object.values(descriptor));

    const matches = labeledDescriptors.map((labeledDescriptor: { label: string; descriptor: Float32Array; }) => {
        const distance = euclideanDistance(labeledDescriptor.descriptor, descriptorArray);
        return { label: labeledDescriptor.label, distance: distance };
    });

    // Sort matches by distance (ascending)
    matches.sort((a: { distance: number; }, b: { distance: number; }) => a.distance - b.distance);

    // Return the top 10 closest matches
    return {
        closestMatches: matches.slice(0, 10)
    }

};
