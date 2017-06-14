import {Component, Input, Inject, OnInit, EventEmitter, Output, ViewChild, Renderer} from "@angular/core";
import {StorageFile} from "app/common/models/storage.models";
import css from "./filesList.component.css!text";
import {createUrlResolverWithoutPackagePrefix} from "@angular/compiler";


@Component({
  selector : 'files-list',
  template : `<div class="files-list">
    <div class="row table-header">
        <div class="col-md-1 btn-group create-menu">
            <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Create
            </button>
            <div class="dropdown-menu">
                <button class="dropdown-item btn btn-link" (click)="createFolder()">New folder</button>
                <button class="dropdown-item btn btn-link" (click)="uploadFiles()">Upload files</button>
            </div>
        </div>
        <div class="col-md-5 file-field file-field-name">Filename</div>
        <div class="col-md-2 file-field file-field-size">Size</div>
        <div class="col-md-2 file-field file-field-updated">Updated</div>
        <div class="col-md-1 file-field file-field-encrypted">Encrypted</div>
    </div>
    <div #tableBody class="table-body">
        <div *ngIf="previousFolder" class="row file" [ngClass]="{selected : isSelected(previousFolder)}" (click)="selectFile(previousFolder)" (dblclick)="onGoToFolder.emit(previousFolder.id)">
            <div class="col-md-1 file-field file-field-logo"><i class="fa fa-folder" aria-hidden="true"></i></div>
            <div class="col-md-5 file-field file-field-name">..</div>
            <div class="col-md-2 file-field file-field-size">-</div>
            <div class="col-md-2 file-field file-field-updated">-</div>
            <div class="col-md-1 file-field file-field-encrypted">-</div>
        </div>
        <div *ngFor="let file of files" class="row file" [contextmenu]="[contextmenu, {item: file}]" [ngClass]="{selected : isSelected(file)}" (contextmenu)="contextMenu(file)" (click)="selectFile(file)" (dblclick)="dbClickFile(file)">
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
                  <button class="dropdown-item" *ngIf="!multipleChoice" (click)="editFile(contextmenu.get('item'))">Show Info</button>
                  <button class="dropdown-item {{contextmenu.get('item.locked') && 'disabled'}}" (click)="downloadFiles(selectedFiles)">Download</button>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item {{contextmenu.get('item.locked') && 'disabled'}}" (click)="removeFiles(selectedFiles)">Remove</button>
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
  @Output() onRemoveFiles : EventEmitter<StorageFile[]> = new EventEmitter();
  @Output() onEditFile : EventEmitter<StorageFile> = new EventEmitter();
  @Output() onUploadFiles : EventEmitter<boolean> = new EventEmitter();

  @Input() folder : StorageFile;
  @Input() previousFolder : StorageFile = null;
  @Input() files : StorageFile[] = [];

  @ViewChild('tableBody') filesTable;

  selectedFiles : StorageFile[] = [];
  multipleChoice : boolean = false;

  constructor() {
    this.setupKeyEvents();
  }

  setupKeyEvents() {
    window.onkeyup = (e) => {
      //shift and ctrl keys up
      if ([16, 17].indexOf(e.keyCode) > 0 && !(e.shiftKey || e.ctrlKey)) this.multipleChoice = false
    };
    window.onkeydown = (e) => {
      //ctrl for multiselect
      if (e.shiftKey || e.ctrlKey) this.multipleChoice = true;
      //enter - choice
      if (e.keyCode === 13 && this.selectedFiles.length === 1)
        this.dbClickFile(this.selectedFiles[0]);
      //arrowdown
      if (e.keyCode === 40) {
        let index = this.selectedFiles.length ? this.files.findIndex(f => f.id === this.selectedFiles[this.selectedFiles.length-1].id) : -1;
        let nextFileIndex = index + 1 <= this.files.length-1 ? index + 1 : this.files.length - 1;
        if (this.isSelected(this.files[nextFileIndex])) nextFileIndex = index;
        this.multipleChoice = e.shiftKey;
        this.selectFile(this.files[nextFileIndex]);
      }
      //arrowup
      if (e.keyCode === 38) {
        let index = this.selectedFiles.length ? this.files.findIndex(f => f.id === this.selectedFiles[this.selectedFiles.length-1].id) : this.files.length - 1;
        let nextFileIndex = index - 1;
        if (nextFileIndex >= 0 && this.isSelected(this.files[nextFileIndex])) nextFileIndex = index;
        let file = nextFileIndex < 0 ? this.previousFolder || this.files[0] : this.files[nextFileIndex];
        this.multipleChoice = e.shiftKey;
        this.selectFile(file);
      }
      //delete
      if (e.keyCode === 46) {
        this.removeFiles(this.selectedFiles)
      }
    };
  }

  contextMenu(file : StorageFile) {
    if (!this.isSelected(file)) this.selectFile(file);
  }

  isSelected(file : StorageFile) : boolean {
    return !!this.selectedFiles.find(f => f.id === file.id);
  }

  selectFile(file : StorageFile) {
    if (this.previousFolder && this.previousFolder.id === file.id) this.multipleChoice = false;
    if (this.multipleChoice) {
      let index = this.selectedFiles.findIndex(f => f.id === file.id);
      if (index > -1) this.selectedFiles.splice(index, 1);
      else this.selectedFiles.push(file);
    } else {
      this.selectedFiles = [file];
    }
  }

  dbClickFile(file : StorageFile) {
    if (file.folder) this.onGoToFolder.emit(file.id);
    else this.editFile(file);
    this.reset();
  }

  editFile(file : StorageFile) {
    this.onEditFile.emit(file);
  }

  createFolder() {
    this.onEditFile.emit(new StorageFile({folder : true, parents : [this.folder.id]}));
  }

  uploadFiles() {
    this.onUploadFiles.emit(true);
  }

  downloadFiles(files : StorageFile[]) {
    files.map(file => {
      file.locked = true;
      this.onDownloadFile.emit(file)
    });

    this.reset();
  }

  removeFiles(files : StorageFile[]) {
    this.onRemoveFiles.emit(files);
    this.reset();
  }

  reset() {
    this.selectedFiles = [];
  }

}