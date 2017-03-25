import {BowerConfiguration} from "../bowerConfig/BowerConfiguration";

declare interface CommandCBI {
    (config: BowerConfiguration, callback: CallbackDefault): void;
}
