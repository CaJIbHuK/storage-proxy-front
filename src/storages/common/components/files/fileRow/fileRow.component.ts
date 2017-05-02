import {Component, Input, Inject} from "@angular/core";
import {StorageFile} from "app/common/models/storage.models";
import css from "./fileRow.component.css!text";

@Component({
  selector : 'files-list-row',
  template : `
    <div class="files-list-row">
      <div class="file" *ngIf="file">
      </div>
    </div>
  `,
  styles : [css]
})
export class FilesListRowComponent {
  @Input() file : StorageFile | null = null;
  constructor() {}
}