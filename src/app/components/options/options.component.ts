import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { OptionsService } from "./options.service";

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OptionsComponent implements OnInit {
  showCoord = new FormControl(false);

  constructor(private optionsService: OptionsService) {}

  ngOnInit() {
    this.showCoord.setValue(this.optionsService.showCoord.value);
    this.showCoord.valueChanges.subscribe(value => this.optionsService.updateShowCoord(value));
  }
}
