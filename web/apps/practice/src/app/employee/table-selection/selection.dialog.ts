import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injectable,
  numberAttribute,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { injectSelectionModel } from '@app/common/signal/ui/selection-model';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { NgxPaginationModule } from 'ngx-pagination';
import { linkedQueryParam } from 'ngxtension/linked-query-param';
import { firstValueFrom } from 'rxjs';
import { EmployeeHobby } from 'web/libs/practice/shared/data-access/api/src/lib/models/employee-hobby';

import { HobbiesQueryService } from '../../hobby/data-access/hobby.query';
import { PrimaryButtonComponent } from '../../shared/primary-button.component';

export type SelectionDialogData = {
  hobbies: EmployeeHobby[];
};

export type SelectionDialogResult = {
  hobbies: EmployeeHobby[];
};

@Injectable({ providedIn: 'root' })
export class SelectionDialogService {
  readonly dialog = inject(MatDialog);

  open(data: SelectionDialogData) {
    const dialogRef = this.dialog.open<
      SelectionDialogComponent,
      SelectionDialogData,
      SelectionDialogResult
    >(SelectionDialogComponent, {
      data,
      width: 'clamp(20rem,80vw, 40rem)',
    });
    return firstValueFrom(dialogRef.afterClosed());
  }
}

@Component({
  selector: 'app-selection-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatTableModule,
    MatCheckbox,
    NgxPaginationModule,
    MatButton,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    PrimaryButtonComponent,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title class="text-center">選擇興趣</h2>
    <div class="flex h-16 items-center justify-center gap-4">
      <form class="flex gap-4" [formGroup]="form" (submit)="submit()">
        <mat-form-field class="mt-1">
          <input
            matInput
            type="text"
            placeholder="搜尋"
            formControlName="searchText"
          />
        </mat-form-field>
        <app-primary-button
          [disabled]="
            this.form.controls.searchText.getRawValue().trim().length === 0
          "
          class="h-full"
          [label]="'搜尋'"
        />
        <button type="button" (click)="resetSubmit()" class="mb-2">
          <mat-icon>refresh</mat-icon>
        </button>
      </form>
    </div>

    <mat-dialog-content>
      @if (tableDataQuery.isPending()) {
        載入中...
      } @else if (tableDataQuery.isError()) {
        載入失敗
      } @else {
        @if (tableDataQuery.data(); as data) {
          @if (data.items.length === 0) {
            <div class="text-center text-gray-500">沒有找到符合條件的興趣</div>
            <!-- <button type="button">新增{{searchTextParams()}}</button> -->
          } @else {
            <mat-table
              class="h-64 overflow-y-auto outline"
              [dataSource]="
                data.items
                  | paginate
                    : {
                        id: 'paginate',
                        itemsPerPage: data.pageSize,
                        currentPage: data.page,
                        totalItems: data.total,
                      }
              "
              table="matTable"
            >
              <ng-container matColumnDef="checkbox">
                <mat-header-cell *matHeaderCellDef>
                  <mat-checkbox
                    [checked]="isAllSelected()"
                    (change)="toggleAll()"
                  ></mat-checkbox>
                </mat-header-cell>
                <mat-cell *matCellDef="let element">
                  <mat-checkbox
                    [checked]="selectedItems.isSelected(element)()"
                    (change)="toggleItem(element)"
                  ></mat-checkbox>
                </mat-cell>
              </ng-container>

              <ng-container matColumnDef="id">
                <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
                <mat-cell *matCellDef="let element">{{ element.id }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="name">
                <mat-header-cell *matHeaderCellDef>名稱</mat-header-cell>
                <mat-cell *matCellDef="let element">
                  {{ element.name }}
                </mat-cell>
              </ng-container>
              <mat-header-row
                *matHeaderRowDef="displayedColumns; sticky: true"
              ></mat-header-row>
              <mat-row *matRowDef="let row; colums: displayedColumns"></mat-row>
            </mat-table>
          }
        }
      }
      <div class="mt-5 flex items-center justify-center">
        <pagination-controls
          previousLabel="上一頁"
          nextLabel="下一頁"
          id="paginate"
          (pageChange)="pageChanged($event)"
          [autoHide]="true"
        >
        </pagination-controls>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button matButton type="button" matDialogClose>取消</button>
      <button matButton type="button" (click)="onConfirm()">確認</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionDialogComponent {
  readonly dialogRef = inject(
    MatDialogRef<SelectionDialogComponent, SelectionDialogResult>,
  );
  readonly data = inject<SelectionDialogData>(MAT_DIALOG_DATA);
  readonly hobbyQueryService = inject(HobbiesQueryService);
  readonly tableDataQuery = injectQuery(() =>
    this.hobbyQueryService.hobbiesQuery({
      page: this.pageParams(),
      pageSize: this.pageSizeParams(),
      searchText: this.searchTextParams(),
    }),
  );

  fb = inject(NonNullableFormBuilder);
  form = this.fb.group({
    searchText: this.fb.control(''),
  });

  readonly displayedColumns = ['checkbox', 'id', 'name'];

  readonly selectedItems = injectSelectionModel(
    true,
    this.data.hobbies,
    true,
    (a, b) => a.id === b.id,
  );

  readonly isAllSelected = computed(() => {
    const items = this.tableDataQuery.data()?.items ?? [];
    if (items.length === 0) {
      return false;
    }
    return items.every((item) => this.selectedItems.isSelected(item)());
  });

  constructor() {
    //placeholder
  }

  onConfirm() {
    const result: SelectionDialogResult = {
      hobbies: this.selectedItems.selected(),
    };
    this.dialogRef.close(result);
  }

  toggleAll() {
    if (this.isAllSelected()) {
      this.selectedItems.clear();
    } else {
      this.selectedItems.select(...(this.tableDataQuery.data()?.items ?? []));
    }
  }

  toggleItem(item: EmployeeHobby) {
    this.selectedItems.toggle(item);
  }

  pageParams = linkedQueryParam('page', {
    parse: (value) => numberAttribute(value, 1),
    stringify: (value) => value.toString(),
  });

  pageSizeParams = linkedQueryParam('pageSize', {
    parse: (value) => numberAttribute(value, 10),
    stringify: (value) => value.toString(),
  });

  searchTextParams = linkedQueryParam('searchText', {
    parse: (value) => value || '',
    stringify: (value) => value,
  });

  pageChanged(page: number) {
    this.pageParams.set(page);
  }

  submit() {
    this.searchTextParams.set(
      this.form.controls.searchText.getRawValue().trim(),
    );
    this.pageChanged(1); //Reset to first page when submit
  }

  resetSubmit() {
    this.searchTextParams.set('');
    this.pageChanged(1);
  }
}
