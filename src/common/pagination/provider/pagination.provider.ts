import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
    constructor(
        @Inject(REQUEST)
        private readonly request:Request
    ){}

    async paginateQuery<T extends ObjectLiteral>(
        paginateQuery:PaginationQueryDto, 
        repository:Repository<T>
    ):Promise<Paginated<T>>{

        if(!paginateQuery.page || !paginateQuery.limit){
            throw new Error('Page and limit are required')
        }

        const result = await repository.find({
            skip:(paginateQuery.page - 1) * paginateQuery.limit,
            take: paginateQuery.limit
        })

        const baseUrl = this.request.protocol + '://' + this.request.headers.host
        
        const newUrl = new URL(this.request.url, baseUrl)

        const totalItems = await repository.count()

        const totalPages = Math.ceil(totalItems / paginateQuery.limit)

        const nextPage = paginateQuery.page === totalPages ? paginateQuery.page : paginateQuery.page + 1

        const prevPage = paginateQuery.page === 1 ? paginateQuery.page : paginateQuery.page - 1 

        return {
            data: result,
            metadata:{
                itemPerPage: paginateQuery.limit,
                totalItems,
                currentPage: paginateQuery.page,
                totalPages,
            },
            links:{
                    first: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=1`,
                    last: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${totalPages}`,
                    current: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${paginateQuery.page}`,
                    next: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${nextPage}`,
                    prev: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${prevPage}`,
            }
        }
    }
}