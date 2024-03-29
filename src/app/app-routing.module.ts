import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RecordDetailComponent } from './record-detail/record-detail.component';
// import { RecordsComponent } from './records/records.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchComponent } from './search/search.component';
// import { UnreviewedComponent } from './unreviewed/unreviewed.component';
import { UploadComponent } from './upload/upload.component';
import { UnreviewedDetailComponent } from './unreviewed-detail/unreviewed-detail.component';
import { ReviewedListComponent } from './reviewed-list/reviewed-list.component';
import { ProbateRecordCollectionListComponent } from './probate-record-collection-list/probate-record-collection-list.component';
import { ProbateRecordCollectionDetailComponent } from './probate-record-collection-detail/probate-record-collection-detail.component';
import { CreateProbateRecordCollectionComponent } from './create-probate-record-collection/create-probate-record-collection.component';
import { LoadRecordListViewComponent } from './load-record-list-view/load-record-list-view.component';
import { UnreviewedComponent } from './unreviewed/unreviewed.component';
import { EditProbateRecordDetailComponent } from './edit-probate-record-detail/edit-probate-record-detail.component';
import { LoadCollectionListViewComponent } from './load-collection-list-view/load-collection-list-view.component';
import { DeletedRecordListViewComponent } from './deleted-record-list-view/deleted-record-list-view.component';
const routes: Routes = [
  { path: 'records', component: ReviewedListComponent },
  { path: 'record/:id', component: RecordDetailComponent },
  {
    path: 'review/:id',
    component: UnreviewedDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'unreviewed',
    component: UnreviewedComponent,
    canActivate: [AuthGuard],
  },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  { path: '', component: SearchComponent },
  { path: 'search/:q', component: SearchResultsComponent },
  { path: 'collections', component: ProbateRecordCollectionListComponent },
  { path: 'deleted', component: DeletedRecordListViewComponent },
  {
    path: 'probate-record-collections/create',
    component: CreateProbateRecordCollectionComponent,
  },
  {
    path: 'probate-record-collections/:id',
    component: ProbateRecordCollectionDetailComponent,
  },
  {
    path: 'edit/:id',
    component: EditProbateRecordDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
