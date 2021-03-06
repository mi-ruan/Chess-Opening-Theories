import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { filter, distinctUntilChanged } from "rxjs/operators";

import { ECO } from "../../../resources/master-list";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
  opening!: ECO;

  moves: Array<string> = [];

  constructor(private router: Router) {
    const data = this.router.getCurrentNavigation().extras.state?.data;
    this.opening = data || undefined;
  }
  
  ngOnInit(): void {
    this.router.events.pipe(
      filter((event: NavigationEnd) => event instanceof NavigationEnd),
      distinctUntilChanged()
    ).subscribe(() => {
      this.opening = this.router.getCurrentNavigation().extras.state?.data;
    });
  }

  handleMoves(moves: Array<string>): void {
    this.moves = moves;
  }
}
