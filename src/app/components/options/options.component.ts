import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { OptionsService } from "../../services/options.service";
import { distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OptionsComponent implements OnInit {
  showCoord = new FormControl(false);
  showPercent = new FormControl(false);
  showSpace = new FormControl(false);

  constructor(private optionsService: OptionsService) {}

  ngOnInit() {
    this.optionsService.showCoord.subscribe(value => this.showCoord.setValue(value));
    this.showCoord.valueChanges.pipe(distinctUntilChanged()).subscribe(value => this.optionsService.updateShowCoord(value));
    this.optionsService.showPercent.subscribe(value => this.showPercent.setValue(value));
    this.showPercent.valueChanges.pipe(distinctUntilChanged()).subscribe(value => this.optionsService.updateShowPercent(value));
    this.optionsService.showSpace.subscribe(value => this.showSpace.setValue(value));
    this.showSpace.valueChanges.pipe(distinctUntilChanged()).subscribe(value => this.optionsService.updateShowSpace(value));
  }
}
