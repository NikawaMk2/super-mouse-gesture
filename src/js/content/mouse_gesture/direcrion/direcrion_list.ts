import Logger from '../../../common/util/logger';
import { Direction } from './direction';

export default class DirectionList {
    direcrionList: Direction[];

    constructor(direcrionList: Direction[]) {
        if(this.hasMultiValueConsecutively(direcrionList)) {
            throw new Error(`同一の値が連続しています ${direcrionList.join(', ')}`);
        }
        
        this.direcrionList = direcrionList;
    }

    pushNewDirection(direcrion: Direction): void {
        if(this.direcrionList.length > 0 && this.direcrionList[this.direcrionList.length - 1] === direcrion) {
            return;
        }

        this.direcrionList.push(direcrion);

        Logger.debug(`DirectionListの要素追加 ${direcrion}`)
    }

    toString(): string {
        return `[${this.direcrionList.join(', ')}]`;
    }
    
    equals(other: DirectionList): boolean {
        Logger.debug(`DirectionListの比較 ${this.toString()} === ${other.toString()}`)

        if(this.direcrionList.length !== other.direcrionList.length) {
            return false;
        }

        for(let i = 0; i < this.direcrionList.length; i++) {
            if(this.direcrionList[i] !== other.direcrionList[i]) {
                return false;
            }
        }

        return true
    }

    private hasMultiValueConsecutively(direcrionList: Direction[]): boolean {
        for (let i = 0; i < direcrionList.length - 1; i++) {
            if (direcrionList[i] === direcrionList[i + 1]) {
                return true;
            }
        }

        return false;
    }
}