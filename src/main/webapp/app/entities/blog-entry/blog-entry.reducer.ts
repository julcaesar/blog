import axios from 'axios';
import {
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction
} from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IBlogEntry, defaultValue } from 'app/shared/model/blog-entry.model';

export const ACTION_TYPES = {
  FETCH_BLOGENTRY_LIST: 'blogEntry/FETCH_BLOGENTRY_LIST',
  FETCH_BLOGENTRY: 'blogEntry/FETCH_BLOGENTRY',
  CREATE_BLOGENTRY: 'blogEntry/CREATE_BLOGENTRY',
  UPDATE_BLOGENTRY: 'blogEntry/UPDATE_BLOGENTRY',
  DELETE_BLOGENTRY: 'blogEntry/DELETE_BLOGENTRY',
  SET_BLOB: 'blogEntry/SET_BLOB',
  RESET: 'blogEntry/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IBlogEntry>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type BlogEntryState = Readonly<typeof initialState>;

// Reducer

export default (state: BlogEntryState = initialState, action): BlogEntryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_BLOGENTRY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_BLOGENTRY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_BLOGENTRY):
    case REQUEST(ACTION_TYPES.UPDATE_BLOGENTRY):
    case REQUEST(ACTION_TYPES.DELETE_BLOGENTRY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_BLOGENTRY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_BLOGENTRY):
    case FAILURE(ACTION_TYPES.CREATE_BLOGENTRY):
    case FAILURE(ACTION_TYPES.UPDATE_BLOGENTRY):
    case FAILURE(ACTION_TYPES.DELETE_BLOGENTRY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_BLOGENTRY_LIST):
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_BLOGENTRY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_BLOGENTRY):
    case SUCCESS(ACTION_TYPES.UPDATE_BLOGENTRY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_BLOGENTRY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.SET_BLOB:
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType
        }
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/blog-entries';

// Actions

export const getEntities: ICrudGetAllAction<IBlogEntry> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_BLOGENTRY_LIST,
    payload: axios.get<IBlogEntry>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IBlogEntry> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_BLOGENTRY,
    payload: axios.get<IBlogEntry>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IBlogEntry> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BLOGENTRY,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const updateEntity: ICrudPutAction<IBlogEntry> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_BLOGENTRY,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IBlogEntry> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_BLOGENTRY,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType
  }
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
