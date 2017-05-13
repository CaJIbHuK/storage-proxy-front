import {Component, Input, Inject, OnInit, OnChanges} from "@angular/core";
import {Router, ActivatedRoute, Params} from '@angular/router';
import css from "./googleFiles.component.css!text";

@Component({
  selector : 'google-files',
  template : `
      <div class="google-files">
          <files [storage]="'google'" [currentFolderId]="currentFolderId"></files>
      </div>
  `,
  styles : [css]
})
export class GoogleFilesComponent implements OnChanges {

  currentFolderId : string;

  constructor(@Inject(ActivatedRoute) private route : ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentFolderId = params['id'];
    });
  }

}