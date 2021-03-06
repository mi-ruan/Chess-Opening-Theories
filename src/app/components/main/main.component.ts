import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Observable } from "rxjs";

import { filter, distinctUntilChanged } from "rxjs/operators";
import { InfoService } from "src/app/services/info.service";

import { ECO } from "../../../resources/master-list";
import { MoveTableService } from "../movesTable/moves-table.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
  opening!: ECO;

  moves!: Observable<Array<string>>;

  constructor(private router: Router, private moveTable: MoveTableService, private infoService: InfoService) {
    const data = this.router.getCurrentNavigation().extras.state?.data;
    this.opening = data || undefined;
    this.infoService.setCurrentOpening(this.opening);
    this.moves = this.moveTable.moves;
  }
  
  ngOnInit(): void {
    this.router.events.pipe(
      filter((event: NavigationEnd) => event instanceof NavigationEnd),
      distinctUntilChanged()
    ).subscribe(() => {
      this.opening = this.router.getCurrentNavigation().extras.state?.data;
      this.infoService.setCurrentOpening(this.opening);
    });
  }
}
