import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: "root"})
export class OptionsService {
  showCoord = new BehaviorSubject<boolean>(false);
  showPercent = new BehaviorSubject<boolean>(true);
  showSpace = new BehaviorSubject<boolean>(false);

  initPos!: string;
  destPos!: string;

  updateShowCoord(value: boolean): void {
    this.showCoord.next(value);
  }

  updateShowPercent(value: boolean): void {
    this.showPercent.next(value);
    if (this.showSpace.value) this.showSpace.next(!value);
  }

  updateShowSpace(value: boolean): void {
    this.showSpace.next(value);
    if (this.showPercent.value) this.showPercent.next(!value);
  }
}
