import {BaseQueryParams} from "./base-query-params";

export interface Filter extends BaseQueryParams{
  name?: string | null;
  tagId?: string | null;
  brandId?: string | null;
  countryId?: string | null;
  lineId?: string | null;
  heavinessId?: string | null;
}
