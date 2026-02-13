import { FindOptionsWhere } from 'typeorm';
import { NullableType } from './nullable.type';

export type EntityCondition<T> =
  | FindOptionsWhere<T>
  | NullableType<FindOptionsWhere<T>>;
