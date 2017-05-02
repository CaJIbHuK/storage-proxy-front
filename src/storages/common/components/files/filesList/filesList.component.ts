import {Component, Input, Inject, EventEmitter, Output} from "@angular/core";
import {StorageFile} from "app/common/models/storage.models";
import css from "./filesList.component.css!text";


@Component({
  selector : 'files-list',
  template : `<div class="files-list">
    <div class="row table-header">
        <div class="col-md-1 file-field file-field-logo"></div>
        <div class="col-md-5 file-field file-field-name">Filename</div>
        <div class="col-md-2 file-field file-field-size">Size</div>
        <div class="col-md-2 file-field file-field-updated">Updated</div>
        <div class="col-md-1 file-field file-field-encrypted">Encrypted</div>
    </div>
    <hr>
    <div class="table-body">
        <div *ngIf="previousFolder" class="row file" [ngClass]="{selected : isSelected(previousFolder)}" (click)="selectFile(previousFolder)" (dblclick)="onGoToFolder.emit(previousFolder.id)">
            <div class="col-md-1 file-field file-field-logo"><i class="fa fa-folder" aria-hidden="true"></i></div>
            <div class="col-md-5 file-field file-field-name">..</div>
            <div class="col-md-2 file-field file-field-size">-</div>
            <div class="col-md-2 file-field file-field-updated">-</div>
            <div class="col-md-1 file-field file-field-encrypted">-</div>
        </div>
        <div *ngFor="let file of files" class="row file" [ngClass]="{selected : isSelected(file)}" (click)="selectFile(file)" (dblclick)="dbClickFile(file)">
            <div class="col-md-1 file-field file-field-logo" *ngIf="file.folder"><i class="fa fa-folder"
                                                                                    aria-hidden="true"></i></div>
            <div class="col-md-1 file-field file-field-logo" *ngIf="!file.folder"><i class="fa fa-file-o"
                                                                                     aria-hidden="true"></i></div>
            <div class="col-md-5 file-field file-field-name">{{file.name}}</div>
            <div class="col-md-2 file-field file-field-size">{{(file.size | fileSize) || '-'}}</div>
            <div class="col-md-2 file-field file-field-updated">{{file.updatedAt | date }}</div>
            <div class="col-md-1 file-field file-field-encrypted"><i *ngIf="file.encrypted" class="fa fa-check" aria-hidden="true"></i></div>
        </div>
    </div>
</div>
  `,
  styles : [css]
})
export class FilesListComponent {
  @Output() onGoToFolder : EventEmitter = new EventEmitter();
  @Output() onDownloadFile : EventEmitter = new EventEmitter();

  selectedFilesIDs : number[] = [];
  multipleChoice : boolean = false;

  @Input() folder : StorageFile;
  @Input() previousFolder : StorageFile = null;
  @Input() files : StorageFile[] = [];

  constructor() {

    window.onkeyup = (e) => {
      //ctrl for multiselect
      if (e.keyCode === 17) this.multipleChoice = false
    };
    window.onkeydown = (e) => {
      //ctrl for multiselect
      if (e.keyCode === 17) this.multipleChoice = true
      //enter - choice
      if (e.keyCode === 13 && this.selectedFilesIDs.length === 1)
        this.dbClickFile(this.files.find(f => f.id === this.selectedFilesIDs[0]));
      //arrowdown
      if (e.keyCode === 40 && this.selectedFilesIDs.length) {
        let index = this.files.findIndex(f => f.id === this.selectedFilesIDs[this.selectedFilesIDs.length-1]);
        let nextFileIndex = index + 1 <= this.files.length-1 ? index + 1 : this.files.length-1;
        this.multipleChoice = false;
        this.selectFile(this.files[nextFileIndex]);
      }
      //arrowup
      if (e.keyCode === 38 && this.selectedFilesIDs.length) {
        let index = this.files.findIndex(f => f.id === this.selectedFilesIDs[this.selectedFilesIDs.length-1]);
        let nextFileIndex = index - 1 || 0;
        this.multipleChoice = false;
        this.selectFile(this.files[nextFileIndex]);
      }
    }
  }

  isSelected(file : StorageFile) : boolean {
    return !!this.selectedFilesIDs.find(id => id === file.id);
  }

  selectFile(file : StorageFile) {
    if (this.previousFolder && this.previousFolder.id === file.id) this.multipleChoice = false;
    if (this.multipleChoice) {
      let index = this.selectedFilesIDs.indexOf(file.id);
      if (index > 0) this.selectedFilesIDs.splice(index, 1);
      else this.selectedFilesIDs.push(file.id);
    } else {
      this.selectedFilesIDs = [file.id];
    }
  }

  dbClickFile(file : StorageFile) {
    if (file.folder) this.onGoToFolder.emit(file.id);
    else this.showInfo(file);
  }

  showInfo(file : StorageFile) {
    console.log(JSON.stringify(file));
    this.onDownloadFile.emit(file.id);
  }

}