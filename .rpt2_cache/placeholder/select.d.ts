declare const select: {
    select: (column?: string) => any;
    from: (table: any) => any;
    limit: (_limit: any) => any;
    where: (condition?: string) => any;
    groupBy: (condition?: string) => any;
    orderBy: (condition?: string, order?: string) => any;
    duration: (timeIndex?: string, t?: string) => any;
    today: (timeIndex: any) => any;
    query: () => Promise<any>;
    count: () => Promise<any>;
};
export default select;
