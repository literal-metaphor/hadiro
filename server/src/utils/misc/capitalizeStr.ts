export default function capitalizeStr(str: string) {
    if (str.length <= 1) return str.toUpperCase();

    return str.split(" ").map(s => s.length <= 1 ? s.toUpperCase() : s.toUpperCase()[0] + s.toLowerCase().slice(1)).join(" "); // I love writing sadistical one-liner
}