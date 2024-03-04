import {BaseQueryParams} from "./base-query-params";

export interface QueryParams extends BaseQueryParams{
  name?: string | null;
  tagId?: string | null;
  brandId?: string | null;
  countryId?: string | null;
  lineId?: string | null;
  heavinessId?: string | null;
}
