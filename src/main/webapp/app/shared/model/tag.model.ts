import { IBlogEntry } from 'app/shared/model/blog-entry.model';

export interface ITag {
  id?: number;
  name?: string;
  entries?: IBlogEntry[];
}

export const defaultValue: Readonly<ITag> = {};
