export default interface GetQuery {
    (page?: number, limit?: number, sort?: string, order?: string): Promise<void>
}

