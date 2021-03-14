import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: "root"})
export class OptionsService {
  showCoord = new BehaviorSubject<boolean>(false);

  initPos!: string;
  destPos!: string;

  updateShowCoord(value: boolean): void {
    this.showCoord.next(value);
  }
}
