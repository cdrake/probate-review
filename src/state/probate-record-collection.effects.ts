import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  loadProbateRecordCollections,
  loadProbateRecordCollectionsSuccess,
  loadProbateRecordCollectionsFailure,
  loadProbateRecordCollection,
  loadProbateRecordCollectionSuccess,
  loadProbateRecordCollectionFailure,
  createProbateRecordCollection,
  createProbateRecordCollectionSuccess,
  createProbateRecordCollectionFailure,
  disassociateProbateRecord,
  disassociateProbateRecordSuccess,
  disassociateProbateRecordFailure,
  associateProbateRecord,
  associateProbateRecordSuccess,
  updateProbateRecordCollection,
  updateProbateRecordCollectionSuccess,
  updateProbateRecordCollectionFailure,
  associateProbateRecordFailure,
  deleteProbateRecordCollections,
  deleteProbateRecordsCollectionsSuccess,
  deleteProbateRecordsCollectionsFailure,
} from './probate-record-collection.actions';
import { ProbateRecordService } from 'src/app/probate-record.service';
import {
  APIService,
  ProbateRecord,
  ProbateRecordCollection,
  UpdateProbateRecordCollectionInput,
} from '../app/API.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import {
  selectProbateRecordCollection,
  selectProbateRecordCollections,
} from './probate-record-collection.selectors';

@Injectable()
export class ProbateRecordCollectionEffects {
  loadProbateRecordCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProbateRecordCollections),
      switchMap(({ pageSize, filter, nextToken }) =>
        this.probateRecordService
          .getProbateRecordCollections(filter, pageSize, nextToken)
          .pipe(
            map(({ probateRecordCollections, nextToken }) =>
              loadProbateRecordCollectionsSuccess({
                probateRecordCollections,
                nextToken,
              })
            ),
            catchError((error) =>
              of(loadProbateRecordCollectionsFailure({ error }))
            )
          )
      )
    )
  );

  loadProbateRecordCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProbateRecordCollection),
      withLatestFrom(this.store.pipe(select(selectProbateRecordCollections))),
      mergeMap(([action, collections]) => {
        const existingCollection = collections.find((c) => c.id === action.id);
        if (existingCollection) {
          console.log('found existing collection');
          return of(
            loadProbateRecordCollectionSuccess({
              collection: existingCollection,
            })
          );
        } else {
          return from(
            this.apiService.GetProbateRecordCollection(action.id)
          ).pipe(
            map((response) =>
              loadProbateRecordCollectionSuccess({
                collection: response as ProbateRecordCollection,
              })
            ),
            catchError((error) =>
              of(loadProbateRecordCollectionFailure({ error }))
            )
          );
        }
      })
    )
  );

  createProbateRecordCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createProbateRecordCollection),
      mergeMap(({ title, description }) =>
        from(
          this.apiService.CreateProbateRecordCollection({
            title,
            description,
            lowerTitle: title?.toLowerCase(),
            lowerDescription: description?.toLowerCase(),
          })
        ).pipe(
          map((response) =>
            createProbateRecordCollectionSuccess({
              collection: response as ProbateRecordCollection,
            })
          ),
          catchError((error) =>
            of(createProbateRecordCollectionFailure({ error }))
          )
        )
      )
    )
  );

  updateProbateRecordCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProbateRecordCollection),
      mergeMap(({ probateRecordCollection }) =>
        from(
          this.apiService.UpdateProbateRecordCollection(probateRecordCollection)
        ).pipe(
          map((response) =>
            updateProbateRecordCollectionSuccess({
              probateRecordCollection: response as ProbateRecordCollection,
            })
          ),
          catchError((error) =>
            of(updateProbateRecordCollectionFailure({ error }))
          )
        )
      )
    )
  );

  deleteProbateRecordCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProbateRecordCollections),
      mergeMap(({ids}) => 
      from(
        this.deleteProbateRecordCollections(ids)
      ).pipe(
          map((collections) =>
            deleteProbateRecordsCollectionsSuccess({collections: collections as ProbateRecordCollection[]})
            ), 
            catchError((error) => 
              of(deleteProbateRecordsCollectionsFailure({ error }))
            )
          )
      )
    )
  );

  async deleteProbateRecordCollections(ids: string[]): Promise<ProbateRecordCollection[]> {
    const collections: ProbateRecordCollection[] = [];
    for(const id of ids) {
      const collection = await this.apiService.DeleteProbateRecordCollection({id});
      collections.push(collection as ProbateRecordCollection);
    }
    return collections;
  }

  associateProbateRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(associateProbateRecord),
      mergeMap(({ collection, recordId }) =>
        from(this.associateRecord(collection, recordId)).pipe(
          map((response) =>
            associateProbateRecordSuccess({
              collection: response as ProbateRecordCollection,
            })
          ),
          catchError((error) => of(associateProbateRecordFailure({ error })))
        )
      )
    )
  );

  disassociateProbateRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(disassociateProbateRecord),
      mergeMap((action) =>
        from(this.disassociateRecord(action.collection, action.recordId)).pipe(
          map((response) =>
            disassociateProbateRecordSuccess({ collection: response })
          ),
          catchError((error) => of(disassociateProbateRecordFailure({ error })))
        )
      )
    )
  );

  async disassociateRecord(
    collection: ProbateRecordCollection,
    recordId: string
  ): Promise<ProbateRecordCollection> {
    let updatedCollection = { ...collection };
    if (updatedCollection.probateRecordIds) {
      if (updatedCollection.probateRecordIds.includes(recordId)) {
        updatedCollection.probateRecordIds =
          updatedCollection.probateRecordIds!.filter((id) => id != recordId);
        updatedCollection = await this.apiService.UpdateProbateRecordCollection(
          updatedCollection
        );
      }
    }

    return updatedCollection;
  }

  async associateRecord(
    collection: ProbateRecordCollection,
    recordId: string
  ): Promise<ProbateRecordCollection> {
    console.log('associating ' + recordId + ' with ', collection);
    let updatedCollectionInput: UpdateProbateRecordCollectionInput = {
      ...collection,
    };
    delete updatedCollectionInput['__typename'];
    delete updatedCollectionInput['createdAt'];
    delete updatedCollectionInput['updatedAt'];
    if (updatedCollectionInput.probateRecordIds) {
      if (!updatedCollectionInput.probateRecordIds.includes(recordId)) {
        updatedCollectionInput.probateRecordIds = [
          ...updatedCollectionInput.probateRecordIds,
          recordId,
        ];
      }
    } else {
      updatedCollectionInput.probateRecordIds = [recordId];
    }
    console.log('updated collection input before svc call');
    console.log(updatedCollectionInput);
    const updatedCollection =
      await this.apiService.UpdateProbateRecordCollection(
        updatedCollectionInput
      );
    console.log('updated collection after svc call');
    console.log(updateProbateRecordCollection);
    return updatedCollection;
  }

  constructor(
    private actions$: Actions,
    private probateRecordService: ProbateRecordService,
    private apiService: APIService,
    private store: Store<AppState>
  ) {}
}
