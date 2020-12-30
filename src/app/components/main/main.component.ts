import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { filter, distinctUntilChanged } from "rxjs/operators";

import { ECO } from "../../../resources/master-list";

@Component({
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
  opening!: ECO;

  constructor(private router: Router) {
    this.opening = this.router.getCurrentNavigation().extras.state?.data;
  }
  
  ngOnInit(): void {
    this.router.events.pipe(
      filter((event: NavigationEnd) => event instanceof NavigationEnd),
      distinctUntilChanged()
    ).subscribe(() => {
      this.opening = this.router.getCurrentNavigation().extras.state?.data;
    });


  }
}