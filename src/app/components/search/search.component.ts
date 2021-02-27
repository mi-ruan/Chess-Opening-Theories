import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { masterList } from "../../../resources/master-list";
import * as fuzzysort from "fuzzysort";
import { beco } from "../../../resources/b-eco";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  masterList = masterList;

  filteredList = [];
  noFilteredResult = false;

  searchResult = new FormControl();

  private cachedResult = {};
  constructor(private router: Router) {}

  ngOnInit(): void {
    const mapForDupNames = {};
    const mapForDupMoves = {}
    beco.forEach(opening => {
     mapForDupNames[opening.name] ? mapForDupNames[opening.name].push(opening) : mapForDupNames[opening.name] = [opening];
      mapForDupMoves[opening.moves] ? mapForDupMoves[opening.moves].push(opening) : mapForDupMoves[opening.moves] = [opening];
    });

    console.warn(Object.values(mapForDupNames as Record<any, any>).filter(value => value.length > 1));
    // console.warn(Object.values(mapForDupMoves as Record<any, any>).filter(value => value.length > 1));
    // console.warn(mapForDupMoves);

    this.searchResult.valueChanges.pipe(filter(value => value !== undefined)).subscribe(value => {
      if (value.length < 1) {
        this.filteredList = [];
        this.noFilteredResult = false; 
        return;
      }
      if (this.cachedResult[value]) {
        this.filteredList = this.cachedResult[value] 
      } else {
        this.filteredList = fuzzysort.go(value, this.masterList, {keys: ["name"], limit: 100, allowTypo: false, threshold: -1000}).map(search => search.obj);
        this.cachedResult[value] = this.filteredList;
      } 
      this.noFilteredResult = this.filteredList.length === 0;
    });
  }

  navigate(): void {
    const result = this.masterList.find(list => list.name === this.searchResult.value)
    if (result) {
      this.router.navigate(["/main"], {state: {data: result}});
    }
  }
}
