import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tmforumAdmin',
  templateUrl: './tmforumAdmin.component.html',
  styleUrls: ['./tmforumAdmin.component.css']
})
export class TMForumAdminComponent {

    constructor(public router: Router) {
      this.router.navigateByUrl('/main/tmforumadmin/organizationadmin');
    }
}