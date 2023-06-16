import { createAction, props } from '@ngrx/store';
import {
  ModelProbateRecordCollectionFilterInput,
  ProbateRecordCollection,
} from '../app/API.service';

export const loadProbateRecordCollections = createAction(
  '[Probate Record Collection] Load ProbateRecordCollections',
  props<{
    pageSize: number;
    filter?: ModelProbateRecordCollectionFilterInput;
    nextToken?: string;
  }>()
);

export const loadProbateRecordCollectionsSuccess = createAction(
  '[Probate Record Collection] Load Probate Record Collections Success',
  props<{ probateRecordCollections: ProbateRecordCollection[]; nextToken: string | null }>()
);

export const loadProbateRecordCollectionsSuccessWithHistoryState = createAction(
  '[Probate Record Collection] Load Probate Record Collections Success with History State',
  props<{ probateRecordCollections: ProbateRecordCollection[] }>()
);

export const loadProbateRecordCollectionsFailure = createAction(
  '[Probate Record Collection] Load Probate Record Collections Failure',
  props<{ error: any }>()
);

export const clearProbateRecordCollections = createAction('[ProbateRecordCollection] Clear Returned Records');

export const updateProbateRecordCollection = createAction(
  '[Probate Record Collection] Update Probate Record',
  props<{ probateRecordCollection: ProbateRecordCollection }>()
);

export const createProbateRecordCollection = createAction(
  '[Probate Record Collection] Create Probate Record',
  props<{ probateRecordCollection: ProbateRecordCollection }>()
);

export const deleteProbateRecordCollection = createAction(
  '[Probate Record Collection] Delete Probate Record',
  props<{ id: string }>()
);

export const updateProbateRecordCollectionSuccess = createAction(
  '[Probate Record Collection] Update Probate Record Success',
  props<{ probateRecordCollection: ProbateRecordCollection }>()
);

// Action creator function
export const updateProbateRecordCollectionAction = (probateRecordCollection: ProbateRecordCollection) => {
  return updateProbateRecordCollection({ probateRecordCollection });
};

export const setPage = createAction(
  '[Probate Record Collection] Set Current Page',
  props<{ currentPage: number }>()
);
