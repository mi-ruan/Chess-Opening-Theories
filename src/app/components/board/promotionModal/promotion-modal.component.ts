import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-promotion-modal",
  templateUrl: "./promotion-modal.component.html"
})
export class PromotionModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {color: string}) {
  }
}
