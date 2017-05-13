import {Component, Input, Inject, OnInit} from '@angular/core';
import {StorageFile} from "app/common/models/index";
import NgbModule from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'file-info-modal',
  template: `
      <div class="modal-header">
          <h4 class="modal-title">{{file.id ? 'Edit' : 'New' }} {{file.folder ? 'folder' : 'file'}}</h4>
          <button type="button" class="close" aria-label="Close" (click)="cancel()">
              <span aria-hidden="true">&times;</span>
          </button>
      </div>
      <div class="modal-body">
          <form #form="ngForm">
              <div class="form-group row">
                  <label class="col-sm-2 col-form-label" for="name">Name</label>
                  <div class="col-sm-10">
                      <input type="text" class="form-control" id="name" name="name" required [(ngModel)]="file.name">
                  </div>
              </div>
              <div class="form-group row">
                  <label class="col-sm-2">Encrypt</label>
                  <div class="col-sm-10">
                      <div class="form-check">
                          <label class="form-check-label">
                              <input class="form-check-input" type="checkbox" name="encrypted" [(ngModel)]="file.encrypted">
                          </label>
                      </div>
                  </div>
              </div>
          </form>
      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-success" (click)="save()">Save</button>
          <button type="button" class="btn btn-secondary" (click)="cancel()">Close</button>
      </div>
  `
})
export class FileInfoModalComponent implements OnInit {
  @Input() file : StorageFile;
  loading : boolean = false;

  constructor(@Inject(NgbModule.NgbActiveModal) public activeModal: NgbModule.NgbActiveModal) {}

  ngOnInit() {}

  cancel() {
    this.activeModal.close(false)
  }

  save() {
    this.activeModal.close(true);
  }

}