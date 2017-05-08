import {Component, Input, Inject, OnInit} from "@angular/core";
import {IStorageService, StorageFile} from "app/common/models/storage.models";
import SaveAs from "file-saver";
import {GoogleStorageService} from "app/common/services/index";
import css from "./files.component.css!text";

@Component({
  selector : 'files',
  template : `<div class="files">
    <files-path *ngIf="currentFolder" [folders]="currentPathFolders" (onGoToFolder)="goToFolder($event)"></files-path>
    <files-list *ngIf="currentFolder"
                [folder]="currentFolder"
                [previousFolder]="previousFolder"
                [files]="files"
                (onGoToFolder)="goToFolder($event)"
                (onDownloadFile)="downloadFile($event)"
                (onRemoveFile)="removeFile($event)"
                class="{{loading && 'loading'}}"
    >
    </files-list>
    <preloader *ngIf="loading"></preloader>
  </div>
  `,
  styles : [css]
})
export class FilesComponent implements OnInit {
  @Input() storage : string;
  loading : boolean = false;
  storageService : IStorageService = null;
  currentPathFolders : StorageFile[] = [];
  currentFolder : StorageFile = null;
  previousFolder : StorageFile = null;
  files : StorageFile[] = [];

  constructor(@Inject(GoogleStorageService) private google : GoogleStorageService) {}

  ngOnInit() : void {
    if (this.storage === "google") this.storageService = this.google;
    else throw new Error("Invalid storage type");
    this.goToFolder(this.storageService.ROOT_FOLDER);
  }

  reloadPreviousFolder() {
    this.previousFolder = this.currentPathFolders.length >= 2 ? this.currentPathFolders[this.currentPathFolders.length-2] : null;
  }

  reloadFiles() {
    return this.storageService.listFolder(this.currentFolder.id)
      .then(files => this.files = files.sort((f1, f2) => f1.folder ? -1 : 1));
  }

  refreshPathFolders(folder? : StorageFile) {
    if (!folder) {
      folder = this.currentFolder;
      this.currentPathFolders = [folder];
    }
    if (folder.parents && folder.parents.length) {
      return this.storageService.getFileInfo(folder.parents[0])
        .then(parent => {
          this.currentPathFolders = [parent].concat(this.currentPathFolders);
          return this.refreshPathFolders(parent);
        })
    }
  }

  goToFolder(id : string) {
    this.loading = true;
    this.storageService.getFileInfo(id)
      .then(folder => {this.currentFolder = folder})
      .then(() => this.reloadFiles())
      .then(() => this.refreshPathFolders())
      .then(() => this.reloadPreviousFolder())
      .then(() => {this.loading = false})
      .catch(err => {
        console.log(err);
        this.loading = false;
      })
  }

  downloadFile(file : StorageFile) {
    this.storageService.downloadFile(file.id)
      .then(data => SaveAs(data, file.name))
      .then(() => file.locked = false);
  }

  removeFile(file : StorageFile) {
    this.storageService.removeFile(file.id)
      .then(() => this.goToFolder(this.currentFolder.id));
  }

}
