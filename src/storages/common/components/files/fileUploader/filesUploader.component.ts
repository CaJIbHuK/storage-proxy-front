import {Component, Input, Inject, EventEmitter, Output} from "@angular/core";
import FileUploadModule from 'ng2-file-upload';
import {StorageFile} from "app/common/models/storage.models";
import css from "./filesUploader.component.css!text";

@Component({
  selector : 'files-uploader',
  template : `<div class="files-uploader">

    <div class="row files-uploader-header">
        <h4>Upload files</h4>
        <input type="file" ng2FileSelect [uploader]="uploader" multiple/>
    </div>
    <p>Queue length: {{ uploader?.queue?.length }}</p>

    <div class="row files-uploader-body">
        <div class="col-md-6 upload-files-drop-zone" ng2FileDrop
             [ngClass]="{'nv-file-over': overDropZone}"
             (fileOver)="fileOverDropZone($event)"
             [uploader]="uploader">
            Drop files here
        </div>
        <div class="col-md-6 upload-files-table">
            <div class="row upload-files-table-header">
                <div class="col-md-6">Name</div>
                <div class="col-md-2">Status</div>
                <div class="col-md">Actions</div>
            </div>
            <div class="upload-files-table-body">
                <div *ngFor="let item of uploader.queue" class="row">
                    <div class="col-md-6 upload-file-name">{{ item?.file?.name }}</div>
                    <div class="col-md-2 upload-file-status">
                        <span *ngIf="item.isSuccess"><i class="fa fa-check-circle-o" aria-hidden="true"></i></span>
                        <span *ngIf="item.isError"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span>
                    </div>
                    <div class="col-md upload-file-actions">
                        <span (click)="item.upload()"><i class="fa fa-upload" aria-hidden="true"></i></span>
                        <span (click)="item.remove()"><i class="fa fa-times" aria-hidden="true"></i></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="files-uploader-footer">
        <button type="button" class="btn btn-success btn-s"
                (click)="uploader.uploadAll()" [disabled]="!uploader.getNotUploadedItems().length">
            <span class="glyphicon glyphicon-upload"></span> Upload all
        </button>
        <button type="button" class="btn btn-warning btn-s"
                (click)="uploader.cancelAll()" [disabled]="!uploader.isUploading">
            <span class="glyphicon glyphicon-ban-circle"></span> Cancel all
        </button>
        <button type="button" class="btn btn-danger btn-s"
                (click)="uploader.clearQueue()" [disabled]="!uploader.queue.length">
            <span class="glyphicon glyphicon-trash"></span> Remove all
        </button>
    </div>

</div>
  `,
  styles : [css]
})
export class FilesUploaderComponent {
  uploader : FileUploadModule.FileUploader = new FileUploadModule.FileUploader({});
  overDropZone : boolean = false;

  constructor() {
  }

  public fileOverDropZone(event) {
    this.overDropZone = event;
  }

}