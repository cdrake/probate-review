import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecordsComponent } from './records/records.component';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { UploadComponent } from './upload/upload.component';
import { AuthComponent } from './auth/auth.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UnreviewedComponent } from './unreviewed/unreviewed.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { SearchResultsComponent } from './search-results/search-results.component';
import { UnreviewedDetailComponent } from './unreviewed-detail/unreviewed-detail.component';
import { AngularSplitModule } from 'angular-split';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { CombineLineDialogComponent } from './combine-line-dialog/combine-line-dialog.component';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { ProbateRecordListComponent } from './probate-record-list/probate-record-list.component';
import { StoreModule } from '@ngrx/store';
import { appReducer } from 'src/state/app.reducer';
import { probateRecordReducer } from 'src/state/probate-record.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProbateRecordEffects } from '../state/probate-record.effects';
import { ReviewedListComponent } from './reviewed-list/reviewed-list.component';

@NgModule({
  declarations: [
    AppComponent,
    RecordsComponent,
    RecordDetailComponent,
    UploadComponent,
    AuthComponent,
    ContextMenuComponent,
    UnreviewedComponent,
    SearchComponent,
    SearchResultsComponent,
    UnreviewedDetailComponent,
    ConfirmDeleteDialogComponent,
    HelpDialogComponent,
    CombineLineDialogComponent,
    ProbateRecordListComponent,
    ReviewedListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyAuthenticatorModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule,
    MatListModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatToolbarModule,
    MatPaginatorModule,
    FormsModule,
    AngularSplitModule,
    DragDropModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSortModule,
    StoreModule.forRoot({
      root: appReducer,
      probateRecords: probateRecordReducer,
    }),
    EffectsModule.forRoot([ProbateRecordEffects]),
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
