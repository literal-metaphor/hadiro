export type RouteDictionary = {
    resource: string;
    method: "get" | "post" | "put" | "delete";
    path: string;
    level?: number;
}