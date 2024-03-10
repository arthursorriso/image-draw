export function calculateAreaPolygon(vertices) {
    let area = 0;
    const n = vertices.length;

    for (let i = 0; i < n; i++) {
        const xi = vertices[i].x;
        const yi = vertices[i].y;
        const xi1 = vertices[(i + 1) % n].x;
        const yi1 = vertices[(i + 1) % n].y;
        area += xi * yi1 - xi1 * yi;
    }

    return Math.abs(area) / 2;
}