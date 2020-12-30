import { aeco } from "./a-eco";
import { beco } from "./b-eco";
import { ceco } from "./c-eco";
import { deco } from "./d-eco";
import { eeco } from "./e-eco";

export const masterList = aeco.concat(beco, ceco, deco, eeco);

export interface ECO {
  eco: string;
  name: string;
  fen: string;
  moves: string;
}
