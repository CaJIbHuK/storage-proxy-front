import {Component, Input, Inject, OnInit} from "@angular/core";
import css from "./googleFiles.component.css!text";

@Component({
  selector : 'google-files',
  template : `
      <div class="google-files">
          <files [storage]="'google'"></files>
      </div>
  `,
  styles : [css]
})
export class GoogleFilesComponent {}
