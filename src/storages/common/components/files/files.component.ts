import {Component, Input, Inject, OnInit, OnChanges, SimpleChanges} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {IStorageService, StorageFile} from "app/common/models/storage.models";
import NgbModule, {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FileInfoModalComponent} from "./fileInfo/fileInfo.component";
import SaveAs from "file-saver";
import {GoogleStorageService} from "app/common/services/index";
import css from "./files.component.css!text";

@Component({
  selector : 'files',
  template : `<div class="files">
    <files-path *ngIf="currentFolder" [folders]="currentPathFolders" (onGoToFolder)="goToFolder($event)"></files-path>
    <files-list *ngIf="currentFolder"
                class="{{loading && 'loading'}}"
                [folder]="currentFolder"
                [previousFolder]="previousFolder"
                [files]="files"
                (onGoToFolder)="goToFolder($event)"
                (onDownloadFile)="downloadFile($event)"
                (onRemoveFile)="removeFile($event)"
                (onEditFile)="editFile($event)"
    >
    </files-list> 
    <div id="uploader-collapse" (click)="uploaderIsCollapsed = !uploaderIsCollapsed">
        <i *ngIf="uploaderIsCollapsed" class="fa fa-plus" aria-hidden="true"></i>
        <i *ngIf="!uploaderIsCollapsed" class="fa fa-minus" aria-hidden="true"></i>
        Upload files
    </div>
    <files-uploader  [ngbCollapse]="uploaderIsCollapsed"></files-uploader>
    <preloader *ngIf="loading"></preloader>
  </div>
  `,
  styles : [css]
})
export class FilesComponent implements OnInit {
  @Input() storage : string;
  @Input() currentFolderId : string = null;
  uploaderIsCollapsed : boolean = true;
  loading : boolean = false;
  storageService : IStorageService = null;
  currentPathFolders : StorageFile[] = [];
  currentFolder : StorageFile = null;
  previousFolder : StorageFile = null;
  files : StorageFile[] = [];

  private isInited = false;

  constructor(@Inject(GoogleStorageService) private google : GoogleStorageService,
              @Inject(NgbModule.NgbModal) private modalService : NgbModule.NgbModal,
              @Inject(Router) private router : Router,
              @Inject(ActivatedRoute) private activatedRoute: ActivatedRoute,

  ) {}

  ngOnInit() : void {
    if (this.storage === "google") this.storageService = this.google;
    else throw new Error("Invalid storage type");
    this.reloadFolder(this.currentFolderId || this.storageService.ROOT_FOLDER);
    this.isInited = true;
  }
  ngOnChanges(changes : SimpleChanges) {
    if (!this.isInited) return;
    let folderChanges = changes['currentFolderId'];
    if (folderChanges) this.reloadFolder(folderChanges.currentValue || this.storageService.ROOT_FOLDER);
  }

  goToFolder(id : string) {
    this.router.navigate([`../`,id], {relativeTo : this.activatedRoute});
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

  reloadFolder(id? : string) {
    if (!id) id = this.currentFolderId;
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

  editFile(file :StorageFile) {
    const modalRef : NgbModalRef & {componentInstance : FileInfoModalComponent}  = this.modalService.open(FileInfoModalComponent);
    modalRef.componentInstance.file = file;
    modalRef.result
    //TODO file.locked during update
      .then(save => save && this.storageService.saveFile(file))
      .then(updatedFile => updatedFile && this.reloadFolder());
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
