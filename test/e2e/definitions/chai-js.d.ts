///<reference types="chai" />

import {LanguageChains} from "~chai/lib/Assertion";
import {NumericComparison} from "~chai/lib/Assertion";
import {TypeComparison} from "~chai/lib/Assertion";
declare global {
    namespace Chai {
        interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
            basename(expected: string, message?: string): Assertion;
            dirname(expected: string, message?: string): Assertion;
            extname(expected: string, message?: string): Assertion;
            path(message?: string): Assertion;
            directory(message?: string): Assertion;
            contents(content: string[], message?: string): Assertion;
            files(content: string[], message?: string): Assertion;
            subDirs(content: string[], message?: string): Assertion;
            file(message?: string): Assertion;
        }
    }
}

declare function chaiString(chai: any, utils: any): void;
export = chaiString;
