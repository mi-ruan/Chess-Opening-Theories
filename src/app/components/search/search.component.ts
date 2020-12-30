import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { masterList } from "../../../resources/master-list";


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

  ngOnInit(): void {
    this.searchResult.valueChanges.subscribe(value => {
      if (value.length < 2) {
        this.filteredList = [];
        this.noFilteredResult = false; 
        return;
      }
      this.filteredList = masterList.filter(list => list.name.toLowerCase().startsWith(value));
      this.noFilteredResult = this.filteredList.length === 0;
    })
  }
}
