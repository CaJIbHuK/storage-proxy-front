import {Component, Input, Inject, EventEmitter, Output} from "@angular/core";
import {StorageFile} from "app/common/models/storage.models";
import css from "./filesPath.component.css!text";

@Component({
  selector : 'files-path',
  template : `
    <div class="path">
        <div *ngFor="let folder of folders; let i = index;">
            <span class="folder" (click)="onGoToFolder.emit(folder.id)">{{folder.name}}</span>
            <span *ngIf="i < (folders.length-1)"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>
        </div>
    </div>
  `,
  styles : [css]
})
export class FilesPathComponent {
  @Output() onGoToFolder : EventEmitter<string> = new EventEmitter();
  @Input() folders : StorageFile[] = [];
  constructor() {}
}