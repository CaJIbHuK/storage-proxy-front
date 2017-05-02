import {Component, Input, Inject, OnInit} from "@angular/core";
import {IStorageService, StorageFile} from "app/common/models/storage.models";
import {GoogleStorageService} from "app/common/services/index";
import css from "./files.component.css!text";

@Component({
  selector : 'files',
  template : `
    <div class="files">
      <files-path *ngIf="currentFolder" [folders]="currentPathFolders" (onGoToFolder)="goToFolder($event)"></files-path>
      <files-list *ngIf="currentFolder" 
                  [folder]="currentFolder" 
                  [previousFolder]="previousFolder" 
                  [files]="files" 
                  (onGoToFolder)="goToFolder($event)"
                  (onDownloadFile)="downloadFile($event)"
      >
      </files-list>
    </div>
  `,
  styles : [css]
})
export class FilesComponent implements OnInit {
  @Input() storage : string;
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
    this.storageService.getFileInfo(id)
      .then(folder => {this.currentFolder = folder})
      .then(() => this.reloadFiles())
      .then(() => this.refreshPathFolders())
      .then(() => this.reloadPreviousFolder());
  }

  downloadFile(id : string) {
    this.storageService.downloadFile(id);
  }

}
