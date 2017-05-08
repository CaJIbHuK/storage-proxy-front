import {Component, Input, Inject, OnInit, EventEmitter, Output, ViewChild} from "@angular/core";
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
    <div class="table-body">
        <div *ngIf="previousFolder" class="row file" [ngClass]="{selected : isSelected(previousFolder)}" (click)="selectFile(previousFolder)" (dblclick)="onGoToFolder.emit(previousFolder.id)">
            <div class="col-md-1 file-field file-field-logo"><i class="fa fa-folder" aria-hidden="true"></i></div>
            <div class="col-md-5 file-field file-field-name">..</div>
            <div class="col-md-2 file-field file-field-size">-</div>
            <div class="col-md-2 file-field file-field-updated">-</div>
            <div class="col-md-1 file-field file-field-encrypted">-</div>
        </div>
        <div *ngFor="let file of files" class="row file" [contextmenu]="[contextmenu, {item: file}]" [ngClass]="{selected : isSelected(file)}" (contextmenu)="selectFile(file)" (click)="selectFile(file)" (dblclick)="dbClickFile(file)">
            <div class="col-md-1 file-field file-field-logo" *ngIf="file.folder"><i class="fa fa-folder"
                                                                                    aria-hidden="true"></i></div>
            <div class="col-md-1 file-field file-field-logo" *ngIf="!file.folder"><i class="fa fa-file-o"
                                                                                     aria-hidden="true"></i></div>
            <div class="col-md-5 file-field file-field-name">{{file.name}}</div>
            <div class="col-md-2 file-field file-field-size">{{(file.size | fileSize) || '-'}}</div>
            <div class="col-md-2 file-field file-field-updated">{{file.updatedAt | date }}</div>
            <div class="col-md-1 file-field file-field-encrypted"><i *ngIf="file.encrypted" class="fa fa-check" aria-hidden="true"></i></div>
            <preloader class="file-preloader" *ngIf="file.locked"></preloader>
        </div>
    </div>
      <contextmenu #contextmenu>
          <div class="dropdown show">
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <button class="dropdown-item" (click)="showInfo(contextmenu.get('item'))">Show Info</button>
                  <button class="dropdown-item {{contextmenu.get('item.locked') && 'disabled'}}" (click)="downloadFile(contextmenu.get('item'))">Download</button>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item {{contextmenu.get('item.locked') && 'disabled'}}" (click)="removeFile(contextmenu.get('item'))">Remove</button>
              </div>
          </div>
      </contextmenu>
  </div>
  `,
  styles : [css]
})
export class FilesListComponent {
  @Output() onGoToFolder : EventEmitter<string> = new EventEmitter();
  @Output() onDownloadFile : EventEmitter<StorageFile> = new EventEmitter();
  @Output() onRemoveFile : EventEmitter<StorageFile> = new EventEmitter();

  selectedFiles : StorageFile[] = [];
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
      if (e.keyCode === 17) this.multipleChoice = true;
      //enter - choice
      if (e.keyCode === 13 && this.selectedFiles.length === 1)
        this.dbClickFile(this.selectedFiles[0]);
      //arrowdown
      if (e.keyCode === 40) {
        let index = this.selectedFiles.length ? this.files.findIndex(f => f.id === this.selectedFiles[this.selectedFiles.length-1].id) : -1;
        let nextFileIndex = index + 1 <= this.files.length-1 ? index + 1 : this.files.length - 1;
        this.multipleChoice = false;
        this.selectFile(this.files[nextFileIndex]);
      }
      //arrowup
      if (e.keyCode === 38) {
        let index = this.selectedFiles.length ? this.files.findIndex(f => f.id === this.selectedFiles[this.selectedFiles.length-1].id) : this.files.length - 1;
        let nextFileIndex = index - 1;
        let file = nextFileIndex < 0 ? this.previousFolder || this.files[0] : this.files[nextFileIndex];
        this.selectFile(file);
        this.multipleChoice = false;
      }
    };
  }

  isSelected(file : StorageFile) : boolean {
    return !!this.selectedFiles.find(f => f.id === file.id);
  }

  selectFile(file : StorageFile) {
    if (this.previousFolder && this.previousFolder.id === file.id) this.multipleChoice = false;
    if (this.multipleChoice) {
      let index = this.selectedFiles.findIndex(f => f.id === file.id);
      if (index > 0) this.selectedFiles.splice(index, 1);
      else this.selectedFiles.push(file);
    } else {
      this.selectedFiles = [file];
    }
  }

  dbClickFile(file : StorageFile) {
    if (file.folder) this.onGoToFolder.emit(file.id);
    else this.showInfo(file);
    this.reset();
  }

  showInfo(file : StorageFile) {
    return alert(JSON.stringify(file));
  }

  downloadFile(file : StorageFile) {
    file.locked = true;
    this.onDownloadFile.emit(file);
    this.reset();
  }

  removeFile(file : StorageFile) {
    this.onRemoveFile.emit(file);
    this.reset();
  }

  reset() {
    this.selectedFiles = [];
  }

}