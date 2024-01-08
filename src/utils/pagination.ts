import type GetQuery from "@/types/get-query.interface";
import type { PaginationParams } from "@/types/pagination-params";

const paginatedChange = (data: PaginationParams, params: PaginationParams, func: GetQuery) => {
    params.current_page = data.current_page;
    params.pagesize = data.pagesize;
    params.sort_column = data.sort_column;
    params.sort_direction = data.sort_direction;

    func(params.current_page, params.pagesize, params.sort_column, params.sort_direction);
};

export { paginatedChange };