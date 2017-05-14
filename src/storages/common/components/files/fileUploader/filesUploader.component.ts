import {Component, Input, Inject, EventEmitter, Output, OnInit} from "@angular/core";
import {StorageFile} from "app/common/models/storage.models";
import {IStorageService} from "app/common/models/index";
import FileUploadModule from 'ng2-file-upload';
import css from "./filesUploader.component.css!text";

@Component({
  selector : 'files-uploader',
  template : `
      <div class="files-uploader">

          <div class="row files-uploader-header">
              <h4>Upload files</h4>
              <input type="file" ng2FileSelect [uploader]="uploader" multiple/>
          </div>
          <p>Queue length: {{ uploader?.queue?.length }}</p>

          <div class="row files-uploader-body">
              <div class="col-md-4 upload-files-drop-zone" ng2FileDrop
                   [ngClass]="{'nv-file-over': overDropZone}"
                   (fileOver)="fileOverDropZone($event)"
                   [uploader]="uploader">
                  Drop files here
              </div>
              <div class="col-md-8 upload-files-table">
                  <div class="row upload-files-table-header">
                      <div class="col-md-8">Name</div>
                      <div class="col-md-1 upload-files-table-field">Encrypt</div>
                      <div class="col-md-1 upload-files-table-field">Status</div>
                      <div class="col-md-1 upload-files-table-field">Actions</div>
                  </div>
                  <div class="upload-files-table-body">
                      <div *ngFor="let item of uploader.queue" class="row">
                          <div class="col-md-8 upload-file-name">{{ item?.file?.name }}</div>
                          <div class="col-md-1 upload-files-table-field"><input type="checkbox" name="encrypted" [(ngModel)]="item.encrypt"></div>
                          <div class="col-md-1 upload-files-table-field upload-file-status">
                              <span *ngIf="item.isUploading" class="file-preloader"><preloader></preloader></span>
                              <span *ngIf="item.isError"><i class="fa fa-exclamation-circle"
                                                            aria-hidden="true"></i></span>
                          </div>
                          <div class="col-md-1 upload-files-table-field upload-file-actions">
                              <span class="upload-file-action" (click)="uploadFile(item)" *ngIf="!item.isUploading"><i
                                      class="fa fa-upload" aria-hidden="true"></i></span>
                              <span class="upload-file-action" (click)="item.remove()" *ngIf="!item.isUploading"><i
                                      class="fa fa-times" aria-hidden="true"></i></span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div class="files-uploader-footer">
              <button type="button" class="btn btn-success btn-s"
                      (click)="uploadAll()" [disabled]="!uploader.getNotUploadedItems().length">
                  <i class="fa fa-upload" aria-hidden="true"></i> Upload all
              </button>
              <button type="button" class="btn btn-danger btn-s"
                      (click)="uploader.clearQueue()" [disabled]="!uploader.queue.length">
                  <i class="fa fa-times" aria-hidden="true"></i> Remove all
              </button>
          </div>

      </div>
  `,
  styles : [css]
})
export class FilesUploaderComponent implements OnInit {
  @Input() storageService : IStorageService;
  @Input() folderId : string;
  @Output() onFileUploaded : EventEmitter<string> = new EventEmitter();
  @Output() onUploadFinish : EventEmitter<boolean> = new EventEmitter();

  uploader : FileUploadModule.FileUploader = new FileUploadModule.FileUploader({});
  overDropZone : boolean = false;

  constructor() {
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => file.encrypt = true;
  }

  fileOverDropZone(event) {
    this.overDropZone = event;
  }

  beforeUploading(file : FileUploadModule.FileItem) {
    file.isUploading = true;
    file.isError = false;
  }

  successfulUploading(file : FileUploadModule.FileItem) {
    file.isUploading = false;
    file.isSuccess = true;
    file.remove();
  }

  failedUploading(file : FileUploadModule.FileItem) {
    file.isUploading = false;
    file.isError = true;
  }

  upload(file : FileUploadModule.FileItem) {
    this.beforeUploading(file);
    let storageFile = new StorageFile({
      name : file.file.name,
      mimeType : file.file.type,
      parents : [this.folderId],
      encrypted : file.encrypt || false
    });
    return this.storageService.createAndUploadFile(storageFile, file._file)
      .then(storageFile => this.onFileUploaded.emit(storageFile.id))
      .then(() => this.successfulUploading(file))
      .then(() => this.onUploadFinish.emit(true))
      .catch(err => {
        console.error(err);
        this.failedUploading(file)
      })
  }

  uploadAll() {
    Promise.all(this.uploader.queue.map(file => this.upload(file)))
      .then(() => this.onUploadFinish.emit(true))
  }

  uploadFile(file : FileUploadModule.FileItem) {
    this.upload(file).catch(err => console.error(err));
  }

}