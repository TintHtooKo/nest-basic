// <T> is for all types. Eg User, Post, etc
export interface Paginated<T> {
    data: T[];
    metadata: {
        itemPerPage: number
        currentPage: number
        totalItems: number
        totalPages: number
    };
    links:{
        first: string
        last: string
        current: string 
        next: string
        prev: string
    }
}