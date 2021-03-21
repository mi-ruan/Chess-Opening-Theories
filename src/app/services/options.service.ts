import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: "root"})
export class OptionsService {
  showCoord = new BehaviorSubject<boolean>(false);
  showPercent = new BehaviorSubject<boolean>(true);

  initPos!: string;
  destPos!: string;

  updateShowCoord(value: boolean): void {
    this.showCoord.next(value);
  }

  updateShowPercent(value: boolean): void {
    this.showPercent.next(value);
  }
}
