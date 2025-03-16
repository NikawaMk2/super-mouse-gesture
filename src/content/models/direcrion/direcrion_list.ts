import Logger from '../../../common/utils/logger';
import { Direction, DirectionType } from './direction';
import DirectionConverter from './direction_converter';

export default class DirectionList {
    direcrionList: DirectionType[];

    constructor(direcrionTextList: string[]) {
        const direcrionList = direcrionTextList.map(x => DirectionConverter.convert(x));
        if(this.hasMultiValueConsecutively(direcrionList)) {
            throw new Error(`同一の値が連続しています ${direcrionList.join(', ')}`);
        }
        
        if(direcrionList.some(x => x === Direction.None)) {
            throw new Error(`Direction.Noneが含まれています ${direcrionList.join(', ')}`);
        }

        this.direcrionList = direcrionList;
    }

    pushNewDirection(direcrion: DirectionType): void {
        if(direcrion === Direction.None) {
        Logger.debug(`Direction.Noneが含まれるため、要素追加しない`)
            return;
        }

        if(this.direcrionList.length > 0 && this.direcrionList[this.direcrionList.length - 1] === direcrion) {
            return;
        }

        this.direcrionList.push(direcrion);

        Logger.debug(`DirectionListの要素追加 "${direcrion}", 追加後: ${this.toString()}`)
    }

    clear(): void {
        this.direcrionList = [];
    }

    toString(): string {
        return `[${this.direcrionList.join(', ')}]`;
    }
    
    equals(other: DirectionList): boolean {
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

    private hasMultiValueConsecutively(direcrionList: string[]): boolean {
        for (let i = 0; i < direcrionList.length - 1; i++) {
            if (direcrionList[i] === direcrionList[i + 1]) {
                return true;
            }
        }

        return false;
    }
}